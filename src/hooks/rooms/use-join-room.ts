import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import api from "@/utils/api";
import { JoinRoomType } from "@/schemas/room/join-room";
import { RoomsResponse } from "./use-get-user-rooms";

export default function useJoinRoom() {
  const queryClient = useQueryClient();

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
          "Failed to send join request. Please check the room code.",
      );
    },
    onSuccess: (data) => {
      const message = data?.message || "";

      // Case 1: Successfully joined - update cache
      if (message.includes("Successfully joined")) {
        toast.success("Successfully joined the room!");

        // Invalidate rooms query to refetch with new room included
        queryClient.invalidateQueries({ queryKey: ["rooms"] });

        // Optionally add the room directly to the cache for instant UI update
        if (data?.room) {
          queryClient.setQueryData<RoomsResponse>(
            ["rooms", { filter: "all", search: "" }],
            (old) => {
              if (!old) return old;
              return {
                ...old,
                rooms: [...old.rooms, { ...data.room, type: "joined" }],
              };
            },
          );
        }
      }
      // Case 2: Join request submitted
      else if (message.includes("Join request submitted")) {
        toast.success("Join request sent. Waiting for approval.");
      }
      // Case 3: Already requested
      else if (message.includes("already requested")) {
        toast.info(
          "You've already requested to join. Please wait for approval.",
        );
      }
      // Fallback
      else {
        toast.success(message || "Request processed successfully.");
      }
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
