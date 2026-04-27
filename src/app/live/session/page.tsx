/**
 * Live Session Page - Google Meet Style UI
 *
 * Standalone page (outside layout) for true fullscreen experience.
 * Clean, minimal interface with floating controls.
 */

"use client";

import React, { useState, useEffect, useCallback, useMemo, useRef, Suspense } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useSearchParams, useRouter } from "next/navigation";
import { io, Socket } from "socket.io-client";
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  MonitorUp,
  Users,
  MessageSquare,
  X,
  LogOut,
  Maximize2,
  Minimize2,
  Presentation,
  Hand,
  Phone,
  Info,
  Clock,
  Grid3X3,
  LayoutGrid,
  Settings,
  UserCog,
  ShieldCheck,
  PenTool,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast as sonnerToast } from "sonner";
import Toast from "@/components/live-session/Toast";
import AttendeesPanelBridge from "@/components/live-session/AttendeesPanelBridge";
import ChatPanel from "@/components/live-session/ChatPanel";
import type { Attendee } from "@/types/live-session";
import { LiveKitRoom } from "@livekit/components-react";
import "@livekit/components-styles";
import useLiveKitToken from "@/hooks/live-sessions/use-livekit-token";
import useGetSession from "@/hooks/live-sessions/use-get-session";
import useJoinSession from "@/hooks/live-sessions/use-join-session";
import useLeaveSession from "@/hooks/live-sessions/use-leave-session";
import useEndSession from "@/hooks/live-sessions/use-end-session";
import LiveKitStage from "@/components/live-session/LiveKitStage";
import LiveKitControlsBridge from "@/components/live-session/LiveKitControlsBridge";
import AttendeesGridView from "@/components/live-session/AttendeesGridView";
import PermissionEnforcer, { type PermissionKey } from "@/components/live-session/PermissionEnforcer";
import HandRaiseSync from "@/components/live-session/HandRaiseSync";
import CanvasStage from "@/components/live-session/CanvasStage";
import CanvasDrawerPanel from "@/components/live-session/CanvasDrawerPanel";
import { useLiveQna } from "@/hooks/live-qna/use-live-qna";
import { toastApiError } from "@/utils/toast-helpers";
import FocusTrackerController from "@/components/live-session/FocusTrackerController";
import FocusTrackerToggle from "@/components/live-session/FocusTrackerToggle";
import useMySubscription from "@/hooks/subscription/use-my-subscription";
import FocusAlert from "@/components/live-session/FocusAlert";
import FocusReportDialog from "@/components/live-session/FocusReportDialog";
import { useFocusReportUpload, sendFocusReportBeacon, stashPendingReport, flushPendingReports } from "@/hooks/focus-tracker/use-focus-report-upload";
import { useFocusAudioAlert } from "@/hooks/focus-tracker/use-focus-audio-alert";
import type { FrameKind, SessionReport, Sensitivity, FocusMetrics } from "@/lib/focus-tracker/types";

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

interface HostLeaveModalProps {
  isOpen: boolean;
  isEnding: boolean;
  isLeaving: boolean;
  attendees: Attendee[];
  actingHostId: string | null;
  onChangeActingHost: (attendeeId: string | null) => void;
  onEndForAll: () => void;
  onLeaveOnly: () => void;
  onClose: () => void;
}

function HostLeaveModal({
  isOpen,
  isEnding,
  isLeaving,
  attendees,
  actingHostId,
  onChangeActingHost,
  onEndForAll,
  onLeaveOnly,
  onClose,
}: HostLeaveModalProps) {
  const busy = isEnding || isLeaving;
  const eligibleActingHosts = attendees.filter((attendee) => attendee.role !== "host");

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[120] flex items-center justify-center bg-black/70 backdrop-blur"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="w-full max-w-lg rounded-xl border border-white/10 bg-[#202124] p-6 text-white shadow-2xl"
          >
            <div className="space-y-2">
              <h2 className="text-2xl font-semibold">Leave session</h2>
              <p className="text-sm text-white/70">
                You are the host. Leaving keeps the session running for others. Promote an acting host or end the
                session for everyone.
              </p>
            </div>

            {eligibleActingHosts.length > 0 && (
              <div className="mt-5 space-y-2">
                <label className="text-sm font-medium text-white/80">Promote acting host</label>
                <select
                  className="w-full rounded-lg border border-white/10 bg-[#2c2f33] px-3 py-2 text-sm text-white focus:border-white/30 focus:outline-none"
                  value={actingHostId ?? ""}
                  onChange={(event) => onChangeActingHost(event.target.value || null)}
                  disabled={busy}
                >
                  <option value="">No acting host</option>
                  {eligibleActingHosts.map((attendee) => (
                    <option key={attendee.id} value={attendee.id}>
                      {attendee.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div className="mt-6 space-y-3">
              <button
                className="flex w-full items-center justify-between rounded-lg bg-[#ea4335] px-4 py-3 text-left font-medium transition hover:bg-[#d33b28] disabled:cursor-not-allowed disabled:bg-[#ea4335]/70"
                onClick={onEndForAll}
                disabled={busy}
              >
                <span>End session for everyone</span>
                {isEnding && <span className="text-sm text-white/80">Ending...</span>}
              </button>
              <button
                className="flex w-full items-center justify-between rounded-lg bg-[#3c4043] px-4 py-3 text-left font-medium transition hover:bg-[#4a4d52] disabled:cursor-not-allowed disabled:bg-[#3c4043]/70"
                onClick={onLeaveOnly}
                disabled={busy}
              >
                <span>Leave without ending</span>
                {isLeaving && <span className="text-sm text-white/80">Leaving...</span>}
              </button>
            </div>

            <div className="mt-5 flex justify-end">
              <button
                type="button"
                onClick={onClose}
                disabled={busy}
                className="rounded-md px-4 py-2 text-sm font-medium text-white transition hover:bg-white/10 disabled:cursor-not-allowed disabled:text-white/50"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

const COMMUNICATION_URL = process.env.NEXT_PUBLIC_COMMUNICATION_URL || "";
const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "";

async function fetchSocketAccessToken(): Promise<string | null> {
  try {
    const response = await fetch("/api/auth/token");
    if (!response.ok) return null;
    const data = await response.json();
    return data.token || null;
  } catch (error) {
    console.error("[LiveSession] Failed to fetch socket access token", error);
    return null;
  }
}

function sendLeavePing(sessionId: string, roomId: string) {
  if (typeof window === "undefined") return;
  if (!BACKEND_URL || !sessionId || !roomId) return;

  const normalizedBase = BACKEND_URL.endsWith("/") ? BACKEND_URL.slice(0, -1) : BACKEND_URL;
  const url = `${normalizedBase}/live-sessions/${sessionId}/leave?roomId=${roomId}`;

  try {
    fetch(url, {
      method: "POST",
      credentials: "include",
      keepalive: true,
    }).catch(() => {});
  } catch (error) {
    console.error("[LiveSession] Failed to send leave ping", error);
  }
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
  const [toast, setToast] = useState<{ type: "success" | "error" | "info" | "warning"; message: string } | null>(null);

  const showToastMsg = useCallback((type: "success" | "error" | "info" | "warning", message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3000);
  }, []);

  const queryClient = useQueryClient();
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [hostLeaveModalOpen, setHostLeaveModalOpen] = useState(false);
  const [leaveConfirmOpen, setLeaveConfirmOpen] = useState(false);
  const [actingHostCandidate, setActingHostCandidate] = useState<string | null>(null);
  const [sessionTerminated, setSessionTerminated] = useState(false);
  const [sessionEndReason, setSessionEndReason] = useState<"manual" | "auto" | null>(null);
  const [sessionEndTimestamp, setSessionEndTimestamp] = useState<string | undefined>(undefined);
  const hasLeftRef = useRef(false);
  const socketRef = useRef<Socket | null>(null);
  const [summaryPdfUrl, setSummaryPdfUrl] = useState<string | null>(null);
  const [transcriptionLang, setTranscriptionLang] = useState<"en" | "ur">("en");

  useEffect(() => {
    if (!sessionTerminated || !sessionId || !roomId) return;
    if (summaryPdfUrl) return;

    let attempts = 0;
    const MAX_ATTEMPTS = 24;

    const poll = setInterval(async () => {
      attempts += 1;
      try {
        const res = await fetch(
          `${BACKEND_URL}/live-sessions/${sessionId}/summary?roomId=${roomId}`,
          { credentials: "include" }
        );
        if (res.ok) {
          const data = await res.json();
          if (data.summaryPdfUrl) {
            setSummaryPdfUrl(data.summaryPdfUrl);
            clearInterval(poll);
          }
        }
      } catch (_) {}
      if (attempts >= MAX_ATTEMPTS) clearInterval(poll);
    }, 5000);

    return () => clearInterval(poll);
  }, [sessionTerminated, sessionId, roomId, summaryPdfUrl]);

  const navigateToSessions = useCallback(() => {
    router.push(`/rooms/${roomId}/sessions`);
  }, [router, roomId]);

  const { joinSession } = useJoinSession();
  const { leaveSession, isLeaving } = useLeaveSession();
  const { endSession, isEnding } = useEndSession();

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
  const [raisedHand, setRaisedHand] = useState(false);

  // ─── Focus Tracker State ───────────────────────────────────────────
  // Gate: focus tracker is a paid feature (Student Plus). Hide the toggle
  // entirely on plans that don't include it.
  const { subscription } = useMySubscription();
  const hasFocusTracker = !!subscription?.plan?.hasFocusTracker;

  const [focusEnabled, setFocusEnabled] = useState(() => {
    if (typeof window === "undefined") return false;
    return sessionStorage.getItem(`focus-enabled-${sessionId}`) === "true";
  });
  const [focusSensitivity, setFocusSensitivity] = useState<Sensitivity>("normal");
  const [focusState, setFocusState] = useState<FrameKind | "idle">("idle");
  const [isFocusDistracted, setIsFocusDistracted] = useState(false);
  const [focusReport, setFocusReport] = useState<SessionReport | null>(null);
  const [showFocusReport, setShowFocusReport] = useState(false);
  const [showFocusIntro, setShowFocusIntro] = useState(false);
  const focusReportRef = useRef<SessionReport | null>(null);
  const focusReportGeneratorRef = useRef<(() => SessionReport | null) | null>(null);
  const { uploadReport, isUploading: isUploadingFocusReport } = useFocusReportUpload();
  const { muted: focusAlertMuted, setMuted: setFocusAlertMuted } =
    useFocusAudioAlert(focusEnabled && isFocusDistracted);

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

  // Persist focus toggle to sessionStorage
  useEffect(() => {
    if (typeof window === "undefined") return;
    sessionStorage.setItem(`focus-enabled-${sessionId}`, String(focusEnabled));
  }, [focusEnabled, sessionId]);

  // Flush any pending focus reports from previous sessions on mount
  useEffect(() => {
    flushPendingReports().catch(() => {});
  }, []);

  // Focus tracker toggle handler.
  // - Enabling: always show a confirm modal (focus tracking is a commitment
  //   for the rest of the session — see below).
  // - Disabling: blocked. Once enabled, focus tracking runs until the user
  //   leaves or the session ends. Stopping mid-session would corrupt the
  //   report and let users opt out of accountability after distraction is
  //   already detected. Show an explanatory toast instead.
  const handleFocusToggle = useCallback((checked: boolean) => {
    if (checked) {
      setShowFocusIntro(true);
      return;
    }
    sonnerToast.info(
      "Focus tracking can't be turned off mid-session. It will stop when you leave.",
    );
  }, []);

  const confirmFocusIntro = useCallback(() => {
    localStorage.setItem("focus-tracker-intro-seen", "true");
    setShowFocusIntro(false);
    setFocusEnabled(true);
    sonnerToast.info("Focus tracking started");
  }, []);

  // Focus tracker callbacks
  const handleFocusStateChange = useCallback((state: FrameKind | "idle", distracted: boolean) => {
    setFocusState(state);
    setIsFocusDistracted(distracted);
  }, []);

  const handleFocusCameraChange = useCallback((available: boolean) => {
    if (!available && focusEnabled) {
      sonnerToast.info("Focus tracking paused — camera is off.");
    }
  }, [focusEnabled]);

  const handleFocusReport = useCallback((report: SessionReport) => {
    setFocusReport(report);
    focusReportRef.current = report;
  }, []);

  // Panels
  const [rightPanel, setRightPanel] = useState<"chat" | "people" | null>(null);

  // View mode: "stage" (speaker view), "grid" (all participants), or "canvas"
  const [viewMode, setViewMode] = useState<"stage" | "grid" | "canvas">("stage");

  // ─── Canvas Board State ──────────────────────────────────────────
  const [canvasDraw, setCanvasDraw] = useState(false);
  const [canvasDrawers, setCanvasDrawers] = useState<string[]>([]);
  const canvasSocketRef = useRef<Socket | null>(null);
  const [canvasToken, setCanvasToken] = useState<string | null>(null);

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

  const attendees: Attendee[] = useMemo(() => {
    if (!sessionData?.attendees) return [];
    return sessionData.attendees
      .filter((a) => !a.leftAt)
      .map((a) => {
        const uid = a.user?.id || a.id;
        const perms = attendeePermissions[uid];
        return {
          id: uid,
          name: a.user ? `${a.user.firstName} ${a.user.lastName}` : "Unknown",
          avatar: a.user?.image,
          role: sessionData.host?.id === uid ? "host" : "participant" as const,
          webcamOn: perms ? perms.canCamera : true,
          micOn: perms ? perms.canMic : true,
          speakerActive: false,
          raiseHand: false,
          networkQuality: "good" as const,
          canEdit: sessionData.host?.id === uid,
          screenSharing: false,
          joinedAt: new Date(a.joinedAt),
        };
      });
  }, [sessionData, attendeePermissions]);

  useEffect(() => {
    if (!sessionData) return;
    if (sessionTerminated) return;
    if (sessionData.status !== "ended") return;

    hasLeftRef.current = true;
    setSessionTerminated(true);
    setSessionEndReason((sessionData as any)?.endReason ?? "manual");
    setSessionEndTimestamp(sessionData.endedAt ?? new Date().toISOString());
    showToastMsg("info", "The session has ended.");

    const redirectTimer = setTimeout(() => {
      navigateToSessions();
    }, 2000);

    return () => clearTimeout(redirectTimer);
  }, [sessionData, sessionTerminated, showToastMsg, navigateToSessions]);

  // Click handler for the Leave buttons. Opens the right confirmation modal;
  // actual leave logic runs only after the user confirms via `confirmLeave`.
  const handleLeaveClick = useCallback(() => {
    if (isHost) {
      setHostLeaveModalOpen(true);
    } else {
      setLeaveConfirmOpen(true);
    }
  }, [isHost]);

  // Run the actual leave flow once the non-host user confirms in the modal.
  const confirmLeave = useCallback(async () => {
    setLeaveConfirmOpen(false);

    // Grab a fresh snapshot from the still-running tracker. The hook's
    // onReport only fires after the tracker stops, which is AFTER we leave —
    // so relying on focusReportRef alone causes every upload to be skipped.
    const liveReport = focusReportGeneratorRef.current?.() ?? focusReportRef.current;
    if (liveReport && sessionId) {
      focusReportRef.current = liveReport;
      setFocusReport(liveReport);
      setShowFocusReport(true);
      try {
        await uploadReport({ sessionId, report: liveReport });
      } catch {
        // Stash for later if upload fails
        stashPendingReport(sessionId, liveReport);
      }
      // Small delay so the dialog's render settles before navigation fires.
      await new Promise((r) => setTimeout(r, 100));
    }

    hasLeftRef.current = true;
    leaveSession({ sessionId, roomId })
      .then(() => {
        showToastMsg("success", "You left the session.");
        if (!showFocusReport) navigateToSessions();
      })
      .catch(() => {});
  }, [sessionId, roomId, leaveSession, showToastMsg, navigateToSessions, uploadReport, showFocusReport]);

  const handleEndForAll = useCallback(async () => {
    try {
      await endSession({ sessionId, roomId });
      hasLeftRef.current = true;
      setSessionTerminated(true);
      setSessionEndReason("manual");
      setSessionEndTimestamp(new Date().toISOString());
      showToastMsg("success", "Session ended for everyone.");
      queryClient.invalidateQueries({ queryKey: ["live-session", sessionId, roomId] });
      queryClient.invalidateQueries({ queryKey: ["live-sessions"] });
      setTimeout(() => navigateToSessions(), 1500);
    } catch (error) {
      toastApiError(error, "Failed to end session.");
    }
  }, [endSession, sessionId, roomId, showToastMsg, queryClient, navigateToSessions]);

  const handleLeaveAsHost = useCallback(async () => {
    try {
      await leaveSession({ sessionId, roomId, actingHostId: actingHostCandidate || undefined });
      hasLeftRef.current = true;
      showToastMsg("success", "You left the session.");
      setHostLeaveModalOpen(false);
      navigateToSessions();
    } catch (error) {
      toastApiError(error, "Failed to leave session.");
    }
  }, [leaveSession, sessionId, roomId, actingHostCandidate, showToastMsg, navigateToSessions]);

  useEffect(() => {
    if (!sessionId || !roomId) return;
    if (hasLeftRef.current) return;

    const doJoin = async () => {
      try {
        await joinSession({ sessionId, roomId });
      } catch (error) {
        console.error("[LiveSession] Failed to join session:", error);
      }
    };
    doJoin();
  }, [sessionId, roomId, joinSession]);

  useEffect(() => {
    if (!sessionId || !roomId) return;
    if (!COMMUNICATION_URL) return;

    let socket: Socket | null = null;
    let disconnectTimer: NodeJS.Timeout | null = null;

    const initSocket = async () => {
      const token = await fetchSocketAccessToken();
      if (!token) return;

      socket = io(`${COMMUNICATION_URL}/live-session`, {
        transports: ["websocket", "polling"],
        auth: { token },
      });
      socketRef.current = socket;

      socket.on("connect", () => {
        console.log("[LiveSession] Socket connected to /live-session");
        socket?.emit("join-session", sessionId);
      });

      socket.on("session-ended", (data: { reason?: "manual" | "auto"; endedBy?: string; endedAt?: string }) => {
        console.log("[LiveSession] Received session-ended:", data);
        if (!hasLeftRef.current) {
          hasLeftRef.current = true;
          setSessionTerminated(true);
          setSessionEndReason(data.reason || "manual");
          setSessionEndTimestamp(data.endedAt || new Date().toISOString());
          showToastMsg("info", "The session has ended.");
          disconnectTimer = setTimeout(() => {
            navigateToSessions();
          }, 3000);
        }
      });

      socket.on("connect_error", (err) => {
        console.error("[LiveSession] Socket connect error:", err.message);
      });
    };

    initSocket();

    return () => {
      if (disconnectTimer) clearTimeout(disconnectTimer);
      if (socket) {
        socket.disconnect();
        socketRef.current = null;
      }
    };
  }, [sessionId, roomId, showToastMsg, navigateToSessions]);

  useEffect(() => {
    const handleBeforeUnload = () => {
      if (!hasLeftRef.current && sessionId && roomId) {
        sendLeavePing(sessionId, roomId);
      }
      // Send focus report via beacon on tab close. Prefer a fresh snapshot
      // from the still-running tracker; fall back to the last stored report.
      const beaconReport =
        focusReportGeneratorRef.current?.() ?? focusReportRef.current;
      if (beaconReport && sessionId) {
        const sent = sendFocusReportBeacon(sessionId, beaconReport);
        if (!sent) {
          stashPendingReport(sessionId, beaconReport);
        }
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [sessionId, roomId]);

  const handleCloseHostLeaveModal = useCallback(() => {
    if (!isLeaving && !isEnding) {
      setHostLeaveModalOpen(false);
      setActingHostCandidate(null);
    }
  }, [isLeaving, isEnding]);

  const transcriptionSocketRef = useRef<Socket | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const audioStreamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    if (!isHost || !sessionId || !BACKEND_URL) return;
    if (sessionTerminated) return;

    let socket: Socket | null = null;
    let audioContext: AudioContext | null = null;
    let mediaStream: MediaStream | null = null;
    let workletNode: AudioWorkletNode | null = null;

    const WORKLET_CODE = `
class PCMProcessor extends AudioWorkletProcessor {
  constructor() {
    super();
    this._buffer = [];
    this._bufferSize = 4096;
  }
  process(inputs) {
    const input = inputs[0];
    if (!input || !input[0]) return true;
    const samples = input[0];
    for (let i = 0; i < samples.length; i++) {
      this._buffer.push(samples[i]);
    }
    while (this._buffer.length >= this._bufferSize) {
      const chunk = this._buffer.splice(0, this._bufferSize);
      const int16 = new Int16Array(this._bufferSize);
      for (let i = 0; i < this._bufferSize; i++) {
        const s = Math.max(-1, Math.min(1, chunk[i]));
        int16[i] = s < 0 ? s * 0x8000 : s * 0x7fff;
      }
      this.port.postMessage(int16.buffer, [int16.buffer]);
    }
    return true;
  }
}
registerProcessor('pcm-processor', PCMProcessor);
`;

    const start = async () => {
      try {
        const token = await fetchSocketAccessToken();
        if (!token) {
          console.warn("[Transcription] No auth token, skipping");
          return;
        }

        socket = io(`${BACKEND_URL}/transcription`, {
          path: "/socket.io",
          transports: ["websocket", "polling"],
          auth: { token },
        });
        transcriptionSocketRef.current = socket;

        socket.on("connect", () => {
          console.log("[Transcription] Socket connected, starting transcription");
          socket?.emit("startTranscription", { sessionId, language: transcriptionLang });
        });

        socket.on("connect_error", (err) => {
          console.error("[Transcription] connect error:", err.message);
        });

        mediaStream = await navigator.mediaDevices.getUserMedia({ audio: true });
        audioStreamRef.current = mediaStream;

        audioContext = new AudioContext({ sampleRate: 16000 });
        audioContextRef.current = audioContext;

        const blob = new Blob([WORKLET_CODE], { type: "application/javascript" });
        const workletUrl = URL.createObjectURL(blob);
        await audioContext.audioWorklet.addModule(workletUrl);
        URL.revokeObjectURL(workletUrl);

        const source = audioContext.createMediaStreamSource(mediaStream);
        workletNode = new AudioWorkletNode(audioContext, "pcm-processor");

        workletNode.port.onmessage = (event: MessageEvent<ArrayBuffer>) => {
          if (socket?.connected) {
            socket.emit("audioChunk", event.data);
          }
        };

        source.connect(workletNode);
        workletNode.connect(audioContext.destination);

        console.log("[Transcription] Audio capture started");
      } catch (err) {
        console.error("[Transcription] Failed to start audio capture:", err);
      }
    };

    start();

    return () => {
      try {
        workletNode?.disconnect();
        audioContext?.close();
        mediaStream?.getTracks().forEach((t) => t.stop());
        if (socket) {
          socket.emit("stopTranscription", { sessionId });
          socket.disconnect();
          transcriptionSocketRef.current = null;
        }
      } catch (_) {}
    };
  }, [isHost, sessionId, sessionTerminated, transcriptionLang]);

  // ─── Canvas Permission Socket ──────────────────────────────────
  useEffect(() => {
    if (!sessionId || !BACKEND_URL || sessionTerminated) return;

    let socket: Socket | null = null;

    const init = async () => {
      const token = await fetchSocketAccessToken();
      if (!token) return;
      setCanvasToken(token);

      socket = io(`${BACKEND_URL}/canvas`, {
        path: "/socket.io",
        transports: ["websocket", "polling"],
        auth: { token },
      });
      canvasSocketRef.current = socket;

      socket.on("connect", () => {
        console.log("[Canvas] Permission socket connected");
        socket?.emit("joinCanvas", { sessionId, isHost });
      });

      socket.on("canvasPermissions", (data: { canDraw: boolean; drawers: string[] }) => {
        setCanvasDraw(isHost ? true : data.canDraw);
        setCanvasDrawers(data.drawers);
      });

      socket.on("drawPermissionChanged", (data: { userId: string; canDraw: boolean; drawers: string[] }) => {
        setCanvasDrawers(data.drawers);
        if (data.userId === currentUserId) {
          setCanvasDraw(data.canDraw);
          showToastMsg(
            data.canDraw ? "success" : "info",
            data.canDraw ? "You can now draw on the canvas!" : "Your draw permission was revoked."
          );
        }
      });

      socket.on("canvasError", (data: { message: string }) => {
        showToastMsg("warning", data.message);
      });

      socket.on("connect_error", (err) => {
        console.error("[Canvas] Permission socket error:", err.message);
      });
    };

    init();

    return () => {
      if (socket) {
        socket.disconnect();
        canvasSocketRef.current = null;
      }
    };
  }, [sessionId, sessionTerminated, isHost, currentUserId]);

  const handleGrantCanvasEdit = useCallback(
    (targetUserId: string) => {
      const socket = canvasSocketRef.current;
      if (!socket || !isHost || !sessionId) return;

      const alreadyDrawer = canvasDrawers.includes(targetUserId);
      if (alreadyDrawer) {
        socket.emit("revokeDraw", { sessionId, targetUserId });
      } else {
        socket.emit("grantDraw", { sessionId, targetUserId });
      }
    },
    [isHost, sessionId, canvasDrawers]
  );

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
    askAiBot,
    askingBotFor,
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

  // Bridge callbacks for AttendeesPanelBridge → local state
  const handlePermissionToggle = useCallback(
    (participantId: string, permission: "canMic" | "canCamera", value: boolean) => {
      setAttendeePermissions((prev) => ({
        ...prev,
        [participantId]: {
          canMic: prev[participantId]?.canMic ?? true,
          canCamera: prev[participantId]?.canCamera ?? true,
          canScreenShare: prev[participantId]?.canScreenShare ?? true,
          canChat: prev[participantId]?.canChat ?? true,
          [permission]: value,
        },
      }));
    },
    []
  );

  const handleBulkPermission = useCallback(
    (permission: "canMic" | "canCamera", value: boolean) => {
      setAttendeePermissions((prev) => {
        const updated: Record<string, AttendeePermission> = { ...prev };
        attendees.forEach((a) => {
          if (a.role !== "host") {
            updated[a.id] = {
              canMic: updated[a.id]?.canMic ?? true,
              canCamera: updated[a.id]?.canCamera ?? true,
              canScreenShare: updated[a.id]?.canScreenShare ?? true,
              canChat: updated[a.id]?.canChat ?? true,
              [permission]: value,
            };
          }
        });
        return updated;
      });
    },
    [attendees]
  );

  // Kick an attendee (host only)
  const handleKickAttendee = useCallback(
    async (targetUserId: string) => {
      if (!isHost || !sessionId) return;
      try {
        const res = await fetch(
          `${BACKEND_URL}/live-sessions/${sessionId}/kick?roomId=${roomId}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ targetUserId }),
          }
        );
        if (!res.ok) throw new Error("Failed to kick");
        showToastMsg("success", "Attendee removed from session");
        queryClient.invalidateQueries({ queryKey: ["live-session", sessionId, roomId] });
      } catch {
        showToastMsg("error", "Failed to remove attendee");
      }
    },
    [isHost, sessionId, roomId, showToastMsg, queryClient]
  );

  // ═══════════════════════════════════════════════════════════════════
  // RENDER CONTENT
  // ═══════════════════════════════════════════════════════════════════

  const content = (
    <div className="h-screen w-screen bg-[#202124] flex flex-col overflow-hidden relative">
      {/* Session Terminated Overlay */}
      {sessionTerminated && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm">
          <div className="text-center max-w-sm px-4">
            <div className="mb-4 text-6xl">👋</div>
            <h2 className="mb-2 text-2xl font-bold text-white">Session Ended</h2>
            <p className="mb-4 text-white/70">
              {sessionEndReason === "manual" ? "The host ended the session." : "The session ended automatically."}
            </p>
            {sessionEndTimestamp && (
              <p className="mb-4 text-sm text-white/50">
                Ended at: {new Date(sessionEndTimestamp).toLocaleTimeString()}
              </p>
            )}
            {summaryPdfUrl ? (
              <a
                href={summaryPdfUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mb-4 flex items-center justify-center gap-2 rounded-lg bg-[#34a853] px-6 py-2 font-medium text-white transition hover:bg-[#2d9248]"
              >
                📄 Download Study Notes (PDF)
              </a>
            ) : (
              <p className="mb-4 text-sm text-white/40">📊 Generating study notes... check the sessions list shortly.
              </p>
            )}
            <button
              onClick={navigateToSessions}
              className="rounded-lg bg-[#1a73e8] px-6 py-2 font-medium text-white transition hover:bg-[#1557b0]"
            >
              Return to Sessions
            </button>
          </div>
        </div>
      )}

      {/* Host Leave Modal */}
      <HostLeaveModal
        isOpen={hostLeaveModalOpen}
        isEnding={isEnding}
        isLeaving={isLeaving}
        attendees={attendees}
        actingHostId={actingHostCandidate}
        onChangeActingHost={setActingHostCandidate}
        onEndForAll={handleEndForAll}
        onLeaveOnly={handleLeaveAsHost}
        onClose={handleCloseHostLeaveModal}
      />

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
            <button
              onClick={() => setViewMode(viewMode === "canvas" ? "stage" : "canvas")}
              className={`
                w-10 h-10 rounded-full flex items-center justify-center transition-colors
                ${viewMode === "canvas" ? "bg-[#1a73e8]" : "hover:bg-white/10"}
              `}
              title={viewMode === "canvas" ? "Close canvas" : "Open canvas board"}
            >
              <PenTool className="w-5 h-5 text-white" />
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
              {/* Focus Alert - persistent distraction banner */}
              {focusEnabled && hasFocusTracker && (
                <FocusAlert
                  currentState={focusState}
                  isDistracted={isFocusDistracted}
                  muted={focusAlertMuted}
                  onToggleMute={() => setFocusAlertMuted(!focusAlertMuted)}
                />
              )}
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
                {viewMode === "canvas" ? (
                  <>
                    <CanvasStage
                      sessionId={sessionId}
                      canDraw={isHost || canvasDraw}
                      backendUrl={BACKEND_URL}
                      token={canvasToken || ""}
                    />
                    {isHost && (
                      <CanvasDrawerPanel
                        attendees={attendees}
                        drawers={canvasDrawers}
                        onToggleDraw={handleGrantCanvasEdit}
                      />
                    )}
                  </>
                ) : viewMode === "stage" ? (
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


              {/* Raise Hand */}
              <ControlButton
                onClick={() => setRaisedHand((p) => !p)}
                active={!raisedHand}
                activeColor={raisedHand ? "bg-[#f9ab00]" : "bg-[#3c4043] hover:bg-[#494c50]"}
                icon={<Hand className={`w-5 h-5 ${raisedHand ? "text-white" : "text-white"}`} />
                }
                title={raisedHand ? "Lower hand" : "Raise hand"}
              />

              {/* Focus Tracker Toggle — only visible to users on a plan that includes it */}
              {hasFocusTracker && (
                <FocusTrackerToggle
                  checked={focusEnabled}
                  onChange={handleFocusToggle}
                  currentState={focusState}
                  isDistracted={isFocusDistracted}
                  cameraOn={cameraOn}
                />
              )}

              {/* Screen Share */}
              <ControlButton
                onClick={toggleScreenShare}
                active={!screenSharing}
                activeColor={screenSharing ? "bg-[#1a73e8]" : "bg-[#3c4043] hover:bg-[#494c50]"}
                icon={<Presentation className="w-5 h-5 text-white" />}
                title="Present now"
              />

              {/* Transcription Language Toggle (Host only) */}
              {isHost && (
                <button
                  onClick={() => setTranscriptionLang((prev) => (prev === "en" ? "ur" : "en"))}
                  className="h-12 px-3 rounded-full bg-[#3c4043] hover:bg-[#494c50] flex items-center justify-center gap-1.5 transition-colors"
                  title={`Transcription: ${transcriptionLang === "en" ? "English" : "اردو (Urdu)"}`}
                >
                  <span className="text-xs font-bold text-white uppercase">{transcriptionLang}</span>
                  <span className="text-[10px] text-white/60">{transcriptionLang === "en" ? "EN" : "UR"}</span>
                </button>
              )}


              {/* End Call - Host sees end session, participants see leave */}
              {isHost ? (
                <button
                  onClick={handleLeaveClick}
                  className="w-12 h-12 rounded-full bg-[#ea4335] hover:bg-[#d33b28] flex items-center justify-center transition-colors"
                  title="End session for everyone"
                >
                  <Phone className="w-5 h-5 text-white" />
                </button>
              ) : (
                <button
                  onClick={handleLeaveClick}
                  className="w-12 h-12 rounded-full bg-[#3c4043] hover:bg-[#4a4d52] flex items-center justify-center transition-colors"
                  title="Leave session"
                >
                  <LogOut className="w-5 h-5 text-white" />
                </button>
              )}
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
                    onAskAiBot={isHost ? askAiBot : undefined}
                    askingBotFor={askingBotFor}
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
                    <AttendeesPanelBridge
                      attendees={attendees}
                      isHost={isHost}
                      onGrantCanvasEdit={handleGrantCanvasEdit}
                      onPermissionToggle={handlePermissionToggle}
                      onBulkPermission={handleBulkPermission}
                      onKickAttendee={handleKickAttendee}
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
          onKicked={confirmLeave}
        />
        <HandRaiseSync
          localRaisedHand={raisedHand}
          onHandRaiseChange={handleHandRaiseChange}
        />
        <FocusTrackerController
          enabled={focusEnabled && hasFocusTracker}
          sessionId={sessionId}
          userId={currentUserId || ""}
          sensitivity={focusSensitivity}
          onStateChange={handleFocusStateChange}
          onReport={handleFocusReport}
          onCameraAvailabilityChange={handleFocusCameraChange}
          reportGeneratorRef={focusReportGeneratorRef}
        />
        {content}
        {/* Focus Intro Modal */}
        <AnimatePresence>
          {showFocusIntro && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[120] flex items-center justify-center bg-black/70 backdrop-blur"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="w-full max-w-md rounded-xl border border-white/10 bg-[#202124] p-6 text-white shadow-2xl mx-4"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-[#1a73e8]/20 flex items-center justify-center">
                    <ShieldCheck className="w-5 h-5 text-[#8ab4f8]" />
                  </div>
                  <h2 className="text-xl font-semibold">Track your focus?</h2>
                </div>
                <p className="text-sm text-white/70 leading-relaxed">
                  Your webcam will be <strong>analysed locally in your browser</strong> to help
                  you stay focused. Nothing is sent to the server until the session ends.
                </p>
                <p className="text-sm text-amber-300/90 leading-relaxed mt-3">
                  Once enabled, focus tracking <strong>can&apos;t be turned off until you
                  leave</strong> or the session ends. Make sure you&apos;re ready before
                  continuing.
                </p>
                <div className="flex justify-end gap-3 mt-6">
                  <button
                    onClick={() => setShowFocusIntro(false)}
                    className="px-4 py-2 text-sm rounded-lg text-white/70 hover:bg-white/10 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmFocusIntro}
                    className="px-5 py-2 text-sm rounded-lg bg-[#1a73e8] hover:bg-[#1557b0] font-medium transition-colors"
                  >
                    Enable
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
        {/* Leave Session Confirmation (non-host) */}
        <AnimatePresence>
          {leaveConfirmOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[120] flex items-center justify-center bg-black/70 backdrop-blur"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="w-full max-w-md rounded-xl border border-white/10 bg-[#202124] p-6 text-white shadow-2xl mx-4"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-red-500/20 flex items-center justify-center">
                    <LogOut className="w-5 h-5 text-red-300" />
                  </div>
                  <h2 className="text-xl font-semibold">Leave session?</h2>
                </div>
                <p className="text-sm text-white/70 leading-relaxed">
                  You&apos;ll be disconnected from the call.
                  {focusEnabled && (
                    <>
                      {" "}Your focus report will be saved and shown before you go.
                    </>
                  )}
                </p>
                <div className="flex justify-end gap-3 mt-6">
                  <button
                    onClick={() => setLeaveConfirmOpen(false)}
                    className="px-4 py-2 text-sm rounded-lg text-white/70 hover:bg-white/10 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmLeave}
                    className="px-5 py-2 text-sm rounded-lg bg-red-600 hover:bg-red-700 font-medium transition-colors"
                  >
                    Leave
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
        {/* Focus Report Dialog */}
        {focusReport && (
          <FocusReportDialog
            isOpen={showFocusReport}
            onClose={() => {
              setShowFocusReport(false);
              if (hasLeftRef.current) navigateToSessions();
            }}
            report={focusReport}
            mode="live"
            isUploading={isUploadingFocusReport}
          />
        )}
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
