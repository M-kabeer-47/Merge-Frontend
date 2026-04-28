"use client";

import React, { useState, useRef } from "react";
import { Paperclip, Image, Calendar, Send, X } from "lucide-react";
import DateTimePicker from "@/components/ui/DateTimePicker";
import { Button } from "../ui/Button";

interface AnnouncementComposerProps {
  initialData?: {
    title: string;
    content: string;
    scheduledFor?: Date;
  };
  onPost: (data: {
    title: string;
    content: string;
    scheduledFor?: Date;
  }) => void;
  actionLabel?: string;
}

export default function AnnouncementComposer({
  initialData,
  onPost,
  actionLabel = "Post",
}: AnnouncementComposerProps) {
  const [title, setTitle] = useState(initialData?.title || "");
  const [content, setContent] = useState(initialData?.content || "");
  const [scheduledFor, setScheduledFor] = useState<Date | undefined>(
    initialData?.scheduledFor,
  );
  const [showSchedulePicker, setShowSchedulePicker] = useState(
    !!initialData?.scheduledFor,
  );

  const handlePost = () => {
    if (!title.trim() || !content.trim()) return;

    onPost({
      title,
      content,
      scheduledFor,
    });

    // Reset form
    setTitle("");
    setContent("");
    setScheduledFor(undefined);
    setShowSchedulePicker(false);
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

      {/* Scheduled Badge / Picker Area */}
      {showSchedulePicker && (
        <div className="px-4 pb-4 border-t border-light-border bg-gray-50/50 pt-3">
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium text-heading">
              Schedule Post
            </label>
            <button
              onClick={() => {
                setShowSchedulePicker(false);
                setScheduledFor(undefined);
              }}
              className="text-para-muted hover:text-heading"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <DateTimePicker
            value={scheduledFor ? scheduledFor.toISOString() : ""}
            onChange={(val) => setScheduledFor(val ? new Date(val) : undefined)}
            placeholder="Select date and time"
            minDate={new Date()}
            expandUp={true}
          />
        </div>
      )}

      {/* Toolbar */}
      <div className="flex items-center justify-between px-4 py-3 border-t border-light-border">
        <div className="flex items-center gap-1">
          {/* Schedule Toggle Button */}
          <button
            onClick={() => setShowSchedulePicker(!showSchedulePicker)}
            className={`p-2 rounded transition-colors group ${
              showSchedulePicker || scheduledFor
                ? "bg-secondary/10 text-secondary"
                : "hover:bg-gray-100 text-para-muted"
            }`}
            aria-label="Schedule announcement"
            title="Schedule announcement"
          >
            <Calendar
              className={`h-[18px] w-[18px] ${showSchedulePicker || scheduledFor ? "text-secondary" : "group-hover:text-para"}`}
            />
          </button>
        </div>

        {/* Post Button */}
        <Button
          onClick={handlePost}
          disabled={!title.trim() || !content.trim()}
          aria-label="Post announcement"
        >
          <Send className="h-4 w-4" />
          {scheduledFor ? "Schedule" : actionLabel}
        </Button>
      </div>
    </div>
  );
}
