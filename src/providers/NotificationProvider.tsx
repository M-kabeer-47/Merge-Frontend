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
import { requestFCMToken, onForegroundMessage } from "@/lib/firebase";
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
import { getNotificationType, getNotificationIcon } from "@/types/notification";

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

  // State
  const [status, setStatus] = useState<NotificationStatus>("default");
  const [isInitialized, setIsInitialized] = useState(false);
  const [fcmToken, setFcmToken] = useState<string | null>(null);
  const [socketConnected, setSocketConnected] = useState(false);
  const [notifications, setNotifications] = useState<NotificationPayload[]>([]);
  const [showPrompt, setShowPrompt] = useState(false);

  // Sync status from user data OR browser permission
  useEffect(() => {
    if (typeof window === "undefined") return;

    // If browser already has permission but backend says default, auto-sync
    if (
      user?.notificationStatus === "default" ||
      user?.notificationStatus === undefined
    ) {
      // Browser API uses "granted", we map it to our "allowed" status
      if (Notification.permission === "granted") {
        console.log(
          "[Notifications] Browser has permission, syncing to 'allowed'",
        );
        setStatus("allowed");
        return;
      } else if (Notification.permission === "denied") {
        setStatus("denied");
        return;
      }
    }

    // Otherwise use backend status
    if (user?.notificationStatus) {
      setStatus(user.notificationStatus);
    }
  }, [user?.notificationStatus]);

  // Initialize FCM when status is "allowed"
  useEffect(() => {
    console.log("[FCM Init] Check:", {
      isAuthenticated,
      status,
      isInitialized,
    });

    if (!isAuthenticated || status !== "allowed" || isInitialized) {
      console.log("[FCM Init] Skipping - conditions not met");
      return;
    }

    const initializeFCM = async () => {
      try {
        console.log("[FCM Init] Starting FCM initialization...");
        const token = await requestFCMToken();
        if (token) {
          console.log("[FCM Init] Got token, registering with backend...");
          setFcmToken(token);

          // Register token with backend
          registerToken({
            notificationStatus: "allowed",
            token,
            deviceType: "web",
            deviceId: getDeviceId(),
          });
        } else {
          console.log("[FCM Init] No token returned");
        }
        setIsInitialized(true);
      } catch (error) {
        console.error("[FCM Init] FCM initialization failed:", error);
      }
    };

    initializeFCM();
  }, [isAuthenticated, status, isInitialized, registerToken]);

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

  // Request permission handler
  const requestPermission = useCallback(async () => {
    if (typeof window === "undefined") return;

    try {
      const permission = await Notification.requestPermission();

      // Browser API returns "granted", we use "allowed" for our status
      if (permission === "granted") {
        setStatus("allowed");

        // Get FCM token
        const token = await requestFCMToken();
        if (token) {
          setFcmToken(token);
          registerToken({
            notificationStatus: "allowed",
            token,
            deviceType: "web",
            deviceId: getDeviceId(),
          });
        }
        setIsInitialized(true);
      } else {
        setStatus("denied");
        registerToken({
          notificationStatus: "denied",
          deviceType: "web",
          deviceId: getDeviceId(),
        });
      }

      setShowPrompt(false);
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
    isInitialized,
    fcmToken,
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

/**
 * Check if we should show the notification prompt
 * Shows when: status is "default", undefined, or not set yet
 */
export function useShouldShowNotificationPrompt(): boolean {
  const { user, isAuthenticated } = useAuth();

  // Don't show if not authenticated
  if (!isAuthenticated || !user) return false;

  // Don't show if browser already has permission (browser uses "granted")
  if (typeof window !== "undefined" && Notification.permission === "granted") {
    return false;
  }

  // Show if user's DB status is "default" or undefined
  const status = user.notificationStatus;
  return status === "default" || status === undefined;
}
