/**
 * Authentication & Identity State Context
 * 
 * Manages institutional authentication state, current user profile,
 * active portal role, and session expiration.
 * 
 * BACKEND INTEGRATION INSTRUCTIONS:
 * When your backend authentication endpoints are ready:
 * 1. Open `src/api/auth.api.ts` and implement `authApi.login()`, `authApi.getCurrentUser()`, etc.
 * 2. In this file, update the `login`, `loadUserProfile`, and `logout` actions to call `authApi`.
 */

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { Role, User, NotificationItem } from '../types';
import type { LoginRequest } from '../types/api';
import type { ThemeMode, ToastItem } from './UIContext';
import { api, tokenStorage } from '../services/api';

export type { ThemeMode, ToastItem };

export interface AuthContextType {
  currentUser: User | null;
  isAuthenticated: boolean;
  role: Role;
  isLoadingUser: boolean;
  authError: string | null;
  login: (credentialsOrRole?: Role | LoginRequest) => Promise<User | null>;
  switchRole: (newRole: Role) => Promise<void>;
  setRole: (newRole: Role) => void;
  logout: () => void;
  
  // UI & Shell Convenience delegations (100% backward-compatible with existing 200+ components)
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
  // Theme state
  const [theme, setThemeState] = useState<ThemeMode>(() => {
    const saved = localStorage.getItem('fcai_theme');
    if (saved === 'dark' || saved === 'light') return saved;
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    return 'light';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('fcai_theme', theme);
  }, [theme]);

  const toggleTheme = () => setThemeState(prev => (prev === 'light' ? 'dark' : 'light'));
  const setTheme = (t: ThemeMode) => setThemeState(t);

  // Active Role state
  const [role, setRoleState] = useState<Role>(() => {
    const hash = window.location.hash.replace(/^#\/?/, '');
    const firstSeg = hash.split('/')[0] as Role;
    if (['student', 'doctor', 'ta', 'admin', 'employee'].includes(firstSeg)) {
      return firstSeg;
    }
    const saved = localStorage.getItem('fcai_active_role') as Role;
    return saved || 'student';
  });

  // Authentication state
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('fcai_authenticated') === 'true';
  });

  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoadingUser, setIsLoadingUser] = useState<boolean>(true);
  const [authError, setAuthError] = useState<string | null>(null);

  // UI state
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [unreadOverride, setUnreadOverride] = useState<number | null>(null);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(() => {
    return localStorage.getItem('fcai-collapsed') === '1';
  });
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

  // Session expiry listener (401 event)
  useEffect(() => {
    const handleUnauthorized = () => {
      setIsAuthenticated(false);
      setCurrentUser(null);
      localStorage.removeItem('fcai_authenticated');
      tokenStorage.remove();
      showToast('Session Expired', 'Your institutional session has expired. Please sign in again.', 'info');
      window.location.hash = '#/login';
    };
    window.addEventListener('fcai:unauthorized', handleUnauthorized);
    return () => window.removeEventListener('fcai:unauthorized', handleUnauthorized);
  }, []);

  // Fetch current user profile when authenticated
  const loadUserProfile = useCallback(async (targetRole: Role) => {
    setIsLoadingUser(true);
    setAuthError(null);
    try {
      // TODO: [Backend Integration] Replace with `await authApi.getCurrentUser(targetRole)`
      const user = await api.getCurrentUser(targetRole);
      setCurrentUser(user);
    } catch (err: any) {
      setAuthError(err?.message || 'Failed to fetch user profile.');
    } finally {
      setIsLoadingUser(false);
    }
  }, []);

  useEffect(() => {
    if (!isAuthenticated) {
      setCurrentUser(null);
      setIsLoadingUser(false);
      return;
    }
    loadUserProfile(role);
    localStorage.setItem('fcai_active_role', role);
  }, [role, isAuthenticated, loadUserProfile]);

  // Load initial notifications
  useEffect(() => {
    api.getNotifications().then(items => setNotifications(items)).catch(() => {});
  }, []);

  /**
   * Action: Authenticate user
   */
  const login = async (credentialsOrRole?: Role | LoginRequest): Promise<User | null> => {
    setIsLoadingUser(true);
    setAuthError(null);
    try {
      let targetRole: Role = role;
      let user: User;

      // TODO: [Backend Integration] Connect directly to `authApi.login(credentials)`
      if (typeof credentialsOrRole === 'string') {
        targetRole = credentialsOrRole;
        user = await api.auth.login({ role: targetRole });
      } else if (credentialsOrRole && typeof credentialsOrRole === 'object') {
        targetRole = credentialsOrRole.role || role;
        user = await api.auth.login(credentialsOrRole);
      } else {
        user = await api.auth.login({ role: targetRole });
      }

      setRoleState(user.role || targetRole);
      localStorage.setItem('fcai_active_role', user.role || targetRole);
      localStorage.setItem('fcai_authenticated', 'true');
      setIsAuthenticated(true);
      setCurrentUser(user);
      setIsLoadingUser(false);
      showToast('Signed In', `Welcome back, ${user.name}`);
      return user;
    } catch (err: any) {
      setIsLoadingUser(false);
      setAuthError(err?.message || 'Authentication failed.');
      throw err;
    }
  };

  /**
   * Action: Switch active portal role
   */
  const switchRole = async (newRole: Role) => {
    setRoleState(newRole);
    localStorage.setItem('fcai_active_role', newRole);
    if (isAuthenticated) {
      await loadUserProfile(newRole);
      showToast('Role Switched', `Now browsing as ${newRole.toUpperCase()} portal`, 'info');
    }
  };

  const setRole = (newRole: Role) => {
    switchRole(newRole);
  };

  /**
   * Action: Logout
   */
  const logout = () => {
    setIsAuthenticated(false);
    setCurrentUser(null);
    localStorage.removeItem('fcai_authenticated');
    tokenStorage.remove();
    // TODO: [Backend Integration] Connect to `authApi.logout()`
    api.auth.logout().catch(() => {});
    showToast('Logged Out', 'You have been signed out of your institutional session.');
    window.location.hash = '#/home';
  };

  // Toast Helpers
  const showToast = (arg1: string, arg2?: string, arg3?: 'success' | 'error' | 'info') => {
    let title = arg1;
    let message = arg2 || '';
    let type: 'success' | 'error' | 'info' = 'success';

    if (arg2 === 'success' || arg2 === 'error' || arg2 === 'info') {
      type = arg2;
      title = type.charAt(0).toUpperCase() + type.slice(1);
      message = arg1;
    } else if (arg3) {
      type = arg3;
    }

    const id = `t_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const newToast: ToastItem = { id, title, message, type };
    setToasts(prev => [...prev, newToast]);
    setTimeout(() => removeToast(id), 4500);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Notification Helpers
  const markNotificationRead = async (id: string) => {
    await api.markNotificationRead(id);
    setNotifications(prev => prev.map(n => (n.id === id ? { ...n, unread: false } : n)));
  };

  const markAllNotificationsRead = async () => {
    await api.markAllNotificationsRead();
    setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
    setUnreadOverride(0);
    showToast('All Caught Up', 'All notifications marked as read.');
  };

  const unreadCountComputed = notifications.filter(n => n.unread).length;
  const unreadNotificationsCount = unreadOverride !== null ? unreadOverride : unreadCountComputed;

  const setUnreadCount: React.Dispatch<React.SetStateAction<number>> = (val) => {
    if (typeof val === 'function') {
      setUnreadOverride(prev => (val as (prev: number) => number)(prev !== null ? prev : unreadCountComputed));
    } else {
      setUnreadOverride(val);
    }
  };

  // Shell Helpers
  const toggleSidebar = () => {
    setIsSidebarCollapsed(prev => {
      const next = !prev;
      localStorage.setItem('fcai-collapsed', next ? '1' : '0');
      return next;
    });
  };

  const toggleMobileMenu = () => setIsMobileMenuOpen(prev => !prev);
  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isAuthenticated,
        role,
        isLoadingUser,
        authError,
        login,
        switchRole,
        setRole,
        logout,
        toasts,
        showToast,
        removeToast,
        notifications,
        unreadNotificationsCount,
        setUnreadCount,
        markNotificationRead,
        markAllNotificationsRead,
        isSidebarCollapsed,
        toggleSidebar,
        isMobileMenuOpen,
        setIsMobileMenuOpen,
        toggleMobileMenu,
        closeMobileMenu,
        theme,
        setTheme,
        toggleTheme,
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
