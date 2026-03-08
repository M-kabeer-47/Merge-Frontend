"use client";

import React, { useState } from "react";
import {
  Clock,
  Trophy,
  MoreVertical,
  Eye,
  Edit,
  Trash2,
  FileText,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import type { InstructorAssignment } from "@/types/assignment";
import { Button } from "@/components/ui/Button";
import DropdownMenu from "@/components/ui/Dropdown";

interface InstructorAssignmentCardProps {
  assignment: InstructorAssignment;
  onViewResponses?: (id: string) => void;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}

export default function InstructorAssignmentCard({
  assignment,
  onViewResponses,
  onEdit,
  onDelete,
}: InstructorAssignmentCardProps) {
  const [showMenu, setShowMenu] = useState(false);

  const isClosed = assignment.status === "closed";
  
  // Calculate submission percentage for progress bar
  const submissionPercentage = Math.round(
    (assignment.submissionStats.submitted / assignment.submissionStats.total) * 100
  );

  // Dropdown menu options
  const menuOptions = [
    {
      title: "View Responses",
      icon: <Eye className="w-4 h-4" />,
      action: () => onViewResponses?.(assignment.id),
    },
    {
      title: "Edit Assignment",
      icon: <Edit className="w-4 h-4" />,
      action: () => onEdit?.(assignment.id),
    },
    {
      title: "Delete",
      icon: <Trash2 className="w-4 h-4" />,
      action: () => onDelete?.(assignment.id),
      destructive: true,
    },
  ];

  return (
    <div className="border border-light-border rounded-lg p-5 bg-background hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-3 mb-1">
            <h3 className="text-lg font-semibold text-heading truncate flex-1">
              {assignment.title}
            </h3>

            {/* Three dots menu */}
            <div className="relative flex-shrink-0">
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="p-1.5 rounded hover:bg-gray-100 transition-colors text-para-muted"
                aria-label="Assignment options"
              >
                <MoreVertical className="w-5 h-5" />
              </button>

              {showMenu && (
                <div className="absolute right-0 top-8 z-10">
                  <DropdownMenu
                    options={menuOptions}
                    onClose={() => setShowMenu(false)}
                    align="right"
                  />
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3 flex-wrap text-sm text-para-muted">
            <span className="flex items-center gap-1">
              <Trophy className="w-4 h-4" />
              {assignment.points} points
            </span>

            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              Due:{" "}
              {new Date(assignment.dueDate).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
                hour: "numeric",
                minute: "2-digit",
              })}
            </span>
          </div>
        </div>
      </div>

      {/* Description */}
      <p className="text-sm text-para mb-4 line-clamp-2">
        {assignment.description}
      </p>

      {/* Status & Info Row */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        {/* Left side - Submission stats */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-1.5 text-primary font-medium text-sm">
            <FileText className="w-4 h-4" />
            <span>
              {assignment.submissionStats.submitted}/
              {assignment.submissionStats.total} submitted
            </span>
          </div>

          {assignment.submissionStats.graded > 0 && (
            <div className="flex items-center gap-1 font-medium text-sm">
              <CheckCircle2 className="w-5 h-5 text-white" fill="#10b981" />
              <span className="text-success">
                {assignment.submissionStats.graded} graded
              </span>
            </div>
          )}

          {isClosed && (
            <div className="flex items-center gap-1.5 text-para-muted font-medium text-sm">
              <XCircle className="w-4 h-4" />
              <span>Closed</span>
            </div>
          )}

          {assignment.attachments && assignment.attachments.length > 0 && (
            <div className="flex items-center gap-2 text-xs text-para-muted">
              <FileText className="w-4 h-4" />
              <span>
                {assignment.attachments.length} attachment
                {assignment.attachments.length !== 1 ? "s" : ""}
              </span>
            </div>
          )}
        </div>

        {/* Right side - Action button */}
        <Button
          variant="default"
          size="sm"
          onClick={() => onViewResponses?.(assignment.id)}
          className="text-xs px-4 py-2"
        >
          <FileText className="w-4 h-4" />
          View Responses
        </Button>
      </div>

      {/* Progress Bar */}
      <div className="space-y-1 mt-4">
        <div className="flex items-center justify-between text-xs">
          <span className="text-para-muted">Submission Progress</span>
          <span className="font-medium text-primary">
            {submissionPercentage}%
          </span>
        </div>
        <div className="w-full bg-secondary/10 rounded-full h-2">
          <div
            className="bg-primary h-2 rounded-full transition-all duration-300"
            style={{ width: `${submissionPercentage}%` }}
          />
        </div>
      </div>
    </div>
  );
}
