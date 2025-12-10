import apiRequest from "@/utils/api-request";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";
import usesRotateToken from "@/utils/rotate-token";

interface DeleteRoomParams {
  roomId: string;
  filter: "all" | "created" | "joined";
  search: string;
}

export default function useDeleteRoom() {
  const queryClient = useQueryClient();
  const { rotateToken, isRotationPending } = usesRotateToken({
    oldToken:
      typeof window !== "undefined"
        ? localStorage.getItem("refreshToken") || ""
        : "",
  });

  const deleteRoomFunction = async (roomId: string) => {
    const accessToken = localStorage.getItem("accessToken");
    return await apiRequest(
      axios.delete(`${process.env.NEXT_PUBLIC_BACKEND_URL}/room/${roomId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
    );
  };

  const {
    isPending: isDeleting,
    isError: isDeleteError,
    isSuccess: isDeleteSuccess,
    mutateAsync: deleteRoom,
  } = useMutation({
    mutationFn: ({ roomId }: DeleteRoomParams) => deleteRoomFunction(roomId),
    onError: async (error: any, variables) => {
      if (error?.response?.data?.statusCode === 401) {
        try {
          await rotateToken();
          await deleteRoom(variables);
        } catch (rotationError) {
          toast.error("Session expired. Please sign in again.");
        }
        return;
      }
      toast.error(
        error?.response?.data?.message ||
          "Failed to delete room. Please try again."
      );
    },
    onSuccess: (_, { roomId, filter, search }) => {
      // Update cache after successful deletion
      queryClient.setQueryData(["user-rooms", filter, search], (old: any) => {
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
      toast.success("Room deleted successfully!");
    },
  });

  return {
    deleteRoom,
    isDeleting,
    isDeleteError,
    isDeleteSuccess,
    isRotationPending,
  };
}
