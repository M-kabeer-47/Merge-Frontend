/**
 * Mock data for Live Session Host View
 * 
 * Provides sample session, attendees, chat messages, files, and permission requests
 * for development and testing purposes.
 */

import type {
  LiveSession,
  Attendee,
  ChatMessage,
  SessionFile,
  PermissionRequest,
  BotReply,
  CanvasElement,
} from "@/types/live-session";

// ═══════════════════════════════════════════════════════════════════
// MOCK ATTENDEES
// ═══════════════════════════════════════════════════════════════════

export const mockAttendees: Attendee[] = [
  {
    id: "host-1",
    name: "Dr. Sarah Johnson",
    avatar: undefined,
    role: "host",
    webcamOn: true,
    micOn: true,
    speakerActive: true,
    raiseHand: false,
    networkQuality: "excellent",
    canEdit: true,
    screenSharing: false,
    joinedAt: new Date("2025-10-13T10:00:00"),
  },
  {
    id: "att-1",
    name: "Ahmed Khan",
    avatar: undefined,
    role: "participant",
    webcamOn: true,
    micOn: false,
    speakerActive: false,
    raiseHand: true,
    networkQuality: "good",
    canEdit: false,
    screenSharing: false,
    joinedAt: new Date("2025-10-13T10:02:00"),
  },
  {
    id: "att-2",
    name: "Maria Garcia",
    avatar: undefined,
    role: "participant",
    webcamOn: false,
    micOn: false,
    speakerActive: false,
    raiseHand: false,
    networkQuality: "excellent",
    canEdit: false,
    screenSharing: false,
    joinedAt: new Date("2025-10-13T10:03:00"),
  },
  {
    id: "att-3",
    name: "John Smith",
    avatar: undefined,
    role: "co-host",
    webcamOn: true,
    micOn: true,
    speakerActive: true,
    raiseHand: false,
    networkQuality: "good",
    canEdit: true,
    screenSharing: false,
    joinedAt: new Date("2025-10-13T10:01:00"),
  },
  {
    id: "att-4",
    name: "Fatima Ali",
    avatar: undefined,
    role: "participant",
    webcamOn: true,
    micOn: false,
    speakerActive: false,
    raiseHand: false,
    networkQuality: "poor",
    canEdit: false,
    screenSharing: false,
    joinedAt: new Date("2025-10-13T10:05:00"),
  },
  {
    id: "att-5",
    name: "David Chen",
    avatar: undefined,
    role: "participant",
    webcamOn: false,
    micOn: false,
    speakerActive: false,
    raiseHand: false,
    networkQuality: "excellent",
    canEdit: false,
    screenSharing: false,
    joinedAt: new Date("2025-10-13T10:06:00"),
  },
  {
    id: "att-6",
    name: "Lisa Wang",
    avatar: undefined,
    role: "participant",
    webcamOn: true,
    micOn: false,
    speakerActive: false,
    raiseHand: false,
    networkQuality: "good",
    canEdit: false,
    screenSharing: false,
    joinedAt: new Date("2025-10-13T10:08:00"),
  },
  {
    id: "att-7",
    name: "Omar Hassan",
    avatar: undefined,
    role: "participant",
    webcamOn: false,
    micOn: false,
    speakerActive: false,
    raiseHand: false,
    networkQuality: "excellent",
    canEdit: false,
    screenSharing: false,
    joinedAt: new Date("2025-10-13T10:10:00"),
  },
];

// ═══════════════════════════════════════════════════════════════════
// MOCK SESSION
// ═══════════════════════════════════════════════════════════════════

export const mockSession: LiveSession = {
  id: "session-123",
  title: "Advanced React Patterns - Week 5",
  hostId: "host-1",
  startedAt: new Date("2025-10-13T10:00:00"),
  attendees: mockAttendees,
  permissions: {
    allowUnmute: true,
    allowScreenShare: false,
    allowCam: true,
    allowCanvasCollab: false,
  },
  isRecording: true,
  isLocked: false,
  maxAttendees: 50,
};

// ═══════════════════════════════════════════════════════════════════
// MOCK CHAT MESSAGES
// ═══════════════════════════════════════════════════════════════════

export const mockChatMessages: ChatMessage[] = [
  {
    id: "msg-1",
    senderId: "att-1",
    senderName: "Ahmed Khan",
    senderAvatar: undefined,
    message: "Could you explain the difference between useCallback and useMemo again?",
    timestamp: new Date("2025-10-13T10:15:00"),
    upvotes: 5,
    upvotedBy: ["att-2", "att-3", "att-4", "att-5", "att-6"],
    isBotQuery: false,
  },
  {
    id: "msg-2",
    senderId: "host-1",
    senderName: "Dr. Sarah Johnson",
    senderAvatar: undefined,
    message: "Great question! useCallback memoizes functions, useMemo memoizes values. I'll demonstrate with an example.",
    timestamp: new Date("2025-10-13T10:16:00"),
    upvotes: 3,
    upvotedBy: ["att-1", "att-3", "att-7"],
    isBotQuery: false,
  },
  {
    id: "msg-3",
    senderId: "att-3",
    senderName: "John Smith",
    senderAvatar: undefined,
    message: "Can you share the performance benchmark slide from last week?",
    timestamp: new Date("2025-10-13T10:18:00"),
    upvotes: 2,
    upvotedBy: ["att-2", "att-4"],
    isBotQuery: false,
  },
  {
    id: "msg-4",
    senderId: "att-4",
    senderName: "Fatima Ali",
    senderAvatar: undefined,
    message: "What's the best practice for handling side effects in custom hooks?",
    timestamp: new Date("2025-10-13T10:20:00"),
    upvotes: 7,
    upvotedBy: ["att-1", "att-2", "att-5", "att-6", "att-7", "host-1", "att-3"],
    isBotQuery: true,
    botReply: {
      id: "bot-1",
      question: "What's the best practice for handling side effects in custom hooks?",
      answer: "Use useEffect inside your custom hook. Keep effects focused and return cleanup functions. Example: export function useWindowSize() { const [size, setSize] = useState({ width: window.innerWidth, height: window.innerHeight }); useEffect(() => { const handleResize = () => setSize({ width: window.innerWidth, height: window.innerHeight }); window.addEventListener('resize', handleResize); return () => window.removeEventListener('resize', handleResize); }, []); return size; }",
      content: "Use useEffect inside your custom hook. Keep effects focused and return cleanup functions. Example: export function useWindowSize() { const [size, setSize] = useState({ width: window.innerWidth, height: window.innerHeight }); useEffect(() => { const handleResize = () => setSize({ width: window.innerWidth, height: window.innerHeight }); window.addEventListener('resize', handleResize); return () => window.removeEventListener('resize', handleResize); }, []); return size; }",
      timestamp: new Date("2025-10-13T10:20:05"),
      helpful: true,
      sources: ["React Hooks Documentation", "Custom Hooks Best Practices"],
    },
  },
  {
    id: "msg-5",
    senderId: "att-6",
    senderName: "Lisa Wang",
    senderAvatar: undefined,
    message: "Will the recording be available after the session?",
    timestamp: new Date("2025-10-13T10:22:00"),
    upvotes: 1,
    upvotedBy: ["att-7"],
    isBotQuery: false,
  },
  {
    id: "msg-6",
    senderId: "att-2",
    senderName: "Maria Garcia",
    senderAvatar: undefined,
    message: "This is really helpful! Thank you for the detailed explanations.",
    timestamp: new Date("2025-10-13T10:25:00"),
    upvotes: 4,
    upvotedBy: ["att-1", "att-5", "att-6", "att-7"],
    isBotQuery: false,
  },
];

// ═══════════════════════════════════════════════════════════════════
// MOCK FILES
// ═══════════════════════════════════════════════════════════════════

export const mockFiles: SessionFile[] = [
  {
    id: "file-1",
    name: "Week5_CustomHooks.pdf",
    type: "pdf",
    size: "2.4 MB",
    url: "about:blank",
    uploadedBy: "Dr. Sarah Johnson",
    uploadedAt: new Date("2025-10-13T09:45:00"),
    thumbnail: undefined,
  },
  {
    id: "file-2",
    name: "PerformanceBenchmarks.pdf",
    type: "pdf",
    size: "1.8 MB",
    url: "about:blank",
    uploadedBy: "Dr. Sarah Johnson",
    uploadedAt: new Date("2025-10-13T09:50:00"),
    thumbnail: undefined,
  },
  {
    id: "file-3",
    name: "CodeExamples.zip",
    type: "other",
    size: "450 KB",
    url: "about:blank",
    uploadedBy: "John Smith",
    uploadedAt: new Date("2025-10-13T09:55:00"),
  },
  {
    id: "file-4",
    name: "HooksDiagram.png",
    type: "image",
    size: "890 KB",
    url: "about:blank",
    uploadedBy: "Dr. Sarah Johnson",
    uploadedAt: new Date("2025-10-13T09:58:00"),
    thumbnail: undefined,
  },
  {
    id: "file-5",
    name: "SessionRecording_Week4.mp4",
    type: "video",
    size: "124 MB",
    url: "about:blank",
    uploadedBy: "Dr. Sarah Johnson",
    uploadedAt: new Date("2025-10-12T16:00:00"),
  },
];

// ═══════════════════════════════════════════════════════════════════
// MOCK PERMISSION REQUESTS
// ═══════════════════════════════════════════════════════════════════

export const mockPermissionRequests: PermissionRequest[] = [
  {
    id: "req-1",
    attendeeId: "att-1",
    attendeeName: "Ahmed Khan",
    type: "unmute",
    timestamp: new Date("2025-10-13T10:14:00"),
  },
  {
    id: "req-2",
    attendeeId: "att-5",
    attendeeName: "Fatima Ali",
    type: "screenshare",
    timestamp: new Date("2025-10-13T10:19:00"),
  },
];

// ═══════════════════════════════════════════════════════════════════
// MOCK CANVAS ELEMENTS
// ═══════════════════════════════════════════════════════════════════

export const mockCanvasElements: CanvasElement[] = [
  {
    id: "elem-1",
    type: "shape",
    x: 100,
    y: 100,
    width: 150,
    height: 100,
    color: "#8668c0",
  },
  {
    id: "elem-2",
    type: "arrow",
    x: 250,
    y: 150,
    width: 100,
    height: 50,
    color: "#2f1a58",
  },
  {
    id: "elem-3",
    type: "sticky",
    x: 400,
    y: 80,
    width: 120,
    height: 120,
    color: "#e69a29",
    content: "Remember: Always cleanup effects!",
  },
  {
    id: "elem-4",
    type: "text",
    x: 150,
    y: 250,
    content: "React Hook Flow",
    color: "#111827",
  },
];
