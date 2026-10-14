/**
 * Core HTTP API Client
 * 
 * A clean, robust fetch-based HTTP client for interacting with any REST backend.
 * Features:
 * - Automatic JWT Bearer token authentication
 * - Query parameter serialization
 * - Timeout handling via AbortController
 * - Unified ApiError parsing
 * - Support for JSON payloads and Multipart FormData (file uploads)
 * - Development logging
 */

import { config } from '../config/env';

export class ApiError extends Error {
  public status: number;
  public data?: any;
  public isNetworkError: boolean;

  constructor(message: string, status: number = 0, data?: any, isNetworkError: boolean = false) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
    this.isNetworkError = isNetworkError;
    Object.setPrototypeOf(this, ApiError.prototype);
  }
}

export interface RequestOptions extends RequestInit {
  params?: Record<string, any>;
  timeoutMs?: number;
}

export const TOKEN_STORAGE_KEY = 'fcai_token';
export const REFRESH_TOKEN_STORAGE_KEY = 'fcai_refresh_token';

/** Token storage utilities */
export const tokenStorage = {
  get: (): string | null => localStorage.getItem(TOKEN_STORAGE_KEY),
  set: (token: string): void => localStorage.setItem(TOKEN_STORAGE_KEY, token),
  remove: (): void => {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    localStorage.removeItem(REFRESH_TOKEN_STORAGE_KEY);
  },
  getRefreshToken: (): string | null => localStorage.getItem(REFRESH_TOKEN_STORAGE_KEY),
  setRefreshToken: (token: string): void => localStorage.setItem(REFRESH_TOKEN_STORAGE_KEY, token),
};

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl.replace(/\/+$/, '');
  }

  /** Update base URL dynamically at runtime if needed */
  public setBaseUrl(url: string) {
    this.baseUrl = url.replace(/\/+$/, '');
  }

  public getBaseUrl(): string {
    return this.baseUrl;
  }

  /**
   * Core request dispatcher with interceptors, timeouts and error handling
   */
  public async request<T = any>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    const {
      params,
      timeoutMs = config.requestTimeoutMs,
      headers: customHeaders = {},
      ...fetchOptions
    } = options;

    // 1. Build Full URL with query parameters
    let url = endpoint.startsWith('http') ? endpoint : `${this.baseUrl}/${endpoint.replace(/^\/+/, '')}`;
    if (params) {
      const searchParams = new URLSearchParams();
      Object.entries(params).forEach(([key, val]) => {
        if (val !== undefined && val !== null && val !== '') {
          searchParams.append(key, String(val));
        }
      });
      const qs = searchParams.toString();
      if (qs) {
        url += (url.includes('?') ? '&' : '?') + qs;
      }
    }

    // 2. Prepare Headers
    const headers = new Headers(customHeaders);
    if (!headers.has('Accept')) {
      headers.set('Accept', 'application/json');
    }

    // Inject JWT Bearer token if present
    const token = tokenStorage.get();
    if (token && !headers.has('Authorization')) {
      headers.set('Authorization', `Bearer ${token}`);
    }

    // If body is NOT FormData, set application/json
    const isFormData = fetchOptions.body instanceof FormData;
    if (!isFormData && fetchOptions.body && !headers.has('Content-Type')) {
      headers.set('Content-Type', 'application/json');
    }

    // 3. Setup Request Timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

    // 4. Logging in Dev Mode
    if (config.enableApiLogging) {
      console.log(`%c[API REQ] ${fetchOptions.method || 'GET'} %c${url}`, 'color: #38bdf8; font-weight: bold;', 'color: inherit;');
    }

    try {
      const response = await fetch(url, {
        ...fetchOptions,
        headers,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      // Handle 401 Unauthorized (Session Expired or Invalid Token)
      if (response.status === 401) {
        tokenStorage.remove();
        window.dispatchEvent(new CustomEvent('fcai:unauthorized'));
      }

      // Parse JSON response body
      let data: any = null;
      const contentType = response.headers.get('content-type') || '';
      if (contentType.includes('application/json')) {
        data = await response.json();
      } else {
        const text = await response.text();
        try {
          data = JSON.parse(text);
        } catch {
          data = text;
        }
      }

      if (config.enableApiLogging) {
        const statusColor = response.ok ? '#34d399' : '#ef4444';
        console.log(`%c[API RES ${response.status}] %c${url}`, `color: ${statusColor}; font-weight: bold;`, 'color: inherit;', data);
      }

      if (!response.ok) {
        const errorMessage =
          (data && typeof data === 'object' && (data.message || data.error || data.detail)) ||
          `Request failed with status ${response.status}`;
        throw new ApiError(errorMessage, response.status, data);
      }

      // If backend wraps payloads in { success: true, data: T }, unpack data automatically
      if (data && typeof data === 'object' && 'data' in data && 'success' in data) {
        return data.data as T;
      }

      return data as T;
    } catch (err: any) {
      clearTimeout(timeoutId);

      if (err.name === 'AbortError') {
        throw new ApiError(`Request timed out after ${timeoutMs}ms`, 408, null, true);
      }

      if (err instanceof ApiError) {
        throw err;
      }

      // Network unreachable / CORS error / Server down
      throw new ApiError(
        err.message || 'Unable to connect to the backend server. Please verify network connectivity.',
        0,
        null,
        true
      );
    }
  }

  // Convenient HTTP Verb wrappers
  public get<T = any>(endpoint: string, params?: Record<string, any>, options: RequestOptions = {}): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'GET', params });
  }

  public post<T = any>(endpoint: string, body?: any, options: RequestOptions = {}): Promise<T> {
    const isFormData = body instanceof FormData;
    return this.request<T>(endpoint, {
      ...options,
      method: 'POST',
      body: isFormData ? body : body ? JSON.stringify(body) : undefined,
    });
  }

  public put<T = any>(endpoint: string, body?: any, options: RequestOptions = {}): Promise<T> {
    const isFormData = body instanceof FormData;
    return this.request<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: isFormData ? body : body ? JSON.stringify(body) : undefined,
    });
  }

  public patch<T = any>(endpoint: string, body?: any, options: RequestOptions = {}): Promise<T> {
    const isFormData = body instanceof FormData;
    return this.request<T>(endpoint, {
      ...options,
      method: 'PATCH',
      body: isFormData ? body : body ? JSON.stringify(body) : undefined,
    });
  }

  public delete<T = any>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'DELETE' });
  }

  /** Upload single or multiple files with form fields */
  public upload<T = any>(endpoint: string, formData: FormData, options: RequestOptions = {}): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'POST',
      body: formData,
    });
  }
}

/** Singleton instance configured with base URL from environment */
export const apiClient = new ApiClient(config.apiBaseUrl);
