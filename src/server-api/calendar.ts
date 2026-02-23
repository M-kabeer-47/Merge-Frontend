"use server";
import { getWithAuth } from "./fetch-with-auth";
import { CalendarTask, TaskCategory, TaskStatus } from "@/types/calendar";
import { format, isValid } from "date-fns";
import { API_BASE_URL } from "@/lib/constants/api";

export async function getCalendarTasks(): Promise<CalendarTask[]> {
  const { data, error } = await getWithAuth<CalendarTask[]>(
    `${API_BASE_URL}/calendar`,
    {
      next: {
        revalidate: 60,
        tags: ["calendar-tasks"],
      },
    },
  );

  if (error || !data) {
    console.error("Error fetching calendar tasks:", error?.message);
    return [];
  }

  if (!Array.isArray(data)) {
    console.error("Expected array of tasks but got:", typeof data);
    return [];
  }

  // The backend now returns data matching our CalendarTask interface exactly
  return data as unknown as CalendarTask[];
}
