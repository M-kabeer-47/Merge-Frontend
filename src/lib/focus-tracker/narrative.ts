/**
 * Narrative + suggestions generator for a focus session report.
 *
 * Takes a SessionReport and walks the events in chronological order,
 * producing a list of timestamped sentences that read like a story
 * ("Focused for 4m 23s, then yawned at 4:23, then looked away 4:30–4:52…").
 *
 * Suggestions are rule-based, driven by aggregates of the events.
 */

import type { FrameKind, SessionEvent, SessionReport } from "./types";

export interface NarrativeSegment {
  kind: "focused" | "distraction";
  state: FrameKind;
  /** ms since trackingStartedAt */
  startMs: number;
  durationMs: number;
  text: string;
}

function formatClock(ms: number): string {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

function formatDuration(ms: number): string {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000));
  if (totalSeconds < 60) return `${totalSeconds}s`;
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return seconds > 0 ? `${minutes}m ${seconds}s` : `${minutes}m`;
}

/**
 * Phrasing per state. Keyed by FrameKind.
 */
function phraseEvent(event: SessionEvent): string {
  const clock = formatClock(event.startedAt);
  const dur = formatDuration(event.durationMs);
  // Generic phrasing — we deliberately don't call out which kind of
  // distraction it was. The underlying state still drives detection,
  // sound alerts, and the timeline strip's color, but the user-facing
  // text just says "distracted."
  if (event.state === "focused") {
    return `Focused for ${dur}`;
  }
  return `Distracted at ${clock} for ${dur}`;
}

/**
 * Build a chronological narrative from the report's event timeline.
 *
 * Very short focused segments (< 3s) between two distractions are dropped
 * so the narrative reads as a sequence of distinct moments, not a ticker.
 */
export function buildNarrative(report: SessionReport): NarrativeSegment[] {
  if (!report.events || report.events.length === 0) return [];

  const MIN_FOCUSED_DURATION_MS = 3000;

  const filtered = report.events.filter((e) => {
    if (e.state === "focused" && e.durationMs < MIN_FOCUSED_DURATION_MS) return false;
    return true;
  });

  return filtered.map((e) => ({
    kind: e.state === "focused" ? "focused" : "distraction",
    state: e.state as FrameKind,
    startMs: e.startedAt,
    durationMs: e.durationMs,
    text: phraseEvent(e),
  }));
}

/**
 * Rule-based suggestions driven by aggregate metrics only — no per-state
 * callouts. Score and overall distraction frequency drive the advice.
 */
export function buildSuggestions(report: SessionReport): string[] {
  if (!report.events || report.totalDurationMs <= 0) {
    return ["Focus tracking captured no data this session."];
  }

  const distractionCount = report.events.filter((e) => e.state !== "focused").length;
  const sessionMinutes = report.totalDurationMs / 60000;
  const distractionsPerHour =
    sessionMinutes > 0 ? distractionCount / (sessionMinutes / 60) : 0;
  const suggestions: string[] = [];

  if (report.focusScore >= 85) {
    suggestions.push("Strong focus this session — keep this setup.");
  } else if (report.focusScore >= 70) {
    suggestions.push("Solid focus overall — small improvements only.");
  } else if (report.focusScore >= 50) {
    suggestions.push(
      "Focus dipped a few times. A quieter environment and fewer open apps usually help.",
    );
  } else {
    suggestions.push(
      "Focus was hard to hold this session. Try a shorter focused burst (20–25 min Pomodoro) and remove obvious distractions before starting.",
    );
  }

  if (distractionsPerHour > 12) {
    suggestions.push(
      "Distractions were frequent. Closing extra tabs and silencing notifications before your next session should help.",
    );
  }

  if (sessionMinutes > 45 && report.focusScore < 70) {
    suggestions.push(
      "Long sessions amplify drift — consider breaking your work into shorter chunks with brief breaks.",
    );
  }

  return suggestions.slice(0, 3);
}
