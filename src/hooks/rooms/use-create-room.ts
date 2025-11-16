import apiRequest from "@/utils/api-request";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";
import usesRotateToken from "@/utils/rotate-token";
import { CreateRoomType } from "@/schemas/room/create-room";

export default function useCreateRoom() {
  const { rotateToken, isRotationPending } = usesRotateToken({
    oldToken:
      typeof window !== "undefined"
        ? localStorage.getItem("refreshToken") || ""
        : "",
  });

  const createRoomFunction = async (data: CreateRoomType) => {
    const accessToken = localStorage.getItem("accessToken");
    return await apiRequest(
      axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/room/create`, data, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
    );
  };

  const {
    isPending: isCreating,
    isError: isCreateError,
    isSuccess: isCreateSuccess,
    mutateAsync: createRoom,
    data: createdRoom,
  } = useMutation({
    mutationFn: createRoomFunction,
    onError: async (error: any, variables) => {
      if (error?.response?.data?.statusCode === 401) {
        try {
          await rotateToken();

          // Afte rotation completes, the new token is in localStorage
          // Retry the request with the new token
          await createRoom(variables);
        } catch (rotationError) {
          toast.error("Session expired. Please sign in again.");
        }
        return; // Important: return here to prevent the error toast below
      }
      toast.error("Failed to create room. Please try again.");
    },
    onSuccess: (data) => {
      toast.success("Room created successfully!");
    },
  });

  return {
    createRoom,
    isCreating,
    isCreateError,
    isCreateSuccess,
    createdRoom,
    isRotationPending,
  };
}
