"use client";
import React from "react";
import {
  IconSettings,
  IconUser,
  IconBell,
  IconSun,
  IconMoon,
} from "@tabler/icons-react";
import { motion } from "motion/react";
import Avatar from "../ui/Avatar";

interface UserProfile {
  name: string;
  role: string;
  initials: string;
  image?: string;
}

interface MobileNavbarOptionsProps {
  user: UserProfile;
  isDarkMode?: boolean;
  onThemeToggle: () => void;
  notificationCount?: number;
  onSignOut: () => void;
}

export default function MobileNavbarOptions({
  user,
  isDarkMode = false,
  onThemeToggle,
  
  onSignOut,
}: MobileNavbarOptionsProps) {
  const menuItems = [
    {
      label: isDarkMode ? "Light Mode" : "Dark Mode",
      icon: isDarkMode ? (
        <IconSun className="h-5 w-5" />
      ) : (
        <IconMoon className="h-5 w-5" />
      ),
      action: onThemeToggle,
    },

    {
      label: "Settings",
      icon: <IconSettings className="h-5 w-5" />,
      action: () => console.log("Open settings"),
    },
  ];

  return (
    <div className="space-y-6 md:hidden">
      {/* User Profile Section */}

      {/* Divider */}
      <div className="border-t  border-light-border relative top-[10px]"></div>

      {/* Menu Items */}
      <div className="space-y-2">
        {menuItems.map((item, index) => (
          <motion.button
            key={index}
            onClick={item.action}
            className="flex items-center justify-between w-full p-3 rounded-lg hover:bg-gray-50 transition-colors text-left"
          >
            <div className="flex items-center gap-3">
              <span className="text-para-muted">{item.icon}</span>
              <span className="font-medium text-heading">{item.label}</span>
            </div>
          </motion.button>
        ))}
      </div>
      <div className="flex items-center gap-3 px-1 rounded-lg relative top-[-10px]">
        {user.image ? (
          <Avatar profileImage={user.image} size="lg" />
        ) : (
          <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center">
            <span className="text-white font-medium text-lg">
              {user.initials}
            </span>
          </div>
        )}
        <div className="flex-1">
          <h3 className="font-raleway font-semibold text-heading">
            {user.name}
          </h3>
          <p className="text-sm text-para-muted">{user.role}</p>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-light-border"></div>

      {/* Sign Out Button */}
      <motion.button
        onClick={onSignOut}
        className="flex items-center gap-3 w-full p-3 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <svg
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
          />
        </svg>
        <span className="font-medium">Sign Out</span>
      </motion.button>
    </div>
  );
}
