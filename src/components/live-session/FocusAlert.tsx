/**
 * FocusAlert — Persistent distraction banner during a live session.
 *
 * Floats at the top center of the video area. Fades in when distracted,
 * fades out when focused again. NOT a sonner toast — this is persistent
 * advisory UI that stays as long as the user is distracted.
 *
 * Includes a speaker-toggle button so the user can mute the audio beep
 * without fully disabling focus tracking.
 *
 * Analysed locally in your browser — nothing is sent to the server.
 */

"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  AlertTriangle,
  EyeOff,
  UserX,
  Coffee,
  AppWindow,
  Users,
  Volume2,
  VolumeX,
} from "lucide-react";
import type { FrameKind } from "@/lib/focus-tracker/types";

interface FocusAlertProps {
  currentState: FrameKind | "idle";
  isDistracted: boolean;
  muted?: boolean;
  onToggleMute?: () => void;
}

const ALERT_CONFIG: Record<
  string,
  { icon: React.ReactNode; message: string; color: string }
> = {
  looking_away: {
    icon: <AlertTriangle className="w-4 h-4" />,
    message: "Looking away — try to focus on the screen.",
    color: "from-red-500/90 to-red-600/90",
  },
  eyes_closed: {
    icon: <EyeOff className="w-4 h-4" />,
    message: "Eyes closed — are you still with us?",
    color: "from-purple-500/90 to-purple-600/90",
  },
  no_face: {
    icon: <UserX className="w-4 h-4" />,
    message: "We can't see you — check your camera.",
    color: "from-amber-500/90 to-amber-600/90",
  },
  drowsy: {
    icon: <Coffee className="w-4 h-4" />,
    message: "You've had your eyes closed for a while — are you still with us?",
    color: "from-indigo-500/90 to-indigo-600/90",
  },
  tab_switched: {
    icon: <AppWindow className="w-4 h-4" />,
    message: "Come back to the session tab.",
    color: "from-rose-500/90 to-rose-600/90",
  },
  multi_face: {
    icon: <Users className="w-4 h-4" />,
    message: "Multiple people in frame.",
    color: "from-teal-500/90 to-teal-600/90",
  },
};

export default function FocusAlert({
  currentState,
  isDistracted,
  muted,
  onToggleMute,
}: FocusAlertProps) {
  const config = isDistracted ? ALERT_CONFIG[currentState] : null;

  return (
    <AnimatePresence>
      {config && (
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="absolute top-20 left-1/2 -translate-x-1/2 z-50"
        >
          <div
            className={`
              flex items-center gap-2.5 px-5 py-2.5 rounded-full
              bg-gradient-to-r ${config.color}
              text-white text-sm font-medium
              shadow-lg shadow-black/30
              backdrop-blur-sm
              border border-white/10
            `}
          >
            {config.icon}
            <span>{config.message}</span>
            {onToggleMute && (
              <button
                onClick={onToggleMute}
                title={muted ? "Unmute focus alert sound" : "Mute focus alert sound"}
                aria-label={muted ? "Unmute focus alert sound" : "Mute focus alert sound"}
                className="ml-1 w-6 h-6 rounded-full hover:bg-white/20 flex items-center justify-center transition-colors"
              >
                {muted ? (
                  <VolumeX className="w-3.5 h-3.5" />
                ) : (
                  <Volume2 className="w-3.5 h-3.5" />
                )}
              </button>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
