"use client";

import { useQuery } from "@tanstack/react-query";
import api from "@/utils/api";

// Re-export the type from server-api for consistency
export type { RoomMember as RoomMemberResponse } from "@/server-api/room-members";
import type { RoomMember } from "@/server-api/room-members";

interface UseFetchRoomMembersParams {
  roomId: string;
  enabled?: boolean;
}

/**
 * Hook to fetch room members from the API (client-side)
 * GET /room/:roomId/members
 */
export default function useFetchRoomMembers({
  roomId,
  enabled = true,
}: UseFetchRoomMembersParams) {
  return useQuery<RoomMember[]>({
    queryKey: ["room", roomId, "members"],
    queryFn: async () => {
      const response = await api.get<RoomMember[]>(`/room/${roomId}/members`);
      return response.data;
    },
    enabled: enabled && !!roomId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}
