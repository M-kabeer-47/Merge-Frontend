"use client";

import type { StudentSubmission, SubmissionStatus } from "@/types/assignment";

import SubmittedFilesSection from "./SubmittedFilesSection";
import FileUploadArea from "./FileUploadArea";

interface YourWorkSidebarProps {
  attempt?: StudentSubmission;
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
}: YourWorkSidebarProps) {
  const isSubmitted =
    submissionStatus === "submitted" || submissionStatus === "graded";

  // Use submittedFiles prop if provided (for editable mode), otherwise use attempt files
  const filesToShow = submittedFiles ?? attempt?.files;

  // Can remove submitted files only when canSubmit is true (undo mode)
  const canRemoveSubmittedFiles =
    canSubmit && !isSubmitted && !!onRemoveSubmittedFile;

  return (
    <div className="w-full lg:w-[380px] flex-shrink-0" data-sidebar="your-work">
      <div className="bg-background border border-light-border rounded-lg p-4 sm:p-5">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-heading">Your Work</h3>
        </div>

        {/* Previously Submitted Files */}
        <SubmittedFilesSection
          files={filesToShow}
          submittedAt={isSubmitted ? attempt?.submitAt : undefined}
          canRemove={canRemoveSubmittedFiles}
          onRemoveFile={onRemoveSubmittedFile}
        />

        {/* Comment Section */}
        {canSubmit && (
          <div className="mb-4">
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
          <div className="mt-3 pt-3 border-t border-light-border">
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
