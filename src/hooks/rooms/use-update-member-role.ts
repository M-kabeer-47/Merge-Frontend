import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import api from "@/utils/api";
import {
  refreshRoomCache,
  refreshRoomMembersCache,
} from "@/server-actions/rooms";
import type { RoomDetails } from "@/types/room-details";
import type { RoomMember } from "@/server-api/room-members";

type MemberRole = "moderator" | "member";

interface UpdateMemberRoleParams {
  memberId: string;
  role: MemberRole;
}

export default function useUpdateMemberRole({ roomId }: { roomId: string }) {
  const queryClient = useQueryClient();

  const updateRoleFunction = async ({
    memberId,
    role,
  }: UpdateMemberRoleParams) => {
    // Use relative path - api utility already has baseURL configured
    const response = await api.patch(
      `/room/${roomId}/members/${memberId}/role`,
      { role },
    );
    return response.data;
  };

  const { isPending: isUpdating, mutateAsync: updateMemberRole } = useMutation({
    mutationFn: updateRoleFunction,

    onSuccess: async (_, variables) => {
      const { memberId, role } = variables;
      const isPromoting = role === "moderator";

      toast.success(
        isPromoting
          ? "Member promoted to moderator!"
          : "Moderator demoted to member.",
      );

      // Optimistically update the room cache
      queryClient.setQueryData<RoomDetails>(["room", roomId], (old) => {
        if (!old) return old;

        if (isPromoting) {
          // For promotions, we'll just invalidate and let the server refetch
          // The moderators will be updated from the server response
          return old;
        } else {
          // Remove from moderators by user ID
          const newModerators = (old.moderators || []).filter(
            (m) => m.id !== memberId,
          );
          return { ...old, moderators: newModerators };
        }
      });

      // Optimistically update the members list cache
      queryClient.setQueryData<RoomMember[]>(
        ["room", roomId, "members"],
        (old) => {
          if (!old) return old;
          return old.map((member) =>
            member.id === memberId ? { ...member, role } : member,
          );
        },
      );

      // Refresh server cache
      refreshRoomCache(roomId);
      refreshRoomMembersCache(roomId);
    },

    onError: (error: Error) => {
      toast.error(error.message || "Failed to update member role");
      console.log("Message", error.message);
    },
  });

  return {
    updateMemberRole,
    isUpdating,
  };
}
