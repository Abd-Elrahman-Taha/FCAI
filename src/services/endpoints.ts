/**
 * Centralized API Endpoints Catalog — Confirmed Swagger Whitelist Only
 *
 * Verified against https://fcaibsu.runasp.net/swagger/v1/swagger.json.
 * All paths are relative to VITE_API_BASE_URL (which includes the /api prefix).
 */

export const AUTH_ENDPOINTS = {
  LOGIN: '/auth/login',
  REFRESH: '/auth/refresh',
  LOGOUT: '/auth/logout',
  LOGOUT_ALL: '/auth/logout-all',
  ME: '/auth/me',
  CHANGE_PASSWORD: '/auth/change-password',
  FORGOT_PASSWORD: '/auth/forgot-password',
  VERIFY_RESET_TOKEN: '/auth/verify-reset-token',
  RESET_PASSWORD: '/auth/reset-password',
} as const;

export const ADMIN_ENDPOINTS = {
  ACADEMIC_YEARS: '/admin/academic-years',
  ACADEMIC_YEAR_BY_ID: (id: number) => `/admin/academic-years/${id}`,
  ACADEMIC_LEVELS: '/admin/academic-levels',
} as const;

export const SEMESTER_ENDPOINTS = {
  ACTIVE: '/semesters/active',
} as const;
