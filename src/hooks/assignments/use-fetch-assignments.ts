import { useQuery } from "@tanstack/react-query";
import api from "@/utils/api";
import type { Assignment } from "@/types/assignment";
import { buildQueryParams } from "@/utils/query-params";

interface FetchAssignmentsResponse {
  assignments: Assignment[];
  total: number;
  totalPages: number;
  currentPage: number;
}

interface UseFetchAssignmentsParams {
  roomId: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  enabled?: boolean;
}

/**
 * Client-side hook to fetch assignments for a room
 */
export default function useFetchAssignments({
  roomId,
  page = 1,
  limit = 20,
  sortBy,
  sortOrder,
  enabled = true,
}: UseFetchAssignmentsParams) {
  return useQuery({
    queryKey: ["assignments", roomId, page, limit, sortBy, sortOrder],
    queryFn: async () => {
      const params = buildQueryParams({
        roomId,
        page,
        limit,
        sortBy,
        sortOrder,
      });

      const response = await api.get<FetchAssignmentsResponse>(
        `/assignments?${params.toString()}`
      );
      return response.data;
    },
    enabled: enabled && !!roomId,
    staleTime: 60 * 1000, // 1 minute
  });
}
