"use client";

import React, { useState, useEffect, useRef } from "react";
import { IconChevronDown, IconLogin, IconUser } from "@tabler/icons-react";
import { motion, AnimatePresence } from "motion/react";
import Avatar from "../ui/Avatar";
import DropdownMenu, { DropdownOption } from "@/components/ui/Dropdown";
import Link from "next/link";
import { useAuth } from "@/providers/AuthProvider";

interface ProfileDropdownProps {
  onSignOut?: () => void;
  className?: string;
  showRole?: boolean;

  options?: DropdownOption[]; // reuse our DropdownOption type
}

const ProfileDropdown: React.FC<ProfileDropdownProps> = ({
  onSignOut,
  className = "",
  showRole = true,

  options = [],
}) => {
  const { user, isLoading, isAuthenticated } = useAuth();
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

  // Show loading skeleton
  if (isLoading) {
    return (
      <div className={className}>
        <div className="flex items-center gap-2 px-2 py-1.5 rounded-full animate-pulse bg-white/10 border border-white/20">
          <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
          <div className="hidden md:block space-y-1">
            <div className="h-3 w-20 bg-gray-300 rounded"></div>
            <div className="h-2 w-16 bg-gray-300 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  // If user is null, show sign-in button
  if (!isAuthenticated || !user) {
    return (
      <div className={className}>
        <Link href="/sign-in">
          <motion.button
            className="flex items-center gap-2 px-4 py-2 transition-colors
            text-para backdrop-blur-sm "
          >
            <IconLogin className="h-4 w-4 text-para" />
            <span className="font-medium text-sm">Sign In</span>
          </motion.button>
        </Link>
      </div>
    );
  }

  const userName =
    `${user.firstName || ""} ${user.lastName || ""}`.trim() || "User";
  const userRole = user.role || "";
  const profileImage = user.image || "";

  return (
    <div ref={dropdownRef} className={`relative ${className}`}>
      <motion.button
        onClick={() => setProfileOpen(!profileOpen)}
        className="flex items-center max-w-xs rounded-full focus:outline-none z-50"
      >
        <div
          className={`flex items-center gap-2 px-2 py-1.5 rounded-full transition-colors bg-secondary/10 backdrop-blur-sm border border-white/20`}
        >
          {profileImage ? (
            <Avatar profileImage={profileImage} />
          ) : (
            <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
              <IconUser className="w-5 h-5 text-heading" strokeWidth={2} />
            </div>
          )}
          <div className="hidden md:block text-left">
            <div className={`text-sm font-raleway font-semibold text-heading`}>
              {userName}
            </div>
            {showRole && userRole && (
              <div
                className={`text-xs font-raleway font-semibold text-para-muted`}
              >
                {userRole}
              </div>
            )}
          </div>
          <IconChevronDown className="h-4 w-4 text-white/70" />
        </div>
      </motion.button>

      <AnimatePresence>
        {profileOpen && (
          <motion.div className="origin-top-right absolute right-0 mt-2 rounded-lg z-50">
            {/* Use the reusable DropdownMenu */}
            <DropdownMenu
              options={options}
              onClose={() => setProfileOpen(false)}
              align="right"
            />

            {/* Separator + Sign out (handled here so it remains simple) */}
            {options.length > 0 && onSignOut && <div className="mt-1" />}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProfileDropdown;
