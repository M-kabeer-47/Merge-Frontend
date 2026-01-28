import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import api from "@/utils/api";
import { revalidateCalendarTasks } from "@/server-actions/calendar";

export interface UpdateTaskData {
  id: string;
  title: string;
  description?: string;
  deadline: string;
}

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
      toast.error(error?.response?.data?.message || "Failed to update task");
    },
  });

  return {
    updateTask: mutateAsync,
    isUpdating: isPending,
  };
}
