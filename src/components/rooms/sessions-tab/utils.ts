import { format, isToday } from "date-fns";

export const formatSessionDate = (dateStr?: string, durationMinutes?: number) => {
  if (!dateStr) return "No date set";
  
  const date = new Date(dateStr);
  const today = isToday(date);
  const dateDisplay = today ? "Today" : format(date, "MMM d, yyyy");
  const timeStr = format(date, "h:mm a");

  if (durationMinutes) {
    const hours = Math.floor(durationMinutes / 60);
    const mins = durationMinutes % 60;
    const durationStr = hours > 0
      ? `${hours}h ${mins > 0 ? `${mins}m` : ""}`
      : `${mins}m`;
    return `${dateDisplay}, ${timeStr} • Duration: ${durationStr}`;
  }
  return `${dateDisplay}, ${timeStr}`;
};

export const getInitials = (name: string) => {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
};
