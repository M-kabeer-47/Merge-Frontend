import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import api from "@/utils/api";
import { JoinRoomType } from "@/schemas/room/join-room";

export default function useJoinRoom() {
  const joinRoomFunction = async (data: JoinRoomType) => {
    const response = await api.post("/room/join", data);
    return response.data;
  };

  const {
    isPending: isJoining,
    isError: isJoinError,
    isSuccess: isJoinSuccess,
    mutateAsync: joinRoom,
    data: joinedRoom,
  } = useMutation({
    mutationFn: joinRoomFunction,
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message ||
          "Failed to send join request. Please check the room code."
      );
    },
    onSuccess: () => {
      toast.success("Join request sent successfully! Waiting for approval.");
    },
  });

  return {
    joinRoom,
    isJoining,
    isJoinError,
    isJoinSuccess,
    joinedRoom,
  };
}
