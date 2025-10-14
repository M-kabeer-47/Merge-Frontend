"use client";

import React from "react";
import { FileText, Download, Users } from "lucide-react";
import type { Assignment } from "@/types/assignment";
import { formatFileSize } from "@/utils/file-helpers";
import SubmissionsTable from "./SubmissionsTable";
import { sampleSubmissions } from "@/lib/constants/submission-mock-data";

interface InstructorAssignmentViewProps {
  assignment: Assignment;
}

export default function InstructorAssignmentView({
  assignment,
}: InstructorAssignmentViewProps) {
  // Calculate stats
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

        {/* Submissions Table */}
        <section>
          <div className="flex items-center justify-between mb-3">
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
      </div>

      {/* Right Column - Stats Sidebar */}
      <div className="w-full lg:w-[280px] flex-shrink-0">
        <div className="bg-background border border-light-border rounded-lg p-4 sm:p-5 lg:sticky lg:top-6">
          <h3 className="font-semibold text-heading mb-4">Overview</h3>
          <div className="space-y-4">
            <div>
              <p className="text-xs text-para-muted mb-1">Submitted</p>
              <p className="text-2xl font-bold text-primary">
                {submittedCount}
                <span className="text-sm text-para-muted font-normal">
                  /{sampleSubmissions.length}
                </span>
              </p>
            </div>
            <div>
              <p className="text-xs text-para-muted mb-1">Graded</p>
              <p className="text-2xl font-bold text-primary">{gradedCount}</p>
            </div>
            <div>
              <p className="text-xs text-para-muted mb-1">Pending Review</p>
              <p className="text-2xl font-bold text-secondary">
                {submittedCount - gradedCount}
              </p>
            </div>
            <div className="pt-4 border-t border-light-border">
              <p className="text-xs text-para-muted mb-1">Not Submitted</p>
              <p className="text-2xl font-bold text-para">{pendingCount}</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
