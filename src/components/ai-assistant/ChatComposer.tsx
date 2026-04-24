"use client";

import React, { useState, useRef } from "react";
import { Send, Paperclip, FolderOpen, X, ArrowUp, Loader2 } from "lucide-react";
import type { ContextFile } from "@/types/ai-chat";
import type { AttachmentUploadProgress } from "@/hooks/ai-assistant/use-upload-attachment";

interface ChatComposerProps {
  onSendMessage: (message: string, files: ContextFile[]) => void;
  onAddContext: () => void;
  onUploadFile: (file: File) => void;
  contextFiles: ContextFile[];
  onRemoveContextFile: (fileId: string) => void;
  // `disabled` blocks send + attachment buttons (upload in progress OR
  // assistant is streaming). The textarea only respects `isStreaming` so
  // the user can keep typing their question while a file uploads.
  disabled?: boolean;
  isStreaming?: boolean;
  uploadProgress?: AttachmentUploadProgress | null;
  /** How many files are already attached to this conversation. */
  attachmentCount?: number;
  /** Max files allowed per conversation (backend-enforced). */
  maxAttachments?: number;
  /** True when attachmentCount >= maxAttachments. Disables attach buttons. */
  atAttachmentCap?: boolean;
}

export default function ChatComposer({
  onSendMessage,
  onAddContext,
  onUploadFile,
  contextFiles,
  onRemoveContextFile,
  disabled = false,
  isStreaming = false,
  uploadProgress,
  attachmentCount = 0,
  maxAttachments = 2,
  atAttachmentCap = false,
}: ChatComposerProps) {
  const [message, setMessage] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSend = () => {
    if ((message.trim() || contextFiles.length > 0) && !disabled) {
      onSendMessage(message.trim(), contextFiles);
      setMessage("");
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
      }
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
    const textarea = e.target;
    textarea.style.height = "auto";
    textarea.style.height = Math.min(textarea.scrollHeight, 120) + "px";
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file size (15MB limit)
      if (file.size > 15 * 1024 * 1024) {
        alert("File size must be less than 15MB");
        return;
      }
      onUploadFile(file);
    }
    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="w-full">
      <div className="max-w-3xl mx-auto">
        {/* Upload Progress Indicator */}
        {uploadProgress && uploadProgress.status === "uploading" && (
          <div className="mb-3">
            <div className="flex items-center gap-3 px-3 py-2 rounded-lg bg-secondary/10 border border-secondary/20">
              <Loader2 className="w-4 h-4 text-secondary animate-spin" />
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-para">
                    Uploading {uploadProgress.file.name}
                  </span>
                  <span className="text-xs text-para-muted">
                    {uploadProgress.progress}%
                  </span>
                </div>
                <div className="w-full bg-secondary/20 rounded-full h-1.5">
                  <div
                    className="bg-secondary h-1.5 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress.progress}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Main Composer Card */}
        <div className="relative group">
          {/* Glow effect behind the card (dark mode only) */}
          <div className="absolute -inset-[1px] rounded-2xl bg-gradient-to-b from-secondary/20 via-primary/10 to-transparent opacity-0 dark:opacity-100 blur-[1px] pointer-events-none" />

          <div className="relative rounded-2xl border border-light-border bg-background backdrop-blur-sm shadow-sm dark:shadow-lg dark:shadow-primary/5 overflow-hidden transition-all duration-300 focus-within:shadow-md dark:focus-within:shadow-primary/10 dark:focus-within:border-primary/30">
            {/* Context Files Preview */}
            {contextFiles.length > 0 && (
              <div className="px-4 pt-3 pb-1">
                <div className="flex flex-wrap gap-2">
                  {contextFiles.map((file) => (
                    <div
                      key={file.id}
                      className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-secondary/10 border border-secondary/20 text-sm"
                    >
                      <FolderOpen className="w-3.5 h-3.5 text-secondary" />
                      <span className="text-para max-w-[120px] truncate">
                        {file.name}
                      </span>
                      <button
                        onClick={() => onRemoveContextFile(file.id)}
                        className="text-para-muted hover:text-destructive transition-colors"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Textarea */}
            <div className="px-4 pt-3 pb-1">
              <textarea
                ref={textareaRef}
                value={message}
                onChange={handleTextareaChange}
                onKeyPress={handleKeyPress}
                placeholder="Ask anything or attach files from a room..."
                disabled={isStreaming}
                className="text-para bg-transparent w-full focus:outline-none resize-none max-h-[20px] text-sm overflow-y-auto placeholder:text-para-muted/70"
                rows={1}
              />
            </div>

            {/* Action Bar */}
            <div className="flex items-center justify-between px-3 pb-3 pt-1">
              <div className="flex items-center gap-1">
                {/* Hidden file input */}
                <input
                  ref={fileInputRef}
                  type="file"
                  onChange={handleFileSelect}
                  className="hidden"
                  accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png"
                />

                {/* Upload Local File */}
                <button
                  onClick={handleUploadClick}
                  className="p-2 rounded-lg hover:bg-secondary/10 dark:hover:bg-white/5 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                  title={
                    atAttachmentCap
                      ? `Max ${maxAttachments} files per conversation reached`
                      : "Upload file from device"
                  }
                  disabled={disabled || atAttachmentCap}
                  aria-label="Upload file from your device"
                >
                  <Paperclip className="h-[18px] w-[18px] text-para-muted" />
                </button>

                {/* Add from Rooms */}
                <button
                  onClick={onAddContext}
                  className="p-2 rounded-lg hover:bg-secondary/10 dark:hover:bg-white/5 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                  title={
                    atAttachmentCap
                      ? `Max ${maxAttachments} files per conversation reached`
                      : "Add files from rooms"
                  }
                  disabled={disabled || atAttachmentCap}
                  aria-label="Add files from your rooms"
                >
                  <FolderOpen className="h-[18px] w-[18px] text-secondary" />
                </button>

                {/* Attachment count indicator (only when at least one file
                    is already attached to the conversation) */}
                {attachmentCount > 0 && (
                  <span
                    className={`ml-1 text-xs ${
                      atAttachmentCap ? "text-destructive" : "text-para-muted"
                    }`}
                    title="Files attached to this conversation"
                  >
                    {attachmentCount}/{maxAttachments} files
                  </span>
                )}
              </div>

              {/* Send Button */}
              {(() => {
                const hasContent =
                  message.trim().length > 0 || contextFiles.length > 0;
                const canSend = hasContent && !disabled;
                return (
                  <button
                    onClick={handleSend}
                    disabled={!canSend}
                    title={
                      disabled && hasContent
                        ? uploadProgress?.status === "uploading"
                          ? "Waiting for upload to finish..."
                          : "Please wait..."
                        : "Send"
                    }
                    className={`p-2.5 rounded-xl transition-all duration-200 flex items-center justify-center ${
                      canSend
                        ? "bg-primary text-white hover:bg-primary/90 shadow-md dark:shadow-primary/30 hover:scale-105 active:scale-95"
                        : "bg-primary/30 dark:bg-white/5 text-white/40 dark:text-para-muted/40 cursor-not-allowed"
                    }`}
                  >
                    {disabled &&
                    uploadProgress?.status === "uploading" ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <ArrowUp className="h-4 w-4" />
                    )}
                  </button>
                );
              })()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
