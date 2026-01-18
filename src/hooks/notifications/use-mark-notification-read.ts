/**
 * Hook to mark a single notification as read
 */
import {
  useMutation,
  useQueryClient,
  type InfiniteData,
} from "@tanstack/react-query";
import api from "@/utils/api";
import { notificationsQueryKey } from "./use-fetch-notifications";
import type { NotificationPayload } from "@/types/notification";

interface NotificationsPage {
  notifications: NotificationPayload[];
  total: number;
  unreadCount: number;
  page: number;
  hasMore: boolean;
}

type NotificationsData = InfiniteData<NotificationsPage>;

export function useMarkNotificationRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (notificationId: string) => {
      await api.patch(`/notifications/${notificationId}/read`);
      return notificationId;
    },
    onMutate: async (notificationId) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: notificationsQueryKey });

      // Snapshot previous value
      const previousData = queryClient.getQueryData<NotificationsData>(
        notificationsQueryKey,
      );

      // Optimistically update
      queryClient.setQueryData<NotificationsData>(
        notificationsQueryKey,
        (old) => {
          if (!old) return old;

          return {
            ...old,
            pages: old.pages.map((page, index) => ({
              ...page,
              notifications: page.notifications.map((n) =>
                n.id === notificationId ? { ...n, isRead: true } : n,
              ),
              // Only decrement unreadCount on first page to avoid double counting
              unreadCount:
                index === 0
                  ? Math.max(0, page.unreadCount - 1)
                  : page.unreadCount,
            })),
          };
        },
      );

      return { previousData };
    },
    onError: (_err, _id, context) => {
      // Rollback on error
      if (context?.previousData) {
        queryClient.setQueryData(notificationsQueryKey, context.previousData);
      }
    },
  });
}
