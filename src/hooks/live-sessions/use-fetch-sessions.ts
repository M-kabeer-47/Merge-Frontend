import { useQuery } from "@tanstack/react-query";
import api from "@/utils/api";
import type { LiveSessionResponse, SessionStatusType } from "@/types/live-session";
import { buildQueryParams } from "@/utils/query-params";

interface FetchSessionsResponse {
  sessions: LiveSessionResponse[];
  total: number;
  totalPages: number;
  currentPage: number;
}

interface UseFetchSessionsParams {
  roomId: string;
  status?: SessionStatusType;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "ASC" | "DESC";
  enabled?: boolean;
}

/**
 * Client-side hook to fetch live sessions for a room.
 */
export default function useFetchSessions({
  roomId,
  status,
  page = 1,
  limit = 20,
  sortBy,
  sortOrder,
  enabled = true,
}: UseFetchSessionsParams) {
  return useQuery({
    queryKey: ["live-sessions", roomId, status, page, limit, sortBy, sortOrder],
    queryFn: async () => {
      const params = buildQueryParams({
        roomId,
        status,
        page,
        limit,
        sortBy,
        sortOrder,
      });

      const response = await api.get<FetchSessionsResponse>(
        `/live-sessions?${params.toString()}`
      );
      return response.data;
    },
    enabled: enabled && !!roomId,
    staleTime: 30 * 1000, // 30 seconds
  });
}
