/**
 * Socket.IO Client for Real-time Notifications
 *
 * Connects to the notification WebSocket server for
 * real-time notification delivery when the app is open.
 */

import { io, Socket } from "socket.io-client";
import type { NotificationPayload } from "@/types/notification";

const NOTIFICATION_SOCKET_URL = "https://communication.mergeedu.app";

let socket: Socket | null = null;

// Deduplication: track processed notification IDs
const processedNotificationIds = new Set<string>();

interface NotificationSocketCallbacks {
  onNotification?: (notification: NotificationPayload) => void;
  onConnect?: () => void;
  onDisconnect?: () => void;
  onError?: (error: Error) => void;
}

/**
 * Get access token from API route
 */
async function getAccessToken(): Promise<string | null> {
  try {
    const response = await fetch("/api/auth/token");
    if (!response.ok) return null;
    const data = await response.json();
    return data.token || null;
  } catch (error) {
    console.error("[Socket] Failed to get access token:", error);
    return null;
  }
}

/**
 * Connect to the notification socket server
 * Fetches token from API route and uses it for auth
 */
export async function connectNotificationSocket(
  callbacks: NotificationSocketCallbacks = {},
): Promise<Socket | null> {
  // Disconnect existing socket first
  if (socket?.connected) {
    console.log("[Socket] Disconnecting existing socket...");
    socket.disconnect();
  }

  // Clear processed IDs when reconnecting
  processedNotificationIds.clear();

  // Get token from API route
  const token = await getAccessToken();
  if (!token) {
    console.error("[Socket] No access token available, cannot connect");
    callbacks.onError?.(new Error("No access token"));
    return null;
  }

  console.log("[Socket] Connecting with token...");

  socket = io(`${NOTIFICATION_SOCKET_URL}/notifications`, {
    auth: {
      token,
    },
    transports: ["websocket"],
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
  });

  // Connection events
  socket.on("connect", () => {
    console.log("[Socket] Connected to notification server");
    callbacks.onConnect?.();
  });

  socket.on("disconnect", (reason) => {
    console.log("[Socket] Disconnected:", reason);
    callbacks.onDisconnect?.();
  });

  socket.on("connect_error", (error) => {
    console.error("[Socket] Connection error:", error);
    callbacks.onError?.(error);
  });

  // Notification event with deduplication
  socket.on("notification", (data: NotificationPayload) => {
    // Deduplicate at socket level
    if (processedNotificationIds.has(data.id)) {
      console.log("[Socket] Skipping duplicate notification:", data.id);
      return;
    }
    processedNotificationIds.add(data.id);

    console.log("[Socket] Processing notification:", data.id);
    callbacks.onNotification?.(data);
  });

  return socket;
}

/**
 * Disconnect from notification socket
 */
export function disconnectNotificationSocket(): void {
  if (socket) {
    socket.disconnect();
    socket = null;
    processedNotificationIds.clear();
    console.log("[Socket] Disconnected");
  }
}

/**
 * Check if socket is currently connected
 */
export function isSocketConnected(): boolean {
  return socket?.connected ?? false;
}

/**
 * Get the current socket instance
 */
export function getNotificationSocket(): Socket | null {
  return socket;
}
