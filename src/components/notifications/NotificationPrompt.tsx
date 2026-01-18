/**
 * Notification Permission Prompt
 *
 * Shows a banner asking users to enable notifications.
 * Only appears when user.notificationStatus === "default"
 */

"use client";

import { useState } from "react";
import { Bell, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/Button";
import {
  useNotifications,
  useShouldShowNotificationPrompt,
} from "@/providers/NotificationProvider";

export default function NotificationPrompt() {
  const shouldShow = useShouldShowNotificationPrompt();
  const { requestPermission } = useNotifications();
  const [isDismissed, setIsDismissed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Don't render if not needed or dismissed
  if (!shouldShow || isDismissed) return null;

  const handleEnable = async () => {
    setIsLoading(true);
    try {
      await requestPermission();
    } finally {
      setIsLoading(false);
    }
  };

  const handleDismiss = () => {
    setIsDismissed(true);
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
        className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-md"
      >
        <div className="bg-background border border-light-border rounded-lg shadow-lg p-4">
          <div className="flex items-start gap-3">
            {/* Icon */}
            <div className="flex-shrink-0 p-2 bg-primary/10 rounded-full">
              <Bell className="w-5 h-5 text-primary" />
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-heading text-sm">
                Enable Notifications
              </h3>
              <p className="text-para-muted text-xs mt-0.5">
                Get notified about assignments, quizzes, and important updates.
              </p>

              {/* Actions */}
              <div className="flex items-center gap-2 mt-3">
                <Button
                  size="sm"
                  onClick={handleEnable}
                  disabled={isLoading}
                  className="h-8 text-xs"
                >
                  {isLoading ? "Enabling..." : "Enable"}
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleDismiss}
                  className="h-8 text-xs"
                >
                  Later
                </Button>
              </div>
            </div>

            {/* Close button */}
            <button
              onClick={handleDismiss}
              className="flex-shrink-0 p-1 rounded hover:bg-secondary/10 transition-colors"
              aria-label="Dismiss"
            >
              <X className="w-4 h-4 text-para-muted" />
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
