/**
 * FocusTrackerController — Invisible bridge component.
 *
 * Mounted inside <LiveKitRoom>. Runs the focus tracker hook and
 * calls back when the report is ready.
 *
 * Follows the same pattern as LiveKitControlsBridge.tsx and HandRaiseSync.tsx.
 */

"use client";

import { RefObject, useEffect, useRef } from "react";
import { useFocusTracker } from "@/hooks/focus-tracker/use-focus-tracker";
import type { FrameKind, FocusMetrics, SessionReport, Sensitivity } from "@/lib/focus-tracker/types";

interface FocusTrackerControllerProps {
  enabled: boolean;
  sessionId: string;
  userId: string;
  sensitivity: Sensitivity;
  onStateChange?: (state: FrameKind | "idle", isDistracted: boolean) => void;
  onMetricsUpdate?: (metrics: FocusMetrics) => void;
  onReport?: (report: SessionReport) => void;
  onCameraAvailabilityChange?: (available: boolean) => void;
  onError?: (error: Error) => void;
  /**
   * Imperative handle — parent fills `.current` with a function that grabs
   * the current report from the running tracker. Used for upload-on-leave,
   * where the tracker is still running and the final `onReport` hasn't fired.
   */
  reportGeneratorRef?: RefObject<(() => SessionReport | null) | null>;
}

export default function FocusTrackerController({
  enabled,
  sessionId,
  userId,
  sensitivity,
  onStateChange,
  onMetricsUpdate,
  onReport,
  onCameraAvailabilityChange,
  onError,
  reportGeneratorRef,
}: FocusTrackerControllerProps) {
  const { currentState, isDistracted, metrics, report, error, isCameraAvailable, getLiveReport } =
    useFocusTracker({ enabled, sessionId, userId, sensitivity });

  // Expose live report generator via imperative ref so the parent can grab
  // a fresh report at leave-time without waiting for the tracker to stop.
  useEffect(() => {
    if (!reportGeneratorRef) return;
    reportGeneratorRef.current = getLiveReport;
    return () => {
      if (reportGeneratorRef.current === getLiveReport) {
        reportGeneratorRef.current = null;
      }
    };
  }, [getLiveReport, reportGeneratorRef]);

  const prevState = useRef(currentState);
  const prevCameraAvailable = useRef(isCameraAvailable);
  const reportHandled = useRef(false);

  // Emit state changes
  useEffect(() => {
    if (prevState.current !== currentState) {
      prevState.current = currentState;
      onStateChange?.(currentState, isDistracted);
    }
  }, [currentState, isDistracted, onStateChange]);

  // Emit metrics updates
  useEffect(() => {
    onMetricsUpdate?.(metrics);
  }, [metrics, onMetricsUpdate]);

  // Emit report when it's generated
  useEffect(() => {
    if (report && !reportHandled.current) {
      reportHandled.current = true;
      onReport?.(report);
    }
  }, [report, onReport]);

  // Reset report flag when re-enabled
  useEffect(() => {
    if (enabled) {
      reportHandled.current = false;
    }
  }, [enabled]);

  // Emit camera availability changes
  useEffect(() => {
    if (prevCameraAvailable.current !== isCameraAvailable) {
      prevCameraAvailable.current = isCameraAvailable;
      onCameraAvailabilityChange?.(isCameraAvailable);
    }
  }, [isCameraAvailable, onCameraAvailabilityChange]);

  // Emit errors
  useEffect(() => {
    if (error) {
      onError?.(error);
    }
  }, [error, onError]);

  return null; // Invisible bridge component
}
