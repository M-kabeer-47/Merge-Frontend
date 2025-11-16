"use client";
import React from "react";
import { IconLogout, IconSettings, IconUser } from "@tabler/icons-react";
import ToggleSwitch from "@/components/navbar/DarkModeToggle";
import NotificationDropdown from "@/components/navbar/Notifications";
import ProfileDropdown from "@/components/navbar/ProfileDropdown";
import useLogout from "@/hooks/auth/use-logout";
import { User } from "@/types/user";

interface NavbarProps {
  isDarkMode?: boolean;
  setIsDarkMode: (isDark: boolean) => void;
  onThemeToggle?: () => void;
  notificationCount?: number;
}

export default function Navbar({
  isDarkMode = false,
  notificationCount = 3,
  setIsDarkMode,
}: NavbarProps) {
  const { isPending, logout, isError } = useLogout();
  const handleThemeToggle = () => {
    setIsDarkMode(!isDarkMode);
    console.log("Theme toggled:", isDarkMode ? "light" : "dark");
  };

  const handleNotificationClick = (notification: any) => {
    console.log("Notification clicked:", notification);
    // Handle notification click logic here
  };

  const handleViewAllNotifications = () => {
    console.log("View all notifications");
    // Navigate to notifications page
  };

  const handleMarkAllRead = () => {
    console.log("Mark all notifications as read");
    // Mark all notifications as read logic
  };

  // Profile dropdown options
  const profileOptions = [
    {
      title: "Profile",
      href: "/profile",
      icon: <IconUser className="h-4 w-4" />,
    },
    {
      title: "Settings",
      href: "/settings",
      icon: <IconSettings className="h-4 w-4" />,
    },
    {
      title: "Sign Out",
      destructive: true,
      icon: <IconLogout className="h-4 w-4 text-destructive" />,
      action: logout,
    },
  ];

  return (
    <nav className="bg-main-background border-b border-light-border px-6 py-3 shadow-sm">
      <div className="flex items-center justify-end">
        {/* Navigation items */}
        <div className="flex items-center space-x-6">
          {/* Dark/Light Mode Toggle Switch */}
          <ToggleSwitch
            isDarkMode={isDarkMode}
            onToggle={handleThemeToggle}
            size="md"
          />

          {/* Notifications */}
          <NotificationDropdown
            notificationCount={notificationCount}
            onNotificationClick={handleNotificationClick}
            onViewAll={handleViewAllNotifications}
            onMarkAllRead={handleMarkAllRead}
          />

          {/* User Profile Dropdown */}
          <ProfileDropdown
            onSignOut={logout}
            options={profileOptions}
            showRole={true}
          />
        </div>
      </div>
    </nav>
  );
}
