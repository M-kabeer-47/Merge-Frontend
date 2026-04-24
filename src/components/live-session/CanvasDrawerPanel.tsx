"use client";

import React, { useState } from "react";
import { ChevronDown, ChevronUp, PenTool, X } from "lucide-react";
import type { Attendee } from "@/types/live-session";

interface CanvasDrawerPanelProps {
  attendees: Attendee[];
  drawers: string[];
  onToggleDraw: (userId: string) => void;
  maxDrawers?: number;
}

export default function CanvasDrawerPanel({
  attendees,
  drawers,
  onToggleDraw,
  maxDrawers = 5,
}: CanvasDrawerPanelProps) {
  const [collapsed, setCollapsed] = useState(false);

  const participants = attendees.filter((a) => a.role !== "host");
  const drawerCount = drawers.length;

  if (collapsed) {
    return (
      <div className="absolute top-14 left-3 z-[200]">
        <button
          onClick={() => setCollapsed(false)}
          className="flex items-center gap-2 bg-[#202124]/90 backdrop-blur-sm text-white px-3 py-2 rounded-lg text-sm border border-white/10 hover:bg-[#2d2f31] transition-colors"
        >
          <PenTool className="w-4 h-4" />
          <span>{drawerCount}/{maxDrawers}</span>
          <ChevronDown className="w-3.5 h-3.5" />
        </button>
      </div>
    );
  }

  return (
    <div className="absolute top-14 left-3 z-[200] w-64">
      <div className="bg-[#202124]/95 backdrop-blur-sm rounded-lg border border-white/10 shadow-xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-3 py-2.5 border-b border-white/10">
          <div className="flex items-center gap-2">
            <PenTool className="w-4 h-4 text-[#8ab4f8]" />
            <span className="text-white text-sm font-medium">Draw Access</span>
            <span className="text-xs text-white/50 bg-white/10 px-1.5 py-0.5 rounded">
              {drawerCount}/{maxDrawers}
            </span>
          </div>
          <button
            onClick={() => setCollapsed(true)}
            className="w-6 h-6 rounded hover:bg-white/10 flex items-center justify-center transition-colors"
          >
            <ChevronUp className="w-3.5 h-3.5 text-white/60" />
          </button>
        </div>

        {/* Participant list */}
        <div className="max-h-[240px] overflow-y-auto">
          {participants.length === 0 ? (
            <div className="px-3 py-4 text-center text-white/40 text-xs">
              No participants yet
            </div>
          ) : (
            participants.map((p) => {
              const hasDraw = drawers.includes(p.id);
              const isMaxed = drawerCount >= maxDrawers && !hasDraw;

              return (
                <div
                  key={p.id}
                  className="flex items-center justify-between px-3 py-2 hover:bg-white/5 transition-colors"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    {p.avatar ? (
                      <img
                        src={p.avatar}
                        alt={p.name}
                        className="w-6 h-6 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-6 h-6 rounded-full bg-[#3c4043] flex items-center justify-center text-[10px] text-white font-medium">
                        {p.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <span className="text-white text-xs truncate">{p.name}</span>
                  </div>
                  <button
                    onClick={() => onToggleDraw(p.id)}
                    disabled={isMaxed}
                    className={`
                      px-2 py-1 rounded text-[10px] font-medium transition-colors
                      ${hasDraw
                        ? "bg-[#1a73e8] text-white hover:bg-[#1557b0]"
                        : isMaxed
                          ? "bg-white/5 text-white/30 cursor-not-allowed"
                          : "bg-white/10 text-white/70 hover:bg-white/20"
                      }
                    `}
                    title={isMaxed ? "Max drawers reached" : hasDraw ? "Revoke draw" : "Grant draw"}
                  >
                    {hasDraw ? "Drawing" : isMaxed ? "Full" : "Grant"}
                  </button>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
