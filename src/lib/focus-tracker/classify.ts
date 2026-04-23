/**
 * Frame Classification
 *
 * Pure function that takes MediaPipe FaceLandmarker output and classifies
 * the current frame. Decision order:
 *   1. Multiple faces in frame          → multi_face
 *   2. No face detected                 → no_face
 *   3. Both eyes closed (blink > T)     → eyes_closed   (tracker may reclassify to drowsy)
 *   4. Jaw open (yawn, blendshape > T)  → drowsy        (tracker enforces hold)
 *   5. Head turned (yaw/pitch > T)      → looking_away:head
 *   6. Gaze down (eyeLookDown avg > T)  → looking_down
 *   7. Gaze shifted sideways            → looking_away:gaze
 *   8. Otherwise                        → focused
 *
 * The classifier stays pure — cross-frame durations (e.g. "eyes closed ≥ 4s
 * ⇒ drowsy") are handled by the FocusTracker state machine.
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

  const jawOpen = getBlendshapeValue(blendshapeCategories, "jawOpen");
  if (jawOpen > thresholds.yawn) {
    return { kind: "drowsy", reason: "yawn" };
  }

  const { yaw, pitch } = decomposeMatrix(transformMatrix);
  if (Math.abs(yaw) > thresholds.yawDeg || Math.abs(pitch) > thresholds.pitchDeg) {
    return { kind: "looking_away", reason: "head" };
  }

  const lookDownL = getBlendshapeValue(blendshapeCategories, "eyeLookDownLeft");
  const lookDownR = getBlendshapeValue(blendshapeCategories, "eyeLookDownRight");
  if ((lookDownL + lookDownR) / 2 > thresholds.lookDown) {
    return { kind: "looking_down" };
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
