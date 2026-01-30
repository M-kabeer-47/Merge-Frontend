export type TaskCategory = "assignment" | "quiz" | "video-session" | "personal";
export type TaskStatus = "pending" | "completed" | "overdue";

export interface CalendarTask {
  id: string;
  title: string;
  description?: string;
  deadline: string;
  taskCategory: TaskCategory;
  taskStatus: TaskStatus;
  createdAt: string;
}
