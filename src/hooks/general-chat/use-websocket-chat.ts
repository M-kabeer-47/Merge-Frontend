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

// WebSocket may send "author" instead of "user" (like REST API)
interface WebSocketMessage extends Omit<ChatMessage, 'user'> {
  user?: ChatMessage['user'];
  author?: ChatMessage['user'];
}

/**
 * Normalize WebSocket message: ensure user field exists
 */
function normalizeMessage(msg: WebSocketMessage): ChatMessage {
  const user = msg.user || msg.author || {
    id: msg.userId || "",
    firstName: "Unknown",
    lastName: "User",
    email: "",
    image: null,
  };
  
  return {
    ...msg,
    user,
  } as ChatMessage;
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
        console.log("✅ WebSocket connected:", socket?.id);
        if (isMounted) {
          setIsConnected(true);
          setError(null);
        }
        if (roomId && socket) {
          socket.emit("joinRoom", { roomId });
        }
      });

      socket.on("disconnect", (reason) => {
        console.log("❌ WebSocket disconnected:", reason);
        if (isMounted) setIsConnected(false);
      });

      socket.on("connect_error", (err) => {
        console.error("🔌 Connection error:", err.message);
        if (isMounted) {
          setError(`Connection error: ${err.message}`);
          setIsConnected(false);
        }
      });

      // Message event listeners - normalize incoming messages
      socket.on("newMessage", (rawMessage: WebSocketMessage) => {
        const message = normalizeMessage(rawMessage);
        console.log("📩 WebSocket newMessage:", { 
          id: message.id, 
          userId: message.userId, 
          content: message.content?.substring(0, 50),
          isOptimistic: isOptimisticId(message.id)
        });
        // Skip if this is our own optimistic message being echoed back
        // The real message from server will have a different (non-temp) ID
        if (!isOptimisticId(message.id)) {
          storeRef.current.addMessage(message);
        }
      });

      socket.on("messageUpdated", (rawMessage: WebSocketMessage) => {
        const message = normalizeMessage(rawMessage);
        storeRef.current.updateMessage(message.id, {
          content: message.content,
          isEdited: true,
          updatedAt: message.updatedAt,
        });
      });

      socket.on("messageDeleted", (data: MessageDeletedEventData) => {
        storeRef.current.markAsDeleted(data.messageId);
      });

      socket.on("error", (data: SocketErrorData) => {
        console.error("❌ WebSocket error:", data);
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
