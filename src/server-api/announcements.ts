import { getWithAuth, postWithAuth } from "./fetch-with-auth";
import type {
  Announcement,
  CreateAnnouncementPayload,
} from "@/types/announcement";

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

interface AnnouncementsResponse {
  announcements: Announcement[];
  total: number;
}

export async function getAnnouncements({
  roomId,
  filter,
}: {
  roomId: string;
  filter: string;
}): Promise<Announcement[]> {
  const { data, error } = await getWithAuth<AnnouncementsResponse>(
    `${API_BASE_URL}/announcements?roomId=${roomId}&filter=${filter}`,
    {
      next: {
        revalidate: false,
        tags: ["announcements", `announcements-${roomId}`],
      },
    },
  );

  if (error || !data) {
    console.error("Error fetching announcements:", error);
    return [];
  }

  // The API returns { announcements: [], total: X }
  return data.announcements || [];
}
