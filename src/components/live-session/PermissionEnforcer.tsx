"use client";

import { useEffect } from "react";
import { useLocalParticipant, useRoomContext } from "@livekit/components-react";
import { RoomEvent } from "livekit-client";

export type PermissionKey = "canMic" | "canCamera" | "canScreenShare" | "canChat";

interface PermissionMessage {
  type: "permission_update";
  target: string; // participant identity or "*" for all
  permission: PermissionKey;
  allowed: boolean;
}

interface KickMessage {
  type: "kicked";
  target: string;
}

interface PermissionEnforcerProps {
  isHost: boolean;
  onPermissionDenied?: (message: string) => void;
  onPermissionChange?: (permission: PermissionKey, allowed: boolean) => void;
  onKicked?: () => void;
}

/**
 * Listens for permission messages from host and enforces them locally.
 * When a permission is revoked, the track is disabled.
 * Must be rendered inside <LiveKitRoom>.
 */
export default function PermissionEnforcer({
  isHost,
  onPermissionDenied,
  onPermissionChange,
  onKicked,
}: PermissionEnforcerProps) {
  const room = useRoomContext();
  const { localParticipant } = useLocalParticipant();

  useEffect(() => {
    // Hosts ignore permission messages (they set the rules)
    if (isHost) return;

    const handleData = (payload: Uint8Array) => {
      try {
        const decoder = new TextDecoder();
        const parsed = JSON.parse(decoder.decode(payload));

        // Handle kick
        if (parsed?.type === "kicked") {
          const data = parsed as KickMessage;
          const isForMe =
            data.target === "*" ||
            data.target === localParticipant.identity ||
            data.target === localParticipant.sid;
          if (isForMe) {
            onPermissionDenied?.("You have been removed from the session");
            onKicked?.();
          }
          return;
        }

        if (parsed?.type !== "permission_update") return;
        const data = parsed as PermissionMessage;

        // Check if message is for us (either specific target or "*")
        const isForMe =
          data.target === "*" ||
          data.target === localParticipant.identity ||
          data.target === localParticipant.sid;

        if (!isForMe) return;

        // Notify parent of state change
        onPermissionChange?.(data.permission, data.allowed);

        // Apply the permission change
        if (!data.allowed) {
          // Permission revoked - disable the track
          switch (data.permission) {
            case "canMic":
              if (localParticipant.isMicrophoneEnabled) {
                localParticipant.setMicrophoneEnabled(false).catch(console.error);
              }
              onPermissionDenied?.("Microphone was muted by the host");
              break;
            case "canCamera":
              if (localParticipant.isCameraEnabled) {
                localParticipant.setCameraEnabled(false).catch(console.error);
              }
              onPermissionDenied?.("Camera was disabled by the host");
              break;
            case "canScreenShare":
              if (localParticipant.isScreenShareEnabled) {
                localParticipant.setScreenShareEnabled(false).catch(console.error);
              }
              onPermissionDenied?.("Screen share was stopped by the host");
              break;
            case "canChat":
              onPermissionDenied?.("Chat was disabled by the host");
              break;
          }
        } else {
          // Permission granted - notify user
          const labels: Record<PermissionKey, string> = {
            canMic: "Microphone",
            canCamera: "Camera",
            canScreenShare: "Screen share",
            canChat: "Chat",
          };
          onPermissionDenied?.(`${labels[data.permission]} enabled by host`);
        }
      } catch (e) {
        console.error("Failed to parse permission message:", e);
      }
    };

    room.on(RoomEvent.DataReceived, handleData);
    return () => {
      room.off(RoomEvent.DataReceived, handleData);
    };
  }, [room, localParticipant, isHost, onPermissionDenied, onPermissionChange, onKicked]);

  return null;
}

/**
 * Helper function to send a permission update message from host to participant(s)
 */
export async function sendPermissionUpdate(
  room: any,
  target: string,
  permission: PermissionMessage["permission"],
  allowed: boolean
) {
  const message: PermissionMessage = {
    type: "permission_update",
    target,
    permission,
    allowed,
  };

  const encoder = new TextEncoder();
  const data = encoder.encode(JSON.stringify(message));

  try {
    await room.localParticipant.publishData(data, {
      reliable: true,
    });
  } catch (e) {
    console.error("Failed to send permission update:", e);
  }
}
