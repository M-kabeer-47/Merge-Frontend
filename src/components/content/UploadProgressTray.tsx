"use client";

import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import type { UploadProgress as UploadProgressType } from "@/types/content";
import { formatFileSize } from "@/utils/file-helpers";

interface UploadProgressTrayProps {
  uploads: UploadProgressType[];
  onCancel?: (id: string) => void;
  onDismiss?: (id: string) => void;
  onDismissAll?: () => void;
}

export default function UploadProgressTray({
  uploads,
  onCancel,
  onDismiss,
  onDismissAll,
}: UploadProgressTrayProps) {
  if (uploads.length === 0) return null;

  const activeUploads = uploads.filter((u) => u.status === "uploading");
  const completedUploads = uploads.filter((u) => u.status === "completed");
  const errorUploads = uploads.filter((u) => u.status === "error");

  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 100, opacity: 0 }}
      className="fixed bottom-6 right-6 w-96 bg-main-background border border-light-border rounded-lg shadow-2xl z-50 max-h-[400px] flex flex-col"
    >
      {/* Header */}
      <div className="p-4 border-b border-light-border flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-semibold text-heading">
            Uploading {activeUploads.length > 0 ? activeUploads.length : ""}{" "}
            file
            {activeUploads.length !== 1 ? "s" : ""}
          </h3>
          {activeUploads.length > 0 && (
            <Loader2 className="h-4 w-4 text-primary animate-spin" />
          )}
        </div>
        <div className="flex items-center gap-1">
          {uploads.every((u) => u.status !== "uploading") && onDismissAll && (
            <button
              onClick={onDismissAll}
              className="text-xs text-para hover:text-primary transition-colors px-2 py-1"
            >
              Clear all
            </button>
          )}
          <button
            onClick={onDismissAll}
            className="w-8 h-8 rounded-lg hover:bg-secondary/10 flex items-center justify-center transition-colors"
            aria-label="Close upload tray"
          >
            <X className="h-4 w-4 text-para" />
          </button>
        </div>
      </div>

      {/* Upload List */}
      <div className="flex-1 overflow-y-auto p-2 space-y-2">
        <AnimatePresence>
          {uploads.map((upload) => (
            <motion.div
              key={upload.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="p-3 bg-secondary/5 rounded-lg"
            >
              {/* File Name and Status */}
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-heading truncate">
                    {upload.fileName}
                  </p>
                  <p className="text-xs text-para-muted">
                    {formatFileSize(upload.size)}
                  </p>
                </div>

                {/* Status Icon */}
                <div className="flex-shrink-0">
                  {upload.status === "uploading" && (
                    <button
                      onClick={() => onCancel?.(upload.id)}
                      className="w-6 h-6 rounded hover:bg-secondary/10 flex items-center justify-center transition-colors"
                      aria-label="Cancel upload"
                    >
                      <X className="h-4 w-4 text-para-muted" />
                    </button>
                  )}
                  {upload.status === "completed" && (
                    <button
                      onClick={() => onDismiss?.(upload.id)}
                      className="w-6 h-6 rounded hover:bg-secondary/10 flex items-center justify-center transition-colors"
                      aria-label="Dismiss"
                    >
                      <CheckCircle className="h-5 w-5 text-[#217346]" />
                    </button>
                  )}
                  {upload.status === "error" && (
                    <button
                      onClick={() => onDismiss?.(upload.id)}
                      className="w-6 h-6 rounded hover:bg-secondary/10 flex items-center justify-center transition-colors"
                      aria-label="Dismiss"
                    >
                      <AlertCircle className="h-5 w-5 text-destructive" />
                    </button>
                  )}
                </div>
              </div>

              {/* Progress Bar */}
              {upload.status === "uploading" && (
                <div className="relative h-2 bg-secondary/20 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${upload.progress}%` }}
                    className="absolute inset-y-0 left-0 bg-gradient-to-r from-primary to-secondary rounded-full"
                  />
                </div>
              )}

              {/* Progress Percentage */}
              {upload.status === "uploading" && (
                <p className="text-xs text-para-muted mt-1">
                  {upload.progress}% complete
                </p>
              )}

              {/* Error Message */}
              {upload.status === "error" && upload.error && (
                <p className="text-xs text-destructive mt-1">{upload.error}</p>
              )}

              {/* Success Message */}
              {upload.status === "completed" && (
                <p className="text-xs text-[#217346] mt-1">Upload complete</p>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Summary Footer (if there are completed/error uploads) */}
      {(completedUploads.length > 0 || errorUploads.length > 0) &&
        activeUploads.length === 0 && (
          <div className="p-3 border-t border-light-border flex-shrink-0 bg-secondary/5">
            <div className="flex items-center justify-between text-xs">
              {completedUploads.length > 0 && (
                <span className="text-[#217346] font-medium">
                  {completedUploads.length} completed
                </span>
              )}
              {errorUploads.length > 0 && (
                <span className="text-destructive font-medium">
                  {errorUploads.length} failed
                </span>
              )}
            </div>
          </div>
        )}
    </motion.div>
  );
}
