interface QuizAnswerOptionsProps {
  options: string[];
  selectedAnswer?: string;
  onSelectAnswer?: (option: string) => void;
  // Review mode props
  isReviewMode?: boolean;
  correctOption?: string;
}

export default function QuizAnswerOptions({
  options,
  selectedAnswer,
  onSelectAnswer,
  isReviewMode = false,
  correctOption,
}: QuizAnswerOptionsProps) {
  return (
    <div className="space-y-3">
      {options.map((option, index) => {
        const isSelected = selectedAnswer === option;
        const optionLetter = String.fromCharCode(65 + index);
        const isCorrectAnswer = option === correctOption;
        const isWrongUserAnswer =
          isReviewMode && isSelected && !isCorrectAnswer;

        // Determine styling based on mode
        let borderClass = "border-light-border";
        let bgClass = "";
        let circleClass = "bg-secondary/10 text-secondary";
        let textClass = "text-heading";

        if (isReviewMode) {
          // Review mode styling
          if (isCorrectAnswer) {
            borderClass = "border-success";
            bgClass = "bg-success/10";
            circleClass = "bg-success text-white";
            textClass = "text-success";
          } else if (isWrongUserAnswer) {
            borderClass = "border-destructive";
            bgClass = "bg-destructive/10";
            circleClass = "bg-destructive text-white";
            textClass = "text-destructive";
          }
        } else {
          // Attempt mode styling
          if (isSelected) {
            borderClass = "border-secondary";
            bgClass = "bg-secondary/5 shadow-md";
            circleClass = "bg-secondary text-white";
          } else {
            borderClass =
              "border-light-border hover:border-secondary/30 hover:bg-secondary/5";
          }
        }

        const Component = isReviewMode ? "div" : "button";

        return (
          <Component
            key={index}
            onClick={isReviewMode ? undefined : () => onSelectAnswer?.(option)}
            className={`w-full text-left p-4 rounded-xl border-2 transition-all ${borderClass} ${bgClass} ${
              isReviewMode ? "cursor-default" : ""
            }`}
          >
            <div className="flex items-center gap-4">
              <span
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${circleClass}`}
              >
                {optionLetter}
              </span>
              <span className={`flex-1 font-medium ${textClass}`}>
                {option}
              </span>

              {/* Review mode labels */}
              {isReviewMode && isCorrectAnswer && (
                <span className="text-xs font-medium text-success">
                  Correct Answer
                </span>
              )}
              {isReviewMode && isWrongUserAnswer && (
                <span className="text-xs font-medium text-destructive">
                  Your Answer
                </span>
              )}
            </div>
          </Component>
        );
      })}
    </div>
  );
}
