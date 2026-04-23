/**
 * FocusTrackerToggle — Control bar button to toggle focus tracking.
 *
 * Shows Eye/EyeOff icon with a distraction indicator dot.
 * Disabled when camera is off.
 */

"use client";

import React from "react";
import { Eye, EyeOff } from "lucide-react";
import type { FrameKind } from "@/lib/focus-tracker/types";

interface FocusTrackerToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  currentState: FrameKind | "idle";
  isDistracted: boolean;
  cameraOn: boolean;
  disabled?: boolean;
}

const STATE_DOT_COLORS: Record<FrameKind | "idle", string> = {
  idle: "transparent",
  focused: "#22c55e",
  no_face: "#f59e0b",
  looking_away: "#ef4444",
  eyes_closed: "#8b5cf6",
  drowsy: "#6366f1",
  looking_down: "#f97316",
  tab_switched: "#e11d48",
  multi_face: "#14b8a6",
};

export default function FocusTrackerToggle({
  checked,
  onChange,
  currentState,
  isDistracted,
  cameraOn,
  disabled = false,
}: FocusTrackerToggleProps) {
  const isDisabled = disabled || !cameraOn;
  const showDot = checked && currentState !== "idle";

  const handleClick = () => {
    if (isDisabled) return;
    onChange(!checked);
  };

  return (
    <button
      onClick={handleClick}
      title={
        !cameraOn
          ? "Turn on your camera to track focus"
          : checked
            ? "Stop focus tracking"
            : "Track my focus"
      }
      role="switch"
      aria-checked={checked}
      aria-label="Focus tracker toggle"
      disabled={isDisabled}
      className={`
        flex flex-col items-center gap-1 group
        transition-all duration-200
        ${isDisabled ? "cursor-not-allowed" : ""}
      `}
    >
      <div
        className={`
          w-12 h-12 rounded-full flex items-center justify-center relative
          transition-all duration-200
          ${isDisabled
            ? "bg-[#3c4043]/50 ring-1 ring-white/10"
            : checked
              ? "bg-[#1a73e8] hover:bg-[#1557b0]"
              : "bg-[#3c4043] hover:bg-[#494c50]"
          }
        `}
      >
        {checked ? (
          <Eye className="w-5 h-5 text-white" />
        ) : (
          <EyeOff className={`w-5 h-5 ${isDisabled ? "text-white/40" : "text-white"}`} />
        )}

        {/* Status indicator dot */}
        {showDot && (
          <span
            className="absolute -top-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-[#202124] transition-colors duration-300"
            style={{ backgroundColor: STATE_DOT_COLORS[currentState] }}
          />
        )}
      </div>
    </button>
  );
}
