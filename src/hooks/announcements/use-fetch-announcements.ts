import { useQuery } from "@tanstack/react-query";
import api from "@/utils/api";
import type { Announcement } from "@/types/announcement";

interface FetchAnnouncementsParams {
  roomId: string;
}

export default function useFetchAnnouncements({
  roomId,
}: FetchAnnouncementsParams) {
  const queryKey = ["announcements", roomId];

  return useQuery({
    queryKey,
    queryFn: async (): Promise<Announcement[]> => {
      // API returns { announcements: [], total: ... }
      const response = await api.get<{ announcements: Announcement[] }>(
        `/announcements?roomId=${roomId}`,
      );
      return response.data.announcements || [];
    },
    enabled: !!roomId,
    staleTime: 60 * 1000,
  });
}
