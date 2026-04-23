# Focus Tracker — Implementation Plan for AI Agents

> **Purpose of this document.** This is a hand-off brief for another AI (or a new Claude session). It explains the feature, the existing codebase you must integrate with, the exact technical choices already made, and the step-by-step work to deliver. Read every section before writing code.

---

## 0. Hard rules — read before doing anything

1. **DO NOT start coding until Phase 1 is complete.** Phase 1 is a verification pass — you confirm the codebase still matches the snapshot in §2 of this doc. If anything has drifted (files moved, deps upgraded, entity fields renamed), stop and report the deltas. The rest of the plan assumes the snapshot is accurate.
2. **This feature is 100% client-side inference.** No server-side ML. No uploading webcam frames anywhere. The webcam stream never leaves the user's browser.
3. **Each participant opts in for themselves only.** You cannot track another participant's focus. The toggle is per-user, per-session, defaulting to OFF.
4. **Do not regress the video call.** The call must stay smooth. If you have to choose between inference accuracy and call quality, pick call quality.
5. **Follow the project's existing conventions.** Don't introduce new state management, new toast libraries, new HTTP clients, new styling systems. The stack is already chosen — match it.
6. **Keep the CPU budget small.** Run inference at ≤10 fps on a downscaled frame (320×240). Never tee off a second `getUserMedia` — reuse the existing LiveKit local track.
7. **No placeholder / mock data in the final PR.** If something can't be wired up, put it behind a TODO comment explaining what's needed, and note it in the PR description.

---

## 1. Feature summary

We are adding an opt-in **Focus Tracker** to the existing LiveKit-based video call in the `merge` Next.js app. Each user can toggle it on for themselves. While on, it analyses their own webcam locally, warns them when they get distracted, and at the end of the session produces a report they can view.

Three user-visible capabilities:

- **FE-1 — Webcam analysis.** Detect face presence, head pose (yaw/pitch/roll), eye gaze direction, and eye closure using on-device ML on the user's existing LiveKit camera track.
- **FE-2 — Real-time distraction alerts.** When the user enters a "distracted" state for more than a debounce window, show them (and only them) a non-intrusive toast/banner: *"You seem distracted — look back at the screen."* Clear the alert when they return to focused.
- **FE-3 — Post-session focus report.** When the user leaves the session (or the session ends), aggregate the samples into a report: percentage focused, count and duration of distraction events, a timeline strip, longest focused streak. Persist it so they can review later.

Non-goals (explicitly out of scope for this iteration):
- Showing any user's focus score to any other user (including the host).
- Emotion / sentiment detection, stress, fatigue scoring beyond drowsiness.
- Server-side video analysis.
- Mobile/tablet optimization beyond what the existing call already supports.
- Accessibility polish beyond keyboard-reachable toggle and aria-labels.

---

## 2. Snapshot of the existing codebase (verify in Phase 1)

These facts were extracted by scanning the repo. **Verify every one in Phase 1 before relying on them.** If a fact is wrong, the plan step that depends on it must be adjusted.

### 2.1 Stack

- **Repo:** `d:/FYP/merge/` (the Next.js frontend). Backend is separate at `d:/FYP/merge-backend/` (NestJS + TypeORM).
- **Framework:** Next.js **16.0.10**, App Router, React 19, Turbopack.
- **Language:** TypeScript, strict mode.
- **Styling:** Tailwind v4. No CSS modules. shadcn/ui components live in `src/components/ui/`.
- **State:** React Query (TanStack) **5.90.2** for server state. React hooks for UI state. **No Zustand/Redux.**
- **HTTP:** `axios` instance at [src/utils/api.ts](src/utils/api.ts) — has a response interceptor that auto-refreshes tokens on 401. **Always use this instance for client-side API calls.** Do not import `axios` directly in components.
- **Notifications:** `sonner` is installed and mounted. A custom inline toast also exists in the live-session page. For this feature, see §6.2 for which to use.
- **Icons:** `lucide-react`.
- **Forms:** `react-hook-form` + `zod` (not needed for this feature but noted for consistency).
- **Animations:** `framer-motion` already used in the session page for overlays.

### 2.2 LiveKit

- **Client libs:** `@livekit/components-react` **2.9.20**, `@livekit/components-styles` **1.2.0**, `livekit-client` **2.18.4**.
- **Main call page:** [src/app/live/session/page.tsx](src/app/live/session/page.tsx) — one large client component. The `<LiveKitRoom>` wraps everything at the bottom of the file.
- **Token fetch:** [src/hooks/live-sessions/use-livekit-token.ts](src/hooks/live-sessions/use-livekit-token.ts) — React Query mutation posting to `/livekit/token`.
- **LiveKit URL:** read from `process.env.NEXT_PUBLIC_LIVEKIT_URL`.
- **Local participant / camera track access:** use `useLocalParticipant()` from `@livekit/components-react`. From the returned `localParticipant`, call `getTrackPublication(Track.Source.Camera)?.track` — this gives you a `LocalVideoTrack`. Its `.mediaStreamTrack` is the `MediaStreamTrack` you feed into MediaPipe via a hidden `<video>` element.
- **Existing pattern for hooking into the LiveKit room:** see sibling components in [src/components/live-session/](src/components/live-session/) — specifically:
  - [LiveKitControlsBridge.tsx](src/components/live-session/LiveKitControlsBridge.tsx) — mounted **inside** `<LiveKitRoom>`, reads/writes participant state.
  - [PermissionEnforcer.tsx](src/components/live-session/PermissionEnforcer.tsx) — same pattern, also handles data-channel messages.
  - [HandRaiseSync.tsx](src/components/live-session/HandRaiseSync.tsx) — same pattern.
  - **You will follow this exact pattern.** Any hook/component that needs LiveKit context must be rendered as a child of `<LiveKitRoom>`.

### 2.3 Backend + data

- **Backend:** NestJS at `d:/FYP/merge-backend/` running on `http://localhost:3001`. Requests from the frontend go through a Next.js proxy route at [src/app/api/[...path]/route.ts](src/app/api/[...path]/route.ts) when `NEXT_PUBLIC_USE_AUTH_PROXY=true`.
- **Auth:** JWT access + refresh cookies (`accessToken`, `refreshToken`). Middleware at [src/middleware.ts](src/middleware.ts) auto-refreshes. You don't need to touch this — just use the `api` instance.
- **ORM:** TypeORM. Entities at [merge-backend/src/entities/](../merge-backend/src/entities/).
- **Session entity:** [merge-backend/src/entities/live-video-session.entity.ts](../merge-backend/src/entities/live-video-session.entity.ts) — fields include `id`, `status`, `startedAt`, `endedAt`, `attendees`.
- **Attendee entity:** [merge-backend/src/entities/live-video-sesssion-attendee.entity.ts](../merge-backend/src/entities/live-video-sesssion-attendee.entity.ts) (note the triple-s typo in the filename — do not fix it, many imports depend on it). **Already has a `focusScore: number` column (0–100 float).** We will populate it.
- **Session controller:** [merge-backend/src/live-session/live-session.controller.ts](../merge-backend/src/live-session/live-session.controller.ts). Existing endpoints: `POST /live-sessions/create`, `GET /live-sessions`, `GET /live-sessions/:id`, `POST /live-sessions/:id/start`, `POST /live-sessions/:id/end`, `POST /live-sessions/:id/join`. We will add one new endpoint (see §5).
- **SessionId on the frontend:** the call page reads `sessionId` from the query string and uses it in [use-livekit-token.ts](src/hooks/live-sessions/use-livekit-token.ts). That's the key you'll use when uploading the report.

### 2.4 Leave flow

- The Leave button handler is `handleLeave` in [src/app/live/session/page.tsx](src/app/live/session/page.tsx). Currently it just calls `router.push(...)` back to the rooms page. **This is the hook point for uploading the focus report** — but beware: the user may also close the tab, reload, or lose network. Your upload path must handle all three (see §4.3).

---

## 3. Technical design

### 3.1 ML library choice — MediaPipe Face Landmarker (Tasks Vision)

Use **`@mediapipe/tasks-vision`** (Google, Apache-2.0). It is free, runs in the browser via WASM + WebGL, loads a ~10 MB model, and returns everything we need in one call:

- 478 face landmarks (for face presence + framing)
- **Blendshapes** — 52 ARKit-style floats including `eyeBlinkLeft`, `eyeBlinkRight`, `eyeLookInLeft`, `eyeLookOutLeft`, `eyeLookUpLeft`, `eyeLookDownLeft` and the same for right eye. These are our gaze and drowsiness signals.
- **Facial transformation matrix** — 4×4 matrix you decompose into **yaw, pitch, roll** for head pose.

**Install:**
```bash
npm install @mediapipe/tasks-vision
```
Pin the version in `package.json`. At the time of writing `0.10.x` is current; verify in Phase 1.

**Model file:**
- `face_landmarker.task` — host it at `public/models/face_landmarker.task`. Download from the MediaPipe solutions site and commit it. **Do not fetch from a CDN at runtime** — the model is ~10 MB and a CDN dependency is a reliability/privacy risk.
- Also vendor the WASM assets. Either:
  - Option A (simpler): let `FilesetResolver.forVisionTasks(...)` fetch from the jsdelivr CDN. Acceptable tradeoff for "quick and free".
  - Option B (offline-friendly): copy the wasm files from `node_modules/@mediapipe/tasks-vision/wasm/` into `public/mediapipe/wasm/` and point `FilesetResolver` at that local path.
- **Default:** Option A to ship fast; revisit if CSP or offline becomes a requirement.

### 3.2 Pipeline

```
LiveKit LocalVideoTrack.mediaStreamTrack
          │
          ▼
   hidden <video>  ◄── attached via srcObject (no 2nd getUserMedia)
          │
          ▼
   OffscreenCanvas 320×240  ◄── downscaled frame source
          │
          ▼
   FaceLandmarker.detectForVideo(canvas, timestampMs)
          │
          ├─► landmarks[] (length 0 if no face)
          ├─► faceBlendshapes[0].categories (52 floats)
          └─► facialTransformationMatrixes[0] → decompose → {yaw, pitch, roll}
                     │
                     ▼
             classify frame → FrameState
                     │
                     ▼
             state machine (debounced) → SessionState
                     │
             ┌───────┴────────┐
             ▼                ▼
         FE-2 alerts    FE-3 sample buffer
```

### 3.3 `FrameState` — per-frame classification

For each processed frame, produce:

```ts
type FrameState =
  | { kind: "focused" }
  | { kind: "no_face" }
  | { kind: "looking_away"; reason: "head" | "gaze" }
  | { kind: "eyes_closed" };
```

Decision rules (tune during Phase 3):

| Input signal                                              | Threshold                              | Result                   |
| --------------------------------------------------------- | -------------------------------------- | ------------------------ |
| `landmarks.length === 0`                                  | —                                      | `no_face`                |
| `eyeBlinkLeft > 0.55 && eyeBlinkRight > 0.55`             | —                                      | `eyes_closed`            |
| `Math.abs(yawDeg) > 25` OR `Math.abs(pitchDeg) > 20`      | —                                      | `looking_away:head`      |
| `(eyeLookOutL + eyeLookInR) > 0.9` OR symmetric opposite  | —                                      | `looking_away:gaze`      |
| otherwise                                                 | —                                      | `focused`                |

Blendshape thresholds are empirical. Get them working with the defaults above, then tune against yourself. Document the final values in a comment in the `FocusTracker` class.

### 3.4 `SessionState` — debounced state machine

Raw frame classifications are noisy. Smooth with a debounce: a state transition requires the new state to be sustained for **N ms** before it's emitted.

```ts
const DEBOUNCE_MS: Record<FrameState["kind"], number> = {
  focused: 500,       // fast return-to-focus
  no_face: 2000,
  looking_away: 3000,
  eyes_closed: 1500,
};
```

Emit a `SessionEvent` whenever the debounced state changes. The events are both the alert source (FE-2) and the report source (FE-3).

```ts
type SessionEvent = {
  state: FrameState["kind"];
  startedAt: number;  // ms since session start
  endedAt: number | null;  // null while active
};
```

### 3.5 Performance budget

- **Inference rate:** 10 fps max. Drop frames if the previous call hasn't returned.
- **Resolution:** downscale to 320×240 before inference. LiveKit camera is typically 720p; use `drawImage` on an `OffscreenCanvas`.
- **Delegate:** `delegate: "GPU"` in `FaceLandmarker` options. Falls back to CPU automatically if WebGL is unavailable.
- **Page Visibility:** pause the loop when `document.hidden` is true — no point inferring when the tab is backgrounded. Resume on visibilitychange.
- **Battery:** add a "reduce quality" fallback that drops to 5 fps if the rolling average inference time exceeds 80 ms. Log this to console once; do not toast.

---

## 4. File-by-file work

Paths are relative to `d:/FYP/merge/`.

### 4.1 New files to create

#### `src/lib/focus-tracker/types.ts`
All shared types: `FrameState`, `SessionEvent`, `SessionReport`, `FocusTrackerConfig`, `FocusMetrics`. Export only types and consts, no runtime code.

```ts
export type FrameKind = "focused" | "no_face" | "looking_away" | "eyes_closed";

export interface SessionEvent {
  state: FrameKind;
  startedAt: number;   // ms since trackingStartedAt
  endedAt: number | null;
  durationMs: number;  // computed: endedAt - startedAt (or now - startedAt if active)
}

export interface SessionReport {
  sessionId: string;
  userId: string;
  trackingStartedAt: number;  // epoch ms
  trackingEndedAt: number;    // epoch ms
  totalDurationMs: number;
  focusedMs: number;
  distractedMs: number;  // sum of non-focused, non-no_face
  noFaceMs: number;
  focusScore: number;   // 0-100: round(focusedMs / totalDurationMs * 100)
  longestFocusedStreakMs: number;
  events: SessionEvent[];  // full timeline
}
```

#### `src/lib/focus-tracker/FocusTracker.ts`
Framework-agnostic class. No React. Takes a `MediaStreamTrack`, manages the MediaPipe lifecycle, emits events.

Shape:
```ts
export class FocusTracker {
  constructor(config: FocusTrackerConfig);
  async start(track: MediaStreamTrack): Promise<void>;
  stop(): void;
  onStateChange(cb: (state: FrameKind, event: SessionEvent) => void): () => void;
  onError(cb: (err: Error) => void): () => void;
  getReport(): SessionReport;
  // internal: private video + canvas elements, private RAF loop
}
```

Requirements:
- Idempotent `start` / `stop` (calling start twice is a no-op, stop can be called before start).
- Must clean up: close FaceLandmarker, stop RAF loop, detach video srcObject, remove visibilitychange listener.
- Inference loop uses `requestAnimationFrame` + timestamp gating to cap at 10 fps. Do not use `setInterval` — it drifts under load.
- Do NOT call `getUserMedia`. The track is passed in.

#### `src/lib/focus-tracker/headPose.ts`
Pure function `decomposeMatrix(matrix: number[]): { yaw: number; pitch: number; roll: number }` (degrees). Extract Euler angles from the 4×4 transformation matrix. Unit-test this with known matrices.

#### `src/lib/focus-tracker/classify.ts`
Pure function `classifyFrame(landmarks, blendshapes, matrix): FrameState`. Implements the rules in §3.3. No side effects.

#### `src/hooks/focus-tracker/use-focus-tracker.ts`
React hook that wires `FocusTracker` to the LiveKit local camera track and exposes state to components.

```ts
export function useFocusTracker(options: {
  enabled: boolean;
  sessionId: string;
}): {
  currentState: FrameKind | "idle";
  isDistracted: boolean;   // derived: currentState is looking_away | eyes_closed | no_face
  metrics: FocusMetrics;   // live-updating running totals
  report: SessionReport | null;  // null until stopped
  error: Error | null;
}
```

Responsibilities:
- Use `useLocalParticipant()` from `@livekit/components-react` (this hook MUST be called inside a component that is inside `<LiveKitRoom>`).
- When `enabled` flips to true: grab `localParticipant.getTrackPublication(Track.Source.Camera)?.track`. If missing, the camera is off — keep waiting and listen for `TrackPublication` events.
- When `enabled` flips to false OR the camera turns off: call `tracker.stop()` and finalize the report.
- Debounce toggling: don't thrash the tracker if the user spams the button.

#### `src/hooks/focus-tracker/use-focus-report-upload.ts`
React Query mutation wrapping the API call. POST `/live-sessions/:sessionId/focus-report` with the `SessionReport` payload. Uses the `api` instance from [src/utils/api.ts](src/utils/api.ts). On success, cache-invalidate `["focus-report", sessionId]`.

#### `src/components/live-session/FocusTrackerController.tsx`
Mounted **inside** `<LiveKitRoom>`. Renders nothing visible — it just runs the hook and calls the mutation when the report is ready. Accepts `enabled`, `sessionId`, and an `onReport` callback so the parent can open the report modal after upload. This is the LiveKit-context bridge; follow the pattern of [LiveKitControlsBridge.tsx](src/components/live-session/LiveKitControlsBridge.tsx).

#### `src/components/live-session/FocusTrackerToggle.tsx`
The UI toggle button to go in the existing control bar. Icon: lucide `Eye` when on, `EyeOff` when off. Tooltip: "Track my focus". Shows a small dot indicator when distracted. Accessible: role=switch, aria-checked.

#### `src/components/live-session/FocusAlert.tsx`
The in-call distraction toast. A floating banner at the top center of the video area that fades in when `isDistracted` is true and fades out after 3s (or immediately when `isDistracted` becomes false). Use `framer-motion` for the transition (already in the project).

Copy (per state):
- `looking_away`: "Looking away — try to focus on the screen."
- `eyes_closed`: "Eyes closed — are you still with us?"
- `no_face`: "We can't see you — check your camera."

Do **not** use sonner for this — it's persistent advisory UI, not a notification. Sonner is for momentary events.

#### `src/components/live-session/FocusReportDialog.tsx`
Post-session report modal. Uses the existing `Modal` from `src/components/ui/Modal.tsx`. Shows:
- Big focus score (0–100)
- "Time focused" vs "Time distracted" (formatted as `m:ss`)
- Longest focused streak
- Distraction event count, broken down by kind
- A horizontal timeline strip (one colored bar per event, width proportional to duration). Plain divs + Tailwind — no chart lib.
- Close button. Optional "Download JSON" for power users (emits a blob download).

#### `src/app/live/session/focus-report/[sessionId]/page.tsx` *(optional, Phase 5)*
Standalone route to revisit a past report. Fetches via React Query. Low priority — skip if time is tight.

### 4.2 Files to modify

#### [src/app/live/session/page.tsx](src/app/live/session/page.tsx)
- Add local state: `const [focusEnabled, setFocusEnabled] = useState(false)` and `const [focusReport, setFocusReport] = useState<SessionReport | null>(null)`.
- In the control bar (where the mic/camera/leave buttons live), add `<FocusTrackerToggle checked={focusEnabled} onChange={setFocusEnabled} />`.
- Inside `<LiveKitRoom>` (next to `<LiveKitControlsBridge />`, `<PermissionEnforcer />`, `<HandRaiseSync />`) add `<FocusTrackerController enabled={focusEnabled} sessionId={sessionId} onReport={setFocusReport} />`.
- Also inside `<LiveKitRoom>`, render `<FocusAlert />` overlaying the stage — only when `focusEnabled` is true.
- After `handleLeave`, if `focusReport` is set, show `<FocusReportDialog />`.
- Persist `focusEnabled` per session to `sessionStorage` keyed by `sessionId` so a tab reload during the call doesn't forget the user's choice. **Do not** persist to localStorage — preference shouldn't leak across sessions.

#### [package.json](package.json)
- Add `@mediapipe/tasks-vision` to `dependencies`.

#### `public/models/` *(new directory)*
- Drop `face_landmarker.task` here. Commit it. Add to `.gitignore` exceptions if needed.

### 4.3 Backend additions

New endpoint on the session controller:

```
POST /live-sessions/:sessionId/focus-report
```

- **Auth:** authenticated user, resolves to `userId` from JWT.
- **Body:** the `SessionReport` object from §4.1.
- **Behavior:**
  1. Find the `SessionAttendee` where `session.id = sessionId AND user.id = userId`.
  2. If not found, 404.
  3. Write `focusScore` to the attendee row.
  4. Also persist the full report (events + metrics) — see below.
- **Response:** `{ ok: true, focusScore: number }`.

**Where to store the full report:**
- New entity `focus_reports` with columns: `id (uuid)`, `sessionId (fk)`, `userId (fk)`, `focusScore`, `totalDurationMs`, `focusedMs`, `distractedMs`, `noFaceMs`, `longestFocusedStreakMs`, `events (jsonb)`, `createdAt`.
- File: `merge-backend/src/entities/focus-report.entity.ts`.
- Service method: add `saveFocusReport(userId, sessionId, dto)` to [merge-backend/src/live-session/live-session.service.ts](../merge-backend/src/live-session/live-session.service.ts).
- Controller method: add `@Post(':sessionId/focus-report') saveFocusReport(...)` to [merge-backend/src/live-session/live-session.controller.ts](../merge-backend/src/live-session/live-session.controller.ts).
- DTO: `merge-backend/src/live-session/dto/focus-report.dto.ts` with class-validator rules (array length cap: 5000 events, score 0–100, etc. — prevent abuse).
- Run migration after adding the entity.

**Upload timing / reliability on the client:**

The user might leave cleanly (button), close the tab, or drop the network. Handle all three:

1. **Happy path** — `handleLeave` is called: await the upload mutation, then open the report dialog. Loading state on the Leave button.
2. **Tab close / refresh** — register a `beforeunload` or `pagehide` listener that calls `navigator.sendBeacon('/api/live-sessions/:id/focus-report', blob)` with the serialized report. `sendBeacon` is fire-and-forget and survives page unload. Check payload size — it has a ~64 KB limit; if the report is larger (unlikely given the event cap), truncate to the most recent events.
3. **Network failure during leave** — catch the mutation error, stash the report JSON in `localStorage` under key `focus-report-pending-${sessionId}`, and on app mount try to flush any pending reports. Delete on success.

---

## 5. API contract

### Request
```
POST /live-sessions/:sessionId/focus-report
Cookie: accessToken=...
Content-Type: application/json

{
  "trackingStartedAt": 1714000000000,
  "trackingEndedAt":   1714003600000,
  "totalDurationMs":   3600000,
  "focusedMs":         2700000,
  "distractedMs":       720000,
  "noFaceMs":           180000,
  "focusScore":          75,
  "longestFocusedStreakMs": 900000,
  "events": [
    { "state": "focused",      "startedAt": 0,      "endedAt": 300000,  "durationMs": 300000 },
    { "state": "looking_away", "startedAt": 300000, "endedAt": 320000,  "durationMs":  20000 },
    ...
  ]
}
```

### Response
```
200 OK
{ "ok": true, "focusScore": 75 }
```

### Errors
- `400` — invalid body (DTO validation fails).
- `401` — no/invalid token (interceptor will refresh).
- `403` — user was not an attendee of that session.
- `404` — session or attendee not found.
- `413` — report too large (soft cap on events).

---

## 6. UX details

### 6.1 Toggle placement

- The control bar in [page.tsx](src/app/live/session/page.tsx) already has mic, camera, screen-share, hand raise, chat, participants, leave. Insert the Focus Tracker toggle between **hand raise** and **chat** — it's a "self" control, grouping with hand raise is natural.
- First time the user enables it in a given session, show a one-shot permission-style confirmation Modal:
  > **Track your focus?**
  > Your webcam will be analysed locally in your browser to help you stay focused. Nothing is sent to the server until the session ends. You can turn this off anytime.
  > [Cancel] [Enable]
- Persist "has seen intro" to `localStorage` key `focus-tracker-intro-seen` so subsequent sessions skip the modal.

### 6.2 Toast vs persistent banner

- **Persistent advisory** (FE-2 alert while distracted) → custom `FocusAlert` component, NOT sonner. It must stay visible as long as the user is distracted.
- **Momentary event** (e.g. "Focus tracking started" on toggle-on, "Report saved" after upload, error toasts) → **sonner**. It's already mounted.

### 6.3 Camera off / off-screen

- If the user's camera is off, the toggle should appear disabled with a tooltip: "Turn on your camera to track focus." Do not silently keep running.
- If the user toggles the camera off mid-session while tracking, pause the tracker, finalize the current event at that timestamp, and show a sonner info: "Focus tracking paused — camera is off."

### 6.4 Privacy copy

Everywhere tracking is mentioned, include the phrase "*analysed locally in your browser*". This is a real guarantee (no upload of frames) and a differentiator.

---

## 7. Phased execution plan

### Phase 1 — Verify (no code, ~30 min)

- Clone / open `d:/FYP/merge/`.
- Run `npm install` and confirm it builds: `npm run build`.
- Open every file path referenced in §2. Confirm they exist and match the described role. **Any deviation → report back, do not proceed.**
- Confirm the backend entity `SessionAttendee` still has `focusScore` ([merge-backend/src/entities/live-video-sesssion-attendee.entity.ts](../merge-backend/src/entities/live-video-sesssion-attendee.entity.ts)).
- Confirm `@livekit/components-react` is on 2.x in `package.json`. If ≥3.x, the `useLocalParticipant` API may have shifted — check their changelog before proceeding.
- Confirm `sessionStorage` and `navigator.sendBeacon` are available in the target browsers.

**Deliverable:** a one-page verification report, delta list if any.

### Phase 2 — Standalone tracker library (no LiveKit, no React)

- Install `@mediapipe/tasks-vision` and place the `face_landmarker.task` model under `public/models/`.
- Build `src/lib/focus-tracker/{types.ts, headPose.ts, classify.ts, FocusTracker.ts}` per §4.1.
- Write a throwaway harness page at `src/app/__dev/focus-test/page.tsx`:
  - Calls `getUserMedia` to get a raw camera track.
  - Instantiates `FocusTracker`, feeds the track.
  - Renders live `currentState`, yaw/pitch/roll, blendshapes, and a running event list.
- Use the harness to tune thresholds. Delete the harness page before PR.

**Done when:** you can see your state change correctly as you look around / close your eyes / cover the camera.

### Phase 3 — React hook + LiveKit integration

- Build `useFocusTracker` and `FocusTrackerController` per §4.1.
- Wire the controller inside `<LiveKitRoom>` in [page.tsx](src/app/live/session/page.tsx).
- Add a temporary debug overlay in dev builds showing the live state. Gate on `process.env.NODE_ENV === 'development'`.

**Done when:** enabling the toggle in the real session page runs inference on the LiveKit local track without a second `getUserMedia` prompt, and state updates flow.

### Phase 4 — UI (toggle, alert, intro modal)

- Build `FocusTrackerToggle`, `FocusAlert`, and the first-time confirmation modal.
- Hook up camera-off behavior per §6.3.
- QA against keyboard nav, aria attributes, dark mode (the session page is dark-only today — don't break that).

### Phase 5 — Report generation + upload + dialog

- Backend first: entity, migration, DTO, service method, controller route. Run migration locally and hit the endpoint with curl to confirm.
- Frontend: `use-focus-report-upload` mutation. Wire into `handleLeave`. Add `beforeunload` / `pagehide` sendBeacon fallback. Add localStorage replay on app mount.
- Build `FocusReportDialog`. Open it after the upload succeeds on the clean-leave path.
- Verify on: clean leave, tab close mid-session, offline leave (open devtools → Network → Offline, then leave — the pending report should flush on next load).

### Phase 6 — Polish + cleanup

- Remove debug overlays, dev-only routes, console logs.
- Add a small README note in `src/lib/focus-tracker/README.md` (≤50 lines): what it is, how thresholds were picked, how to swap the model.
- Manual test matrix (§8).
- Open the PR per §9.

---

## 8. Test checklist (manual QA)

Run through every row on Chrome latest + Firefox latest. Laptop with integrated webcam, and once on a second machine if available.

| # | Scenario                                                      | Expected                                                          |
|---|---------------------------------------------------------------|-------------------------------------------------------------------|
| 1 | Join session, toggle OFF                                      | No model load, no CPU impact, call unaffected.                    |
| 2 | Toggle ON first time                                          | Intro modal appears. Accept → tracking starts, indicator lights.  |
| 3 | Toggle ON second time (same session)                          | No intro modal, tracking starts immediately.                      |
| 4 | Look directly at screen                                       | State `focused`, no alert.                                        |
| 5 | Turn head >30° for 4 s                                        | Alert shows after ~3 s, clears when head returns.                 |
| 6 | Close eyes for 2 s                                            | Alert `eyes_closed` shows, clears on reopen.                      |
| 7 | Cover camera                                                  | Alert `no_face` shows after ~2 s.                                 |
| 8 | Turn camera off via LiveKit control                           | Sonner: "Focus tracking paused". Toggle appears disabled.         |
| 9 | Turn camera back on                                           | Tracker resumes automatically (only if toggle is still ON).       |
| 10 | Clean leave via Leave button                                 | Upload succeeds, report modal opens, score visible.               |
| 11 | Refresh tab mid-session                                      | On next load, pending report from localStorage flushes.           |
| 12 | Offline then leave                                           | Mutation fails gracefully, report queued, flushes when online.    |
| 13 | Open 5-participant call, only you have tracking on           | Others see nothing. Your local CPU stays reasonable (<30% single core). |
| 14 | Background the tab for 30 s                                  | Inference pauses. Unbackground → resumes.                         |
| 15 | Tracker enabled for a very short session (<10 s)             | Report still uploads with the small sample. No crash on empty events. |

---

## 9. PR requirements

- **Title:** `feat(live-session): add opt-in focus tracker (FE-1/2/3)`
- **Body must include:**
  - Screenshots/GIFs of: toggle off→on, alert during distraction, report dialog.
  - Bundle size impact (`npm run build` before/after, note the MediaPipe chunk is dynamically imported so only loaded when toggled on — **confirm with the build output**).
  - Confirmation that the model file is committed and served from `/models/face_landmarker.task`.
  - Known limitations (e.g. "only tested on Chrome + Firefox on Windows").
- **Commits:** one per phase is fine. Don't squash dev-overlay commits into the main commit.
- **Don't merge with:** the debug harness page, console.logs in the tracker class, unused imports, or TODOs without an issue link.

---

## 10. Open questions for the user (ask before Phase 5)

1. **Retention.** How long should `focus_reports` rows live? Indefinitely, or prune after N months?
2. **Host visibility.** The spec says reports are private to the user. Confirm — or does the host/teacher need an aggregate view later? If yes, add a `visibility` flag now to avoid a migration later.
3. **Threshold tuning.** Should the user be able to tune sensitivity (Strict / Normal / Relaxed)? Cheap to add, might be premature.
4. **Mobile.** Should the toggle be hidden on mobile (where MediaPipe WASM + video encode + call can overwhelm the device)? Default recommendation: hide below 768 px width in this iteration.

Stop and ask these before writing backend code. Answers change the schema.

---

## 11. Quick reference — key imports

```ts
// MediaPipe
import { FaceLandmarker, FilesetResolver } from "@mediapipe/tasks-vision";

// LiveKit
import { useLocalParticipant } from "@livekit/components-react";
import { Track } from "livekit-client";

// Project utilities
import { api } from "@/utils/api";               // use this for HTTP
import { toast } from "sonner";                  // momentary notifications only
// custom Modal: import Modal from "@/components/ui/Modal";
```

---

## 12. Anti-patterns — if you catch yourself doing these, stop

- Calling `navigator.mediaDevices.getUserMedia` anywhere in this feature. The track comes from LiveKit.
- Importing `axios` directly instead of the project's `api` instance.
- Adding a new global state library (Zustand, Redux, Jotai) for one feature.
- Running inference in the main render loop or on every React render.
- Sending frames, landmarks, or blendshapes to the server. Only the aggregated report goes up.
- Blocking the LiveKit control bar's existing behavior (mic/cam/leave) behind focus-tracker code.
- Disabling TypeScript strictness to make the build pass — fix the types.

---

**End of plan.** If any section contradicts the actual code you find in Phase 1, trust the code and report the delta — this document is a snapshot in time, not the source of truth.
