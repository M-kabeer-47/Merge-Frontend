import type { QueryClient } from "@tanstack/react-query";
import type { NotificationPayload } from "@/types/notification";
import { notificationsQueryKey } from "@/hooks/notifications/use-fetch-notifications";

/**
 * Notification Cache Utilities
 *
 * Provides cache operations for notification data.
 */

interface NotificationsPage {
  notifications: NotificationPayload[];
  total: number;
  unreadCount: number;
  page: number;
  hasMore: boolean;
}

interface NotificationsData {
  pages: NotificationsPage[];
  pageParams: number[];
}

/**
 * Add a new notification to the cache
 * Used by NotificationProvider when socket notification arrives
 */
export function addNotificationToCache(
  queryClient: QueryClient,
  notification: NotificationPayload,
): void {
  queryClient.setQueryData<NotificationsData>(notificationsQueryKey, (old) => {
    if (!old) {
      return {
        pages: [
          {
            notifications: [notification],
            total: 1,
            unreadCount: 1,
            page: 1,
            hasMore: false,
          },
        ],
        pageParams: [1],
      };
    }

    const firstPage = old.pages[0];

    // Skip if already exists
    if (firstPage?.notifications.some((n) => n.id === notification.id)) {
      return old;
    }

    // Add to first page (most recent)
    return {
      ...old,
      pages: [
        {
          ...firstPage,
          notifications: [notification, ...firstPage.notifications],
          total: firstPage.total + 1,
          unreadCount: firstPage.unreadCount + 1,
        },
        ...old.pages.slice(1),
      ],
    };
  });
}
