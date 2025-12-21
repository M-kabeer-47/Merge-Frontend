"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  Clock,
  AlertCircle,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import useAttemptQuiz from "@/hooks/quizzes/use-attempt-quiz";
import type { Quiz, QuizQuestion } from "@/types/quiz";

// Mock quiz data for development - will be replaced with server fetch
const mockQuiz: Quiz = {
  id: "quiz-1",
  title: "Sample Quiz",
  author: {
    id: "author-1",
    name: "Dr. Smith",
    role: "instructor",
    initials: "DS",
  },
  createdAt: new Date(),
  deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  timeLimitMin: 30,
  status: "published",
  totalPoints: 10,
  questions: [
    {
      id: "q1",
      text: "What is the capital of France?",
      options: ["London", "Berlin", "Paris", "Madrid"],
      correctOption: "Paris",
      points: 2,
    },
    {
      id: "q2",
      text: "Which planet is known as the Red Planet?",
      options: ["Venus", "Mars", "Jupiter", "Saturn"],
      correctOption: "Mars",
      points: 2,
    },
    {
      id: "q3",
      text: "What is 2 + 2?",
      options: ["3", "4", "5", "6"],
      correctOption: "4",
      points: 2,
    },
    {
      id: "q4",
      text: "Who wrote 'Romeo and Juliet'?",
      options: [
        "Charles Dickens",
        "William Shakespeare",
        "Jane Austen",
        "Mark Twain",
      ],
      correctOption: "William Shakespeare",
      points: 2,
    },
    {
      id: "q5",
      text: "What is the largest ocean on Earth?",
      options: [
        "Atlantic Ocean",
        "Indian Ocean",
        "Arctic Ocean",
        "Pacific Ocean",
      ],
      correctOption: "Pacific Ocean",
      points: 2,
    },
  ],
  submissionStats: { attempted: 0, total: 0, averageScore: 0 },
};

export default function QuizAttemptPage() {
  const router = useRouter();
  const params = useParams();
  const roomId = params?.id as string;
  const quizId = params?.quizId as string;

  // State
  const [quiz] = useState<Quiz>(mockQuiz);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [timeRemaining, setTimeRemaining] = useState(quiz.timeLimitMin * 60); // seconds
  const [showConfirmSubmit, setShowConfirmSubmit] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const { attemptQuiz, isSubmitting, result } = useAttemptQuiz({
    onSuccess: () => {
      setIsSubmitted(true);
    },
  });

  const currentQuestion = quiz.questions[currentQuestionIndex];
  const totalQuestions = quiz.questions.length;
  const answeredCount = Object.keys(answers).length;

  // Timer countdown
  useEffect(() => {
    if (isSubmitted || timeRemaining <= 0) return;

    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          // Auto-submit when time runs out
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isSubmitted, timeRemaining]);

  // Format time for display
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  // Get timer color based on remaining time
  const getTimerColor = () => {
    if (timeRemaining <= 60) return "text-destructive";
    if (timeRemaining <= 300) return "text-warning";
    return "text-heading";
  };

  // Handle answer selection
  const handleAnswerSelect = (option: string) => {
    setAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: option,
    }));
  };

  // Navigation
  const goToQuestion = (index: number) => {
    if (index >= 0 && index < totalQuestions) {
      setCurrentQuestionIndex(index);
    }
  };

  const goToNext = () => goToQuestion(currentQuestionIndex + 1);
  const goToPrev = () => goToQuestion(currentQuestionIndex - 1);

  // Submit quiz
  const handleSubmit = useCallback(async () => {
    setShowConfirmSubmit(false);
    await attemptQuiz({
      quizId,
      roomId,
      answers,
    });
  }, [attemptQuiz, quizId, roomId, answers]);

  // Exit to quiz list
  const handleExit = () => {
    if (!isSubmitted && answeredCount > 0) {
      if (
        confirm("Are you sure you want to exit? Your progress will be lost.")
      ) {
        router.push(`/rooms/${roomId}/quizzes`);
      }
    } else {
      router.push(`/rooms/${roomId}/quizzes`);
    }
  };

  // Show results after submission
  if (isSubmitted && result) {
    const percentage = Math.round((result.score / result.totalPoints) * 100);

    return (
      <div className="min-h-screen bg-main-background flex items-center justify-center p-4">
        <div className="bg-background border border-light-border rounded-2xl p-8 max-w-md w-full text-center space-y-6">
          <div className="w-20 h-20 mx-auto rounded-full bg-secondary/10 flex items-center justify-center">
            <CheckCircle2 className="w-10 h-10 text-secondary" />
          </div>

          <div>
            <h1 className="text-2xl font-bold text-heading font-raleway mb-2">
              Quiz Completed!
            </h1>
            <p className="text-para-muted">{quiz.title}</p>
          </div>

          <div className="bg-secondary/5 border border-secondary/20 rounded-xl p-6">
            <div className="text-4xl font-bold text-secondary mb-2">
              {percentage}%
            </div>
            <div className="text-sm text-para-muted">
              {result.score} / {result.totalPoints} points
            </div>
            <div className="text-sm text-para-muted mt-1">
              {result.correctAnswers} / {result.totalQuestions} correct answers
            </div>
          </div>

          <Button onClick={handleExit} className="w-full" size="lg">
            Back to Quizzes
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-main-background flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-20 bg-background/80 backdrop-blur-md border-b border-light-border">
        <div className="px-4 sm:px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={handleExit}
              className="p-2 rounded-lg hover:bg-secondary/10 transition-colors"
            >
              <ChevronLeft className="w-5 h-5 text-heading" />
            </button>
            <div>
              <h1 className="text-lg font-semibold text-heading font-raleway line-clamp-1">
                {quiz.title}
              </h1>
              <p className="text-xs text-para-muted">
                Question {currentQuestionIndex + 1} of {totalQuestions}
              </p>
            </div>
          </div>

          {/* Timer */}
          <div
            className={`flex items-center gap-2 px-4 py-2 rounded-lg bg-background border border-light-border ${getTimerColor()}`}
          >
            <Clock className="w-4 h-4" />
            <span className="font-mono font-bold text-lg">
              {formatTime(timeRemaining)}
            </span>
          </div>
        </div>

        {/* Progress bar */}
        <div className="h-1 bg-secondary/10">
          <div
            className="h-full bg-secondary transition-all duration-300"
            style={{
              width: `${((currentQuestionIndex + 1) / totalQuestions) * 100}%`,
            }}
          />
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col lg:flex-row">
        {/* Question Display */}
        <div className="flex-1 p-4 sm:p-6 lg:p-8">
          <div className="max-w-2xl mx-auto">
            {/* Question */}
            <div className="bg-background border border-light-border rounded-xl p-6 mb-6">
              <div className="flex items-start justify-between mb-4">
                <span className="text-xs font-medium text-secondary bg-secondary/10 px-2 py-1 rounded">
                  {currentQuestion.points}{" "}
                  {currentQuestion.points === 1 ? "point" : "points"}
                </span>
              </div>
              <h2 className="text-xl font-medium text-heading leading-relaxed">
                {currentQuestion.text}
              </h2>
            </div>

            {/* Options */}
            <div className="space-y-3">
              {currentQuestion.options.map((option, index) => {
                const isSelected = answers[currentQuestion.id] === option;
                const optionLetter = String.fromCharCode(65 + index);

                return (
                  <button
                    key={index}
                    onClick={() => handleAnswerSelect(option)}
                    className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                      isSelected
                        ? "border-secondary bg-secondary/5 shadow-md"
                        : "border-light-border hover:border-secondary/30 hover:bg-secondary/5"
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <span
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                          isSelected
                            ? "bg-secondary text-white"
                            : "bg-secondary/10 text-secondary"
                        }`}
                      >
                        {optionLetter}
                      </span>
                      <span className="text-heading font-medium">{option}</span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between mt-8">
              <Button
                variant="outline"
                onClick={goToPrev}
                disabled={currentQuestionIndex === 0}
                className="flex items-center gap-2"
              >
                <ChevronLeft className="w-4 h-4" />
                Previous
              </Button>

              {currentQuestionIndex === totalQuestions - 1 ? (
                <Button
                  onClick={() => setShowConfirmSubmit(true)}
                  disabled={isSubmitting}
                  className="flex items-center gap-2"
                >
                  {isSubmitting ? <LoadingSpinner size="sm" /> : "Submit Quiz"}
                </Button>
              ) : (
                <Button onClick={goToNext} className="flex items-center gap-2">
                  Next
                  <ChevronRight className="w-4 h-4" />
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Question Navigator Sidebar */}
        <aside className="lg:w-72 border-t lg:border-t-0 lg:border-l border-light-border bg-background p-4">
          <h3 className="text-sm font-semibold text-heading mb-4">
            Questions ({answeredCount}/{totalQuestions} answered)
          </h3>
          <div className="grid grid-cols-5 lg:grid-cols-4 gap-2">
            {quiz.questions.map((q, index) => {
              const isAnswered = answers[q.id] !== undefined;
              const isCurrent = index === currentQuestionIndex;

              return (
                <button
                  key={q.id}
                  onClick={() => goToQuestion(index)}
                  className={`w-10 h-10 rounded-lg font-medium text-sm transition-all ${
                    isCurrent
                      ? "bg-secondary text-white ring-2 ring-secondary/30"
                      : isAnswered
                      ? "bg-secondary/20 text-secondary"
                      : "bg-secondary/5 text-para-muted hover:bg-secondary/10"
                  }`}
                >
                  {index + 1}
                </button>
              );
            })}
          </div>

          {/* Submit Button in Sidebar */}
          <div className="mt-6 pt-4 border-t border-light-border">
            <Button
              onClick={() => setShowConfirmSubmit(true)}
              disabled={isSubmitting}
              className="w-full"
              variant={answeredCount === totalQuestions ? "default" : "outline"}
            >
              Submit Quiz
            </Button>
            {answeredCount < totalQuestions && (
              <p className="text-xs text-para-muted mt-2 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {totalQuestions - answeredCount} unanswered
              </p>
            )}
          </div>
        </aside>
      </main>

      {/* Submit Confirmation Modal */}
      {showConfirmSubmit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-charcoal/50 backdrop-blur-sm p-4">
          <div className="bg-background border border-light-border rounded-2xl p-6 max-w-sm w-full space-y-4">
            <h3 className="text-lg font-semibold text-heading">Submit Quiz?</h3>
            <p className="text-para-muted">
              {answeredCount < totalQuestions ? (
                <>
                  You have{" "}
                  <span className="text-warning font-medium">
                    {totalQuestions - answeredCount} unanswered questions
                  </span>
                  . Are you sure you want to submit?
                </>
              ) : (
                "Once submitted, you cannot change your answers."
              )}
            </p>
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setShowConfirmSubmit(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="flex-1"
              >
                {isSubmitting ? <LoadingSpinner size="sm" /> : "Submit"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
