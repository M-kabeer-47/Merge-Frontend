interface QuizAnswerOptionsProps {
  options: string[];
  selectedAnswer?: string;
  onSelectAnswer: (option: string) => void;
}

export default function QuizAnswerOptions({
  options,
  selectedAnswer,
  onSelectAnswer,
}: QuizAnswerOptionsProps) {
  return (
    <div className="space-y-3">
      {options.map((option, index) => {
        const isSelected = selectedAnswer === option;
        const optionLetter = String.fromCharCode(65 + index);

        return (
          <button
            key={index}
            onClick={() => onSelectAnswer(option)}
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
  );
}
