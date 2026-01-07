import type { SubmissionStatus } from "@/types/assignment";

/**
 * Format due date to human-readable relative or absolute format
 */
export function formatDueDate(date: Date): string {
  const dueDate = new Date(date);
  const now = new Date();
  const diffMs = dueDate.getTime() - now.getTime();
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffDays < 0) {
    return `Overdue by ${Math.abs(diffDays)} day${
      Math.abs(diffDays) !== 1 ? "s" : ""
    }`;
  }
  if (diffDays === 0) {
    return "Due today";
  }
  if (diffDays === 1) {
    return "Due tomorrow";
  }
  if (diffDays <= 7) {
    return `Due in ${diffDays} days`;
  }

  return dueDate.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: dueDate.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
  });
}

/**
 * Format submission date to readable format
 */
export function formatSubmissionDate(date?: Date): string | null {
  if (!date) return null;
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

/**
 * Status configuration for student submission status badge
 */
export interface StatusConfig {
  icon: "check" | "x" | "alert";
  iconFill: string;
  textColor: string;
  bgColor: string;
  text: string;
}

export function getStudentStatusConfig(
  status?: SubmissionStatus
): StatusConfig {
  if (status === "graded") {
    return {
      icon: "check",
      iconFill: "#10b981",
      textColor: "text-success",
      bgColor: "bg-success/10",
      text: "Graded",
    };
  }
  if (status === "submitted") {
    return {
      icon: "check",
      iconFill: "#3b82f6",
      textColor: "text-info",
      bgColor: "bg-info/10",
      text: "Submitted",
    };
  }
  if (status === "missed") {
    return {
      icon: "x",
      iconFill: "#ef4444",
      textColor: "text-destructive",
      bgColor: "bg-destructive/10",
      text: "Missed",
    };
  }
  // pending (default)
  return {
    icon: "alert",
    iconFill: "#e69a29",
    textColor: "text-accent",
    bgColor: "bg-accent/10",
    text: "Pending",
  };
}
