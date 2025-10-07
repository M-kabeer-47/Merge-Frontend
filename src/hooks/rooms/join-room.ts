import apiRequest from "@/utils/api-request";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";
import usesRotateToken from "@/utils/rotate-token";
import { JoinRoomType } from "@/schemas/room/join-room";

export default function useJoinRoom() {
  const { rotateToken, isRotationPending } = usesRotateToken({
    oldToken:
      typeof window !== "undefined"
        ? localStorage.getItem("refreshToken") || ""
        : "",
  });

  const joinRoomFunction = async (data: JoinRoomType) => {
    const accessToken = localStorage.getItem("accessToken");
    return await apiRequest(
      axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/room/join`, data, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
    );
  };

  const {
    isPending: isJoining,
    isError: isJoinError,
    isSuccess: isJoinSuccess,
    mutateAsync: joinRoom,
    data: joinedRoom,
  } = useMutation({
    mutationFn: joinRoomFunction,
    onError: async (error: any, variables) => {
      if (error?.response?.data?.statusCode === 401) {
        try {
          await rotateToken();
          await joinRoom(variables);
        } catch (rotationError) {
          toast.error("Session expired. Please sign in again.");
        }
        return;
      }
      toast.error(
        error?.response?.data?.message || 
        "Failed to send join request. Please check the room code."
      );
    },
    onSuccess: (data) => {
      toast.success("Join request sent successfully! Waiting for approval.");
    },
  });

  return {
    joinRoom,
    isJoining,
    isJoinError,
    isJoinSuccess,
    joinedRoom,
    isRotationPending,
  };
}
