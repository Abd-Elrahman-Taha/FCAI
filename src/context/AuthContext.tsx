/**
 * Authentication & Identity State Context
 *
 * Connected strictly to the confirmed /api/auth backend endpoints and backed by
 * the single centralized in-memory `authSession` store (zero browser storage).
 *
 * Responsibilities:
 * - Student & Staff login via POST /api/auth/login
 * - Authenticated profile enrichment via GET /api/auth/me
 * - Mandatory first-login password change via POST /api/auth/change-password
 * - Single-device logout (POST /api/auth/logout) & all-device revocation (POST /api/auth/logout-all)
 * - Global 401 session-expiry and 403 permission-error event handling
 */

import React, { createContext, useContext, useState, useEffect, useCallback, useSyncExternalStore } from 'react';
import type { Role, User, NotificationItem } from '../types';
import type {
  ChangePasswordRequest,
  CurrentUserResponse,
  LoginRequest,
  UserRole,
} from '../types/api/auth.types';
import { mapBackendRoleToRouteRole } from '../types/api/auth.types';
import { api, ApiError, authSession } from '../services/api';
import { useUI, type ThemeMode, type ToastItem } from './UIContext';

export type { ThemeMode, ToastItem };

export interface LoginResult {
  user: User;
  backendRole: UserRole;
  routeRole: Role;
  requiresPasswordChange: boolean;
}

export interface AuthContextType {
  currentUser: User | null;
  profile: CurrentUserResponse | null;
  isAuthenticated: boolean;
  backendRole: UserRole | null;
  role: Role;
  accessToken: string | null;
  expiresAt: string | null;
  requiresPasswordChange: boolean;
  isLoadingUser: boolean;
  authError: string | null;

  login: (credentials: LoginRequest) => Promise<LoginResult>;
  refreshProfile: () => Promise<CurrentUserResponse | null>;
  completePasswordChange: (payload: ChangePasswordRequest) => Promise<string>;
  logout: () => Promise<void>;
  logoutAll: () => Promise<void>;
  setPendingRedirect: (hash: string | null) => void;
  consumePendingRedirect: () => string | null;

  // UI & Shell convenience delegations from UIContext
  toasts: ToastItem[];
  showToast: (arg1: string, arg2?: string, arg3?: 'success' | 'error' | 'info') => void;
  removeToast: (id: string) => void;
  notifications: NotificationItem[];
  unreadNotificationsCount: number;
  setUnreadCount: React.Dispatch<React.SetStateAction<number>>;
  markNotificationRead: (id: string) => Promise<void>;
  markAllNotificationsRead: () => Promise<void>;
  isSidebarCollapsed: boolean;
  toggleSidebar: () => void;
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (open: boolean) => void;
  toggleMobileMenu: () => void;
  closeMobileMenu: () => void;
  theme: ThemeMode;
  setTheme: (t: ThemeMode) => void;
  toggleTheme: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const ui = useUI();
  const session = useSyncExternalStore(authSession.subscribe, authSession.getSnapshot);

  const [isLoadingUser, setIsLoadingUser] = useState<boolean>(false);
  const [authError, setAuthError] = useState<string | null>(null);

  // Notifications belong to a future backend phase; keep empty in-memory array (no unconfirmed requests)
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [unreadOverride, setUnreadOverride] = useState<number | null>(null);

  // Centralized 401 session expiry listener (emitted by apiClient when refresh fails)
  useEffect(() => {
    const handleUnauthorized = () => {
      setAuthError('Your session has expired. Please sign in again.');
      ui.showToast('Session Expired', 'Your institutional session expired. Please sign in again.', 'info');
      window.location.hash = '#/login';
    };

    const handleForbidden = (event: Event) => {
      const customEvent = event as CustomEvent<{ message?: string }>;
      const msg = customEvent.detail?.message || 'You do not have permission to perform this action.';
      ui.showToast('Access Denied', msg, 'error');
    };

    window.addEventListener('fcai:unauthorized', handleUnauthorized);
    window.addEventListener('fcai:forbidden', handleForbidden);
    return () => {
      window.removeEventListener('fcai:unauthorized', handleUnauthorized);
      window.removeEventListener('fcai:forbidden', handleForbidden);
    };
  }, [ui]);

  /**
   * GET /api/auth/me — loads full authenticated user profile into memory
   */
  const refreshProfile = useCallback(async (): Promise<CurrentUserResponse | null> => {
    if (!authSession.getAccessToken()) return null;
    setIsLoadingUser(true);
    setAuthError(null);
    try {
      const profile = await api.auth.getMe();
      authSession.setProfile(profile);
      return profile;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to load authenticated profile.';
      setAuthError(message);
      return null;
    } finally {
      setIsLoadingUser(false);
    }
  }, []);

  /**
   * POST /api/auth/login — authenticates Student or Staff and initializes in-memory session
   */
  const login = useCallback(
    async (credentials: LoginRequest): Promise<LoginResult> => {
      setIsLoadingUser(true);
      setAuthError(null);
      try {
        const loginData = await api.auth.login(credentials);
        const updatedSession = authSession.setFromLogin(loginData);
        const routeRole = mapBackendRoleToRouteRole(loginData.role);

        // Enrich user details from GET /api/auth/me when password change is not blocking access
        if (!loginData.requiresPasswordChange) {
          try {
            const profile = await api.auth.getMe();
            authSession.setProfile(profile);
          } catch {
            // Keep validated login user data if /me fails transiently; authError is not fatal here
          }
        }

        const latestUser = authSession.getSnapshot().user ?? updatedSession.user!;
        ui.showToast(
          loginData.requiresPasswordChange ? 'Password Change Required' : 'Signed In',
          loginData.requiresPasswordChange
            ? 'Please change your temporary password before continuing.'
            : `Welcome back, ${latestUser.name}`,
          loginData.requiresPasswordChange ? 'info' : 'success'
        );

        return {
          user: latestUser,
          backendRole: loginData.role,
          routeRole,
          requiresPasswordChange: loginData.requiresPasswordChange,
        };
      } catch (err: unknown) {
        const message = err instanceof ApiError || err instanceof Error
          ? err.message
          : 'Authentication failed. Please check your credentials.';
        setAuthError(message);
        throw err;
      } finally {
        setIsLoadingUser(false);
      }
    },
    [ui]
  );

  /**
   * POST /api/auth/change-password — updates password and clears mandatory first-login flag
   */
  const completePasswordChange = useCallback(
    async (payload: ChangePasswordRequest): Promise<string> => {
      const message = await api.auth.changePassword(payload);
      authSession.clearPasswordChangeRequirement();
      await refreshProfile();
      return message;
    },
    [refreshProfile]
  );

  /**
   * POST /api/auth/logout — revokes current device refresh token and clears in-memory session
   */
  const logout = useCallback(async (): Promise<void> => {
    const currentRefresh = authSession.getRefreshToken();
    try {
      if (currentRefresh && authSession.getAccessToken()) {
        await api.auth.logout(currentRefresh);
      }
    } catch {
      // Always clear local in-memory session even if server revocation fails
    } finally {
      authSession.clear();
      authSession.setPendingRedirect(null);
      setNotifications([]);
      setUnreadOverride(null);
      ui.showToast('Signed Out', 'You have been signed out of your institutional session.', 'info');
      window.location.hash = '#/login';
    }
  }, [ui]);

  /**
   * POST /api/auth/logout-all — revokes all active sessions across all devices
   */
  const logoutAll = useCallback(async (): Promise<void> => {
    try {
      if (authSession.getAccessToken()) {
        const msg = await api.auth.logoutAll();
        ui.showToast('All Sessions Revoked', msg, 'info');
      }
    } finally {
      authSession.clear();
      authSession.setPendingRedirect(null);
      setNotifications([]);
      setUnreadOverride(null);
      window.location.hash = '#/login';
    }
  }, [ui]);

  const markNotificationRead = useCallback(async (id: string) => {
    setNotifications(prev => prev.map(n => (n.id === id ? { ...n, unread: false } : n)));
  }, []);

  const markAllNotificationsRead = useCallback(async () => {
    setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
    setUnreadOverride(0);
  }, []);

  const unreadCountComputed = notifications.filter(n => n.unread).length;
  const unreadNotificationsCount = unreadOverride !== null ? unreadOverride : unreadCountComputed;

  const setUnreadCount: React.Dispatch<React.SetStateAction<number>> = useCallback(
    val => {
      if (typeof val === 'function') {
        setUnreadOverride(prev =>
          (val as (prev: number) => number)(prev !== null ? prev : unreadCountComputed)
        );
      } else {
        setUnreadOverride(val);
      }
    },
    [unreadCountComputed]
  );

  return (
    <AuthContext.Provider
      value={{
        currentUser: session.user,
        profile: session.profile,
        isAuthenticated: session.isAuthenticated,
        backendRole: session.backendRole,
        role: session.routeRole,
        accessToken: session.accessToken,
        expiresAt: session.expiresAt,
        requiresPasswordChange: session.requiresPasswordChange,
        isLoadingUser,
        authError,
        login,
        refreshProfile,
        completePasswordChange,
        logout,
        logoutAll,
        setPendingRedirect: authSession.setPendingRedirect,
        consumePendingRedirect: authSession.consumePendingRedirect,
        toasts: ui.toasts,
        showToast: ui.showToast,
        removeToast: ui.removeToast,
        notifications,
        unreadNotificationsCount,
        setUnreadCount,
        markNotificationRead,
        markAllNotificationsRead,
        isSidebarCollapsed: ui.isSidebarCollapsed,
        toggleSidebar: ui.toggleSidebar,
        isMobileMenuOpen: ui.isMobileDrawerOpen,
        setIsMobileMenuOpen: ui.setIsMobileDrawerOpen,
        toggleMobileMenu: ui.toggleMobileDrawer,
        closeMobileMenu: ui.closeMobileDrawer,
        theme: ui.theme,
        setTheme: ui.setTheme,
        toggleTheme: ui.toggleTheme,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
