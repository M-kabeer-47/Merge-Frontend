import { useQuery } from "@tanstack/react-query";
import api from "@/utils/api";
import type { JoinRequest } from "@/types/join-request";

interface UseFetchJoinRequestsParams {
  roomId: string;
  enabled?: boolean;
}

/**
 * Fetch pending join requests for a room (instructor only)
 */
export default function useFetchJoinRequests({
  roomId,
  enabled = true,
}: UseFetchJoinRequestsParams) {
  return useQuery({
    queryKey: ["join-requests", roomId],
    queryFn: async () => {
      const response = await api.get<JoinRequest[]>(
        `/room/${roomId}/join-requests`
      );
      return response.data;
    },
    enabled: enabled && !!roomId,
    staleTime: 30 * 1000, // 30 seconds
  });
}
