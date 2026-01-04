import { useQuery } from "@tanstack/react-query";
import api from "@/utils/api";

/**
 * Client-side hook to fetch assignment by ID
 */
export default function useFetchAssignmentById(
  assignmentId: string,
  enabled: boolean = true
) {
  return useQuery({
    queryKey: ["assignment", assignmentId],
    queryFn: async () => {
      const response = await api.get(`/assignments/${assignmentId}`);
      return response.data;
    },
    enabled: enabled && !!assignmentId,
    staleTime: 60 * 1000, // 1 minute
  });
}
