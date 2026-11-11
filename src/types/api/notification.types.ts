/**
 * Notifications API Types
 */

import type { NotificationItem } from '../index';

export interface NotificationsListResponse {
  items: NotificationItem[];
  unreadCount: number;
}

export interface MarkNotificationReadResponse {
  success: boolean;
  notificationId: string;
}
