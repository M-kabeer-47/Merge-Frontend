"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  IconBell,
  IconSettings,
  IconSun,
  IconMoon,
  IconChevronDown,
  IconUser,
  IconLogout,
} from "@tabler/icons-react";

interface UserProfile {
  name: string;
  role: string;
  initials: string;
  avatar?: string;
}

interface NavbarProps {
  user: UserProfile;
  isDarkMode?: boolean;
  setIsDarkMode: (isDark: boolean) => void;
  onThemeToggle?: () => void;
  notificationCount?: number;
}

export default function Navbar({
  user,
  isDarkMode = false,
  onThemeToggle,
  notificationCount = 3,
  setIsDarkMode,
}: NavbarProps) {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);

  const handleThemeToggle = () => {
    setIsDarkMode(!isDarkMode);
    if (onThemeToggle) onThemeToggle();
    console.log("Theme toggled:", isDarkMode ? "light" : "dark");
  };

  const notifications = [
    {
      id: 1,
      title: "New message in Math Study Group",
      time: "2 min ago",
      unread: true,
    },
    {
      id: 2,
      title: "Canvas shared with you",
      time: "1 hour ago",
      unread: true,
    },
    {
      id: 3,
      title: "Live session starting soon",
      time: "2 hours ago",
      unread: false,
    },
  ];

  return (
    <nav className="bg-white border-b border-gray-200 px-6 py-3 shadow-sm">
      <div className="flex items-center justify-end">
        {/* Navigation items */}
        <div className="flex items-center space-x-4">
          {/* Dark/Light Mode Toggle */}
          <motion.button
            onClick={handleThemeToggle}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors relative"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <AnimatePresence mode="wait">
              {isDarkMode ? (
                <motion.div
                  key="sun"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <IconSun className="h-5 w-5 text-accent" />
                </motion.div>
              ) : (
                <motion.div
                  key="moon"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <IconMoon className="h-5 w-5 text-normal-text-muted" />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>

          {/* Notifications */}
          <div className="relative">
            <motion.button
              onClick={() => setIsNotificationOpen(!isNotificationOpen)}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors relative"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <IconBell className="h-5 w-5 text-normal-text-muted" />
              {notificationCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 bg-primary text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium"
                >
                  {notificationCount}
                </motion.span>
              )}
            </motion.button>

            {/* Notifications Dropdown */}
            <AnimatePresence>
              {isNotificationOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  className="absolute right-0 top-12 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50"
                >
                  <div className="p-4 border-b border-gray-200">
                    <h3 className="font-semibold text-heading">
                      Notifications
                    </h3>
                  </div>
                  <div className="max-h-80 overflow-y-auto">
                    {notifications.map((notification) => (
                      <motion.div
                        key={notification.id}
                        className={`p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer ${
                          notification.unread ? "bg-primary/5" : ""
                        }`}
                        whileHover={{ backgroundColor: "#f9fafb" }}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <p
                              className={`text-sm ${
                                notification.unread
                                  ? "font-medium text-heading"
                                  : "text-normal-text"
                              }`}
                            >
                              {notification.title}
                            </p>
                            <p className="text-xs text-normal-text-muted mt-1">
                              {notification.time}
                            </p>
                          </div>
                          {notification.unread && (
                            <div className="w-2 h-2 bg-primary rounded-full mt-1"></div>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                  <div className="p-3 bg-gray-50 text-center">
                    <button className="text-sm text-primary hover:text-primary/80 font-medium">
                      View all notifications
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Settings */}
          <motion.button
            onClick={() => console.log("Settings clicked")}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <IconSettings className="h-5 w-5 text-normal-text-muted" />
          </motion.button>

          {/* User Profile Dropdown */}
          <div className="relative">
            <motion.button
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 transition-colors"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-center space-x-2">
                {user.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center">
                    <span className="text-white font-medium text-sm">
                      {user.initials}
                    </span>
                  </div>
                )}
                <div className="text-left hidden md:block">
                  <p className="text-sm font-medium text-heading">
                    {user.name}
                  </p>
                  <p className="text-xs text-normal-text-muted">{user.role}</p>
                </div>
              </div>
              <IconChevronDown className="h-4 w-4 text-normal-text-muted" />
            </motion.button>

            {/* User Menu Dropdown */}
            <AnimatePresence>
              {isUserMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  className="absolute right-0 top-12 w-56 bg-white rounded-lg shadow-lg border border-gray-200 z-50"
                >
                  <div className="p-3 border-b border-gray-200">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-accent rounded-full flex items-center justify-center">
                        <span className="text-white font-medium text-sm">
                          {user.initials}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-heading">{user.name}</p>
                        <p className="text-sm text-normal-text-muted">
                          {user.role}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="py-2">
                    <motion.button
                      className="flex items-center space-x-3 w-full px-4 py-2 text-left hover:bg-gray-50 transition-colors"
                      whileHover={{ backgroundColor: "#f9fafb" }}
                    >
                      <IconUser className="h-4 w-4 text-normal-text-muted" />
                      <span className="text-sm text-normal-text">Profile</span>
                    </motion.button>

                    <motion.button
                      className="flex items-center space-x-3 w-full px-4 py-2 text-left hover:bg-gray-50 transition-colors"
                      whileHover={{ backgroundColor: "#f9fafb" }}
                    >
                      <IconSettings className="h-4 w-4 text-normal-text-muted" />
                      <span className="text-sm text-normal-text">Settings</span>
                    </motion.button>
                  </div>

                  <div className="border-t border-gray-200 py-2">
                    <motion.button
                      className="flex items-center space-x-3 w-full px-4 py-2 text-left hover:bg-gray-50 transition-colors text-red-600"
                      whileHover={{ backgroundColor: "#fef2f2" }}
                    >
                      <IconLogout className="h-4 w-4" />
                      <span className="text-sm">Sign out</span>
                    </motion.button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Close dropdowns when clicking outside */}
      {(isUserMenuOpen || isNotificationOpen) && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => {
            setIsUserMenuOpen(false);
            setIsNotificationOpen(false);
          }}
        />
      )}
    </nav>
  );
}
