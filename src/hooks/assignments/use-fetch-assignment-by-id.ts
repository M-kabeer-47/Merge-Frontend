import { useQuery } from "@tanstack/react-query";
import api from "@/utils/api";
import type {
  StudentAssignment,
  InstructorAssignment,
} from "@/types/assignment";

interface UseFetchAssignmentByIdParams {
  assignmentId: string;
  roomId: string;
  isInstructor: boolean;
  enabled?: boolean;
}

export default function useFetchAssignmentById({
  assignmentId,
  roomId,
  isInstructor,
  enabled = true,
}: UseFetchAssignmentByIdParams) {
  return useQuery<StudentAssignment | InstructorAssignment>({
    queryKey: [
      "assignment",
      assignmentId,
      isInstructor ? "instructor" : "student",
    ],
    queryFn: async () => {
      const endpoint = isInstructor
        ? `/assignments/instructor/${assignmentId}?roomId=${roomId}`
        : `/assignments/student/${assignmentId}?roomId=${roomId}`;

      const response = await api.get(endpoint);
      return response.data;
    },
    enabled: enabled && !!assignmentId,
    staleTime: Infinity,
  });
}
