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
  autoJoin?: boolean;
  tagNames?: string[];
}

export default function useUpdateRoom({ roomId }: { roomId: string }) {
  const queryClient = useQueryClient();

  const updateRoomFunction = async (data: UpdateRoomData) => {
    const response = await api.patch(`room/${roomId}`, data);
    return response.data;
  };

  // Helper to update room in a rooms list cache
  const updateRoomInCache = (
    oldData: RoomsResponse | undefined,
    updatedData: UpdateRoomData,
  ): RoomsResponse | undefined => {
    if (!oldData) return oldData;
    return {
      ...oldData,
      rooms: oldData.rooms.map((room) =>
        room.id === roomId ? { ...room, ...updatedData } : room,
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

    // Optimistic update - runs BEFORE API call
    onMutate: async (newData: UpdateRoomData) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ["room", roomId] });
      await queryClient.cancelQueries({ queryKey: ["rooms"] });

      // Snapshot previous values for rollback
      const previousRoom = queryClient.getQueryData<RoomDetails>([
        "room",
        roomId,
      ]);
      const previousRoomsCreated = queryClient.getQueryData<RoomsResponse>([
        "rooms",
        "created",
        "",
      ]);

      // Optimistically update room details (instant!)
      queryClient.setQueryData<RoomDetails>(
        ["room", roomId],
        (old) => (old ? { ...old, ...newData } : old) as RoomDetails,
      );

      // Optimistically update rooms lists
      queryClient.setQueryData(
        ["rooms", "created", ""],
        (old: RoomsResponse | undefined) => updateRoomInCache(old, newData),
      );

      // Return context for rollback
      return {
        previousRoom,
        previousRoomsCreated,
      };
    },

    // Rollback on error
    onError: (error: any, _newData, context) => {
      // Restore previous values
      if (context?.previousRoom) {
        queryClient.setQueryData(["room", roomId], context.previousRoom);
      }
      if (context?.previousRoomsCreated) {
        queryClient.setQueryData(
          ["rooms", "created", ""],
          context.previousRoomsCreated,
        );
      }

      toast.error("Failed to update room. Please try again.");
    },

    // On success - sync with server response and revalidate Next.js cache
    onSuccess: async () => {
      // Invalidate Next.js server cache for this specific room and rooms list
      await Promise.all([
        refreshRoomCache(roomId),
        refreshRoomsCache(), // Uses default filter: "all"
      ]);
    },
  });

  return {
    updateRoom,
    isUpdating,
    isUpdateError,
    isUpdateSuccess,
  };
}
