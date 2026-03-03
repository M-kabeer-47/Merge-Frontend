import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import api from "@/utils/api";
import { toastApiError } from "@/utils/toast-helpers";
import { revalidateCalendarTasks } from "@/server-actions/calendar";

export default function useDeleteTask() {
  const queryClient = useQueryClient();

  const { isPending, mutateAsync } = useMutation({
    mutationFn: async (taskId: string) => {
      await api.delete(`/calendar/${taskId}`);
    },
    onSuccess: async () => {
      await revalidateCalendarTasks();
      await queryClient.invalidateQueries({ queryKey: ["calendar-tasks"] });
      toast.success("Task deleted successfully");
    },
    onError: (error: any) => {
      toastApiError(error, "Failed to delete task");
    },
  });

  return {
    deleteTask: mutateAsync,
    isDeleting: isPending,
  };
}
