"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

export default function CalendarWidget() {
  return (
    <div className="bg-background border border-light-border rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-raleway font-semibold text-heading">Calendar</h3>
        <div className="flex items-center gap-2">
          <button className="p-1 hover:bg-secondary/10 rounded transition-colors" aria-label="Previous month">
            <ChevronLeft className="w-4 h-4 text-para" />
          </button>
          <span className="text-sm text-para">Sept 2024</span>
          <button className="p-1 hover:bg-secondary/10 rounded transition-colors" aria-label="Next month">
            <ChevronRight className="w-4 h-4 text-para" />
          </button>
        </div>
      </div>
      <div className="aspect-square bg-secondary/5 rounded-md flex items-center justify-center">
        <span className="text-para-muted text-sm">[Monthly View]</span>
      </div>
    </div>
  );
}
