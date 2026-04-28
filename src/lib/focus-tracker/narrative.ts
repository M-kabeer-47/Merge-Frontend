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
 * Rule-based suggestions driven by what actually happened in the session.
 *
 * Inspects the underlying state taxonomy (tab_switched, drowsy, no_face,
 * multi_face, looking_away, eyes_closed) so the advice is grounded in the
 * real distraction reasons. The user-facing labels and per-state count
 * tiles are still hidden — only the suggestions reach for specifics, since
 * generic "improve your focus" copy isn't actionable.
 */
export function buildSuggestions(report: SessionReport): string[] {
  if (!report.events || report.totalDurationMs <= 0) {
    return ["Focus tracking captured no data this session."];
  }

  const counts: Record<string, number> = {};
  const durations: Record<string, number> = {};
  for (const e of report.events) {
    counts[e.state] = (counts[e.state] || 0) + 1;
    durations[e.state] = (durations[e.state] || 0) + e.durationMs;
  }

  const totalMs = report.totalDurationMs;
  const sessionMinutes = totalMs / 60000;
  const suggestions: string[] = [];

  // Tab / window switching — usually the most actionable.
  if ((counts["tab_switched"] || 0) >= 3) {
    suggestions.push(
      "You switched away from this tab several times. Close non-essential tabs and silence notifications before your next session.",
    );
  }

  // Drowsiness signals — sustained eye closure.
  if ((counts["drowsy"] || 0) >= 1) {
    suggestions.push(
      "You showed signs of drowsiness. A short break, water, or studying at a different time of day can help.",
    );
  }

  // Frequent or sustained eyes-closed (without escalating to drowsy).
  if ((durations["eyes_closed"] || 0) > totalMs * 0.05) {
    suggestions.push(
      "Your eyes were closed for noticeable stretches. If you're tired, a quick rest or splash of water usually helps.",
    );
  }

  // Out-of-frame — almost always a camera placement problem.
  if ((durations["no_face"] || 0) > totalMs * 0.12) {
    suggestions.push(
      "Your face was often out of frame. Adjust your camera angle so it stays on you for the whole session.",
    );
  }

  // Looking away — head turns or sustained gaze drift off-screen.
  if ((durations["looking_away"] || 0) > totalMs * 0.1) {
    suggestions.push(
      "You looked away from the screen often. Keep your study materials directly in front of you to reduce head turns.",
    );
  }

  // Other people in the frame.
  if ((counts["multi_face"] || 0) >= 1) {
    suggestions.push(
      "Other people entered the camera frame. A quieter, more private spot tends to sustain focus better.",
    );
  }

  // Long-session fatigue — only add when nothing more specific has been said.
  if (suggestions.length < 2 && sessionMinutes > 45 && report.focusScore < 70) {
    suggestions.push(
      "This was a long session. Breaking your work into 25-minute Pomodoros with brief breaks usually helps sustain focus.",
    );
  }

  // Fallback: positive reinforcement when no specific issues stand out.
  if (suggestions.length === 0) {
    if (report.focusScore >= 85) {
      suggestions.push("Strong focus this session — keep this setup.");
    } else if (report.focusScore >= 70) {
      suggestions.push("Solid focus overall — small improvements only.");
    } else {
      suggestions.push(
        "Focus dipped a few times but no single cause stood out. Try a shorter focused burst next time.",
      );
    }
  }

  return suggestions.slice(0, 4);
}
