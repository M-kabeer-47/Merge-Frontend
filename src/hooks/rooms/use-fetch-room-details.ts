import { useQuery } from "@tanstack/react-query";
import api from "@/utils/api";
import { toast } from "sonner";

import { RoomDetails } from "@/types/room-details";

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
