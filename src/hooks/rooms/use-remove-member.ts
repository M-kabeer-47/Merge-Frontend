import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import api from "@/utils/api";
import {
  refreshRoomCache,
  refreshRoomMembersCache,
} from "@/server-actions/rooms";
import type { RoomMember } from "@/server-api/room-members";

interface RemoveMemberParams {
  roomId: string;
  memberId: string;
}

export default function useRemoveMember() {
  const queryClient = useQueryClient();

  const removeMemberFunction = async ({
    roomId,
    memberId,
  }: RemoveMemberParams) => {
    const response = await api.delete(`/room/${roomId}/members/${memberId}`);
    return response.data;
  };

  const { isPending: isRemoving, mutateAsync: removeMember } = useMutation({
    mutationFn: removeMemberFunction,

    onSuccess: async (_, variables) => {
      const { roomId, memberId } = variables;

      toast.success("Member removed from the room.");

      // Optimistically update the members list cache
      queryClient.setQueryData<RoomMember[]>(
        ["room", roomId, "members"],
        (old) => {
          if (!old) return old;
          return old.filter((member) => member.id !== memberId);
        },
      );
      // Refresh server cache
      refreshRoomCache(roomId);
      refreshRoomMembersCache(roomId);
    },

    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message || "Failed to remove member from room",
      );
    },
  });

  return {
    removeMember,
    isRemoving,
  };
}
