import { format, isToday } from "date-fns";

export const formatSessionDate = (date: Date, duration?: string) => {
  const today = isToday(date);
  const dateStr = today ? "Today" : format(date, "MMM d, yyyy");
  const timeStr = format(date, "h:mm a");

  if (duration) {
    return `${dateStr}, ${timeStr} • Duration: ${duration}`;
  }
  return `${dateStr}, ${timeStr}`;
};

export const getInitials = (name: string) => {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
};
