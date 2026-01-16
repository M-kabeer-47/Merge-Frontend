"use client";

import { Users } from "lucide-react";
import type { QuizAttemptDetail, QuizQuestion } from "@/types/quiz";
import AttemptCard from "./AttemptCard";

interface AttemptsListProps {
  attempts: QuizAttemptDetail[];
  questions: QuizQuestion[];
  totalPoints: number;
}

export default function AttemptsList({
  attempts,
  questions,
  totalPoints,
}: AttemptsListProps) {
  if (attempts.length === 0) {
    return (
      <div className="text-center py-12">
        <Users className="w-12 h-12 text-para-muted mx-auto mb-3 opacity-50" />
        <p className="text-para-muted">
          No submissions yet. Check back later when students have attempted the
          quiz.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {attempts.map((attempt) => (
        <AttemptCard
          key={attempt.id}
          attempt={attempt}
          questions={questions}
          totalPoints={totalPoints}
        />
      ))}
    </div>
  );
}
