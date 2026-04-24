"use client";

import React, { useCallback } from "react";
import { useRoomContext } from "@livekit/components-react";
import { sendPermissionUpdate } from "./PermissionEnforcer";
import AttendeesPanel from "./AttendeesPanel";
import type { Attendee } from "@/types/live-session";

interface AttendeesPanelBridgeProps {
  attendees: Attendee[];
  isHost: boolean;
  onGrantCanvasEdit?: (id: string) => void;
  onPermissionToggle?: (participantId: string, permission: "canMic" | "canCamera", value: boolean) => void;
  onBulkPermission?: (permission: "canMic" | "canCamera", value: boolean) => void;
  darkMode?: boolean;
}

/**
 * Wraps AttendeesPanel inside LiveKitRoom context so that
 * mic / camera permission toggles actually send data-channel
 * messages to participants via sendPermissionUpdate.
 */
export default function AttendeesPanelBridge({
  attendees,
  isHost,
  onGrantCanvasEdit,
  onPermissionToggle,
  onBulkPermission,
  darkMode = false,
}: AttendeesPanelBridgeProps) {
  const room = useRoomContext();

  const handleMuteAttendee = useCallback(
    (id: string) => {
      if (!isHost) return;
      const attendee = attendees.find((a) => a.id === id);
      if (!attendee) return;
      const newVal = !attendee.micOn;
      sendPermissionUpdate(room, id, "canMic", newVal);
      onPermissionToggle?.(id, "canMic", newVal);
    },
    [room, isHost, attendees, onPermissionToggle]
  );

  const handleStopCamera = useCallback(
    (id: string) => {
      if (!isHost) return;
      const attendee = attendees.find((a) => a.id === id);
      if (!attendee) return;
      const newVal = !attendee.webcamOn;
      sendPermissionUpdate(room, id, "canCamera", newVal);
      onPermissionToggle?.(id, "canCamera", newVal);
    },
    [room, isHost, attendees, onPermissionToggle]
  );

  const handleMuteAll = useCallback(() => {
    if (!isHost) return;
    sendPermissionUpdate(room, "*", "canMic", false);
    onBulkPermission?.("canMic", false);
  }, [room, isHost, onBulkPermission]);

  const handleUnmuteAll = useCallback(() => {
    if (!isHost) return;
    sendPermissionUpdate(room, "*", "canMic", true);
    onBulkPermission?.("canMic", true);
  }, [room, isHost, onBulkPermission]);

  const handleDisableCameraAll = useCallback(() => {
    if (!isHost) return;
    sendPermissionUpdate(room, "*", "canCamera", false);
    onBulkPermission?.("canCamera", false);
  }, [room, isHost, onBulkPermission]);

  const handleEnableCameraAll = useCallback(() => {
    if (!isHost) return;
    sendPermissionUpdate(room, "*", "canCamera", true);
    onBulkPermission?.("canCamera", true);
  }, [room, isHost, onBulkPermission]);

  return (
    <AttendeesPanel
      attendees={attendees}
      isHost={isHost}
      onMuteAttendee={handleMuteAttendee}
      onStopCamera={handleStopCamera}
      onGrantCanvasEdit={onGrantCanvasEdit}
      onMuteAll={handleMuteAll}
      onUnmuteAll={handleUnmuteAll}
      onDisableCameraAll={handleDisableCameraAll}
      onEnableCameraAll={handleEnableCameraAll}
      darkMode={darkMode}
    />
  );
}
