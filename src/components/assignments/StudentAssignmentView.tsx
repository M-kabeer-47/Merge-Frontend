"use client";

import React, { useState } from "react";
import {
  CheckCircle2,
  AlertCircle,
  XCircle,
  Clock,
  FileText,
  Upload,
  Download,
  X,
  MessageSquare,
} from "lucide-react";
import type { StudentAssignment } from "@/types/assignment";
import { Button } from "@/components/ui/Button";
import { formatFileSize } from "@/utils/file-helpers";

interface StudentAssignmentViewProps {
  assignment: StudentAssignment;
  isOverdue: boolean;
  onSubmit: (files: File[]) => void;
}

export default function StudentAssignmentView({
  assignment,
  isOverdue,
  onSubmit,
}: StudentAssignmentViewProps) {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [comment, setComment] = useState("");

  const submission = assignment.submission;
  const canSubmit = true;

  const formatSubmissionDate = (date?: Date) => {
    if (!date) return null;
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setSelectedFiles((prev) => [...prev, ...filesArray]);
    }
  };

  const handleRemoveFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files) {
      setSelectedFiles((prev) => [
        ...prev,
        ...Array.from(e.dataTransfer.files),
      ]);
    }
  };

  const handleSubmit = () => {
    onSubmit(selectedFiles);
    setSelectedFiles([]);
    setComment("");
  };

  return (
    <>
      {/* Left Column - Main Content */}
      <div className="flex-1 min-w-0 space-y-6">
        {/* Instructions */}
        <section className="bg-background border border-light-border rounded-lg p-4 sm:p-5">
          <h2 className="text-lg font-semibold text-heading mb-3">
            Instructions
          </h2>
          <div className="text-para text-sm sm:text-[15px] leading-relaxed whitespace-pre-wrap">
            {assignment.description}
          </div>
        </section>

        {/* Resources */}
        {assignment.attachments && assignment.attachments.length > 0 && (
          <section className="bg-background border border-light-border rounded-lg p-4 sm:p-5">
            <h2 className="text-lg font-semibold text-heading mb-3">
              Resources
            </h2>
            <div className="space-y-2">
              {assignment.attachments.map((attachment) => (
                <div
                  key={attachment.id}
                  className="flex items-center justify-between p-3 bg-secondary/5 border border-light-border rounded-lg transition-colors"
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <FileText className="w-5 h-5 text-primary flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="font-medium text-heading text-sm truncate">
                        {attachment.name}
                      </p>
                      {attachment.size && (
                        <p className="text-xs text-para-muted">
                          {formatFileSize(attachment.size)}
                        </p>
                      )}
                    </div>
                  </div>
                  <a
                    href={attachment.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-3 py-1.5 text-xs sm:text-sm font-medium text-primary rounded transition-colors flex-shrink-0"
                  >
                    <Download className="w-4 h-4" />
                    Download
                  </a>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Feedback from Teacher */}
        {submission?.status === "graded" && submission.feedback && (
          <section className="bg-background border border-light-border rounded-lg p-4 sm:p-5">
            <div className="flex items-center gap-2 mb-3">
              <MessageSquare className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-semibold text-heading">
                Feedback from Teacher
              </h2>
            </div>
            <div className="p-4 bg-secondary/5 border border-light-border rounded-lg">
              <p className="text-sm text-para leading-relaxed whitespace-pre-wrap">
                {submission.feedback}
              </p>
            </div>
          </section>
        )}
      </div>

      {/* Right Column - Your Work Sidebar */}
      <div className="w-full lg:w-[380px] flex-shrink-0">
        <div className="bg-primary border border-light-border rounded-lg p-4 sm:p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-white">Your Work</h3>
            {submission?.status === "graded" && (
              <span className="inline-flex items-center justify-center gap-1.5 px-4 py-1 rounded-full text-xs font-semibold bg-white/20 text-white min-w-[100px]">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Graded
              </span>
            )}
            {submission?.status === "submitted" && (
              <span className="inline-flex items-center justify-center gap-1.5 px-4 py-1 rounded-full text-xs font-semibold bg-white/20 text-white min-w-[100px]">
                <Clock className="w-3.5 h-3.5" />
                Submitted
              </span>
            )}
            {(submission?.status === "missed" ||
              (submission?.status === "pending" && isOverdue)) && (
              <span className="inline-flex items-center justify-center gap-1.5 px-4 py-1 rounded-full text-xs font-semibold bg-destructive/20 text-white min-w-[100px]">
                <XCircle className="w-3.5 h-3.5" />
                Missed
              </span>
            )}
            {submission?.status === "pending" && !isOverdue && (
              <span className="inline-flex items-center justify-center gap-1.5 px-4 py-1 rounded-full text-xs font-semibold bg-white/20 text-white min-w-[100px]">
                <AlertCircle className="w-3.5 h-3.5" />
                Pending
              </span>
            )}
          </div>

          {/* Submitted Files */}
          {submission?.submittedAt &&
            submission.attachments &&
            submission.attachments.length > 0 && (
              <div className="mb-4">
                <p className="text-xs font-semibold text-secondary uppercase mb-2">
                  Submitted Files
                </p>
                <div className="space-y-2">
                  {submission.attachments.map((file) => (
                    <div
                      key={file.id}
                      className="flex items-center gap-2 p-2.5 bg-secondary/25 rounded-lg"
                    >
                      <FileText className="w-4 h-4 text-secondary flex-shrink-0" />
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-white truncate">
                          {file.name}
                        </p>
                        {file.size && (
                          <p className="text-xs text-white">
                            {formatFileSize(file.size)}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                {submission.submittedAt && (
                  <p className="text-xs text-white mt-3">
                    Submitted {formatSubmissionDate(submission.submittedAt)}
                  </p>
                )}
              </div>
            )}

          {/* Upload Area */}
          {canSubmit && (
            <div className="pt-4 border-t border-white/20">
              {submission?.status === "submitted" && (
                <p className="text-xs text-white/80 mb-3">
                  You can update your submission before the due date
                </p>
              )}

              {/* Comment/Note Section */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-white mb-4">
                  Add a comment (optional)
                </label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Add any comments or notes about your submission..."
                  className="w-full px-3 py-2 bg-white/10 border border-white/30 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-1 focus:ring-white/50 resize-none"
                  rows={3}
                />
              </div>

              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-lg p-5 sm:p-6 text-center transition-colors ${
                  isDragging
                    ? "border-white bg-white/10"
                    : "border-white/30 hover:border-white/50 bg-white/5"
                }`}
              >
                <input
                  type="file"
                  multiple
                  onChange={handleFileSelect}
                  className="hidden"
                  id="file-upload"
                />
                <label
                  htmlFor="file-upload"
                  className="cursor-pointer flex flex-col items-center"
                >
                  <Upload className="w-8 h-8 sm:w-10 sm:h-10 text-white mb-2" />
                  <p className="text-sm font-medium text-white mb-1">
                    Add or create
                  </p>
                  <p className="text-xs text-white/70">
                    Upload files or folders
                  </p>
                </label>
              </div>

              {selectedFiles.length > 0 && (
                <div className="mt-3 space-y-2">
                  {selectedFiles.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between gap-2 p-2.5 bg-white/10 border border-white/20 rounded-lg hover:bg-white/15 transition-colors"
                    >
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        <FileText className="w-4 h-4 text-white flex-shrink-0" />
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-white truncate">
                            {file.name}
                          </p>
                          <p className="text-xs text-white/70">
                            {formatFileSize(file.size)}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleRemoveFile(index)}
                        className="p-1.5 hover:bg-white/10 rounded transition-colors"
                      >
                        <X className="w-4 h-4 text-white" />
                      </button>
                    </div>
                  ))}
                  <Button
                    onClick={handleSubmit}
                    className="w-full mt-2 bg-white text-primary hover:bg-white/90"
                    size="sm"
                  >
                    {submission?.status === "submitted"
                      ? "Update submission"
                      : "Turn in"}
                  </Button>
                </div>
              )}
            </div>
          )}

          {isOverdue && submission?.status === "pending" && (
            <div className="pt-4 border-t border-white/20">
              <p className="text-sm text-white">
                Assignment overdue. Submissions no longer accepted.
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
