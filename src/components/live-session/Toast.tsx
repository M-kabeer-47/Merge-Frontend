/**
 * Toast Component
 * 
 * Simple toast notification for temporary feedback messages.
 */

"use client";

import React, { useEffect } from "react";
import { X, CheckCircle, AlertCircle, Info } from "lucide-react";

export type ToastType = "success" | "error" | "info" | "warning";

interface ToastProps {
  message: string;
  type?: ToastType;
  duration?: number;
  onClose: () => void;
}

export default function Toast({
  message,
  type = "info",
  duration = 3000,
  onClose,
}: ToastProps) {
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  const icons = {
    success: CheckCircle,
    error: AlertCircle,
    info: Info,
    warning: AlertCircle,
  };

  const colors = {
    success: "bg-success/10 border-success text-success",
    error: "bg-destructive/10 border-destructive text-destructive",
    info: "bg-info/10 border-info text-info",
    warning: "bg-accent/10 border-accent text-accent",
  };

  const Icon = icons[type];

  return (
    <div
      className={`
        fixed bottom-4 right-4 z-50
        flex items-center gap-3
        px-4 py-3
        border-2 rounded-lg
        shadow-lg
        animate-in slide-in-from-bottom-5
        ${colors[type]}
      `}
      role="alert"
    >
      <Icon className="w-5 h-5 flex-shrink-0" />
      <p className="text-sm font-medium text-heading">{message}</p>
      <button
        onClick={onClose}
        className="ml-2 p-1 hover:bg-white/20 rounded transition-colors"
        aria-label="Close notification"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
