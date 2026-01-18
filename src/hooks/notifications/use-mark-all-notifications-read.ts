/**
 * Hook to mark all notifications as read
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

export function useMarkAllNotificationsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      await api.patch("/notifications/read-all");
    },
    onMutate: async () => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: notificationsQueryKey });

      // Snapshot previous value
      const previousData = queryClient.getQueryData<NotificationsData>(
        notificationsQueryKey,
      );

      // Optimistically update all to read
      queryClient.setQueryData<NotificationsData>(
        notificationsQueryKey,
        (old) => {
          if (!old) return old;

          return {
            ...old,
            pages: old.pages.map((page) => ({
              ...page,
              notifications: page.notifications.map((n) => ({
                ...n,
                isRead: true,
              })),
              unreadCount: 0,
            })),
          };
        },
      );

      return { previousData };
    },
    onError: (_err, _vars, context) => {
      // Rollback on error
      if (context?.previousData) {
        queryClient.setQueryData(notificationsQueryKey, context.previousData);
      }
    },
  });
}
