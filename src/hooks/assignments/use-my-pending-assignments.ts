"use client";
import { useQuery } from "@tanstack/react-query";
import api from "@/utils/api";

export interface PendingAssignmentSummary {
  id: string;
  title: string;
  description: string | null;
  endAt: string | null;
  totalScore: number | null;
  isTurnInLateEnabled: boolean;
  author: { id: string; firstName: string; lastName: string } | null;
  room: { id: string; title: string } | null;
}

/** Fetches pending assignments across ALL rooms the user has joined or owns */
export default function useMyPendingAssignments(limit = 5) {
  const { data, isLoading, error } = useQuery({
    queryKey: ["assignments", "my-pending", limit],
    queryFn: async () => {
      const response = await api.get<PendingAssignmentSummary[]>(
        `/assignments/my/pending?limit=${limit}`,
      );
      return response.data;
    },
  });
  return { assignments: data ?? [], isLoading, error };
}
