"use client";

import { useState } from "react";
import type { StudentSubmission, SubmissionStatus } from "@/types/assignment";
import SubmissionStatusBadge from "./SubmissionStatusBadge";
import SubmittedFilesSection from "./SubmittedFilesSection";
import FileUploadArea from "./FileUploadArea";

interface YourWorkSidebarProps {
  submission?: StudentSubmission;
  submissionStatus: SubmissionStatus;
  isOverdue: boolean;
  onSubmit: (files: File[], comment: string) => void;
  isUploading?: boolean;
}

export default function YourWorkSidebar({
  submission,
  submissionStatus,
  isOverdue,
  onSubmit,
  isUploading = false,
}: YourWorkSidebarProps) {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [comment, setComment] = useState("");

  const canSubmit = submissionStatus !== "missed" && !isOverdue;
  const isSubmitted =
    submissionStatus === "submitted" || submissionStatus === "graded";

  const handleFilesSelected = (files: File[]) => {
    setSelectedFiles((prev) => [...prev, ...files]);
  };

  const handleRemoveFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    onSubmit(selectedFiles, comment);
    setSelectedFiles([]);
    setComment("");
  };

  return (
    <div className="w-full lg:w-[380px] flex-shrink-0" data-sidebar="your-work">
      <div className="bg-background border border-light-border rounded-lg p-4 sm:p-5">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-heading">Your Work</h3>
          <SubmissionStatusBadge
            status={submissionStatus}
            isOverdue={isOverdue}
          />
        </div>

        {/* Previously Submitted Files */}
        <SubmittedFilesSection
          attachments={submission?.attachments}
          submittedAt={submission?.submittedAt}
        />

        {/* Comment Section */}
        {canSubmit && (
          <div className="mb-4">
            <label className="block text-sm font-medium text-para mb-2">
              Add a comment (optional)
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Add any comments or notes about your submission..."
              className="w-full px-3 py-2 bg-white/10 border border-light-border rounded-lg text-para placeholder-para-muted/50 placeholder:text-sm focus:outline-none focus:ring-1 focus:ring-primary/50 resize-none text-sm"
              rows={3}
            />
          </div>
        )}

        {/* File Upload Area */}
        {canSubmit && (
          <FileUploadArea
            selectedFiles={selectedFiles}
            onFilesSelected={handleFilesSelected}
            onRemoveFile={handleRemoveFile}
            onSubmit={handleSubmit}
            isSubmitted={isSubmitted}
            isUploading={isUploading}
          />
        )}

        {/* Overdue Message */}
        {isOverdue && submissionStatus === "pending" && (
          <div className="pt-4 border-t border-light-border">
            <p className="text-sm text-destructive">
              Assignment overdue. Submissions no longer accepted.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
