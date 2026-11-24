/**
 * Application Environment Configuration
 *
 * Centralized, typed access to environment variables for the FCAI BSU frontend.
 * All backend requests use `VITE_API_BASE_URL` (e.g. https://localhost:7124/api
 * or https://fcaibsu.runasp.net/api).
 */

export interface AppConfig {
  /** Base URL for all backend REST API requests (includes /api prefix) */
  apiBaseUrl: string;
  /** Application display name */
  appName: string;
  /** Environment: 'development' | 'production' | 'test' */
  appEnv: string;
  /** Enable safe console logging of HTTP method, URL, and status only (no tokens/PII) */
  enableApiLogging: boolean;
  /** Request timeout in milliseconds */
  requestTimeoutMs: number;
}

export const config: AppConfig = {
  apiBaseUrl: (import.meta.env.VITE_API_BASE_URL || 'https://localhost:7124/api').replace(/\/+$/, ''),
  appName: import.meta.env.VITE_APP_NAME || 'FCAI BSU Education Platform',
  appEnv: import.meta.env.VITE_APP_ENV || (import.meta.env.DEV ? 'development' : 'production'),
  enableApiLogging: import.meta.env.VITE_ENABLE_API_LOGGING === 'true',
  requestTimeoutMs: Number(import.meta.env.VITE_API_TIMEOUT_MS) || 15000,
};
