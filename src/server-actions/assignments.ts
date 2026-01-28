"use server";

import { revalidateTag } from "next/cache";
import {
  getAssignmentForStudent,
  getAssignmentForInstructor,
} from "@/server-api/assignment-submissions";

/**
 * Invalidate and refetch the cached student assignment view
 * Call this after submitting, unsubmitting, or when attempt data changes
 */
export async function refreshStudentAssignmentCache(
  roomId: string,
  assignmentId: string,
) {
  revalidateTag(`assignment-student-${assignmentId}`, { expire: 0 });
  return getAssignmentForStudent(roomId, assignmentId);
}

/**
 * Invalidate and refetch the cached instructor assignment view
 * Call this after grading or when attempts are updated
 */
export async function refreshInstructorAssignmentCache(
  roomId: string,
  assignmentId: string,
) {
  revalidateTag(`assignment-instructor-${assignmentId}`, { expire: 0 });
  return getAssignmentForInstructor(roomId, assignmentId);
}

/**
 * Invalidate a specific assignment (both student and instructor views)
 */
export async function refreshAssignmentCache(assignmentId: string) {
  revalidateTag(`assignment-${assignmentId}`, { expire: 0 });
}

/**
 * Invalidate all assignments cache
 */
export async function refreshAllAssignmentsCache() {
  revalidateTag("assignments", { expire: 0 });
}
