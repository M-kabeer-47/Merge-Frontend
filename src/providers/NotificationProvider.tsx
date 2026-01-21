"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
  type ReactNode,
} from "react";
import { useAuth } from "./AuthProvider";
import { requestFCMToken } from "@/lib/firebase";
import {
  connectNotificationSocket,
  disconnectNotificationSocket,
} from "@/lib/notification-socket";
import { useRegisterFCMToken } from "@/hooks/notifications/use-register-fcm-token";
import { useQueryClient } from "@tanstack/react-query";
import { notificationsQueryKey } from "@/hooks/notifications/use-fetch-notifications";
import { toast } from "sonner";
import type {
  NotificationStatus,
  NotificationPayload,
  NotificationContextValue,
} from "@/types/notification";

// Context
const NotificationContext = createContext<NotificationContextValue | null>(
  null,
);

// Generate a unique device ID for this browser
function getDeviceId(): string {
  if (typeof window === "undefined") return "";

  let deviceId = localStorage.getItem("merge_device_id");
  if (!deviceId) {
    deviceId = `web_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
    localStorage.setItem("merge_device_id", deviceId);
  }
  return deviceId;
}

interface NotificationProviderProps {
  children: ReactNode;
}

export function NotificationProvider({ children }: NotificationProviderProps) {
  const { user, isAuthenticated } = useAuth();
  const { mutate: registerToken } = useRegisterFCMToken();
  const queryClient = useQueryClient();

  // State - simplified since FCM init is handled by NotificationTrigger
  const [status, setStatus] = useState<NotificationStatus>("default");
  const [socketConnected, setSocketConnected] = useState(false);
  const [notifications, setNotifications] = useState<NotificationPayload[]>([]);

  // Sync status from user data OR browser permission
  useEffect(() => {
    if (typeof window === "undefined") return;

    // Check browser permission first
    if (Notification.permission === "granted") {
      setStatus("allowed");
      return;
    } else if (Notification.permission === "denied") {
      setStatus("denied");
      return;
    }

    // Otherwise use backend status
    if (user?.notificationStatus) {
      setStatus(user.notificationStatus);
    }
  }, [user?.notificationStatus]);

  // NOTE: FCM token registration is now handled by NotificationTrigger component
  // which only runs once after login with ?askNotifications=true param

  // Connect Socket.IO ALWAYS when authenticated (for real-time updates)
  // Track shown notification IDs to prevent duplicates
  const shownNotificationIds = useRef<Set<string>>(new Set());

  useEffect(() => {
    if (!isAuthenticated) {
      disconnectNotificationSocket();
      setSocketConnected(false);
      return;
    }

    // Connect with callbacks (async function)
    const connect = async () => {
      await connectNotificationSocket({
        onConnect: () => setSocketConnected(true),
        onDisconnect: () => setSocketConnected(false),
        onNotification: (notification) => {
          console.log("[Socket.IO] Received notification:", notification);

          // Deduplicate: skip if we've already shown this notification
          if (shownNotificationIds.current.has(notification.id)) {
            console.log(
              "[Socket.IO] Skipping duplicate notification:",
              notification.id,
            );
            return;
          }
          shownNotificationIds.current.add(notification.id);

          // Add to React Query cache for persistence (InfiniteData structure)
          queryClient.setQueryData(
            notificationsQueryKey,
            (
              old:
                | {
                    pages: Array<{
                      notifications: NotificationPayload[];
                      total: number;
                      unreadCount: number;
                      page: number;
                      hasMore: boolean;
                    }>;
                    pageParams: number[];
                  }
                | undefined,
            ) => {
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
              if (
                firstPage?.notifications.some((n) => n.id === notification.id)
              ) {
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
            },
          );

          // Also update local state for context consumers
          setNotifications((prev) => {
            if (prev.some((n) => n.id === notification.id)) {
              return prev;
            }
            return [notification, ...prev];
          });

          // Only show in-app toast when app is focused
          // Background push notifications are handled by FCM service worker
          if (!document.hidden) {
            const actionUrl = notification.metadata.actionUrl;
            console.log("[Socket.IO] Showing toast, actionUrl:", actionUrl);

            toast(notification.content, {
              id: notification.id, // Use notification ID to prevent duplicate toasts
              description: notification.metadata.roomTitle || undefined,
              duration: 8000,
              action: actionUrl
                ? {
                    label: "View →",
                    onClick: () => {
                      console.log(
                        "[Socket.IO] Toast action clicked:",
                        actionUrl,
                      );
                    },
                  }
                : undefined,
            });
          }
        },
      });
    };

    connect();

    return () => {
      disconnectNotificationSocket();
      // Clear shown IDs when disconnecting
      shownNotificationIds.current.clear();
    };
  }, [isAuthenticated]);

  // NOTE: We don't listen for FCM foreground messages here because:
  // 1. Socket.IO already handles real-time notifications when app is open
  // 2. FCM foreground + Socket.IO would cause duplicate notifications
  // FCM is only used for background/closed app notifications via service worker

  // Request permission handler (used by settings page)
  const requestPermission = useCallback(async () => {
    if (typeof window === "undefined") return;

    try {
      const permission = await Notification.requestPermission();

      if (permission === "granted") {
        setStatus("allowed");

        // Get FCM token and register
        const token = await requestFCMToken();
        if (token) {
          registerToken({
            notificationStatus: "allowed",
            token,
            deviceType: "web",
            deviceId: getDeviceId(),
          });
        }
      } else {
        setStatus("denied");
        registerToken({
          notificationStatus: "denied",
          deviceType: "web",
          deviceId: getDeviceId(),
        });
      }
    } catch (error) {
      console.error("[Notifications] Permission request failed:", error);
    }
  }, [registerToken]);

  // Notification management
  const markAsRead = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)),
    );
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  }, []);

  const clearAll = useCallback(() => {
    setNotifications([]);
  }, []);

  // Computed values
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const value: NotificationContextValue = {
    status,
    isSocketConnected: socketConnected,
    notifications,
    unreadCount,
    requestPermission,
    markAsRead,
    markAllAsRead,
    clearAll,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}

/**
 * Hook to access notification context
 */
export function useNotifications(): NotificationContextValue {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error(
      "useNotifications must be used within NotificationProvider",
    );
  }
  return context;
}

// NOTE: useShouldShowNotificationPrompt removed - we now use NotificationTrigger
// component with URL param approach instead of custom prompt
