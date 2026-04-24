"use client";

import { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

const COMMUNICATION_URL = process.env.NEXT_PUBLIC_COMMUNICATION_URL || "";

/**
 * Get access token from API route for WebSocket authentication
 */
async function getAccessToken(): Promise<string | null> {
  try {
    const response = await fetch("/api/auth/token");
    if (!response.ok) return null;
    const data = await response.json();
    return data.token || null;
  } catch (error) {
    console.error("[WebSocket] Failed to get access token:", error);
    return null;
  }
}

interface UseLiveSessionSocketOptions {
  roomId?: string;
  sessionId?: string;
}

/**
 * WebSocket hook for live session realtime updates.
 * Updates React Query cache when session lifecycle events occur.
 */
export function useLiveSessionSocket({ roomId, sessionId }: UseLiveSessionSocketOptions) {
  const socketRef = useRef<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!COMMUNICATION_URL) return;

    let socket: Socket | null = null;
    let isMounted = true;

    const initSocket = async () => {
      const token = await getAccessToken();
      if (!token || !isMounted) return;

      socket = io(`${COMMUNICATION_URL}/live-session`, {
        auth: { token },
        transports: ["websocket"],
      });

      socketRef.current = socket;

      socket.on("connect", () => {
        if (isMounted) setIsConnected(true);
        if (roomId) socket?.emit("join-room", roomId);
        if (sessionId) socket?.emit("join-session", sessionId);
      });

      socket.on("disconnect", () => {
        if (isMounted) setIsConnected(false);
      });

      // Lifecycle events
      const invalidateSessions = () => {
        if (roomId) {
          queryClient.invalidateQueries({ queryKey: ["live-sessions", roomId] });
        }
      };

      socket.on("session-created", (data) => {
        console.log("Realtime: Session created", data);
        invalidateSessions();
        toast.info(`New session created: ${data.session?.title || "Live Session"}`);
      });

      socket.on("session-started", (data) => {
        console.log("Realtime: Session started", data);
        invalidateSessions();
        if (sessionId === data.sessionId) {
          queryClient.invalidateQueries({ queryKey: ["live-session", data.sessionId] });
        }
      });

      socket.on("session-cancelled", (data) => {
        console.log("Realtime: Session cancelled", data);
        invalidateSessions();
        if (sessionId === data.sessionId) {
          queryClient.invalidateQueries({ queryKey: ["live-session", data.sessionId] });
        }
      });

      socket.on("session-ended", (data) => {
        console.log("Realtime: Session ended", data);
        invalidateSessions();
        if (sessionId === data.sessionId) {
          queryClient.invalidateQueries({ queryKey: ["live-session", data.sessionId] });
          // Event will be handled by the page for redirecting
        }
      });
    };

    initSocket();

    return () => {
      isMounted = false;
      if (socket) {
        if (roomId) socket.emit("leave-room", roomId);
        if (sessionId) socket.emit("leave-session", sessionId);
        socket.disconnect();
      }
      socketRef.current = null;
    };
  }, [roomId, sessionId, queryClient]);

  return { isConnected };
}
