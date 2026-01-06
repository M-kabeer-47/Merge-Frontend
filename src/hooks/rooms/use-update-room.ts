import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import api from "@/utils/api";
import { refreshRoomCache, refreshRoomsCache } from "@/server-actions/rooms";
import type { RoomsResponse, Room } from "@/server-api/rooms";
import type { RoomDetails } from "@/types/room-details";

interface UpdateRoomData {
  title?: string;
  description?: string;
  isPublic?: boolean;
  tags?: string[];
}

interface UseUpdateRoomOptions {
  onSuccess?: () => void;
}

export default function useUpdateRoom(
  roomId: string,
  options?: UseUpdateRoomOptions
) {
  const queryClient = useQueryClient();

  const updateRoomFunction = async (data: UpdateRoomData) => {
    const response = await api.patch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/room/${roomId}`,
      data
    );
    return response.data;
  };

  // Helper to update room in a rooms list cache
  const updateRoomsQueryData = (
    oldData: RoomsResponse | undefined,
    updatedData: UpdateRoomData
  ): RoomsResponse | undefined => {
    if (!oldData) return oldData;
    return {
      ...oldData,
      rooms: oldData.rooms.map((room) =>
        room.id === roomId ? { ...room, ...updatedData } : room
      ),
    };
  };

  const {
    isPending: isUpdating,
    isError: isUpdateError,
    isSuccess: isUpdateSuccess,
    mutateAsync: updateRoom,
  } = useMutation({
    mutationFn: updateRoomFunction,

    // On success - sync with server response and revalidate Next.js cache
    onSuccess: async (serverRoom: Room) => {
      toast.success("Room updated successfully!");

      // Update with actual server response (in case server modified data)
      queryClient.setQueryData<RoomDetails>(["room", roomId], (old) =>
        old ? { ...old, ...serverRoom } : old
      );

      queryClient.setQueryData<RoomsResponse>(["rooms", "all", ""], (oldData) =>
        updateRoomsQueryData(oldData, serverRoom)
      );
      queryClient.setQueryData<RoomsResponse>(
        ["rooms", "created", ""],
        (oldData) => updateRoomsQueryData(oldData, serverRoom)
      );
      queryClient.setQueryData<RoomsResponse>(
        ["rooms", "joined", ""],
        (oldData) => updateRoomsQueryData(oldData, serverRoom)
      );

      // Invalidate Next.js server cache for this specific room and rooms list

      refreshRoomsCache("all");
      refreshRoomCache(roomId);
    },
  });

  return {
    updateRoom,
    isUpdating,
    isUpdateError,
    isUpdateSuccess,
  };
}
