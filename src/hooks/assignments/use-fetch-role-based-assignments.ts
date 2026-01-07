import { useQuery } from "@tanstack/react-query";
import api from "@/utils/api";
import type {
  StudentAssignment,
  InstructorAssignment,
  Assignment,
} from "@/types/assignment";

interface FetchAssignmentsParams {
  roomId: string;
  isInstructor: boolean;
  search?: string;
  sortBy?: string;
  filter?: string;
}

interface AssignmentsResponse<T> {
  assignments?: T[];
}

/**
 * Client-side hook to fetch assignments based on user role
 * Uses the role from RoomProvider to determine which endpoint to call
 */
export default function useFetchRoleBasedAssignments({
  roomId,
  isInstructor,
  search,
  sortBy,
  filter,
}: FetchAssignmentsParams) {
  const endpoint = isInstructor
    ? "/assignments/instructor"
    : "/assignments/student";

  const queryKey = [
    "assignments",
    roomId,
    isInstructor ? "instructor" : "student",
    search || "",
    sortBy || "",
    filter || "",
  ];

  return useQuery({
    queryKey,
    queryFn: async (): Promise<Assignment[]> => {
      const params = new URLSearchParams({ roomId });
      if (search) params.append("search", search);
      if (sortBy) params.append("sortBy", sortBy);
      if (filter) params.append("filter", filter);

      const response = await api.get<
        | AssignmentsResponse<StudentAssignment | InstructorAssignment>
        | Assignment[]
      >(`${endpoint}?${params.toString()}`);

      const data = response.data;
      return Array.isArray(data) ? data : data.assignments || [];
    },
    enabled: !!roomId,
    staleTime: 60 * 1000, // 1 minute
  });
}
