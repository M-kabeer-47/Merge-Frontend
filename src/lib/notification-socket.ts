import { io, Socket } from "socket.io-client";
import type { NotificationPayload } from "@/types/notification";

const NOTIFICATION_SOCKET_URL = process.env.NEXT_PUBLIC_COMMUNICATION_URL;

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
    socket.disconnect();
  }

  // Clear processed IDs when reconnecting
  processedNotificationIds.clear();

  // Get token from API route
  const token = await getAccessToken();
  if (!token) {
    callbacks.onError?.(new Error("No access token"));
    return null;
  }

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
    callbacks.onConnect?.();
  });

  socket.on("disconnect", (reason) => {
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
      return;
    }
    processedNotificationIds.add(data.id);
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
