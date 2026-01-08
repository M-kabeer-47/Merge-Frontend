import { getWithAuth } from "@/server-api/fetch-with-auth";
import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

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
  params: GetRoomsParams = {}
): Promise<RoomsResponse> {
  const { filter = "all", search = "" } = params;

  // Build query string
  const queryParams = new URLSearchParams({ filter });
  if (search) queryParams.append("search", search);

  const { data, error } = await getWithAuth<RoomsResponse>(
    `${API_BASE_URL}/user/rooms?${queryParams.toString()}`,
    {
      next: {
        revalidate: false, // Cache forever until manual invalidation
        tags: ["rooms", `rooms-${filter}`],
      },
    }
  );

  if (error || !data) {
    console.error("Error fetching rooms:", error);
    return EMPTY_RESPONSE;
  }

  return data;
}
