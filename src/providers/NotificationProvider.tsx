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
import { toast } from "sonner";
import {
  addNotificationToCache,
  invalidateStudentAssignmentsCache,
  invalidateStudentQuizzesCache,
} from "@/lib/cache";
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
    deviceId = crypto.randomUUID();
    localStorage.setItem("merge_device_id", deviceId);
  }
  return deviceId;
}

// Extract a canonical dedup key from notification data.
// Both Socket.IO notifications (with DB id) and FCM postMessages
// (with content-type IDs) need to resolve to the same key.
function getDeduplicationKey(notification: {
  id?: string;
  metadata?: Record<string, string>;
}): string {
  const meta = notification.metadata;
  // Prefer the content-type ID as canonical key (same across Socket + FCM)
  return (
    meta?.announcementId ||
    meta?.assignmentId ||
    meta?.quizId ||
    meta?.eventId ||
    notification.id ||
    `unknown-${Date.now()}`
  );
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

  // Sync status from backend user data (source of truth)
  useEffect(() => {
    if (typeof window === "undefined") return;

    // Backend notificationStatus is the source of truth per user.
    // Browser Notification.permission is per-origin and persists across users,
    // so it must NOT override the backend status.
    if (user?.notificationStatus) {
      setStatus(user.notificationStatus);
    } else if (Notification.permission === "denied") {
      // If browser explicitly denied, reflect that
      setStatus("denied");
    }
  }, [user?.notificationStatus]);

  // Token refresh: on each app load, check if FCM token changed and re-register.
  // Only runs if the user has explicitly opted in (backend status "allowed")
  // AND the browser still has permission granted.
  useEffect(() => {
    if (!isAuthenticated || typeof window === "undefined") return;
    if (user?.notificationStatus !== "allowed") return;
    if (Notification.permission !== "granted") return;

    const refreshToken = async () => {
      try {
        const currentToken = await requestFCMToken();
        if (!currentToken) return;

        const lastToken = localStorage.getItem("merge_fcm_token");
        if (currentToken !== lastToken) {
          localStorage.setItem("merge_fcm_token", currentToken);
          registerToken({
            notificationStatus: "allowed",
            token: currentToken,
            deviceType: "web",
            deviceId: getDeviceId(),
          });
        }
      } catch (error) {
        console.error("[Notifications] Token refresh failed:", error);
      }
    };

    refreshToken();
  }, [isAuthenticated, user?.notificationStatus, registerToken]);

  // Track shown notification dedup keys to prevent duplicates across Socket + FCM
  const shownNotificationKeys = useRef<Set<string>>(new Set());

  // BroadcastChannel for cross-tab deduplication
  const broadcastChannel = useRef<BroadcastChannel | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const channel = new BroadcastChannel("merge-notifications");
    broadcastChannel.current = channel;

    // When another tab shows a notification, add its key to our dedup set
    channel.onmessage = (event: MessageEvent) => {
      if (event.data?.type === "NOTIFICATION_SHOWN" && event.data?.key) {
        shownNotificationKeys.current.add(event.data.key);
      }
    };

    return () => {
      channel.close();
      broadcastChannel.current = null;
    };
  }, []);

  // Helper: check dedup + broadcast to other tabs, show toast only if focused
  const handleIncomingNotification = useCallback(
    (notification: NotificationPayload) => {
      const dedupKey = getDeduplicationKey(notification);

      // Deduplicate across sources (Socket + FCM) and tabs
      if (shownNotificationKeys.current.has(dedupKey)) {
        return;
      }
      shownNotificationKeys.current.add(dedupKey);

      // Broadcast to other tabs so they skip this notification
      broadcastChannel.current?.postMessage({
        type: "NOTIFICATION_SHOWN",
        key: dedupKey,
      });

      // Add to React Query cache for persistence
      addNotificationToCache(queryClient, notification);

      // Update local state
      setNotifications((prev) => {
        if (prev.some((n) => n.id === notification.id)) return prev;
        return [notification, ...prev];
      });

      // Invalidate assignment/quiz cache for students
      const { roomId, assignmentId, quizId } = notification.metadata;
      if (roomId) {
        if (assignmentId)
          invalidateStudentAssignmentsCache(queryClient, roomId);
        if (quizId) invalidateStudentQuizzesCache(queryClient, roomId);
      }

      // Only show toast when this tab is focused
      if (!document.hidden) {
        const actionUrl = notification.metadata.actionUrl;
        toast(notification.content, {
          id: dedupKey,
          description: notification.metadata.roomTitle || undefined,
          duration: 8000,
          style: {
            background: "var(--toast-bg)",
            color: "var(--para)",
            border: "1px solid var(--light-border)",
            borderLeft: "4px solid var(--primary)",
          },
          actionButtonStyle: {
            color: "var(--primary)",
            fontWeight: 600,
          },
          action: actionUrl
            ? {
                label: "View →",
                onClick: () => {
                  window.location.href = actionUrl;
                },
              }
            : undefined,
        });
      }
    },
    [queryClient],
  );

  // Connect Socket.IO when authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      disconnectNotificationSocket();
      setSocketConnected(false);
      return;
    }

    const connect = async () => {
      await connectNotificationSocket({
        onConnect: () => setSocketConnected(true),
        onDisconnect: () => setSocketConnected(false),
        onNotification: (notification) => {
          handleIncomingNotification(notification);
        },
      });
    };

    connect();

    return () => {
      disconnectNotificationSocket();
      shownNotificationKeys.current.clear();
    };
  }, [isAuthenticated, handleIncomingNotification]);

  // Listen for FCM messages from service worker (when app is focused)
  useEffect(() => {
    if (!isAuthenticated) return;

    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === "FCM_NOTIFICATION") {
        const data = event.data.payload?.data || {};

        // Build notification payload from FCM data
        const notificationId =
          data.announcementId ||
          data.assignmentId ||
          data.quizId ||
          data.eventId ||
          `fcm-${Date.now()}`;

        const notification: NotificationPayload = {
          id: notificationId,
          content:
            data.title ||
            data.announcementTitle ||
            data.assignmentTitle ||
            data.quizTitle ||
            "New Notification",
          isRead: false,
          metadata: {
            actionUrl: data.actionUrl,
            roomId: data.roomId,
            roomTitle: data.roomTitle || data.body,
            announcementId: data.announcementId,
            assignmentId: data.assignmentId,
            quizId: data.quizId,
          },
          expiresAt: null,
          createdAt: new Date().toISOString(),
        };

        handleIncomingNotification(notification);
      }
    };

    navigator.serviceWorker?.addEventListener("message", handleMessage);

    return () => {
      navigator.serviceWorker?.removeEventListener("message", handleMessage);
    };
  }, [isAuthenticated, handleIncomingNotification]);

  // Refresh caches when user returns to app (after being in background)
  useEffect(() => {
    if (!isAuthenticated) return;

    const handleVisibilityChange = () => {
      if (!document.hidden) {
        const path = window.location.pathname;
        const roomMatch = path.match(/\/rooms\/([^/]+)/);
        const roomId = roomMatch?.[1];

        if (roomId) {
          queryClient.invalidateQueries({
            queryKey: ["assignments", roomId, "student"],
          });
          queryClient.invalidateQueries({
            queryKey: ["quizzes", roomId, "student"],
          });
        }

        queryClient.invalidateQueries({
          queryKey: ["notifications"],
        });
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [isAuthenticated, queryClient]);

  // Request permission handler (used by settings page)
  const requestPermission = useCallback(async () => {
    if (typeof window === "undefined") return;

    try {
      const permission = await Notification.requestPermission();

      if (permission === "granted") {
        setStatus("allowed");

        const token = await requestFCMToken();
        if (token) {
          localStorage.setItem("merge_fcm_token", token);
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
