/**
 * AttendeeCard Component
 * 
 * Displays individual attendee with video/avatar, status indicators,
 * and host control actions.
 */

"use client";

import React, { useState } from "react";
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  Hand,
  Crown,
  Shield,
  MoreVertical,
  Edit3,
  UserX,
  Volume2,
  Monitor,
  Wifi,
  WifiOff,
  Signal,
} from "lucide-react";
import Avatar from "@/components/ui/Avatar";
import type { Attendee } from "@/types/live-session";

interface AttendeeCardProps {
  attendee: Attendee;
  isHost?: boolean;
  onMute?: (id: string) => void;
  onStopCamera?: (id: string) => void;
  onGrantCanvasEdit?: (id: string) => void;
  onPromote?: (id: string) => void;
  onRemove?: (id: string) => void;
}

export default function AttendeeCard({
  attendee,
  isHost = false,
  onMute,
  onStopCamera,
  onGrantCanvasEdit,
  onPromote,
  onRemove,
}: AttendeeCardProps) {
  const [showMenu, setShowMenu] = useState(false);

  // Generate initials for avatar fallback
  const getInitials = (name: string): string => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const networkIcons = {
    excellent: <Wifi className="w-3 h-3 text-primary" />,
    good: <Signal className="w-3 h-3 text-primary/70" />,
    poor: <WifiOff className="w-3 h-3 text-destructive" />,
    offline: <WifiOff className="w-3 h-3 text-para-muted" />,
  };

  const roleColors = {
    host: "bg-primary text-white",
    "co-host": "bg-secondary text-white",
    participant: "bg-secondary/10 text-secondary",
  };

  const roleIcons = {
    host: <Crown className="w-3 h-3" />,
    "co-host": <Shield className="w-3 h-3" />,
    participant: null,
  };

  return (
    <div
      className={`
        relative
        bg-main-background
        border-2
        rounded-xl
        overflow-hidden
        transition-all
        ${attendee.speakerActive ? "border-primary ring-2 ring-primary/30" : "border-light-border"}
        ${attendee.raiseHand ? "ring-2 ring-accent" : ""}
        group
      `}
    >
      {/* Video/Avatar Area */}
      <div className="relative aspect-video bg-gray-900">
        {attendee.webcamOn ? (
          // Mock video element (would be <video> element in real implementation)
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/20 to-secondary/20">
            <div className="text-center">
              <Video className="w-8 h-8 text-white/50 mx-auto mb-2" />
              <p className="text-xs text-white/70">Video Active</p>
            </div>
          </div>
        ) : (
          // Avatar fallback
          <div className="w-full h-full flex items-center justify-center bg-secondary/10">
            <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center text-white text-xl font-bold">
              {getInitials(attendee.name)}
            </div>
          </div>
        )}

        {/* Raise Hand Indicator */}
        {attendee.raiseHand && (
          <div className="absolute top-2 right-2 p-1.5 bg-accent rounded-full animate-bounce">
            <Hand className="w-4 h-4 text-white" fill="white" />
          </div>
        )}

        {/* Screen Sharing Indicator */}
        {attendee.screenSharing && (
          <div className="absolute top-2 left-2 px-2 py-1 bg-primary rounded-full flex items-center gap-1">
            <Monitor className="w-3 h-3 text-white" />
            <span className="text-xs text-white font-medium">Sharing</span>
          </div>
        )}

        {/* Speaking Indicator */}
        {attendee.speakerActive && (
          <div className="absolute bottom-2 left-2 p-1 bg-primary rounded-full">
            <Volume2 className="w-3 h-3 text-white" />
          </div>
        )}

        {/* Host Controls Overlay (visible on hover) */}
        {isHost && attendee.role !== "host" && (
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
            <button
              onClick={() => onMute?.(attendee.id)}
              className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
              aria-label={attendee.micOn ? "Mute" : "Already muted"}
              title="Mute attendee"
            >
              {attendee.micOn ? (
                <MicOff className="w-4 h-4 text-white" />
              ) : (
                <MicOff className="w-4 h-4 text-white/50" />
              )}
            </button>
            <button
              onClick={() => onStopCamera?.(attendee.id)}
              className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
              aria-label={attendee.webcamOn ? "Stop camera" : "Camera already off"}
              title="Stop camera"
            >
              {attendee.webcamOn ? (
                <VideoOff className="w-4 h-4 text-white" />
              ) : (
                <VideoOff className="w-4 h-4 text-white/50" />
              )}
            </button>
          </div>
        )}
      </div>

      {/* Info Bar */}
      <div className="p-2 flex items-center justify-between gap-2">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-heading truncate">
            {attendee.name}
          </p>
          <div className="flex items-center gap-2 mt-0.5">
            {/* Role Badge */}
            <span
              className={`
                inline-flex items-center gap-1
                px-1.5 py-0.5
                rounded text-[10px] font-medium
                ${roleColors[attendee.role]}
              `}
            >
              {roleIcons[attendee.role]}
              {attendee.role === "co-host" ? "Co-Host" : attendee.role.charAt(0).toUpperCase() + attendee.role.slice(1)}
            </span>

            {/* Network Quality */}
            <div title={`Network: ${attendee.networkQuality}`}>
              {networkIcons[attendee.networkQuality]}
            </div>
          </div>
        </div>

        {/* Status Icons */}
        <div className="flex items-center gap-1">
          {attendee.micOn ? (
            <Mic className="w-4 h-4 text-primary" />
          ) : (
            <MicOff className="w-4 h-4 text-para-muted" />
          )}
          {attendee.webcamOn ? (
            <Video className="w-4 h-4 text-primary" />
          ) : (
            <VideoOff className="w-4 h-4 text-para-muted" />
          )}

          {/* Actions Menu */}
          {isHost && attendee.role !== "host" && (
            <div className="relative">
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="p-1 hover:bg-secondary/10 rounded transition-colors"
                aria-label="More actions"
              >
                <MoreVertical className="w-4 h-4 text-para" />
              </button>

              {showMenu && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setShowMenu(false)}
                  />
                  <div className="absolute right-0 top-full mt-1 z-20 bg-main-background border border-light-border rounded-lg shadow-lg py-1 min-w-[180px]">
                    <button
                      onClick={() => {
                        onGrantCanvasEdit?.(attendee.id);
                        setShowMenu(false);
                      }}
                      className="w-full px-3 py-2 text-left text-sm text-para hover:bg-secondary/10 flex items-center gap-2"
                    >
                      <Edit3 className="w-4 h-4" />
                      Grant Canvas Edit
                    </button>
                    <button
                      onClick={() => {
                        onPromote?.(attendee.id);
                        setShowMenu(false);
                      }}
                      className="w-full px-3 py-2 text-left text-sm text-para hover:bg-secondary/10 flex items-center gap-2"
                    >
                      <Shield className="w-4 h-4" />
                      Promote to Co-Host
                    </button>
                    <div className="h-px bg-light-border my-1" />
                    <button
                      onClick={() => {
                        onRemove?.(attendee.id);
                        setShowMenu(false);
                      }}
                      className="w-full px-3 py-2 text-left text-sm text-destructive hover:bg-destructive/10 flex items-center gap-2"
                    >
                      <UserX className="w-4 h-4" />
                      Remove from Session
                    </button>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
