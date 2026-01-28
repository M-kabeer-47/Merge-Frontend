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
          console.log("Notificaion", notification);
          // Deduplicate: skip if we've already shown this notification
          if (shownNotificationIds.current.has(notification.id)) {
            return;
          }
          shownNotificationIds.current.add(notification.id);

          // Add to React Query cache for persistence
          addNotificationToCache(queryClient, notification);

          // Also update local state for context consumers
          setNotifications((prev) => {
            if (prev.some((n) => n.id === notification.id)) {
              return prev;
            }
            return [notification, ...prev];
          });

          // Invalidate assignment/quiz cache for students (triggers background refetch)
          const { roomId, assignmentId, quizId } = notification.metadata;
          if (roomId) {
            if (assignmentId) {
              invalidateStudentAssignmentsCache(queryClient, roomId);
            }
            if (quizId) {
              invalidateStudentQuizzesCache(queryClient, roomId);
            }
          }

          // Only show in-app toast when app is focused
          // Background push notifications are handled by FCM service worker
          if (!document.hidden) {
            const actionUrl = notification.metadata.actionUrl;

            toast(notification.content, {
              id: notification.id, // Use notification ID to prevent duplicate toasts
              description: notification.metadata.roomTitle || undefined,
              duration: 8000,
              action: actionUrl
                ? {
                    label: "View →",
                    onClick: () => {},
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

  // Listen for messages from service worker (when app is focused)
  // SW sends notification data via postMessage instead of showing native push
  useEffect(() => {
    if (!isAuthenticated) return;

    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === "FCM_NOTIFICATION") {
        const data = event.data.payload?.data || {};
        const notificationId =
          data.announcementId ||
          data.assignmentId ||
          data.quizId ||
          `fcm-${Date.now()}`;

        // Deduplicate
        if (shownNotificationIds.current.has(notificationId)) {
          return;
        }
        shownNotificationIds.current.add(notificationId);

        // Build notification payload
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

        // Add to cache
        addNotificationToCache(queryClient, notification);

        // Update local state
        setNotifications((prev) => {
          if (prev.some((n) => n.id === notification.id)) return prev;
          return [notification, ...prev];
        });

        // Invalidate assignment/quiz cache
        const { roomId, assignmentId, quizId } = notification.metadata;
        if (roomId) {
          if (assignmentId)
            invalidateStudentAssignmentsCache(queryClient, roomId);
          if (quizId) invalidateStudentQuizzesCache(queryClient, roomId);
        }

        // Show toast
        toast(notification.content, {
          id: notification.id,
          description: notification.metadata.roomTitle || undefined,
          duration: 8000,
          action: notification.metadata.actionUrl
            ? {
                label: "View →",
                onClick: () => {},
              }
            : undefined,
        });
      }
    };

    navigator.serviceWorker?.addEventListener("message", handleMessage);

    return () => {
      navigator.serviceWorker?.removeEventListener("message", handleMessage);
    };
  }, [isAuthenticated, queryClient]);

  // Refresh caches when user returns to app (after being in background)
  // This ensures they see latest data after receiving background notifications
  useEffect(() => {
    if (!isAuthenticated) return;

    const handleVisibilityChange = () => {
      if (!document.hidden) {
        // Get current room ID from URL if available
        const path = window.location.pathname;
        const roomMatch = path.match(/\/rooms\/([^/]+)/);
        const roomId = roomMatch?.[1];

        if (roomId) {
          // Invalidate assignment and quiz caches for this room
          queryClient.invalidateQueries({
            queryKey: ["assignments", roomId, "student"],
          });
          queryClient.invalidateQueries({
            queryKey: ["quizzes", roomId, "student"],
          });
        }

        // Always refresh notifications
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
