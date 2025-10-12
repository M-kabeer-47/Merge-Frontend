// AI Assistant Chat Types

export type MessageRole = "user" | "assistant";

export interface ChatMessage {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: Date;
  contextFiles?: ContextFile[];
}

export interface ContextFile {
  id: string;
  name: string;
  type: string;
  roomName: string;
  roomId: string;
  size?: number;
  isPrimary?: boolean;
}

export interface ChatSession {
  id: string;
  title: string;
  preview: string;
  createdAt: Date;
  updatedAt: Date;
  isPinned?: boolean;
  messageCount: number;
}

