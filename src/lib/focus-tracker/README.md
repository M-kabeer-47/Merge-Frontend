# Focus Tracker

Opt-in, **client-side** focus tracking for LiveKit video sessions.

## What it does

1. Uses the user's existing LiveKit camera track (no second `getUserMedia`)
2. Runs MediaPipe Face Landmarker at ≤10 fps on a 320×240 downscaled frame
3. Classifies each frame: `focused`, `looking_away`, `eyes_closed`, `no_face`
4. Debounces transitions to avoid noise
5. Shows the user real-time distraction alerts
6. Generates a post-session report with focus score, timeline, and stats

## Privacy

**All analysis happens locally in the browser.** No webcam frames, landmarks, or blendshapes are ever sent to the server. Only the aggregated report (score + event timeline) is uploaded when the session ends.

## Model

- **File:** `public/models/face_landmarker.task` (~3.7 MB, float16)
- **Source:** [MediaPipe Solutions](https://ai.google.dev/edge/mediapipe/solutions/vision/face_landmarker)
- WASM runtime loaded from jsdelivr CDN (`FilesetResolver.forVisionTasks`)

## Sensitivity Presets

| Preset   | Yaw° | Pitch° | Eye Blink | Gaze  | Distraction Debounce |
|----------|------|--------|-----------|-------|---------------------|
| Strict   | 18   | 14     | 0.45      | 0.7   | 2.0s                |
| Normal   | 25   | 20     | 0.55      | 0.9   | 3.0s                |
| Relaxed  | 35   | 28     | 0.65      | 1.1   | 4.0s                |

Thresholds were tuned empirically using the dev harness page.

## How to swap the model

1. Download a new `.task` from MediaPipe
2. Replace `public/models/face_landmarker.task`
3. If the model changes blendshape names, update `classify.ts`

## Architecture

```
FocusTracker (lib, no React)
    ↓ events
useFocusTracker (hook, needs LiveKit context)
    ↓ props
FocusTrackerController (bridge component, inside <LiveKitRoom>)
    ↓ callbacks
page.tsx (toggle, alert, report dialog)
```
