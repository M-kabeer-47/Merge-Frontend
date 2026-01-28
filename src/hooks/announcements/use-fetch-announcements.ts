import { useQuery } from "@tanstack/react-query";
import api from "@/utils/api";
import type { Announcement } from "@/types/announcement";

interface FetchAnnouncementsParams {
  roomId: string;
  type?: "all" | "published" | "scheduled";
}

export default function useFetchAnnouncements({
  roomId,
  type = "all",
}: FetchAnnouncementsParams) {
  const queryKey = ["announcements", roomId, type];

  return useQuery({
    queryKey,
    queryFn: async (): Promise<Announcement[]> => {
      // API returns { announcements: [], total: ... }
      const response = await api.get<{ announcements: Announcement[] }>(
        `/announcements?roomId=${roomId}&filter=${type}`,
      );
      return response.data.announcements || [];
    },
    enabled: !!roomId,
    staleTime: 60 * 1000,
  });
}
