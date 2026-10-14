/**
 * Unified API Facade & Backwards Compatibility Layer
 * 
 * All existing `fakeApi` imports across the codebase route through the unified `api` facade.
 * 
 * - When `VITE_USE_MOCK_API=false`: Calls are automatically routed to your real REST API backend.
 * - When `VITE_USE_MOCK_API=true`: Calls are handled by the in-memory mock data provider.
 * 
 * For clean modular code, you can also import specific domain services:
 *   import { studentService } from '../services/studentService';
 *   import { authService } from '../services/authService';
 *   import { doctorService } from '../services/doctorService';
 *   import { apiClient } from '../services/apiClient';
 */

import { api } from './api';

export const fakeApi = api;
export { api };
export * from './api';
export default api;
