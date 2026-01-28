import { useQuery } from "@tanstack/react-query";
import type { StudentAssignment } from "@/types/assignment";
import { getAssignmentForStudent } from "@/server-api/assignment-submissions";

export const studentAssignmentQueryKey = (assignmentId: string) => [
  "assignment",
  assignmentId,
  "student",
];

interface UseStudentAssignmentOptions {
  roomId: string;
  assignmentId: string;
}

export function useStudentAssignment({
  roomId,
  assignmentId,
}: UseStudentAssignmentOptions) {
  return useQuery<StudentAssignment | null>({
    queryKey: studentAssignmentQueryKey(assignmentId),
    staleTime: Infinity,
    queryFn: () => getAssignmentForStudent(roomId, assignmentId),
  });
}
