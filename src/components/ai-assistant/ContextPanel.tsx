"use client";

import React from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  X,
  FileText,
  Star,
  Folder,
  Info,
  ChevronRight,
} from "lucide-react";
import type { ContextFile } from "@/types/ai-chat";

interface ContextPanelProps {
  files: ContextFile[];
  onRemoveFile: (fileId: string) => void;
  onTogglePrimary: (fileId: string) => void;
  onClose?: () => void;
  isMobile?: boolean;
}

export default function ContextPanel({
  files,
  onRemoveFile,
  onTogglePrimary,
  onClose,
  isMobile = false,
}: ContextPanelProps) {
  const getFileIcon = (type: string) => {
    if (type.includes("pdf")) return "📄";
    if (type.includes("image")) return "🖼️";
    if (type.includes("video")) return "🎥";
    if (type.includes("document")) return "📝";
    return "📎";
  };

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return "";
    const kb = bytes / 1024;
    if (kb < 1024) return `${kb.toFixed(1)} KB`;
    return `${(kb / 1024).toFixed(1)} MB`;
  };

  return (
    <div
      className={`flex flex-col h-full ${
        isMobile
          ? "bg-main-background"
          : "border-l border-light-border bg-gray-50/50"
      }`}
    >
      {/* Header */}
      <div className="px-4 py-4 border-b border-light-border bg-main-background">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-raleway font-bold text-heading">
            Context Files
          </h3>
          {isMobile && (
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <X className="w-5 h-5 text-para-muted" />
            </button>
          )}
        </div>
        <p className="text-xs text-para-muted leading-relaxed">
          {files.length === 0
            ? "No files added yet. Add files from your rooms to provide context."
            : `${files.length} file${files.length !== 1 ? "s" : ""} added as context`}
        </p>
      </div>

      {/* Privacy Note */}
      {files.length > 0 && (
        <div className="mx-4 mt-4 p-3 rounded-lg bg-info/5 border border-info/20 flex gap-2">
          <Info className="w-4 h-4 text-info flex-shrink-0 mt-0.5" />
          <p className="text-xs text-para-muted leading-relaxed">
            These files are visible only to you and help the AI provide
            context-aware responses for this session.
          </p>
        </div>
      )}

      {/* Files List */}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        {files.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center py-12">
            <div className="w-16 h-16 rounded-full bg-secondary/10 flex items-center justify-center mb-4">
              <Folder className="w-8 h-8 text-secondary" />
            </div>
            <p className="text-sm font-medium text-heading mb-1">
              No context files
            </p>
            <p className="text-xs text-para-muted max-w-[200px]">
              Click the paperclip icon to add files from your rooms
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            <AnimatePresence>
              {files.map((file) => (
                <motion.div
                  key={file.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="group relative bg-main-background border border-light-border rounded-lg p-3 hover:shadow-sm transition-all"
                >
                  {/* Primary Badge */}
                  {file.isPrimary && (
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-accent rounded-full flex items-center justify-center shadow-sm">
                      <Star className="w-3.5 h-3.5 text-white" fill="currentColor" />
                    </div>
                  )}

                  <div className="flex items-start gap-3">
                    {/* File Icon */}
                    <div className="text-2xl flex-shrink-0">
                      {getFileIcon(file.type)}
                    </div>

                    {/* File Info */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-heading truncate mb-0.5">
                        {file.name}
                      </p>
                      <div className="flex items-center gap-1.5 text-xs text-para-muted mb-1">
                        <span className="truncate">{file.roomName}</span>
                        {file.size && (
                          <>
                            <span>•</span>
                            <span>{formatFileSize(file.size)}</span>
                          </>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-1 mt-2">
                        <button
                          onClick={() => onTogglePrimary(file.id)}
                          className={`text-xs px-2 py-1 rounded transition-colors ${
                            file.isPrimary
                              ? "bg-accent/10 text-accent"
                              : "bg-gray-100 text-para-muted hover:bg-gray-200"
                          }`}
                        >
                          {file.isPrimary ? "Primary" : "Set as primary"}
                        </button>
                      </div>
                    </div>

                    {/* Remove Button */}
                    <button
                      onClick={() => onRemoveFile(file.id)}
                      className="p-1.5 rounded hover:bg-destructive/10 transition-colors text-para-muted hover:text-destructive opacity-0 group-hover:opacity-100"
                      title="Remove file"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Footer Tip */}
      {files.length > 0 && (
        <div className="px-4 py-3 border-t border-light-border bg-main-background">
          <p className="text-xs text-para-muted leading-relaxed">
            💡 Tip: Mark a file as <strong>primary</strong> to give it more
            weight in AI responses.
          </p>
        </div>
      )}
    </div>
  );
}

