/**
 * Centralized Shared HTTP API Client
 *
 * Single transport layer for all backend REST communication:
 * - Reads base URL from environment configuration (`config.apiBaseUrl`)
 * - Injects `Authorization: Bearer <token>` from centralized in-memory `authSession`
 * - Parses standard backend `ApiResponse<T>` envelopes & validates `success`
 * - Preserves HTTP status codes, backend messages, and field-level validation errors
 * - Single-flight automatic token refresh on 401 with refresh-token rotation
 * - Retries original request at most once after refresh; prevents refresh loops
 * - Treats 403 as a permission error without clearing the session
 */

import { config } from '../config/env';
import type { ApiResponse, QueryParamValue, RequestOptions } from '../types/api/common.types';
import type { RefreshTokenResponse } from '../types/api/auth.types';
import { AUTH_ENDPOINTS } from './endpoints';
import { authSession } from './authSession';

export class ApiError extends Error {
  public readonly status: number;
  public readonly errors: Record<string, string[]> | null;
  public readonly data: unknown;
  public readonly isNetworkError: boolean;

  constructor(
    message: string,
    status: number = 0,
    errors: Record<string, string[]> | null = null,
    data: unknown = null,
    isNetworkError: boolean = false
  ) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.errors = errors;
    this.data = data;
    this.isNetworkError = isNetworkError;
    Object.setPrototypeOf(this, ApiError.prototype);
  }

  /**
   * Case-insensitively retrieves backend validation errors for a field name or nested path
   * (e.g. "name", "StartDate", "levels[0].toCredits").
   */
  public getFieldErrors(fieldName: string): string[] {
    if (!this.errors) return [];
    const target = fieldName.toLowerCase();
    const collected: string[] = [];

    for (const [key, messages] of Object.entries(this.errors)) {
      const normalizedKey = key.toLowerCase();
      if (
        normalizedKey === target ||
        normalizedKey.endsWith(`.${target}`) ||
        normalizedKey.replace(/^\$\./, '') === target
      ) {
        collected.push(...messages);
      }
    }
    return collected;
  }

  /** Returns all validation error messages flattened for banner summaries */
  public getAllValidationMessages(): string[] {
    if (!this.errors) return [];
    return Object.values(this.errors).flat();
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function extractValidationErrors(payload: unknown): Record<string, string[]> | null {
  if (!isRecord(payload)) return null;
  const rawErrors = payload.errors;
  if (!isRecord(rawErrors)) return null;

  const normalized: Record<string, string[]> = {};
  for (const [key, val] of Object.entries(rawErrors)) {
    if (Array.isArray(val)) {
      const msgs = val.filter((item): item is string => typeof item === 'string');
      if (msgs.length > 0) normalized[key] = msgs;
    } else if (typeof val === 'string') {
      normalized[key] = [val];
    }
  }
  return Object.keys(normalized).length > 0 ? normalized : null;
}

function extractErrorMessage(payload: unknown, status: number): string {
  if (isRecord(payload)) {
    if (typeof payload.message === 'string' && payload.message.trim()) {
      return payload.message;
    }
    if (typeof payload.title === 'string' && payload.title.trim()) {
      return payload.title;
    }
    if (typeof payload.detail === 'string' && payload.detail.trim()) {
      return payload.detail;
    }
  }

  switch (status) {
    case 400:
      return 'Invalid request. Please check your input and try again.';
    case 401:
      return 'Authentication required. Please sign in again.';
    case 403:
      return 'You do not have permission to perform this action.';
    case 404:
      return 'The requested resource was not found.';
    case 409:
      return 'A conflict occurred with existing records.';
    case 422:
      return 'The request could not be processed due to business rules.';
    case 500:
      return 'An unexpected server error occurred. Please try again later.';
    default:
      return `Request failed with status ${status}.`;
  }
}

function isApiEnvelope<T>(payload: unknown): payload is ApiResponse<T> {
  return isRecord(payload) && typeof payload.success === 'boolean' && 'data' in payload;
}

const NON_REFRESHABLE_PATHS = new Set<string>([
  AUTH_ENDPOINTS.LOGIN,
  AUTH_ENDPOINTS.REFRESH,
  AUTH_ENDPOINTS.FORGOT_PASSWORD,
  AUTH_ENDPOINTS.VERIFY_RESET_TOKEN,
  AUTH_ENDPOINTS.RESET_PASSWORD,
]);

interface InternalRequestOptions extends RequestOptions {
  _retried?: boolean;
}

export class ApiClient {
  private baseUrl: string;
  /** Single-flight lock so concurrent 401s trigger only ONE /auth/refresh call */
  private refreshPromise: Promise<boolean> | null = null;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl.replace(/\/+$/, '');
  }

  public setBaseUrl(url: string): void {
    this.baseUrl = url.replace(/\/+$/, '');
  }

  public getBaseUrl(): string {
    return this.baseUrl;
  }

  private isRefreshExcluded(endpoint: string): boolean {
    const cleanPath = `/${endpoint.split('?')[0].replace(/^\/+/, '')}`.toLowerCase();
    return NON_REFRESHABLE_PATHS.has(cleanPath);
  }

  private buildUrl(endpoint: string, params?: Record<string, QueryParamValue>): string {
    let url = endpoint.startsWith('http://') || endpoint.startsWith('https://')
      ? endpoint
      : `${this.baseUrl}/${endpoint.replace(/^\/+/, '')}`;

    if (params) {
      const searchParams = new URLSearchParams();
      for (const [key, val] of Object.entries(params)) {
        if (val !== undefined && val !== null && val !== '') {
          searchParams.append(key, String(val));
        }
      }
      const qs = searchParams.toString();
      if (qs) {
        url += (url.includes('?') ? '&' : '?') + qs;
      }
    }

    return url;
  }

  /**
   * Executes a single-flight token refresh with token rotation.
   * Multiple concurrent callers share the same in-flight promise.
   */
  private async refreshAccessToken(): Promise<boolean> {
    if (this.refreshPromise) {
      return this.refreshPromise;
    }

    const currentAccessToken = authSession.getAccessToken();
    const currentRefreshToken = authSession.getRefreshToken();

    if (!currentAccessToken || !currentRefreshToken) {
      return false;
    }

    this.refreshPromise = (async (): Promise<boolean> => {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), config.requestTimeoutMs);

      try {
        const url = this.buildUrl(AUTH_ENDPOINTS.REFRESH);
        const refreshHeaders = new Headers({
          Accept: 'application/json',
          'Content-Type': 'application/json',
        });
        const response = await fetch(url, {
          method: 'POST',
          headers: refreshHeaders,
          body: JSON.stringify({
            accessToken: currentAccessToken,
            refreshToken: currentRefreshToken,
          }),
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          return false;
        }

        const parsed: unknown = await response.json().catch(() => null);
        if (!isApiEnvelope<RefreshTokenResponse>(parsed) || !parsed.success || !parsed.data) {
          return false;
        }

        const { token, refreshToken, expiresAt } = parsed.data;
        if (!token || !refreshToken) {
          return false;
        }

        // Rotate BOTH tokens atomically in memory
        authSession.updateTokens({ token, refreshToken, expiresAt });
        return true;
      } catch {
        clearTimeout(timeoutId);
        return false;
      } finally {
        this.refreshPromise = null;
      }
    })();

    return this.refreshPromise;
  }

  private handleSessionExpired(): void {
    authSession.clear();
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('fcai:unauthorized'));
    }
  }

  /**
   * Core HTTP dispatcher returning the full backend ApiResponse<T> envelope.
   */
  public async requestEnvelope<T>(
    endpoint: string,
    options: InternalRequestOptions = {}
  ): Promise<ApiResponse<T>> {
    const {
      params,
      timeoutMs = config.requestTimeoutMs,
      headers: customHeaders,
      skipAuth = false,
      skipAuthRefresh = false,
      _retried = false,
      ...fetchOptions
    } = options;

    const url = this.buildUrl(endpoint, params);
    const method = (fetchOptions.method || 'GET').toUpperCase();

    const headers = new Headers(customHeaders);
    if (!headers.has('Accept')) {
      headers.set('Accept', 'application/json');
    }

    if (!skipAuth) {
      const token = authSession.getAccessToken();
      if (token && !headers.has('Authorization')) {
        headers.set('Authorization', `Bearer ${token}`);
      }
    }

    const isFormData = typeof FormData !== 'undefined' && fetchOptions.body instanceof FormData;
    if (!isFormData && fetchOptions.body !== undefined && !headers.has('Content-Type')) {
      headers.set('Content-Type', 'application/json');
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

    if (config.enableApiLogging) {
      console.info(`[API] ${method} ${url}`);
    }

    try {
      const response = await fetch(url, {
        ...fetchOptions,
        method,
        headers,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (config.enableApiLogging) {
        console.info(`[API] ${method} ${url} -> ${response.status}`);
      }

      // Parse response payload safely
      let parsed: unknown = null;
      const contentType = response.headers.get('content-type') || '';
      if (response.status !== 204) {
        if (contentType.includes('application/json')) {
          parsed = await response.json().catch(() => null);
        } else {
          const text = await response.text().catch(() => '');
          if (text) {
            try {
              parsed = JSON.parse(text);
            } catch {
              parsed = text;
            }
          }
        }
      }

      // Centralized 401 Unauthorized handling with single-flight refresh & single retry
      if (response.status === 401) {
        const canRefresh =
          !skipAuth &&
          !skipAuthRefresh &&
          !_retried &&
          !this.isRefreshExcluded(endpoint);

        if (canRefresh) {
          const refreshed = await this.refreshAccessToken();
          if (refreshed) {
            // Strip any stale Authorization header from customHeaders before retrying once
            const retryHeaders = new Headers(customHeaders);
            retryHeaders.delete('Authorization');
            return this.requestEnvelope<T>(endpoint, {
              ...options,
              headers: retryHeaders,
              _retried: true,
            });
          }
          this.handleSessionExpired();
        } else if (!this.isRefreshExcluded(endpoint) && !skipAuth) {
          this.handleSessionExpired();
        }

        const message = extractErrorMessage(parsed, 401);
        const validationErrors = extractValidationErrors(parsed);
        throw new ApiError(message, 401, validationErrors, parsed, false);
      }

      // Centralized 403 Forbidden handling (do NOT clear session or redirect to login)
      if (response.status === 403) {
        const message = extractErrorMessage(parsed, 403);
        const validationErrors = extractValidationErrors(parsed);
        if (typeof window !== 'undefined') {
          window.dispatchEvent(
            new CustomEvent('fcai:forbidden', { detail: { message } })
          );
        }
        throw new ApiError(message, 403, validationErrors, parsed, false);
      }

      // Other non-2xx HTTP statuses (400, 404, 409, 422, 500, etc.)
      if (!response.ok) {
        const message = extractErrorMessage(parsed, response.status);
        const validationErrors = extractValidationErrors(parsed);
        throw new ApiError(message, response.status, validationErrors, parsed, false);
      }

      // Validate backend standard ApiResponse<T> envelope
      if (isApiEnvelope<T>(parsed)) {
        if (!parsed.success) {
          const message = extractErrorMessage(parsed, response.status);
          const validationErrors = extractValidationErrors(parsed);
          throw new ApiError(message, response.status, validationErrors, parsed, false);
        }
        return parsed;
      }

      // Fallback envelope wrapper if an endpoint returns bare JSON on 2xx
      return {
        success: true,
        message: '',
        data: parsed as T | null,
        errors: null,
        meta: null,
      };
    } catch (err: unknown) {
      clearTimeout(timeoutId);

      if (err instanceof ApiError) {
        throw err;
      }

      if (err instanceof Error && err.name === 'AbortError') {
        throw new ApiError(
          `Request timed out after ${timeoutMs}ms. Please try again.`,
          408,
          null,
          null,
          true
        );
      }

      const fallbackMsg =
        err instanceof Error && err.message
          ? `Network error: ${err.message}`
          : 'Unable to reach the backend server. Please check your connection.';

      throw new ApiError(fallbackMsg, 0, null, null, true);
    }
  }

  /**
   * Dispatches a request and returns the unwrapped `envelope.data` of type T.
   */
  public async request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    const envelope = await this.requestEnvelope<T>(endpoint, options);
    return envelope.data as T;
  }

  public get<T>(
    endpoint: string,
    params?: Record<string, QueryParamValue>,
    options: RequestOptions = {}
  ): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'GET', params });
  }

  public getEnvelope<T>(
    endpoint: string,
    params?: Record<string, QueryParamValue>,
    options: RequestOptions = {}
  ): Promise<ApiResponse<T>> {
    return this.requestEnvelope<T>(endpoint, { ...options, method: 'GET', params });
  }

  public post<T>(endpoint: string, body?: unknown, options: RequestOptions = {}): Promise<T> {
    const isFormData = typeof FormData !== 'undefined' && body instanceof FormData;
    return this.request<T>(endpoint, {
      ...options,
      method: 'POST',
      body: isFormData ? body : body !== undefined ? JSON.stringify(body) : undefined,
    });
  }

  public postEnvelope<T>(
    endpoint: string,
    body?: unknown,
    options: RequestOptions = {}
  ): Promise<ApiResponse<T>> {
    const isFormData = typeof FormData !== 'undefined' && body instanceof FormData;
    return this.requestEnvelope<T>(endpoint, {
      ...options,
      method: 'POST',
      body: isFormData ? body : body !== undefined ? JSON.stringify(body) : undefined,
    });
  }

  public put<T>(endpoint: string, body?: unknown, options: RequestOptions = {}): Promise<T> {
    const isFormData = typeof FormData !== 'undefined' && body instanceof FormData;
    return this.request<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: isFormData ? body : body !== undefined ? JSON.stringify(body) : undefined,
    });
  }

  public putEnvelope<T>(
    endpoint: string,
    body?: unknown,
    options: RequestOptions = {}
  ): Promise<ApiResponse<T>> {
    const isFormData = typeof FormData !== 'undefined' && body instanceof FormData;
    return this.requestEnvelope<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: isFormData ? body : body !== undefined ? JSON.stringify(body) : undefined,
    });
  }

  public patch<T>(endpoint: string, body?: unknown, options: RequestOptions = {}): Promise<T> {
    const isFormData = typeof FormData !== 'undefined' && body instanceof FormData;
    return this.request<T>(endpoint, {
      ...options,
      method: 'PATCH',
      body: isFormData ? body : body !== undefined ? JSON.stringify(body) : undefined,
    });
  }

  public patchEnvelope<T>(
    endpoint: string,
    body?: unknown,
    options: RequestOptions = {}
  ): Promise<ApiResponse<T>> {
    const isFormData = typeof FormData !== 'undefined' && body instanceof FormData;
    return this.requestEnvelope<T>(endpoint, {
      ...options,
      method: 'PATCH',
      body: isFormData ? body : body !== undefined ? JSON.stringify(body) : undefined,
    });
  }

  public delete<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'DELETE' });
  }

  public deleteEnvelope<T>(endpoint: string, options: RequestOptions = {}): Promise<ApiResponse<T>> {
    return this.requestEnvelope<T>(endpoint, { ...options, method: 'DELETE' });
  }

  public upload<T>(endpoint: string, formData: FormData, options: RequestOptions = {}): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'POST', body: formData });
  }
}

/** Single shared API client singleton */
export const apiClient = new ApiClient(config.apiBaseUrl);
export type { RequestOptions, ApiResponse };
