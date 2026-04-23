import { useQuery } from "@tanstack/react-query";
import api from "@/utils/api";
import type { LiveSessionResponse } from "@/types/live-session";

interface UseGetSessionParams {
  sessionId: string;
  roomId: string;
  enabled?: boolean;
}

/**
 * Client-side hook to fetch a single live session with attendee details.
 */
export default function useGetSession({
  sessionId,
  roomId,
  enabled = true,
}: UseGetSessionParams) {
  return useQuery({
    queryKey: ["live-session", sessionId, roomId],
    queryFn: async () => {
      const response = await api.get<LiveSessionResponse>(
        `/live-sessions/${sessionId}?roomId=${roomId}`
      );
      return response.data;
    },
    enabled: enabled && !!sessionId && !!roomId,
    staleTime: 10 * 1000, // 10 seconds - more frequent updates for live data
    refetchInterval: 30 * 1000, // Refetch every 30 seconds to get updated attendee count
  });
}
