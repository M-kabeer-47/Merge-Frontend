"use client";
import { IconLogout, IconSettings, IconUser } from "@tabler/icons-react";
import ToggleSwitch from "./navbar/DarkModeToggle";
import NotificationDropdown from "./navbar/Notifications";
import ProfileDropdown from "./navbar/ProfileDropdown";
import useLogout from "@/hooks/auth/use-logout";
import Image from "next/image";
interface NavbarProps {
  notificationCount?: number;
}

export default function Navbar({ notificationCount = 3 }: NavbarProps) {
  const { logout } = useLogout();

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
    <nav className="bg-main-background border-b border-light-border px-6 py-3 shadow-sm ">
      <div className="flex items-center justify-end">
        {/* Navigation items */}
        <div className="flex items-center space-x-6">
          {/* Dark/Light Mode Toggle Switch */}
          <ToggleSwitch size="md" />

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
