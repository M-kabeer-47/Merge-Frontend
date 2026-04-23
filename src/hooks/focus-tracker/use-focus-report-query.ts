/**
 * useFocusReportQuery — Fetches the current user's focus report for a session.
 *
 * Used by the "View My Focus Report" flow on past session cards. Returns
 * null when no report was saved for the user/session pair.
 */

"use client";

import { useQuery } from "@tanstack/react-query";
import api from "@/utils/api";
import type { SessionReport } from "@/lib/focus-tracker/types";

interface ApiFocusReport {
  id: string;
  sessionId: string;
  userId: string;
  focusScore: number;
  totalDurationMs: number;
  focusedMs: number;
  distractedMs: number;
  noFaceMs: number;
  longestFocusedStreakMs: number;
  trackingStartedAt: number;
  trackingEndedAt: number;
  events: SessionReport["events"];
  createdAt: string;
}

interface ApiResponse {
  report: ApiFocusReport | null;
}

export function useFocusReportQuery(sessionId: string, enabled: boolean) {
  return useQuery<SessionReport | null>({
    queryKey: ["focus-report", sessionId, "me"],
    enabled: enabled && !!sessionId,
    queryFn: async () => {
      const response = await api.get<ApiResponse>(
        `/live-sessions/${sessionId}/focus-report/me`,
      );
      const r = response.data.report;
      if (!r) return null;
      return {
        sessionId: r.sessionId,
        userId: r.userId,
        trackingStartedAt: Number(r.trackingStartedAt),
        trackingEndedAt: Number(r.trackingEndedAt),
        totalDurationMs: Number(r.totalDurationMs),
        focusedMs: Number(r.focusedMs),
        distractedMs: Number(r.distractedMs),
        noFaceMs: Number(r.noFaceMs),
        focusScore: r.focusScore,
        longestFocusedStreakMs: Number(r.longestFocusedStreakMs),
        events: r.events ?? [],
      };
    },
  });
}
