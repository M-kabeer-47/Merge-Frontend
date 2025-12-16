import { useQuery } from "@tanstack/react-query";
import api from "@/utils/api";
import { toast } from "sonner";

const isClient = typeof window !== "undefined";

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

interface RoomsResponse {
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

export default function useGetUserRooms({
  filter,
  search = "",
}: {
  filter: "all" | "created" | "joined";
  search?: string;
}) {
  const fetchUserRooms = async (): Promise<RoomsResponse | null> => {
    const token = isClient ? localStorage.getItem("accessToken") : null;
    if (!token) return null;

    try {
      const searchParam = search ? `&search=${encodeURIComponent(search)}` : "";
      const response = await api.get(
        `/user/rooms?filter=${filter}${searchParam}`
      );
      return response.data;
    } catch (error: any) {
      toast.error("Failed to fetch rooms, please try again later");
      throw error;
    }
  };

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["user-rooms", filter, search],
    queryFn: fetchUserRooms,
    enabled: isClient && !!localStorage.getItem("accessToken"),
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  return {
    rooms: data?.rooms || [],
    counts: data?.counts || { created: 0, joined: 0, total: 0 },
    total: data?.total || 0,
    isLoading: isLoading || !isClient,
    isError,
    refetch,
  };
}
