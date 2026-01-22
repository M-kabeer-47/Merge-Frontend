// UI User type for chat components
export interface MessageUserUI {
  id: string;
  name: string;
  initials: string;
  role: "student" | "instructor" | "admin";
  isOnline: boolean;
  avatar?: string;
}
// General Chat Types for WebSocket and REST API

// ═══════════════════════════════════════════════════════════════════
// MESSAGE TYPES
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
  // deletedForEveryone has been removed in favor of isDeletedForEveryone
export interface MessageUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  image: string | null;
}

export interface RoomInfo {
  id: string;
  title: string;
}

// API Response Message (from backend)
export interface ApiChatMessage {
  id: string;
  content: string;
  attachmentURL: string | null;
  replyToId: string | null;
  createdAt: string;
  updatedAt: string;
  isEdited: boolean;
  isDeletedForEveryone: boolean;
  isMine: boolean;
  author: MessageUser;
  room: RoomInfo;
}

// Frontend ChatMessage (for UI)
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
  isDeletedForEveryone: boolean;
  user: MessageUser;
  replyTo?: ChatMessage | null;
  // Client-side only properties
  status?: MessageStatus;
  isUploading?: boolean;
  uploadProgress?: number;
  reactions?: Array<{ userId: string; emoji: string }>;
  seen?: boolean;
}

// ═══════════════════════════════════════════════════════════════════
// API RESPONSE TYPES
// ═══════════════════════════════════════════════════════════════════

export interface FetchMessagesResponse {
  messages: ApiChatMessage[];
  total: number;
  totalPages: number;
  currentPage: number;
  room: RoomInfo;
}

export interface SendMessageResponse {
  success: boolean;
  message: ApiChatMessage;
}

export interface UpdateMessageResponse {
  success: boolean;
  message: ApiChatMessage;
}

export interface DeleteMessageResponse {
  success: boolean;
}

// ═══════════════════════════════════════════════════════════════════
// WEBSOCKET EVENT PAYLOADS
// ═══════════════════════════════════════════════════════════════════

// Outgoing Events (Client → Server)

export interface JoinRoomPayload {
  roomId: string;
}

export interface LeaveRoomPayload {
  roomId: string;
}

export interface SendMessagePayload {
  roomId: string;
  content: string;
  replyToId?: string;
  attachmentURL?: string;
}

export interface UpdateMessagePayload {
  roomId: string;
  messageId: string;
  content: string;
}

export interface DeleteForMePayload {
  roomId: string;
  messageId: string;
}

export interface DeleteForEveryonePayload {
  roomId: string;
  messageId: string;
}

// Incoming Events (Server → Client)

export interface NewMessageEvent {
  event: "newMessage";
  data: ApiChatMessage;
}

export interface MessageUpdatedEvent {
  event: "messageUpdated";
  data: ApiChatMessage;
}

export interface MessageDeletedEvent {
  event: "messageDeleted";
  data: {
    messageId: string;
    roomId: string;
    deletedAt: string;
    authorId: string;
  };
}

export interface ErrorEvent {
  event: "error";
  data: {
    action: string;
    error: string;
    messageId?: string;
  };
}

// ═══════════════════════════════════════════════════════════════════
// WEBSOCKET RESPONSE TYPES
// ═══════════════════════════════════════════════════════════════════

export interface WebSocketResponse {
  success: boolean;
  message?: ApiChatMessage;
  error?: string;
}

// ═══════════════════════════════════════════════════════════════════
// HOOK TYPES
// ═══════════════════════════════════════════════════════════════════

export interface UseWebSocketChatReturn {
  isConnected: boolean;
  joinRoom: (roomId: string) => void;
  leaveRoom: (roomId: string) => void;
  sendMessage: (payload: SendMessagePayload) => Promise<void>;
  updateMessage: (payload: UpdateMessagePayload) => Promise<void>;
  deleteForMe: (payload: DeleteForMePayload) => Promise<void>;
  deleteForEveryone: (payload: DeleteForEveryonePayload) => Promise<void>;
  messages: ChatMessage[];
  error: string | null;
}
