"use client";

import { useEffect, useRef } from "react";
import { useLocalParticipant } from "@livekit/components-react";
import { ParticipantEvent } from "livekit-client";

interface LiveKitControlsBridgeProps {
  micOn: boolean;
  cameraOn: boolean;
  screenSharing: boolean;
  onMicChange: (enabled: boolean) => void;
  onCameraChange: (enabled: boolean) => void;
  onScreenShareChange: (enabled: boolean) => void;
}

/**
 * Bridge component that syncs parent state with LiveKit local participant.
 * When parent toggles micOn/cameraOn, this component applies it to LiveKit.
 * Must be rendered inside <LiveKitRoom>.
 */
export default function LiveKitControlsBridge({
  micOn,
  cameraOn,
  screenSharing,
  onMicChange,
  onCameraChange,
  onScreenShareChange,
}: LiveKitControlsBridgeProps) {
  const { localParticipant } = useLocalParticipant();
  const prevMic = useRef(micOn);
  const prevCam = useRef(cameraOn);
  const prevScreen = useRef(screenSharing);
  const initialSetup = useRef(false);

  // Initial setup - ensure camera/mic are enabled according to props on mount
  useEffect(() => {
    if (!initialSetup.current) {
      initialSetup.current = true;
      // Enable camera if cameraOn is true on mount
      if (cameraOn && !localParticipant.isCameraEnabled) {
        localParticipant.setCameraEnabled(true).catch((e) => {
          console.error("Failed to enable camera on mount:", e);
        });
      }
      // Enable mic if micOn is true on mount
      if (micOn && !localParticipant.isMicrophoneEnabled) {
        localParticipant.setMicrophoneEnabled(true).catch((e) => {
          console.error("Failed to enable mic on mount:", e);
        });
      }
    }
  }, [localParticipant, cameraOn, micOn]);

  // Sync mic toggle from parent to LiveKit
  useEffect(() => {
    if (prevMic.current !== micOn) {
      prevMic.current = micOn;
      localParticipant.setMicrophoneEnabled(micOn).catch(console.error);
    }
  }, [micOn, localParticipant]);

  // Sync camera toggle from parent to LiveKit
  useEffect(() => {
    if (prevCam.current !== cameraOn) {
      prevCam.current = cameraOn;
      localParticipant.setCameraEnabled(cameraOn).catch(console.error);
    }
  }, [cameraOn, localParticipant]);

  // Sync screen share toggle from parent to LiveKit
  useEffect(() => {
    if (prevScreen.current !== screenSharing) {
      prevScreen.current = screenSharing;
      localParticipant.setScreenShareEnabled(screenSharing).catch(console.error);
    }
  }, [screenSharing, localParticipant]);

  // Listen to LiveKit participant events to sync state back to parent
  // (only for external changes, not during user-initiated toggles)
  useEffect(() => {
    const syncState = () => {
      // Only sync back if the states differ AND the last toggle was a while ago
      // This prevents race conditions with user-initiated toggles
      if (prevMic.current === micOn) {
        const actualMic = localParticipant.isMicrophoneEnabled;
        if (actualMic !== micOn) {
          onMicChange(actualMic);
          prevMic.current = actualMic;
        }
      }
      if (prevCam.current === cameraOn) {
        const actualCam = localParticipant.isCameraEnabled;
        if (actualCam !== cameraOn) {
          onCameraChange(actualCam);
          prevCam.current = actualCam;
        }
      }
      if (prevScreen.current === screenSharing) {
        const actualScreen = localParticipant.isScreenShareEnabled;
        if (actualScreen !== screenSharing) {
          onScreenShareChange(actualScreen);
          prevScreen.current = actualScreen;
        }
      }
    };

    // Listen to LiveKit track events for accurate sync
    localParticipant.on(ParticipantEvent.TrackMuted, syncState);
    localParticipant.on(ParticipantEvent.TrackUnmuted, syncState);
    localParticipant.on(ParticipantEvent.LocalTrackPublished, syncState);
    localParticipant.on(ParticipantEvent.LocalTrackUnpublished, syncState);

    return () => {
      localParticipant.off(ParticipantEvent.TrackMuted, syncState);
      localParticipant.off(ParticipantEvent.TrackUnmuted, syncState);
      localParticipant.off(ParticipantEvent.LocalTrackPublished, syncState);
      localParticipant.off(ParticipantEvent.LocalTrackUnpublished, syncState);
    };
  }, [localParticipant, micOn, cameraOn, screenSharing, onMicChange, onCameraChange, onScreenShareChange]);

  return null; // Invisible bridge component
}
