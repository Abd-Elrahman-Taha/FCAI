/**
 * UI & Presentation State Context
 * 
 * Manages global application shell presentation state:
 * - Theme mode (light / dark) with localStorage persistence
 * - Sidebar collapse / expand state
 * - Mobile navigation drawer visibility
 * - Global toast notification queue
 */

import React, { createContext, useContext, useState, useEffect } from 'react';

export type ThemeMode = 'light' | 'dark';

export interface ToastItem {
  id: string;
  title: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

export interface UIContextType {
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
  toggleTheme: () => void;
  isSidebarCollapsed: boolean;
  toggleSidebar: () => void;
  isMobileDrawerOpen: boolean;
  setIsMobileDrawerOpen: (open: boolean) => void;
  toggleMobileDrawer: () => void;
  closeMobileDrawer: () => void;
  toasts: ToastItem[];
  showToast: (arg1: string, arg2?: string, arg3?: 'success' | 'error' | 'info') => void;
  removeToast: (id: string) => void;
}

const UIContext = createContext<UIContextType | undefined>(undefined);

export const UIProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
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

  const toggleTheme = () => {
    setThemeState(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  const setTheme = (t: ThemeMode) => {
    setThemeState(t);
  };

  // Sidebar state
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(() => {
    return localStorage.getItem('fcai-collapsed') === '1';
  });

  const toggleSidebar = () => {
    setIsSidebarCollapsed(prev => {
      const next = !prev;
      localStorage.setItem('fcai-collapsed', next ? '1' : '0');
      return next;
    });
  };

  // Mobile menu drawer
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState<boolean>(false);

  const toggleMobileDrawer = () => {
    setIsMobileDrawerOpen(prev => !prev);
  };

  const closeMobileDrawer = () => {
    setIsMobileDrawerOpen(false);
  };

  // Toast notifications queue
  const [toasts, setToasts] = useState<ToastItem[]>([]);

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

  return (
    <UIContext.Provider
      value={{
        theme,
        setTheme,
        toggleTheme,
        isSidebarCollapsed,
        toggleSidebar,
        isMobileDrawerOpen,
        setIsMobileDrawerOpen,
        toggleMobileDrawer,
        closeMobileDrawer,
        toasts,
        showToast,
        removeToast,
      }}
    >
      {children}
    </UIContext.Provider>
  );
};

export const useUI = (): UIContextType => {
  const context = useContext(UIContext);
  if (!context) {
    throw new Error('useUI must be used within a UIProvider');
  }
  return context;
};
