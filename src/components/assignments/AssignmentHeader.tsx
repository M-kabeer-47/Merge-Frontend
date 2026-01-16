"use client";

import { ArrowLeft, Loader2, Undo2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import type { Assignment, SubmissionStatus } from "@/types/assignment";
import { isStudentAssignment } from "@/types/assignment";
import LoadingSpinner from "../ui/LoadingSpinner";

interface AssignmentHeaderProps {
  assignment: Assignment;
  isInstructor: boolean;
  submissionStatus?: SubmissionStatus;
  canSubmit: boolean;
  onBack: () => void;
  onTurnIn?: () => Promise<void>;
  onUndoTurnIn?: () => Promise<void>;
  isSubmitting?: boolean;
  isDeleting?: boolean;
  hasFiles?: boolean;
  isPastDue?: boolean;
}

/**
 * Header component for assignment detail page
 * Shows title, author, due/submitted date, and a single action button
 */
export default function AssignmentHeader({
  assignment,
  isInstructor,
  submissionStatus,
  canSubmit,
  onBack,
  onTurnIn,
  onUndoTurnIn,
  isSubmitting = false,
  isDeleting = false,
  hasFiles = false,
  isPastDue = false,
}: AssignmentHeaderProps) {
  // Short format for mobile
  const formatDateShort = (dateString: string | Date) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  };

  // Full format for desktop
  const formatDateFull = (dateString: string | Date) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  };

  // Get score and submitted at from attempt if available (student view)
  const attempt = isStudentAssignment(assignment) ? assignment.attempt : null;
  const submittedAt = attempt?.submitAt;

  const isSubmitted =
    submissionStatus === "submitted" ||
    submissionStatus === "graded" ||
    submissionStatus === "completed";

  // Single button logic based on state
  const getButtonConfig = () => {
    // If loading
    if (isSubmitting) {
      return {
        text: "Submitting...",
        action: undefined,
        variant: "default" as const,
        icon: <LoadingSpinner text="" />,
      };
    }
    if (isDeleting) {
      return {
        text: "Removing...",
        action: undefined,
        variant: "outline" as const,
        icon: <Loader2 className="w-4 h-4 mr-2 animate-spin" />,
      };
    }

    // If already submitted - show Undo button
    if (isSubmitted && canSubmit && onUndoTurnIn) {
      return {
        text: "Undo Turn In",
        action: onUndoTurnIn,
        variant: "outline" as const,
        icon: <Undo2 className="w-4 h-4 mr-2" />,
      };
    }

    // If can submit - show Turn In button
    if (canSubmit && onTurnIn) {
      const text = isPastDue ? "Turn In Late" : "Turn in";

      return {
        text,
        action: onTurnIn,
        variant: "default" as const,
        icon: null,
      };
    }

    return null;
  };

  const buttonConfig = getButtonConfig();

  return (
    <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-light-border">
      {/* Back Button */}
      <Button
        variant="link"
        size="sm"
        onClick={onBack}
        className="flex items-center gap-1.5 text-para hover:text-heading -ml-2 mb-3 sm:mb-4 text-sm"
      >
        <ArrowLeft className="w-4 h-4" />
        Back
      </Button>

      {/* Main Header Content */}
      <div className="space-y-3 sm:space-y-0 sm:flex sm:items-start sm:justify-between sm:gap-6">
        {/* Title and Author */}
        <div className="flex-1 min-w-0">
          <h1 className="text-lg sm:text-2xl lg:text-3xl font-bold text-heading mb-1 line-clamp-2">
            {assignment.title}
          </h1>
          <p className="text-para text-xs sm:text-sm">
            {assignment.author.name} • {assignment.totalScore} points
          </p>
        </div>

        {/* Status Row - date, status badge, and button */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6">
          {/* Date and Status - inline on both mobile and desktop */}
          <div className="flex items-center gap-4 sm:gap-6">
            {/* Due Date or Submitted At */}
            <div>
              {isSubmitted && submittedAt ? (
                <>
                  <p className="text-[10px] sm:text-xs text-para-muted mb-0.5">
                    Submitted
                  </p>
                  <p className="text-xs sm:text-sm font-semibold text-success">
                    <span className="sm:hidden">
                      {formatDateShort(submittedAt)}
                    </span>
                    <span className="hidden sm:inline">
                      {formatDateFull(submittedAt)}
                    </span>
                  </p>
                </>
              ) : (
                <>
                  <p className="text-[10px] sm:text-xs text-para-muted mb-0.5">
                    Due
                  </p>
                  <p
                    className={`text-xs sm:text-sm font-semibold ${
                      isPastDue ? "text-destructive" : "text-heading"
                    }`}
                  >
                    <span className="sm:hidden">
                      {formatDateShort(assignment.endAt)}
                    </span>
                    <span className="hidden sm:inline">
                      {formatDateFull(assignment.endAt)}
                    </span>
                  </p>
                </>
              )}
            </div>

            {/* Submission Status Badge */}
            {!isInstructor && submissionStatus && (
              <div>
                <p className="text-[10px] sm:text-xs text-para-muted mb-0.5">
                  Status
                </p>
                <span
                  className={`inline-block text-[10px] sm:text-xs font-medium px-2 py-0.5 sm:py-1 rounded-full ${
                    submissionStatus === "submitted" ||
                    submissionStatus === "completed"
                      ? "bg-success/10 text-success"
                      : submissionStatus === "graded"
                      ? "bg-primary/10 text-primary"
                      : submissionStatus === "missed"
                      ? "bg-destructive/10 text-destructive"
                      : "bg-secondary/10 text-secondary"
                  }`}
                >
                  {submissionStatus === "submitted" ||
                  submissionStatus === "completed"
                    ? "Submitted"
                    : submissionStatus.charAt(0).toUpperCase() +
                      submissionStatus.slice(1)}
                </span>
              </div>
            )}
          </div>

          {/* Action Button - full width on mobile */}
          {!isInstructor && buttonConfig && submissionStatus !== "missed" && (
            <Button
              variant={buttonConfig.variant}
              onClick={buttonConfig.action}
              disabled={
                isSubmitting ||
                isDeleting ||
                (!hasFiles && submissionStatus !== "submitted")
              }
              className="w-full sm:w-auto px-4 sm:px-6 py-2 text-sm"
            >
              {buttonConfig.icon}
              {buttonConfig.text}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
