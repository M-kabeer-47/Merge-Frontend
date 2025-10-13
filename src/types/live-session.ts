/**
 * Type definitions for Live Session Host View
 * 
 * Comprehensive interfaces for host-controlled live sessions including
 * attendees, chat, canvas, files, and permission management.
 */

// ═══════════════════════════════════════════════════════════════════
// CORE SESSION TYPES
// ═══════════════════════════════════════════════════════════════════

export type AttendeeRole = "host" | "co-host" | "participant";
export type NetworkQuality = "excellent" | "good" | "poor" | "offline";
export type PermissionType = "allowUnmute" | "allowScreenShare" | "allowCam" | "allowCanvasCollab";

export interface SessionPermissions {
  allowUnmute: boolean;
  allowScreenShare: boolean;
  allowCam: boolean;
  allowCanvasCollab: boolean;
}

export interface Attendee {
  id: string;
  name: string;
  avatar?: string;
  role: AttendeeRole;
  webcamOn: boolean;
  micOn: boolean;
  speakerActive: boolean;
  raiseHand: boolean;
  networkQuality: NetworkQuality;
  canEdit: boolean;
  screenSharing: boolean;
  joinedAt: Date;
}

export interface LiveSession {
  id: string;
  title: string;
  hostId: string;
  startedAt: Date;
  attendees: Attendee[];
  permissions: SessionPermissions;
  isRecording: boolean;
  isLocked: boolean;
  maxAttendees: number;
}

// ═══════════════════════════════════════════════════════════════════
// CHAT TYPES
// ═══════════════════════════════════════════════════════════════════

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar?: string;
  message: string;
  timestamp: Date;
  upvotes: number;
  upvotedBy: string[];
  isBotQuery: boolean;
  botReply?: BotReply;
}

export interface BotReply {
  id: string;
  question: string;
  answer: string;
  content: string; // Alias for answer for easier access
  timestamp: Date;
  helpful: boolean | null;
  sources?: string[];
}

// ═══════════════════════════════════════════════════════════════════
// CANVAS TYPES
// ═══════════════════════════════════════════════════════════════════

export type CanvasTool = "select" | "pen" | "eraser" | "rect" | "circle" | "arrow" | "sticky" | "text";

export interface CanvasElement {
  id: string;
  type: "shape" | "arrow" | "sticky" | "text" | "drawing";
  x: number;
  y: number;
  width?: number;
  height?: number;
  color?: string;
  content?: string;
  rotation?: number;
}

export interface CanvasState {
  isOpen: boolean;
  isLocked: boolean;
  activeTool: CanvasTool;
  elements: CanvasElement[];
  selectedElementId: string | null;
}

// ═══════════════════════════════════════════════════════════════════
// FILES TYPES
// ═══════════════════════════════════════════════════════════════════

export type FileType = "pdf" | "image" | "video" | "document" | "other";

export interface SessionFile {
  id: string;
  name: string;
  type: FileType;
  size: string;
  url: string;
  uploadedBy: string;
  uploadedAt: Date;
  thumbnail?: string;
}

// ═══════════════════════════════════════════════════════════════════
// PERMISSION REQUEST TYPES
// ═══════════════════════════════════════════════════════════════════

export type RequestType = "unmute" | "camera" | "screenshare" | "canvas-edit";

export interface PermissionRequest {
  id: string;
  attendeeId: string;
  attendeeName: string;
  type: RequestType;
  timestamp: Date;
}

// ═══════════════════════════════════════════════════════════════════
// HOST CONTROL TYPES
// ═══════════════════════════════════════════════════════════════════

export interface HostControls {
  micOn: boolean;
  cameraOn: boolean;
  screenSharing: boolean;
  isFullscreen: boolean;
}
