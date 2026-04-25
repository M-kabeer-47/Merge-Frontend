"use client";

import React, { useState } from "react";
import { X, Calendar, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import useCreateSession from "@/hooks/live-sessions/use-create-session";
import DateTimePicker from "@/components/ui/DateTimePicker";

interface ScheduleSessionModalProps {
  roomId: string;
  onClose: () => void;
}

export default function ScheduleSessionModal({
  roomId,
  onClose,
}: ScheduleSessionModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [scheduledAt, setScheduledAt] = useState("");

  const { createSession, isCreating } = useCreateSession({
    onSuccess: onClose,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !scheduledAt) return;

    await createSession({
      roomId,
      title: title.trim(),
      description: description.trim() || undefined,
      scheduledAt,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-background rounded-xl shadow-2xl w-full max-w-md mx-4 p-6 border border-light-border">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
              <Calendar className="w-5 h-5 text-primary" />
            </div>
            <h2 className="text-lg font-semibold text-heading">
              Schedule Session
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5 text-para" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-heading mb-1">
              Session Title *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., React Hooks Workshop"
              maxLength={200}
              className="w-full px-3 py-2 border border-light-border rounded-lg text-sm text-para placeholder:text-para-muted focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-heading mb-1">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What will be covered in this session?"
              maxLength={1000}
              rows={3}
              className="w-full px-3 py-2 border border-light-border rounded-lg text-sm text-para placeholder:text-para-muted focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none"
            />
          </div>

          {/* Date & Time */}
          <div>
            <label className="block text-sm font-medium text-heading mb-1">
              Date & Time *
            </label>
            <DateTimePicker
              value={scheduledAt}
              onChange={setScheduledAt}
              placeholder="Select date and time"
              minDate={new Date()}
              expandUp={true}
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              size="sm"
              disabled={isCreating || !title.trim() || !scheduledAt}
            >
              {isCreating ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Calendar className="w-4 h-4 mr-2" />
              )}
              Schedule
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
