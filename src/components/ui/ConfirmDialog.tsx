"use client";

import { X, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { motion } from "framer-motion";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  itemName?: string;
  confirmText?: string;
  cancelText?: string;
  isLoading?: boolean;
  variant?: "danger" | "warning" | "default";
}

export default function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  itemName,
  confirmText = "Confirm",
  cancelText = "Cancel",
  isLoading = false,
  variant = "danger",
}: ConfirmDialogProps) {
  if (!isOpen) return null;

  const handleConfirm = () => {
    onConfirm();
  };

  const getVariantStyles = () => {
    switch (variant) {
      case "danger":
        return {
          icon: "text-destructive",
          iconBg: "bg-destructive/10",
          button: "bg-destructive hover:bg-destructive/90 text-white",
        };
      case "warning":
        return {
          icon: "text-amber-500",
          iconBg: "bg-amber-500/10",
          button: "bg-amber-500 hover:bg-amber-600 text-white",
        };
      default:
        return {
          icon: "text-primary",
          iconBg: "bg-primary/10",
          button: "bg-primary hover:bg-primary/90 text-white",
        };
    }
  };

  const styles = getVariantStyles();
  const isDeleteFolder = title.toLowerCase() === "delete folder";
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.3 }}
        className="bg-main-background rounded-lg shadow-xl w-full max-w-xl mx-4 border border-light-border">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-light-border">
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-full ${styles.iconBg} flex items-center justify-center`}
            >
              <AlertTriangle className={`w-5 h-5 ${styles.icon}`} />
            </div>
            <h2 className="text-xl font-bold text-heading font-raleway">
              {title}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-background transition-colors"
            disabled={isLoading}
          >
            <X className="w-5 h-5 text-para-muted" />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-4">
          <p className="text-para text-sm leading-relaxed">{message}

            <span className="font-bold">{" " + itemName + "?"}</span>
            {isDeleteFolder && " All content inside this folder will also be deleted."}
          </p>

        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 p-4 border-t border-light-border bg-background/50">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isLoading}
            className="min-w-[110px]"


          >
            {cancelText}
          </Button>
          <Button
            type="button"
            onClick={handleConfirm}
            disabled={isLoading}

            className={`${styles.button} min-w-[110px]`}
          >
            {isLoading ? <LoadingSpinner size="sm" text="Please wait..." /> : confirmText}
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
