"use client";

import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  width?: "sm" | "md" | "lg" | "xl";
  showOverlay?: boolean;
}

const widthClasses = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-xl",
};

/**
 * Drawer component that slides in from the right side of the screen.
 * Full height, with close on outside click and escape key.
 */
export default function Drawer({
  isOpen,
  onClose,
  title,
  children,
  width = "md",
  showOverlay = true,
}: DrawerProps) {
  const drawerRef = useRef<HTMLDivElement>(null);

  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  // Close on outside click
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (drawerRef.current && !drawerRef.current.contains(e.target as Node)) {
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className={`fixed inset-0 z-50 flex justify-end ${
            showOverlay ? "bg-black/30 backdrop-blur-[2px]" : ""
          }`}
          onClick={handleBackdropClick}
        >
          <motion.div
            ref={drawerRef}
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 400 }}
            className={`h-full w-full ${widthClasses[width]} bg-main-background border-l border-light-border shadow-2xl flex flex-col`}
          >
            {/* Header */}
            {title && (
              <div className="flex items-center justify-between p-4 border-b border-light-border">
                <h2 className="text-lg font-semibold text-heading">{title}</h2>
                <button
                  onClick={onClose}
                  className="p-2 rounded-lg text-para-muted hover:text-heading hover:bg-secondary/10 transition-colors"
                  aria-label="Close drawer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            )}

            {/* Close button if no title */}
            {!title && (
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 rounded-lg text-para-muted hover:text-heading hover:bg-secondary/10 transition-colors z-10"
                aria-label="Close drawer"
              >
                <X className="w-5 h-5" />
              </button>
            )}

            {/* Content */}
            <div className="flex-1 overflow-y-auto">{children}</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
