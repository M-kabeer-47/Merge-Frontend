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
  disabled?: boolean;
  uploadProgress?: AttachmentUploadProgress | null;
}

export default function ChatComposer({
  onSendMessage,
  onAddContext,
  onUploadFile,
  contextFiles,
  onRemoveContextFile,
  disabled = false,
  uploadProgress,
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
    <div className=" bg-main-background w-full">
      {/* Upload Progress Indicator */}
      {uploadProgress && uploadProgress.status === "uploading" && (
        <div className="px-4 pt-3">
          <div className="max-w-3xl mx-auto">
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
        </div>
      )}

      {/* Context Files Preview */}
      {contextFiles.length > 0 && (
        <div className="px-4 pt-3 pb-2">
          <div className="max-w-3xl mx-auto">
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
        </div>
      )}

      <div className="px-4 py-3 w-full">
        <div className="max-w-3xl mx-auto">
          <div className="border border-light-border rounded-lg p-3">
            {/* Row 1: Textarea */}
            <textarea
              ref={textareaRef}
              value={message}
              onChange={handleTextareaChange}
              onKeyPress={handleKeyPress}
              placeholder="Ask anything or attach files from a room..."
              disabled={disabled}
              className="text-para w-full focus:outline-none resize-none min-h-[46px] max-h-[120px] text-sm overflow-y-auto placeholder:text-para-muted"
              rows={1}
            />

            {/* Row 2: Upload and Send buttons */}
            <div className="flex items-center justify-between mt-2 pt-2 border-t border-light-border">
              <div className="flex items-center gap-2">
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
                  className="p-2 hover:bg-secondary/10 rounded transition-colors"
                  title="Upload file from device"
                  disabled={disabled}
                  aria-label="Upload file from your device"
                >
                  <Paperclip className="h-4 w-4 text-para-muted" />
                </button>

                {/* Add from Rooms */}
                <button
                  onClick={onAddContext}
                  className="p-2 hover:bg-secondary/10 rounded transition-colors"
                  title="Add files from rooms"
                  disabled={disabled}
                  aria-label="Add files from your rooms"
                >
                  <FolderOpen className="h-4 w-4 text-secondary" />
                </button>
              </div>

              {/* Send Button */}
              <button
                onClick={handleSend}
                disabled={!message.trim() && contextFiles.length === 0}
                className={`px-3 py-2.5 rounded-lg transition-all duration-200 flex items-center gap-2 ${
                  message.trim() || contextFiles.length > 0
                    ? "bg-primary text-white hover:bg-primary/90 shadow-sm"
                    : "bg-primary/50 text-white cursor-not-allowed"
                }`}
              >
                <ArrowUp className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
