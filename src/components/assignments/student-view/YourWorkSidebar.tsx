"use client";

import { Trophy } from "lucide-react";
import type { StudentAttempt, SubmissionStatus } from "@/types/assignment";

import SubmittedFilesSection from "./SubmittedFilesSection";
import FileUploadArea from "./FileUploadArea";

interface YourWorkSidebarProps {
  attempt?: StudentAttempt;
  submissionStatus?: SubmissionStatus;
  canSubmit: boolean;
  selectedFiles: File[];
  comment: string;
  onFilesSelected: (files: File[]) => void;
  onRemoveFile: (index: number) => void;
  onCommentChange: (comment: string) => void;
  // For removing submitted files after undo turn in
  submittedFiles?: { name: string; url: string }[];
  onRemoveSubmittedFile?: (index: number) => void;
  // For displaying grade
  totalScore?: number;
}

export default function YourWorkSidebar({
  attempt,
  submissionStatus,
  canSubmit,
  selectedFiles,
  comment,
  onFilesSelected,
  onRemoveFile,
  onCommentChange,
  submittedFiles,
  onRemoveSubmittedFile,
  totalScore,
}: YourWorkSidebarProps) {
  const isSubmitted =
    submissionStatus === "submitted" || submissionStatus === "graded";
  const isGraded = submissionStatus === "graded";
  const score = attempt?.score;

  // Use submittedFiles prop if provided (for editable mode), otherwise use attempt files
  const filesToShow = submittedFiles ?? attempt?.files;

  // Can remove submitted files only when canSubmit is true (undo mode)
  const canRemoveSubmittedFiles =
    canSubmit && !isSubmitted && !!onRemoveSubmittedFile;

  // Calculate score percentage for visual feedback
  const scorePercentage =
    score !== undefined && score !== null && totalScore
      ? Math.round((score / totalScore) * 100)
      : null;

  // Get color based on score percentage
  const getScoreColor = (percentage: number) => {
    if (percentage >= 80) return "text-success";
    if (percentage >= 60) return "text-warning";
    return "text-destructive";
  };

  return (
    <div className="w-full lg:w-[380px] flex-shrink-0" data-sidebar="your-work">
      <div className="bg-background border border-light-border rounded-xl p-4 sm:p-5 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-heading">Your Work</h3>
        </div>

        {/* Grade Display - Show prominently when graded */}
        {isGraded && score !== undefined && score !== null && totalScore && (
          <div className="border border-primary/20 rounded-lg p-3 sm:p-4">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Trophy className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-para-muted mb-0.5">Your Grade</p>
                <div className="flex items-baseline gap-1 sm:gap-2 flex-wrap">
                  <span
                    className={`text-xl sm:text-2xl font-bold ${
                      scorePercentage !== null
                        ? getScoreColor(scorePercentage)
                        : "text-heading"
                    }`}
                  >
                    {score}
                  </span>
                  <span className="text-sm sm:text-base text-para-muted">
                    / {totalScore} points
                  </span>
                  {scorePercentage !== null && (
                    <span className="text-xs text-para-muted">
                      ({scorePercentage}%)
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Previously Submitted Files */}
        <SubmittedFilesSection
          files={filesToShow}
          submittedAt={isSubmitted ? attempt?.submitAt : undefined}
          canRemove={canRemoveSubmittedFiles}
          onRemoveFile={onRemoveSubmittedFile}
        />

        {/* Comment Section */}
        {canSubmit && (
          <div>
            <label className="block text-sm font-medium text-para mb-2">
              Add a comment (optional)
            </label>
            <textarea
              value={comment}
              onChange={(e) => onCommentChange(e.target.value)}
              placeholder="Add any comments or notes about your submission..."
              className="w-full px-3 py-2 border border-light-border rounded-lg text-para placeholder-para-muted/50 placeholder:text-sm focus:outline-none focus:ring-1 focus:ring-primary/50 resize-none text-sm"
              rows={3}
            />
          </div>
        )}

        {/* File Upload Area */}
        {canSubmit && (
          <FileUploadArea
            selectedFiles={selectedFiles}
            onFilesSelected={onFilesSelected}
            onRemoveFile={onRemoveFile}
            isSubmitted={isSubmitted}
          />
        )}

        {/* Selected Files Count */}
        {selectedFiles.length > 0 && (
          <div className="pt-3 border-t border-light-border">
            <p className="text-sm text-para">
              <span className="font-medium text-heading">
                {selectedFiles.length}
              </span>{" "}
              new file{selectedFiles.length !== 1 ? "s" : ""} selected
            </p>
            <p className="text-xs text-para-muted mt-1">
              Click "Turn In" in the header to submit
            </p>
          </div>
        )}

        {/* Cannot Submit Message */}
        {!canSubmit && submissionStatus !== "missed" && (
          <div className="pt-4 border-t border-light-border">
            <p className="text-sm text-destructive">
              Assignment closed. Submissions no longer accepted.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
