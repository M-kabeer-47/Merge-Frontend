"use client";

import { FileText, Download, ChevronLeft, ChevronRight } from "lucide-react";
import { format } from "date-fns";
import type { InstructorAttempt } from "@/types/assignment";
import Drawer from "@/components/ui/Drawer";
import Avatar from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import GradeInput from "./GradeInput";
import { downloadFile } from "@/utils/download-file";

interface SubmissionDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  attempt: InstructorAttempt | null;
  totalScore: number;
  currentIndex: number;
  totalCount: number;
  onPrev: () => void;
  onNext: () => void;
  pendingScore?: number;
  onScoreChange: (score: number | null) => void;
}

/**
 * Slide-out drawer displaying full submission details for grading.
 * Includes student info, note, files, and score input.
 */
export default function SubmissionDrawer({
  isOpen,
  onClose,
  attempt,
  totalScore,
  currentIndex,
  totalCount,
  onPrev,
  onNext,
  pendingScore,
  onScoreChange,
}: SubmissionDrawerProps) {
  if (!attempt) return null;

  const { user, submitAt, score, files, note } = attempt;

  const handleDownload = (file: { name: string; url: string }) => {
    downloadFile(file.url, file.name);
  };

  // Display score: pending change takes precedence over saved score
  const displayScore = pendingScore !== undefined ? pendingScore : score;

  return (
    <Drawer isOpen={isOpen} onClose={onClose} width="lg">
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="p-6 border-b border-light-border">
          <div className="flex items-center gap-4">
            <Avatar profileImage={user?.image || undefined} size="lg" />
            <div className="flex-1 min-w-0">
              <h2 className="text-xl font-semibold text-heading">
                {user?.firstName} {user?.lastName}
              </h2>
              <p className="text-sm text-para-muted truncate">{user?.email}</p>
            </div>
          </div>
          <div className="mt-3 flex items-center gap-2 text-sm text-para-muted">
            <span>
              Submitted:{" "}
              {format(new Date(submitAt), "MMMM d, yyyy 'at' h:mm a")}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Note Section */}
          {note && (
            <div>
              <h3 className="text-xs font-semibold text-para-muted uppercase tracking-wider mb-2">
                Student Note
              </h3>
              <div className="p-4 bg-secondary/5 rounded-lg border border-light-border">
                <p className="text-sm text-para whitespace-pre-wrap">{note}</p>
              </div>
            </div>
          )}

          {/* Files Section */}
          {files.length > 0 && (
            <div>
              <h3 className="text-xs font-semibold text-para-muted uppercase tracking-wider mb-2">
                Submitted Files ({files.length})
              </h3>
              <div className="space-y-2">
                {files.map((file, index) => (
                  <button
                    key={index}
                    onClick={() => handleDownload(file)}
                    className="w-full flex items-center gap-3 p-3 bg-background border border-light-border hover:border-primary/30 hover:bg-primary/5 rounded-lg transition-all text-left group"
                  >
                    <div className="p-2 rounded-md bg-secondary/10 text-secondary group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-heading truncate">
                        {file.name}
                      </p>
                    </div>
                    <Download className="w-4 h-4 text-para-muted group-hover:text-primary opacity-0 group-hover:opacity-100 transition-all" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* No content message */}
          {!note && files.length === 0 && (
            <div className="text-center py-8">
              <p className="text-para-muted">
                No additional notes or files submitted.
              </p>
            </div>
          )}

          {/* Score Section */}
          <div className="pt-4 border-t border-light-border">
            <h3 className="text-xs font-semibold text-para-muted uppercase tracking-wider mb-3">
              Grade
            </h3>
            <div className="flex items-center gap-3">
              <GradeInput
                score={displayScore}
                totalScore={totalScore}
                onChange={onScoreChange}
              />
            </div>
            {pendingScore !== undefined && pendingScore !== score && (
              <p className="text-xs text-secondary mt-2">
                ✓ Score changed (save all to apply)
              </p>
            )}
          </div>
        </div>

        {/* Footer Navigation */}
        <div className="p-4 border-t border-light-border bg-secondary/5">
          <div className="flex items-center justify-between">
            <Button
              onClick={onPrev}
              disabled={currentIndex <= 0}
              variant="outline"
              className="gap-2"
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </Button>

            <span className="text-sm text-para-muted">
              {currentIndex + 1} of {totalCount}
            </span>

            <Button
              onClick={onNext}
              disabled={currentIndex >= totalCount - 1}
              variant="outline"
              className="gap-2"
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </Drawer>
  );
}
