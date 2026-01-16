"use client";

import { useState, useMemo, useCallback } from "react";
import { useParams } from "next/navigation";
import { ChevronRight, Save, Loader2, User } from "lucide-react";
import { format } from "date-fns";
import type { InstructorAttempt } from "@/types/assignment";
import Avatar from "@/components/ui/Avatar";
import Pagination from "@/components/ui/Pagination";
import Table, { type TableColumn } from "@/components/ui/Table";
import { Button } from "@/components/ui/Button";
import GradeInput from "./GradeInput";
import SubmissionDrawer from "./SubmissionDrawer";
import useBulkGradeAttempts from "@/hooks/assignments/use-bulk-grade-attempts";

interface SubmissionsTableProps {
  attempts: InstructorAttempt[];
  totalScore: number;
  // Server-side pagination props
  currentPage?: number;
  totalPages?: number;
  totalItems?: number;
  onPageChange?: (page: number) => void;
}

const ITEMS_PER_PAGE = 10;

/**
 * Table view for instructor to grade student submissions.
 * Features inline score editing, pagination, and a slide-out drawer for details.
 */
export default function SubmissionsTable({
  attempts,
  totalScore,
  currentPage: serverCurrentPage,
  totalPages: serverTotalPages,
  totalItems: serverTotalItems,
  onPageChange,
}: SubmissionsTableProps) {
  const params = useParams();
  const roomId = params?.id as string;
  const assignmentId = params?.assignmentId as string;

  // Use server-side pagination if provided, otherwise fall back to client-side
  const isServerPaginated = onPageChange !== undefined;

  // Client-side pagination state (used only when not server-paginated)
  const [clientCurrentPage, setClientCurrentPage] = useState(1);
  const currentPage = isServerPaginated ? (serverCurrentPage ?? 1) : clientCurrentPage;

  // Drawer state
  const [selectedAttemptId, setSelectedAttemptId] = useState<string | null>(
    null
  );

  // Pending score changes: attemptId -> newScore
  const [pendingChanges, setPendingChanges] = useState<Map<string, number>>(
    new Map()
  );

  const { bulkGradeAttempts, isGrading } = useBulkGradeAttempts({
    onSuccess: () => {
      setPendingChanges(new Map());
    },
  });

  // Sort attempts by submit date (newest first)
  // When server-paginated, data is already sorted and paginated by server
  const sortedAttempts = useMemo(
    () =>
      isServerPaginated
        ? attempts
        : [...attempts].sort(
            (a, b) =>
              new Date(b.submitAt).getTime() - new Date(a.submitAt).getTime()
          ),
    [attempts, isServerPaginated]
  );

  // Client-side pagination (only used when not server-paginated)
  const paginatedAttempts = useMemo(() => {
    if (isServerPaginated) return sortedAttempts;
    const startIndex = (clientCurrentPage - 1) * ITEMS_PER_PAGE;
    return sortedAttempts.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [sortedAttempts, clientCurrentPage, isServerPaginated]);

  // Total pages: use server value if available, otherwise calculate
  const totalPages = isServerPaginated
    ? (serverTotalPages ?? 1)
    : Math.ceil(sortedAttempts.length / ITEMS_PER_PAGE);

  const totalItems = isServerPaginated
    ? (serverTotalItems ?? attempts.length)
    : sortedAttempts.length;

  // Handle page change - use server callback if available
  const handlePageChange = (page: number) => {
    if (isServerPaginated && onPageChange) {
      onPageChange(page);
    } else {
      setClientCurrentPage(page);
    }
  };

  // Find selected attempt for drawer
  const selectedAttempt = useMemo(
    () => sortedAttempts.find((a) => a.id === selectedAttemptId) || null,
    [sortedAttempts, selectedAttemptId]
  );

  // Navigation in drawer
  const selectedIndex = useMemo(
    () => sortedAttempts.findIndex((a) => a.id === selectedAttemptId),
    [sortedAttempts, selectedAttemptId]
  );

  const handleScoreChange = useCallback(
    (
      attemptId: string,
      originalScore: number | null,
      newScore: number | null
    ) => {
      setPendingChanges((prev) => {
        const updated = new Map(prev);
        if (
          newScore === originalScore ||
          (newScore === null && originalScore === null)
        ) {
          updated.delete(attemptId);
        } else if (newScore !== null) {
          updated.set(attemptId, newScore);
        } else {
          updated.delete(attemptId);
        }
        return updated;
      });
    },
    []
  );

  const handleSaveAll = async () => {
    if (pendingChanges.size === 0) return;

    const attemptsToSave = Array.from(pendingChanges.entries()).map(
      ([attemptId, score]) => ({ attemptId, score })
    );

    await bulkGradeAttempts({
      roomId,
      assignmentId,
      attempts: attemptsToSave,
    });
  };

  const handlePrevAttempt = () => {
    if (selectedIndex > 0) {
      setSelectedAttemptId(sortedAttempts[selectedIndex - 1].id);
    }
  };

  const handleNextAttempt = () => {
    if (selectedIndex < sortedAttempts.length - 1) {
      setSelectedAttemptId(sortedAttempts[selectedIndex + 1].id);
    }
  };

  const hasChanges = pendingChanges.size > 0;
  const hasInvalidScores = Array.from(pendingChanges.values()).some(
    (score) => score > totalScore || score < 0
  );
  const isDisabled = !hasChanges || isGrading || hasInvalidScores;

  const getButtonTooltip = () => {
    if (hasInvalidScores) {
      return `Some scores are invalid (must be between 0 and ${totalScore})`;
    }
    if (!hasChanges) {
      return "No changes to save";
    }
    return "";
  };

  const getStatusBadge = (score: number | null, hasUnsaved: boolean) => {
    if (hasUnsaved) {
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-secondary/10 text-secondary border border-secondary/20">
          Unsaved
        </span>
      );
    }
    if (score !== null) {
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-success/10 text-success border border-success/20">
          Graded
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20">
        Pending
      </span>
    );
  };

  // Define table columns
  const columns: TableColumn<InstructorAttempt>[] = [
    {
      key: "student",
      header: "Student",
      render: (attempt) => (
        <div className="flex items-center gap-3">
          <Avatar profileImage={attempt.user.image || undefined} size="sm" />
          <div>
            <p className="text-sm font-medium text-heading">
              {attempt.user.firstName} {attempt.user.lastName}
            </p>
            <p className="text-xs text-para-muted">{attempt.user.email}</p>
          </div>
        </div>
      ),
    },
    {
      key: "submitted",
      header: "Submitted",
      render: (attempt) => (
        <p className="text-sm text-para">
          {format(new Date(attempt.submitAt), "MMM d, h:mm a")}
        </p>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (attempt) =>
        getStatusBadge(attempt.score, pendingChanges.has(attempt.id)),
    },
    {
      key: "score",
      header: "Score",
      render: (attempt) => {
        // Show pending score if available, otherwise show original
        const displayScore = pendingChanges.has(attempt.id)
          ? pendingChanges.get(attempt.id) ?? null
          : attempt.score;

        return (
          <div onClick={(e) => e.stopPropagation()}>
            <GradeInput
              score={displayScore}
              totalScore={totalScore}
              onChange={(newScore) =>
                handleScoreChange(attempt.id, attempt.score, newScore)
              }
            />
          </div>
        );
      },
    },
    {
      key: "details",
      header: "Details",
      align: "right",
      render: (attempt) => (
        <button
          onClick={(e) => {
            e.stopPropagation();
            setSelectedAttemptId(attempt.id);
          }}
          className="p-2 rounded-lg hover:bg-secondary/10 transition-colors text-para-muted hover:text-heading"
          aria-label="View details"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      ),
    },
  ];

  // Empty state
  if (attempts.length === 0) {
    return (
      <div className="bg-background border border-light-border rounded-xl p-12 text-center">
        <div className="w-16 h-16 rounded-full bg-secondary/10 flex items-center justify-center mx-auto mb-4">
          <User className="w-8 h-8 text-secondary" />
        </div>
        <h3 className="text-xl font-semibold text-heading mb-2">
          No Submissions Yet
        </h3>
        <p className="text-para-muted max-w-sm mx-auto">
          When students submit their work, it will appear here for you to grade.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="bg-background border border-light-border rounded-xl overflow-hidden">
        {/* Header with Save Button */}
        <div className="flex items-center justify-between p-4 border-b border-light-border">
          <h2 className="text-lg font-semibold text-heading">
            Student Submissions ({attempts.length})
          </h2>
          <div title={getButtonTooltip()}>
            <Button
              onClick={handleSaveAll}
              disabled={isDisabled}
              className="gap-2"
            >
              {isGrading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Save All Grades
                  {hasChanges && (
                    <span className="ml-1 px-1.5 py-0.5 text-xs bg-white/20 rounded">
                      {pendingChanges.size}
                    </span>
                  )}
                </>
              )}
            </Button>
          </div>
        </div>
        <div className="px-4 py-4">
          <Table
            columns={columns}
            data={paginatedAttempts}
            keyExtractor={(attempt) => attempt.id}
            onRowClick={(attempt) => setSelectedAttemptId(attempt.id)}
          />
        </div>
        {/* Table using reusable component */}

        {/* Pagination */}
        <div className="px-4 pb-4 ">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={totalItems}
            itemsPerPage={ITEMS_PER_PAGE}
            onPageChange={handlePageChange}
            itemName="submissions"
          />
        </div>
      </div>

      {/* Submission Drawer */}
      <SubmissionDrawer
        isOpen={!!selectedAttempt}
        onClose={() => setSelectedAttemptId(null)}
        attempt={selectedAttempt}
        totalScore={totalScore}
        currentIndex={selectedIndex}
        totalCount={sortedAttempts.length}
        onPrev={handlePrevAttempt}
        onNext={handleNextAttempt}
        pendingScore={
          selectedAttemptId ? pendingChanges.get(selectedAttemptId) : undefined
        }
        onScoreChange={(newScore) => {
          if (selectedAttempt) {
            handleScoreChange(
              selectedAttempt.id,
              selectedAttempt.score,
              newScore
            );
          }
        }}
      />
    </>
  );
}
