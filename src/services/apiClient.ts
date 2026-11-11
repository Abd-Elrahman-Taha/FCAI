/**
 * Centralized HTTP Client Configuration
 * 
 * Standardized HTTP transport client (using fetch) pre-configured with:
 * - Base URL from environment (VITE_API_BASE_URL)
 * - Automatic Authorization: Bearer <token> header injection
 * - Request timeout via AbortController
 * - Unified error handling via ApiError
 * - Support for JSON and Multipart/FormData payloads
 */

import { config } from '../config/env';
import type { RequestOptions } from '../types/api/common.types';

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

export const TOKEN_STORAGE_KEY = 'fcai_token';
export const REFRESH_TOKEN_STORAGE_KEY = 'fcai_refresh_token';

/** Storage helpers for JWT tokens */
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

export class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl.replace(/\/+$/, '');
  }

  public setBaseUrl(url: string) {
    this.baseUrl = url.replace(/\/+$/, '');
  }

  public getBaseUrl(): string {
    return this.baseUrl;
  }

  /**
   * Core request dispatcher with authorization headers, timeout, and JSON handling
   */
  public async request<T = any>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    const {
      params,
      timeoutMs = config.requestTimeoutMs,
      headers: customHeaders = {},
      ...fetchOptions
    } = options;

    // 1. Build URL with query params
    let url = endpoint.startsWith('http') ? endpoint : `${this.baseUrl}/${endpoint.replace(/^\/+/, '')}`;
    if (params) {
      const searchParams = new URLSearchParams();
      Object.entries(params).forEach(([key, val]) => {
        if (val !== undefined && val !== null && val !== '') {
          searchParams.append(key, String(val));
        }
      });
      const qs = searchParams.toString();
      if (qs) url += (url.includes('?') ? '&' : '?') + qs;
    }

    // 2. Prepare headers with JWT Token
    const headers = new Headers(customHeaders);
    if (!headers.has('Accept')) {
      headers.set('Accept', 'application/json');
    }
    const token = tokenStorage.get();
    if (token && !headers.has('Authorization')) {
      headers.set('Authorization', `Bearer ${token}`);
    }

    const isFormData = fetchOptions.body instanceof FormData;
    if (!isFormData && fetchOptions.body && !headers.has('Content-Type')) {
      headers.set('Content-Type', 'application/json');
    }

    // 3. Timeout controller
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

    // 4. Request logging
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

      // Handle 401 Unauthorized session expiry
      if (response.status === 401) {
        tokenStorage.remove();
        window.dispatchEvent(new CustomEvent('fcai:unauthorized'));
      }

      // Parse JSON body
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
        const statusColor = response.ok ? '#38bdf8' : '#ef4444';
        console.log(`%c[API RES ${response.status}] %c${url}`, `color: ${statusColor}; font-weight: bold;`, 'color: inherit;', data);
      }

      if (!response.ok) {
        const message =
          (data && typeof data === 'object' && (data.message || data.error || data.detail)) ||
          `Request failed with status ${response.status}`;
        throw new ApiError(message, response.status, data);
      }

      // Automatically unwrap { success: true, data: T } if present
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
      throw new ApiError(
        err.message || 'Unable to connect to the backend server. Please verify network connectivity.',
        0,
        null,
        true
      );
    }
  }

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

  public upload<T = any>(endpoint: string, formData: FormData, options: RequestOptions = {}): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'POST', body: formData });
  }
}

/** Pre-configured singleton API client instance */
export const apiClient = new ApiClient(config.apiBaseUrl);
export type { RequestOptions };
