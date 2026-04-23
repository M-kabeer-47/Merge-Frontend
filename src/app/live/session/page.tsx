/**
 * Live Session Page - Google Meet Style UI
 *
 * Standalone page (outside layout) for true fullscreen experience.
 * Clean, minimal interface with floating controls.
 */

"use client";

import React, { useState, useEffect, useCallback, useMemo, useRef, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  MonitorUp,
  MoreVertical,
  Users,
  MessageSquare,
  X,
  LogOut,
  Maximize2,
  Minimize2,
  Presentation,
  Hand,
  Captions,
  Phone,
  Info,
  Clock,
  Grid3X3,
  LayoutGrid,
  Settings,
  UserCog,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Toast from "@/components/live-session/Toast";
import AttendeesPanel from "@/components/live-session/AttendeesPanel";
import ChatPanel from "@/components/live-session/ChatPanel";
import type { Attendee } from "@/types/live-session";
import { LiveKitRoom } from "@livekit/components-react";
import "@livekit/components-styles";
import useLiveKitToken from "@/hooks/live-sessions/use-livekit-token";
import useGetSession from "@/hooks/live-sessions/use-get-session";
import LiveKitStage from "@/components/live-session/LiveKitStage";
import LiveKitControlsBridge from "@/components/live-session/LiveKitControlsBridge";
import AttendeesGridView from "@/components/live-session/AttendeesGridView";
import PermissionEnforcer, { type PermissionKey } from "@/components/live-session/PermissionEnforcer";
import HandRaiseSync from "@/components/live-session/HandRaiseSync";
import { useLiveQna } from "@/hooks/live-qna/use-live-qna";

function decodeLivekitTokenIdentity(token: string): string | null {
  try {
    const [, payload = ""] = token.split(".");
    if (!payload) return null;
    const normalized = payload.replace(/-/g, "+").replace(/_/g, "/");
    const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, "=");
    const decoded = atob(padded);
    const parsed = JSON.parse(decoded);
    return parsed?.video?.identity ?? parsed?.sub ?? null;
  } catch (error) {
    console.error("Failed to decode LiveKit token", error);
    return null;
  }
}

// ═══════════════════════════════════════════════════════════════════
// SESSION DURATION HOOK
// ═══════════════════════════════════════════════════════════════════

function useSessionDuration(startedAt: string | undefined) {
  const [duration, setDuration] = useState<string>("00:00");

  useEffect(() => {
    if (!startedAt) {
      setDuration("00:00");
      return;
    }

    const startTime = new Date(startedAt).getTime();

    const updateDuration = () => {
      const now = Date.now();
      const diff = now - startTime;
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      if (hours > 0) {
        setDuration(
          `${hours.toString().padStart(2, "0")}:${minutes
            .toString()
            .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
        );
      } else {
        setDuration(
          `${minutes.toString().padStart(2, "0")}:${seconds
            .toString()
            .padStart(2, "0")}`
        );
      }
    };

    updateDuration();
    const interval = setInterval(updateDuration, 1000);

    return () => clearInterval(interval);
  }, [startedAt]);

  return duration;
}

// ═══════════════════════════════════════════════════════════════════
// CONTROL BUTTON COMPONENT
// ═══════════════════════════════════════════════════════════════════

interface ControlButtonProps {
  onClick: () => void;
  active?: boolean;
  activeColor?: string;
  icon: React.ReactNode;
  label?: string;
  title: string;
  danger?: boolean;
  disabled?: boolean;
}

function ControlButton({
  onClick,
  active = true,
  activeColor = "bg-[#3c4043] hover:bg-[#494c50]",
  icon,
  label,
  title,
  danger = false,
  disabled = false,
}: ControlButtonProps) {
  return (
    <button
      onClick={disabled ? undefined : onClick}
      title={title}
      disabled={disabled}
      className={`
        flex flex-col items-center gap-1 group
        transition-all duration-200
        ${disabled ? "cursor-not-allowed" : ""}
      `}
    >
      <div
        className={`
          w-12 h-12 rounded-full flex items-center justify-center
          transition-all duration-200
          ${disabled
            ? "bg-[#ea4335]/70 ring-2 ring-[#ea4335]/40"
            : danger
              ? "bg-[#ea4335] hover:bg-[#d33b28]"
              : active
                ? activeColor
                : "bg-[#ea4335] hover:bg-[#d33b28]"
          }
        `}
      >
        {icon}
      </div>
      {label && (
        <span className="text-[11px] text-white/70 opacity-0 group-hover:opacity-100 transition-opacity absolute -bottom-5 whitespace-nowrap">
          {label}
        </span>
      )}
    </button>
  );
}

// ═══════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════

function LiveSessionPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const roomId = searchParams.get("roomId") || "";
  const sessionId = searchParams.get("sessionId") || "";

  // Fetch session data
  const { data: sessionData } = useGetSession({
    sessionId,
    roomId,
    enabled: !!sessionId && !!roomId,
  });

  const sessionDuration = useSessionDuration(sessionData?.startedAt);

  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  // LiveKit
  const { getToken, isFetchingToken } = useLiveKitToken();
  const [livekitToken, setLivekitToken] = useState<string>("");
  const currentUserProfile = useMemo(() => {
    if (!currentUserId) return null;
    if (sessionData?.host && sessionData.host.id === currentUserId) {
      return sessionData.host;
    }
    const attendeeMatch = sessionData?.attendees?.find(
      (attendee) => attendee.user?.id === currentUserId,
    )?.user;
    if (attendeeMatch) {
      return attendeeMatch;
    }
    return null;
  }, [currentUserId, sessionData?.attendees, sessionData?.host]);

  const isHost = useMemo(() => {
    if (!currentUserId || !sessionData?.host?.id) return false;
    return sessionData.host.id === currentUserId;
  }, [currentUserId, sessionData?.host?.id]);

  useEffect(() => {
    if (sessionId && roomId) {
      getToken({ sessionId, roomId })
        .then((data) => setLivekitToken(data.token))
        .catch(() => {});
    }
  }, [sessionId, roomId, getToken]);

  useEffect(() => {
    if (!livekitToken) return;
    const identity = decodeLivekitTokenIdentity(livekitToken);
    if (identity) {
      setCurrentUserId(identity);
    }
  }, [livekitToken]);

  // Media controls
  const [micOn, setMicOn] = useState(false);
  const [cameraOn, setCameraOn] = useState(false);
  const [screenSharing, setScreenSharing] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showCaptions, setShowCaptions] = useState(false);
  const [raisedHand, setRaisedHand] = useState(false);

  const initialMediaApplied = useRef(false);

  useEffect(() => {
    if (initialMediaApplied.current) return;
    if (!currentUserId || !sessionData) return;

    const hostId = sessionData.host?.id;
    const userIsHost = hostId ? hostId === currentUserId : false;

    setMicOn(userIsHost);
    setCameraOn(false);
    initialMediaApplied.current = true;
  }, [currentUserId, sessionData]);

  // Panels
  const [rightPanel, setRightPanel] = useState<"chat" | "people" | null>(null);
  const [showMoreMenu, setShowMoreMenu] = useState(false);

  // View mode: "stage" (speaker view) or "grid" (all participants)
  const [viewMode, setViewMode] = useState<"stage" | "grid">("stage");

  // Permissions management (host view)
  interface AttendeePermission {
    canMic: boolean;
    canCamera: boolean;
    canScreenShare: boolean;
    canChat: boolean;
  }
  const [attendeePermissions, setAttendeePermissions] = useState<Record<string, AttendeePermission>>({});

  // My own permissions (set by host via data channel). Allowed by default.
  const [myPermissions, setMyPermissions] = useState<Record<PermissionKey, boolean>>({
    canMic: true,
    canCamera: true,
    canScreenShare: true,
    canChat: true,
  });

  // Raised hands by identity
  const [raisedHands, setRaisedHands] = useState<Record<string, boolean>>({});

  // Data
  const [toast, setToast] = useState<{ type: "success" | "error" | "info" | "warning"; message: string } | null>(null);

  // Fullscreen handler
  const toggleFullscreen = useCallback(async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
        setIsFullscreen(true);
      } else {
        await document.exitFullscreen();
        setIsFullscreen(false);
      }
    } catch {
      // Fallback: just toggle state for UI
      setIsFullscreen(!isFullscreen);
    }
  }, [isFullscreen]);

  // Listen for fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  const showToastMsg = useCallback((type: "success" | "error" | "info" | "warning", message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3000);
  }, []);

  const attendees: Attendee[] = useMemo(() => {
    if (!sessionData?.attendees) return [];
    return sessionData.attendees
      .filter((a) => !a.leftAt)
      .map((a) => ({
        id: a.user?.id || a.id,
        name: a.user ? `${a.user.firstName} ${a.user.lastName}` : "Unknown",
        avatar: a.user?.image,
        role: sessionData.host?.id === a.user?.id ? "host" : "participant",
        webcamOn: true,
        micOn: true,
        speakerActive: false,
        raiseHand: false,
        networkQuality: "good" as const,
        canEdit: sessionData.host?.id === a.user?.id,
        screenSharing: false,
        joinedAt: new Date(a.joinedAt),
      }));
  }, [sessionData]);

  const handleLeave = () => router.push(`/rooms/${roomId}/sessions`);

  const toggleMic = () => {
    if (!myPermissions.canMic) {
      showToastMsg("warning", "Microphone has been disabled by the host");
      return;
    }
    setMicOn((p) => { showToastMsg("info", !p ? "Microphone on" : "Microphone off"); return !p; });
  };
  const toggleCamera = () => {
    if (!myPermissions.canCamera) {
      showToastMsg("warning", "Camera has been disabled by the host");
      return;
    }
    setCameraOn((p) => { showToastMsg("info", !p ? "Camera on" : "Camera off"); return !p; });
  };
  const toggleScreenShare = () => {
    if (!myPermissions.canScreenShare) {
      showToastMsg("warning", "Screen share has been disabled by the host");
      return;
    }
    setScreenSharing((p) => { showToastMsg("info", !p ? "Screen sharing started" : "Screen sharing stopped"); return !p; });
  };

  const {
    questions,
    sendQuestion,
    toggleVote,
    removeQuestion,
    markAnswered,
    markOpen,
    topQuestionId,
    isLoading: isLoadingQna,
  } = useLiveQna({
    roomId,
    sessionId,
    currentUserId,
    currentUserProfile,
  });

  const handleSendQuestion = (content: string, askBot: boolean) => {
    if (!content.trim()) return;
    sendQuestion(content.trim());
    if (askBot) {
      showToastMsg("info", "Bot will process this question soon");
    }
  };

  const livekitUrl = process.env.NEXT_PUBLIC_LIVEKIT_URL || "";

  const handlePermissionChange = useCallback((permission: PermissionKey, allowed: boolean) => {
    setMyPermissions((prev) => ({ ...prev, [permission]: allowed }));
  }, []);

  const handleHandRaiseChange = useCallback((identity: string, raised: boolean) => {
    setRaisedHands((prev) => ({ ...prev, [identity]: raised }));
  }, []);

  const handleMicChange = useCallback((v: boolean) => setMicOn(v), []);
  const handleCameraChange = useCallback((v: boolean) => setCameraOn(v), []);
  const handleScreenShareChange = useCallback((v: boolean) => setScreenSharing(v), []);

  // Permissions management functions
  const handleUpdatePermission = useCallback(
    (participantId: string, permission: keyof AttendeePermission, value: boolean) => {
      if (!isHost) return;

      setAttendeePermissions((prev) => ({
        ...prev,
        [participantId]: {
          ...prev[participantId],
          [permission]: value,
        },
      }));
      showToastMsg("info", `Permission updated`);
    },
    [isHost, showToastMsg]
  );

  const handleAllowAll = useCallback(
    (permission: keyof AttendeePermission) => {
      if (!isHost) return;

      setAttendeePermissions((prev) => {
        const updated: Record<string, AttendeePermission> = { ...prev };
        attendees.forEach((attendee) => {
          if (attendee.role !== "host") {
            updated[attendee.id] = {
              ...updated[attendee.id],
              [permission]: true,
            };
          }
        });
        return updated;
      });
      showToastMsg("success", `All attendees can now ${permission.replace("can", "").toLowerCase()}`);
    },
    [attendees, isHost, showToastMsg]
  );

  const handleRevokeAll = useCallback(
    (permission: keyof AttendeePermission) => {
      if (!isHost) return;

      setAttendeePermissions((prev) => {
        const updated: Record<string, AttendeePermission> = { ...prev };
        attendees.forEach((attendee) => {
          if (attendee.role !== "host") {
            updated[attendee.id] = {
              ...updated[attendee.id],
              [permission]: false,
            };
          }
        });
        return updated;
      });
      showToastMsg("warning", `All attendees ${permission.replace("can", "").toLowerCase()} permission revoked`);
    },
    [attendees, isHost, showToastMsg]
  );

  // ═══════════════════════════════════════════════════════════════════
  // RENDER CONTENT
  // ═══════════════════════════════════════════════════════════════════

  const content = (
    <div className="h-screen w-screen bg-[#202124] flex flex-col overflow-hidden relative">
      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -20, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: -20, x: "-50%" }}
            className="fixed top-4 left-1/2 z-[70]"
          >
            <div className="bg-[#32353a] text-white px-4 py-2 rounded-lg shadow-lg text-sm">
              {toast.message}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Loading Overlay */}
      {isFetchingToken && (
        <div className="absolute inset-0 z-50 bg-[#202124] flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <div className="w-10 h-10 border-2 border-white/20 border-t-white rounded-full animate-spin" />
            <span className="text-white/70 text-sm">Joining...</span>
          </div>
        </div>
      )}

      {/* Top Bar - Google Meet Style */}
      {!isFullscreen && (
        <div className="h-14 flex items-center justify-between px-4 bg-[#202124] shrink-0">
          {/* Left - Meeting Info */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-[#3c4043] rounded-lg px-3 py-1.5">
              <Info className="w-4 h-4 text-white/70" />
              <span className="text-white text-sm font-medium truncate max-w-[200px] md:max-w-[400px]">
                {sessionData?.title || "Meeting"}
              </span>
            </div>
            <div className="hidden md:flex items-center gap-1 text-white/60 text-sm">
              <Clock className="w-3.5 h-3.5" />
              <span>{sessionDuration}</span>
            </div>
          </div>

          {/* Right - Top Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setRightPanel(rightPanel === "people" ? null : "people")}
              className={`
                w-10 h-10 rounded-full flex items-center justify-center transition-colors
                ${rightPanel === "people" ? "bg-white/20" : "hover:bg-white/10"}
              `}
              title="Show everyone"
            >
              <Users className="w-5 h-5 text-white" />
            </button>
            <button
              onClick={() => setRightPanel(rightPanel === "chat" ? null : "chat")}
              className={`
                w-10 h-10 rounded-full flex items-center justify-center transition-colors relative
                ${rightPanel === "chat" ? "bg-white/20" : "hover:bg-white/10"}
              `}
              title="Chat with everyone"
            >
              <MessageSquare className="w-5 h-5 text-white" />
            </button>
            <div className="w-px h-6 bg-white/20 mx-1" />
            <button
              onClick={toggleFullscreen}
              className="w-10 h-10 rounded-full hover:bg-white/10 flex items-center justify-center transition-colors"
              title={isFullscreen ? "Exit fullscreen" : "Fullscreen"}
            >
              {isFullscreen ? (
                <Minimize2 className="w-5 h-5 text-white" />
              ) : (
                <Maximize2 className="w-5 h-5 text-white" />
              )}
            </button>
            <div className="w-px h-6 bg-white/20 mx-1" />
            <button
              onClick={() => setViewMode(viewMode === "stage" ? "grid" : "stage")}
              className={`
                w-10 h-10 rounded-full flex items-center justify-center transition-colors
                ${viewMode === "grid" ? "bg-white/20" : "hover:bg-white/10"}
              `}
              title={viewMode === "stage" ? "Switch to grid view" : "Switch to stage view"}
            >
              {viewMode === "stage" ? (
                <Grid3X3 className="w-5 h-5 text-white" />
              ) : (
                <LayoutGrid className="w-5 h-5 text-white" />
              )}
            </button>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Center - Video Grid */}
        <div className="flex-1 relative">
          {/* Video Stage - Stage or Grid View */}
          <div className="absolute inset-0">
            {livekitToken ? (
              <>
                <LiveKitControlsBridge
                  micOn={micOn}
                  cameraOn={cameraOn}
                  screenSharing={screenSharing}
                  onMicChange={handleMicChange}
                  onCameraChange={handleCameraChange}
                  onScreenShareChange={handleScreenShareChange}
                />
                {viewMode === "stage" ? (
                  <LiveKitStage
                    sessionTitle={sessionData?.title || "Meeting"}
                    screenSharing={screenSharing}
                    raisedHands={raisedHands}
                  />
                ) : (
                  <AttendeesGridView
                    isHost={isHost}
                    permissions={attendeePermissions}
                    onUpdatePermission={handleUpdatePermission}
                    onAllowAll={handleAllowAll}
                    onRevokeAll={handleRevokeAll}
                    raisedHands={raisedHands}
                  />
                )}
              </>
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <div className="text-center">
                  <div className="w-24 h-24 rounded-full bg-[#3c4043] flex items-center justify-center mx-auto mb-4">
                    <Users className="w-12 h-12 text-white/50" />
                  </div>
                  <p className="text-white/60">Waiting to join...</p>
                </div>
              </div>
            )}
          </div>

          {/* Bottom Floating Controls - Google Meet Style */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-40">
            <div className="bg-[#202124]/80 backdrop-blur-md rounded-full px-4 py-2 flex items-center gap-2 border border-white/10">
              {/* Mic */}
              <ControlButton
                onClick={toggleMic}
                active={micOn && myPermissions.canMic}
                disabled={!myPermissions.canMic}
                icon={micOn ? <Mic className="w-5 h-5 text-white" /> : <MicOff className="w-5 h-5 text-white" />}
                title={myPermissions.canMic ? (micOn ? "Turn off microphone" : "Turn on microphone") : "Microphone disabled by host"}
              />

              {/* Camera */}
              <ControlButton
                onClick={toggleCamera}
                active={cameraOn && myPermissions.canCamera}
                disabled={!myPermissions.canCamera}
                icon={cameraOn ? <Video className="w-5 h-5 text-white" /> : <VideoOff className="w-5 h-5 text-white" />}
                title={myPermissions.canCamera ? (cameraOn ? "Turn off camera" : "Turn on camera") : "Camera disabled by host"}
              />

              {/* Captions */}
              <ControlButton
                onClick={() => setShowCaptions(!showCaptions)}
                active={showCaptions}
                activeColor={showCaptions ? "bg-[#8ab4f8]" : "bg-[#3c4043] hover:bg-[#494c50]"}
                icon={<Captions className="w-5 h-5 text-white" />}
                title="Turn on captions"
              />

              {/* Raise Hand */}
              <ControlButton
                onClick={() => setRaisedHand((p) => !p)}
                active={!raisedHand}
                activeColor={raisedHand ? "bg-[#f9ab00]" : "bg-[#3c4043] hover:bg-[#494c50]"}
                icon={<Hand className={`w-5 h-5 ${raisedHand ? "text-white" : "text-white"}`} />}
                title={raisedHand ? "Lower hand" : "Raise hand"}
              />

              {/* Screen Share */}
              <ControlButton
                onClick={toggleScreenShare}
                active={!screenSharing}
                activeColor={screenSharing ? "bg-[#1a73e8]" : "bg-[#3c4043] hover:bg-[#494c50]"}
                icon={<Presentation className="w-5 h-5 text-white" />}
                title="Present now"
              />

              {/* More Options */}
              <div className="relative">
                <ControlButton
                  onClick={() => setShowMoreMenu(!showMoreMenu)}
                  active={true}
                  icon={<MoreVertical className="w-5 h-5 text-white" />}
                  title="More options"
                />
                {showMoreMenu && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setShowMoreMenu(false)} />
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-[#3c4043] rounded-lg shadow-xl py-2 min-w-[200px] z-50">
                      <button className="w-full px-4 py-2 text-left text-white hover:bg-white/10 text-sm">
                        Settings
                      </button>
                      <button className="w-full px-4 py-2 text-left text-white hover:bg-white/10 text-sm">
                        Change layout
                      </button>
                      <button className="w-full px-4 py-2 text-left text-white hover:bg-white/10 text-sm">
                        Fullscreen
                      </button>
                    </div>
                  </>
                )}
              </div>

              <div className="w-px h-8 bg-white/20 mx-1" />

              {/* End Call - Direct leave */}
              <button
                onClick={handleLeave}
                className="w-12 h-12 rounded-full bg-[#ea4335] hover:bg-[#d33b28] flex items-center justify-center transition-colors"
                title="Leave call"
              >
                <Phone className="w-5 h-5 text-white" />
              </button>
            </div>
          </div>

          {/* Time in fullscreen mode (bottom left) */}
          {isFullscreen && (
            <div className="absolute bottom-6 left-6 text-white/60 text-sm flex items-center gap-2 z-40">
              <Clock className="w-4 h-4" />
              <span>{sessionDuration}</span>
            </div>
          )}
        </div>

        {/* Right Sidebar - Slide in/out */}
        <AnimatePresence>
          {rightPanel && (
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 420, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="bg-[#202124] border-l border-white/10 flex flex-col overflow-hidden"
            >
              {rightPanel === "chat" ? (
                <div className="flex-1 overflow-hidden">
                  <ChatPanel
                    questions={questions}
                    currentUserId={currentUserId || ""}
                    isHost={isHost}
                    onSendQuestion={handleSendQuestion}
                    topQuestionId={topQuestionId}
                    onToggleVote={toggleVote}
                    onRemoveQuestion={removeQuestion}
                    onMarkAnswered={markAnswered}
                    onMarkOpen={markOpen}
                    isLoading={isLoadingQna}
                    darkMode
                    onClose={() => setRightPanel(null)}
                  />
                </div>
              ) : (
                <>
                  <div className="h-14 flex items-center justify-between px-4 border-b border-white/10 shrink-0">
                    <h3 className="text-white font-medium">People</h3>
                    <button
                      onClick={() => setRightPanel(null)}
                      className="w-8 h-8 rounded-full hover:bg-white/10 flex items-center justify-center transition-colors"
                    >
                      <X className="w-5 h-5 text-white" />
                    </button>
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <AttendeesPanel
                      attendees={attendees}
                      isHost={isHost}
                      onMuteAttendee={() => {}}
                      onStopCamera={() => {}}
                      onGrantCanvasEdit={() => {}}
                      onPromoteAttendee={() => {}}
                      onRemoveAttendee={() => {}}
                      darkMode
                    />
                  </div>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );

  // Wrap in LiveKitRoom
  if (livekitToken && livekitUrl) {
    return (
      <LiveKitRoom
        token={livekitToken}
        serverUrl={livekitUrl}
        connect={true}
        audio={micOn}
        video={cameraOn}
      >
        <PermissionEnforcer
          isHost={isHost}
          onPermissionChange={handlePermissionChange}
          onPermissionDenied={(msg) => showToastMsg("warning", msg)}
        />
        <HandRaiseSync
          localRaisedHand={raisedHand}
          onHandRaiseChange={handleHandRaiseChange}
        />
        {content}
      </LiveKitRoom>
    );
  }

  return content;
}

export default function LiveSessionPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-[#0b0e1a] text-white/70">
          Loading live session…
        </div>
      }
    >
      <LiveSessionPageContent />
    </Suspense>
  );
}
