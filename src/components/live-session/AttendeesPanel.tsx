/**
 * AttendeesPanel Component
 *
 * Clean row-based attendee list. Host sees mic / camera toggle icons per
 * participant plus bulk "Mute All" / "Disable Camera All" buttons at top.
 * Non-host users see a read-only list with names and role badges.
 */

"use client";

import React, { useState, useMemo } from "react";
import {
  Search,
  Users,
  Crown,
  Shield,
  Mic,
  MicOff,
  Video,
  VideoOff,
  UserX,
} from "lucide-react";
import type { Attendee } from "@/types/live-session";

interface AttendeesPanelProps {
  attendees: Attendee[];
  isHost?: boolean;
  onMuteAttendee?: (id: string) => void;
  onStopCamera?: (id: string) => void;
  onGrantCanvasEdit?: (id: string) => void;
  onPromoteAttendee?: (id: string) => void;
  onRemoveAttendee?: (id: string) => void;
  onKickAttendee?: (id: string) => void;
  onMuteAll?: () => void;
  onUnmuteAll?: () => void;
  onDisableCameraAll?: () => void;
  onEnableCameraAll?: () => void;
  darkMode?: boolean;
}

export default function AttendeesPanel({
  attendees,
  isHost = false,
  onMuteAttendee,
  onStopCamera,
  onKickAttendee,
  onMuteAll,
  onUnmuteAll,
  onDisableCameraAll,
  onEnableCameraAll,
  darkMode = false,
}: AttendeesPanelProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredAttendees = useMemo(() => {
    if (!searchQuery) return attendees;
    const q = searchQuery.toLowerCase();
    return attendees.filter((a) => a.name.toLowerCase().includes(q));
  }, [attendees, searchQuery]);

  // Separate host from participants for ordering
  const host = filteredAttendees.find((a) => a.role === "host");
  const participants = filteredAttendees.filter((a) => a.role !== "host");

  const textPrimary = darkMode ? "text-white" : "text-heading";
  const textSecondary = darkMode ? "text-white/60" : "text-para-muted";
  const borderColor = darkMode ? "border-white/10" : "border-light-border";
  const hoverBg = darkMode ? "hover:bg-white/5" : "hover:bg-secondary/5";
  const inputBg = darkMode
    ? "bg-white/5 border-white/10 text-white placeholder:text-white/40"
    : "bg-secondary/5 border-light-border text-para placeholder:text-para-muted";
  const btnBg = darkMode
    ? "bg-white/10 hover:bg-white/20 text-white/80"
    : "bg-secondary/10 hover:bg-secondary/20 text-para";
  const btnActiveBg = darkMode
    ? "bg-[#1a73e8] text-white"
    : "bg-primary text-white";

  return (
    <div className="h-full flex flex-col">
      {/* Search */}
      <div className={`px-3 pt-3 pb-2`}>
        <div className="relative">
          <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${textSecondary}`} />
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`w-full pl-9 pr-3 py-1.5 rounded-lg text-sm border focus:outline-none focus:ring-2 focus:ring-primary/30 ${inputBg}`}
          />
        </div>
      </div>

      {/* Host bulk controls */}
      {isHost && (
        <div className={`px-3 pb-2 flex gap-1.5 flex-wrap`}>
          <button onClick={onMuteAll} className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors ${btnBg}`}>
            <MicOff className="w-3 h-3" /> Mute All
          </button>
          <button onClick={onUnmuteAll} className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors ${btnBg}`}>
            <Mic className="w-3 h-3" /> Unmute All
          </button>
          <button onClick={onDisableCameraAll} className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors ${btnBg}`}>
            <VideoOff className="w-3 h-3" /> Cam Off All
          </button>
          <button onClick={onEnableCameraAll} className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors ${btnBg}`}>
            <Video className="w-3 h-3" /> Cam On All
          </button>
        </div>
      )}

      <div className={`border-b ${borderColor}`} />

      {/* Attendee rows */}
      <div className="flex-1 overflow-y-auto">
        {/* Host row */}
        {host && (
          <AttendeeRow
            attendee={host}
            isHost={false}
            textPrimary={textPrimary}
            textSecondary={textSecondary}
            hoverBg={hoverBg}
            borderColor={borderColor}
            darkMode={darkMode}
          />
        )}

        {/* Participant rows */}
        {participants.map((a) => (
          <AttendeeRow
            key={a.id}
            attendee={a}
            isHost={isHost}
            onToggleMic={onMuteAttendee}
            onToggleCamera={onStopCamera}
            onKick={onKickAttendee}
            textPrimary={textPrimary}
            textSecondary={textSecondary}
            hoverBg={hoverBg}
            borderColor={borderColor}
            darkMode={darkMode}
          />
        ))}

        {filteredAttendees.length === 0 && (
          <div className={`flex flex-col items-center justify-center py-12 ${textSecondary}`}>
            <Users className="w-8 h-8 mb-2 opacity-40" />
            <p className="text-sm">No attendees found</p>
          </div>
        )}
      </div>

      {/* Footer count */}
      <div className={`px-3 py-2 text-[11px] ${textSecondary} border-t ${borderColor} text-center shrink-0`}>
        {attendees.length} participant{attendees.length !== 1 ? "s" : ""} in session
      </div>
    </div>
  );
}

/* ─── Single attendee row ─────────────────────────────────── */

function AttendeeRow({
  attendee,
  isHost,
  onToggleMic,
  onToggleCamera,
  onKick,
  textPrimary,
  textSecondary,
  hoverBg,
  borderColor,
  darkMode,
}: {
  attendee: Attendee;
  isHost: boolean;
  onToggleMic?: (id: string) => void;
  onToggleCamera?: (id: string) => void;
  onKick?: (id: string) => void;
  textPrimary: string;
  textSecondary: string;
  hoverBg: string;
  borderColor: string;
  darkMode: boolean;
}) {
  const initials = attendee.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const roleBadge =
    attendee.role === "host" ? (
      <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-semibold bg-amber-500/20 text-amber-400">
        <Crown className="w-2.5 h-2.5" /> Host
      </span>
    ) : attendee.role === "co-host" ? (
      <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-semibold bg-blue-500/20 text-blue-400">
        <Shield className="w-2.5 h-2.5" /> Co-Host
      </span>
    ) : null;

  const iconBtn = (darkMode: boolean) =>
    darkMode
      ? "w-7 h-7 rounded-md flex items-center justify-center transition-colors"
      : "w-7 h-7 rounded-md flex items-center justify-center transition-colors";

  return (
    <div className={`flex items-center gap-3 px-3 py-2.5 ${hoverBg} transition-colors border-b ${borderColor}`}>
      {/* Avatar */}
      {attendee.avatar ? (
        <img
          src={attendee.avatar}
          alt={attendee.name}
          className="w-8 h-8 rounded-full object-cover shrink-0"
        />
      ) : (
        <div className="w-8 h-8 rounded-full bg-[#3c4043] flex items-center justify-center text-[11px] text-white font-semibold shrink-0">
          {initials}
        </div>
      )}

      {/* Name + role */}
      <div className="flex-1 min-w-0">
        <p className={`text-sm font-medium truncate ${textPrimary}`}>
          {attendee.name}
        </p>
        {roleBadge && <div className="mt-0.5">{roleBadge}</div>}
      </div>

      {/* Host-only: mic / camera toggle icons */}
      {isHost && attendee.role !== "host" ? (
        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={() => onToggleMic?.(attendee.id)}
            className={`${iconBtn(darkMode)} ${
              attendee.micOn
                ? darkMode ? "bg-white/10 hover:bg-red-500/30" : "bg-secondary/10 hover:bg-red-500/20"
                : darkMode ? "bg-red-500/20 hover:bg-white/10" : "bg-red-500/10 hover:bg-secondary/10"
            }`}
            title={attendee.micOn ? "Mute" : "Unmute"}
          >
            {attendee.micOn ? (
              <Mic className="w-3.5 h-3.5 text-green-400" />
            ) : (
              <MicOff className="w-3.5 h-3.5 text-red-400" />
            )}
          </button>
          <button
            onClick={() => onToggleCamera?.(attendee.id)}
            className={`${iconBtn(darkMode)} ${
              attendee.webcamOn
                ? darkMode ? "bg-white/10 hover:bg-red-500/30" : "bg-secondary/10 hover:bg-red-500/20"
                : darkMode ? "bg-red-500/20 hover:bg-white/10" : "bg-red-500/10 hover:bg-secondary/10"
            }`}
            title={attendee.webcamOn ? "Disable camera" : "Enable camera"}
          >
            {attendee.webcamOn ? (
              <Video className="w-3.5 h-3.5 text-green-400" />
            ) : (
              <VideoOff className="w-3.5 h-3.5 text-red-400" />
            )}
          </button>
          <button
            onClick={() => onKick?.(attendee.id)}
            className={`${iconBtn(darkMode)} ${
              darkMode ? "bg-red-500/20 hover:bg-red-500/40" : "bg-red-500/10 hover:bg-red-500/20"
            }`}
            title="Remove from session"
          >
            <UserX className="w-3.5 h-3.5 text-red-400" />
          </button>
        </div>
      ) : (
        /* Non-host: read-only mic/cam indicators */
        <div className="flex items-center gap-1.5 shrink-0">
          {attendee.micOn ? (
            <Mic className={`w-3.5 h-3.5 ${darkMode ? "text-green-400" : "text-green-600"}`} />
          ) : (
            <MicOff className={`w-3.5 h-3.5 ${textSecondary}`} />
          )}
          {attendee.webcamOn ? (
            <Video className={`w-3.5 h-3.5 ${darkMode ? "text-green-400" : "text-green-600"}`} />
          ) : (
            <VideoOff className={`w-3.5 h-3.5 ${textSecondary}`} />
          )}
        </div>
      )}
    </div>
  );
}
