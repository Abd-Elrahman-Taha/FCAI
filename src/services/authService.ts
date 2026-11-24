/**
 * Authentication Service — Real Backend Integration
 *
 * Strictly uses the 9 confirmed Swagger endpoints under /api/auth.
 * Zero mock fallbacks. Zero browser storage.
 */

import { apiClient, ApiError } from './apiClient';
import { AUTH_ENDPOINTS } from './endpoints';
import type {
  ChangePasswordRequest,
  CurrentUserResponse,
  ForgotPasswordRequest,
  ForgotPasswordResponse,
  LoginRequest,
  LoginResponse,
  LogoutRequest,
  RefreshTokenRequest,
  RefreshTokenResponse,
  ResetPasswordRequest,
  VerifyResetTokenRequest,
} from '../types/api/auth.types';
import { isValidUserRole } from '../types/api/auth.types';

export const authService = {
  /**
   * POST /api/auth/login
   * Authenticates either a Student ({ nationalId, studentCode, password })
   * or Staff ({ email, password }).
   */
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const data = await apiClient.post<LoginResponse>(AUTH_ENDPOINTS.LOGIN, credentials, {
      skipAuth: true,
      skipAuthRefresh: true,
    });

    if (!data || !data.token || !data.refreshToken) {
      throw new ApiError('Authentication response was missing required session tokens.', 500, null, data);
    }

    if (!isValidUserRole(data.role)) {
      throw new ApiError(
        `Unsupported user role returned by server: "${String(data.role)}".`,
        403,
        null,
        data
      );
    }

    return data;
  },

  /**
   * POST /api/auth/refresh
   * Exchanges current accessToken + refreshToken for a rotated token pair.
   */
  async refresh(payload: RefreshTokenRequest): Promise<RefreshTokenResponse> {
    const data = await apiClient.post<RefreshTokenResponse>(AUTH_ENDPOINTS.REFRESH, payload, {
      skipAuth: true,
      skipAuthRefresh: true,
    });

    if (!data || !data.token || !data.refreshToken) {
      throw new ApiError('Token refresh response did not contain rotated tokens.', 401, null, data);
    }

    return data;
  },

  /**
   * POST /api/auth/logout
   * Revokes the current device's refresh token.
   */
  async logout(refreshToken: string): Promise<string> {
    const payload: LogoutRequest = { refreshToken };
    const envelope = await apiClient.postEnvelope<unknown>(AUTH_ENDPOINTS.LOGOUT, payload, {
      skipAuthRefresh: true,
    });
    return envelope.message || 'Signed out successfully.';
  },

  /**
   * POST /api/auth/logout-all
   * Revokes all active refresh tokens for the authenticated user across all devices.
   */
  async logoutAll(): Promise<string> {
    const envelope = await apiClient.postEnvelope<unknown>(AUTH_ENDPOINTS.LOGOUT_ALL, undefined, {
      skipAuthRefresh: true,
    });
    return envelope.message || 'Signed out from all devices.';
  },

  /**
   * GET /api/auth/me
   * Fetches the currently authenticated user's profile.
   */
  async getMe(): Promise<CurrentUserResponse> {
    const data = await apiClient.get<CurrentUserResponse>(AUTH_ENDPOINTS.ME);
    if (!data || !isValidUserRole(data.role)) {
      throw new ApiError('Invalid user profile returned by /api/auth/me.', 500, null, data);
    }
    return data;
  },

  /**
   * POST /api/auth/change-password
   * Changes the authenticated user's password (also used for mandatory first-login password change).
   */
  async changePassword(payload: ChangePasswordRequest): Promise<string> {
    const envelope = await apiClient.postEnvelope<unknown>(AUTH_ENDPOINTS.CHANGE_PASSWORD, payload);
    return envelope.message || 'Password updated successfully.';
  },

  /**
   * POST /api/auth/forgot-password
   * Requests a password reset token for the given email.
   * Returns the honest backend response ({ message, resetToken }) without fabricating tokens.
   */
  async forgotPassword(payload: ForgotPasswordRequest): Promise<{
    envelopeMessage: string;
    data: ForgotPasswordResponse | null;
  }> {
    const envelope = await apiClient.postEnvelope<ForgotPasswordResponse>(
      AUTH_ENDPOINTS.FORGOT_PASSWORD,
      payload,
      { skipAuth: true, skipAuthRefresh: true }
    );
    return {
      envelopeMessage: envelope.message || '',
      data: envelope.data,
    };
  },

  /**
   * POST /api/auth/verify-reset-token
   * Verifies whether an email + reset token pair is valid before resetting password.
   */
  async verifyResetToken(payload: VerifyResetTokenRequest): Promise<string> {
    const envelope = await apiClient.postEnvelope<unknown>(
      AUTH_ENDPOINTS.VERIFY_RESET_TOKEN,
      payload,
      { skipAuth: true, skipAuthRefresh: true }
    );
    return envelope.message || 'Reset token verified.';
  },

  /**
   * POST /api/auth/reset-password
   * Completes password reset using a verified reset token.
   */
  async resetPassword(payload: ResetPasswordRequest): Promise<string> {
    const envelope = await apiClient.postEnvelope<unknown>(
      AUTH_ENDPOINTS.RESET_PASSWORD,
      payload,
      { skipAuth: true, skipAuthRefresh: true }
    );
    return envelope.message || 'Password has been reset successfully.';
  },
};
