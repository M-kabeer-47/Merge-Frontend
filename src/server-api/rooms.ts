import { getWithAuth } from "@/server-api/fetch-with-auth";
import axios from "axios";
import { API_BASE_URL } from "@/lib/constants/api";
import { buildQueryParams } from "@/utils/query-params";

interface RoomAdmin {
  id: string;
  email: string;
  image: string;
  firstName: string;
  lastName: string;
}

interface RoomMember {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  image: string;
}

interface RoomTag {
  id: string;
  name: string;
}

export interface Room {
  id: string;
  title: string;
  description: string;
  isPublic: boolean;
  autoJoin: boolean;
  roomCode: string;
  tags: RoomTag[];
  admin: RoomAdmin;
  members: RoomMember[];
  createdAt: string;
  updatedAt: string;
  type: "created" | "joined";
  userRole: string;
  memberCount: number;
}

export interface RoomsResponse {
  rooms: Room[];
  total: number;
  totalPages: number;
  currentPage: number;
  filter: string;
  counts: {
    created: number;
    joined: number;
    total: number;
  };
}

export interface GetRoomsParams {
  filter?: "all" | "created" | "joined";
  search?: string;
}

// Default empty response
const EMPTY_RESPONSE: RoomsResponse = {
  rooms: [],
  total: 0,
  totalPages: 0,
  currentPage: 1,
  filter: "all",
  counts: { created: 0, joined: 0, total: 0 },
};

/**
 * Server-side fetch for user rooms with Next.js Data Cache
 */
export async function getRooms(
  params: GetRoomsParams = {},
): Promise<RoomsResponse> {
  const { filter = "all", search = "" } = params;

  // Build query string
  const queryParams = buildQueryParams({ filter, search });

  const { data, error } = await getWithAuth<RoomsResponse>(
    `${API_BASE_URL}/user/rooms?${queryParams.toString()}`,
    {
      next: {
        revalidate: false, // Cache forever until manual invalidation
        tags: ["rooms", `rooms-${filter}`],
      },
    },
  );

  if (error || !data) {
    console.error("Error fetching rooms:", error);
    return EMPTY_RESPONSE;
  }

  return data;
}

// ═══════════════════════════════════════════════════════════════════
// ROOM MEMBERS API
// ═══════════════════════════════════════════════════════════════════

import type { RoomMember as RoomMemberForTable } from "@/types/room-settings";

interface RoomMemberApiUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  image: string | null;
}

interface RoomMemberApiResponse {
  id: string;
  role: "member" | "moderator" | "instructor";
  joinedAt: string;
  user: RoomMemberApiUser;
}

/**
 * Server-side fetch for room members
 */
export async function getRoomMembers(
  roomId: string,
): Promise<RoomMemberForTable[]> {
  const { data, error } = await getWithAuth<RoomMemberApiResponse[]>(
    `${API_BASE_URL}/room/${roomId}/members`,
    {
      next: {
        revalidate: false,
        tags: ["room-members", `room-members-${roomId}`],
      },
    },
  );

  if (error || !data) {
    console.error("Error fetching room members:", error);
    return [];
  }

  // Transform API response to match RoomMember type expected by MembersTable
  return data.map((member) => ({
    id: member.id,
    name: `${member.user.firstName} ${member.user.lastName}`,
    email: member.user.email,
    avatar: member.user.image || undefined,
    role: member.role,
    joinedAt: new Date(member.joinedAt),
    isMuted: false,
  }));
}
