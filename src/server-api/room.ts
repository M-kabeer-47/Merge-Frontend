import { RoomDetails } from "@/types/room-details";
import { getWithAuth } from "./fetch-with-auth";
import { API_BASE_URL } from "@/lib/constants/api";

export async function getRoomDetails(
  roomId: string
): Promise<RoomDetails | null> {
  if (!roomId) {
    console.error("getRoomDetails: roomId is required");
    return null;
  }

  const { data, error } = await getWithAuth<RoomDetails>(
    `${API_BASE_URL}/room/${roomId}`,
    {
      next: {
        revalidate: 0,
        tags: ["room", `room-${roomId}`],
      },
    }
  );

  if (error || !data) {
    console.error("Error fetching room details:", error);
    return null;
  }

  return data;
}
