"use client";

import {
  Calendar,
  Trophy,
  CheckCircle2,
  XCircle,
  AlertCircle,
  BookOpen,
} from "lucide-react";
import type { StudentAssignment } from "@/types/assignment";
import { IoTrophy } from "react-icons/io5";

interface DashboardAssignmentCardProps {
  assignment: StudentAssignment;
  roomName: string;
  onClick?: () => void;
}

export default function DashboardAssignmentCard({
  assignment,
  roomName,
  onClick,
}: DashboardAssignmentCardProps) {
  // Status configuration
  const getStatusConfig = () => {
    if (assignment.submission.status === "graded") {
      return {
        icon: CheckCircle2,
        iconFill: "#10b981",
        textColor: "text-success",
        bgColor: "bg-success/10",
        text: "Graded",
      };
    }
    if (assignment.submission.status === "submitted") {
      return {
        icon: CheckCircle2,
        iconFill: "#3b82f6",
        textColor: "text-info",
        bgColor: "bg-info/10",
        text: "Submitted",
      };
    }
    if (assignment.submission.status === "overdue") {
      return {
        icon: XCircle,
        iconFill: "#ef4444",
        textColor: "text-destructive",
        bgColor: "bg-destructive/10",
        text: "Overdue",
      };
    }
    return {
      icon: AlertCircle,
      iconFill: "#e69a29",
      textColor: "text-accent",
      bgColor: "bg-accent/10",
      text: "Pending",
    };
  };

  const formatDueDate = (date: Date) => {
    const dueDate = new Date(date);
    const now = new Date();
    const diffMs = dueDate.getTime() - now.getTime();
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffDays < 0) {
      return `Overdue`;
    }
    if (diffDays === 0) {
      return "Due today";
    }
    if (diffDays === 1) {
      return "Due tomorrow";
    }
    if (diffDays <= 7) {
      return `Due in ${diffDays}d`;
    }

    return dueDate.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  const statusConfig = getStatusConfig();
  const StatusIcon = statusConfig.icon;

  return (
    <div
      onClick={onClick}
      className="bg-background rounded-lg p-4 shadow-md hover:shadow-lg transition-all cursor-pointer h-[200px] flex flex-col"
    >
      {/* Header with Author */}
      <h2 className="text-xl text-heading font-bold mb-2">{roomName}</h2>
      <div className="flex items-start gap-3 mb-2">
        {/* Avatar */}
        <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
          {assignment.author.avatarUrl ? (
            <img
              src={assignment.author.avatarUrl}
              alt={assignment.author.name}
              className="w-10 h-10 rounded-full object-cover"
            />
          ) : (
            <span className="text-primary font-semibold text-sm">
              {assignment.author.initials}
            </span>
          )}
        </div>

        {/* Assignment Info & Status */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-heading text-sm line-clamp-1 mb-0.5">
                {assignment.title}
              </h3>
              <p className="text-xs text-para-muted">
                {assignment.author.name}
              </p>
            </div>
            {/* Compact Status Badge */}
            <div
              className={`flex items-center gap-1 px-2 py-1 rounded-full ${statusConfig.bgColor} flex-shrink-0`}
            >
              <StatusIcon
                className="w-3.5 h-3.5 text-white"
                fill={statusConfig.iconFill}
              />
              <span className={`${statusConfig.textColor} font-medium text-xs`}>
                {statusConfig.text}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Description Preview */}
      <p className="text-sm text-para-muted line-clamp-2 mb-3 flex-1">
        {assignment.description}
      </p>

      {/* Footer - Room & Due Date & Points */}
      <div className="flex items-center justify-end pt-3 border-t border-primary/20">
        
        <div className="flex items-center gap-3 text-xs text-para-muted">
          <span className="flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5" />
            {formatDueDate(assignment.dueDate)}
          </span>
          <span className="flex items-center gap-1">
            <IoTrophy className="w-3.5 h-3.5" fill="#e69a29" />
            {assignment.points}pts
          </span>
        </div>
      </div>

      {/* Show grade if graded */}
      {assignment.submission.status === "graded" &&
        assignment.submission.grade !== undefined && (
          <div className="mt-3 pt-3 border-t border-primary/20">
            <div className="flex items-center justify-between text-xs">
              <span className="text-para-muted">Grade:</span>
              <span className="font-semibold text-secondary">
                {assignment.submission.grade}/{assignment.points}
              </span>
            </div>
          </div>
        )}
    </div>
  );
}
