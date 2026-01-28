"use server";
import { getWithAuth } from "./fetch-with-auth";
import { CalendarTask, TaskCategory, TaskStatus } from "@/types/calendar";
import { format, parseISO } from "date-fns";

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

interface BackendCalendarTask {
  id: string;
  title: string;
  description?: string;
  deadline: string;
  type?: string;
  category?: string;
  status?: string;
  roomId?: string;
  room?: {
    name: string;
  };
}

export async function getCalendarTasks(): Promise<CalendarTask[]> {
  const { data, error } = await getWithAuth<BackendCalendarTask[]>(
    `${API_BASE_URL}/calendar`,
    {
      next: {
        revalidate: 60,
        tags: ["calendar-tasks"],
      },
    },
  );
  console.log("data", data);
  if (error || !data) {
    console.error("Error fetching calendar tasks:", error?.message);
    return [];
  }

  if (!Array.isArray(data)) {
    console.error("Expected array of tasks but got:", typeof data);
    return [];
  }

  return data.map((task) => {
    let dateStr = "";
    let timeStr = "";

    try {
      const deadlineDate = parseISO(task.deadline);
      dateStr = format(deadlineDate, "yyyy-MM-dd");
      timeStr = format(deadlineDate, "HH:mm");
    } catch (e) {
      console.error("Error parsing date:", task.deadline);
      dateStr = format(new Date(), "yyyy-MM-dd"); // Fallback
    }

    // Determine category: utilize 'category' or 'type' field, or fallback based on roomId
    let category: TaskCategory = "personal";
    if (task.category && isValidCategory(task.category)) {
      category = task.category as TaskCategory;
    } else if (task.type && isValidCategory(task.type)) {
      category = task.type as TaskCategory;
    } else if (task.roomId) {
      category = "assignment"; // Default to assignment if linked to a room
    }

    return {
      id: task.id,
      title: task.title,
      description: task.description || undefined,
      category,
      date: dateStr,
      time: timeStr,
      roomId: task.roomId,
      roomName: task.room?.name,
      status: (task.status as TaskStatus) || "pending",
    };
  });
}

function isValidCategory(cat: string): boolean {
  return ["assignment", "quiz", "video-session", "personal"].includes(cat);
}
