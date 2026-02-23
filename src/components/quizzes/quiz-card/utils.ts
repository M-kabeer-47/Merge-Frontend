import type { LucideIcon } from "lucide-react";
import { CheckCircle2, XCircle, AlertCircle, Eye, Edit, Trash2 } from "lucide-react";
import type { StudentQuiz } from "@/types/quiz";

export interface StatusConfig {
  icon: LucideIcon;
  iconFill: string;
  textColor: string;
  bgColor: string;
  text: string;
}

export const getStudentStatusConfig = (
  status: StudentQuiz["submissionStatus"],
  isOverdue: boolean,
): StatusConfig => {
  if (status === "graded") {
    return {
      icon: CheckCircle2,
      iconFill: "#10b981",
      textColor: "text-success",
      bgColor: "bg-success/10",
      text: "Graded",
    };
  }
  if (status === "missed" || (isOverdue && status === "pending")) {
    return {
      icon: XCircle,
      iconFill: "#ef4444",
      textColor: "text-destructive",
      bgColor: "bg-destructive/10",
      text: "Missed",
    };
  }
  // pending
  return {
    icon: AlertCircle,
    iconFill: "#e69a29",
    textColor: "text-accent",
    bgColor: "bg-accent/10",
    text: "Pending",
  };
};

export const formatDeadline = (date: Date | string) => {
  const deadline = new Date(date);
  const now = new Date();
  const diffMs = deadline.getTime() - now.getTime();
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffDays < 0) {
    return `Ended ${Math.abs(diffDays)} day${
      Math.abs(diffDays) !== 1 ? "s" : ""
    } ago`;
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

  return deadline.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year:
      deadline.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
  });
};

export interface MenuOption {
  title: string;
  icon: React.ReactNode;
  action: () => void;
  destructive?: boolean;
}

export const getMenuOptions = (
  isInstructor: boolean,
  quizId: string,
  callbacks: {
    onViewDetails?: (id: string) => void;
    onEdit?: (id: string) => void;
    onDelete?: (id: string) => void;
  },
): MenuOption[] => {
  if (isInstructor) {
    return [
      {
        title: "View Responses",
        icon: null, // Icons are added in the component
        action: () => callbacks.onViewDetails?.(quizId),
      },
      {
        title: "Edit Quiz",
        icon: null,
        action: () => callbacks.onEdit?.(quizId),
      },
      {
        title: "Delete",
        icon: null,
        action: () => callbacks.onDelete?.(quizId),
        destructive: true,
      },
    ];
  }
  return [
    {
      title: "View Details",
      icon: null,
      action: () => callbacks.onViewDetails?.(quizId),
    },
  ];
};
