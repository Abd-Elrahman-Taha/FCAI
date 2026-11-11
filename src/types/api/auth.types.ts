/**
 * Authentication & Identity API Types
 */

import type { User, Role } from '../index';

export interface LoginRequest {
  email?: string;
  studentCode?: string;
  nationalId?: string;
  password?: string;
  role?: Role;
  rememberMe?: boolean;
}

export interface LoginResponse {
  user: User;
  token: string;
  refreshToken?: string;
  expiresIn?: number;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password?: string;
  nationalId: string;
  studentCode?: string;
  role: Role;
  phone?: string;
  department?: string;
  academicYear?: string;
}

export interface RegisterResponse {
  success: boolean;
  message: string;
  user?: User;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  newPassword: string;
}

export interface FirstLoginSetupRequest {
  newPassword: string;
  phone: string;
  recoveryEmail?: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface RefreshTokenResponse {
  token: string;
  refreshToken?: string;
  expiresIn?: number;
}
