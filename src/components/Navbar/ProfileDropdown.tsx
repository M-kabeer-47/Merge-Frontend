"use client";

import React, { useState, useEffect, useRef } from "react";
import { IconChevronDown, IconLogout } from "@tabler/icons-react";
import { motion, AnimatePresence } from "motion/react";
import Avatar from "../ui/Avatar";
import DropdownMenu, { DropdownOption } from "@/components/ui/Dropdown";

interface ProfileDropdownProps {
  userName: string;
  userRole?: string;
  profileImage?: string;
  onSignOut?: () => void;
  className?: string;
  showRole?: boolean;
  variant?: "default" | "navbar";
  options?: DropdownOption[]; // reuse our DropdownOption type
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
          className={`flex items-center gap-2 px-2 py-1.5 rounded-full transition-colors bg-secondary/10 backdrop-blur-sm border border-white/20`}
        >
          <Avatar profileImage={profileImage} variant={variant} />
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
          <IconChevronDown
            className={`h-4 w-4 ${
              variant === "navbar" ? "text-white/70" : "text-para-muted"
            }`}
          />
        </div>
      </motion.button>

      <AnimatePresence>
        {profileOpen && (
          <motion.div
           
            className="origin-top-right absolute right-0 mt-2 rounded-lg z-50"
          >
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
