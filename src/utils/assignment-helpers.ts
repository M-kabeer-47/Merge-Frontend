import type { SubmissionStatus } from "@/types/assignment";

// Re-export from centralized date-helpers for backward compatibility
export { formatDueDate, formatSubmissionDate } from "@/utils/date-helpers";

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
