"use client";
import React from "react";
import { motion } from "motion/react";
import { IconSun, IconMoon } from "@tabler/icons-react";
import { Moon } from "lucide-react";

interface ToggleSwitchProps {
  isDarkMode: boolean;
  onToggle: () => void;
  size?: "sm" | "md" | "lg";
}

export default function ToggleSwitch({
  isDarkMode,
  onToggle,
  size = "md",
}: ToggleSwitchProps) {
  const sizeClasses = {
    sm: {
      switch: "w-10 h-5",
      thumb: "w-4 h-4",
      icon: "h-3 w-3",
    },
    md: {
      switch: "w-12 h-6",
      thumb: "w-5 h-5",
      icon: "h-3.5 w-3.5",
    },
    lg: {
      switch: "w-14 h-7",
      thumb: "w-6 h-6",
      icon: "h-4 w-4",
    },
  };

  const currentSize = sizeClasses[size];

  return (
    <motion.button
      onClick={onToggle}
      className={`${
        currentSize.switch
      } relative rounded-full p-0.5 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-gray-200 ${
        isDarkMode
          ? "bg-gradient-to-r from-primary to-secondary"
          : "bg-gray-200"
      }`}
    >
      {/* Background Icons */}
      <div className="absolute inset-0 flex items-center justify-between px-1">
        <motion.div
          initial={{ opacity: isDarkMode ? 0 : 1 }}
          animate={{ opacity: isDarkMode ? 0 : 1 }}
          transition={{ duration: 0.2 }}
        >
          <IconSun className={`${currentSize.icon} text-accent`} />
        </motion.div>
        <motion.div
          initial={{ opacity: isDarkMode ? 1 : 0 }}
          animate={{ opacity: isDarkMode ? 1 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <Moon className={`${currentSize.icon} text-white rotate-180`} />
        </motion.div>
      </div>

      {/* Thumb */}
      <motion.div
        className={`${currentSize.thumb} bg-background rounded-full shadow-lg flex items-center justify-center relative z-10`}
        animate={{
          x: isDarkMode ? `calc(100% + 2px)` : 0,
        }}
        transition={{
          type: "spring",
          stiffness: 500,
          damping: 30,
        }}
      >
        <motion.div transition={{ duration: 0.3 }}>
          {isDarkMode ? (
            <Moon className={`${currentSize.icon} text-primary`} />
          ) : (
            <IconSun className={`${currentSize.icon} text-accent`} />
          )}
        </motion.div>
      </motion.div>
    </motion.button>
  );
}
