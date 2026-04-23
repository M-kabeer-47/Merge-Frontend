"use client";

import React from "react";
import {
  Calendar,
  Clock,
  Trophy,
  FileText,
  CheckCircle2,
  XCircle,
  AlertCircle,
  File as FileIcon,
  TrophyIcon,
} from "lucide-react";
import type { StudentAssignment } from "@/types/assignment";
import { Button } from "@/components/ui/Button";
import { IoTrophy } from "react-icons/io5";
import { formatDueDate, formatSubmissionDate } from "@/utils/date-helpers";
import { getStudentStatusConfig } from "@/utils/assignment-helpers";

const iconMap = {
  check: CheckCircle2,
  x: XCircle,
  alert: AlertCircle,
};

interface StudentAssignmentCardProps {
  assignment: StudentAssignment;
  bgColor?: string;
  onViewDetails?: (id: string) => void;
}

export default function StudentAssignmentCard({
  assignment,
  bgColor,
  onViewDetails,
}: StudentAssignmentCardProps) {
  const statusConfig = getStudentStatusConfig(assignment.submission.status);
  const StatusIcon = iconMap[statusConfig.icon];

  // Determine background color - use prop if provided, otherwise use default
  const cardBgColor = bgColor || "bg-background";

  return (
    <div className={`border border-light-border rounded-lg p-5 ${cardBgColor} hover:shadow-md transition-shadow`}>
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-3 mb-1">
            <h3 className="text-lg font-semibold text-heading truncate flex-1">
              {assignment.title}
            </h3>

            {/* Status Badge */}
            <div
              className={`flex items-center gap-1 px-3 py-1.5 rounded-full ${statusConfig.bgColor}`}
            >
              <StatusIcon
                className="w-4 h-4 text-white"
                fill={statusConfig.iconFill}
              />
              <span
                className={`${statusConfig.textColor} font-medium text-sm whitespace-nowrap`}
              >
                {statusConfig.text}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 flex-wrap text-sm text-para-muted">
            <span className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              {formatDueDate(assignment.dueDate)}
            </span>
            <span className="flex items-center gap-1">
              <IoTrophy className="w-4 h-4" fill="#e69a29" />
              {assignment.points} points
            </span>

            {/* Show grade if graded */}
            {assignment.submission.status === "graded" &&
              assignment.submission.grade !== undefined && (
                <span className="flex items-center gap-1 text-secondary font-semibold">
                  <CheckCircle2 className="w-4 h-4 text-white" fill="#8668c0" />
                  {assignment.submission.grade}/{assignment.points}
                </span>
              )}
          </div>
        </div>
      </div>

      {/* Description */}
      <p className="text-sm text-para mb-4 line-clamp-2">
        {assignment.description}
      </p>

      {/* Bottom Row */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        {/* Left side - Submission info */}
        <div className="flex items-center gap-3 flex-wrap">
          {assignment.submission.submittedAt && (
            <span className="flex items-center gap-1.5 text-sm text-para-muted">
              <Clock className="w-4 h-4" />
              Submitted {formatSubmissionDate(assignment.submission.submittedAt)}
            </span>
          )}

          {assignment.attachments && assignment.attachments.length > 0 && (
            <div className="flex items-center gap-2 text-xs text-para-muted">
              <FileIcon className="w-4 h-4" />
              <span>
                {assignment.attachments.length} attachment
                {assignment.attachments.length !== 1 ? "s" : ""}
              </span>
            </div>
          )}
        </div>

        {/* Right side - Action button */}
        <Button
          variant="default"
          size="sm"
          onClick={() => onViewDetails?.(assignment.id)}
          className="text-xs px-4 py-2"
        >
          <FileText className="w-4 h-4" />
          View Details
        </Button>
      </div>
    </div>
  );
}
