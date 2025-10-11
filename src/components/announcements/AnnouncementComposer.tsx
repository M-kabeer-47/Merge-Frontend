"use client";

import React, { useState, useRef } from "react";
import { Paperclip, Image, Calendar, Send } from "lucide-react";

interface AnnouncementComposerProps {
  onPost: (data: {
    title: string;
    content: string;
    scheduledFor?: Date;
    attachments: File[];
  }) => void;
}

export default function AnnouncementComposer({
  onPost,
}: AnnouncementComposerProps) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [attachments, setAttachments] = useState<File[]>([]);
  const [scheduledFor, setScheduledFor] = useState<Date | undefined>();
  const [showSchedulePicker, setShowSchedulePicker] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const handlePost = () => {
    if (!title.trim() || !content.trim()) return;

    onPost({
      title,
      content,
      scheduledFor,
      attachments,
    });

    // Reset form
    setTitle("");
    setContent("");
    setAttachments([]);
    setScheduledFor(undefined);
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setAttachments((prev) => [...prev, ...files]);
  };

  const removeAttachment = (index: number) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  return (
    <div
      className="bg-background rounded-lg border border-light-border shadow-sm"
      role="region"
      aria-label="Announcement composer"
    >
      {/* Title Input */}
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Announcement title..."
        className="w-full px-4 py-3 text-[15px] font-semibold text-heading placeholder:text-para-muted bg-transparent border-none focus:outline-none focus:ring-0"
        aria-label="Announcement title"
      />

      {/* Divider */}
      <div className="border-t border-light-border" />

      {/* Text Input Area */}
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Write your announcement content..."
        className="w-full px-4 py-3 text-[15px] text-para placeholder:text-para-muted bg-transparent border-none resize-none focus:outline-none focus:ring-0 min-h-[120px] max-h-[160px]"
        aria-label="Announcement content"
      />

      {/* Attachments Preview */}
      {attachments.length > 0 && (
        <div className="px-4 pb-2 space-y-2">
          {attachments.map((file, index) => (
            <div
              key={index}
              className="flex items-center gap-2 text-sm text-para bg-gray-50 rounded px-3 py-2"
            >
              {file.type.startsWith("image/") ? (
                <Image className="h-4 w-4 text-secondary" />
              ) : (
                <Paperclip className="h-4 w-4 text-secondary" />
              )}
              <span className="flex-1 truncate">{file.name}</span>
              <span className="text-para-muted text-xs">
                {formatFileSize(file.size)}
              </span>
              <button
                onClick={() => removeAttachment(index)}
                className="text-para-muted hover:text-destructive transition-colors"
                aria-label={`Remove ${file.name}`}
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Scheduled Badge */}
      {scheduledFor && (
        <div className="px-4 pb-2">
          <div className="inline-flex items-center gap-2 text-xs bg-secondary/10 text-secondary px-3 py-1.5 rounded-full">
            <Calendar className="h-3 w-3" />
            <span>
              Scheduled for:{" "}
              {scheduledFor.toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
            <button
              onClick={() => setScheduledFor(undefined)}
              className="hover:text-destructive transition-colors"
              aria-label="Remove schedule"
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* Toolbar */}
      <div className="flex items-center justify-between px-4 py-3 border-t border-light-border">
        <div className="flex items-center gap-1">
          {/* Attach File */}
          <button
            onClick={() => fileInputRef.current?.click()}
            className="p-2 rounded hover:bg-gray-100 transition-colors group"
            aria-label="Attach file"
            title="Attach file"
          >
            <Paperclip className="h-[18px] w-[18px] text-para-muted group-hover:text-para" />
          </button>
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            multiple
            onChange={handleFileSelect}
            aria-hidden="true"
          />

          {/* Attach Image */}
          <button
            onClick={() => imageInputRef.current?.click()}
            className="p-2 rounded hover:bg-gray-100 transition-colors group"
            aria-label="Attach image"
            title="Attach image"
          >
            <Image className="h-[18px] w-[18px] text-para-muted group-hover:text-para" />
          </button>
          <input
            ref={imageInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            multiple
            onChange={handleFileSelect}
            aria-hidden="true"
          />

          {/* Schedule */}
          <button
            onClick={() => setShowSchedulePicker(!showSchedulePicker)}
            className="p-2 rounded hover:bg-gray-100 transition-colors group"
            aria-label="Schedule announcement"
            title="Schedule announcement"
          >
            <Calendar className="h-[18px] w-[18px] text-para-muted group-hover:text-para" />
          </button>
        </div>

        {/* Post Button */}
        <button
          onClick={handlePost}
          disabled={!title.trim() || !content.trim()}
          className="flex items-center gap-2 px-6 h-[40px] bg-secondary text-white rounded-lg hover:bg-secondary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-[15px] font-medium"
          aria-label="Post announcement"
        >
          <Send className="h-4 w-4" />
          {scheduledFor ? "Schedule" : "Post"}
        </button>
      </div>

      {/* Simple Schedule Picker (Inline) */}
      {showSchedulePicker && (
        <div className="px-4 pb-4 border-t border-light-border bg-gray-50">
          <div className="pt-3 space-y-2">
            <label className="block text-sm font-medium text-heading">
              Schedule for later
            </label>
            <input
              type="datetime-local"
              className="w-full px-3 py-2 border border-light-border rounded-lg text-sm text-para focus:outline-none focus:ring-2 focus:ring-secondary/20"
              onChange={(e) => {
                if (e.target.value) {
                  setScheduledFor(new Date(e.target.value));
                  setShowSchedulePicker(false);
                }
              }}
              min={new Date().toISOString().slice(0, 16)}
            />
            <p className="text-xs text-para-muted">
              Timezone: {Intl.DateTimeFormat().resolvedOptions().timeZone}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
