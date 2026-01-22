"use client";

import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import { formatDistanceToNow } from "date-fns/formatDistanceToNow";
import Modal from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { useFetchNotifications } from "@/hooks/notifications/use-fetch-notifications";
import { useMarkNotificationRead } from "@/hooks/notifications/use-mark-notification-read";
import { useMarkAllNotificationsRead } from "@/hooks/notifications/use-mark-all-notifications-read";
import {
  getNotificationType,
  getNotificationIcon,
  type NotificationPayload,
} from "@/types/notification";
import { Bell, Loader2 } from "lucide-react";

// ============================================
// Notification Item Component
// ============================================
interface NotificationItemProps {
  notification: NotificationPayload;
  onClick: (notification: NotificationPayload) => void;
}

function NotificationItem({ notification, onClick }: NotificationItemProps) {
  const type = getNotificationType(notification.metadata);
  const icon = getNotificationIcon(type);

  const formatTime = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    } catch {
      return "";
    }
  };

  return (
    <motion.div
      className={`p-4 rounded-xl border cursor-pointer transition-all ${
        !notification.isRead
          ? "bg-primary/5 border-primary/20 hover:border-primary/40"
          : "border-light-border hover:border-primary/20 hover:bg-primary/5"
      }`}
      onClick={() => onClick(notification)}
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
    >
      <div className="flex items-start gap-3">
        {/* Notification Icon */}
        <div className="text-xl flex-shrink-0 mt-0.5">{icon}</div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <p
            className={`text-sm ${
              !notification.isRead ? "font-medium text-heading" : "text-para"
            }`}
          >
            {notification.content}
          </p>
          <p className="text-xs text-para-muted mt-1.5">
            {formatTime(notification.createdAt)}
          </p>
        </div>

        {/* Unread Indicator */}
        {!notification.isRead && (
          <div className="w-2.5 h-2.5 bg-primary rounded-full mt-2 flex-shrink-0" />
        )}
      </div>
    </motion.div>
  );
}

// ============================================
// Notifications List Component
// ============================================
interface NotificationsListProps {
  notifications: NotificationPayload[];
  isLoading: boolean;
  isFetchingNextPage: boolean;
  hasNextPage: boolean;
  onNotificationClick: (notification: NotificationPayload) => void;
  onLoadMore: () => void;
}

function NotificationsList({
  notifications,
  isLoading,
  isFetchingNextPage,
  hasNextPage,
  onNotificationClick,
  onLoadMore,
}: NotificationsListProps) {
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-para-muted mt-3">Loading notifications...</p>
      </div>
    );
  }

  if (notifications.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <div className="text-6xl mb-4">🔔</div>
        <p className="text-para-muted text-lg">No notifications yet</p>
        <p className="text-para-muted text-sm mt-1">
          We&apos;ll notify you when something happens
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {notifications.map((notification) => (
        <NotificationItem
          key={notification.id}
          notification={notification}
          onClick={onNotificationClick}
        />
      ))}

      {/* Load more section */}
      <div className="py-4 flex justify-center">
        {isFetchingNextPage ? (
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        ) : hasNextPage ? (
          <Button variant="link" onClick={onLoadMore}>
            Load more notifications
          </Button>
        ) : notifications.length > 5 ? (
          <p className="text-sm text-para-muted">
            You&apos;ve seen all notifications
          </p>
        ) : null}
      </div>
    </div>
  );
}

// ============================================
// Modal Header Actions Component
// ============================================
interface ModalHeaderActionsProps {
  unreadCount: number;
  onMarkAllRead: () => void;
}

function ModalHeaderActions({
  unreadCount,
  onMarkAllRead,
}: ModalHeaderActionsProps) {
  return (
    <div className="flex items-center justify-between mb-4 -mt-2">
      <p className="text-sm text-para-muted">
        {unreadCount > 0 ? `${unreadCount} unread` : "All caught up!"}
      </p>
      {unreadCount > 0 && (
        <Button variant="link" onClick={onMarkAllRead} className="min-w-0 p-0">
          Mark all as read
        </Button>
      )}
    </div>
  );
}

// ============================================
// Main Modal Component
// ============================================
interface AllNotificationsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AllNotificationsModal({
  isOpen,
  onClose,
}: AllNotificationsModalProps) {
  const router = useRouter();

  const {
    notifications,
    unreadCount,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  } = useFetchNotifications();

  const { mutate: markAsRead } = useMarkNotificationRead();
  const { mutate: markAllAsRead } = useMarkAllNotificationsRead();

  const handleNotificationClick = (notification: NotificationPayload) => {
    if (!notification.isRead) {
      markAsRead(notification.id);
    }

    if (notification.metadata.actionUrl) {
      router.push(notification.metadata.actionUrl);
    }

    onClose();
  };

  const handleLoadMore = () => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="All Notifications"
      icon={<Bell className="w-6 h-6 text-primary" />}
      maxWidth="xl"
    >
      <ModalHeaderActions
        unreadCount={unreadCount}
        onMarkAllRead={() => markAllAsRead()}
      />

      <div className="h-[50vh] overflow-y-auto -mx-6 px-6">
        <NotificationsList
          notifications={notifications}
          isLoading={isLoading}
          isFetchingNextPage={isFetchingNextPage}
          hasNextPage={!!hasNextPage}
          onNotificationClick={handleNotificationClick}
          onLoadMore={handleLoadMore}
        />
      </div>
    </Modal>
  );
}
