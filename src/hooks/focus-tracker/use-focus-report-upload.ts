/**
 * useFocusReportUpload — React Query mutation for uploading focus reports.
 *
 * Uses the project's api instance from @/utils/api.
 */

import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/utils/api";
import type { SessionReport } from "@/lib/focus-tracker/types";

export function useFocusReportUpload() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async ({
      sessionId,
      report,
    }: {
      sessionId: string;
      report: SessionReport;
    }) => {
      const response = await api.post<{ ok: boolean; focusScore: number }>(
        `/live-sessions/${sessionId}/focus-report`,
        {
          trackingStartedAt: report.trackingStartedAt,
          trackingEndedAt: report.trackingEndedAt,
          totalDurationMs: report.totalDurationMs,
          focusedMs: report.focusedMs,
          distractedMs: report.distractedMs,
          noFaceMs: report.noFaceMs,
          focusScore: report.focusScore,
          longestFocusedStreakMs: report.longestFocusedStreakMs,
          events: report.events.slice(0, 5000), // Cap to match DTO limit
        },
      );
      return response.data;
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["focus-report", variables.sessionId],
      });
    },
  });

  return {
    uploadReport: mutation.mutateAsync,
    isUploading: mutation.isPending,
    uploadError: mutation.error,
  };
}

// ─── sendBeacon fallback for tab close ─────────────────────────────────────

/**
 * Fire-and-forget upload via navigator.sendBeacon.
 * Used in beforeunload/pagehide when a clean mutation isn't possible.
 *
 * sendBeacon has a ~64 KB limit; we truncate events if needed.
 */
export function sendFocusReportBeacon(
  sessionId: string,
  report: SessionReport,
): boolean {
  if (typeof navigator === "undefined" || !navigator.sendBeacon) return false;

  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "";
  if (!backendUrl) return false;

  const normalizedBase = backendUrl.endsWith("/")
    ? backendUrl.slice(0, -1)
    : backendUrl;
  const url = `${normalizedBase}/live-sessions/${sessionId}/focus-report`;

  // Trim events to fit under 64KB
  let events = report.events;
  let payload = JSON.stringify({ ...report, events });
  if (payload.length > 60000) {
    events = events.slice(-500); // Keep most recent
    payload = JSON.stringify({ ...report, events });
  }

  const blob = new Blob([payload], { type: "application/json" });
  return navigator.sendBeacon(url, blob);
}

// ─── localStorage fallback ─────────────────────────────────────────────────

const PENDING_REPORT_PREFIX = "focus-report-pending-";

export function stashPendingReport(
  sessionId: string,
  report: SessionReport,
): void {
  try {
    localStorage.setItem(
      `${PENDING_REPORT_PREFIX}${sessionId}`,
      JSON.stringify(report),
    );
  } catch {
    // localStorage full or unavailable — silently fail
  }
}

export async function flushPendingReports(): Promise<void> {
  if (typeof window === "undefined") return;

  const keys: string[] = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key?.startsWith(PENDING_REPORT_PREFIX)) {
      keys.push(key);
    }
  }

  for (const key of keys) {
    const sessionId = key.replace(PENDING_REPORT_PREFIX, "");
    const raw = localStorage.getItem(key);
    if (!raw) continue;

    try {
      const report: SessionReport = JSON.parse(raw);
      await api.post(`/live-sessions/${sessionId}/focus-report`, {
        trackingStartedAt: report.trackingStartedAt,
        trackingEndedAt: report.trackingEndedAt,
        totalDurationMs: report.totalDurationMs,
        focusedMs: report.focusedMs,
        distractedMs: report.distractedMs,
        noFaceMs: report.noFaceMs,
        focusScore: report.focusScore,
        longestFocusedStreakMs: report.longestFocusedStreakMs,
        events: report.events.slice(0, 5000),
      });
      localStorage.removeItem(key);
    } catch {
      // Will retry on next app load
    }
  }
}
