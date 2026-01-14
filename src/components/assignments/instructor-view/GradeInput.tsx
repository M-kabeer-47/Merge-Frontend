"use client";

import { useState, useEffect } from "react";
import { Check } from "lucide-react";

interface GradeInputProps {
  score: number | null;
  totalScore: number;
  onChange: (newScore: number | null) => void;
  disabled?: boolean;
}

export default function GradeInput({
  score,
  totalScore,
  onChange,
  disabled = false,
}: GradeInputProps) {
  const [value, setValue] = useState<string>(score?.toString() ?? "");
  const [error, setError] = useState<string | null>(null);

  // Sync state with props when the server data changes
  useEffect(() => {
    setValue(score?.toString() ?? "");
  }, [score]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    setError(null);

    // If empty, report null score
    if (inputValue === "") {
      setValue("");
      onChange(null);
      return;
    }

    const numValue = parseFloat(inputValue);

    // Check if valid number
    if (isNaN(numValue)) {
      setValue(inputValue);
      setError("Invalid number");
      return;
    }

    // Clamp negative to 0
    if (numValue < 0) {
      setValue("0");
      onChange(0);
      return;
    }

    // Clamp to max score
    if (numValue > totalScore) {
      setValue(totalScore.toString());
      onChange(totalScore);
      return;
    }

    // Valid score, use it
    setValue(inputValue);
    onChange(numValue);
  };

  const hasChanged = value !== (score?.toString() ?? "");

  return (
    <div className="flex items-center gap-2">
      <div className="relative">
        <input
          type="number"
          value={value}
          onChange={handleChange}
          disabled={disabled}
          max={totalScore}
          placeholder="-"
          className={`
            w-20 px-3 py-2 text-right font-medium rounded-md border 
            focus:outline-none focus:ring-2 transition-all
            disabled:opacity-50 disabled:cursor-not-allowed
            [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none
            ${
              error
                ? "border-error/50 text-error bg-error/5 focus:border-error focus:ring-error/20"
                : hasChanged
                ? "border-secondary/50 text-secondary bg-secondary/5 focus:border-secondary focus:ring-secondary/20"
                : "border-light-border bg-background focus:bg-background focus:border-primary focus:ring-primary/20"
            }
          `}
        />
      </div>

      <span className="text-para-muted font-medium select-none">
        / {totalScore}
      </span>

      {hasChanged && !error && (
        <div className="text-secondary animate-in fade-in zoom-in duration-300 ml-1">
          <Check className="w-4 h-4" />
        </div>
      )}
    </div>
  );
}
