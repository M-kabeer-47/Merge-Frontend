import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import api from "@/utils/api";
import { CreateRoomType } from "@/schemas/room/create-room";
import { RoomsResponse, Room } from "@/server-api/rooms";
import { refreshRoomsCache } from "@/server-actions/rooms";

export default function useCreateRoom() {
  const queryClient = useQueryClient();

  const createRoomFunction = async (data: CreateRoomType) => {
    const response = await api.post("/room/create", data);
    return response.data;
  };

  const {
    isPending: isCreating,
    isError: isCreateError,
    isSuccess: isCreateSuccess,
    mutateAsync: createRoom,
    data: createdRoom,
  } = useMutation({
    mutationFn: createRoomFunction,
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message ||
          "Failed to create room. Please try again."
      );
    },
    onSuccess: (createdRoom: Room) => {
      // Optimistic update - add new room to all matching query keys
      queryClient.setQueryData(
        ["rooms", "all", ""],
        (oldData: RoomsResponse | undefined) => {
          if (!oldData) return undefined;
          return {
            ...oldData,
            rooms: [createdRoom, ...oldData.rooms],
            counts: {
              created: oldData.counts.created + 1,
              joined: oldData.counts.joined,
              total: oldData.counts.total + 1,
            },
          };
        }
      );

      // Also update "created" filter
      queryClient.setQueryData(
        ["rooms", "created", ""],
        (oldData: RoomsResponse | undefined) => {
          if (!oldData) return undefined;
          return {
            ...oldData,
            rooms: [createdRoom, ...oldData.rooms],
            counts: {
              created: oldData.counts.created + 1,
              joined: oldData.counts.joined,
              total: oldData.counts.total + 1,
            },
          };
        }
      );

      toast.success("Room created successfully!");
    },
    onSettled: async () => {
      // Refresh Next.js Data Cache so next navigation is fresh
      refreshRoomsCache("all");
    },
  });

  return {
    createRoom,
    isCreating,
    isCreateError,
    isCreateSuccess,
    createdRoom,
  };
}
