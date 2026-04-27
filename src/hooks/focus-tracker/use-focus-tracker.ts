/**
 * useFocusTracker — React hook that wires FocusTracker to the LiveKit local camera track.
 *
 * MUST be called inside a component rendered within <LiveKitRoom>.
 *
 * Analysed locally in your browser — nothing is sent to the server.
 */

"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useLocalParticipant } from "@livekit/components-react";
import { Track } from "livekit-client";
import { FocusTracker } from "@/lib/focus-tracker/FocusTracker";
import type {
  FrameKind,
  FocusMetrics,
  SessionReport,
  Sensitivity,
} from "@/lib/focus-tracker/types";

interface UseFocusTrackerOptions {
  enabled: boolean;
  sessionId: string;
  userId: string;
  sensitivity: Sensitivity;
}

interface UseFocusTrackerReturn {
  currentState: FrameKind | "idle";
  isDistracted: boolean;
  metrics: FocusMetrics;
  report: SessionReport | null;
  error: Error | null;
  isCameraAvailable: boolean;
  /** Pull a snapshot of the current report without stopping the tracker. */
  getLiveReport: () => SessionReport | null;
}

const EMPTY_METRICS: FocusMetrics = {
  focusedMs: 0,
  distractedMs: 0,
  noFaceMs: 0,
  focusScore: 100,
  longestFocusedStreakMs: 0,
  currentStreakMs: 0,
  eventCount: 0,
  distractionCount: 0,
};

export function useFocusTracker({
  enabled,
  sessionId,
  userId,
  sensitivity,
}: UseFocusTrackerOptions): UseFocusTrackerReturn {
  const { localParticipant } = useLocalParticipant();
  const trackerRef = useRef<FocusTracker | null>(null);
  const metricsIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const [currentState, setCurrentState] = useState<FrameKind | "idle">("idle");
  const [metrics, setMetrics] = useState<FocusMetrics>(EMPTY_METRICS);
  const [report, setReport] = useState<SessionReport | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [isCameraAvailable, setIsCameraAvailable] = useState(false);

  // Debounce toggle — prevent thrashing if user spams the button
  const enabledRef = useRef(enabled);
  const enabledDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [debouncedEnabled, setDebouncedEnabled] = useState(enabled);

  useEffect(() => {
    enabledRef.current = enabled;
    if (enabledDebounceRef.current) clearTimeout(enabledDebounceRef.current);
    enabledDebounceRef.current = setTimeout(() => {
      setDebouncedEnabled(enabled);
    }, 300);
    return () => {
      if (enabledDebounceRef.current) clearTimeout(enabledDebounceRef.current);
    };
  }, [enabled]);

  // Track camera availability
  useEffect(() => {
    const checkCamera = () => {
      const pub = localParticipant.getTrackPublication(Track.Source.Camera);
      const available = !!(pub?.track?.mediaStreamTrack);
      setIsCameraAvailable(available);
    };

    checkCamera();

    // Re-check when tracks change
    const interval = setInterval(checkCamera, 1000);
    return () => clearInterval(interval);
  }, [localParticipant]);

  // Lifecycle: create tracker on first enable, fully stop on disable / unmount.
  // Camera availability is handled in a separate effect below — we DO NOT
  // depend on isCameraAvailable here, otherwise the tracker would be torn
  // down and recreated on every camera flicker, losing the running counters.
  useEffect(() => {
    if (!debouncedEnabled) {
      if (trackerRef.current) {
        trackerRef.current.stop();
        const finalReport = trackerRef.current.getReport();
        setReport(finalReport);
        trackerRef.current = null;
        setCurrentState("idle");
      }
      if (metricsIntervalRef.current) {
        clearInterval(metricsIntervalRef.current);
        metricsIntervalRef.current = null;
      }
      return;
    }

    // Cleanup on unmount or full dependency change.
    return () => {
      if (trackerRef.current) {
        trackerRef.current.stop();
        const finalReport = trackerRef.current.getReport();
        setReport(finalReport);
        trackerRef.current = null;
      }
      if (metricsIntervalRef.current) {
        clearInterval(metricsIntervalRef.current);
        metricsIntervalRef.current = null;
      }
    };
  }, [debouncedEnabled, sessionId, userId, sensitivity]);

  // Camera lifecycle: create the tracker on first camera availability, then
  // pause/resume across camera off/on cycles WITHOUT destroying state, so
  // counters and the events array carry over.
  useEffect(() => {
    if (!debouncedEnabled) return;

    const pub = localParticipant.getTrackPublication(Track.Source.Camera);
    const mediaTrack = pub?.track?.mediaStreamTrack;

    // Camera off: pause the tracker if it exists. Counters preserved.
    if (!isCameraAvailable || !mediaTrack) {
      if (trackerRef.current) {
        trackerRef.current.pause();
        setCurrentState("idle");
      }
      return;
    }

    // Camera on, tracker exists: resume into the SAME tracker instance.
    if (trackerRef.current) {
      trackerRef.current.resume(mediaTrack).catch((err) => {
        setError(err instanceof Error ? err : new Error(String(err)));
      });
      setCurrentState("focused");
      return;
    }

    // First time: create and start.
    const tracker = new FocusTracker({ sessionId, userId, sensitivity });

    tracker.onStateChange((state) => {
      setCurrentState(state);
    });

    tracker.onError((err) => {
      setError(err);
      console.error("[FocusTracker] Error:", err);
    });

    tracker
      .start(mediaTrack)
      .then(() => {
        trackerRef.current = tracker;
        setCurrentState("focused");
        setError(null);

        metricsIntervalRef.current = setInterval(() => {
          if (trackerRef.current) {
            setMetrics(trackerRef.current.getMetrics());
          }
        }, 1000);
      })
      .catch((err) => {
        setError(err instanceof Error ? err : new Error(String(err)));
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedEnabled, isCameraAvailable, sessionId, userId, sensitivity]);

  const isDistracted =
    currentState !== "idle" && currentState !== "focused";

  const getLiveReport = useCallback((): SessionReport | null => {
    if (!trackerRef.current) return report;
    try {
      return trackerRef.current.getReport();
    } catch {
      return report;
    }
  }, [report]);

  return {
    currentState,
    isDistracted,
    metrics,
    report,
    error,
    isCameraAvailable,
    getLiveReport,
  };
}
