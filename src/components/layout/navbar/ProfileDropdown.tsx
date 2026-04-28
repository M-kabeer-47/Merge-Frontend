"use client";

import React, { useState, useRef } from "react";
import { IconChevronDown, IconLogin, IconUser } from "@tabler/icons-react";
import { Crown, Sparkles, Zap } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import Avatar from "../../ui/Avatar";
import DropdownMenu, { DropdownOption } from "@/components/ui/Dropdown";
import Link from "next/link";
import { useAuth } from "@/providers/AuthProvider";
import { useOnClickOutside } from "@/hooks/use-on-click-outside";
import useMySubscription from "@/hooks/subscription/use-my-subscription";

const FREE_STYLE = { icon: Sparkles, chip: "bg-secondary/15 text-para-muted" };
const LOW_STYLE  = { icon: Zap,      chip: "bg-secondary/20 text-secondary" };
const MID_STYLE  = { icon: Crown,    chip: "bg-primary/10 text-primary" };
const TOP_STYLE  = { icon: Crown,    chip: "bg-accent/15 text-accent" };

const PLAN_STYLE: Record<string, { icon: typeof Sparkles; chip: string }> = {
  // New role-specific tiers
  student_free:        FREE_STYLE,
  student_plus:        MID_STYLE,
  instructor_starter:  LOW_STYLE,
  instructor_educator: MID_STYLE,
  instructor_pro:      TOP_STYLE,
  // Legacy
  free:  FREE_STYLE,
  basic: LOW_STYLE,
  pro:   MID_STYLE,
  max:   TOP_STYLE,
};

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
  const { subscription } = useMySubscription();
  const [profileOpen, setProfileOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const tier = subscription?.plan?.name ?? "free";
  const planName = subscription?.plan?.displayName ?? "Free";
  const planStyle = PLAN_STYLE[tier] ?? PLAN_STYLE.free;
  const PlanIcon = planStyle.icon;

  useOnClickOutside(dropdownRef, () => setProfileOpen(false), profileOpen);

  // Show loading skeleton
  if (isLoading) {
    return (
      <div className={className}>
        <div className="flex items-center gap-2 px-2 py-1.5 rounded-full animate-pulse bg-white/10 border border-white/20">
          <div className="w-8 h-8 bg-secondary/20 rounded-full"></div>
          <div className="hidden md:block space-y-1">
            <div className="h-3 w-20 bg-secondary/20 rounded"></div>
            <div className="h-2 w-16 bg-secondary/20 rounded"></div>
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
            <Avatar profileImage={profileImage} size="md" />
          ) : (
            <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
              <IconUser className="w-5 h-5 text-heading" strokeWidth={2} />
            </div>
          )}
          <div className="hidden md:block text-left">
            <div className="text-sm font-raleway font-semibold text-heading">
              {userName}
            </div>
            <div className="mt-0.5 flex items-center gap-1.5">
              <span
                className={`inline-flex items-center gap-1 rounded-full px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${planStyle.chip}`}
              >
                <PlanIcon className="h-2.5 w-2.5" />
                {planName}
              </span>
              {showRole && userRole && (
                <span className="text-[10px] font-medium text-para-muted capitalize">
                  · {userRole}
                </span>
              )}
            </div>
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
