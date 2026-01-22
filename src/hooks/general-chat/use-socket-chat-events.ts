"use client";

import type { Socket } from "socket.io-client";
import type {
  SendMessagePayload,
  UpdateMessagePayload,
  DeleteForMePayload,
  DeleteForEveryonePayload,
  WebSocketResponse,
} from "@/types/general-chat";

/**
 * Socket chat event actions - separated from connection logic
 * These are plain async functions, no useCallback needed (socket is passed in)
 */

export function sendMessage(
  socket: Socket | null,
  payload: SendMessagePayload,
): Promise<WebSocketResponse> {
  return new Promise((resolve, reject) => {
    if (!socket?.connected) {
      reject({ success: false, error: "Socket not connected" });
      return;
    }

    socket.emit("sendMessage", payload, (response: WebSocketResponse) => {
      if (response.success) {
        console.log("✅ Message sent:", response.message);
        resolve(response);
      } else {
        console.error("❌ Failed to send message:", response.error);
        reject(response);
      }
    });
  });
}

export function updateMessage(
  socket: Socket | null,
  payload: UpdateMessagePayload,
): Promise<WebSocketResponse> {
  return new Promise((resolve, reject) => {
    if (!socket?.connected) {
      reject({ success: false, error: "Socket not connected" });
      return;
    }

    socket.emit("updateMessage", payload, (response: WebSocketResponse) => {
      if (response.success) {
        console.log("✅ Message updated:", response.message);
        resolve(response);
      } else {
        console.error("❌ Failed to update message:", response.error);
        reject(response);
      }
    });
  });
}

export function deleteForMe(
  socket: Socket | null,
  payload: DeleteForMePayload,
): Promise<WebSocketResponse> {
  return new Promise((resolve, reject) => {
    if (!socket?.connected) {
      reject({ success: false, error: "Socket not connected" });
      return;
    }

    socket.emit("deleteForMe", payload, (response: WebSocketResponse) => {
      if (response.success) {
        console.log("✅ Message deleted for me:", payload.messageId);
        resolve(response);
      } else {
        console.error("❌ Failed to delete message for me:", response.error);
        reject(response);
      }
    });
  });
}

export function deleteForEveryone(
  socket: Socket | null,
  payload: DeleteForEveryonePayload,
): Promise<WebSocketResponse> {
  return new Promise((resolve, reject) => {
    if (!socket?.connected) {
      reject({ success: false, error: "Socket not connected" });
      return;
    }

    socket.emit("deleteForEveryone", payload, (response: WebSocketResponse) => {
      if (response.success) {
        console.log("✅ Message deleted for everyone:", payload.messageId);
        resolve(response);
      } else {
        console.error(
          "❌ Failed to delete message for everyone:",
          response.error,
        );
        reject(response);
      }
    });
  });
}
