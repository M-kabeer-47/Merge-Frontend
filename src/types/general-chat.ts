// General Chat Types for WebSocket and REST API

// ═══════════════════════════════════════════════════════════════════
// CORE TYPES
// ═══════════════════════════════════════════════════════════════════

export type MessageStatus = "sending" | "sent" | "failed";

export interface MessageAttachment {
  id: string;
  name: string;
  type: "image" | "file";
  url: string;
  size: number;
  preview?: string;
  isUploading?: boolean;
  uploadProgress?: number;
}

/**
 * Unified User type - used everywhere
 * Core fields from API + optional UI-computed fields
 */
export interface MessageUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  image: string | null;
  // UI-computed fields (optional)
  initials?: string;
  isOnline?: boolean;
}

// Alias for clarity in UI components
export type ChatUser = MessageUser;

export interface RoomInfo {
  id: string;
  title?: string;
}

// ═══════════════════════════════════════════════════════════════════
// MESSAGE TYPE - UNIFIED FOR FRONTEND AND BACKEND
// ═══════════════════════════════════════════════════════════════════

/**
 * ChatMessage - Single unified type for both API and Frontend
 * Server sends this exact format, we use it directly
 */
export interface ChatMessage {
  id: string;
  content: string;
  userId: string;
  roomId: string;
  replyToId: string | null;
  attachments: MessageAttachment[];
  createdAt: string;
  updatedAt: string;
  isEdited: boolean;
  isDeleted: boolean;
  user: MessageUser;

  // Ownership (from backend API)
  isMine?: boolean;

  // Client-side state (server also sends these with defaults)
  status: MessageStatus;
  isUploading: boolean;
  uploadProgress: number;

  // Optional
  replyTo?: ChatMessage | null;
}

// ═══════════════════════════════════════════════════════════════════
// HELPER FUNCTIONS
// ═══════════════════════════════════════════════════════════════════

/**
 * Get user initials from MessageUser
 */
export function getUserInitials(user?: MessageUser | null): string {
  if (!user) return "??";
  return `${user.firstName?.[0] || ""}${user.lastName?.[0] || ""}`.toUpperCase();
}

/**
 * Get user display name from MessageUser
 */
export function getUserDisplayName(user?: MessageUser | null): string {
  if (!user) return "Unknown User";
  return `${user.firstName || ""} ${user.lastName || ""}`.trim() || "Unknown User";
}

/**
 * Enhance user with UI-computed fields
 */
export function enhanceUser(user?: MessageUser | null): MessageUser {
  if (!user) {
    return {
      id: "",
      firstName: "Unknown",
      lastName: "User",
      email: "",
      image: null,
      initials: "??",
    };
  }
  return {
    ...user,
    initials: getUserInitials(user),
    isOnline: true, // Default to online, can be updated by presence system
  };
}

/**
 * Create an optimistic message for immediate UI feedback
 */
export function createOptimisticMessage(params: {
  tempId: string;
  roomId: string;
  content: string;
  user: MessageUser;
  replyToId?: string;
  attachment?: {
    file: File;
    preview?: string;
    type: "image" | "file";
  };
}): ChatMessage {
  const { tempId, roomId, content, user, replyToId, attachment } = params;
  const now = new Date().toISOString();

  const attachments: MessageAttachment[] = [];
  if (attachment) {
    attachments.push({
      id: `att-${tempId}`,
      name: attachment.file.name,
      type: attachment.type,
      url: attachment.preview || "",
      size: attachment.file.size,
      preview: attachment.preview,
      isUploading: true,
      uploadProgress: 0,
    });
  }

  return {
    id: tempId,
    content,
    userId: user.id,
    roomId,
    replyToId: replyToId || null,
    attachments,
    createdAt: now,
    updatedAt: now,
    isEdited: false,
    isDeleted: false,
    user: enhanceUser(user),
    status: "sending",
    isUploading: attachments.length > 0,
    uploadProgress: 0,
  };
}

/**
 * Check if a message ID is a temporary/optimistic ID
 */
export function isOptimisticId(id: string): boolean {
  return id.startsWith("temp-");
}

// ═══════════════════════════════════════════════════════════════════
// API RESPONSE TYPES
// ═══════════════════════════════════════════════════════════════════

export interface FetchMessagesResponse {
  messages: ChatMessage[];
  total: number;
  totalPages: number;
  currentPage: number;
  room: RoomInfo;
}

// ═══════════════════════════════════════════════════════════════════
// WEBSOCKET PAYLOADS
// ═══════════════════════════════════════════════════════════════════

export interface SendMessagePayload {
  roomId: string;
  content?: string;
  replyToId?: string;
  attachmentURL?: string;
}

export interface UpdateMessagePayload {
  roomId: string;
  messageId: string;
  content: string;
}

export interface DeleteMessagePayload {
  roomId: string;
  messageId: string;
}

// Aliases for specific delete operations
export type DeleteForMePayload = DeleteMessagePayload;
export type DeleteForEveryonePayload = DeleteMessagePayload;

// ═══════════════════════════════════════════════════════════════════
// WEBSOCKET EVENTS
// ═══════════════════════════════════════════════════════════════════

export interface MessageDeletedEventData {
  messageId: string;
  roomId: string;
  deletedAt: string;
  authorId: string;
}

export interface SocketErrorData {
  action: string;
  error: string;
  messageId?: string;
}

export interface WebSocketResponse {
  success: boolean;
  message?: ChatMessage;
  error?: string;
}

// ═══════════════════════════════════════════════════════════════════
// CACHE TYPES
// ═══════════════════════════════════════════════════════════════════

export interface ChatCachePage {
  messages: ChatMessage[];
  total: number;
  totalPages: number;
  currentPage: number;
  room: RoomInfo;
}

export interface ChatCacheData {
  pages: ChatCachePage[];
  pageParams: number[];
}
