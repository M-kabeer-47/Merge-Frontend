"use client";
import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { IoNotificationsOutline } from "react-icons/io5";
import { useRouter } from "next/navigation";
import { formatDistanceToNow } from "date-fns/formatDistanceToNow";
import InfiniteScroll from "react-infinite-scroll-component";
import { useFetchNotifications } from "@/hooks/notifications/use-fetch-notifications";
import { useMarkNotificationRead } from "@/hooks/notifications/use-mark-notification-read";
import { useMarkAllNotificationsRead } from "@/hooks/notifications/use-mark-all-notifications-read";
import {
  getNotificationType,
  getNotificationIcon,
  type NotificationPayload,
} from "@/types/notification";

export default function NotificationDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // React Query hooks with infinite scroll
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
    // Mark as read if unread
    if (!notification.isRead) {
      markAsRead(notification.id);
    }

    // Navigate to actionUrl
    if (notification.metadata.actionUrl) {
      router.push(notification.metadata.actionUrl);
    }

    // Close dropdown
    setIsOpen(false);
  };

  const handleViewAll = () => {
    // TODO: Navigate to full notifications page if exists
    setIsOpen(false);
  };

  const handleMarkAllRead = () => {
    markAllAsRead();
  };

  const formatTime = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    } catch {
      return "";
    }
  };

  return (
    <div className="relative top-[3px] sm:top-0">
      {/* Notification Bell */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className=" relative cursor-pointer group"
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

      {/* Notification Dropdown */}
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
                <motion.button
                  onClick={handleMarkAllRead}
                  className="text-sm text-primary hover:text-primary/80 font-medium"
                >
                  Mark all read
                </motion.button>
              )}
            </div>

            {/* Notifications List with Infinite Scroll */}
            <div
              id="notificationsScrollContainer"
              ref={scrollContainerRef}
              className="max-h-80 overflow-y-auto"
            >
              {isLoading ? (
                <div className="p-8 text-center">
                  <div className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full mx-auto"></div>
                  <p className="text-para-muted mt-2">Loading...</p>
                </div>
              ) : notifications.length === 0 ? (
                <div className="p-8 text-center">
                  <div className="text-4xl mb-2">🔔</div>
                  <p className="text-para-muted">No notifications yet</p>
                </div>
              ) : (
                <InfiniteScroll
                  dataLength={notifications.length}
                  next={fetchNextPage}
                  hasMore={!!hasNextPage}
                  scrollThreshold={0.9}
                  loader={
                    isFetchingNextPage ? (
                      <div className="flex justify-center py-4">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                      </div>
                    ) : null
                  }
                  scrollableTarget="notificationsScrollContainer"
                  endMessage={
                    notifications.length > 5 ? (
                      <p className="text-center text-para-muted text-xs py-3">
                        No more notifications
                      </p>
                    ) : null
                  }
                >
                  {notifications.map((notification) => {
                    const type = getNotificationType(notification.metadata);
                    const icon = getNotificationIcon(type);

                    return (
                      <motion.div
                        key={notification.id}
                        className={`p-4 border-b border-primary/5 hover:bg-primary/5 cursor-pointer transition-colors ${
                          !notification.isRead ? "bg-primary/5" : ""
                        }`}
                        onClick={() => handleNotificationClick(notification)}
                        whileHover={{ backgroundColor: "rgba(0,0,0,0.02)" }}
                      >
                        <div className="flex items-start gap-3">
                          {/* Notification Icon */}
                          <div className="text-lg flex-shrink-0 mt-0.5">
                            {icon}
                          </div>

                          {/* Content */}
                          <div className="flex-1 min-w-0">
                            <p
                              className={`text-sm ${
                                !notification.isRead
                                  ? "font-medium text-heading"
                                  : "text-para"
                              }`}
                            >
                              {notification.content}
                            </p>
                            <p className="text-xs text-para-muted mt-1">
                              {formatTime(notification.createdAt)}
                            </p>
                          </div>

                          {/* Unread Indicator */}
                          {!notification.isRead && (
                            <div className="w-2 h-2 bg-primary/80 rounded-full mt-2 flex-shrink-0"></div>
                          )}
                        </div>
                      </motion.div>
                    );
                  })}
                </InfiniteScroll>
              )}
            </div>

            {/* Footer */}
            <div className="p-3 bg-gray-50 text-center border-t border-gray-100">
              <motion.button
                onClick={handleViewAll}
                className="text-sm text-primary font-medium cursor-pointer"
              >
                View all notifications
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Close dropdown when clicking outside */}
      {isOpen && (
        <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
      )}
    </div>
  );
}
