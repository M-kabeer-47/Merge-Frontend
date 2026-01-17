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
  tags?: string[];
}

interface UseUpdateRoomOptions {
  onSuccess?: () => void;
}

export default function useUpdateRoom(
  roomId: string,
  options?: UseUpdateRoomOptions,
) {
  const queryClient = useQueryClient();

  const updateRoomFunction = async (data: UpdateRoomData) => {
    const response = await api.patch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/room/${roomId}`,
      data,
    );
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
      const previousRoomsAll = queryClient.getQueryData<RoomsResponse>([
        "rooms",
        "all",
        "",
      ]);
      const previousRoomsCreated = queryClient.getQueryData<RoomsResponse>([
        "rooms",
        "created",
        "",
      ]);
      const previousRoomsJoined = queryClient.getQueryData<RoomsResponse>([
        "rooms",
        "joined",
        "",
      ]);

      // Optimistically update room details (instant!)
      queryClient.setQueryData<RoomDetails>(
        ["room", roomId],
        (old) => (old ? { ...old, ...newData } : old) as RoomDetails,
      );

      // Optimistically update rooms lists
      queryClient.setQueryData(
        ["rooms", "all", ""],
        (old: RoomsResponse | undefined) => updateRoomInCache(old, newData),
      );
      queryClient.setQueryData(
        ["rooms", "created", ""],
        (old: RoomsResponse | undefined) => updateRoomInCache(old, newData),
      );
      queryClient.setQueryData(
        ["rooms", "joined", ""],
        (old: RoomsResponse | undefined) => updateRoomInCache(old, newData),
      );

      // Return context for rollback
      return {
        previousRoom,
        previousRoomsAll,
        previousRoomsCreated,
        previousRoomsJoined,
      };
    },

    // Rollback on error
    onError: (error: any, _newData, context) => {
      // Restore previous values
      if (context?.previousRoom) {
        queryClient.setQueryData(["room", roomId], context.previousRoom);
      }
      if (context?.previousRoomsAll) {
        queryClient.setQueryData(
          ["rooms", "all", ""],
          context.previousRoomsAll,
        );
      }
      if (context?.previousRoomsCreated) {
        queryClient.setQueryData(
          ["rooms", "created", ""],
          context.previousRoomsCreated,
        );
      }
      if (context?.previousRoomsJoined) {
        queryClient.setQueryData(
          ["rooms", "joined", ""],
          context.previousRoomsJoined,
        );
      }

      toast.error(
        error?.response?.data?.message ||
          "Failed to update room. Please try again.",
      );
    },

    // On success - sync with server response and revalidate Next.js cache
    onSuccess: async (serverRoom: Room) => {
      toast.success("Room updated successfully!");

      // Update with actual server response (in case server modified data)
      queryClient.setQueryData<RoomDetails>(["room", roomId], (old) =>
        old ? { ...old, ...serverRoom } : old,
      );

      // Invalidate Next.js server cache for this specific room and rooms list
      await Promise.all([
        refreshRoomCache(roomId),
        refreshRoomsCache(), // Uses default filter: "all"
      ]);

      options?.onSuccess?.();
    },
  });

  return {
    updateRoom,
    isUpdating,
    isUpdateError,
    isUpdateSuccess,
  };
}
