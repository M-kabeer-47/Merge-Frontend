import { useQuery } from "@tanstack/react-query";
import api from "@/utils/api";
import type {
  StudentAssignment,
  InstructorAssignment,
  Assignment,
} from "@/types/assignment";
import { buildQueryParams } from "@/utils/query-params";

interface FetchAssignmentsParams {
  roomId: string;
  isInstructor: boolean;
  search?: string;
  sortBy?: string;
  filter?: string;
  sortOrder?: "asc" | "desc";
}

interface AssignmentsResponse<T> {
  assignments?: T[];
}

export default function useFetchRoleBasedAssignments({
  roomId,
  isInstructor,
  search,
  sortBy,
  filter,
  sortOrder,
}: FetchAssignmentsParams) {
  const endpoint = isInstructor
    ? "/assignments/instructor"
    : "/assignments/student";

  const queryKey = [
    "assignments",
    roomId,
    isInstructor ? "instructor" : "student",
    search || "",
    sortBy || null,
    filter || null,
    sortOrder || null,
  ];

  return useQuery({
    queryKey,
    queryFn: async (): Promise<Assignment[]> => {
      const params = buildQueryParams({
        roomId,
        search,
        sortBy,
        filter,
        sortOrder: sortOrder?.toUpperCase(),
      });

      const response = await api.get<
        | AssignmentsResponse<StudentAssignment | InstructorAssignment>
        | Assignment[]
      >(`${endpoint}?${params.toString()}`);

      const data = response.data;
      return Array.isArray(data) ? data : data.assignments || [];
    },
    enabled: !!roomId,
    staleTime: Infinity,
  });
}
