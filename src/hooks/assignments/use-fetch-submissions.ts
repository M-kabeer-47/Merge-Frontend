"use client";

import { useQuery } from "@tanstack/react-query";
import api from "@/utils/api";
import type { AttemptsResponse, InstructorAssignment } from "@/types/assignment";

interface UseFetchSubmissionsParams {
  assignmentId: string;
  roomId: string;
  filter?: string;
  subFilter?: string;
  page?: number;
  enabled?: boolean;
  /** Initial data from server-side fetch to prevent double fetching */
  initialData?: AttemptsResponse;
}

/**
 * Separate hook for fetching submissions with filters.
 * This allows the table to reload independently without reloading the whole page.
 * 
 * When initialData is provided (from server-side fetch), it's used as the initial
 * query data to prevent an unnecessary refetch on mount.
 * 
 * The API returns the full InstructorAssignment, we extract just the attempts.
 */
export default function useFetchSubmissions({
  assignmentId,
  roomId,
  filter = "all",
  subFilter = "all",
  page = 1,
  enabled = true,
  initialData,
}: UseFetchSubmissionsParams) {
  return useQuery<AttemptsResponse>({
    queryKey: ["submissions", assignmentId, filter, subFilter, page],
    queryFn: async () => {
      let endpoint = `/assignments/instructor/${assignmentId}?roomId=${roomId}`;

      // Add filter params
      if (filter && filter !== "all") {
        endpoint += `&filter=${filter}`;
        if (filter === "ungraded" && subFilter && subFilter !== "all") {
          endpoint += `&subFilter=${subFilter}`;
        }
      }

      // Add pagination
      if (page > 1) {
        endpoint += `&page=${page}`;
      }

      const response = await api.get<InstructorAssignment>(endpoint);
      // API returns full assignment, extract just the attempts
      console.log("Response", response.data)
      return response.data.attempts;
    },
    enabled: enabled && !!assignmentId,
    staleTime: 0, // Always refetch on filter change
    initialData,
  });
}
