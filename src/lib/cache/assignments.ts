import type { QueryClient } from "@tanstack/react-query";
import type { Assignment } from "@/types/assignment";

/**
 * Assignment Cache Utilities
 *
 * Provides cache operations for assignment data.
 */

/**
 * Optimistically add a new assignment to instructor cache
 * Used when instructor creates an assignment - item appears immediately
 */
export function addAssignmentToCache(
  queryClient: QueryClient,
  roomId: string,
  newAssignment: Assignment,
): void {
  console.log(`[Cache] Adding assignment: ${newAssignment.title}`);

  queryClient.setQueriesData<Assignment[]>(
    { queryKey: ["assignments", roomId, "instructor"] },
    (old) => {
      if (!old) return [newAssignment];
      if (old.some((a) => a.id === newAssignment.id)) return old;
      return [newAssignment, ...old];
    },
  );
}

/**
 * Invalidate student assignments cache
 * Used when notification is received - triggers background refetch
 */
export function invalidateStudentAssignmentsCache(
  queryClient: QueryClient,
  roomId: string,
): void {
  console.log(`[Cache] Invalidating student assignments for room: ${roomId}`);

  queryClient.invalidateQueries({
    queryKey: ["assignments", roomId, "student"],
  });
}
