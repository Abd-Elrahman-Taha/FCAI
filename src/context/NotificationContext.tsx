/**
 * Notification State Context
 *
 * Notifications backend endpoints are outside the current integration scope.
 * Keeps clean in-memory state without firing unconfirmed API requests or fake fallbacks.
 */

import React, { createContext, useContext, useState, useCallback } from 'react';
import type { NotificationItem } from '../types';

export interface NotificationContextType {
  notifications: NotificationItem[];
  unreadCount: number;
  isLoading: boolean;
  error: string | null;
  fetchNotifications: () => Promise<void>;
  markAsRead: (notificationId: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  setUnreadCount: React.Dispatch<React.SetStateAction<number>>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [isLoading] = useState<boolean>(false);
  const [error] = useState<string | null>(null);
  const [unreadOverride, setUnreadOverride] = useState<number | null>(null);

  const fetchNotifications = useCallback(async (): Promise<void> => {
    // Future backend phase: notifications endpoint is not part of the confirmed Swagger scope.
  }, []);

  const markAsRead = useCallback(async (notificationId: string): Promise<void> => {
    setNotifications(prev =>
      prev.map(n => (n.id === notificationId ? { ...n, unread: false } : n))
    );
  }, []);

  const markAllAsRead = useCallback(async (): Promise<void> => {
    setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
    setUnreadOverride(0);
  }, []);

  const computedUnread = notifications.filter(n => n.unread).length;
  const unreadCount = unreadOverride !== null ? unreadOverride : computedUnread;

  const setUnreadCount: React.Dispatch<React.SetStateAction<number>> = useCallback(
    val => {
      if (typeof val === 'function') {
        setUnreadOverride(prev =>
          (val as (prev: number) => number)(prev !== null ? prev : computedUnread)
        );
      } else {
        setUnreadOverride(val);
      }
    },
    [computedUnread]
  );

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        isLoading,
        error,
        fetchNotifications,
        markAsRead,
        markAllAsRead,
        setUnreadCount,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = (): NotificationContextType => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};
