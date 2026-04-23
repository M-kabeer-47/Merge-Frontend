/**
 * FocusReportDialog — Post-session focus report modal.
 *
 * Shows: focus score, time breakdowns, a color-coded timeline strip, a
 * chronological narrative of what happened during the session, and
 * rule-based suggestions.
 *
 * Works in two modes:
 *   - "live": shown right after a user leaves a session; displays "Saved ✓"
 *   - "historical": opened from a past session card; no save state shown
 */

"use client";

import { useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Download,
  Target,
  Clock,
  AlertTriangle,
  Eye,
  CheckCircle2,
  Loader2,
  Lightbulb,
} from "lucide-react";
import type { SessionReport, FrameKind } from "@/lib/focus-tracker/types";
import { buildNarrative, buildSuggestions } from "@/lib/focus-tracker/narrative";

interface FocusReportDialogProps {
  isOpen: boolean;
  onClose: () => void;
  report: SessionReport;
  /** "live" = just finished; "historical" = viewing a saved report */
  mode?: "live" | "historical";
  /** Upload state (only meaningful in "live" mode) */
  isUploading?: boolean;
  uploadError?: unknown;
}

const STATE_COLORS: Record<FrameKind, string> = {
  focused: "#22c55e",
  no_face: "#f59e0b",
  looking_away: "#ef4444",
  eyes_closed: "#8b5cf6",
  drowsy: "#6366f1",
  looking_down: "#f97316",
  tab_switched: "#e11d48",
  multi_face: "#14b8a6",
};

const STATE_LABELS: Record<FrameKind, string> = {
  focused: "Focused",
  no_face: "No Face",
  looking_away: "Looking Away",
  eyes_closed: "Eyes Closed",
  drowsy: "Drowsy",
  looking_down: "Looking Down",
  tab_switched: "Tab Switched",
  multi_face: "Multiple Faces",
};

function formatDuration(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  if (minutes > 0) {
    return `${minutes}m ${seconds.toString().padStart(2, "0")}s`;
  }
  return `${seconds}s`;
}

function getScoreColor(score: number): string {
  if (score >= 80) return "#22c55e";
  if (score >= 60) return "#f59e0b";
  return "#ef4444";
}

function getScoreLabel(score: number): string {
  if (score >= 90) return "Excellent";
  if (score >= 80) return "Great";
  if (score >= 70) return "Good";
  if (score >= 60) return "Fair";
  if (score >= 40) return "Needs Improvement";
  return "Poor";
}

export default function FocusReportDialog({
  isOpen,
  onClose,
  report,
  mode = "live",
  isUploading = false,
  uploadError = null,
}: FocusReportDialogProps) {
  const distractionEvents = report.events.filter((e) => e.state !== "focused");
  const narrative = useMemo(() => buildNarrative(report), [report]);
  const suggestions = useMemo(() => buildSuggestions(report), [report]);

  const handleDownloadJson = () => {
    const blob = new Blob([JSON.stringify(report, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `focus-report-${report.sessionId}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Count events by type
  const eventCounts: Record<string, number> = {};
  for (const ev of distractionEvents) {
    eventCounts[ev.state] = (eventCounts[ev.state] || 0) + 1;
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[120] flex items-center justify-center bg-black/70 backdrop-blur p-4"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="w-full max-w-lg rounded-2xl border border-white/10 bg-[#1e1f23] text-white shadow-2xl max-h-[90vh] overflow-y-auto"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-white/10">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#1a73e8]/20 flex items-center justify-center">
                  <Target className="w-5 h-5 text-[#8ab4f8]" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold">Focus Report</h2>
                  <p className="text-xs text-white/50">
                    Analysed locally in your browser
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full hover:bg-white/10 flex items-center justify-center transition-colors"
              >
                <X className="w-5 h-5 text-white/70" />
              </button>
            </div>

            {/* Score */}
            <div className="p-5 flex flex-col items-center border-b border-white/5">
              <div
                className="text-6xl font-bold tabular-nums"
                style={{ color: getScoreColor(report.focusScore) }}
              >
                {report.focusScore}
              </div>
              <div
                className="text-sm font-medium mt-1"
                style={{ color: getScoreColor(report.focusScore) }}
              >
                {getScoreLabel(report.focusScore)}
              </div>
              <div className="text-xs text-white/40 mt-1">Focus Score</div>
              {mode === "live" && (
                <div className="mt-2 text-xs flex items-center gap-1.5">
                  {isUploading ? (
                    <span className="flex items-center gap-1.5 text-white/50">
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      Saving report…
                    </span>
                  ) : uploadError ? (
                    <span className="text-amber-400">
                      Report couldn&apos;t be uploaded — it&apos;s queued locally and will retry.
                    </span>
                  ) : (
                    <span className="flex items-center gap-1.5 text-green-400">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Saved
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-3 p-5 border-b border-white/5">
              <div className="bg-[#2a2d32] rounded-xl p-3">
                <div className="flex items-center gap-1.5 text-white/50 text-xs mb-1">
                  <Eye className="w-3.5 h-3.5" />
                  Time Focused
                </div>
                <div className="text-lg font-semibold text-green-400">
                  {formatDuration(report.focusedMs)}
                </div>
              </div>
              <div className="bg-[#2a2d32] rounded-xl p-3">
                <div className="flex items-center gap-1.5 text-white/50 text-xs mb-1">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  Time Distracted
                </div>
                <div className="text-lg font-semibold text-red-400">
                  {formatDuration(report.distractedMs)}
                </div>
              </div>
              <div className="bg-[#2a2d32] rounded-xl p-3">
                <div className="flex items-center gap-1.5 text-white/50 text-xs mb-1">
                  <Clock className="w-3.5 h-3.5" />
                  Longest Streak
                </div>
                <div className="text-lg font-semibold text-blue-400">
                  {formatDuration(report.longestFocusedStreakMs)}
                </div>
              </div>
              <div className="bg-[#2a2d32] rounded-xl p-3">
                <div className="flex items-center gap-1.5 text-white/50 text-xs mb-1">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  Distractions
                </div>
                <div className="text-lg font-semibold text-amber-400">
                  {distractionEvents.length}
                </div>
              </div>
            </div>

            {/* Distraction breakdown */}
            {Object.keys(eventCounts).length > 0 && (
              <div className="px-5 py-3 border-b border-white/5">
                <div className="text-xs text-white/50 mb-2">
                  Distraction Breakdown
                </div>
                <div className="flex gap-3 flex-wrap">
                  {Object.entries(eventCounts).map(([state, count]) => (
                    <div key={state} className="flex items-center gap-1.5 text-xs">
                      <span
                        className="w-2 h-2 rounded-full"
                        style={{
                          backgroundColor:
                            STATE_COLORS[state as FrameKind] || "#666",
                        }}
                      />
                      <span className="text-white/70">
                        {STATE_LABELS[state as FrameKind] || state}
                      </span>
                      <span className="text-white/40">×{count}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Timeline Strip */}
            {report.events.length > 0 && report.totalDurationMs > 0 && (
              <div className="px-5 py-3 border-b border-white/5">
                <div className="text-xs text-white/50 mb-2">Timeline</div>
                <div className="flex h-5 rounded-full overflow-hidden bg-[#2a2d32]">
                  {report.events.map((ev, i) => {
                    const widthPct =
                      (ev.durationMs / report.totalDurationMs) * 100;
                    if (widthPct < 0.3) return null; // Skip tiny slivers
                    return (
                      <div
                        key={i}
                        className="h-full transition-all"
                        style={{
                          width: `${widthPct}%`,
                          backgroundColor:
                            STATE_COLORS[ev.state as FrameKind] || "#444",
                          minWidth: "1px",
                        }}
                        title={`${STATE_LABELS[ev.state as FrameKind] || ev.state} — ${formatDuration(ev.durationMs)}`}
                      />
                    );
                  })}
                </div>
                <div className="flex justify-between text-[10px] text-white/30 mt-1">
                  <span>Start</span>
                  <span>{formatDuration(report.totalDurationMs)}</span>
                </div>
              </div>
            )}

            {/* What happened (narrative) */}
            {narrative.length > 0 && (
              <div className="px-5 py-3 border-b border-white/5">
                <div className="text-xs text-white/50 mb-2">What happened</div>
                <ol className="space-y-1.5 max-h-60 overflow-y-auto pr-1">
                  {narrative.map((seg, i) => {
                    const color = STATE_COLORS[seg.state] || "#666";
                    return (
                      <li
                        key={i}
                        className="flex items-start gap-2 text-xs text-white/80"
                      >
                        <span
                          className="mt-1 w-1.5 h-1.5 rounded-full flex-shrink-0"
                          style={{ backgroundColor: color }}
                        />
                        <span className="leading-snug">{seg.text}</span>
                      </li>
                    );
                  })}
                </ol>
              </div>
            )}

            {/* Suggestions */}
            {suggestions.length > 0 && (
              <div className="px-5 py-3 border-b border-white/5">
                <div className="text-xs text-white/50 mb-2 flex items-center gap-1.5">
                  <Lightbulb className="w-3.5 h-3.5" />
                  Suggestions
                </div>
                <ul className="space-y-1.5">
                  {suggestions.map((s, i) => (
                    <li key={i} className="text-xs text-white/80 leading-snug pl-1">
                      • {s}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Footer */}
            <div className="flex items-center justify-between p-4">
              <button
                onClick={handleDownloadJson}
                className="flex items-center gap-1.5 text-xs text-white/50 hover:text-white/80 transition-colors px-3 py-1.5 rounded-lg hover:bg-white/5"
              >
                <Download className="w-3.5 h-3.5" />
                Download JSON
              </button>
              <button
                onClick={onClose}
                className="px-5 py-2 rounded-lg bg-[#1a73e8] hover:bg-[#1557b0] text-sm font-medium transition-colors"
              >
                Close
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
