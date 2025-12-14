/**
 * Live Session Host View Demo Page
 * 
 * Full-featured host interface for conducting live sessions with attendees,
 * chat, canvas, and file sharing capabilities.
 */

"use client";

import React, { useState } from "react";
import { useParams } from "next/navigation";
import {
  Phone,
  Mic,
  MicOff,
  Video,
  VideoOff,
  MonitorUp,
  MonitorOff,
  Maximize,
  Minimize,
  Palette,
  Folder,
  UserCog,
  Users,
  MessageSquare,
  Lock,
  Bell,
  Settings,
} from "lucide-react";
import IconButton from "@/components/live-session/IconButton";
import Toast from "@/components/live-session/Toast";
import AttendeesPanel from "@/components/live-session/AttendeesPanel";
import ChatPanel from "@/components/live-session/ChatPanel";
import CanvasStage from "@/components/live-session/CanvasStage";
import FilesPanel from "@/components/live-session/FilesPanel";
import {
  mockAttendees,
  mockSession,
  mockChatMessages,
  mockFiles,
  mockCanvasElements,
} from "@/lib/constants/live-session-mock-data";
import type { ChatMessage, Attendee, CanvasElement, SessionFile } from "@/types/live-session";

export default function LiveSessionHostPage() {
  const params = useParams();
  

  // Host controls state
  const [micOn, setMicOn] = useState(true);
  const [cameraOn, setCameraOn] = useState(true);
  const [screenSharing, setScreenSharing] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Panel visibility state
  const [showCanvas, setShowCanvas] = useState(false);
  const [showFiles, setShowFiles] = useState(false);
  const [activeRightPanel, setActiveRightPanel] = useState<"attendees" | "chat">("attendees");

  // Permissions state
  const [permissions, setPermissions] = useState(mockSession.permissions);
  const [showPermissions, setShowPermissions] = useState(false);

  // Data state
  const [attendees] = useState<Attendee[]>(mockAttendees);
  const [messages, setMessages] = useState<ChatMessage[]>(mockChatMessages);
  const [files] = useState<SessionFile[]>(mockFiles);
  const [canvasElements, setCanvasElements] = useState<CanvasElement[]>(mockCanvasElements);
  const [canvasLocked, setCanvasLocked] = useState(false);

  // Toast state
  const [toast, setToast] = useState<{
    type: "success" | "error" | "info" | "warning";
    message: string;
  } | null>(null);

  const showToast = (type: "success" | "error" | "info" | "warning", message: string) => {
    setToast({ type, message });
  };

  // Host actions
  const handleEndCall = () => {
    if (window.confirm("End session for all participants?")) {
      console.log("[Host] Ending session for all participants");
      showToast("success", "Session ended");
    }
  };

  const handleToggleMic = () => {
    setMicOn(!micOn);
    console.log(`[Host] Microphone ${!micOn ? "enabled" : "muted"}`);
    showToast("info", `Microphone ${!micOn ? "enabled" : "muted"}`);
  };

  const handleToggleCamera = () => {
    setCameraOn(!cameraOn);
    console.log(`[Host] Camera ${!cameraOn ? "enabled" : "disabled"}`);
    showToast("info", `Camera ${!cameraOn ? "enabled" : "disabled"}`);
  };

  const handleToggleScreenShare = () => {
    setScreenSharing(!screenSharing);
    console.log(`[Host] Screen sharing ${!screenSharing ? "started" : "stopped"}`);
    showToast("info", `Screen sharing ${!screenSharing ? "started" : "stopped"}`);
  };

  const handleToggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
    console.log(`[Host] Fullscreen ${!isFullscreen ? "enabled" : "disabled"}`);
  };

  const handleMuteAll = () => {
    console.log("[Host] Muting all participants");
    showToast("success", "All participants muted");
  };

  const handleLockSession = () => {
    console.log("[Host] Session locked - no new participants can join");
    showToast("warning", "Session locked");
  };

  // Attendee actions
  const handleMuteAttendee = (id: string) => {
    console.log(`[Host] Muting attendee: ${id}`);
    showToast("info", "Attendee muted");
  };

  const handleStopCamera = (id: string) => {
    console.log(`[Host] Stopping camera for attendee: ${id}`);
    showToast("info", "Camera stopped");
  };

  const handleGrantCanvasEdit = (id: string) => {
    console.log(`[Host] Granting canvas edit permission to attendee: ${id}`);
    showToast("success", "Canvas edit permission granted");
  };

  const handlePromoteAttendee = (id: string) => {
    console.log(`[Host] Promoting attendee to co-host: ${id}`);
    showToast("success", "Attendee promoted to co-host");
  };

  const handleRemoveAttendee = (id: string) => {
    console.log(`[Host] Removing attendee from session: ${id}`);
    showToast("warning", "Attendee removed");
  };

  // Chat actions
  const handleSendMessage = (content: string, askBot: boolean) => {
    console.log(`[Chat] Sending message: "${content}" ${askBot ? "(with bot query)" : ""}`);
    
    const newMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      senderId: "host-1",
      senderName: "Dr. Sarah Johnson",
      message: content,
      timestamp: new Date(),
      upvotes: 0,
      upvotedBy: [],
      isBotQuery: askBot,
    };

    setMessages([...messages, newMessage]);

    // Simulate bot reply if asked
    if (askBot) {
      setTimeout(() => {
        const botReply = {
          id: `bot-${Date.now()}`,
          question: content,
          answer: "This is a simulated bot response. In production, this would be generated by an AI assistant based on your course materials.",
          content: "This is a simulated bot response. In production, this would be generated by an AI assistant based on your course materials.",
          timestamp: new Date(),
          helpful: null,
          sources: ["Course Material - Chapter 3", "Lecture Notes"],
        };
        
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === newMessage.id ? { ...msg, botReply } : msg
          )
        );
        showToast("success", "Bot reply generated");
      }, 1500);
    }
  };

  const handleUpvoteMessage = (messageId: string) => {
    console.log(`[Chat] Upvoting message: ${messageId}`);
    setMessages((prev) =>
      prev.map((msg) =>
        msg.id === messageId
          ? { ...msg, upvotes: msg.upvotes + 1, upvotedBy: [...msg.upvotedBy, "host-1"] }
          : msg
      )
    );
  };

  const handleDeleteMessage = (messageId: string) => {
    console.log(`[Chat] Deleting message: ${messageId}`);
    setMessages((prev) => prev.filter((msg) => msg.id !== messageId));
    showToast("info", "Message deleted");
  };

  const handlePinMessage = (messageId: string) => {
    console.log(`[Chat] Pinning message: ${messageId}`);
    showToast("info", "Message pinned");
  };

  // Canvas actions
  const handleAddCanvasElement = (element: Omit<CanvasElement, "id">) => {
    const newElement = { ...element, id: `canvas-${Date.now()}` };
    setCanvasElements([...canvasElements, newElement]);
  };

  const handleUpdateCanvasElement = (id: string, updates: Partial<CanvasElement>) => {
    setCanvasElements((prev) =>
      prev.map((el) => (el.id === id ? { ...el, ...updates } : el))
    );
  };

  const handleDeleteCanvasElement = (id: string) => {
    setCanvasElements((prev) => prev.filter((el) => el.id !== id));
  };

  const handleToggleCanvasLock = () => {
    setCanvasLocked(!canvasLocked);
  };

  const handleCanvasUndo = () => {
    console.log("[Canvas] Undo last action");
  };

  const handleCanvasRedo = () => {
    console.log("[Canvas] Redo last action");
  };

  const handleClearCanvas = () => {
    setCanvasElements([]);
  };

  const handleExportCanvas = () => {
    console.log("[Canvas] Exporting canvas as image");
    showToast("success", "Canvas exported");
  };

  // Files actions
  const handleDeleteFile = (fileId: string) => {
    console.log(`[Files] Deleting file: ${fileId}`);
    showToast("info", "File deleted");
  };

  // Permission toggles
  const handleTogglePermission = (permission: keyof typeof permissions) => {
    setPermissions({ ...permissions, [permission]: !permissions[permission] });
    console.log(`[Permissions] ${permission}: ${!permissions[permission]}`);
    showToast("info", `Permission updated: ${permission}`);
  };

  return (
    <div className="h-screen flex flex-col bg-[#1a1a1a]">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-6 right-6 z-50">
          <Toast
            type={toast.type}
            message={toast.message}
            onClose={() => setToast(null)}
          />
        </div>
      )}

      {/* Top Bar - Minimal Info */}
      <div className="bg-[#1a1a1a] px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-lg font-semibold text-white">{mockSession.title}</h1>
          {mockSession.isRecording && (
            <div className="flex items-center gap-2 px-3 py-1 bg-destructive/20 rounded-full">
              <div className="w-2 h-2 bg-destructive rounded-full animate-pulse" />
              <span className="text-xs font-medium text-destructive">Recording</span>
            </div>
          )}
        </div>
        <div className="flex items-center gap-3 text-sm text-white/70">
          <span>45:32</span>
        </div>
      </div>

      {/* Main Layout */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Left Panel - Canvas/Files (Overlay Style) */}
        {showCanvas && (
          <div className="absolute left-4 top-4 bottom-20 w-[420px] z-30 bg-main-background rounded-2xl shadow-2xl border border-light-border overflow-hidden">
            <CanvasStage
              elements={canvasElements}
              isLocked={canvasLocked}
              onAddElement={handleAddCanvasElement}
              onUpdateElement={handleUpdateCanvasElement}
              onDeleteElement={handleDeleteCanvasElement}
              onToggleLock={handleToggleCanvasLock}
              onUndo={handleCanvasUndo}
              onRedo={handleCanvasRedo}
              onClear={handleClearCanvas}
              onExport={handleExportCanvas}
            />
          </div>
        )}

        {showFiles && (
          <div className="absolute left-4 top-4 bottom-20 w-[420px] z-30 bg-main-background rounded-2xl shadow-2xl border border-light-border overflow-hidden">
            <FilesPanel files={files} onDeleteFile={handleDeleteFile} />
          </div>
        )}

        {/* Center - Main Stage Area */}
        <div className="flex-1 flex flex-col relative">
          {/* Main Video/Content Area */}
          <div className="flex-1 relative p-6">
            {/* Participants Grid at Bottom */}
            <div className="absolute bottom-6 left-6 right-6 z-20">
              <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                {attendees.map((attendee) => (
                  <div
                    key={attendee.id}
                    className={`
                      relative flex-shrink-0 w-[180px] h-[135px] rounded-xl overflow-hidden
                      ${attendee.speakerActive ? "ring-4 ring-primary" : "ring-2 ring-white/10"}
                      bg-[#2a2a2a] transition-all
                    `}
                  >
                    {attendee.webcamOn ? (
                      <div className="w-full h-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                        <Video className="w-8 h-8 text-white/40" />
                      </div>
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center text-white text-lg font-bold">
                          {attendee.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)}
                        </div>
                      </div>
                    )}
                    
                    {/* Attendee Info Overlay */}
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent p-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-medium text-white truncate flex-1">
                          {attendee.name}
                          {attendee.role === "host" && " (Host)"}
                        </span>
                        <div className="flex items-center gap-1">
                          {!attendee.micOn && (
                            <div className="w-5 h-5 rounded bg-destructive/90 flex items-center justify-center">
                              <MicOff className="w-3 h-3 text-white" />
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Raised Hand */}
                    {attendee.raiseHand && (
                      <div className="absolute top-2 right-2 w-6 h-6 bg-accent rounded-full flex items-center justify-center animate-bounce">
                        <span className="text-sm">✋</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Screen Share / Main Content Area */}
            <div className="absolute inset-6 bottom-[200px] flex items-center justify-center">
              {screenSharing ? (
                <div className="w-full h-full bg-[#2a2a2a] rounded-2xl flex items-center justify-center border-2 border-primary/20">
                  <div className="text-center">
                    <MonitorUp className="w-20 h-20 text-primary mx-auto mb-4" />
                    <p className="text-xl font-semibold text-white">You are sharing your screen</p>
                    <p className="text-sm text-white/60 mt-2">Others can see your entire screen</p>
                  </div>
                </div>
              ) : (
                <div className="text-center">
                  <div className="w-32 h-32 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
                    <Users className="w-16 h-16 text-primary" />
                  </div>
                  <h2 className="text-2xl font-bold text-white mb-2">{mockSession.title}</h2>
                  <p className="text-white/60">{attendees.length} participants in session</p>
                </div>
              )}
            </div>
          </div>

          {/* Bottom Control Bar */}
          <div className="relative z-30 px-6 pb-6">
            <div className="bg-[#2a2a2a]/95 backdrop-blur-xl rounded-2xl px-8 py-4 border border-white/10 shadow-2xl">
              <div className="flex items-center justify-between">
                {/* Left - Session Info */}
                <div className="flex items-center gap-4 min-w-[200px]">
                  <button
                    onClick={handleEndCall}
                    className="w-12 h-12 rounded-full bg-destructive hover:bg-destructive/90 flex items-center justify-center transition-colors"
                    title="End session"
                  >
                    <Phone className="w-5 h-5 text-white" />
                  </button>
                  <div className="text-left">
                    <p className="text-xs text-white/60">Session Duration</p>
                    <p className="text-sm font-semibold text-white">45:32</p>
                  </div>
                </div>

                {/* Center - Main Controls */}
                <div className="flex items-center gap-3">
                  <button
                    onClick={handleToggleMic}
                    className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${
                      micOn
                        ? "bg-[#3a3a3a] hover:bg-[#4a4a4a] text-white"
                        : "bg-destructive hover:bg-destructive/90 text-white"
                    }`}
                    title={micOn ? "Mute (M)" : "Unmute (M)"}
                  >
                    {micOn ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
                  </button>

                  <button
                    onClick={handleToggleCamera}
                    className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${
                      cameraOn
                        ? "bg-[#3a3a3a] hover:bg-[#4a4a4a] text-white"
                        : "bg-destructive hover:bg-destructive/90 text-white"
                    }`}
                    title={cameraOn ? "Stop camera (C)" : "Start camera (C)"}
                  >
                    {cameraOn ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
                  </button>

                  <button
                    onClick={handleToggleScreenShare}
                    className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${
                      screenSharing
                        ? "bg-primary hover:bg-primary/90 text-white"
                        : "bg-[#3a3a3a] hover:bg-[#4a4a4a] text-white"
                    }`}
                    title={screenSharing ? "Stop sharing (S)" : "Share screen (S)"}
                  >
                    <MonitorUp className="w-5 h-5" />
                  </button>

                  <div className="w-px h-10 bg-white/10 mx-2" />

                  <button
                    onClick={() => {
                      setShowCanvas(!showCanvas);
                      setShowFiles(false);
                    }}
                    className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${
                      showCanvas
                        ? "bg-primary hover:bg-primary/90 text-white"
                        : "bg-[#3a3a3a] hover:bg-[#4a4a4a] text-white"
                    }`}
                    title="Whiteboard"
                  >
                    <Palette className="w-5 h-5" />
                  </button>

                  <button
                    onClick={() => {
                      setShowFiles(!showFiles);
                      setShowCanvas(false);
                    }}
                    className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${
                      showFiles
                        ? "bg-primary hover:bg-primary/90 text-white"
                        : "bg-[#3a3a3a] hover:bg-[#4a4a4a] text-white"
                    }`}
                    title="Files"
                  >
                    <Folder className="w-5 h-5" />
                  </button>
                </div>

                {/* Right - More Options */}
                <div className="flex items-center gap-3 min-w-[200px] justify-end">
                  <div className="relative">
                    <button
                      onClick={() => setShowPermissions(!showPermissions)}
                      className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                        showPermissions
                          ? "bg-primary text-white"
                          : "bg-[#3a3a3a] hover:bg-[#4a4a4a] text-white"
                      }`}
                      title="Permissions"
                    >
                      <UserCog className="w-5 h-5" />
                    </button>

                    {showPermissions && (
                      <>
                        <div
                          className="fixed inset-0 z-40"
                          onClick={() => setShowPermissions(false)}
                        />
                        <div className="absolute bottom-full right-0 mb-3 z-50 bg-[#2a2a2a] border border-white/10 rounded-xl shadow-2xl p-5 min-w-[320px]">
                          <h3 className="text-sm font-bold text-white mb-4">Session Permissions</h3>
                          <div className="space-y-4">
                            {Object.entries(permissions).map(([key, value]) => (
                              <label key={key} className="flex items-center justify-between cursor-pointer group">
                                <span className="text-sm text-white/80 group-hover:text-white transition-colors capitalize">
                                  {key.replace(/([A-Z])/g, " $1").trim()}
                                </span>
                                <div className="relative">
                                  <input
                                    type="checkbox"
                                    checked={value}
                                    onChange={() => handleTogglePermission(key as keyof typeof permissions)}
                                    className="sr-only peer"
                                  />
                                  <div className="w-11 h-6 bg-white/10 rounded-full peer-checked:bg-primary transition-all" />
                                  <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-5 shadow-lg" />
                                </div>
                              </label>
                            ))}
                          </div>
                        </div>
                      </>
                    )}
                  </div>

                  <button
                    onClick={handleMuteAll}
                    className="w-12 h-12 rounded-full bg-[#3a3a3a] hover:bg-[#4a4a4a] text-white flex items-center justify-center transition-all"
                    title="Mute all"
                  >
                    <Lock className="w-5 h-5" />
                  </button>

                  <button
                    onClick={handleToggleFullscreen}
                    className="w-12 h-12 rounded-full bg-[#3a3a3a] hover:bg-[#4a4a4a] text-white flex items-center justify-center transition-all"
                    title="Fullscreen (F)"
                  >
                    {isFullscreen ? <Minimize className="w-5 h-5" /> : <Maximize className="w-5 h-5" />}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Sidebar - Chat/Attendees */}
        <div className="w-[400px] bg-main-background border-l border-light-border flex flex-col">
          {/* Tabs */}
          <div className="flex border-b border-light-border bg-white">
            <button
              onClick={() => setActiveRightPanel("chat")}
              className={`flex-1 px-6 py-4 text-sm font-semibold transition-all relative ${
                activeRightPanel === "chat"
                  ? "text-primary"
                  : "text-para hover:text-heading"
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <MessageSquare className="w-4 h-4" />
                Chat
              </div>
              {activeRightPanel === "chat" && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
              )}
            </button>
            <button
              onClick={() => setActiveRightPanel("attendees")}
              className={`flex-1 px-6 py-4 text-sm font-semibold transition-all relative ${
                activeRightPanel === "attendees"
                  ? "text-primary"
                  : "text-para hover:text-heading"
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <Users className="w-4 h-4" />
                Participants ({attendees.length})
              </div>
              {activeRightPanel === "attendees" && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
              )}
            </button>
          </div>

          {/* Panel Content */}
          <div className="flex-1 overflow-hidden">
            {activeRightPanel === "chat" ? (
              <ChatPanel
                messages={messages}
                currentUserId="host-1"
                onSendMessage={handleSendMessage}
                onUpvoteMessage={handleUpvoteMessage}
                onDeleteMessage={handleDeleteMessage}
                onPinMessage={handlePinMessage}
              />
            ) : (
              <AttendeesPanel
                attendees={attendees}
                isHost={true}
                onMuteAttendee={handleMuteAttendee}
                onStopCamera={handleStopCamera}
                onGrantCanvasEdit={handleGrantCanvasEdit}
                onPromoteAttendee={handlePromoteAttendee}
                onRemoveAttendee={handleRemoveAttendee}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
