/**
 * Notification State Context
 * 
 * Manages user notifications, unread count badges, and read-state synchronization.
 * 
 * HOW TO INTEGRATE WITH BACKEND:
 * In the action placeholders below (`fetchNotifications`, `markAsRead`, `markAllAsRead`),
 * connect the calls to `notificationApi` from `src/api/notification.api.ts`.
 */

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { NotificationItem } from '../types';
import { api } from '../services/api';
// When ready to connect real API:
// import { notificationApi } from '../api/notification.api';

export interface NotificationContextType {
  notifications: NotificationItem[];
  unreadCount: number;
  isLoading: boolean;
  error: string | null;
  /** Fetch latest notifications from backend */
  fetchNotifications: () => Promise<void>;
  /** Mark single notification as read */
  markAsRead: (notificationId: string) => Promise<void>;
  /** Mark all user notifications as read */
  markAllAsRead: () => Promise<void>;
  /** Manually override or update unread count */
  setUnreadCount: React.Dispatch<React.SetStateAction<number>>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [unreadOverride, setUnreadOverride] = useState<number | null>(null);

  /**
   * Action: Fetch notifications
   */
  const fetchNotifications = useCallback(async (): Promise<void> => {
    setIsLoading(true);
    setError(null);
    try {
      // TODO: [Backend Integration] Replace with `await notificationApi.getNotifications()`
      const items = await api.getNotifications();
      setNotifications(items);
    } catch (err: any) {
      setError(err?.message || 'Failed to fetch notifications.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Action: Mark single notification read
   */
  const markAsRead = async (notificationId: string): Promise<void> => {
    try {
      // Optimistic UI update
      setNotifications(prev =>
        prev.map(n => (n.id === notificationId ? { ...n, unread: false } : n))
      );
      // TODO: [Backend Integration] Connect to `await notificationApi.markAsRead(notificationId)`
      await api.markNotificationRead(notificationId);
    } catch (err: any) {
      console.error('[NotificationContext] Failed to mark notification as read:', err);
    }
  };

  /**
   * Action: Mark all notifications read
   */
  const markAllAsRead = async (): Promise<void> => {
    try {
      // Optimistic UI update
      setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
      setUnreadOverride(0);
      // TODO: [Backend Integration] Connect to `await notificationApi.markAllAsRead()`
      await api.markAllNotificationsRead();
    } catch (err: any) {
      console.error('[NotificationContext] Failed to mark all notifications as read:', err);
    }
  };

  // Initial load
  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const computedUnread = notifications.filter(n => n.unread).length;
  const unreadCount = unreadOverride !== null ? unreadOverride : computedUnread;

  const setUnreadCount: React.Dispatch<React.SetStateAction<number>> = (val) => {
    if (typeof val === 'function') {
      setUnreadOverride(prev => (val as (prev: number) => number)(prev !== null ? prev : computedUnread));
    } else {
      setUnreadOverride(val);
    }
  };

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
