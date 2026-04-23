"use client";

import React, { useEffect } from "react";
import { useRoomContext } from "@livekit/components-react";
import { RoomEvent, RemoteParticipant } from "livekit-client";

interface HandRaiseMessage {
  type: "hand_raise";
  identity: string;
  raised: boolean;
}

interface HandRaiseSyncProps {
  onHandRaiseChange: (identity: string, raised: boolean) => void;
  localRaisedHand: boolean;
}

/**
 * Listens for hand raise data messages from other participants and broadcasts
 * local hand raise state changes to the room.
 * Must be rendered inside <LiveKitRoom>.
 */
export default function HandRaiseSync({ onHandRaiseChange, localRaisedHand }: HandRaiseSyncProps) {
  const room = useRoomContext();
  const prevRaised = React.useRef(localRaisedHand);

  // Listen for remote hand raises
  useEffect(() => {
    const handleData = (payload: Uint8Array, participant?: RemoteParticipant) => {
      try {
        const decoder = new TextDecoder();
        const parsed = JSON.parse(decoder.decode(payload));

        if (parsed?.type !== "hand_raise") return;
        const data = parsed as HandRaiseMessage;

        const identity = participant?.identity || data.identity;
        onHandRaiseChange(identity, data.raised);
      } catch (e) {
        console.error("Failed to parse hand raise message:", e);
      }
    };

    room.on(RoomEvent.DataReceived, handleData);
    return () => {
      room.off(RoomEvent.DataReceived, handleData);
    };
  }, [room, onHandRaiseChange]);

  // Broadcast own hand raise changes
  useEffect(() => {
    if (prevRaised.current !== localRaisedHand) {
      prevRaised.current = localRaisedHand;
      sendHandRaise(room, localRaisedHand).catch(console.error);
      // Also reflect in local state so host sees own raise
      onHandRaiseChange(room.localParticipant.identity, localRaisedHand);
    }
  }, [localRaisedHand, room, onHandRaiseChange]);

  return null;
}

/**
 * Broadcast a hand raise state change to all participants.
 */
export async function sendHandRaise(room: any, raised: boolean) {
  const message: HandRaiseMessage = {
    type: "hand_raise",
    identity: room.localParticipant.identity,
    raised,
  };

  const encoder = new TextEncoder();
  const data = encoder.encode(JSON.stringify(message));

  try {
    await room.localParticipant.publishData(data, { reliable: true });
  } catch (e) {
    console.error("Failed to send hand raise:", e);
  }
}
