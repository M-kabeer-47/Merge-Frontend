import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import api from "@/utils/api";
import { CreateRoomType } from "@/schemas/room/create-room";

export default function useCreateRoom() {
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
    onSuccess: () => {
      toast.success("Room created successfully!");
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
