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
  Save,
} from "lucide-react";
import type { StudentSubmissionDetail } from "@/types/submission";
import { formatFileSize } from "@/utils/file-helpers";
import { Button } from "@/components/ui/Button";
import { Input } from "../ui/Input";
import { Textarea } from "../ui/Textarea";

interface SubmissionsTableProps {
  submissions: StudentSubmissionDetail[];
  onReview?: (submissionId: string) => void;
}

export default function SubmissionsTable({
  submissions,
  onReview,
}: SubmissionsTableProps) {
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const [gradingData, setGradingData] = useState<{
    [key: string]: { points: string; feedback: string };
  }>({});

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
        <span className="inline-flex items-center justify-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20 min-w-[100px]">
          <CheckCircle2 className="w-3.5 h-3.5" />
          Graded
        </span>
      );
    }
    if (status === "submitted") {
      if (isLate) {
        return (
          <span className="inline-flex items-center justify-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-destructive/10 text-destructive border border-destructive/20 min-w-[100px]">
            <Clock className="w-3.5 h-3.5" />
            Late
          </span>
        );
      }
      return (
        <span className="inline-flex items-center justify-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-secondary/10 text-secondary border border-secondary/20 min-w-[100px]">
          <Clock className="w-3.5 h-3.5" />
          Submitted
        </span>
      );
    }
    if (status === "missing") {
      return (
        <span className="inline-flex items-center justify-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-destructive/10 text-destructive border border-destructive/20 min-w-[100px]">
          <XCircle className="w-3.5 h-3.5" />
          Missing
        </span>
      );
    }
    return (
      <span className="inline-flex items-center justify-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-para/10 text-para border border-para/20 min-w-[100px]">
        <AlertCircle className="w-3.5 h-3.5" />
        Pending
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

  const handleGradeChange = (id: string, field: 'points' | 'feedback', value: string) => {
    setGradingData((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        points: prev[id]?.points || '',
        feedback: prev[id]?.feedback || '',
        [field]: value,
      },
    }));
  };

  const handleSaveGrade = (id: string) => {
    const data = gradingData[id];
    console.log('Saving grade for:', id, data);
    // TODO: Implement actual save logic
  };

  return (
    <div className="border border-light-border rounded-lg overflow-hidden bg-background">
      <table className="w-full">
        <thead className="bg-secondary/5 border-b border-light-border">
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
              <tr className="hover:bg-background transition-colors">
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
                        className="flex items-center gap-2 px-3 py-1.5 hover:bg-secondary/10 rounded transition-colors text-primary"
                        title={
                          expandedRows.has(submission.id)
                            ? "Hide details"
                            : "Show details"
                        }
                      >
                        <span className="text-xs font-medium">Review</span>
                        {expandedRows.has(submission.id) ? (
                          <ChevronUp className="w-4 h-4" />
                        ) : (
                          <ChevronDown className="w-4 h-4" />
                        )}
                      </button>
                    )}
                  </div>
                </td>
              </tr>

              {/* Expanded details */}
              {expandedRows.has(submission.id) && (
                <tr>
                  <td colSpan={5} className="bg-background">
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
                                className="flex items-center justify-between gap-4 p-3 bg-secondary/5 border border-light-border rounded-lg">
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
                          <div className="p-3 bg-secondary/5 border border-light-border rounded-lg">
                            <p className="text-sm text-para whitespace-pre-wrap">
                              {submission.feedback}
                            </p>
                          </div>
                        </div>
                      )}

                      {/* Grading Section */}
                      {(submission.status === "submitted" || submission.status === "graded") && (
                        <div className="pt-4 border-t border-light-border">
                          <p className="text-xs font-semibold text-para-muted uppercase mb-3">
                            {submission.status === "graded" ? "Update Grade" : "Grade Assignment"}
                          </p>
                          <div className="space-y-3">
                            <div>
                              <label className="block text-sm font-medium text-heading mb-1">
                                Points
                              </label>
                              <Input
                                type="number"
                                placeholder="Enter points"
                                value={gradingData[submission.id]?.points || submission.grade || ''}
                                onChange={(e) => handleGradeChange(submission.id, 'points', e.target.value)}
                                
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-heading mb-1">
                                Feedback <span className="text-para-muted">(Optional)</span>
                              </label>
                              <Textarea
                                placeholder="Enter feedback for the student"
                                value={gradingData[submission.id]?.feedback || submission.feedback || ''}
                                onChange={(e) => handleGradeChange(submission.id, 'feedback', e.target.value)}
                                rows={3}
                                
                              />
                            </div>
                            <div className="flex items-center justify-end">
                            <Button
                              onClick={() => handleSaveGrade(submission.id)}
                              className="flex items-center gap-2 w-[140px]"
                              size="sm"
                              
                            >
                              <Save className="w-4 h-4" />
                              Save Grade
                            </Button>
                            </div>
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


