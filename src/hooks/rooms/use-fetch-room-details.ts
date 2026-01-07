import { useQuery } from "@tanstack/react-query";
import api from "@/utils/api";
import { toast } from "sonner";
import { User } from "@/types/user";

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
  const fetchRoomDetails = async (): Promise<RoomDetails | null> => {
    if (!roomId) return null;

    try {
      const response = await api.get(`/room/${roomId}`);
      return response.data;
    } catch (error: any) {
      toast.error("Failed to fetch room details");
      throw error;
    }
  };

  const { data, isLoading, isFetching, isError, refetch } = useQuery({
    queryKey: ["room-details", roomId],
    queryFn: fetchRoomDetails,
    enabled: !!roomId,
    retry: false,
    staleTime: Infinity,
  });

  return {
    room: data,
    isLoading: isLoading || isFetching,
    isError,
    refetch,
  };
}
