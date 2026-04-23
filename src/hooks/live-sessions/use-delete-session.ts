import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import api from "@/utils/api";
import { toastApiError } from "@/utils/toast-helpers";

interface UseDeleteSessionOptions {
  onSuccess?: () => void;
}

/**
 * Hook to delete/cancel a session.
 */
export default function useDeleteSession({
  onSuccess,
}: UseDeleteSessionOptions = {}) {
  const queryClient = useQueryClient();

  const { isPending, mutateAsync } = useMutation({
    mutationFn: async ({
      sessionId,
      roomId,
    }: {
      sessionId: string;
      roomId: string;
    }) => {
      const response = await api.delete(
        `/live-sessions/${sessionId}?roomId=${roomId}`
      );
      return response.data;
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["live-sessions", variables.roomId],
      });
      toast.success("Session deleted.");
      onSuccess?.();
    },
    onError: (error: unknown) => {
      toastApiError(error, "Failed to delete session.");
    },
  });

  return {
    deleteSession: mutateAsync,
    isDeleting: isPending,
  };
}
