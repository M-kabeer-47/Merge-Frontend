"use client";

import { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import { toast } from "sonner";
import { useChatStore } from "./use-chat-store";
import type {
  ChatMessage,
  MessageDeletedEventData,
  SocketErrorData,
} from "@/types/general-chat";
import { isOptimisticId } from "@/types/general-chat";

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

interface UseWebSocketChatOptions {
  roomId: string;
}

/**
 * WebSocket connection hook - handles connection lifecycle and cache updates
 * Uses useChatStore for all cache operations
 */
export function useWebSocketChat({ roomId }: UseWebSocketChatOptions) {
  const socketRef = useRef<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Use chat store for cache operations
  const store = useChatStore(roomId);

  // Use refs to avoid reconnection loops when store functions change
  const storeRef = useRef(store);
  useEffect(() => {
    storeRef.current = store;
  }, [store]);
  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  // Initialize socket connection
  useEffect(() => {
    if (!COMMUNICATION_URL) {
      console.error("COMMUNICATION_URL is not defined");
      setError("WebSocket URL not configured");
      return;
    }

    let socket: Socket | null = null;
    let isMounted = true;

    const initSocket = async () => {
      const token = await getAccessToken();
      if (!token) {
        console.error("[WebSocket] No access token available");
        if (isMounted) setError("Authentication token not found");
        return;
      }

      if (!isMounted) return;

      socket = io(`${COMMUNICATION_URL}/general-chat`, {
        auth: { token },
        transports: ["websocket", "polling"],
        reconnection: true,
        reconnectionDelay: 1000,
        reconnectionAttempts: 5,
      });

      socketRef.current = socket;

      // Connection handlers
      socket.on("connect", () => {
        if (isMounted) {
          console.log("Connected to WebSocket");
          setIsConnected(true);
          setError(null);
        }
        if (roomId && socket) {
          console.log("Joining room:", roomId);
          socket.emit("joinRoom", { roomId });
        }
      });

      socket.on("disconnect", (reason) => {
        if (isMounted) setIsConnected(false);
      });

      socket.on("connect_error", (err) => {
        console.error("WebSocket connection error:", err.message);
        if (isMounted) {
          setError(`Connection error: ${err.message}`);
          setIsConnected(false);
        }
      });

      // Message event listeners
      socket.on("newMessage", (message: ChatMessage) => {
        console.log("📩 WebSocket newMessage:", JSON.stringify(message));
        // Skip if this is our own optimistic message being echoed back
        if (!isOptimisticId(message.id)) {
          storeRef.current.addMessage(message);
        }
      });

      socket.on("messageUpdated", (message: ChatMessage) => {
        storeRef.current.updateMessage(message.id, {
          content: message.content,
          isEdited: true,
          updatedAt: message.updatedAt,
        });
      });

      socket.on("messageDeleted", (data: MessageDeletedEventData) => {
        console.log("Message to delete", JSON.stringify(data));
        console.log("data.deletedFor:", data.deletedFor);
        console.log("typeof data.deletedFor:", typeof data.deletedFor);
        console.log("data keys:", Object.keys(data));
        storeRef.current.markAsDeleted({
          messageId: data.messageId,
          type: data.deletedFor,
        });
      });

      socket.on("error", (data: SocketErrorData) => {
        console.error("WebSocket error:", data);
        if (isMounted) setError(data.error);
        toast.error(data.error || "An error occurred");
      });
    };

    initSocket();

    return () => {
      isMounted = false;
      if (socket?.connected) {
        socket.emit("leaveRoom", { roomId });
      }
      socket?.disconnect();
      socketRef.current = null;
    };
  }, [roomId]);

  const joinRoom = (targetRoomId: string) => {
    if (!socketRef.current?.connected) return;
    socketRef.current.emit("joinRoom", { roomId: targetRoomId });
  };

  const leaveRoom = (targetRoomId: string) => {
    if (!socketRef.current?.connected) return;
    socketRef.current.emit("leaveRoom", { roomId: targetRoomId });
  };

  return {
    socket: socketRef.current,
    isConnected,
    error,
    joinRoom,
    leaveRoom,
  };
}
