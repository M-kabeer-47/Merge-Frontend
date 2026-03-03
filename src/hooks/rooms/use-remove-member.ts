import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import api from "@/utils/api";
import { toastApiError } from "@/utils/toast-helpers";
import {
  refreshRoomCache,
  refreshRoomMembersCache,
  refreshRoomsCache,
} from "@/server-actions/rooms";
import type { RoomMember } from "@/server-api/room-members";
import { RoomsResponse } from "./use-get-user-rooms";

interface RemoveMemberParams {
  memberId: string;
}

export default function useRemoveMember({ roomId }: { roomId: string }) {
  const queryClient = useQueryClient();

  const removeMemberFunction = async ({ memberId }: RemoveMemberParams) => {
    const response = await api.delete(`/room/${roomId}/members/${memberId}`);
    return response.data;
  };

  const { isPending: isRemoving, mutateAsync: removeMember } = useMutation({
    mutationFn: removeMemberFunction,

    onSuccess: async (_, variables) => {
      const { memberId } = variables;

      toast.success("Member removed from the room.");

      // Optimistically update the members list cache
      queryClient.setQueryData<RoomMember[]>(
        ["room", roomId, "members"],
        (old) => {
          if (!old) return old;
          return old.filter((member) => member.id !== memberId);
        },
      );
      queryClient.setQueryData<RoomsResponse>(
        [
          "rooms",
          {
            filter: "created",
          },
        ],
        (old) => {
          if (!old) return old;
          return {
            ...old,
            rooms: old.rooms.map((room) => {
              if (room.id === roomId) {
                return {
                  ...room,
                  memberCount: room.memberCount - 1,
                  members: room.members.filter(
                    (member) => member.id !== memberId,
                  ),
                };
              }
              return room;
            }),
          };
        },
      );
      // Refresh server cache
      refreshRoomCache(roomId);
      refreshRoomsCache("all");
      refreshRoomMembersCache(roomId);
    },

    onError: (error: any) => {
      toastApiError(error, "Failed to remove member from room");
    },
  });

  return {
    removeMember,
    isRemoving,
  };
}
