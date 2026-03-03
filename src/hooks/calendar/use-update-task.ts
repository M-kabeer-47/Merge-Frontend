import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import api from "@/utils/api";
import { toastApiError } from "@/utils/toast-helpers";
import { revalidateCalendarTasks } from "@/server-actions/calendar";
import { CalendarTask } from "@/types/calendar";

// Define a type for the data passed to the update mutation
// We want to allow updating subsets of fields, so we use Partial
type UpdateTaskData = Partial<CalendarTask> & { id: string };
export default function useUpdateTask() {
  const queryClient = useQueryClient();

  const { isPending, mutateAsync } = useMutation({
    mutationFn: async (data: UpdateTaskData) => {
      const { id, ...body } = data;
      const response = await api.patch(`/calendar/${id}`, body);
      return response.data;
    },
    onSuccess: async () => {
      await revalidateCalendarTasks();
      await queryClient.invalidateQueries({ queryKey: ["calendar-tasks"] });
      toast.success("Task updated successfully");
    },
    onError: (error: any) => {
      toastApiError(error, "Failed to update task");
    },
  });

  return {
    updateTask: mutateAsync,
    isUpdating: isPending,
  };
}
