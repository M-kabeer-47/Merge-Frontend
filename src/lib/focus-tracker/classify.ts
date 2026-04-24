/**
 * Frame Classification
 *
 * Pure function that takes MediaPipe FaceLandmarker output and classifies
 * the current frame. Decision order:
 *   1. Multiple faces in frame      → multi_face
 *   2. No face detected             → no_face
 *   3. Both eyes closed (blink > T) → eyes_closed   (tracker may reclassify to drowsy)
 *   4. Head turned (yaw/pitch > T)  → looking_away:head
 *   5. Gaze shifted off-center      → looking_away:gaze
 *   6. Otherwise                    → focused
 *
 * We deliberately do not try to identify specific distraction *directions*
 * (looking_down, yawning-via-jaw). MediaPipe's blendshapes are designed for
 * 3D avatar animation, not for classification — they false-fire on normal
 * speech (jawOpen) and on reading content near the bottom of the screen
 * (eyeLookDown). Any non-focused gaze folds into the generic `looking_away`
 * state, which is reliable and honest about what we can actually detect.
 *
 * Drowsiness is still detected — but only via prolonged eye closure in the
 * FocusTracker state machine, which is the PERCLOS-style signal the drowsy-
 * detection literature actually validates.
 */

import type { FrameState, SensitivityThresholds } from "./types";
import { decomposeMatrix } from "./headPose";

function getBlendshapeValue(
  categories: Array<{ categoryName: string; score: number }>,
  name: string,
): number {
  const match = categories.find((c) => c.categoryName === name);
  return match?.score ?? 0;
}

/**
 * @param faceCount - Number of faces detected in the frame
 * @param blendshapeCategories - 52 ARKit blendshapes from faceBlendshapes[0].categories
 * @param transformMatrix - 4×4 matrix from facialTransformationMatrixes[0].data
 * @param thresholds - Sensitivity-dependent thresholds
 */
export function classifyFrame(
  faceCount: number,
  blendshapeCategories: Array<{ categoryName: string; score: number }> | undefined,
  transformMatrix: number[] | undefined,
  thresholds: SensitivityThresholds,
): FrameState {
  if (faceCount > 1) {
    return { kind: "multi_face", count: faceCount };
  }

  if (faceCount === 0 || !blendshapeCategories || !transformMatrix) {
    return { kind: "no_face" };
  }

  const blinkL = getBlendshapeValue(blendshapeCategories, "eyeBlinkLeft");
  const blinkR = getBlendshapeValue(blendshapeCategories, "eyeBlinkRight");
  if (blinkL > thresholds.eyeBlink && blinkR > thresholds.eyeBlink) {
    return { kind: "eyes_closed" };
  }

  const { yaw, pitch } = decomposeMatrix(transformMatrix);
  if (Math.abs(yaw) > thresholds.yawDeg || Math.abs(pitch) > thresholds.pitchDeg) {
    return { kind: "looking_away", reason: "head" };
  }

  const lookOutL = getBlendshapeValue(blendshapeCategories, "eyeLookOutLeft");
  const lookInR = getBlendshapeValue(blendshapeCategories, "eyeLookInRight");
  const lookOutR = getBlendshapeValue(blendshapeCategories, "eyeLookOutRight");
  const lookInL = getBlendshapeValue(blendshapeCategories, "eyeLookInLeft");

  const gazeLeft = lookOutL + lookInR;
  const gazeRight = lookOutR + lookInL;

  if (gazeLeft > thresholds.gazeOut || gazeRight > thresholds.gazeOut) {
    return { kind: "looking_away", reason: "gaze" };
  }

  return { kind: "focused" };
}
