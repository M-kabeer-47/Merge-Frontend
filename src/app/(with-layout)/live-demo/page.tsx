/**
 * Professional Live Session Page
 *
 * 65% video area, 35% chat with polished UI/UX
 */

"use client";

import React, { useState, useMemo } from "react";
import {
  Phone,
  Mic,
  MicOff,
  Video,
  VideoOff,
  MonitorUp,
  MonitorOff,
  Users,
  MessageSquare,
  Palette,
  FolderOpen,
  Settings,
  MoreVertical,
  UserX,
  Ban,
  Volume2,
  Crown,
  Shield,
} from "lucide-react";
import Avatar from "@/components/ui/Avatar";
import ChatPanel from "@/components/live-session/ChatPanel";
import CanvasStage from "@/components/live-session/CanvasStage";
import FilesPanel from "@/components/live-session/FilesPanel";
import Toast from "@/components/live-session/Toast";
import {
  mockAttendees,
  mockSession,
  mockChatMessages,
  mockFiles,
  mockCanvasElements,
} from "@/lib/constants/live-session-mock-data";
import type {
  ChatMessage,
  Attendee,
  CanvasElement,
  SessionFile,
} from "@/types/live-session";

export default function ProfessionalLiveSessionPage() {
  // State management
  const [micOn, setMicOn] = useState(true);
  const [cameraOn, setCameraOn] = useState(true);
  const [screenSharing, setScreenSharing] = useState(false);
  const [activeView, setActiveView] = useState<"video" | "canvas" | "files">(
    "video"
  );
  const [activeSidebar, setActiveSidebar] = useState<"chat" | "attendees">(
    "chat"
  );
  const [permissions, setPermissions] = useState(mockSession.permissions);
  const [showPermissionsPanel, setShowPermissionsPanel] = useState(false);
  const [attendees] = useState<Attendee[]>(mockAttendees);
  const [messages, setMessages] = useState<ChatMessage[]>(mockChatMessages);
  const [files] = useState<SessionFile[]>(mockFiles);
  const [canvasElements, setCanvasElements] =
    useState<CanvasElement[]>(mockCanvasElements);
  const [canvasLocked, setCanvasLocked] = useState(false);
  const [hoveredAttendee, setHoveredAttendee] = useState<string | null>(null);
  const [showAttendeeMenu, setShowAttendeeMenu] = useState<string | null>(null);
  const [toast, setToast] = useState<{
    type: "success" | "error" | "info" | "warning";
    message: string;
  } | null>(null);

  const showToast = (
    type: "success" | "error" | "info" | "warning",
    message: string
  ) => {
    setToast({ type, message });
  };

  // Find top voted message
  const topVotedMessage = useMemo(() => {
    return messages.reduce(
      (top, msg) => (msg.upvotes > (top?.upvotes || 0) ? msg : top),
      messages[0]
    );
  }, [messages]);

  // Actions
  const handleEndCall = () => {
    if (window.confirm("End session for all participants?")) {
      console.log("[Host] Ending session");
      showToast("success", "Session ended");
    }
  };

  const handleToggleMic = () => {
    setMicOn(!micOn);
    showToast("info", `Microphone ${!micOn ? "enabled" : "muted"}`);
  };

  const handleToggleCamera = () => {
    setCameraOn(!cameraOn);
    showToast("info", `Camera ${!cameraOn ? "enabled" : "disabled"}`);
  };

  const handleToggleScreenShare = () => {
    setScreenSharing(!screenSharing);
    showToast(
      "info",
      `Screen sharing ${!screenSharing ? "started" : "stopped"}`
    );
  };

  const handleMuteAttendee = (id: string, name: string) => {
    console.log(`[Host] Muting: ${name}`);
    showToast("info", `${name} muted`);
    setShowAttendeeMenu(null);
  };

  const handleRemoveAttendee = (id: string, name: string) => {
    if (window.confirm(`Remove ${name}?`)) {
      console.log(`[Host] Removing: ${name}`);
      showToast("warning", `${name} removed`);
      setShowAttendeeMenu(null);
    }
  };

  const handleBlockAttendee = (id: string, name: string) => {
    if (window.confirm(`Block ${name}?`)) {
      console.log(`[Host] Blocking: ${name}`);
      showToast("error", `${name} blocked`);
      setShowAttendeeMenu(null);
    }
  };

  const handleGrantCanvasEdit = (id: string, name: string) => {
    console.log(`[Host] Granting canvas edit: ${name}`);
    showToast("success", `${name} can edit canvas`);
    setShowAttendeeMenu(null);
  };

  const handlePromote = (id: string, name: string) => {
    console.log(`[Host] Promoting: ${name}`);
    showToast("success", `${name} promoted to co-host`);
    setShowAttendeeMenu(null);
  };

  const handleSendMessage = (content: string, askBot: boolean) => {
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

    if (askBot) {
      setTimeout(() => {
        const botReply = {
          id: `bot-${Date.now()}`,
          question: content,
          answer:
            "Simulated bot response. In production, this would be AI-generated.",
          content:
            "Simulated bot response. In production, this would be AI-generated.",
          timestamp: new Date(),
          helpful: null,
          sources: ["Course Material", "Lecture Notes"],
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
    setMessages((prev) =>
      prev.map((msg) =>
        msg.id === messageId
          ? {
              ...msg,
              upvotes: msg.upvotes + 1,
              upvotedBy: [...msg.upvotedBy, "host-1"],
            }
          : msg
      )
    );
  };

  const handleDeleteMessage = (messageId: string) => {
    setMessages((prev) => prev.filter((msg) => msg.id !== messageId));
    showToast("info", "Message deleted");
  };

  const handlePinMessage = (messageId: string) => {
    console.log(`[Chat] Pinning: ${messageId}`);
    showToast("info", "Message pinned");
  };

  const handleAddCanvasElement = (element: Omit<CanvasElement, "id">) => {
    setCanvasElements([
      ...canvasElements,
      { ...element, id: `canvas-${Date.now()}` },
    ]);
  };

  const handleUpdateCanvasElement = (
    id: string,
    updates: Partial<CanvasElement>
  ) => {
    setCanvasElements((prev) =>
      prev.map((el) => (el.id === id ? { ...el, ...updates } : el))
    );
  };

  const handleDeleteCanvasElement = (id: string) => {
    setCanvasElements((prev) => prev.filter((el) => el.id !== id));
  };

  const handleTogglePermission = (permission: keyof typeof permissions) => {
    setPermissions({ ...permissions, [permission]: !permissions[permission] });
  };

  const hostAttendee = attendees.find((a) => a.role === "host");
  const participantAttendees = attendees.filter((a) => a.role !== "host");

  return (
    <div className="h-screen flex flex-col bg-background">
      {toast && (
        <div className="fixed top-4 right-4 z-50">
          <Toast
            type={toast.type}
            message={toast.message}
            onClose={() => setToast(null)}
          />
        </div>
      )}

      <div className="flex-1 flex overflow-hidden">
        {/* Video Area (65%) */}
        <div style={{ width: "65%" }} className="flex flex-col">
          <div className="flex-1 overflow-hidden bg-background p-4">
            {activeView === "video" ? (
              <div className="h-full flex flex-col gap-3">
                {/* Host Video (100% width, 70% height) */}
                <div
                  className="relative bg-gradient-to-br from-primary/5 to-secondary/5 rounded-xl overflow-hidden border-2 border-light-border"
                  style={{ height: "70%" }}
                >
                  {hostAttendee && (
                    <>
                      {hostAttendee.webcamOn ? (
                        <div className="w-full h-full bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center">
                          <div className="text-center text-para">
                            <Video className="w-20 h-20 mx-auto mb-4 text-primary opacity-40" />
                            <p className="text-2xl font-bold text-heading">
                              {hostAttendee.name}
                            </p>
                            <p className="text-sm text-para-muted mt-1">Host</p>
                          </div>
                        </div>
                      ) : (
                        <div className="w-full h-full bg-secondary/5 flex items-center justify-center">
                          <Avatar
                            profileImage={hostAttendee.avatar}
                            size="lg"
                          />
                        </div>
                      )}

                      <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                        <div className="flex items-center gap-3 bg-white/95 backdrop-blur-sm px-4 py-2.5 rounded-xl shadow-lg border border-light-border">
                          <Crown className="w-4 h-4 text-accent" />
                          <span className="text-heading font-semibold">
                            {hostAttendee.name}
                          </span>
                          <span className="text-xs text-para-muted">(You)</span>
                          <div className="flex items-center gap-2 ml-3 pl-3 border-l border-light-border">
                            {hostAttendee.micOn ? (
                              <Mic className="w-4 h-4 text-primary" />
                            ) : (
                              <MicOff className="w-4 h-4 text-destructive" />
                            )}
                            {hostAttendee.webcamOn ? (
                              <Video className="w-4 h-4 text-primary" />
                            ) : (
                              <VideoOff className="w-4 h-4 text-destructive" />
                            )}
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </div>

                {/* Participants Grid */}
                <div className="flex-1 overflow-x-auto">
                  <div className="grid grid-cols-4 gap-3 h-full">
                    {participantAttendees.slice(0, 8).map((attendee) => (
                      <div
                        key={attendee.id}
                        className="relative bg-secondary/5 rounded-lg overflow-hidden border border-light-border group cursor-pointer hover:border-primary/30 transition-all"
                        onMouseEnter={() => setHoveredAttendee(attendee.id)}
                        onMouseLeave={() => setHoveredAttendee(null)}
                      >
                        {attendee.webcamOn ? (
                          <div className="w-full h-full bg-secondary/5 flex items-center justify-center">
                            <Video className="w-8 h-8 text-primary opacity-30" />
                          </div>
                        ) : (
                          <div className="w-full h-full bg-secondary/5 flex items-center justify-center">
                            <Avatar profileImage={attendee.avatar} size="lg" />
                          </div>
                        )}

                        <div className="absolute bottom-0 left-0 right-0 bg-primary/5 p-2">
                          <p className="text-heading text-xs font-medium truncate">
                            {attendee.name}
                          </p>
                          <div className="flex items-center gap-1.5 mt-1">
                            {attendee.micOn ? (
                              <Mic className="w-3 h-3 text-primary" />
                            ) : (
                              <MicOff className="w-3 h-3 text-para-muted" />
                            )}
                            {attendee.speakerActive && (
                              <div className="flex items-center gap-1">
                                <Volume2 className="w-3 h-3 text-primary animate-pulse" />
                                <span className="text-[10px] text-primary font-medium">
                                  Speaking
                                </span>
                              </div>
                            )}
                          </div>
                        </div>

                        {(hoveredAttendee === attendee.id ||
                          showAttendeeMenu === attendee.id) && (
                          <div className="absolute top-2 right-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setShowAttendeeMenu(
                                  showAttendeeMenu === attendee.id
                                    ? null
                                    : attendee.id
                                );
                              }}
                              className="p-1.5 bg-white/95 hover:bg-white backdrop-blur-sm rounded-lg transition-all shadow-md border border-light-border"
                            >
                              <MoreVertical className="w-4 h-4 text-heading" />
                            </button>

                            {showAttendeeMenu === attendee.id && (
                              <>
                                <div
                                  className="fixed inset-0 z-10"
                                  onClick={() => setShowAttendeeMenu(null)}
                                />
                                <div className="absolute right-0 top-full mt-1 z-20 bg-main-background border border-light-border rounded-lg shadow-xl py-1 min-w-[180px]">
                                  <button
                                    onClick={() =>
                                      handleMuteAttendee(
                                        attendee.id,
                                        attendee.name
                                      )
                                    }
                                    className="w-full px-3 py-2 text-left text-sm text-para hover:bg-secondary/10 flex items-center gap-2 transition-colors"
                                  >
                                    <MicOff className="w-4 h-4" />
                                    Mute
                                  </button>
                                  <button
                                    onClick={() =>
                                      handleGrantCanvasEdit(
                                        attendee.id,
                                        attendee.name
                                      )
                                    }
                                    className="w-full px-3 py-2 text-left text-sm text-para hover:bg-secondary/10 flex items-center gap-2 transition-colors"
                                  >
                                    <Palette className="w-4 h-4" />
                                    Grant Canvas Edit
                                  </button>
                                  <button
                                    onClick={() =>
                                      handlePromote(attendee.id, attendee.name)
                                    }
                                    className="w-full px-3 py-2 text-left text-sm text-para hover:bg-secondary/10 flex items-center gap-2 transition-colors"
                                  >
                                    <Shield className="w-4 h-4" />
                                    Promote to Co-Host
                                  </button>
                                  <div className="h-px bg-light-border my-1" />
                                  <button
                                    onClick={() =>
                                      handleRemoveAttendee(
                                        attendee.id,
                                        attendee.name
                                      )
                                    }
                                    className="w-full px-3 py-2 text-left text-sm text-destructive hover:bg-destructive/10 flex items-center gap-2 transition-colors"
                                  >
                                    <UserX className="w-4 h-4" />
                                    Remove
                                  </button>
                                  <button
                                    onClick={() =>
                                      handleBlockAttendee(
                                        attendee.id,
                                        attendee.name
                                      )
                                    }
                                    className="w-full px-3 py-2 text-left text-sm text-destructive hover:bg-destructive/10 flex items-center gap-2 transition-colors"
                                  >
                                    <Ban className="w-4 h-4" />
                                    Block
                                  </button>
                                </div>
                              </>
                            )}
                          </div>
                        )}

                        {attendee.raiseHand && (
                          <div className="absolute top-2 left-2 px-2 py-1 bg-accent/90 rounded-lg shadow-md">
                            <span className="text-xs text-white font-medium">
                              ✋ Raised
                            </span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : activeView === "canvas" ? (
              <CanvasStage
                elements={canvasElements}
                isLocked={canvasLocked}
                onAddElement={handleAddCanvasElement}
                onUpdateElement={handleUpdateCanvasElement}
                onDeleteElement={handleDeleteCanvasElement}
                onToggleLock={() => setCanvasLocked(!canvasLocked)}
                onUndo={() => console.log("[Canvas] Undo")}
                onRedo={() => console.log("[Canvas] Redo")}
                onClear={() => setCanvasElements([])}
                onExport={() => showToast("success", "Canvas exported")}
              />
            ) : (
              <FilesPanel
                files={files}
                onDeleteFile={(id) => console.log(`[Files] Delete: ${id}`)}
              />
            )}
          </div>

          {/* Toolbar */}
          <div className="bg-main-background border-t border-light-border px-6 py-4 shadow-lg">
            <div className="flex items-center justify-between max-w-6xl mx-auto">
              <button
                onClick={handleEndCall}
                className="group relative px-6 py-3 bg-destructive hover:bg-destructive/90 text-white rounded-full font-medium transition-all flex items-center gap-2 shadow-md hover:shadow-lg"
              >
                <Phone className="w-5 h-5" />
                End Call
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap shadow-lg">
                  End session for everyone
                  <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-gray-900" />
                </div>
              </button>

              <div className="flex items-center gap-3">
                <button
                  onClick={handleToggleMic}
                  className={`group relative p-4 rounded-full transition-all shadow-md hover:shadow-lg ${
                    micOn
                      ? "bg-white border-2 border-light-border hover:border-primary/30 text-heading"
                      : "bg-destructive hover:bg-destructive/90 text-white"
                  }`}
                >
                  {micOn ? (
                    <Mic className="w-5 h-5" />
                  ) : (
                    <MicOff className="w-5 h-5" />
                  )}
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap shadow-lg">
                    {micOn ? "Mute (M)" : "Unmute (M)"}
                    <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-gray-900" />
                  </div>
                </button>

                <button
                  onClick={handleToggleCamera}
                  className={`group relative p-4 rounded-full transition-all shadow-md hover:shadow-lg ${
                    cameraOn
                      ? "bg-white border-2 border-light-border hover:border-primary/30 text-heading"
                      : "bg-destructive hover:bg-destructive/90 text-white"
                  }`}
                >
                  {cameraOn ? (
                    <Video className="w-5 h-5" />
                  ) : (
                    <VideoOff className="w-5 h-5" />
                  )}
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap shadow-lg">
                    {cameraOn ? "Stop camera (C)" : "Start camera (C)"}
                    <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-gray-900" />
                  </div>
                </button>

                <button
                  onClick={handleToggleScreenShare}
                  className={`group relative p-4 rounded-full transition-all shadow-md hover:shadow-lg ${
                    screenSharing
                      ? "bg-primary hover:bg-primary/90 text-white"
                      : "bg-white border-2 border-light-border hover:border-primary/30 text-heading"
                  }`}
                >
                  {screenSharing ? (
                    <MonitorOff className="w-5 h-5" />
                  ) : (
                    <MonitorUp className="w-5 h-5" />
                  )}
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap shadow-lg">
                    {screenSharing ? "Stop sharing (S)" : "Share screen (S)"}
                    <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-gray-900" />
                  </div>
                </button>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setActiveView("video")}
                  className={`group relative p-4 rounded-full transition-all shadow-md hover:shadow-lg ${
                    activeView === "video"
                      ? "bg-primary text-white"
                      : "bg-white border-2 border-light-border hover:border-primary/30 text-heading"
                  }`}
                >
                  <Video className="w-5 h-5" />
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap shadow-lg">
                    Video view
                    <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-gray-900" />
                  </div>
                </button>

                <button
                  onClick={() => setActiveView("canvas")}
                  className={`group relative p-4 rounded-full transition-all shadow-md hover:shadow-lg ${
                    activeView === "canvas"
                      ? "bg-primary text-white"
                      : "bg-white border-2 border-light-border hover:border-primary/30 text-heading"
                  }`}
                >
                  <Palette className="w-5 h-5" />
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap shadow-lg">
                    Whiteboard
                    <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-gray-900" />
                  </div>
                </button>

                <button
                  onClick={() => setActiveView("files")}
                  className={`group relative p-4 rounded-full transition-all shadow-md hover:shadow-lg ${
                    activeView === "files"
                      ? "bg-primary text-white"
                      : "bg-white border-2 border-light-border hover:border-primary/30 text-heading"
                  }`}
                >
                  <FolderOpen className="w-5 h-5" />
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap shadow-lg">
                    Session files
                    <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-gray-900" />
                  </div>
                </button>

                <div className="w-px h-8 bg-light-border mx-1" />

                <div className="relative">
                  <button
                    onClick={() =>
                      setShowPermissionsPanel(!showPermissionsPanel)
                    }
                    className={`group relative p-4 rounded-full transition-all shadow-md hover:shadow-lg ${
                      showPermissionsPanel
                        ? "bg-primary text-white"
                        : "bg-white border-2 border-light-border hover:border-primary/30 text-heading"
                    }`}
                  >
                    <Settings className="w-5 h-5" />
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap shadow-lg z-50">
                      Session permissions
                      <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-gray-900" />
                    </div>
                  </button>
                  {showPermissionsPanel && (
                    <>
                      <div
                        className="fixed inset-0 z-10"
                        onClick={() => setShowPermissionsPanel(false)}
                      />
                      <div className="absolute bottom-full right-0 mb-2 z-20 bg-white border-2 border-light-border rounded-xl shadow-2xl p-5 min-w-[300px]">
                        <h3 className="text-sm font-bold text-heading mb-4 flex items-center gap-2">
                          <Settings className="w-4 h-4 text-primary" />
                          Session Permissions
                        </h3>
                        <div className="space-y-3">
                          {Object.entries(permissions).map(([key, value]) => (
                            <label
                              key={key}
                              className="flex items-center justify-between cursor-pointer group/perm"
                            >
                              <span className="text-sm text-para group-hover/perm:text-heading transition-colors font-medium">
                                {key
                                  .replace(/([A-Z])/g, " $1")
                                  .replace(/^./, (str) => str.toUpperCase())}
                              </span>
                              <div className="relative">
                                <input
                                  type="checkbox"
                                  checked={value}
                                  onChange={() =>
                                    handleTogglePermission(
                                      key as keyof typeof permissions
                                    )
                                  }
                                  className="sr-only peer"
                                />
                                <div className="w-11 h-6 bg-secondary/20 rounded-full peer-checked:bg-primary transition-colors shadow-inner" />
                                <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-5 shadow-md" />
                              </div>
                            </label>
                          ))}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Chat Sidebar (35%) */}
        <div
          style={{ width: "35%" }}
          className="border-l-2 border-light-border bg-white flex flex-col shadow-xl"
        >
          <div className="flex bg-gradient-to-r from-primary/5 to-secondary/5 border-b-2 border-light-border">
            <button
              onClick={() => setActiveSidebar("chat")}
              className={`flex-1 px-4 py-4 text-sm font-semibold transition-all flex items-center justify-center gap-2 relative ${
                activeSidebar === "chat"
                  ? "text-primary"
                  : "text-para hover:text-heading"
              }`}
            >
              <MessageSquare className="w-4 h-4" />
              Chat
              <span
                className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                  activeSidebar === "chat"
                    ? "bg-primary text-white"
                    : "bg-secondary/10 text-para"
                }`}
              >
                {messages.length}
              </span>
              {activeSidebar === "chat" && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-primary rounded-t-full" />
              )}
            </button>
            <button
              onClick={() => setActiveSidebar("attendees")}
              className={`flex-1 px-4 py-4 text-sm font-semibold transition-all flex items-center justify-center gap-2 relative ${
                activeSidebar === "attendees"
                  ? "text-primary"
                  : "text-para hover:text-heading"
              }`}
            >
              <Users className="w-4 h-4" />
              Attendees
              <span
                className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                  activeSidebar === "attendees"
                    ? "bg-primary text-white"
                    : "bg-secondary/10 text-para"
                }`}
              >
                {attendees.length}
              </span>
              {activeSidebar === "attendees" && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-primary rounded-t-full" />
              )}
            </button>
          </div>

          <div className="flex-1 overflow-hidden">
            {activeSidebar === "chat" ? (
              <ChatPanel
                messages={messages}
                currentUserId="host-1"
                onSendMessage={handleSendMessage}
                onUpvoteMessage={handleUpvoteMessage}
                onDeleteMessage={handleDeleteMessage}
                onPinMessage={handlePinMessage}
                topVotedMessageId={topVotedMessage?.id}
              />
            ) : (
              <div className="h-full overflow-y-auto p-3 space-y-2">
                {attendees.map((attendee) => (
                  <div
                    key={attendee.id}
                    className="p-3 bg-gradient-to-r from-primary/5 to-secondary/5 hover:from-primary/10 hover:to-secondary/10 rounded-xl border border-light-border transition-all group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <Avatar profileImage={attendee.avatar} size="lg" />
                        {attendee.role === "host" && (
                          <div className="absolute -top-1 -right-1 w-5 h-5 bg-accent rounded-full flex items-center justify-center shadow-md">
                            <Crown className="w-3 h-3 text-white" />
                          </div>
                        )}
                        {attendee.role === "co-host" && (
                          <div className="absolute -top-1 -right-1 w-5 h-5 bg-secondary rounded-full flex items-center justify-center shadow-md">
                            <Shield className="w-3 h-3 text-white" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-heading truncate group-hover:text-primary transition-colors">
                          {attendee.name}
                        </p>
                        <div className="flex items-center gap-2 mt-1.5">
                          <div
                            className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${
                              attendee.micOn
                                ? "bg-primary/10 text-primary"
                                : "bg-gray-100 text-para-muted"
                            }`}
                          >
                            {attendee.micOn ? (
                              <Mic className="w-3 h-3" />
                            ) : (
                              <MicOff className="w-3 h-3" />
                            )}
                          </div>
                          <div
                            className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${
                              attendee.webcamOn
                                ? "bg-primary/10 text-primary"
                                : "bg-gray-100 text-para-muted"
                            }`}
                          >
                            {attendee.webcamOn ? (
                              <Video className="w-3 h-3" />
                            ) : (
                              <VideoOff className="w-3 h-3" />
                            )}
                          </div>
                          {attendee.raiseHand && (
                            <span className="text-xs bg-accent text-white px-2 py-0.5 rounded-full font-bold shadow-sm animate-pulse">
                              ✋
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
