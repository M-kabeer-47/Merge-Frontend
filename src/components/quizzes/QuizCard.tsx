import { useState } from "react";
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
  AlertCircle,
  Timer,
  Users,
} from "lucide-react";
import type { Quiz, StudentQuiz } from "@/types/quiz";
import { isInstructorQuiz, isStudentQuiz } from "@/types/quiz";
import { Button } from "@/components/ui/Button";
import DropdownMenu from "@/components/ui/Dropdown";
import Icon from "@/components/ui/Icon";

interface QuizCardProps {
  quiz: Quiz;
  isInstructor?: boolean;
  bgColor?: string;
  onViewDetails?: (id: string) => void;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onStartQuiz?: (id: string) => void;
  onReviewQuiz?: (id: string) => void;
}

export default function QuizCard({
  quiz,
  isInstructor = false,
  bgColor,
  onViewDetails,
  onEdit,
  onDelete,
  onStartQuiz,
  onReviewQuiz,
}: QuizCardProps) {
  const [showMenu, setShowMenu] = useState(false);

  const isClosed = quiz.isClosed;
  const isOverdue = new Date() > new Date(quiz.deadline);

  const cardBgColor = bgColor || "bg-background";

  // Status configuration for student view
  const getStudentStatusConfig = (status: StudentQuiz["submissionStatus"]) => {
    if (status === "graded") {
      return {
        icon: CheckCircle2,
        iconFill: "#10b981",
        textColor: "text-success",
        bgColor: "bg-success/10",
        text: "Graded",
      };
    }
    if (status === "missed" || (isOverdue && status === "pending")) {
      return {
        icon: XCircle,
        iconFill: "#ef4444",
        textColor: "text-destructive",
        bgColor: "bg-destructive/10",
        text: "Missed",
      };
    }
    // pending
    return {
      icon: AlertCircle,
      iconFill: "#e69a29",
      textColor: "text-accent",
      bgColor: "bg-accent/10",
      text: "Pending",
    };
  };

  // Format date
  const formatDeadline = (date: Date) => {
    const deadline = new Date(date);
    const now = new Date();
    const diffMs = deadline.getTime() - now.getTime();
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffDays < 0) {
      return `Ended ${Math.abs(diffDays)} day${
        Math.abs(diffDays) !== 1 ? "s" : ""
      } ago`;
    }
    if (diffDays === 0) {
      return "Due today";
    }
    if (diffDays === 1) {
      return "Due tomorrow";
    }
    if (diffDays <= 7) {
      return `Due in ${diffDays} days`;
    }

    return deadline.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year:
        deadline.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
    });
  };

  // Dropdown menu options
  const getMenuOptions = () => {
    if (isInstructor) {
      return [
        {
          title: "View Responses",
          icon: <Eye className="w-4 h-4" />,
          action: () => onViewDetails?.(quiz.id),
        },
        {
          title: "Edit Quiz",
          icon: <Edit className="w-4 h-4" />,
          action: () => onEdit?.(quiz.id),
        },
        {
          title: "Delete",
          icon: <Trash2 className="w-4 h-4" />,
          action: () => onDelete?.(quiz.id),
          destructive: true,
        },
      ];
    }
    return [
      {
        title: "View Details",
        icon: <Eye className="w-4 h-4" />,
        action: () => onViewDetails?.(quiz.id),
      },
    ];
  };

  return (
    <div
      className={`relative border-2 border-primary/20 shadow-lg rounded-2xl overflow-hidden ${cardBgColor} hover:shadow-xl hover:scale-[1.02] transition-all duration-300 group`}
    >
      <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-primary via-secondary to-accent" />

      <div className="relative p-6">
        <div className="flex items-start justify-between mb-4 -mx-6 -mt-6 px-6 pt-6 pb-4 bg-gradient-to-r from-secondary/5 to-transparent border-b border-primary/10">
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-3 mb-1">
              <h3 className="text-lg font-bold text-heading truncate flex-1">
                {quiz.title}
              </h3>

              {!isInstructor && isStudentQuiz(quiz) && (
                <>
                  {(() => {
                    const statusConfig = getStudentStatusConfig(
                      quiz.submissionStatus
                    );
                    const StatusIcon = statusConfig.icon;
                    return (
                      <div
                        className={`flex items-center gap-1 w-[110px] rounded-full py-1.5 ${statusConfig.bgColor} justify-center`}
                      >
                        <StatusIcon
                          className="w-5 h-5 text-white"
                          fill={statusConfig.iconFill}
                        />
                        <span
                          className={`${statusConfig.textColor} font-medium text-sm whitespace-nowrap`}
                        >
                          {statusConfig.text}
                        </span>
                      </div>
                    );
                  })()}
                </>
              )}

              {isInstructor && (
                <div className="relative flex-shrink-0">
                  <button
                    onClick={() => setShowMenu(!showMenu)}
                    className="p-1.5 rounded hover:bg-gray-100 transition-colors text-para-muted"
                  >
                    <MoreVertical className="w-5 h-5" />
                  </button>

                  {showMenu && (
                    <div className="absolute right-0 top-8 z-10">
                      <DropdownMenu
                        options={getMenuOptions()}
                        onClose={() => setShowMenu(false)}
                        align="right"
                      />
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="flex items-center gap-3 flex-wrap text-sm text-para-muted py-2">
              <span className="flex items-center gap-1">
                <Icon src="/icons/trophy.jpg" alt="Trophy" />
                {quiz.totalPoints} points
              </span>
              <span className="flex items-center gap-1">
                <Icon src="/icons/timer.png" alt="Timer" />
                {quiz.timeLimitMin} min
              </span>
              <span className="flex items-center gap-1">
                <Icon src="/icons/question.png" alt="Questions" />
                {quiz.questions.length} question
                {quiz.questions.length !== 1 ? "s" : ""}
              </span>

              {/* Show score for student if completed */}
              {!isInstructor &&
                isStudentQuiz(quiz) &&
                quiz.submissionStatus === "graded" &&
                quiz.attempt.score !== undefined && (
                  <span className="flex items-center gap-1 text-secondary font-semibold">
                    <CheckCircle2
                      className="w-4 h-4 text-white"
                      fill="#8668c0"
                    />
                    {quiz.attempt.score}/{quiz.totalPoints}
                  </span>
                )}
            </div>
          </div>
        </div>

        {/* Status & Info Row */}
        <div className="flex items-center justify-between flex-wrap gap-3 mt-4">
          {/* Left side - Status info */}
          <div className="flex items-center gap-3 flex-wrap">
            {isInstructor && isInstructorQuiz(quiz) && (
              <>
                {/* Submission stats for instructor */}
                <div className="flex items-center gap-1.5 text-primary font-medium text-sm">
                  <Users className="w-4 h-4" />
                  <span>
                    {quiz.attempts}/{quiz.totalAttempts} attempted
                  </span>
                </div>
                {isClosed && (
                  <div className="flex items-center gap-1.5 text-para-muted font-medium text-sm">
                    <XCircle className="w-4 h-4" />
                    <span>Closed</span>
                  </div>
                )}
              </>
            )}

            {!isInstructor && (
              <span className="flex items-center gap-1.5 text-sm text-para-muted">
                <Clock className="w-4 h-4" />
                {formatDeadline(quiz.deadline)}
              </span>
            )}
          </div>

          {/* Right side - Action button */}
          <div>
            {isInstructor ? (
              <Button
                variant="default"
                size="sm"
                onClick={() => onViewDetails?.(quiz.id)}
                className="text-xs px-3 py-1.5"
              >
                <Eye className="w-4 h-4" />
                View Details
              </Button>
            ) : (
              (() => {
                // Determine the button state for students
                const isGraded =
                  isStudentQuiz(quiz) && quiz.submissionStatus === "graded";
                const isMissed =
                  isStudentQuiz(quiz) &&
                  (quiz.submissionStatus === "missed" ||
                    (isOverdue && quiz.submissionStatus === "pending"));

                if (isGraded) {
                  return (
                    <Button
                      variant="default"
                      size="sm"
                      onClick={() => onReviewQuiz?.(quiz.id)}
                      className="text-xs px-3 py-1.5"
                    >
                      <Eye className="w-4 h-4" />
                      Review Quiz
                    </Button>
                  );
                }

                if (isMissed) {
                  return (
                    <Button
                      variant="outline"
                      size="sm"
                      disabled
                      className="text-xs px-3 py-1.5 opacity-50 cursor-not-allowed"
                    >
                      <XCircle className="w-4 h-4" />
                      Missed
                    </Button>
                  );
                }

                return (
                  <Button
                    variant="default"
                    size="sm"
                    onClick={() => onStartQuiz?.(quiz.id)}
                    className="text-xs px-3 py-1.5"
                  >
                    <FileText className="w-4 h-4" />
                    Attempt Quiz
                  </Button>
                );
              })()
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
