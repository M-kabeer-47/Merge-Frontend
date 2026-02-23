import { useState } from "react";
import { MoreVertical, Eye, Edit, Trash2, CheckCircle2 } from "lucide-react";
import type { Quiz } from "@/types/quiz";
import { isStudentQuiz } from "@/types/quiz";
import DropdownMenu from "@/components/ui/Dropdown";
import Icon from "@/components/ui/Icon";
import { getStudentStatusConfig } from "./utils";

interface QuizCardHeaderProps {
  quiz: Quiz;
  isInstructor: boolean;
  isOverdue: boolean;
  onViewDetails?: (id: string) => void;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}

export default function QuizCardHeader({
  quiz,
  isInstructor,
  isOverdue,
  onViewDetails,
  onEdit,
  onDelete,
}: QuizCardHeaderProps) {
  const [showMenu, setShowMenu] = useState(false);

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
    <div className="flex items-start justify-between mb-4 -mx-6 -mt-6 px-6 pt-6 pb-4 bg-gradient-to-r from-secondary/5 to-transparent border-b border-primary/10">
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-3 mb-1">
          <h3 className="text-lg font-bold text-heading truncate flex-1">
            {quiz.title}
          </h3>

          {!isInstructor && isStudentQuiz(quiz) && (() => {
            const statusConfig = getStudentStatusConfig(
              quiz.submissionStatus,
              isOverdue,
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
  );
}
