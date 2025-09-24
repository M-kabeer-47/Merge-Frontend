"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  IconChevronDown,
  IconLogout,
  IconSettings,
  IconUser,
} from "@tabler/icons-react";
import { motion, AnimatePresence } from "motion/react";
import Avatar from "../ui/Avatar";

interface DropdownOption {
  label: string;
  href: string;
  icon?: React.ReactNode;
}

interface ProfileDropdownProps {
  userName: string;
  userRole?: string;
  profileImage?: string;
  onSignOut?: () => void;
  className?: string;
  showRole?: boolean;
  variant?: "default" | "navbar";
  options?: DropdownOption[];
}

const ProfileDropdown: React.FC<ProfileDropdownProps> = ({
  userName,
  userRole,
  profileImage,
  onSignOut,
  className = "",
  showRole = true,
  variant = "default",
  options = [],
}) => {
  const [profileOpen, setProfileOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setProfileOpen(false);
      }
    };

    if (profileOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [profileOpen]);

  return (
    <div ref={dropdownRef} className={`relative ${className}`}>
      <motion.button
        onClick={() => setProfileOpen(!profileOpen)}
        className="flex items-center max-w-xs rounded-full focus:outline-none"
      >
        <div
          className={`flex items-center gap-2 px-2 py-1.5 rounded-full transition-colors
          
            bg-secondary/10 backdrop-blur-sm border border-white/20 hover:bg-white/20"
            hover:bg-gray-100"
          `}
        >
          <Avatar profileImage={profileImage} variant={variant} />
          <div className="hidden md:block text-left">
            <div className={`text-sm font-raleway font-semibold text-heading`}>
              {userName}
            </div>
            {showRole && userRole && (
              <div
                className={`text-xs font-raleway font-semibold text-normal-text-muted`}
              >
                {userRole}
              </div>
            )}
          </div>
          <IconChevronDown
            className={`h-4 w-4 ${
              variant === "navbar" ? "text-white/70" : "text-normal-text-muted"
            }`}
          />
        </div>
      </motion.button>

      <AnimatePresence>
        {profileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="origin-top-right absolute right-0 mt-2 w-45 rounded-lg shadow-lg bg-[#f7f7f7] border border-gray-200 z-50 overflow-hidden"
          >
            {/* User Info Header */}

            <div className="py-1">
              {options.map((option, index) => (
                <Link
                  key={index}
                  href={option.href}
                  className="flex items-center px-4 py-2 text-sm  text-normal-text hover:bg-gray-100 transition-colors"
                  onClick={() => setProfileOpen(false)}
                >
                  {option.icon && (
                    <span className="mr-3 text-normal-text-muted">
                      {option.icon}
                    </span>
                  )}
                  {option.label}
                </Link>
              ))}

              {options.length > 0 && onSignOut && (
                <div className="border-t border-gray-100 my-1"></div>
              )}

              {onSignOut && (
                <motion.button
                  onClick={() => {
                    onSignOut();
                    setProfileOpen(false);
                  }}
                  className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                  whileHover={{ backgroundColor: "#fef2f2" }}
                >
                  <IconLogout className="h-4 w-4 mr-3" />
                  Sign out
                </motion.button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProfileDropdown;
