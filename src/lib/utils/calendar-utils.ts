import {
  FileText,
  ClipboardCheck,
  Video,
  User,
  LucideIcon,
} from "lucide-react";
import { TaskCategory } from "@/types/calendar";

export function getCategoryIcon(category: TaskCategory): LucideIcon {
  switch (category) {
    case "assignment":
      return FileText;
    case "quiz":
      return ClipboardCheck;
    case "video-session":
      return Video;
    case "personal":
      return User;
    default:
      return FileText;
  }
}

export function getCategoryColor(category: TaskCategory) {
  switch (category) {
    case "assignment":
      return {
        bg: "bg-primary/10",
        text: "text-primary",
        border: "border-primary",
      };
    case "quiz":
      return {
        bg: "bg-secondary/10",
        text: "text-secondary",
        border: "border-secondary",
      };
    case "video-session":
      return {
        bg: "bg-accent/10",
        text: "text-accent",
        border: "border-accent",
      };
    case "personal":
      return { bg: "bg-para/10", text: "text-para", border: "border-para" };
    default:
      return {
        bg: "bg-primary/10",
        text: "text-primary",
        border: "border-primary",
      };
  }
}

export function getCategoryLabel(category: TaskCategory): string {
  switch (category) {
    case "assignment":
      return "Assignment";
    case "quiz":
      return "Quiz";
    case "video-session":
      return "Video Session";
    case "personal":
      return "Personal";
    default:
      return category;
  }
}
