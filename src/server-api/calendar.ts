"use server";
import { getWithAuth } from "./fetch-with-auth";
import { CalendarTask, TaskCategory, TaskStatus } from "@/types/calendar";
import { format, isValid } from "date-fns";
import { API_BASE_URL } from "@/lib/constants/api";

export async function getCalendarTasks(): Promise<CalendarTask[]> {
  // Per-user calendar tasks — must reflect newly added/edited/deleted
  // events immediately. The previous 60s server cache caused freshly
  // created events to not appear until the cache expired even after
  // React Query invalidation.
  const { data, error } = await getWithAuth<CalendarTask[]>(
    `${API_BASE_URL}/calendar`,
    { cache: "no-store" },
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
