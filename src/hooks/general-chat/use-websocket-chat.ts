"use client";

import { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import type {
  ChatMessage,
  ApiChatMessage,
  MessageAttachment,
  NewMessageEvent,
  MessageUpdatedEvent,
  MessageDeletedEvent,
  ErrorEvent,
} from "@/types/general-chat";

const COMMUNICATION_URL = process.env.NEXT_PUBLIC_COMMUNICATION_URL || "";

// Transform API message to frontend ChatMessage
function transformMessage(apiMessage: ApiChatMessage): ChatMessage {
  const attachments: MessageAttachment[] = apiMessage.attachmentURL
    ? [
        {
          id: `att-${apiMessage.id}`,
          name: apiMessage.attachmentURL.split("/").pop() || "file",
          type: "file",
          url: apiMessage.attachmentURL,
          size: 0,
        },
      ]
    : [];

  return {
    id: apiMessage.id,
    content: apiMessage.content,
    userId: apiMessage.author.id,
    roomId: apiMessage.room.id,
    replyToId: apiMessage.replyToId,
    attachments,
    createdAt: apiMessage.createdAt,
    updatedAt: apiMessage.updatedAt,
    isEdited: apiMessage.isEdited,
    deletedForEveryone: apiMessage.isDeletedForEveryone,
    user: apiMessage.author,
  };
}

interface UseWebSocketChatOptions {
  roomId: string;
  onNewMessage?: (message: ChatMessage) => void;
  onMessageUpdated?: (message: ChatMessage) => void;
  onMessageDeleted?: (data: {
    messageId: string;
    roomId: string;
    deletedAt: string;
    authorId: string;
  }) => void;
  onError?: (error: {
    action: string;
    error: string;
    messageId?: string;
  }) => void;
}

/**
 * WebSocket connection hook - handles connection lifecycle only
 * Action functions (send, update, delete) are in use-socket-chat-events.ts
 */
export function useWebSocketChat({
  roomId,
  onNewMessage,
  onMessageUpdated,
  onMessageDeleted,
  onError,
}: UseWebSocketChatOptions) {
  const socketRef = useRef<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Use refs for callbacks to avoid reconnection loops
  const onNewMessageRef = useRef(onNewMessage);
  const onMessageUpdatedRef = useRef(onMessageUpdated);
  const onMessageDeletedRef = useRef(onMessageDeleted);
  const onErrorRef = useRef(onError);

  // Update refs when callbacks change
  useEffect(() => {
    onNewMessageRef.current = onNewMessage;
    onMessageUpdatedRef.current = onMessageUpdated;
    onMessageDeletedRef.current = onMessageDeleted;
    onErrorRef.current = onError;
  });

  // Initialize socket connection
  useEffect(() => {
    if (!COMMUNICATION_URL) {
      console.error("COMMUNICATION_URL is not defined");
      setError("WebSocket URL not configured");
      return;
    }

    const socket = io(`${COMMUNICATION_URL}/general-chat`, {
      withCredentials: true,
      transports: ["websocket", "polling"],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5,
    });

    socketRef.current = socket;

    // Connection event handlers
    socket.on("connect", () => {
      console.log("✅ WebSocket connected:", socket.id);
      setIsConnected(true);
      setError(null);

      if (roomId) {
        socket.emit("joinRoom", { roomId });
        console.log("🚪 Auto-joined room:", roomId);
      }
    });

    socket.on("disconnect", (reason) => {
      console.log("❌ WebSocket disconnected:", reason);
      setIsConnected(false);
    });

    socket.on("connect_error", (err) => {
      console.error("🔌 Connection error:", err.message);
      setError(`Connection error: ${err.message}`);
      setIsConnected(false);
    });

    // Message event listeners
    socket.on("newMessage", (data: NewMessageEvent["data"]) => {
      console.log("📨 New message received:", data);
      onNewMessageRef.current?.(transformMessage(data));
    });

    socket.on("messageUpdated", (data: MessageUpdatedEvent["data"]) => {
      console.log("✏️ Message updated:", data);
      onMessageUpdatedRef.current?.(transformMessage(data));
    });

    socket.on("messageDeleted", (data: MessageDeletedEvent["data"]) => {
      console.log("🗑️ Message deleted:", data);
      onMessageDeletedRef.current?.(data);
    });

    socket.on("error", (data: ErrorEvent["data"]) => {
      console.error("❌ WebSocket error:", data);
      setError(data.error);
      onErrorRef.current?.(data);
    });

    // Cleanup on unmount
    return () => {
      if (socket.connected) {
        socket.emit("leaveRoom", { roomId });
        console.log("👋 Left room:", roomId);
      }
      socket.disconnect();
      socketRef.current = null;
    };
  }, [roomId]);

  // Simple room functions (no useCallback needed - these don't change)
  const joinRoom = (targetRoomId: string) => {
    if (!socketRef.current?.connected) {
      console.error("Socket not connected");
      return;
    }
    socketRef.current.emit("joinRoom", { roomId: targetRoomId });
    console.log("🚪 Joined room:", targetRoomId);
  };

  const leaveRoom = (targetRoomId: string) => {
    if (!socketRef.current?.connected) {
      console.error("Socket not connected");
      return;
    }
    socketRef.current.emit("leaveRoom", { roomId: targetRoomId });
    console.log("👋 Left room:", targetRoomId);
  };

  return {
    socket: socketRef.current,
    isConnected,
    error,
    joinRoom,
    leaveRoom,
  };
}
