"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { io, Socket } from "socket.io-client";
import type {
  ChatMessage,
  ApiChatMessage,
  SendMessagePayload,
  UpdateMessagePayload,
  DeleteForMePayload,
  DeleteForEveryonePayload,
  WebSocketResponse,
  NewMessageEvent,
  MessageUpdatedEvent,
  MessageDeletedEvent,
  ErrorEvent,
  MessageAttachment,
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
  onError?: (error: { action: string; error: string; messageId?: string }) => void;
}

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

    // Create socket connection with credentials (cookies will be sent automatically)
    // Connect to the /general-chat namespace
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

      // Auto-join room on connection
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

  // Join a room
  const joinRoom = useCallback(
    (targetRoomId: string) => {
      if (!socketRef.current?.connected) {
        console.error("Socket not connected");
        return;
      }

      socketRef.current.emit("joinRoom", { roomId: targetRoomId });
      console.log("🚪 Joined room:", targetRoomId);
    },
    []
  );

  // Leave a room
  const leaveRoom = useCallback(
    (targetRoomId: string) => {
      if (!socketRef.current?.connected) {
        console.error("Socket not connected");
        return;
      }

      socketRef.current.emit("leaveRoom", { roomId: targetRoomId });
      console.log("👋 Left room:", targetRoomId);
    },
    []
  );

  // Send a message
  const sendMessage = useCallback(
    async (payload: SendMessagePayload): Promise<WebSocketResponse> => {
      return new Promise((resolve, reject) => {
        if (!socketRef.current?.connected) {
          const error = { success: false, error: "Socket not connected" };
          reject(error);
          return;
        }

        socketRef.current.emit(
          "sendMessage",
          payload,
          (response: WebSocketResponse) => {
            if (response.success) {
              console.log("✅ Message sent:", response.message);
              resolve(response);
            } else {
              console.error("❌ Failed to send message:", response.error);
              reject(response);
            }
          }
        );
      });
    },
    []
  );

  // Update a message
  const updateMessage = useCallback(
    async (payload: UpdateMessagePayload): Promise<WebSocketResponse> => {
      return new Promise((resolve, reject) => {
        if (!socketRef.current?.connected) {
          const error = { success: false, error: "Socket not connected" };
          reject(error);
          return;
        }

        socketRef.current.emit(
          "updateMessage",
          payload,
          (response: WebSocketResponse) => {
            if (response.success) {
              console.log("✅ Message updated:", response.message);
              resolve(response);
            } else {
              console.error("❌ Failed to update message:", response.error);
              reject(response);
            }
          }
        );
      });
    },
    []
  );

  // Delete message for me
  const deleteForMe = useCallback(
    async (payload: DeleteForMePayload): Promise<WebSocketResponse> => {
      return new Promise((resolve, reject) => {
        if (!socketRef.current?.connected) {
          const error = { success: false, error: "Socket not connected" };
          reject(error);
          return;
        }

        socketRef.current.emit(
          "deleteForMe",
          payload,
          (response: WebSocketResponse) => {
            if (response.success) {
              console.log("✅ Message deleted for me:", payload.messageId);
              resolve(response);
            } else {
              console.error("❌ Failed to delete message for me:", response.error);
              reject(response);
            }
          }
        );
      });
    },
    []
  );

  // Delete message for everyone
  const deleteForEveryone = useCallback(
    async (payload: DeleteForEveryonePayload): Promise<WebSocketResponse> => {
      return new Promise((resolve, reject) => {
        if (!socketRef.current?.connected) {
          const error = { success: false, error: "Socket not connected" };
          reject(error);
          return;
        }

        socketRef.current.emit(
          "deleteForEveryone",
          payload,
          (response: WebSocketResponse) => {
            if (response.success) {
              console.log("✅ Message deleted for everyone:", payload.messageId);
              resolve(response);
            } else {
              console.error(
                "❌ Failed to delete message for everyone:",
                response.error
              );
              reject(response);
            }
          }
        );
      });
    },
    []
  );

  return {
    isConnected,
    error,
    joinRoom,
    leaveRoom,
    sendMessage,
    updateMessage,
    deleteForMe,
    deleteForEveryone,
  };
}
