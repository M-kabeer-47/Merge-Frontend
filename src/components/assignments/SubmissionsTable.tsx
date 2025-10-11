"use client";

import React, { useState } from "react";
import {
  CheckCircle2,
  Clock,
  XCircle,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  Download,
  FileText,
} from "lucide-react";
import type { StudentSubmissionDetail } from "@/types/submission";
import { formatFileSize } from "@/utils/file-helpers";
import { Button } from "@/components/ui/Button";

interface SubmissionsTableProps {
  submissions: StudentSubmissionDetail[];
  onReview?: (submissionId: string) => void;
}

export default function SubmissionsTable({
  submissions,
  onReview,
}: SubmissionsTableProps) {
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

  const toggleRow = (id: string) => {
    setExpandedRows((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const getStatusBadge = (
    status: StudentSubmissionDetail["status"],
    isLate: boolean
  ) => {
    if (status === "graded") {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-medium bg-success/10 text-success border border-success/20">
          <CheckCircle2 className="w-3.5 h-3.5" />
          Graded
        </span>
      );
    }
    if (status === "submitted") {
      if (isLate) {
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-medium bg-destructive/10 text-destructive border border-destructive/20">
            <Clock className="w-3.5 h-3.5" />
            Late
          </span>
        );
      }
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-medium bg-info/10 text-info border border-info/20">
          <Clock className="w-3.5 h-3.5" />
          Submitted
        </span>
      );
    }
    if (status === "missing") {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-medium bg-destructive/10 text-destructive border border-destructive/20">
          <XCircle className="w-3.5 h-3.5" />
          Missing
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-medium bg-accent/10 text-accent border border-accent/20">
        <AlertCircle className="w-3.5 h-3.5" />
        Not submitted
      </span>
    );
  };

  const formatDate = (date?: Date) => {
    if (!date) return "—";
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  };

  return (
    <div className="border border-light-border rounded-lg overflow-hidden bg-main-background">
      <table className="w-full">
        <thead className="bg-gray-50 border-b border-light-border">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-semibold text-para-muted uppercase tracking-wider">
              Student
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-para-muted uppercase tracking-wider">
              Status
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-para-muted uppercase tracking-wider">
              Submitted
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-para-muted uppercase tracking-wider">
              Grade
            </th>
            <th className="px-4 py-3 text-right text-xs font-semibold text-para-muted uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-light-border">
          {submissions.map((submission) => (
            <React.Fragment key={submission.id}>
              <tr className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3.5">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold text-sm flex-shrink-0">
                      {submission.student.initials}
                    </div>
                    <div className="min-w-0">
                      <p className="font-medium text-heading text-sm truncate">
                        {submission.student.name}
                      </p>
                      <p className="text-xs text-para-muted truncate">
                        {submission.student.email}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3.5">
                  {getStatusBadge(submission.status, submission.isLate)}
                </td>
                <td className="px-4 py-3.5">
                  <span className="text-sm text-para">
                    {formatDate(submission.submittedAt)}
                  </span>
                </td>
                <td className="px-4 py-3.5">
                  {submission.grade !== undefined ? (
                    <span className="text-sm font-semibold text-heading">
                      {submission.grade}
                    </span>
                  ) : (
                    <span className="text-sm text-para-muted">—</span>
                  )}
                </td>
                <td className="px-4 py-3.5">
                  <div className="flex items-center justify-end gap-2">
                    {submission.files.length > 0 && (
                      <button
                        onClick={() => toggleRow(submission.id)}
                        className="p-1.5 hover:bg-gray-100 rounded transition-colors"
                        title={
                          expandedRows.has(submission.id)
                            ? "Hide details"
                            : "Show details"
                        }
                      >
                        {expandedRows.has(submission.id) ? (
                          <ChevronUp className="w-4 h-4 text-para-muted" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-para-muted" />
                        )}
                      </button>
                    )}
                    {submission.status !== "pending" &&
                      submission.status !== "missing" && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onReview?.(submission.id)}
                          className="text-xs"
                        >
                          Review
                        </Button>
                      )}
                  </div>
                </td>
              </tr>

              {/* Expanded details */}
              {expandedRows.has(submission.id) && (
                <tr>
                  <td colSpan={5} className="bg-gray-50">
                    <div className="px-4 py-4 space-y-4">
                      {/* Files */}
                      {submission.files.length > 0 && (
                        <div>
                          <p className="text-xs font-semibold text-para-muted uppercase mb-2">
                            Submitted Files
                          </p>
                          <div className="space-y-2">
                            {submission.files.map((file) => (
                              <div
                                key={file.id}
                                className="flex items-center justify-between gap-4 p-3 bg-white border border-light-border rounded"
                              >
                                <div className="flex items-center gap-3 flex-1 min-w-0">
                                  <FileText className="w-5 h-5 text-para-muted flex-shrink-0" />
                                  <div className="min-w-0">
                                    <p className="font-medium text-heading text-sm truncate">
                                      {file.name}
                                    </p>
                                    <p className="text-xs text-para-muted">
                                      {formatFileSize(file.size)} • Uploaded{" "}
                                      {formatDate(file.uploadedAt)}
                                    </p>
                                  </div>
                                </div>
                                <a
                                  href={file.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-primary hover:bg-primary/5 rounded transition-colors flex-shrink-0"
                                >
                                  <Download className="w-4 h-4" />
                                  Download
                                </a>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Feedback */}
                      {submission.feedback && (
                        <div>
                          <p className="text-xs font-semibold text-para-muted uppercase mb-2">
                            Feedback
                          </p>
                          <div className="p-3 bg-white border border-light-border rounded">
                            <p className="text-sm text-para whitespace-pre-wrap">
                              {submission.feedback}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
}


