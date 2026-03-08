"use client";

import React from "react";
import { Megaphone } from "lucide-react";

interface EmptyAnnouncementsProps {
  onCreateFirst?: () => void;
}

export function EmptyAnnouncements({ onCreateFirst }: EmptyAnnouncementsProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-4">
        <Megaphone className="h-10 w-10 text-primary" />
      </div>
      <h3 className="text-[18px] font-bold text-heading mb-2">
        No announcements yet
      </h3>
      <p className="text-[14px] text-para-muted text-center max-w-md mb-6">
        Get started by creating your first announcement to keep everyone
        informed about important updates, deadlines, and events.
      </p>
      <button
        onClick={onCreateFirst}
        className="px-6 py-2.5 bg-primary text-white text-[14px] font-semibold rounded-lg hover:bg-primary/90 transition-all shadow-sm hover:shadow"
      >
        Create First Announcement
      </button>
    </div>
  );
}
