"use client";

import { useQuery } from "@tanstack/react-query";
import { getCalendarTasks } from "@/server-api/calendar";

const CALENDAR_TASKS_KEY = ["calendar-tasks"];

export default function useCalendarTasks() {
  const {
    data: tasks,
    isLoading,
    error,
  } = useQuery({
    queryKey: CALENDAR_TASKS_KEY,
    queryFn: () => getCalendarTasks(),
    initialData: [], // Provide empty array as initial data strictly via dehydrate if possible, but safe default
  });

  return {
    tasks: tasks || [],
    isLoading,
    error,
  };
}
