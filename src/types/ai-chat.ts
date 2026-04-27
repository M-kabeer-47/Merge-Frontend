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

// Source chunk from AI response. fileName is added by the NestJS backend
// after looking up the file_id against the files table — see
// FileService.enrichSourcesWithFileNames.
export interface MessageSource {
  file_id: string;
  chunk_index: number;
  content: string;
  relevance_score: number;
  section_title: string;
  fileName?: string | null;
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
  // Attachment sent alongside this user message (optional, user messages only).
  attachmentOriginalName?: string | null;
  attachmentType?: "pdf" | "docx" | "txt" | "pptx" | "image" | null;
  attachmentFileSize?: number | null;
  attachmentUrl?: string | null;
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

export interface ConversationAttachmentSummary {
  url: string;
  type: string;
  originalName: string;
  inVectorDB?: boolean;
}

// Conversation with messages
export interface ConversationWithMessages {
  id: string;
  title: string;
  summary: string | null;
  createdAt: string;
  updatedAt: string;
  messages: ChatMessage[];
  /** All attachments currently active on this conversation (cap: 2). */
  attachments?: ConversationAttachmentSummary[];
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
  contextFileId?: string;
  attachmentS3Url?: string;
  attachmentType?: AttachmentType;
  attachmentOriginalName?: string;
  attachmentFileSize?: number;
}

// Streaming Query Payload (New Endpoint)
export interface StreamQueryPayload {
  conversationId?: string;
  message: string;
  contextFileId?: string;
  attachmentS3Url?: string;
  attachmentType?: 'pdf' | 'docx' | 'txt' | 'pptx' | 'image';
  attachmentOriginalName?: string;
  attachmentFileSize?: number;
  topK?: number;
}

// SSE Event Types
export interface ConversationEvent {
  conversation_id: string;
}

export interface TitleEvent {
  title: string;
}

export interface DataEvent {
  text: string;
}

export interface SourceEvent {
  fileId: string;
  chunkIndex: number;
  content: string;
  relevanceScore: number;
}

export interface DoneEvent {
  messageId: string;
  totalChunks?: number;
  processingTimeMs?: number;
}

export interface ErrorEvent {
  error: string;
}

