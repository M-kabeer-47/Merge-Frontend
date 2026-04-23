"use client";

import { useCallback, useEffect } from "react";
import { useLocalParticipant } from "@livekit/components-react";

interface UseLiveKitControlsReturn {
  toggleMic: () => void;
  toggleCamera: () => void;
  toggleScreenShare: () => void;
  isMicEnabled: boolean;
  isCameraEnabled: boolean;
  isScreenShareEnabled: boolean;
}

/**
 * Hook to control local LiveKit participant's mic, camera, and screen share.
 * Must be used inside a <LiveKitRoom> component.
 */
export default function useLiveKitControls(): UseLiveKitControlsReturn {
  const { localParticipant } = useLocalParticipant();

  const toggleMic = useCallback(async () => {
    try {
      await localParticipant.setMicrophoneEnabled(
        !localParticipant.isMicrophoneEnabled
      );
    } catch (e) {
      console.error("Failed to toggle mic:", e);
    }
  }, [localParticipant]);

  const toggleCamera = useCallback(async () => {
    try {
      await localParticipant.setCameraEnabled(
        !localParticipant.isCameraEnabled
      );
    } catch (e) {
      console.error("Failed to toggle camera:", e);
    }
  }, [localParticipant]);

  const toggleScreenShare = useCallback(async () => {
    try {
      await localParticipant.setScreenShareEnabled(
        !localParticipant.isScreenShareEnabled
      );
    } catch (e) {
      console.error("Failed to toggle screen share:", e);
    }
  }, [localParticipant]);

  return {
    toggleMic,
    toggleCamera,
    toggleScreenShare,
    isMicEnabled: localParticipant.isMicrophoneEnabled,
    isCameraEnabled: localParticipant.isCameraEnabled,
    isScreenShareEnabled: localParticipant.isScreenShareEnabled,
  };
}
