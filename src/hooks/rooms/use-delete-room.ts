import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import api from "@/utils/api";
import { toastApiError } from "@/utils/toast-helpers";
import { refreshRoomsCache } from "@/server-actions/rooms";

interface DeleteRoomParams {
  roomId: string;
  filter: "all" | "created" | "joined";
  search: string;
}

export default function useDeleteRoom() {
  const queryClient = useQueryClient();

  const deleteRoomFunction = async (roomId: string) => {
    const response = await api.delete(`/room/${roomId}`);
    return response.data;
  };

  const {
    isPending: isDeleting,
    isError: isDeleteError,
    isSuccess: isDeleteSuccess,
    mutateAsync: deleteRoom,
  } = useMutation({
    mutationFn: ({ roomId }: DeleteRoomParams) => deleteRoomFunction(roomId),
    onError: (error: any) => {
      toastApiError(error, "Failed to delete room. Please try again.");
    },
    onSuccess: (_, { roomId, filter, search }) => {
      // Update cache after successful deletion
      queryClient.setQueryData(["rooms", filter, search], (old: any) => {
        if (!old) return old;
        return {
          ...old,
          rooms: old.rooms.filter((room: any) => room.id !== roomId),
          total: old.total - 1,
          counts: {
            ...old.counts,
            total: old.counts.total - 1,
            created: old.counts.created > 0 ? old.counts.created - 1 : 0,
          },
        };
      });
      refreshRoomsCache("all")
      toast.success("Room deleted successfully!");
    },
  });

  return {
    deleteRoom,
    isDeleting,
    isDeleteError,
    isDeleteSuccess,
  };
}
