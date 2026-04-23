/**
 * FocusTracker — Framework-agnostic focus tracking engine
 *
 * Takes a MediaStreamTrack (from LiveKit), runs MediaPipe Face Landmarker
 * inference at ≤10 fps on a downscaled frame, classifies focus state,
 * debounces transitions, and emits events.
 *
 * 100% client-side. No frames leave the browser.
 *
 * Usage:
 *   const tracker = new FocusTracker(config);
 *   await tracker.start(mediaStreamTrack);
 *   tracker.onStateChange((state, event) => { ... });
 *   // later:
 *   tracker.stop();
 *   const report = tracker.getReport();
 */

import { FaceLandmarker, FilesetResolver } from "@mediapipe/tasks-vision";
import { classifyFrame } from "./classify";
import type {
  FocusTrackerConfig,
  FrameKind,
  FrameState,
  SessionEvent,
  SessionReport,
  FocusMetrics,
  SensitivityThresholds,
} from "./types";
import { SENSITIVITY_PRESETS } from "./types";

// ─── Helpers ─────────────────────────────────────────────────────────────────

type StateChangeCallback = (state: FrameKind, event: SessionEvent) => void;
type ErrorCallback = (err: Error) => void;

/** Merge user config with defaults. */
function resolveConfig(cfg: FocusTrackerConfig): Required<FocusTrackerConfig> {
  return {
    maxFps: 10,
    inferenceWidth: 320,
    inferenceHeight: 240,
    modelPath: "/models/face_landmarker.task",
    ...cfg,
  };
}

/** Every state except "focused" counts toward distractions. */
function isDistractionKind(kind: FrameKind): boolean {
  return kind !== "focused";
}

// ─── FocusTracker class ──────────────────────────────────────────────────────

export class FocusTracker {
  // Config
  private config: Required<FocusTrackerConfig>;
  private thresholds: SensitivityThresholds;

  // MediaPipe
  private landmarker: FaceLandmarker | null = null;

  // Video pipeline
  private videoEl: HTMLVideoElement | null = null;
  private canvas: OffscreenCanvas | null = null;
  private canvasCtx: OffscreenCanvasRenderingContext2D | null = null;

  // State
  private running = false;
  private started = false;
  private rafId: number | null = null;
  private lastInferenceTime = 0;
  private frameIntervalMs: number;

  // Debounced state machine
  private currentDebouncedState: FrameKind = "focused";
  private pendingState: FrameKind | null = null;
  private pendingStateSince = 0;

  // Timeline
  private trackingStartedAt = 0;
  private events: SessionEvent[] = [];
  private currentEvent: SessionEvent | null = null;

  // Metrics
  private focusedMs = 0;
  private distractedMs = 0;
  private noFaceMs = 0;
  private longestFocusedStreakMs = 0;
  private currentFocusedStreakStart: number | null = null;
  private lastMetricsUpdate = 0;
  private distractionCount = 0;

  // Performance auto-throttle
  private recentInferenceTimes: number[] = [];
  private throttled = false;

  // Callbacks
  private stateChangeCallbacks: StateChangeCallback[] = [];
  private errorCallbacks: ErrorCallback[] = [];

  // Visibility / tab switch
  private boundVisibilityHandler: (() => void) | null = null;
  private boundWindowBlurHandler: (() => void) | null = null;
  private boundWindowFocusHandler: (() => void) | null = null;
  /** State the tracker was in before tab_switched — restored on return. */
  private preTabSwitchState: FrameKind | null = null;

  constructor(config: FocusTrackerConfig) {
    this.config = resolveConfig(config);
    this.thresholds = SENSITIVITY_PRESETS[this.config.sensitivity];
    this.frameIntervalMs = 1000 / this.config.maxFps;
  }

  // ── Public API ───────────────────────────────────────────────────────────

  /**
   * Start tracking on the given media track.
   * Idempotent — calling start() when already started is a no-op.
   */
  async start(track: MediaStreamTrack): Promise<void> {
    if (this.running) return;

    try {
      // 1. Initialize MediaPipe
      await this.initMediaPipe();

      // 2. Set up hidden video element
      this.videoEl = document.createElement("video");
      this.videoEl.setAttribute("playsinline", "");
      this.videoEl.setAttribute("autoplay", "");
      this.videoEl.muted = true;
      this.videoEl.srcObject = new MediaStream([track]);
      await this.videoEl.play();

      // 3. Set up OffscreenCanvas for downscaling
      this.canvas = new OffscreenCanvas(
        this.config.inferenceWidth,
        this.config.inferenceHeight,
      );
      this.canvasCtx = this.canvas.getContext("2d") as OffscreenCanvasRenderingContext2D;

      // 4. Start tracking
      this.running = true;
      this.started = true;
      this.trackingStartedAt = Date.now();
      this.lastMetricsUpdate = this.trackingStartedAt;

      // Initialize first event
      this.currentEvent = {
        state: "focused",
        startedAt: 0,
        endedAt: null,
        durationMs: 0,
      };
      this.currentDebouncedState = "focused";
      this.currentFocusedStreakStart = 0;

      // 5. Register visibility + window blur/focus handlers
      this.boundVisibilityHandler = this.handleVisibilityChange.bind(this);
      document.addEventListener("visibilitychange", this.boundVisibilityHandler);
      this.boundWindowBlurHandler = this.handleWindowBlur.bind(this);
      this.boundWindowFocusHandler = this.handleWindowFocus.bind(this);
      window.addEventListener("blur", this.boundWindowBlurHandler);
      window.addEventListener("focus", this.boundWindowFocusHandler);

      // 6. Start the inference loop
      this.scheduleNextFrame();
    } catch (err) {
      this.emitError(err instanceof Error ? err : new Error(String(err)));
      throw err;
    }
  }

  /**
   * Stop tracking and finalize the timeline.
   * Safe to call before start() or multiple times.
   */
  stop(): void {
    if (!this.started) return;

    this.running = false;

    // Cancel RAF
    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }

    // Finalize current event
    const now = Date.now();
    const elapsed = now - this.trackingStartedAt;
    if (this.currentEvent && this.currentEvent.endedAt === null) {
      this.currentEvent.endedAt = elapsed;
      this.currentEvent.durationMs = elapsed - this.currentEvent.startedAt;
      this.events.push({ ...this.currentEvent });
    }

    // Update final metrics
    this.updateRunningMetrics(now);

    // Close longest streak
    if (this.currentFocusedStreakStart !== null) {
      const streakMs = elapsed - this.currentFocusedStreakStart;
      if (streakMs > this.longestFocusedStreakMs) {
        this.longestFocusedStreakMs = streakMs;
      }
    }

    // Cleanup
    if (this.videoEl) {
      this.videoEl.srcObject = null;
      this.videoEl = null;
    }
    if (this.landmarker) {
      this.landmarker.close();
      this.landmarker = null;
    }
    if (this.boundVisibilityHandler) {
      document.removeEventListener("visibilitychange", this.boundVisibilityHandler);
      this.boundVisibilityHandler = null;
    }
    if (this.boundWindowBlurHandler) {
      window.removeEventListener("blur", this.boundWindowBlurHandler);
      this.boundWindowBlurHandler = null;
    }
    if (this.boundWindowFocusHandler) {
      window.removeEventListener("focus", this.boundWindowFocusHandler);
      this.boundWindowFocusHandler = null;
    }
    this.preTabSwitchState = null;

    this.canvas = null;
    this.canvasCtx = null;
    this.started = false;
  }

  /** Register a callback for debounced state changes. Returns unsubscribe fn. */
  onStateChange(cb: StateChangeCallback): () => void {
    this.stateChangeCallbacks.push(cb);
    return () => {
      this.stateChangeCallbacks = this.stateChangeCallbacks.filter((c) => c !== cb);
    };
  }

  /** Register a callback for errors. Returns unsubscribe fn. */
  onError(cb: ErrorCallback): () => void {
    this.errorCallbacks.push(cb);
    return () => {
      this.errorCallbacks = this.errorCallbacks.filter((c) => c !== cb);
    };
  }

  /** Get the current focus metrics (live-updating). */
  getMetrics(): FocusMetrics {
    if (this.running) {
      this.updateRunningMetrics(Date.now());
    }
    const totalMs = this.focusedMs + this.distractedMs + this.noFaceMs;
    return {
      focusedMs: this.focusedMs,
      distractedMs: this.distractedMs,
      noFaceMs: this.noFaceMs,
      focusScore: totalMs > 0 ? Math.round((this.focusedMs / totalMs) * 100) : 100,
      longestFocusedStreakMs: this.longestFocusedStreakMs,
      currentStreakMs:
        this.currentFocusedStreakStart !== null
          ? Date.now() - this.trackingStartedAt - this.currentFocusedStreakStart
          : 0,
      eventCount: this.events.length + (this.currentEvent ? 1 : 0),
      distractionCount: this.distractionCount,
    };
  }

  /**
   * Generate a report snapshot. Safe to call mid-session — it includes the
   * currently-open event and updates metrics to "now" — so the returned
   * report reflects the live state without needing a prior stop().
   */
  getReport(): SessionReport {
    const now = Date.now();
    if (this.running) {
      this.updateRunningMetrics(now);
    }
    const trackingEndedAt = this.started
      ? now
      : this.trackingStartedAt + this.focusedMs + this.distractedMs + this.noFaceMs;
    const totalMs = this.focusedMs + this.distractedMs + this.noFaceMs;

    // Build the event list including the currently-open event so a mid-session
    // snapshot doesn't drop the most recent activity.
    const eventsSnapshot: SessionEvent[] = [...this.events];
    if (this.currentEvent) {
      const elapsed = now - this.trackingStartedAt;
      eventsSnapshot.push({
        ...this.currentEvent,
        endedAt: this.currentEvent.endedAt ?? elapsed,
        durationMs:
          this.currentEvent.endedAt !== null
            ? this.currentEvent.durationMs
            : elapsed - this.currentEvent.startedAt,
      });
    }

    return {
      sessionId: this.config.sessionId,
      userId: this.config.userId,
      trackingStartedAt: this.trackingStartedAt,
      trackingEndedAt,
      totalDurationMs: totalMs,
      focusedMs: this.focusedMs,
      distractedMs: this.distractedMs,
      noFaceMs: this.noFaceMs,
      focusScore: totalMs > 0 ? Math.round((this.focusedMs / totalMs) * 100) : 100,
      longestFocusedStreakMs: this.longestFocusedStreakMs,
      events: eventsSnapshot,
    };
  }

  /** Get the current debounced state. */
  getCurrentState(): FrameKind {
    return this.currentDebouncedState;
  }

  // ── Private — MediaPipe initialization ───────────────────────────────────

  private async initMediaPipe(): Promise<void> {
    // Use CDN for WASM assets (Option A from plan)
    const vision = await FilesetResolver.forVisionTasks(
      "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm",
    );

    this.landmarker = await FaceLandmarker.createFromOptions(vision, {
      baseOptions: {
        modelAssetPath: this.config.modelPath,
        delegate: "GPU",
      },
      runningMode: "VIDEO",
      // Allow up to 2 so the multi_face distraction state can fire when
      // someone else walks into the camera frame.
      numFaces: 2,
      outputFaceBlendshapes: true,
      outputFacialTransformationMatrixes: true,
    });
  }

  // ── Private — Inference loop ─────────────────────────────────────────────

  private scheduleNextFrame(): void {
    if (!this.running) return;
    this.rafId = requestAnimationFrame((timestamp) => this.onFrame(timestamp));
  }

  private onFrame(timestamp: number): void {
    if (!this.running) return;

    // Tab backgrounded — skip
    if (document.hidden) {
      this.scheduleNextFrame();
      return;
    }

    // Frame rate gating
    const elapsed = timestamp - this.lastInferenceTime;
    if (elapsed < this.frameIntervalMs) {
      this.scheduleNextFrame();
      return;
    }

    this.lastInferenceTime = timestamp;

    try {
      this.runInference(timestamp);
    } catch (err) {
      this.emitError(err instanceof Error ? err : new Error(String(err)));
    }

    this.scheduleNextFrame();
  }

  private runInference(timestamp: number): void {
    if (!this.landmarker || !this.videoEl || !this.canvasCtx || !this.canvas) return;

    // Downscale frame
    this.canvasCtx.drawImage(
      this.videoEl,
      0,
      0,
      this.config.inferenceWidth,
      this.config.inferenceHeight,
    );

    // Run MediaPipe
    const inferenceStart = performance.now();

    // We need a regular canvas for MediaPipe (it doesn't accept OffscreenCanvas).
    // Transfer the offscreen content to a temporary ImageBitmap → regular canvas
    // Actually, MediaPipe detectForVideo needs an HTMLVideoElement, HTMLCanvasElement, or ImageData.
    // Let's use ImageData from the OffscreenCanvas.
    const imageData = this.canvasCtx.getImageData(
      0,
      0,
      this.config.inferenceWidth,
      this.config.inferenceHeight,
    );

    // Create a temporary canvas for MediaPipe
    if (!this._tmpCanvas) {
      this._tmpCanvas = document.createElement("canvas");
      this._tmpCanvas.width = this.config.inferenceWidth;
      this._tmpCanvas.height = this.config.inferenceHeight;
      this._tmpCtx = this._tmpCanvas.getContext("2d")!;
    }
    this._tmpCtx!.putImageData(imageData, 0, 0);

    const result = this.landmarker.detectForVideo(this._tmpCanvas!, timestamp);
    const inferenceMs = performance.now() - inferenceStart;

    // Auto-throttle: if inference is slow, drop to 5 fps
    this.recentInferenceTimes.push(inferenceMs);
    if (this.recentInferenceTimes.length > 30) this.recentInferenceTimes.shift();
    if (this.recentInferenceTimes.length >= 10) {
      const avgMs =
        this.recentInferenceTimes.reduce((a, b) => a + b, 0) /
        this.recentInferenceTimes.length;
      if (avgMs > 80 && !this.throttled) {
        this.throttled = true;
        this.frameIntervalMs = 200; // 5 fps
        console.warn(
          `[FocusTracker] Inference averaging ${avgMs.toFixed(1)}ms — throttling to 5 fps`,
        );
      }
    }

    // Classify
    const faceCount = result.faceLandmarks?.length ?? 0;
    const blendshapes = result.faceBlendshapes?.[0]?.categories;
    const matrix = result.facialTransformationMatrixes?.[0]?.data as number[] | undefined;

    const frameState = classifyFrame(faceCount, blendshapes, matrix, this.thresholds);

    // Feed into debounced state machine
    this.processFrameState(frameState);

    // Escalate sustained eyes_closed → drowsy without waiting for a new
    // candidate state from the classifier.
    this.escalateToDrowsyIfNeeded();
  }

  private escalateToDrowsyIfNeeded(): void {
    if (this.currentDebouncedState !== "eyes_closed" || !this.currentEvent) return;
    const elapsed = Date.now() - this.trackingStartedAt;
    const age = elapsed - this.currentEvent.startedAt;
    if (age >= this.thresholds.drowsyEyesClosedMs) {
      // Synthetic transition — reuse processFrameState so metrics and events stay consistent.
      this.forceStateTransition("drowsy");
    }
  }

  private forceStateTransition(next: FrameKind): void {
    if (this.currentDebouncedState === next) return;
    const now = Date.now();
    const elapsed = now - this.trackingStartedAt;
    const prevState = this.currentDebouncedState;

    this.updateRunningMetrics(now);

    if (this.currentEvent) {
      this.currentEvent.endedAt = elapsed;
      this.currentEvent.durationMs = elapsed - this.currentEvent.startedAt;
      this.events.push({ ...this.currentEvent });
      if (this.events.length > 5000) this.events = this.events.slice(-4000);
    }

    this.currentEvent = {
      state: next,
      startedAt: elapsed,
      endedAt: null,
      durationMs: 0,
    };
    this.currentDebouncedState = next;
    this.pendingState = null;
    this.pendingStateSince = 0;

    if (prevState === "focused" && next !== "focused") {
      if (this.currentFocusedStreakStart !== null) {
        const streakMs = elapsed - this.currentFocusedStreakStart;
        if (streakMs > this.longestFocusedStreakMs) this.longestFocusedStreakMs = streakMs;
        this.currentFocusedStreakStart = null;
      }
    } else if (next === "focused" && prevState !== "focused") {
      this.currentFocusedStreakStart = elapsed;
    }

    if (isDistractionKind(next)) {
      this.distractionCount++;
    }

    for (const cb of this.stateChangeCallbacks) {
      try {
        cb(next, { ...this.currentEvent });
      } catch {
        // Don't let callback errors crash the tracker
      }
    }
  }

  // Temporary canvas for MediaPipe (which doesn't accept OffscreenCanvas)
  private _tmpCanvas: HTMLCanvasElement | null = null;
  private _tmpCtx: CanvasRenderingContext2D | null = null;

  // ── Private — Debounced state machine ────────────────────────────────────

  private processFrameState(frame: FrameState): void {
    const now = Date.now();
    const rawKind = frame.kind;
    const elapsed = now - this.trackingStartedAt;

    if (rawKind === this.currentDebouncedState) {
      // State confirmed — clear pending
      this.pendingState = null;
      this.pendingStateSince = 0;
      return;
    }

    if (rawKind !== this.pendingState) {
      // New candidate state
      this.pendingState = rawKind;
      this.pendingStateSince = now;
      return;
    }

    // Same candidate state — check debounce
    const debounceMs = this.thresholds.debounce[rawKind];
    if (now - this.pendingStateSince < debounceMs) {
      return; // Not yet debounced
    }

    // Transition confirmed!
    const prevState = this.currentDebouncedState;
    this.currentDebouncedState = rawKind;
    this.pendingState = null;
    this.pendingStateSince = 0;

    // Update metrics for the previous state
    this.updateRunningMetrics(now);

    // Close previous event
    if (this.currentEvent) {
      this.currentEvent.endedAt = elapsed;
      this.currentEvent.durationMs = elapsed - this.currentEvent.startedAt;
      this.events.push({ ...this.currentEvent });

      // Cap at 5000 events (prevent memory abuse)
      if (this.events.length > 5000) {
        this.events = this.events.slice(-4000);
      }
    }

    // Open new event
    this.currentEvent = {
      state: rawKind,
      startedAt: elapsed,
      endedAt: null,
      durationMs: 0,
    };

    // Track focused streaks
    if (prevState === "focused" && rawKind !== "focused") {
      // Leaving focused state — close streak
      if (this.currentFocusedStreakStart !== null) {
        const streakMs = elapsed - this.currentFocusedStreakStart;
        if (streakMs > this.longestFocusedStreakMs) {
          this.longestFocusedStreakMs = streakMs;
        }
        this.currentFocusedStreakStart = null;
      }
    } else if (rawKind === "focused" && prevState !== "focused") {
      // Entering focused state — start streak
      this.currentFocusedStreakStart = elapsed;
    }

    // Count distractions
    if (isDistractionKind(rawKind)) {
      this.distractionCount++;
    }

    // Emit
    for (const cb of this.stateChangeCallbacks) {
      try {
        cb(rawKind, { ...this.currentEvent });
      } catch {
        // Don't let callback errors crash the tracker
      }
    }
  }

  // ── Private — Running metrics ────────────────────────────────────────────

  private updateRunningMetrics(now: number): void {
    const deltaMs = now - this.lastMetricsUpdate;
    if (deltaMs <= 0) return;

    switch (this.currentDebouncedState) {
      case "focused":
        this.focusedMs += deltaMs;
        break;
      case "no_face":
        this.noFaceMs += deltaMs;
        break;
      case "looking_away":
      case "eyes_closed":
      case "drowsy":
      case "looking_down":
      case "tab_switched":
      case "multi_face":
        this.distractedMs += deltaMs;
        break;
    }

    this.lastMetricsUpdate = now;
  }

  // ── Private — Visibility ─────────────────────────────────────────────────

  private handleVisibilityChange(): void {
    if (document.hidden) {
      this.enterTabSwitched();
    } else {
      // Tab foregrounded — reset the metrics clock first to avoid a huge
      // delta being bucketed into the tab_switched state.
      this.lastMetricsUpdate = Date.now();
      this.exitTabSwitched();
    }
  }

  private handleWindowBlur(): void {
    // Window losing focus (e.g. user Alt+Tab to another app without hiding tab).
    // Only escalate if document isn't already hidden, to avoid double-firing.
    if (!document.hidden) {
      this.enterTabSwitched();
    }
  }

  private handleWindowFocus(): void {
    if (!document.hidden) {
      this.lastMetricsUpdate = Date.now();
      this.exitTabSwitched();
    }
  }

  private enterTabSwitched(): void {
    this.updateRunningMetrics(Date.now());
    if (this.currentDebouncedState === "tab_switched") return;
    this.preTabSwitchState = this.currentDebouncedState;
    this.forceStateTransition("tab_switched");
  }

  private exitTabSwitched(): void {
    if (this.currentDebouncedState !== "tab_switched") return;
    // Return to focused by default; the next camera frame will re-classify
    // the real state and debounce will handle any transition.
    const restore = this.preTabSwitchState ?? "focused";
    this.preTabSwitchState = null;
    this.forceStateTransition(restore === "tab_switched" ? "focused" : restore);
  }

  // ── Private — Error emission ─────────────────────────────────────────────

  private emitError(err: Error): void {
    for (const cb of this.errorCallbacks) {
      try {
        cb(err);
      } catch {
        // Don't let callback errors crash the tracker
      }
    }
  }
}
