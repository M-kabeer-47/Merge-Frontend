"use client";

import React from "react";
import { FileText } from "lucide-react";

interface NoDraftsProps {
  onCreateNew?: () => void;
}

export function NoDrafts({ onCreateNew }: NoDraftsProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
        <FileText className="h-10 w-10 text-para-muted" />
      </div>
      <h3 className="text-[18px] font-bold text-heading mb-2">No drafts</h3>
      <p className="text-[14px] text-para-muted text-center max-w-md mb-6">
        You don't have any draft announcements. Start writing a new announcement
        and save it as a draft to continue later.
      </p>
      <button
        onClick={onCreateNew}
        className="px-6 py-2.5 bg-primary text-white text-[14px] font-semibold rounded-lg hover:bg-primary/90 transition-all shadow-sm hover:shadow"
      >
        Create New Announcement
      </button>
    </div>
  );
}
