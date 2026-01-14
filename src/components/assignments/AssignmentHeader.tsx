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
  const formatDate = (dateString: string | Date) => {
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
  const score = attempt?.grade ?? null;
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
    <div className="px-4 sm:px-6 py-4 border-b border-light-border">
      <Button
        variant="link"
        size="sm"
        onClick={onBack}
        className="flex items-center gap-2 text-para hover:text-heading -ml-2 mb-4"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Assignments
      </Button>

      <div className="flex items-start justify-between gap-6">
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl sm:text-3xl font-bold text-heading mb-2">
            {assignment.title}
          </h1>
          <p className="text-para text-sm">
            {assignment.author.firstName} {assignment.author.lastName} •{" "}
            {assignment.totalScore} points
          </p>
        </div>

        <div className="flex items-center gap-4 sm:gap-6">
          {/* Due Date or Submitted At */}
          <div className="text-right">
            {isSubmitted && submittedAt ? (
              <>
                <p className="text-xs text-para-muted mb-1">Submitted</p>
                <p className="text-sm font-semibold text-success">
                  {formatDate(submittedAt)}
                </p>
              </>
            ) : (
              <>
                <p className="text-xs text-para-muted mb-1">Due</p>
                <p
                  className={`text-sm font-semibold ${
                    isPastDue ? "text-destructive" : "text-heading"
                  }`}
                >
                  {formatDate(assignment.endAt)}
                </p>
              </>
            )}
          </div>

          {/* Grade (if graded) */}
          {!isInstructor && submissionStatus === "graded" && score !== null && (
            <div className="text-right">
              <p className="text-xs text-para-muted mb-1">Your Grade</p>
              <p className="text-sm font-semibold text-heading">
                {score}/{assignment.totalScore}
              </p>
            </div>
          )}

          {/* Submission Status Badge */}
          {!isInstructor && submissionStatus && (
            <div className="text-right">
              <p className="text-xs text-para-muted mb-1">Status</p>
              <span
                className={`text-xs font-medium px-2 py-1 rounded-full ${
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

          {/* Single Action Button */}
          {!isInstructor && buttonConfig && submissionStatus !== "missed" && (
            <Button
              variant={buttonConfig.variant}
              onClick={buttonConfig.action}
              disabled={
                isSubmitting ||
                isDeleting ||
                (!hasFiles && assignment.submissionStatus !== "submitted")
              }
              className="px-6 py-2.5 min-w-[130px]"
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
