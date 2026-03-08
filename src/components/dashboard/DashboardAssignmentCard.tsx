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
import { formatDueDate } from "@/utils/date-helpers";
import { getStudentStatusConfig } from "@/utils/assignment-helpers";

const iconMap = {
  check: CheckCircle2,
  x: XCircle,
  alert: AlertCircle,
};

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
  const statusConfig = getStudentStatusConfig(assignment.submissionStatus);
  const StatusIcon = iconMap[statusConfig.icon];

  const authorName = assignment.author
    ? `${assignment.author.firstName} ${assignment.author.lastName}`
    : "";
  const authorInitials = assignment.author
    ? `${assignment.author.firstName[0]}${assignment.author.lastName[0]}`
    : "";

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
          {assignment.author?.image ? (
            <img
              src={assignment.author.image}
              alt={authorName}
              className="w-10 h-10 rounded-full object-cover"
            />
          ) : (
            <span className="text-primary font-semibold text-sm">
              {authorInitials}
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
                {authorName}
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
            {assignment.endAt ? formatDueDate(assignment.endAt, true) : "No due date"}
          </span>
          <span className="flex items-center gap-1">
            <IoTrophy className="w-3.5 h-3.5" fill="#e69a29" />
            {assignment.totalScore}pts
          </span>
        </div>
      </div>

      {/* Show grade if graded */}
      {assignment.submissionStatus === "graded" &&
        assignment.score !== undefined && (
          <div className="mt-3 pt-3 border-t border-primary/20">
            <div className="flex items-center justify-between text-xs">
              <span className="text-para-muted">Grade:</span>
              <span className="font-semibold text-secondary">
                {assignment.score}/{assignment.totalScore}
              </span>
            </div>
          </div>
        )}
    </div>
  );
}
