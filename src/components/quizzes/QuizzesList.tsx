"use client";

import { useRouter } from "next/navigation";
import { useRoom } from "@/providers/RoomProvider";
import useFetchRoleBasedQuizzes from "@/hooks/quizzes/use-fetch-role-based-quizzes";
import QuizCard from "./QuizCard";
import QuizCardsSkeleton from "./QuizCardsSkeleton";
import {
  EmptyQuizzes,
  NoSearchResults,
  EmptyFilterResults,
} from "./EmptyStates";
import type { InstructorQuiz, StudentQuiz } from "@/types/quiz";

interface QuizzesListProps {
  roomId: string;
  search: string | undefined;
  sortBy: string | undefined;
  filter: string | undefined;
  sortOrder: "asc" | "desc";
}

export default function QuizzesList({
  roomId,
  search,
  sortBy,
  filter,
  sortOrder,
}: QuizzesListProps) {
  const router = useRouter();
  const { userRole } = useRoom();

  const isInstructor = userRole === "instructor" || userRole === "moderator";

  // Fetch quizzes based on role
  const { data: quizzes = [], isLoading } = useFetchRoleBasedQuizzes({
    roomId,
    isInstructor,
    search,
    sortBy,
    filter,
    sortOrder,
  });

  const handleViewDetails = (id: string) => {
    const quiz = quizzes.find((q) => q.id === id);
    if (!quiz) return;

    if (isInstructor) {
      router.push(`/rooms/${roomId}/quizzes/${id}/submissions`);
    } else {
      const studentQuiz = quiz as StudentQuiz;
      const status = studentQuiz.submissionStatus;
      if (status === "completed") {
        router.push(`/rooms/${roomId}/quizzes/${id}/review`);
      } else {
        router.push(`/rooms/${roomId}/quizzes/${id}`);
      }
    }
  };

  const handleEdit = (id: string) => {
    router.push(`/rooms/${roomId}/quizzes/${id}/edit`);
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this quiz?")) {
      console.log("Delete quiz:", id);
      // TODO: Implement delete quiz functionality
    }
  };

  const handleStartQuiz = (id: string) => {
    router.push(`/rooms/${roomId}/quizzes/${id}/attempt`);
  };

  const handleReviewQuiz = (id: string) => {
    router.push(`/rooms/${roomId}/quizzes/${id}/review`);
  };

  const handleClearFilters = () => {
    router.push(`/rooms/${roomId}/quizzes`);
  };

  const handleCreateFirst = () => {
    router.push(`/rooms/${roomId}/quizzes/create`);
  };

  const isEmpty = quizzes.length === 0;
  const hasSearchTerm = search && search.trim().length > 0;
  const hasActiveFilter = filter && filter !== "all";
  // Show skeleton while loading or role is not yet determined
  if (isLoading || !userRole) {
    return <QuizCardsSkeleton />;
  }

  // Empty state
  if (isEmpty) {
    return (
      <div className="flex-1 overflow-y-auto">
        <div className="h-full flex items-center justify-center">
          {hasSearchTerm && search ? (
            <NoSearchResults
              searchTerm={search}
              onClearSearch={handleClearFilters}
            />
          ) : hasActiveFilter && filter ? (
            <EmptyFilterResults
              filterType={filter}
              onClearFilter={handleClearFilters}
            />
          ) : (
            <EmptyQuizzes
              isInstructor={isInstructor}
              onCreateFirst={isInstructor ? handleCreateFirst : undefined}
            />
          )}
        </div>
      </div>
    );
  }

  // Instructor view - grid layout
  if (isInstructor) {
    return (
      <div className="flex-1 overflow-y-auto">
        <div className="px-4 sm:px-6 py-4 grid grid-cols-1 sm:grid-cols-2 items-center gap-5">
          {(quizzes as InstructorQuiz[]).map((quiz) => (
            <QuizCard
              key={quiz.id}
              quiz={quiz}
              isInstructor={true}
              onViewDetails={handleViewDetails}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      </div>
    );
  }

  // Student view - list layout
  return (
    <div className="flex-1 overflow-y-auto">
      <div className="px-4 sm:px-6 py-4 space-y-4">
        {(quizzes as StudentQuiz[]).map((quiz) => (
          <QuizCard
            key={quiz.id}
            quiz={quiz}
            isInstructor={false}
            onViewDetails={handleViewDetails}
            onStartQuiz={handleStartQuiz}
            onReviewQuiz={handleReviewQuiz}
          />
        ))}
      </div>
    </div>
  );
}
