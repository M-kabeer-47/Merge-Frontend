"use client";

import { useTheme } from "next-themes";
import { motion } from "framer-motion";
import { Globe, Lock } from "lucide-react";

interface VisibilitySelectorProps {
  isPublic: boolean;
  onChange: (isPublic: boolean) => void;
  disabled?: boolean;
}

export default function VisibilitySelector({
  isPublic,
  onChange,
  disabled = false,
}: VisibilitySelectorProps) {
  const { theme } = useTheme();
  const isDarkMode = theme === "dark";
  return (
    <div className="grid grid-cols-2 gap-3">
      {/* Public Option */}
      <motion.button
        type="button"
        onClick={() => onChange(true)}
        disabled={disabled}
        whileHover={{ scale: disabled ? 1 : 1.02 }}
        whileTap={{ scale: disabled ? 1 : 0.98 }}
        className={`relative flex flex-col items-center gap-3 p-4 rounded-xl border-2 transition-all ${
          isPublic
            ? `border-secondary bg-secondary/5`
            : "border-light-border hover:border-secondary/30 text-para"
        } ${disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"}`}
      >
        {isPublic && (
          <motion.div
            layoutId="visibility-indicator"
            className="absolute top-2 right-2 w-4 h-4 bg-secondary rounded-full flex items-center justify-center"
          >
            <div className="w-2 h-2 bg-white rounded-full" />
          </motion.div>
        )}
        <Globe className="w-6 h-6" />
        <div className="text-center">
          <p className="font-semibold text-sm">Public</p>
          <p className="text-xs text-para-muted mt-1">Anyone can discover</p>
        </div>
      </motion.button>

      {/* Private Option */}
      <motion.button
        type="button"
        onClick={() => onChange(false)}
        disabled={disabled}
        whileHover={{ scale: disabled ? 1 : 1.02 }}
        whileTap={{ scale: disabled ? 1 : 0.98 }}
        className={`relative flex flex-col items-center gap-3 p-4 rounded-xl border-2 transition-all ${
          !isPublic
            ? `border-secondary bg-secondary/5 `
            : "border-light-border hover:border-secondary/30 text-para"
        } ${disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"}`}
      >
        {!isPublic && (
          <motion.div
            layoutId="visibility-indicator"
            className="absolute top-2 right-2 w-4 h-4 bg-secondary rounded-full flex items-center justify-center"
          >
            <div className="w-2 h-2 bg-white rounded-full" />
          </motion.div>
        )}
        <Lock className="w-6 h-6" />
        <div className="text-center">
          <p className="font-semibold text-sm">Private</p>
          <p className="text-xs text-para-muted mt-1">Invite-only access</p>
        </div>
      </motion.button>
    </div>
  );
}
