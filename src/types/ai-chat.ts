// AI Assistant Chat Types

export type MessageRole = "user" | "assistant";

// Attachment type enum
export enum AttachmentType {
  IMAGE = "image",
  PDF = "pdf",
  DOCX = "docx",
  PPTX = "pptx",
  TXT = "txt",
}

// Source chunk from AI response
export interface MessageSource {
  file_id: string;
  chunk_index: number;
  content: string;
  relevance_score: number;
  section_title: string;
}

// Chat message from API
export interface ChatMessage {
  id: string;
  role: MessageRole;
  content: string;
  contextFileId?: string | null;
  sources?: MessageSource[];
  chunksRetrieved?: number;
  processingTimeMs?: number;
  createdAt: string;
}

// Context file for uploaded attachments
export interface ContextFile {
  id: string;
  name: string;
  type: string;
  roomName?: string;
  roomId?: string;
  size?: number;
  url?: string;
}

// Last message preview in conversation list
export interface LastMessage extends ChatMessage {}

// Chat session/conversation from API
export interface ChatSession {
  id: string;
  title: string;
  summary: string | null;
  createdAt: string;
  updatedAt: string;
  messageCount: number;
  lastMessage?: LastMessage;
  isPinned?: boolean; // Client-side only
}

// Conversation with messages
export interface ConversationWithMessages {
  id: string;
  title: string;
  summary: string | null;
  createdAt: string;
  updatedAt: string;
  messages: ChatMessage[];
}

// API Response Types
export interface CreateConversationResponse {
  id: string;
  title: string;
  summary: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateConversationResponse extends CreateConversationResponse {}

export interface DeleteConversationResponse {
  success: boolean;
  message: string;
}

export interface SendMessageResponse extends ChatMessage {}

// Request Payloads
export interface CreateConversationPayload {
  title: string;
}

export interface UpdateConversationTitlePayload {
  title: string;
}

export interface SendMessagePayload {
  message: string;
  attachmentS3Url?: string;
  attachmentType?: AttachmentType;
  attachmentOriginalName?: string;
  attachmentFileSize?: number;
}

