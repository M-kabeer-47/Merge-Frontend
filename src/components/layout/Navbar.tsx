"use client";
import { IconLogout, IconSettings, IconUser } from "@tabler/icons-react";
import ToggleSwitch from "./navbar/DarkModeToggle";
import NotificationDropdown from "./navbar/Notifications";
import ProfileDropdown from "./navbar/ProfileDropdown";
import useLogout from "@/hooks/auth/use-logout";

export default function Navbar() {
  const { logout } = useLogout();

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
          <NotificationDropdown />

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
