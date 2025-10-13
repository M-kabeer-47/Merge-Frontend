/**
 * IconButton Component
 * 
 * Reusable icon button with tooltip, keyboard shortcut hint, and variants.
 */

"use client";

import React from "react";
import { LucideIcon } from "lucide-react";

interface IconButtonProps {
  icon: LucideIcon;
  label: string;
  onClick: () => void;
  variant?: "default" | "danger" | "success" | "ghost";
  isActive?: boolean;
  disabled?: boolean;
  shortcut?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export default function IconButton({
  icon: Icon,
  label,
  onClick,
  variant = "default",
  isActive = false,
  disabled = false,
  shortcut,
  size = "md",
  className = "",
}: IconButtonProps) {
  const sizeClasses = {
    sm: "p-2",
    md: "p-2.5",
    lg: "p-3",
  };

  const iconSizes = {
    sm: 16,
    md: 20,
    lg: 24,
  };

  const variantClasses = {
    default: isActive
      ? "bg-primary text-white"
      : "bg-main-background text-para hover:bg-primary/10 hover:text-primary",
    danger: isActive
      ? "bg-destructive text-white"
      : "bg-main-background text-destructive hover:bg-destructive/10",
    success: isActive
      ? "bg-success text-white"
      : "bg-main-background text-success hover:bg-success/10",
    ghost: "bg-transparent text-para hover:bg-secondary/10",
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        ${sizeClasses[size]}
        ${variantClasses[variant]}
        rounded-lg
        border border-light-border
        transition-all
        duration-200
        focus:outline-none
        focus:ring-2
        focus:ring-primary
        disabled:opacity-50
        disabled:cursor-not-allowed
        relative
        group
        ${className}
      `}
      aria-label={label}
      title={`${label}${shortcut ? ` (${shortcut})` : ""}`}
    >
      <Icon size={iconSizes[size]} />
      
      {/* Tooltip */}
      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-heading text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50">
        {label}
        {shortcut && (
          <span className="ml-1 px-1 bg-white/20 rounded text-[10px]">
            {shortcut}
          </span>
        )}
      </div>
    </button>
  );
}
