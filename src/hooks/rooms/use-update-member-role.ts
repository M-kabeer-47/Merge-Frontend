import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import api from "@/utils/api";
import { refreshRoomCache } from "@/server-actions/rooms";
import type { RoomDetails } from "@/types/room-details";

type MemberRole = "moderator" | "member";

interface UpdateMemberRoleParams {
  roomId: string;
  memberId: string;
  role: MemberRole;
}

export default function useUpdateMemberRole() {
  const queryClient = useQueryClient();

  const updateRoleFunction = async ({
    roomId,
    memberId,
    role,
  }: UpdateMemberRoleParams) => {
    const response = await api.patch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/room/${roomId}/members/${memberId}/role`,
      { role }
    );
    return response.data;
  };

  const { isPending: isUpdating, mutateAsync: updateMemberRole } = useMutation({
    mutationFn: updateRoleFunction,

    onSuccess: async (_, variables) => {
      const { roomId, memberId, role } = variables;
      const isPromoting = role === "moderator";

      toast.success(
        isPromoting
          ? "Member promoted to moderator!"
          : "Moderator demoted to member."
      );

      // Optimistically update the room cache
      queryClient.setQueryData<RoomDetails>(["room", roomId], (old) => {
        if (!old) return old;

        // Find the member in the members list
        const member = old.members.find((m) => m.id === memberId);
        if (!member) return old;

        if (isPromoting) {
          // Add to moderators, keep in members
          const newModerators = [...(old.moderators || []), member];
          return { ...old, moderators: newModerators };
        } else {
          // Remove from moderators
          const newModerators = (old.moderators || []).filter(
            (m) => m.id !== memberId
          );
          return { ...old, moderators: newModerators };
        }
      });

      // Refresh server cache
      refreshRoomCache(roomId);
    },

    onError: (error: Error) => {
      toast.error(error.message || "Failed to update member role");
    },
  });

  return {
    updateMemberRole,
    isUpdating,
  };
}
