"use client";

import React from "react";
import {
  useLocalParticipant,
  useRemoteParticipants,
  useRoomContext,
  useTracks,
  VideoTrack,
} from "@livekit/components-react";
import { Track } from "livekit-client";
import { MicOff, VideoOff, Crown, Mic, Video, MoreVertical, Hand } from "lucide-react";
import { motion } from "framer-motion";
import { sendPermissionUpdate } from "./PermissionEnforcer";

interface AttendeePermission {
  canMic: boolean;
  canCamera: boolean;
  canScreenShare: boolean;
  canChat: boolean;
}

interface AttendeesGridViewProps {
  isHost?: boolean;
  permissions: Record<string, AttendeePermission>;
  onUpdatePermission?: (
    participantId: string,
    permission: keyof AttendeePermission,
    value: boolean
  ) => void;
  onAllowAll?: (permission: keyof AttendeePermission) => void;
  onRevokeAll?: (permission: keyof AttendeePermission) => void;
  raisedHands?: Record<string, boolean>;
}

export default function AttendeesGridView({
  isHost = false,
  permissions,
  onUpdatePermission,
  onAllowAll,
  onRevokeAll,
  raisedHands = {},
}: AttendeesGridViewProps) {
  const room = useRoomContext();
  const { localParticipant } = useLocalParticipant();
  const remoteParticipants = useRemoteParticipants();

  // Send permission update via LiveKit data channel
  const handleUpdatePermission = async (
    participantIdentity: string,
    permission: keyof AttendeePermission,
    value: boolean
  ) => {
    await sendPermissionUpdate(room, participantIdentity, permission, value);
    onUpdatePermission?.(participantIdentity, permission, value);
  };

  const handleAllowAll = async (permission: keyof AttendeePermission) => {
    await sendPermissionUpdate(room, "*", permission, true);
    onAllowAll?.(permission);
  };

  const handleRevokeAll = async (permission: keyof AttendeePermission) => {
    await sendPermissionUpdate(room, "*", permission, false);
    onRevokeAll?.(permission);
  };

  const tracks = useTracks(
    [
      { source: Track.Source.Camera, withPlaceholder: true },
      { source: Track.Source.Microphone, withPlaceholder: false },
    ],
    { onlySubscribed: false }
  );

  const allParticipants = [localParticipant, ...remoteParticipants];

  // Calculate grid layout based on participant count
  const getGridCols = (count: number) => {
    if (count <= 1) return "grid-cols-1";
    if (count <= 2) return "grid-cols-2";
    if (count <= 4) return "grid-cols-2";
    if (count <= 6) return "grid-cols-3";
    if (count <= 9) return "grid-cols-3";
    return "grid-cols-4";
  };

  const gridCols = getGridCols(allParticipants.length);

  return (
    <div className="h-full flex flex-col bg-[#202124]">
      {/* Header with bulk actions */}
      {isHost && (
        <div className="p-4 border-b border-white/10">
          <h3 className="text-white font-medium mb-3">Permissions Management</h3>
          <div className="flex flex-wrap gap-2">
            <PermissionBulkButton
              icon={<Mic className="w-4 h-4" />}
              label="Allow All Mic"
              onClick={() => handleAllowAll("canMic")}
            />
            <PermissionBulkButton
              icon={<Video className="w-4 h-4" />}
              label="Allow All Camera"
              onClick={() => handleAllowAll("canCamera")}
            />
            <PermissionBulkButton
              icon={<MicOff className="w-4 h-4" />}
              label="Mute All"
              onClick={() => handleRevokeAll("canMic")}
              variant="danger"
            />
            <PermissionBulkButton
              icon={<VideoOff className="w-4 h-4" />}
              label="Stop All Cameras"
              onClick={() => handleRevokeAll("canCamera")}
              variant="danger"
            />
          </div>
        </div>
      )}

      {/* Participants Grid */}
      <div className="flex-1 overflow-auto p-4">
        <div className={`grid ${gridCols} gap-4`}>
          {allParticipants.map((participant, index) => {
            const camTrack = tracks.find(
              (t) =>
                t.participant.sid === participant.sid &&
                t.source === Track.Source.Camera
            );
            const hasCam = camTrack?.publication?.track != null;
            const isCamEnabled = participant.isCameraEnabled;
            const isMicEnabled = participant.isMicrophoneEnabled;
            const isLocal = participant.sid === localParticipant.sid;
            const displayName = participant.name || participant.identity || "Unknown";
            const participantPermissions = permissions[participant.identity] || {
              canMic: true,
              canCamera: true,
              canScreenShare: false,
              canChat: true,
            };

            const isHandRaised = raisedHands[participant.identity] || false;

            return (
              <motion.div
                key={participant.sid}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                className="relative aspect-video bg-[#3c4043] rounded-xl overflow-hidden"
              >
                {/* Hand Raise Indicator */}
                {isHandRaised && (
                  <div className="absolute top-3 right-3 p-2 bg-[#f9ab00] rounded-full animate-bounce z-10">
                    <Hand className="w-4 h-4 text-white" fill="white" />
                  </div>
                )}

                {/* Video */}
                {hasCam && isCamEnabled && camTrack.publication ? (
                  <VideoTrack
                    trackRef={camTrack as any}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center text-white text-2xl font-bold">
                      {displayName
                        .split(" ")
                        .map((n: string) => n[0])
                        .join("")
                        .toUpperCase()
                        .slice(0, 2)}
                    </div>
                  </div>
                )}

                {/* Info Bar */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-white font-medium text-sm">
                        {displayName}
                        {isLocal && " (You)"}
                      </span>
                      {isLocal && (
                        <Crown className="w-4 h-4 text-yellow-400" />
                      )}
                    </div>
                    <div className="flex items-center gap-1">
                      {!isMicEnabled && (
                        <div className="w-6 h-6 rounded-full bg-red-500/80 flex items-center justify-center">
                          <MicOff className="w-3 h-3 text-white" />
                        </div>
                      )}
                      {!isCamEnabled && (
                        <div className="w-6 h-6 rounded-full bg-red-500/80 flex items-center justify-center">
                          <VideoOff className="w-3 h-3 text-white" />
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Permission Controls (Host only) */}
                {isHost && !isLocal && (
                  <div className="absolute top-2 right-2">
                    <div className="relative group">
                      <button className="w-8 h-8 rounded-full bg-black/50 hover:bg-black/70 flex items-center justify-center transition-colors">
                        <MoreVertical className="w-4 h-4 text-white" />
                      </button>

                      {/* Permission Menu */}
                      <div className="absolute right-0 top-full mt-2 w-48 bg-[#3c4043] rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                        <div className="p-2 space-y-1">
                          <PermissionToggle
                            label="Allow Microphone"
                            enabled={participantPermissions.canMic}
                            onToggle={() =>
                              handleUpdatePermission(
                                participant.identity,
                                "canMic",
                                !participantPermissions.canMic
                              )
                            }
                          />
                          <PermissionToggle
                            label="Allow Camera"
                            enabled={participantPermissions.canCamera}
                            onToggle={() =>
                              handleUpdatePermission(
                                participant.identity,
                                "canCamera",
                                !participantPermissions.canCamera
                              )
                            }
                          />
                          <PermissionToggle
                            label="Allow Screen Share"
                            enabled={participantPermissions.canScreenShare}
                            onToggle={() =>
                              handleUpdatePermission(
                                participant.identity,
                                "canScreenShare",
                                !participantPermissions.canScreenShare
                              )
                            }
                          />
                          <PermissionToggle
                            label="Allow Chat"
                            enabled={participantPermissions.canChat}
                            onToggle={() =>
                              handleUpdatePermission(
                                participant.identity,
                                "canChat",
                                !participantPermissions.canChat
                              )
                            }
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Speaking Indicator */}
                {participant.isSpeaking && (
                  <div className="absolute inset-0 ring-4 ring-green-500 rounded-xl pointer-events-none" />
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// Helper Components

function PermissionBulkButton({
  icon,
  label,
  onClick,
  variant = "default",
}: {
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
  variant?: "default" | "danger";
}) {
  const baseClasses =
    "px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors";
  const variantClasses =
    variant === "danger"
      ? "bg-red-500/20 text-red-400 hover:bg-red-500/30"
      : "bg-[#3c4043] text-white hover:bg-[#494c50]";

  return (
    <button onClick={onClick} className={`${baseClasses} ${variantClasses}`}>
      {icon}
      {label}
    </button>
  );
}

function PermissionToggle({
  label,
  enabled,
  onToggle,
}: {
  label: string;
  enabled: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      onClick={onToggle}
      className="w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-white/10 transition-colors text-left"
    >
      <span className="text-white text-sm">{label}</span>
      <div
        className={`w-9 h-5 rounded-full relative transition-colors ${
          enabled ? "bg-green-500" : "bg-gray-600"
        }`}
      >
        <div
          className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${
            enabled ? "left-4.5" : "left-0.5"
          }`}
        />
      </div>
    </button>
  );
}
