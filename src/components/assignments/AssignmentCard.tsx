import { useState } from "react";
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
import { useAuth } from "@/providers/AuthProvider";
import Icon from "../ui/Icon";

interface AssignmentCardProps {
  assignment: Assignment;
  bgColor?: string;
  onViewDetails?: (id: string) => void;
  onViewResponses?: (id: string) => void;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}

export default function AssignmentCard({
  assignment,
  bgColor,
  onViewDetails,
  onViewResponses,
  onEdit,
  onDelete,
}: AssignmentCardProps) {
  const [showMenu, setShowMenu] = useState(false);
  const { user } = useAuth();

  // Get role from authenticated user
  const isInstructor = true;

  // Calculate if assignment is overdue
  const isOverdue = new Date() > new Date(assignment.dueDate);
  const isClosed = assignment.status === "closed";

  // Determine background color - use prop if provided, otherwise use default
  const cardBgColor = bgColor || "bg-background";

  // Status configuration for student view (similar to BookingCard)
  const getStudentStatusConfig = (
    submission: StudentAssignment["submission"]
  ) => {
    if (submission.status === "graded") {
      return {
        icon: CheckCircle2,
        iconFill: "#10b981", // success color
        textColor: "text-success",
        bgColor: "bg-success/10",
        text: "Graded",
      };
    }
    if (submission.status === "submitted") {
      return {
        icon: CheckCircle2,
        iconFill: "#3b82f6", // info color
        textColor: "text-info",
        bgColor: "bg-info/10",
        text: "Submitted",
      };
    }
    if (submission.status === "overdue") {
      return {
        icon: XCircle,
        iconFill: "#ef4444", // destructive color
        textColor: "text-destructive",
        bgColor: "bg-destructive/10",
        text: "Overdue",
      };
    }
    // pending (default case)
    return {
      icon: AlertCircle,
      iconFill: "#e69a29", // accent color
      textColor: "text-accent",
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
          title: "Edit Assignment",
          icon: <Edit className="w-4 h-4" />,
          action: () => onEdit?.(assignment.id),
        },
        {
          title: "Change Due Date",
          icon: <Calendar className="w-4 h-4" />,
          action: () => {
            console.log("Change due date for:", assignment.id);
          },
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
    <div
      className={`relative border-2 border-primary/20 shadow-lg rounded-2xl overflow-hidden ${cardBgColor} hover:shadow-xl transition-all duration-300 group`}
    >
      {/* Decorative gradient accent */}
      <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-primary via-secondary to-accent opacity-80" />

      {/* Educational background pattern - Light mode */}
      <div
        className="absolute inset-0 opacity-40 "
        style={{
          backgroundImage: "url(/patterns/card-pattern-light.png)",
          backgroundSize: "400px 400px",
          backgroundRepeat: "repeat",
        }}
      />

      {/* Educational background pattern - Dark mode */}
      {/* <div
        className="absolute inset-0 opacity-0 dark:opacity-15"
        style={{
          backgroundImage: "url(/patterns/card-pattern-dark.png)",
          backgroundSize: "400px 400px",
          backgroundRepeat: "repeat",
        }}
      /> */}

      {/* Decorative corner pattern */}
      <div className="absolute top-0 right-0 w-24 h-24 opacity-5">
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <circle
            cx="80"
            cy="20"
            r="30"
            fill="currentColor"
            className="text-primary"
          />
          <circle
            cx="60"
            cy="5"
            r="20"
            fill="currentColor"
            className="text-secondary"
          />
        </svg>
      </div>

      <div className="relative p-5">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-3 mb-1">
              <h3 className="text-xl font-bold text-heading truncate flex-1 mb-2">
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
                        className={`flex items-center gap-1 w-[110px] rounded-full py-1.5 ${statusConfig.bgColor} justify-center`}
                      >
                        <StatusIcon
                          className="w-5 h-5 text-white"
                          fill={statusConfig.iconFill}
                        />
                        <span
                          className={`${statusConfig.textColor} font-medium text-sm whitespace-nowrap`}
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
                <Icon src="/icons/trophy.jpg" alt="Points" />
                {assignment.totalScore} points
              </span>

              {/* Show deadline for both instructors and students */}
              <span className="flex items-center gap-1">
                <Icon src="/icons/timer.png" alt="Due date" />
                {formatDueDate(assignment.endAt)}
              </span>

              {/* Show grade in same row for student if graded */}
              {!isInstructor &&
                isStudentAssignment(assignment) &&
                assignment.submission.status === "graded" &&
                assignment.submission.grade !== undefined && (
                  <span className="flex items-center gap-1 text-secondary font-semibold">
                    <CheckCircle2
                      className="w-4 h-4 text-white"
                      fill="#8668c0"
                    />
                    {assignment.submission.grade}/{assignment.totalScore}
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
                  <div className="flex items-center gap-1 font-medium text-sm">
                    <CheckCircle2
                      className="w-5 h-5 text-white"
                      fill="#10b981"
                    />
                    <span className="text-success">
                      {assignment.submissionStats.graded} graded
                    </span>
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
                variant="default"
                size="sm"
                onClick={() => onViewResponses?.(assignment.id)}
                className="text-xs px-3 py-1.5"
              >
                <FileText className="w-4 h-4" />
                View Details
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

        {/* Attachments */}
        {assignment.attachments && assignment.attachments.length > 0 && (
          <div className="mt-3 pt-3 border-t border-light-border ">
            {isInstructor ? (
              // Show actual attachments for instructor
              <div className="space-y-2 ">
                <div className="flex flex-wrap gap-2">
                  {assignment.attachments.map((attachment, index) => (
                    <a
                      key={index}
                      href={attachment.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-3 py-2 bg-secondary/10 hover:bg-gray-100 border border-light-border rounded-lg text-xs transition-colors"
                    >
                      <FileText className="w-4 h-4 text-primary" />
                      <span className="text-para font-medium max-w-[200px] truncate">
                        {attachment.name}
                      </span>
                      {attachment.size && (
                        <span className="text-para-muted">
                          ({Math.round(attachment.size / 1024)} KB)
                        </span>
                      )}
                    </a>
                  ))}
                </div>
              </div>
            ) : (
              // Simple count for students
              <div className="flex items-center gap-2 text-xs text-para-muted">
                <FileIcon className="w-4 h-4" />
                <span>
                  {assignment.attachments.length} attachment
                  {assignment.attachments.length !== 1 ? "s" : ""}
                </span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
