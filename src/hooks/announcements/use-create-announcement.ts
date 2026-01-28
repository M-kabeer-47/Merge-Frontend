import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/utils/api";
import type {
  CreateAnnouncementPayload,
  Announcement,
} from "@/types/announcement";
import { toast } from "sonner";

export default function useCreateAnnouncement() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CreateAnnouncementPayload) => {
      const { roomId, title, content, isPublished, scheduledAt } = payload;

      const response = await api.post<Announcement>("announcements/create", {
        roomId,
        title,
        content,
        ...(isPublished && { isPublished }),
        ...(scheduledAt && { scheduledAt }),
      });

      return response.data;
    },
    onSuccess: (data, variables) => {
      // Invalidate to refetch with correct filters
      queryClient.invalidateQueries({
        queryKey: ["announcements", variables.roomId],
      });

      toast.success(
        variables.isPublished
          ? "Announcement posted successfully"
          : "Announcement scheduled successfully",
      );
    },
    onError: (error: any) => {
      console.error("Failed to create announcement:", error);
      toast.error(
        error.response?.data?.message || "Failed to create announcement",
      );
    },
  });
}
