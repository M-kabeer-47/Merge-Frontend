import { useQuery } from "@tanstack/react-query";
import apiRequest from "@/utils/api-request";
import axios from "axios";
import rotateToken from "@/utils/rotate-token";
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
  const { rotateToken: refreshTokenFn, isRotationPending } = rotateToken({
    oldToken:
      isClient && localStorage.getItem("refreshToken")
        ? localStorage.getItem("refreshToken")!
        : "",
  });

  const fetchUserRooms = async (): Promise<RoomsResponse | null> => {
    const token = localStorage.getItem("accessToken");
    if (!token) return null;

    try {
      const searchParam = search ? `&search=${encodeURIComponent(search)}` : "";
      const response = await apiRequest(
        axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/user/rooms?filter=${filter}${searchParam}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
      );
      return response.data;
    } catch (error: any) {
      // Check if error is 401 (Unauthorized)
      if (error?.response?.status === 401 || error?.statusCode === 401) {
        const result = await refreshTokenFn();
        // If token rotation was successful, retry fetching user rooms
        if (result?.token) {
          return fetchUserRooms();
        }
      }
      toast.error("Failed to fetch rooms, please try again later");
      return null;
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
    isLoading: isLoading || !isClient || isRotationPending,
    isError,
    refetch,
  };
}
