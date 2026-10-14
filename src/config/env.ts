/**
 * Application Environment Configuration
 * 
 * Centralized, typed access to all environment variables and configuration flags.
 * To point this frontend to your real backend API, create a `.env` file in the project
 * root and set:
 *   VITE_API_BASE_URL=http://localhost:8000/api/v1
 *   VITE_USE_MOCK_API=false
 */

export interface AppConfig {
  /** Base URL for all backend REST API requests */
  apiBaseUrl: string;
  /** When true, uses in-memory mock database; when false, sends real HTTP requests to apiBaseUrl */
  useMockApi: boolean;
  /** Application display name */
  appName: string;
  /** Environment: 'development' | 'production' | 'test' */
  appEnv: string;
  /** Enable verbose console logging of all API requests and responses */
  enableApiLogging: boolean;
  /** Request timeout in milliseconds */
  requestTimeoutMs: number;
}

export const config: AppConfig = {
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1',
  useMockApi: import.meta.env.VITE_USE_MOCK_API === 'false' ? false : true,
  appName: import.meta.env.VITE_APP_NAME || 'FCAI BSU Education Platform',
  appEnv: import.meta.env.VITE_APP_ENV || (import.meta.env.DEV ? 'development' : 'production'),
  enableApiLogging: import.meta.env.VITE_ENABLE_API_LOGGING === 'true' || import.meta.env.DEV,
  requestTimeoutMs: Number(import.meta.env.VITE_API_TIMEOUT_MS) || 15000,
};

/** Helper to check whether real API mode is active */
export const isRealApiActive = (): boolean => !config.useMockApi;

/** Helper to check whether mock API mode is active */
export const isMockApiActive = (): boolean => config.useMockApi;
