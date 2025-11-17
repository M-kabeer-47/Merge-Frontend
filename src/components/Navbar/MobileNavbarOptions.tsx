"use client";
import React, { useEffect, useState } from "react";
import {
  IconSettings,
  IconSun,
  IconMoon,
  IconLogin,
  IconUser,
} from "@tabler/icons-react";
import { motion } from "motion/react";
import Avatar from "../ui/Avatar";
import Link from "next/link";
import { useAuth } from "@/providers/AuthProvider";
import { useTheme } from "next-themes";

interface MobileNavbarOptionsProps {
  notificationCount?: number;
  onSignOut: () => void;
}

export default function MobileNavbarOptions({
  onSignOut,
  
}: MobileNavbarOptionsProps) {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();
  const { user, isLoading, isAuthenticated } = useAuth();
  
  useEffect(() => {
    setMounted(true);
  }, []);
  
  const isDarkMode = mounted ? theme === "dark" : false;
  const onThemeToggle = () => setTheme(theme === "dark" ? "light" : "dark");
  
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
    ...(user
      ? [
          {
            label: "Settings",
            icon: <IconSettings className="h-5 w-5" />,
            action: () => console.log("Open settings"),
          },
        ]
      : []),
  ];

  // Show loading skeleton
  if (isLoading) {
    return (
      <div className="space-y-6 md:hidden">
        <div className="border-t border-light-border"></div>
        <div className="space-y-2">
          <div className="flex items-center gap-3 p-3 rounded-lg animate-pulse">
            <div className="w-5 h-5 bg-gray-300 rounded"></div>
            <div className="h-4 w-24 bg-gray-300 rounded"></div>
          </div>
        </div>
        <div className="flex items-center gap-3 px-1 animate-pulse">
          <div className="w-12 h-12 bg-gray-300 rounded-full"></div>
          <div className="flex-1 space-y-2">
            <div className="h-4 w-32 bg-gray-300 rounded"></div>
            <div className="h-3 w-20 bg-gray-300 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  // If user is not logged in, show sign-in/sign-up
  if (!isAuthenticated || !user) {
    return (
      <div className="space-y-6 md:hidden">
        {/* Theme Toggle */}
        <div className="space-y-2">
          <motion.button
            onClick={onThemeToggle}
            className="flex items-center justify-between w-full p-3 rounded-lg hover:bg-gray-50 transition-colors text-left"
          >
            <div className="flex items-center gap-3">
              <span className="text-para-muted">
                {isDarkMode ? (
                  <IconSun className="h-5 w-5" />
                ) : (
                  <IconMoon className="h-5 w-5" />
                )}
              </span>
              <span className="font-medium text-heading">
                {isDarkMode ? "Light Mode" : "Dark Mode"}
              </span>
            </div>
          </motion.button>
        </div>

        {/* Divider */}
        <div className="border-t border-light-border"></div>

        {/* Sign In Button */}
        <Link href="/sign-in">
          <motion.button
            className="flex items-center gap-3 w-full p-3 rounded-lg bg-primary text-white hover:bg-primary/90 transition-colors"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <IconLogin className="h-5 w-5" />
            <span className="font-medium">Sign In</span>
          </motion.button>
        </Link>

        {/* Sign Up Link */}
        <div className="text-center text-sm text-para-muted">
          Don't have an account?{" "}
          <Link
            href="/sign-up"
            className="text-primary hover:underline font-medium"
          >
            Sign Up
          </Link>
        </div>
      </div>
    );
  }

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
          <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
            <IconUser className="w-6 h-6 text-heading" strokeWidth={2} />
          </div>
        )}
        <div className="flex-1">
          <h3 className="font-raleway font-semibold text-heading">
            {user.firstName} {user.lastName}
          </h3>
          <p className="text-sm text-para-muted">{user.role || "User"}</p>
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
