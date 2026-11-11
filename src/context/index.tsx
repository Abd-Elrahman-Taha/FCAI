/**
 * State Management & Context Providers Barrel
 * 
 * Provides centralized exports for all application contexts and custom hooks.
 * 
 * Available Hooks:
 * - `useAuth()`: User authentication, active role, permissions, login/logout
 * - `useUI()`: Theme mode, sidebar toggle, mobile menu, toast notifications
 * - `useNotifications()`: User notifications feed, unread badge counter
 * - `useAcademic()`: Student courses, semester registration status, add/drop
 */

import React from 'react';
import { UIProvider, useUI } from './UIContext';
import { AuthProvider, useAuth } from './AuthContext';
import { NotificationProvider, useNotifications } from './NotificationContext';
import { AcademicProvider, useAcademic } from './AcademicContext';

export * from './UIContext';
export { AuthProvider, useAuth } from './AuthContext';
export type { AuthContextType } from './AuthContext';
export * from './NotificationContext';
export * from './AcademicContext';

/**
 * Unified Root Context Provider
 * 
 * Mounts all application providers in their optimal dependency order.
 */
export const AppProviders: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <UIProvider>
      <AuthProvider>
        <NotificationProvider>
          <AcademicProvider>
            {children}
          </AcademicProvider>
        </NotificationProvider>
      </AuthProvider>
    </UIProvider>
  );
};

export default AppProviders;
