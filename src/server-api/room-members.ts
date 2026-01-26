import { getWithAuth } from "./fetch-with-auth";

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

/**
 * Room member from the /room/:roomId/members API
 */
export interface RoomMember {
  id: string;
  role: "member" | "moderator";
  joinedAt: string;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    image: string | null;
  };
}

/**
 * Server-side function to fetch room members
 * GET /room/:roomId/members
 */
export async function getRoomMembers(roomId: string): Promise<RoomMember[]> {
  if (!roomId) {
    console.error("getRoomMembers: roomId is required");
    return [];
  }

  const { data, error } = await getWithAuth<RoomMember[]>(
    `${API_BASE_URL}/room/${roomId}/members`,
    {
      next: {
        revalidate: false,
        tags: ["room-members", `room-${roomId}-members`],
      },
    },
  );
  console.log("Room members:", data);

  if (error || !data) {
    console.error("Error fetching room members:", error);
    return [];
  }

  return data;
}
