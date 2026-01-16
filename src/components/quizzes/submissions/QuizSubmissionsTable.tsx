"use client";

import { useState, useMemo } from "react";
import { User, Check, X } from "lucide-react";
import { format } from "date-fns";
import type { QuizAttemptDetail, QuizQuestion } from "@/types/quiz";
import Avatar from "@/components/ui/Avatar";
import Pagination from "@/components/ui/Pagination";
import Table, { type TableColumn } from "@/components/ui/Table";

interface QuizSubmissionsTableProps {
  attempts: QuizAttemptDetail[];
  questions: QuizQuestion[];
  totalPoints: number;
}

const ITEMS_PER_PAGE = 10;

export default function QuizSubmissionsTable({
  attempts,
  questions,
  totalPoints,
}: QuizSubmissionsTableProps) {
  const [currentPage, setCurrentPage] = useState(1);

  // Sort attempts by submit date (newest first)
  const sortedAttempts = useMemo(
    () =>
      [...attempts].sort(
        (a, b) =>
          new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()
      ),
    [attempts]
  );

  // Paginate
  const paginatedAttempts = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return sortedAttempts.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [sortedAttempts, currentPage]);

  const totalPages = Math.ceil(sortedAttempts.length / ITEMS_PER_PAGE);

  const getCorrectCount = (answers: Record<string, string>) => {
    return questions.filter((q) => answers[q.id] === q.correctOption).length;
  };

  const getScoreColor = (score: number) => {
    const percentage = (score / totalPoints) * 100;
    if (percentage >= 80) return "text-success";
    if (percentage >= 60) return "text-accent";
    return "text-destructive";
  };

  // Define table columns
  const columns: TableColumn<QuizAttemptDetail>[] = [
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
          {format(new Date(attempt.submittedAt), "MMM d, h:mm a")}
        </p>
      ),
    },
    {
      key: "correct",
      header: "Correct",
      render: (attempt) => {
        const correctCount = getCorrectCount(attempt.answers);
        return (
          <div className="flex items-center gap-1 text-sm">
            <Check className="w-4 h-4 text-success" />
            <span className="text-para">
              {correctCount}/{questions.length}
            </span>
          </div>
        );
      },
    },
    {
      key: "score",
      header: "Score",
      render: (attempt) => (
        <span
          className={`text-sm font-semibold ${getScoreColor(attempt.score)}`}
        >
          {attempt.score}/{totalPoints}
        </span>
      ),
    },
    {
      key: "percentage",
      header: "Percentage",
      align: "right",
      render: (attempt) => {
        const percentage = Math.round((attempt.score / totalPoints) * 100);
        return (
          <span
            className={`text-sm font-medium ${getScoreColor(attempt.score)}`}
          >
            {percentage}%
          </span>
        );
      },
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
          When students complete the quiz, their submissions will appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-background border border-light-border rounded-xl overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-light-border">
        <h2 className="text-lg font-semibold text-heading">
          Student Submissions ({attempts.length})
        </h2>
      </div>

      {/* Table */}
      <div className="px-4 py-4">
        <Table
          columns={columns}
          data={paginatedAttempts}
          keyExtractor={(attempt) => attempt.id}
        />
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="px-4 pb-4">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={sortedAttempts.length}
            itemsPerPage={ITEMS_PER_PAGE}
            onPageChange={setCurrentPage}
            itemName="submissions"
          />
        </div>
      )}
    </div>
  );
}
