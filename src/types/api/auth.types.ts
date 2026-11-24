/**
 * Authentication & Identity API Contracts
 *
 * Strictly aligned with confirmed Swagger DTOs under /api/auth.
 */

import type { Role } from '../index';

/** Exact backend role strings serialized by the API */
export type UserRole =
  | 'Admin'
  | 'Student'
  | 'Doctor'
  | 'TeachingAssistant'
  | 'Employee';

export const SUPPORTED_USER_ROLES: readonly UserRole[] = [
  'Admin',
  'Student',
  'Doctor',
  'TeachingAssistant',
  'Employee',
] as const;

export function isValidUserRole(value: unknown): value is UserRole {
  return typeof value === 'string' && (SUPPORTED_USER_ROLES as readonly string[]).includes(value);
}

/** Maps exact backend UserRole to frontend portal route prefix */
export function mapBackendRoleToRouteRole(role: UserRole): Role {
  switch (role) {
    case 'Admin':
      return 'admin';
    case 'Student':
      return 'student';
    case 'Doctor':
      return 'doctor';
    case 'TeachingAssistant':
      return 'ta';
    case 'Employee':
      return 'employee';
  }
}

export function getRoleDisplayLabel(role: UserRole): string {
  switch (role) {
    case 'Admin':
      return 'College Admin';
    case 'Student':
      return 'Student';
    case 'Doctor':
      return 'Faculty Doctor';
    case 'TeachingAssistant':
      return 'Teaching Assistant';
    case 'Employee':
      return 'Staff Employee';
  }
}

/** Student login request body for POST /api/auth/login */
export interface StudentLoginRequest {
  nationalId: string;
  studentCode: string;
  password: string;
}

/** Staff login request body for POST /api/auth/login (Admin, Doctor, TeachingAssistant, Employee) */
export interface StaffLoginRequest {
  email: string;
  password: string;
}

export type LoginRequest = StudentLoginRequest | StaffLoginRequest;

/** Response data from POST /api/auth/login */
export interface LoginResponse {
  userId: number;
  email: string;
  fullName: string;
  role: UserRole;
  token: string;
  refreshToken: string;
  expiresAt: string;
  requiresPasswordChange: boolean;
}

/** Request body for POST /api/auth/refresh */
export interface RefreshTokenRequest {
  accessToken: string;
  refreshToken: string;
}

/** Response data from POST /api/auth/refresh */
export interface RefreshTokenResponse {
  token: string;
  refreshToken: string;
  expiresAt: string;
}

/** Request body for POST /api/auth/logout */
export interface LogoutRequest {
  refreshToken: string;
}

/** Request body for POST /api/auth/change-password */
export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}

/** Response data from GET /api/auth/me */
export interface CurrentUserResponse {
  id: number;
  username: string | null;
  email: string | null;
  fullNameAr: string | null;
  fullNameEn: string | null;
  phoneNumber: string | null;
  role: UserRole;
  isActive: boolean;
  lastLoginAt: string | null;
}

/** Request body for POST /api/auth/forgot-password */
export interface ForgotPasswordRequest {
  email: string;
}

/** Response data from POST /api/auth/forgot-password */
export interface ForgotPasswordResponse {
  message: string | null;
  resetToken: string | null;
}

/** Request body for POST /api/auth/verify-reset-token */
export interface VerifyResetTokenRequest {
  email: string;
  token: string;
}

/** Request body for POST /api/auth/reset-password */
export interface ResetPasswordRequest {
  email: string;
  token: string;
  newPassword: string;
  confirmNewPassword: string;
}
