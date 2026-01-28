export type TaskCategory = "assignment" | "quiz" | "video-session" | "personal";
export type TaskStatus = "pending" | "completed" | "overdue";

export interface CalendarTask {
  id: string;
  title: string;
  description?: string;
  category: TaskCategory;
  date: string; // ISO date YYYY-MM-DD
  time?: string; // HH:mm format
  roomId?: string;
  roomName?: string;
  status?: TaskStatus;
}
