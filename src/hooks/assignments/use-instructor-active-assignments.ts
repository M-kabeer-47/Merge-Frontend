"use client";
import { useQuery } from "@tanstack/react-query";
import api from "@/utils/api";

export interface InstructorActiveAssignment {
  id: string;
  title: string;
  description: string | null;
  endAt: string | null;
  totalScore: number | null;
  totalAttempts: number;
  gradedAttempts: number;
  ungradedAttempts: number;
  room: { id: string; title: string } | null;
}

/** Fetches active (published, not closed) assignments authored by the instructor across all their rooms */
export default function useInstructorActiveAssignments(limit = 5) {
  const { data, isLoading, error } = useQuery({
    queryKey: ["assignments", "instructor-active", limit],
    queryFn: async () => {
      const response = await api.get<InstructorActiveAssignment[]>(
        `/assignments/my/instructor-active?limit=${limit}`,
      );
      return response.data;
    },
  });
  return { assignments: data ?? [], isLoading, error };
}
