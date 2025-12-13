import { useQuery } from "@tanstack/react-query";
import apiRequest from "@/utils/api-request";
import axios from "axios";
import rotateToken from "@/utils/rotate-token";
import { toast } from "sonner";
import { User } from "@/types/user";

const isClient = typeof window !== "undefined";

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

export interface RoomDetails {
  id: string;
  title: string;
  description: string;
  isPublic: boolean;
  roomCode: string;
  tags: RoomTag[];
  admin: User;
  members: RoomMember[];
  createdAt: string;
  updatedAt: string;
  userRole: string;
  memberCount: number;
}

export default function useFetchRoomDetails(roomId: string) {
  const { rotateToken: refreshTokenFn, isRotationPending } = rotateToken({
    oldToken:
      isClient && localStorage.getItem("refreshToken")
        ? localStorage.getItem("refreshToken")!
        : "",
  });

  const fetchRoomDetails = async (): Promise<RoomDetails | null> => {
    const token = localStorage.getItem("accessToken");
    if (!token || !roomId) return null;

    try {
      const response = await apiRequest(
        axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/room/${roomId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
      );
      return response.data;
    } catch (error: any) {
      // Check if error is 401 (Unauthorized)
      if (error?.response?.status === 401 || error?.statusCode === 401) {
        const result = await refreshTokenFn();
        // If token rotation was successful, retry fetching room details
        if (result?.token) {
          return fetchRoomDetails();
        }
      }
      toast.error("Failed to fetch room details");
      return null;
    }
  };

  const { data, isLoading, isFetching, isError, refetch } = useQuery({
    queryKey: ["room-details", roomId],
    queryFn: fetchRoomDetails,
    enabled: isClient && !!roomId,
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  return {
    room: data,
    isLoading: isLoading || isFetching || !isClient || isRotationPending,
    isError,
    refetch,
  };
}
