import React, { useState } from "react";
import {
  Calendar,
  Clock,
  Trophy,
  MoreVertical,
  Eye,
  Edit,
  Trash2,
  FileText,
  CheckCircle2,
  XCircle,
  AlertCircle,
  File as FileIcon,
} from "lucide-react";
import type {
  Assignment,
  InstructorAssignment,
  StudentAssignment,
} from "@/types/assignment";
import {
  isInstructorAssignment,
  isStudentAssignment,
} from "@/types/assignment";
import { Button } from "@/components/ui/Button";
import DropdownMenu from "@/components/ui/Dropdown";

interface AssignmentCardProps {
  assignment: Assignment;
  userRole: "instructor" | "student" | "ta";
  onViewDetails?: (id: string) => void;
  onViewResponses?: (id: string) => void;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}

export default function AssignmentCard({
  assignment,
  userRole,
  onViewDetails,
  onViewResponses,
  onEdit,
  onDelete,
}: AssignmentCardProps) {
  const [showMenu, setShowMenu] = useState(false);

  const isInstructor = userRole === "instructor" || userRole === "ta";

  // Calculate if assignment is overdue
  const isOverdue = new Date() > new Date(assignment.dueDate);
  const isClosed = assignment.status === "closed";

  // Status configuration for student view (similar to BookingCard)
  const getStudentStatusConfig = (
    submission: StudentAssignment["submission"]
  ) => {
    if (submission.status === "graded") {
      return {
        icon: CheckCircle2,
        color: "text-success",
        bgColor: "bg-success/10",
        text: "Graded",
      };
    }
    if (submission.status === "submitted") {
      return {
        icon: CheckCircle2,
        color: "text-info",
        bgColor: "bg-info/10",
        text: "Submitted",
      };
    }
    if (submission.status === "overdue") {
      return {
        icon: XCircle,
        color: "text-destructive",
        bgColor: "bg-destructive/10",
        text: "Overdue",
      };
    }
    // pending
    return {
      icon: Clock,
      color: "text-accent",
      bgColor: "bg-accent/10",
      text: "Pending",
    };
  };

  // Format date
  const formatDueDate = (date: Date) => {
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
  };

  const formatSubmissionDate = (date?: Date) => {
    if (!date) return null;
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  };

  // Dropdown menu options
  const getMenuOptions = () => {
    if (isInstructor) {
      return [
        {
          title: "View Responses",
          icon: <Eye className="w-4 h-4" />,
          action: () => onViewResponses?.(assignment.id),
        },
        {
          title: "Edit Assignment",
          icon: <Edit className="w-4 h-4" />,
          action: () => onEdit?.(assignment.id),
        },
        {
          title: "Delete",
          icon: <Trash2 className="w-4 h-4" />,
          action: () => onDelete?.(assignment.id),
          destructive: true,
        },
      ];
    }
    return [
      {
        title: "View Details",
        icon: <Eye className="w-4 h-4" />,
        action: () => onViewDetails?.(assignment.id),
      },
    ];
  };

  return (
    <div className="border border-light-border rounded-lg p-5 bg-main-background hover:shadow-sm transition-shadow">
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-3 mb-1">
            <h3 className="text-lg font-bold text-heading truncate flex-1">
              {assignment.title}
            </h3>

            {/* Status Badge for Student (similar to BookingCard) */}
            {!isInstructor && isStudentAssignment(assignment) && (
              <>
                {(() => {
                  const statusConfig = getStudentStatusConfig(
                    assignment.submission
                  );
                  const StatusIcon = statusConfig.icon;
                  return (
                    <div
                      className={`flex items-center gap-1 px-2 py-1 rounded-full ${statusConfig.bgColor} flex-shrink-0`}
                    >
                      <StatusIcon className={`w-3 h-3 ${statusConfig.color}`} />
                      <span
                        className={`${statusConfig.color} font-medium text-xs whitespace-nowrap`}
                      >
                        {statusConfig.text}
                      </span>
                    </div>
                  );
                })()}
              </>
            )}

            {/* Three dots menu for Instructor only */}
            {isInstructor && (
              <div className="relative flex-shrink-0">
                <button
                  onClick={() => setShowMenu(!showMenu)}
                  className="p-1.5 rounded hover:bg-gray-100 transition-colors text-para-muted"
                >
                  <MoreVertical className="w-5 h-5" />
                </button>

                {showMenu && (
                  <div className="absolute right-0 top-8 z-10">
                    <DropdownMenu
                      options={getMenuOptions()}
                      onClose={() => setShowMenu(false)}
                      align="right"
                    />
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="flex items-center gap-3 flex-wrap text-sm text-para-muted">
            <span className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              {formatDueDate(assignment.dueDate)}
            </span>
            <span className="flex items-center gap-1">
              <Trophy className="w-4 h-4" />
              {assignment.points} points
            </span>
            
            {/* Show grade in same row for student if graded */}
            {!isInstructor &&
              isStudentAssignment(assignment) &&
              assignment.submission.status === "graded" &&
              assignment.submission.grade !== undefined && (
                <span className="flex items-center gap-1 text-secondary font-semibold">
                  <CheckCircle2 className="w-4 h-4" />
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

      {/* Status & Info Row */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        {/* Left side - Status info */}
        <div className="flex items-center gap-3 flex-wrap">
          {isInstructor && isInstructorAssignment(assignment) && (
            <>
              {/* Submission stats for instructor */}
              <div className="flex items-center gap-1.5 text-primary font-medium text-sm">
                <FileText className="w-4 h-4" />
                <span>
                  {assignment.submissionStats.submitted}/
                  {assignment.submissionStats.total} submitted
                </span>
              </div>
              {assignment.submissionStats.graded > 0 && (
                <div className="flex items-center gap-1.5 text-success font-medium text-sm">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{assignment.submissionStats.graded} graded</span>
                </div>
              )}
              {isClosed && (
                <div className="flex items-center gap-1.5 text-para-muted font-medium text-sm">
                  <XCircle className="w-4 h-4" />
                  <span>Closed</span>
                </div>
              )}
            </>
          )}

          {!isInstructor && isStudentAssignment(assignment) && (
            <>
              {/* Show submission date if submitted */}
              {assignment.submission.submittedAt && (
                <span className="flex items-center gap-1.5 text-sm text-para-muted">
                  <Clock className="w-4 h-4" />
                  Submitted{" "}
                  {formatSubmissionDate(assignment.submission.submittedAt)}
                </span>
              )}
            </>
          )}
        </div>

        {/* Right side - Action button */}
        <div>
          {isInstructor ? (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onViewResponses?.(assignment.id)}
              className="text-xs px-3 py-1.5"
            >
              <Eye className="w-4 h-4" />
              View Responses
            </Button>
          ) : (
            <Button
              variant="default"
              size="sm"
              onClick={() => onViewDetails?.(assignment.id)}
              className="text-xs px-3 py-1.5"
            >
              <FileText className="w-4 h-4" />
              View Details
            </Button>
          )}
        </div>
      </div>

      {/* Attachments indicator */}
      {assignment.attachments && assignment.attachments.length > 0 && (
        <div className="mt-3 pt-3 border-t border-light-border">
          <div className="flex items-center gap-2 text-xs text-para-muted">
            <FileIcon className="w-4 h-4" />
            <span>
              {assignment.attachments.length} attachment
              {assignment.attachments.length !== 1 ? "s" : ""}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
