"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { IoNotificationsOutline } from "react-icons/io5";
import { useRouter } from "next/navigation";
import { formatDistanceToNow } from "date-fns/formatDistanceToNow";
import { useFetchNotifications } from "@/hooks/notifications/use-fetch-notifications";
import { useMarkNotificationRead } from "@/hooks/notifications/use-mark-notification-read";
import { useMarkAllNotificationsRead } from "@/hooks/notifications/use-mark-all-notifications-read";
import {
  getNotificationType,
  getNotificationIcon,
  type NotificationPayload,
} from "@/types/notification";
import AllNotificationsModal from "@/components/notifications/AllNotificationsModal";
import { Button } from "@/components/ui/Button";

const MAX_PREVIEW_NOTIFICATIONS = 10;

// ============================================
// Notification Item Component (Dropdown Version)
// ============================================
interface DropdownItemProps {
  notification: NotificationPayload;
  onClick: (notification: NotificationPayload) => void;
}

function DropdownItem({ notification, onClick }: DropdownItemProps) {
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
      key={notification.id}
      className={`p-4 border-b border-primary/5 hover:bg-primary/5 cursor-pointer transition-colors ${
        !notification.isRead ? "bg-primary/5" : ""
      }`}
      onClick={() => onClick(notification)}
      whileHover={{ backgroundColor: "rgba(0,0,0,0.02)" }}
    >
      <div className="flex items-start gap-3">
        <div className="text-lg flex-shrink-0 mt-0.5">{icon}</div>
        <div className="flex-1 min-w-0">
          <p
            className={`text-sm ${
              !notification.isRead ? "font-medium text-heading" : "text-para"
            }`}
          >
            {notification.content}
          </p>
          <p className="text-xs text-para-muted mt-1">
            {formatTime(notification.createdAt)}
          </p>
        </div>
        {!notification.isRead && (
          <div className="w-2 h-2 bg-primary/80 rounded-full mt-2 flex-shrink-0" />
        )}
      </div>
    </motion.div>
  );
}

// ============================================
// Main Dropdown Component
// ============================================
export default function NotificationDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();

  const { notifications, unreadCount, isLoading } = useFetchNotifications();
  const { mutate: markAsRead } = useMarkNotificationRead();
  const { mutate: markAllAsRead } = useMarkAllNotificationsRead();

  // Show only first 10 notifications
  const previewNotifications = notifications.slice(
    0,
    MAX_PREVIEW_NOTIFICATIONS,
  );
  const hasMoreNotifications = notifications.length > MAX_PREVIEW_NOTIFICATIONS;

  const handleNotificationClick = (notification: NotificationPayload) => {
    if (!notification.isRead) {
      markAsRead(notification.id);
    }
    if (notification.metadata.actionUrl) {
      router.push(notification.metadata.actionUrl);
    }
    setIsOpen(false);
  };

  const handleViewAll = () => {
    setIsOpen(false);
    setIsModalOpen(true);
  };

  return (
    <div className="relative top-[3px] sm:top-0">
      {/* Notification Bell */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="relative cursor-pointer group"
      >
        <IoNotificationsOutline
          className="h-5 w-5 text-para-muted group-hover:text-primary transition-colors"
          strokeWidth={2}
        />
        {unreadCount > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-2 -right-2 bg-primary text-white text-[10px] rounded-full h-4 w-4 flex items-center justify-center font-medium"
          >
            {unreadCount > 99 ? "99+" : unreadCount}
          </motion.span>
        )}
      </motion.button>

      {/* Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute right-0 top-12 w-80 bg-background rounded-lg shadow-lg border border-light-border z-50"
          >
            {/* Header */}
            <div className="p-4 border-b border-light-border flex items-center justify-between">
              <h3 className="font-semibold text-heading">Notifications</h3>
              {unreadCount > 0 && (
                <Button
                  variant="link"
                  size="sm"
                  onClick={() => markAllAsRead()}
                  className="h-auto p-0 min-w-0 text-primary hover:text-primary/80"
                >
                  Mark all read
                </Button>
              )}
            </div>

            {/* List */}
            <div className="max-h-80 overflow-y-auto">
              {isLoading ? (
                <div className="p-8 text-center">
                  <div className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full mx-auto"></div>
                  <p className="text-para-muted mt-2">Loading...</p>
                </div>
              ) : previewNotifications.length === 0 ? (
                <div className="p-8 text-center">
                  <div className="text-4xl mb-2">🔔</div>
                  <p className="text-para-muted">No notifications yet</p>
                </div>
              ) : (
                previewNotifications.map((notification) => (
                  <DropdownItem
                    key={notification.id}
                    notification={notification}
                    onClick={handleNotificationClick}
                  />
                ))
              )}
            </div>

            {/* Footer */}
            <div className="p-3 bg-background text-center border-t border-border">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleViewAll}
                className="w-full text-primary font-medium hover:text-primary hover:bg-primary/5"
              >
                View all notifications
                {hasMoreNotifications && (
                  <span className="text-para-muted ml-1 font-normal">
                    (+{notifications.length - MAX_PREVIEW_NOTIFICATIONS} more)
                  </span>
                )}
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Close when clicking outside */}
      {isOpen && (
        <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
      )}

      {/* Modal */}
      <AllNotificationsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
