/**
 * FocusAlert — Generic distraction banner during a live session.
 *
 * Floats at the top center of the video area. Fades in whenever the user is
 * distracted (regardless of which underlying state fired) and fades out when
 * they're focused again. The message is intentionally generic — we don't
 * call out *which* kind of distraction, only that the user lost focus.
 *
 * Includes a speaker-toggle button so the user can mute the audio beep
 * without fully disabling focus tracking.
 *
 * Analysed locally in your browser — nothing is sent to the server.
 */

"use client";

import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, Volume2, VolumeX } from "lucide-react";
import type { FrameKind } from "@/lib/focus-tracker/types";

interface FocusAlertProps {
  currentState: FrameKind | "idle";
  isDistracted: boolean;
  muted?: boolean;
  onToggleMute?: () => void;
}

export default function FocusAlert({
  isDistracted,
  muted,
  onToggleMute,
}: FocusAlertProps) {
  return (
    <AnimatePresence>
      {isDistracted && (
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="absolute top-20 left-1/2 -translate-x-1/2 z-50"
        >
          <div
            className="
              flex items-center gap-2.5 px-5 py-2.5 rounded-full
              bg-gradient-to-r from-red-500/90 to-red-600/90
              text-white text-sm font-medium
              shadow-lg shadow-black/30
              backdrop-blur-sm
              border border-white/10
            "
          >
            <AlertTriangle className="w-4 h-4" />
            <span>You got distracted — refocus on the session.</span>
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
