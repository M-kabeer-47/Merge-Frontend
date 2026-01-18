/**
 * Notification Types
 */

export type NotificationStatus = "default" | "allowed" | "denied";

/**
 * Notification metadata varies by type
 */
export interface NotificationMetadata {
  actionUrl?: string;
  roomId?: string;
  roomTitle?: string;
  // Assignment notifications
  assignmentId?: string;
  assignmentTitle?: string;
  // Quiz notifications
  quizId?: string;
  quizTitle?: string;
  // Session notifications
  sessionId?: string;
  sessionTitle?: string;
  // Announcement notifications
  announcementId?: string;
  // Author info
  authorId?: string;
  authorName?: string;
}

/**
 * Notification payload from Socket.IO (matches backend structure)
 */
export interface NotificationPayload {
  id: string;
  content: string;
  isRead: boolean;
  metadata: NotificationMetadata;
  expiresAt: string | null;
  createdAt: string;
}

/**
 * Infer notification type from metadata
 */
export type NotificationType =
  | "assignment"
  | "quiz"
  | "announcement"
  | "session"
  | "room"
  | "general";

export function getNotificationType(
  metadata: NotificationMetadata,
): NotificationType {
  if (metadata.assignmentId) return "assignment";
  if (metadata.quizId) return "quiz";
  if (metadata.sessionId) return "session";
  if (metadata.announcementId) return "announcement";
  if (metadata.roomId && !metadata.assignmentId && !metadata.quizId)
    return "room";
  return "general";
}

/**
 * Get icon for notification type
 */
export function getNotificationIcon(type: NotificationType): string {
  switch (type) {
    case "assignment":
      return "📝";
    case "quiz":
      return "❓";
    case "session":
      return "🎥";
    case "announcement":
      return "📢";
    case "room":
      return "🏠";
    default:
      return "🔔";
  }
}

export interface NotificationContextValue {
  /**
   * User's notification permission status
   */
  status: NotificationStatus;

  /**
   * Whether FCM is initialized and ready
   */
  isInitialized: boolean;

  /**
   * Current FCM token (null if not available)
   */
  fcmToken: string | null;

  /**
   * Whether Socket.IO is connected
   */
  isSocketConnected: boolean;

  /**
   * List of recent notifications
   */
  notifications: NotificationPayload[];

  /**
   * Count of unread notifications
   */
  unreadCount: number;

  /**
   * Request notification permission from user
   */
  requestPermission: () => Promise<void>;

  /**
   * Mark notification as read
   */
  markAsRead: (id: string) => void;

  /**
   * Mark all notifications as read
   */
  markAllAsRead: () => void;

  /**
   * Clear all notifications
   */
  clearAll: () => void;
}

/**
 * FCM Token registration request body
 */
export interface RegisterFCMTokenRequest {
  notificationStatus: "allowed" | "denied";
  token?: string;
  deviceType?: "web" | "android" | "ios";
  deviceId?: string;
}
