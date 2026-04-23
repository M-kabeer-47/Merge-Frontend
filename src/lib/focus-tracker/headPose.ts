/**
 * Head Pose Decomposition
 *
 * Extracts Euler angles (yaw, pitch, roll) from the 4×4 facial transformation
 * matrix returned by MediaPipe FaceLandmarker.
 *
 * The matrix is a column-major 4×4 homogeneous transformation.
 * We decompose rotation using the ZYX (intrinsic) convention which maps to:
 *   - Yaw   (Y-axis rotation) → turning head left/right
 *   - Pitch (X-axis rotation) → tilting head up/down
 *   - Roll  (Z-axis rotation) → tilting head sideways
 *
 * Returns angles in degrees.
 */

/**
 * Convert a 4×4 column-major transformation matrix to Euler angles.
 *
 * @param matrix - 16-element array (column-major) from MediaPipe
 * @returns { yaw, pitch, roll } in degrees
 *
 * Reference matrices for unit testing:
 *   Identity → (0, 0, 0)
 *   90° yaw  → (90, 0, 0)
 *   45° pitch → (0, 45, 0)
 */
export function decomposeMatrix(matrix: number[]): {
  yaw: number;
  pitch: number;
  roll: number;
} {
  if (matrix.length < 16) {
    return { yaw: 0, pitch: 0, roll: 0 };
  }

  // Column-major indexing:
  // | m0  m4  m8  m12 |
  // | m1  m5  m9  m13 |
  // | m2  m6  m10 m14 |
  // | m3  m7  m11 m15 |

  const m0 = matrix[0];
  const m1 = matrix[1];
  const m2 = matrix[2];
  const m4 = matrix[4];
  const m5 = matrix[5];
  const m6 = matrix[6];
  const m8 = matrix[8];
  const m9 = matrix[9];
  const m10 = matrix[10];

  const RAD_TO_DEG = 180 / Math.PI;

  // ZYX decomposition
  // pitch = asin(-m2)
  const sinPitch = -m2;
  const pitch = Math.asin(Math.max(-1, Math.min(1, sinPitch)));

  let yaw: number;
  let roll: number;

  // Check for gimbal lock
  if (Math.abs(sinPitch) > 0.9999) {
    // Gimbal lock — yaw and roll are coupled, assign all to yaw
    yaw = Math.atan2(-m9, m5);
    roll = 0;
  } else {
    yaw = Math.atan2(m8, m10); // atan2(r20, r22) for Y rotation
    roll = Math.atan2(m1, m0); // atan2(r10, r00) for Z rotation
  }

  return {
    yaw: yaw * RAD_TO_DEG,
    pitch: pitch * RAD_TO_DEG,
    roll: roll * RAD_TO_DEG,
  };
}
