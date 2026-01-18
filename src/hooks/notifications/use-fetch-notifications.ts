/**
 * Hook to fetch notifications with infinite scroll
 */
import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import api from "@/utils/api";
import type { NotificationPayload } from "@/types/notification";

interface NotificationsPage {
  notifications: NotificationPayload[];
  total: number;
  unreadCount: number;
  page: number;
  hasMore: boolean;
}

export const notificationsQueryKey = ["notifications"] as const;

interface FetchNotificationsParams {
  pageParam: number;
  limit?: number;
}

async function fetchNotifications({
  pageParam,
  limit = 7,
}: FetchNotificationsParams): Promise<NotificationsPage> {
  const response = await api.get<NotificationsPage>("/notifications", {
    params: { page: pageParam, limit },
  });
  return response.data;
}

export function useFetchNotifications() {
  const queryClient = useQueryClient();

  const query = useInfiniteQuery({
    queryKey: notificationsQueryKey,
    queryFn: ({ pageParam }) => fetchNotifications({ pageParam }),
    getNextPageParam: (lastPage: NotificationsPage) => {
      // If last page has notifications and hasMore is true, return next page
      return lastPage.hasMore ? lastPage.page + 1 : undefined;
    },
    initialPageParam: 1,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: true,
  });

  // Flatten all pages into single array (newest first)
  const notifications: NotificationPayload[] =
    query.data?.pages.flatMap((p) => p.notifications) || [];

  // Calculate total unread from first page (most accurate)
  const unreadCount = query.data?.pages[0]?.unreadCount ?? 0;

  // Add a new notification from socket to the cache
  const addSocketNotification = (notification: NotificationPayload) => {
    queryClient.setQueryData(
      notificationsQueryKey,
      (old: typeof query.data) => {
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

        // Check if notification already exists
        const exists = firstPage?.notifications.some(
          (n) => n.id === notification.id,
        );
        if (exists) return old;

        // Add to the first page (most recent)
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
      },
    );
  };

  // Update notification status in cache (for mark as read)
  const updateNotificationInCache = (
    notificationId: string,
    updates: Partial<NotificationPayload>,
  ) => {
    queryClient.setQueryData(
      notificationsQueryKey,
      (old: typeof query.data) => {
        if (!old) return old;

        return {
          ...old,
          pages: old.pages.map((page) => ({
            ...page,
            notifications: page.notifications.map((n) =>
              n.id === notificationId ? { ...n, ...updates } : n,
            ),
            unreadCount:
              updates.isRead === true
                ? Math.max(0, page.unreadCount - 1)
                : page.unreadCount,
          })),
        };
      },
    );
  };

  // Mark all as read in cache
  const markAllAsReadInCache = () => {
    queryClient.setQueryData(
      notificationsQueryKey,
      (old: typeof query.data) => {
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
  };

  return {
    notifications,
    unreadCount,
    isLoading: query.isLoading,
    isFetchingNextPage: query.isFetchingNextPage,
    hasNextPage: query.hasNextPage,
    fetchNextPage: query.fetchNextPage,
    isError: query.isError,
    error: query.error,
    addSocketNotification,
    updateNotificationInCache,
    markAllAsReadInCache,
  };
}
