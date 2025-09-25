"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { IoNotificationsOutline } from "react-icons/io5";

interface Notification {
  id: number;
  title: string;
  time: string;
  unread: boolean;
  type?: "message" | "system" | "reminder";
}

interface NotificationDropdownProps {
  notifications?: Notification[];
  notificationCount?: number;
  onNotificationClick?: (notification: Notification) => void;
  onViewAll?: () => void;
  onMarkAllRead?: () => void;
}

const defaultNotifications: Notification[] = [
  {
    id: 1,
    title: "New message in Math Study Group",
    time: "2 min ago",
    unread: true,
    type: "message",
  },
  {
    id: 2,
    title: "Canvas shared with you",
    time: "1 hour ago",
    unread: true,
    type: "system",
  },
  {
    id: 3,
    title: "Live session starting soon",
    time: "2 hours ago",
    unread: false,
    type: "reminder",
  },
  {
    id: 4,
    title: "Assignment deadline approaching",
    time: "1 day ago",
    unread: true,
    type: "reminder",
  },
];

const getNotificationIcon = (type: string) => {
  switch (type) {
    case "message":
      return "💬";
    case "system":
      return "📋";
    case "reminder":
      return "⏰";
    default:
      return "🔔";
  }
};

export default function NotificationDropdown({
  notifications = defaultNotifications,
  notificationCount,
  onNotificationClick,
  onViewAll,
  onMarkAllRead,
}: NotificationDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);

  const unreadCount =
    notificationCount ?? notifications.filter((n) => n.unread).length;

  const handleNotificationClick = (notification: Notification) => {
    if (onNotificationClick) {
      onNotificationClick(notification);
    }
    // Auto close dropdown after clicking a notification
    setIsOpen(false);
  };

  const handleViewAll = () => {
    if (onViewAll) {
      onViewAll();
    }
    setIsOpen(false);
  };

  const handleMarkAllRead = () => {
    if (onMarkAllRead) {
      onMarkAllRead();
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
            className="absolute right-0 top-12 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50"
          >
            {/* Header */}
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
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

            {/* Notifications List */}
            <div className="max-h-80 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="p-8 text-center">
                  <div className="text-4xl mb-2">🔔</div>
                  <p className="text-para-muted">No notifications yet</p>
                </div>
              ) : (
                notifications.map((notification, index) => (
                  <motion.div
                    key={notification.id}
                    className={`p-4 border-b border-primary/5 hover:bg-gray-50 cursor-pointer transition-colors  ${
                      notification.unread ? "bg-primary/5" : ""
                    }`}
                    onClick={() => handleNotificationClick(notification)}
                    whileHover={{ backgroundColor: "#f9fafb" }}
                  >
                    <div className="flex items-start gap-3">
                      {/* Notification Icon */}
                      <div className="text-lg flex-shrink-0 mt-0.5">
                        {getNotificationIcon(notification.type || "default")}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <p
                          className={`text-sm ${
                            notification.unread
                              ? "font-medium text-heading"
                              : "text-para"
                          }`}
                        >
                          {notification.title}
                        </p>
                        <p className="text-xs text-para-muted mt-1">
                          {notification.time}
                        </p>
                      </div>

                      {/* Unread Indicator */}
                      {notification.unread && (
                        <div className="w-2 h-2 bg-primary/80 rounded-full mt-2 flex-shrink-0"></div>
                      )}
                    </div>
                  </motion.div>
                ))
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
