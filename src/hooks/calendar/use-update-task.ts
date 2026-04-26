import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/utils/api";
import { toastApiError } from "@/utils/toast-helpers";
import { revalidateCalendarTasks } from "@/server-actions/calendar";
import { CalendarTask, TaskStatus } from "@/types/calendar";
import useInvalidateRewards from "@/hooks/rewards/use-invalidate-rewards";

type UpdateTaskData = { id: string; status: TaskStatus };
export default function useUpdateTask() {
  const queryClient = useQueryClient();
  const invalidateRewards = useInvalidateRewards();

  const { isPending, mutateAsync } = useMutation({
    mutationFn: async (data: UpdateTaskData) => {
      const { id, ...body } = data;
      const response = await api.patch(`/calendar/${id}/status`, body);
      return response.data;
    },
    onMutate: async (data) => {
      await queryClient.cancelQueries({ queryKey: ["calendar-tasks"] });
      const previous =
        queryClient.getQueryData<CalendarTask[]>(["calendar-tasks"]);
      queryClient.setQueryData<CalendarTask[]>(["calendar-tasks"], (old) =>
        (old ?? []).map((task) =>
          task.id === data.id ? { ...task, taskStatus: data.status } : task,
        ),
      );
      return { previous };
    },
    onError: (error, _data, context) => {
      if (context?.previous) {
        queryClient.setQueryData(["calendar-tasks"], context.previous);
      }
      toastApiError(error, "Failed to update task");
    },
    onSettled: async () => {
      await revalidateCalendarTasks();
      await queryClient.invalidateQueries({ queryKey: ["calendar-tasks"] });
      invalidateRewards();
    },
  });

  return {
    updateTask: mutateAsync,
    isUpdating: isPending,
  };
}
