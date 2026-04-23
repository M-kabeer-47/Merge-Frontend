/**
 * Focus Tracker — Shared Types
 *
 * All types, interfaces, and constants used across the focus tracker system.
 * No runtime code — only type exports and const definitions.
 */

// ─── Frame-level classification ──────────────────────────────────────────────

export type FrameKind =
  | "focused"
  | "no_face"
  | "looking_away"
  | "eyes_closed"
  | "drowsy"
  | "looking_down"
  | "tab_switched"
  | "multi_face";

export type FrameState =
  | { kind: "focused" }
  | { kind: "no_face" }
  | { kind: "looking_away"; reason: "head" | "gaze" }
  | { kind: "eyes_closed" }
  | { kind: "drowsy"; reason: "yawn" | "prolonged_eye_closure" }
  | { kind: "looking_down" }
  | { kind: "tab_switched" }
  | { kind: "multi_face"; count: number };

// ─── Session-level events ────────────────────────────────────────────────────

export interface SessionEvent {
  state: FrameKind;
  startedAt: number; // ms since trackingStartedAt
  endedAt: number | null; // null while active
  durationMs: number; // computed: endedAt - startedAt (or now - startedAt if active)
}

// ─── Report ──────────────────────────────────────────────────────────────────

export interface SessionReport {
  sessionId: string;
  userId: string;
  trackingStartedAt: number; // epoch ms
  trackingEndedAt: number; // epoch ms
  totalDurationMs: number;
  focusedMs: number;
  distractedMs: number; // sum of looking_away + eyes_closed
  noFaceMs: number;
  focusScore: number; // 0-100: round(focusedMs / totalDurationMs * 100)
  longestFocusedStreakMs: number;
  events: SessionEvent[]; // full timeline
}

// ─── Live metrics (updated while tracking) ───────────────────────────────────

export interface FocusMetrics {
  focusedMs: number;
  distractedMs: number;
  noFaceMs: number;
  focusScore: number;
  longestFocusedStreakMs: number;
  currentStreakMs: number;
  eventCount: number;
  distractionCount: number;
}

// ─── Sensitivity ─────────────────────────────────────────────────────────────

export type Sensitivity = "strict" | "normal" | "relaxed";

/**
 * Thresholds that vary by sensitivity level.
 *
 * - yawDeg / pitchDeg: head pose thresholds in degrees.
 * - eyeBlink: blendshape threshold for detecting closed eyes.
 * - gazeOut: combined gaze blendshape threshold for looking sideways.
 * - debounce: how long (ms) a state must be sustained before transition.
 */
export interface SensitivityThresholds {
  yawDeg: number;
  pitchDeg: number;
  eyeBlink: number;
  gazeOut: number;
  /** Blendshape `jawOpen` threshold; when exceeded for yawnHoldMs → drowsy. */
  yawn: number;
  yawnHoldMs: number;
  /** Average of eyeLookDownLeft/Right; when exceeded → looking_down. */
  lookDown: number;
  /** Eyes-closed beyond this duration is reclassified as drowsy. */
  drowsyEyesClosedMs: number;
  debounce: {
    focused: number;
    no_face: number;
    looking_away: number;
    eyes_closed: number;
    drowsy: number;
    looking_down: number;
    tab_switched: number;
    multi_face: number;
  };
}

export const SENSITIVITY_PRESETS: Record<Sensitivity, SensitivityThresholds> = {
  strict: {
    yawDeg: 18,
    pitchDeg: 14,
    eyeBlink: 0.45,
    gazeOut: 0.7,
    yawn: 0.5,
    yawnHoldMs: 500,
    lookDown: 0.4,
    drowsyEyesClosedMs: 2500,
    debounce: {
      focused: 400,
      no_face: 800,
      looking_away: 400,
      eyes_closed: 400,
      drowsy: 800,
      looking_down: 500,
      tab_switched: 0,
      multi_face: 800,
    },
  },
  normal: {
    yawDeg: 25,
    pitchDeg: 20,
    eyeBlink: 0.55,
    gazeOut: 0.9,
    yawn: 0.55,
    yawnHoldMs: 600,
    lookDown: 0.45,
    drowsyEyesClosedMs: 3000,
    debounce: {
      focused: 600,
      no_face: 1200,
      looking_away: 700,
      eyes_closed: 600,
      drowsy: 1000,
      looking_down: 800,
      tab_switched: 0,
      multi_face: 1200,
    },
  },
  relaxed: {
    yawDeg: 35,
    pitchDeg: 28,
    eyeBlink: 0.65,
    gazeOut: 1.1,
    yawn: 0.6,
    yawnHoldMs: 800,
    lookDown: 0.5,
    drowsyEyesClosedMs: 4000,
    debounce: {
      focused: 800,
      no_face: 1800,
      looking_away: 1200,
      eyes_closed: 900,
      drowsy: 1500,
      looking_down: 1200,
      tab_switched: 0,
      multi_face: 1800,
    },
  },
};

// ─── Configuration ───────────────────────────────────────────────────────────

export interface FocusTrackerConfig {
  sessionId: string;
  userId: string;
  sensitivity: Sensitivity;
  /** Max inference FPS. Default 10. */
  maxFps?: number;
  /** Downscale resolution for inference. Default 320×240. */
  inferenceWidth?: number;
  inferenceHeight?: number;
  /** Model path relative to origin. Default "/models/face_landmarker.task". */
  modelPath?: string;
}

export const DEFAULT_CONFIG: Omit<Required<FocusTrackerConfig>, "sessionId" | "userId"> = {
  sensitivity: "normal",
  maxFps: 10,
  inferenceWidth: 320,
  inferenceHeight: 240,
  modelPath: "/models/face_landmarker.task",
};
