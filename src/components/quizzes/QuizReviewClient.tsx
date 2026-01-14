"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import type {
  QuizAttemptResult,
  QuizAnswerKeyItem,
} from "@/server-api/quizzes";
import QuizAttemptHeader from "./attempt/QuizAttemptHeader";
import QuizQuestionDisplay from "./attempt/QuizQuestionDisplay";
import QuizAnswerOptions from "./attempt/QuizAnswerOptions";
import QuizNavigatorSidebar from "./attempt/QuizNavigatorSidebar";

interface QuizReviewClientProps {
  attemptData: QuizAttemptResult;
  roomId: string;
}

export default function QuizReviewClient({
  attemptData,
  roomId,
}: QuizReviewClientProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  const questions = attemptData.answerKey;

  const goToQuestion = (index: number) => {
    if (index >= 0 && index < questions.length) {
      setCurrentQuestionIndex(index);
    }
  };

  const currentQuestion = questions[currentQuestionIndex];
  const userAnswer = attemptData.answers?.[currentQuestion.id];

  return (
    <div className="min-h-screen bg-main-background flex flex-col">
      <QuizAttemptHeader
        quizTitle={attemptData.quiz.title}
        currentQuestionIndex={currentQuestionIndex}
        totalQuestions={questions.length}
        isReviewMode={true}
        score={attemptData.score}
        totalScore={attemptData.quiz.totalScore}
        backHref={`/rooms/${roomId}/quizzes`}
      />

      <main className="flex-1 flex flex-col lg:flex-row">
        {/* Question Display */}
        <div className="flex-1 p-4 sm:p-6 lg:p-8">
          <div className="max-w-2xl mx-auto">
            <QuizQuestionDisplay
              question={currentQuestion}
              questionNumber={currentQuestionIndex + 1}
              isReviewMode={true}
              userAnswer={userAnswer}
            />

            <QuizAnswerOptions
              options={currentQuestion.options}
              selectedAnswer={userAnswer}
              isReviewMode={true}
              correctOption={currentQuestion.correctOption}
            />

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between mt-8">
              <Button
                variant="outline"
                onClick={() => goToQuestion(currentQuestionIndex - 1)}
                disabled={currentQuestionIndex === 0}
              >
                Previous
              </Button>

              {currentQuestionIndex === questions.length - 1 ? (
                <Link href={`/rooms/${roomId}/quizzes`}>
                  <Button>Back to Quizzes</Button>
                </Link>
              ) : (
                <Button onClick={() => goToQuestion(currentQuestionIndex + 1)}>
                  Next
                </Button>
              )}
            </div>
          </div>
        </div>

        <QuizNavigatorSidebar
          questions={questions}
          currentQuestionIndex={currentQuestionIndex}
          answers={attemptData.answers || {}}
          onQuestionSelect={goToQuestion}
          isReviewMode={true}
        />
      </main>
    </div>
  );
}
