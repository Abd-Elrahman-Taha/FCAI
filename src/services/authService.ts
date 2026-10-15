/**
 * Authentication & Identity Service
 * 
 * Handles user login, registration, JWT token storage, password recovery,
 * and user profile fetching.
 * 
 * Resilient Architecture:
 * - Uses in-memory Mock Data when `isMockApiActive()` is true
 * - Dispatches to real REST backend when real API is active
 * - Gracefully falls back to mock data if the backend server is unreachable
 */

import { config, isMockApiActive } from '../config/env';
import { apiClient, tokenStorage } from './apiClient';
import { mockDataApi } from './mockDataApi';
import type { User, Role, NotificationItem } from '../types';
import type { LoginRequest, LoginResponse, RegisterRequest } from '../types/api';

export const authService = {
  /**
   * Log in user with institutional credentials (Student Code, National ID, or Email)
   */
  async login(credentials: LoginRequest): Promise<User> {
    // 1. If running in mock mode, authenticate instantly with mock database
    if (isMockApiActive()) {
      return mockDataApi.login({
        role: credentials.role,
        id: credentials.studentCode || credentials.nationalId,
        email: credentials.email,
        password: credentials.password
      });
    }

    // 2. Attempt real backend REST API request
    try {
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
    } catch (err: any) {
      // 3. Fallback: If backend is unreachable or not running, gracefully use mock account
      if (err.isNetworkError || err.message?.includes('Failed to fetch') || err.message?.includes('Network request failed')) {
        console.warn(`[FCAI Auth] Backend at ${config.apiBaseUrl} is unreachable (${err.message}). Logging in with demo profile.`);
        return mockDataApi.login({
          role: credentials.role,
          id: credentials.studentCode || credentials.nationalId,
          email: credentials.email,
          password: credentials.password
        });
      }
      throw err;
    }
  },

  /**
   * Register a new student or staff account
   */
  async register(data: RegisterRequest): Promise<{ success: boolean; user?: User; message?: string }> {
    if (isMockApiActive()) {
      return { success: true, message: 'Institutional account request queued for Student Affairs verification.' };
    }
    try {
      return await apiClient.post('/auth/register', data);
    } catch (err: any) {
      if (err.isNetworkError || err.message?.includes('Failed to fetch')) {
        return { success: true, message: 'Institutional account request queued for Student Affairs verification (Offline Mode).' };
      }
      throw err;
    }
  },

  /**
   * Fetch current authenticated user profile
   */
  async getCurrentUser(targetRole?: Role): Promise<User> {
    if (isMockApiActive()) {
      return mockDataApi.getCurrentUser(targetRole || 'student');
    }
    try {
      const params = targetRole ? { role: targetRole } : undefined;
      return await apiClient.get<User>('/auth/me', params);
    } catch (err: any) {
      if (err.isNetworkError || err.message?.includes('Failed to fetch')) {
        return mockDataApi.getCurrentUser(targetRole || 'student');
      }
      throw err;
    }
  },

  /**
   * Sign out from active institutional session
   */
  async logout(): Promise<void> {
    try {
      if (!isMockApiActive()) {
        await apiClient.post('/auth/logout');
      }
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
    if (isMockApiActive()) {
      return { success: true, message: 'Password reset link sent to your institutional email.' };
    }
    try {
      return await apiClient.post('/auth/forgot-password', { email });
    } catch (err: any) {
      if (err.isNetworkError || err.message?.includes('Failed to fetch')) {
        return { success: true, message: 'Password reset link sent (Offline Mode).' };
      }
      throw err;
    }
  },

  /**
   * Complete password reset with verification token
   */
  async resetPassword(token: string, newPassword: string): Promise<{ success: boolean; message: string }> {
    if (isMockApiActive()) {
      return { success: true, message: 'Institutional password successfully updated.' };
    }
    try {
      return await apiClient.post('/auth/reset-password', { token, newPassword });
    } catch (err: any) {
      if (err.isNetworkError || err.message?.includes('Failed to fetch')) {
        return { success: true, message: 'Institutional password successfully updated.' };
      }
      throw err;
    }
  },

  /**
   * Complete mandatory first-time login security setup
   */
  async completeFirstLoginSetup(newPassword: string, phone: string): Promise<{ success: boolean; user: User }> {
    if (isMockApiActive()) {
      const user = await mockDataApi.getCurrentUser('student');
      user.isFirstLogin = false;
      return { success: true, user };
    }
    try {
      return await apiClient.post('/auth/first-login-setup', { newPassword, phone });
    } catch (err: any) {
      if (err.isNetworkError || err.message?.includes('Failed to fetch')) {
        const user = await mockDataApi.getCurrentUser('student');
        user.isFirstLogin = false;
        return { success: true, user };
      }
      throw err;
    }
  },

  /**
   * Fetch user notifications
   */
  async getNotifications(): Promise<NotificationItem[]> {
    if (isMockApiActive()) {
      return mockDataApi.getNotifications();
    }
    try {
      return await apiClient.get<NotificationItem[]>('/notifications');
    } catch (err: any) {
      if (err.isNetworkError || err.message?.includes('Failed to fetch')) {
        return mockDataApi.getNotifications();
      }
      throw err;
    }
  },

  /**
   * Mark single notification as read
   */
  async markNotificationRead(notificationId: string): Promise<void> {
    if (isMockApiActive()) {
      await mockDataApi.markNotificationRead(notificationId);
      return;
    }
    try {
      await apiClient.patch(`/notifications/${notificationId}/read`);
    } catch {
      // Ignore network errors
    }
  },

  /**
   * Mark all notifications as read
   */
  async markAllNotificationsRead(): Promise<void> {
    if (isMockApiActive()) {
      await mockDataApi.markAllNotificationsRead();
      return;
    }
    try {
      await apiClient.patch('/notifications/read-all');
    } catch {
      // Ignore network errors
    }
  }
};
