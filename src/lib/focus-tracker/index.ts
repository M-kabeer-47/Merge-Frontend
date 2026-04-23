/**
 * Focus Tracker — Public API
 */

export { FocusTracker } from "./FocusTracker";
export { classifyFrame } from "./classify";
export { decomposeMatrix } from "./headPose";
export type {
  FrameKind,
  FrameState,
  SessionEvent,
  SessionReport,
  FocusMetrics,
  FocusTrackerConfig,
  Sensitivity,
  SensitivityThresholds,
} from "./types";
export { SENSITIVITY_PRESETS, DEFAULT_CONFIG } from "./types";
