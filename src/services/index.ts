/**
 * Central Services Index
 * 
 * Provides unified and domain-specific exports for the entire frontend application.
 */

export { api, fakeApi, ApiError, apiClient, tokenStorage } from './api';
export { authService } from './authService';
export { studentService } from './studentService';
export { doctorService } from './doctorService';
export { taService } from './taService';
export { adminService } from './adminService';
export { superAdminService } from './superAdminService';
export { aiService } from './aiService';
export { mockDataApi } from './mockDataApi';
