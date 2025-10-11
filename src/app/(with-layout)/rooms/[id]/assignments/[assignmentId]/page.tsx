"use client";

import React, { useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import {
  ArrowLeft,
  Calendar,
  Trophy,
  CheckCircle2,
  AlertCircle,
  XCircle,
  Clock,
  FileText,
  Upload,
  Download,
  X,
  MessageSquare,
  Users,
} from "lucide-react";
import {
  sampleInstructorAssignments,
  sampleStudentAssignments,
} from "@/lib/constants/assignment-mock-data";
import { sampleSubmissions } from "@/lib/constants/submission-mock-data";
import type { StudentAssignment } from "@/types/assignment";
import { isStudentAssignment } from "@/types/assignment";
import { Button } from "@/components/ui/Button";
import { formatFileSize } from "@/utils/file-helpers";
import SubmissionsTable from "@/components/assignments/SubmissionsTable";

export default function AssignmentDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const assignmentId = params.assignmentId as string;
  const roomId = params.id as string;

  // TODO: Replace with actual role check from auth/context
  // Change to "instructor" or "ta" to test instructor view
  const userRole = "student" as "instructor" | "student" | "ta";
  const isInstructor = useSearchParams().get("isInstructor") === "true";

  // Load appropriate data based on role
  const assignments = isInstructor
    ? sampleInstructorAssignments
    : sampleStudentAssignments;

  const assignment = assignments.find((a) => a.id === assignmentId);

  // State for student file upload
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);

  if (!assignment) {
    return (
      <div className="h-full flex items-center justify-center bg-main-background">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-heading mb-2">
            Assignment Not Found
          </h1>
          <p className="text-para-muted">
            The assignment you're looking for doesn't exist.
          </p>
        </div>
      </div>
    );
  }

  const isOverdue = new Date() > new Date(assignment.dueDate);
  const submission = isStudentAssignment(assignment)
    ? assignment.submission
    : null;
  const canSubmit =
    !isInstructor &&
    !isOverdue &&
    submission &&
    (submission.status === "pending" || submission.status === "submitted");

  // Format dates
  const formatDueDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
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

  // File upload handlers
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedFiles((prev) => [...prev, ...Array.from(e.target.files!)]);
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
    console.log("Submitting files:", selectedFiles);
    // TODO: Implement actual submission logic
  };

  // Calculate stats for instructor
  const submittedCount = sampleSubmissions.filter(
    (s) => s.status === "submitted" || s.status === "graded"
  ).length;
  const gradedCount = sampleSubmissions.filter(
    (s) => s.status === "graded"
  ).length;
  const pendingCount = sampleSubmissions.filter(
    (s) => s.status === "pending"
  ).length;

  return (
    <div className="h-full flex flex-col bg-main-background">
      {/* Header */}
      <div className="border-b border-light-border bg-main-background">
        <div className="px-6 py-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push(`/rooms/${roomId}/assignments`)}
            className="flex items-center gap-2 text-para hover:text-heading -ml-2 mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Assignments
          </Button>

          <div className="flex items-start justify-between gap-6">
            <div className="flex-1 min-w-0">
              <h1 className="text-3xl font-bold text-heading mb-2">
                {assignment.title}
              </h1>
              <p className="text-para text-sm">
                {assignment.author.name} • {assignment.points} points
              </p>
            </div>

            <div className="flex items-center gap-6">
              <div className="text-right">
                <p className="text-xs text-para-muted mb-1">Due</p>
                <p
                  className={`text-sm font-semibold ${
                    isOverdue ? "text-destructive" : "text-heading"
                  }`}
                >
                  {formatDueDate(assignment.dueDate)}
                </p>
              </div>

              {!isInstructor &&
                submission &&
                submission.status === "graded" &&
                submission.grade !== undefined && (
                  <div className="text-right">
                    <p className="text-xs text-para-muted mb-1">Your Grade</p>
                    <p className="text-sm font-semibold text-heading">
                      {submission.grade}/{assignment.points}
                    </p>
                  </div>
                )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content - Two Column Layout */}
      <div className="flex-1 overflow-y-auto">
        <div className="flex gap-6 p-6 max-w-[1400px] mx-auto">
          {/* Left Column - Main Content */}
          <div className="flex-1 min-w-0 space-y-6">
            {/* Instructions */}
            <section>
              <h2 className="text-lg font-semibold text-heading mb-3">
                Instructions
              </h2>
              <div className="text-para text-[15px] leading-relaxed whitespace-pre-wrap">
                {assignment.description}
              </div>
            </section>

            {/* Resources */}
            {assignment.attachments && assignment.attachments.length > 0 && (
              <section>
                <h2 className="text-lg font-semibold text-heading mb-3">
                  Resources
                </h2>
                <div className="space-y-2">
                  {assignment.attachments.map((attachment) => (
                    <div
                      key={attachment.id}
                      className="flex items-center justify-between p-3 border border-light-border rounded hover:bg-gray-50 transition-colors"
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
                        className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-primary hover:bg-primary/5 rounded transition-colors"
                      >
                        <Download className="w-4 h-4" />
                        Download
                      </a>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Instructor: Submissions Table */}
            {isInstructor && (
              <section>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-heading">
                    Student Submissions
                  </h2>
                  <div className="flex items-center gap-2 text-sm text-para-muted">
                    <Users className="w-4 h-4" />
                    <span>
                      {submittedCount}/{sampleSubmissions.length} submitted
                    </span>
                  </div>
                </div>
                <SubmissionsTable
                  submissions={sampleSubmissions}
                  onReview={(id) => console.log("Review submission:", id)}
                />
              </section>
            )}
          </div>

          {/* Right Column - Sidebar */}
          {!isInstructor && submission && (
            <div className="w-[380px] flex-shrink-0 space-y-6">
              {/* Status Card */}
              <div className="border border-light-border rounded-lg p-5 bg-main-background">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-heading">Your Work</h3>
                  {submission.status === "graded" && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded text-xs font-semibold bg-success/10 text-success">
                      <CheckCircle2 className="w-4 h-4" />
                      Graded
                    </span>
                  )}
                  {submission.status === "submitted" && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded text-xs font-semibold bg-info/10 text-info">
                      <Clock className="w-4 h-4" />
                      Submitted
                    </span>
                  )}
                  {(submission.status === "overdue" ||
                    (submission.status === "pending" && isOverdue)) && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded text-xs font-semibold bg-destructive/10 text-destructive">
                      <XCircle className="w-4 h-4" />
                      Overdue
                    </span>
                  )}
                  {submission.status === "pending" && !isOverdue && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded text-xs font-semibold bg-accent/10 text-accent">
                      <AlertCircle className="w-4 h-4" />
                      Not submitted
                    </span>
                  )}
                </div>

                {/* Submitted Files */}
                {submission.submittedAt &&
                  submission.attachments &&
                  submission.attachments.length > 0 && (
                    <div className="mb-4">
                      <p className="text-xs font-semibold text-para-muted uppercase mb-2">
                        Submitted Files
                      </p>
                      <div className="space-y-2">
                        {submission.attachments.map((file) => (
                          <div
                            key={file.id}
                            className="flex items-center gap-2 p-2 bg-gray-50 rounded"
                          >
                            <FileText className="w-4 h-4 text-para-muted flex-shrink-0" />
                            <div className="min-w-0 flex-1">
                              <p className="text-sm font-medium text-heading truncate">
                                {file.name}
                              </p>
                              {file.size && (
                                <p className="text-xs text-para-muted">
                                  {formatFileSize(file.size)}
                                </p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                      {submission.submittedAt && (
                        <p className="text-xs text-para-muted mt-3">
                          Submitted{" "}
                          {formatSubmissionDate(submission.submittedAt)}
                        </p>
                      )}
                    </div>
                  )}

                {/* Feedback */}
                {submission.status === "graded" && submission.feedback && (
                  <div className="pt-4 border-t border-light-border">
                    <div className="flex items-center gap-2 mb-2">
                      <MessageSquare className="w-4 h-4 text-primary" />
                      <p className="text-xs font-semibold text-para-muted uppercase">
                        Feedback
                      </p>
                    </div>
                    <p className="text-sm text-para leading-relaxed">
                      {submission.feedback}
                    </p>
                  </div>
                )}

                {/* Upload Area */}
                {canSubmit && (
                  <div className="pt-4 border-t border-light-border">
                    {submission.status === "submitted" && (
                      <p className="text-xs text-para-muted mb-3">
                        You can update your submission before the due date
                      </p>
                    )}

                    <div
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                      className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                        isDragging
                          ? "border-primary bg-primary/5"
                          : "border-light-border hover:border-primary/50"
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
                        <Upload className="w-10 h-10 text-primary mb-2" />
                        <p className="text-sm font-medium text-heading mb-1">
                          Add or create
                        </p>
                        <p className="text-xs text-para-muted">
                          Upload files or folders
                        </p>
                      </label>
                    </div>

                    {selectedFiles.length > 0 && (
                      <div className="mt-3 space-y-2">
                        {selectedFiles.map((file, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between gap-2 p-2 border border-light-border rounded"
                          >
                            <div className="flex items-center gap-2 flex-1 min-w-0">
                              <FileText className="w-4 h-4 text-para-muted flex-shrink-0" />
                              <div className="min-w-0">
                                <p className="text-sm font-medium text-heading truncate">
                                  {file.name}
                                </p>
                                <p className="text-xs text-para-muted">
                                  {formatFileSize(file.size)}
                                </p>
                              </div>
                            </div>
                            <button
                              onClick={() => handleRemoveFile(index)}
                              className="p-1 hover:bg-gray-100 rounded"
                            >
                              <X className="w-4 h-4 text-para-muted" />
                            </button>
                          </div>
                        ))}
                        <Button
                          onClick={handleSubmit}
                          className="w-full mt-2"
                          size="sm"
                        >
                          {submission.status === "submitted"
                            ? "Update submission"
                            : "Turn in"}
                        </Button>
                      </div>
                    )}
                  </div>
                )}

                {isOverdue && submission.status === "pending" && (
                  <div className="pt-4 border-t border-light-border">
                    <p className="text-sm text-destructive">
                      Assignment overdue. Submissions no longer accepted.
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Instructor Right Sidebar - Stats */}
          {isInstructor && (
            <div className="w-[280px] flex-shrink-0">
              <div className="border border-light-border rounded-lg p-5 bg-main-background sticky top-6">
                <h3 className="font-semibold text-heading mb-4">Overview</h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-xs text-para-muted mb-1">Submitted</p>
                    <p className="text-2xl font-bold text-info">
                      {submittedCount}
                      <span className="text-sm text-para-muted font-normal">
                        /{sampleSubmissions.length}
                      </span>
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-para-muted mb-1">Graded</p>
                    <p className="text-2xl font-bold text-success">
                      {gradedCount}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-para-muted mb-1">
                      Pending Review
                    </p>
                    <p className="text-2xl font-bold text-accent">
                      {submittedCount - gradedCount}
                    </p>
                  </div>
                  <div className="pt-4 border-t border-light-border">
                    <p className="text-xs text-para-muted mb-1">Not Submitted</p>
                    <p className="text-2xl font-bold text-destructive">
                      {pendingCount}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
