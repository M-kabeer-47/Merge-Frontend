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
  // Use loose matching so legacy event states (e.g. "looking_down" in reports
  // saved before we collapsed the taxonomy) still render sensibly.
  switch (event.state as string) {
    case "focused":
      return `Focused for ${dur}`;
    case "looking_away":
    case "looking_down":
      return `Looked away at ${clock} for ${dur}`;
    case "eyes_closed":
      return `Closed eyes at ${clock} for ${dur}`;
    case "drowsy":
      return `Signs of drowsiness at ${clock} — prolonged eye closure`;
    case "no_face":
      return `Left the frame at ${clock} for ${dur}`;
    case "tab_switched":
      return `Switched away from the session tab at ${clock} for ${dur}`;
    case "multi_face":
      return `Another person entered the frame at ${clock}`;
    default:
      return `Distraction at ${clock}`;
  }
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
 * Rule-based suggestions driven by event aggregates.
 */
export function buildSuggestions(report: SessionReport): string[] {
  const suggestions: string[] = [];

  if (!report.events) return ["Focus tracking captured no data this session."];

  const counts: Record<string, number> = {};
  const durations: Record<string, number> = {};
  for (const e of report.events) {
    counts[e.state] = (counts[e.state] || 0) + 1;
    durations[e.state] = (durations[e.state] || 0) + e.durationMs;
  }

  const sessionMinutes = report.totalDurationMs / 60000;

  if (report.focusScore < 60 && sessionMinutes > 30) {
    suggestions.push(
      "Try shorter focused bursts — a 20–25 minute Pomodoro often works better than pushing through.",
    );
  }

  if ((counts["tab_switched"] || 0) >= 3) {
    suggestions.push(
      "You switched tabs several times. Close non-essential tabs before your next session to reduce pull.",
    );
  }

  if ((counts["drowsy"] || 0) >= 1) {
    suggestions.push(
      "Drowsiness was detected. Consider a short break, some water, or studying at a different time of day.",
    );
  }

  const noFaceMs = durations["no_face"] || 0;
  if (noFaceMs > report.totalDurationMs * 0.15) {
    suggestions.push(
      "Your face was often out of frame. Adjust your camera angle so your face stays visible throughout.",
    );
  }

  if ((counts["multi_face"] || 0) >= 1) {
    suggestions.push(
      "Other people entered the camera frame. A quieter environment helps sustain focus.",
    );
  }

  if (suggestions.length === 0) {
    if (report.focusScore >= 80) {
      suggestions.push("Strong focus this session — keep this setup.");
    } else {
      suggestions.push("Your focus was mostly good — only small improvements needed.");
    }
  }

  return suggestions.slice(0, 4);
}
