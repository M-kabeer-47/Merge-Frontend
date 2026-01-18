import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";

export interface DropdownOption {
  id?: string | number;
  title: string;
  icon?: React.ReactNode;
  href?: string;
  action?: () => void;
  destructive?: boolean;
}

interface DropdownMenuProps {
  options: DropdownOption[];
  className?: string;
  onClose?: () => void;
  align?: "right" | "left";
  size?: "small" | "medium" | "large";
}

export default function DropdownMenu({
  options,
  className = "",
  onClose,
  align = "right",
  size = "medium",
}: DropdownMenuProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -10, scale: 0.95 }}
      transition={{ duration: 0.18 }}
      className={`origin-top-right absolute text-para flex items-center  ${
        align === "right" ? "right-0" : "left-0"
      } ${
        size === "small"
          ? "mt-2 w-40 text-xs px-2 "
          : size === "large"
          ? "mt-4 w-full justify-center"
          : "mt-2 w-44"
      } rounded-lg shadow-lg bg-background border border-light-border z-50 overflow-hidden ${className}`}
      onClick={(e) => e.stopPropagation()}
    >
      <div className=" w-full">
        {options.map((opt, idx) => {
          const content = (
            <div
              className={`flex items-center w-full  py-2  transition-colors ${
                opt.destructive
                  ? "text-destructive hover:bg-destructive/5"
                  : "text-para hover:bg-primary/5"
              } ${size === "small" ? "text-xs px-2" : "text-sm px-4"} `}
            >
              {opt.icon && (
                <span
                  className={` text-para-muted ${
                    opt.destructive ? "relative left-[2px] " : ""
                  } ${size === "small" ? "mr-2" : "mr-3"}`}
                >
                  {opt.icon}
                </span>
              )}
              <span> {opt.title}</span>
            </div>
          );

          const handleClick = (e: React.MouseEvent) => {
            e.preventDefault();
            e.stopPropagation();
            opt.action?.();
            onClose?.();
          };

          if (opt.href) {
            return (
              <Link key={opt.id ?? idx} href={opt.href} onClick={onClose}>
                {content}
              </Link>
            );
          }

          return (
            <button
              key={opt.id ?? idx}
              onClick={handleClick}
              className="w-full text-left"
            >
              {content}
            </button>
          );
        })}
      </div>
    </motion.div>
  );
}
