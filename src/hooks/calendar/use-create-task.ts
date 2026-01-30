import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import api from "@/utils/api";
import { revalidateCalendarTasks } from "@/server-actions/calendar";
import { CalendarTask } from "@/types/calendar";

/**
 * Hook to create a new calendar task
 */
interface CreateTaskPayload {
  title: string;
  description?: string;
  deadline: string;
  taskCategory?: string;
}

export default function useCreateTask() {
  const queryClient = useQueryClient();

  const { isPending, mutateAsync } = useMutation({
    mutationFn: async (data: CreateTaskPayload): Promise<CalendarTask> => {
      const response = await api.post("/calendar", {
        title: data.title,
        description: data.description,
        deadline: data.deadline,
        taskCategory: data.taskCategory || "personal",
      });
      return response.data;
    },
    onSuccess: async () => {
      // Invalidate calendar tasks cache
      await revalidateCalendarTasks();
      queryClient.invalidateQueries({ queryKey: ["calendar-tasks"] });
      toast.success("Task created successfully!");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to create task");
    },
  });

  return {
    createTask: mutateAsync,
    isCreating: isPending,
  };
}
