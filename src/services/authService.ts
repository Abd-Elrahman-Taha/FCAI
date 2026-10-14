/**
 * Authentication & Identity Service
 * 
 * Handles user login, registration, JWT token storage, password recovery,
 * and user profile fetching.
 */

import { apiClient, tokenStorage } from './apiClient';
import type { User, Role, NotificationItem } from '../types';
import type { LoginRequest, LoginResponse, RegisterRequest } from '../types/api';

export const authService = {
  /**
   * Log in user with institutional credentials (Student Code, National ID, or Email)
   */
  async login(credentials: LoginRequest): Promise<User> {
    const res = await apiClient.post<LoginResponse | User>('/auth/login', credentials);
    
    // If backend returns a token, persist it
    if ('token' in res && res.token) {
      tokenStorage.set(res.token);
      if (res.refreshToken) {
        tokenStorage.setRefreshToken(res.refreshToken);
      }
      return res.user;
    }
    
    return res as User;
  },

  /**
   * Register a new student or staff account
   */
  async register(data: RegisterRequest): Promise<{ success: boolean; user?: User; message?: string }> {
    return apiClient.post('/auth/register', data);
  },

  /**
   * Fetch current authenticated user profile
   */
  async getCurrentUser(targetRole?: Role): Promise<User> {
    const params = targetRole ? { role: targetRole } : undefined;
    return apiClient.get<User>('/auth/me', params);
  },

  /**
   * Sign out from active institutional session
   */
  async logout(): Promise<void> {
    try {
      await apiClient.post('/auth/logout');
    } catch {
      // Ignore network errors on logout
    } finally {
      tokenStorage.remove();
    }
  },

  /**
   * Request password reset link via institutional email
   */
  async forgotPassword(email: string): Promise<{ success: boolean; message: string }> {
    return apiClient.post('/auth/forgot-password', { email });
  },

  /**
   * Complete password reset with verification token
   */
  async resetPassword(token: string, newPassword: string): Promise<{ success: boolean; message: string }> {
    return apiClient.post('/auth/reset-password', { token, newPassword });
  },

  /**
   * Complete mandatory first-time login security setup
   */
  async completeFirstLoginSetup(newPassword: string, phone: string): Promise<{ success: boolean; user: User }> {
    return apiClient.post('/auth/first-login-setup', { newPassword, phone });
  },

  /**
   * Fetch user notifications
   */
  async getNotifications(): Promise<NotificationItem[]> {
    return apiClient.get<NotificationItem[]>('/notifications');
  },

  /**
   * Mark single notification as read
   */
  async markNotificationRead(notificationId: string): Promise<void> {
    return apiClient.patch(`/notifications/${notificationId}/read`);
  },

  /**
   * Mark all notifications as read
   */
  async markAllNotificationsRead(): Promise<void> {
    return apiClient.patch('/notifications/read-all');
  }
};
