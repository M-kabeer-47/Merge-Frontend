import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/utils/api";
import type { Announcement } from "@/types/announcement";
import { toast } from "sonner";
import { toastApiError } from "@/utils/toast-helpers";

interface UpdateAnnouncementPayload {
  id: string;
  title: string;
  content: string;
  isPublished?: boolean;
  scheduledAt?: string;
  roomId: string;
}

export default function useUpdateAnnouncement() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: UpdateAnnouncementPayload) => {
      const { id, ...data } = payload;
      const response = await api.patch<Announcement>(
        `announcements/${id}`,
        data,
      );
      return response.data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["announcements", variables.roomId],
      });
      toast.success("Announcement updated successfully");
    },
    onError: (error: any) => {
      console.error("Failed to update announcement:", error);
      toastApiError(error, "Failed to update announcement");
    },
  });
}
