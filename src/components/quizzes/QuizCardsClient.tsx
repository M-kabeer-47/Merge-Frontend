"use client";

import React, { useMemo } from "react";
import { useRouter } from "next/navigation";
import QuizCard from "@/components/quizzes/QuizCard";
import {
  EmptyQuizzes,
  NoSearchResults,
  EmptyFilterResults,
} from "@/components/quizzes/EmptyStates";
import type { Quiz, QuizFilterType, StudentQuiz } from "@/types/quiz";

interface QuizCardsClientProps {
  quizzes: Quiz[] | StudentQuiz[];
  roomId: string;
  isInstructor: boolean;
  filter?: string;
  searchTerm: string;
}

export default function QuizCardsClient({
  quizzes,
  roomId,
  isInstructor,
  filter = "all",
  searchTerm,
}: QuizCardsClientProps) {
  const router = useRouter();
  const activeFilter = filter as QuizFilterType;

  // Client-side filtering for status
  const filteredQuizzes = useMemo(() => {
    if (activeFilter === "all") return quizzes;

    return quizzes.filter((item) => {
      if (isInstructor) {
        switch (activeFilter) {
          case "active":
            return item.status === "published";
          case "closed":
            return item.status === "closed";
          default:
            return true;
        }
      } else {
        const studentItem = item as StudentQuiz;
        const attempt = studentItem.attempt;
        const isOverdue = new Date() > new Date(item.deadline);

        switch (activeFilter) {
          case "pending":
            return attempt?.status === "pending" && !isOverdue;
          case "completed":
            return attempt?.status === "completed";
          case "missed":
            return (
              attempt?.status === "missed" ||
              (attempt?.status === "pending" && isOverdue)
            );
          default:
            return true;
        }
      }
    });
  }, [quizzes, activeFilter, isInstructor]);

  // Handlers
  const handleViewDetails = (id: string) => {
    // For instructors, go to submissions overview
    // For students with completed quiz, go to review page
    const quiz = filteredQuizzes.find((q) => q.id === id);
    if (!quiz) return;

    if (isInstructor) {
      router.push(`/rooms/${roomId}/quizzes/${id}/submissions`);
    } else {
      const studentQuiz = quiz as StudentQuiz;
      if (studentQuiz.attempt?.status === "completed") {
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
    }
  };

  const handleStartQuiz = (id: string) => {
    router.push(`/rooms/${roomId}/quizzes/${id}/attempt`);
  };

  const handleCreateQuiz = () => {
    router.push(`/rooms/${roomId}/quizzes/create`);
  };

  const handleClearSearch = () => {
    router.push(`/rooms/${roomId}/quizzes`);
  };

  const handleClearFilter = () => {
    router.push(`/rooms/${roomId}/quizzes`);
  };

  const isEmpty = filteredQuizzes.length === 0;
  const hasSearchTerm = searchTerm.trim().length > 0;
  const hasActiveFilter = activeFilter !== "all";

  if (isEmpty) {
    return (
      <div className="flex-1 overflow-y-auto flex items-center justify-center">
        {hasSearchTerm ? (
          <NoSearchResults
            searchTerm={searchTerm}
            onClearSearch={handleClearSearch}
          />
        ) : hasActiveFilter ? (
          <EmptyFilterResults
            filterType={activeFilter}
            onClearFilter={handleClearFilter}
          />
        ) : (
          <EmptyQuizzes
            isInstructor={isInstructor}
            onCreateFirst={isInstructor ? handleCreateQuiz : undefined}
          />
        )}
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4 space-y-4">
      {filteredQuizzes.map((quiz) => (
        <QuizCard
          key={quiz.id}
          quiz={quiz}
          onViewDetails={handleViewDetails}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onStartQuiz={handleStartQuiz}
        />
      ))}
    </div>
  );
}
