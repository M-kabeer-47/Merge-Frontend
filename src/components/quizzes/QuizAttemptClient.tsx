"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import useAttemptQuiz from "@/hooks/quizzes/use-attempt-quiz";
import type { Quiz } from "@/types/quiz";
import QuizAttemptHeader from "./attempt/QuizAttemptHeader";
import QuizQuestionDisplay from "./attempt/QuizQuestionDisplay";
import QuizAnswerOptions from "./attempt/QuizAnswerOptions";
import QuizNavigationButtons from "./attempt/QuizNavigationButtons";
import QuizNavigatorSidebar from "./attempt/QuizNavigatorSidebar";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import QuizCompletionScreen from "./attempt/QuizCompletionScreen";

interface QuizAttemptClientProps {
  quiz: Quiz;
}

export default function QuizAttemptClient({ quiz }: QuizAttemptClientProps) {
  const router = useRouter();
  const params = useParams();
  const roomId = params?.id as string;
  const quizId = params?.quizId as string;

  // State
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [timeRemaining, setTimeRemaining] = useState(quiz.timeLimitMin * 60);
  const [showConfirmSubmit, setShowConfirmSubmit] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const { attemptQuiz, isSubmitting, result } = useAttemptQuiz({
    onSuccess: () => {
      setIsSubmitted(true);
    },
  });

  // Submit quiz
  const handleSubmit = async () => {
    setShowConfirmSubmit(false);
    await attemptQuiz({
      quizId,
      roomId,
      answers,
    });
  };

  // Timer countdown
  useEffect(() => {
    if (isSubmitted || timeRemaining <= 0) return;

    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isSubmitted, timeRemaining, handleSubmit]);

  // Handlers
  const handleAnswerSelect = (option: string) => {
    setAnswers((prev) => ({
      ...prev,
      [quiz.questions[currentQuestionIndex].id]: option,
    }));
  };

  const goToQuestion = (index: number) => {
    if (index >= 0 && index < quiz.questions.length) {
      setCurrentQuestionIndex(index);
    }
  };

  const handleExit = () => {
    if (!isSubmitted && Object.keys(answers).length > 0) {
      if (
        confirm("Are you sure you want to exit? Your progress will be lost.")
      ) {
        router.push(`/rooms/${roomId}/quizzes`);
      }
    } else {
      router.push(`/rooms/${roomId}/quizzes`);
    }
  };

  // Show completion screen after submission
  if (isSubmitted && result) {
    return (
      <QuizCompletionScreen
        result={result}
        quizTitle={quiz.title}
        onExit={handleExit}
      />
    );
  }

  const currentQuestion = quiz.questions[currentQuestionIndex];

  return (
    <div className="min-h-screen bg-main-background flex flex-col">
      <QuizAttemptHeader
        quizTitle={quiz.title}
        currentQuestionIndex={currentQuestionIndex}
        totalQuestions={quiz.questions.length}
        timeRemaining={timeRemaining}
        backHref={`/rooms/${roomId}/quizzes`}
      />

      <main className="flex-1 flex flex-col lg:flex-row">
        {/* Question Display */}
        <div className="flex-1 p-4 sm:p-6 lg:p-8">
          <div className="max-w-2xl mx-auto">
            <QuizQuestionDisplay
              question={currentQuestion}
              questionNumber={currentQuestionIndex + 1}
            />

            <QuizAnswerOptions
              options={currentQuestion.options}
              selectedAnswer={answers[currentQuestion.id]}
              onSelectAnswer={handleAnswerSelect}
            />

            <QuizNavigationButtons
              currentQuestionIndex={currentQuestionIndex}
              totalQuestions={quiz.questions.length}
              isSubmitting={isSubmitting}
              onPrevious={() => goToQuestion(currentQuestionIndex - 1)}
              onNext={() => goToQuestion(currentQuestionIndex + 1)}
              onSubmit={() => setShowConfirmSubmit(true)}
            />
          </div>
        </div>

        <QuizNavigatorSidebar
          questions={quiz.questions}
          currentQuestionIndex={currentQuestionIndex}
          answers={answers}
          isSubmitting={isSubmitting}
          onQuestionSelect={goToQuestion}
          onSubmit={() => setShowConfirmSubmit(true)}
        />
      </main>

      <ConfirmDialog
        isOpen={showConfirmSubmit}
        onClose={() => setShowConfirmSubmit(false)}
        onConfirm={handleSubmit}
        title="Submit Quiz"
        message={
          Object.keys(answers).length < quiz.questions.length
            ? `You have ${
                quiz.questions.length - Object.keys(answers).length
              } unanswered questions. Are you sure you want to submit`
            : "Once submitted, you cannot change your answers. Are you sure you want to submit"
        }
        itemName="this quiz"
        confirmText="Submit"
        cancelText="Cancel"
        isLoading={isSubmitting}
        variant="default"
      />
    </div>
  );
}
