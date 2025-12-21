"use client";

import {
  type Control,
  Controller,
  useFormContext,
  useWatch,
} from "react-hook-form";
import { Input } from "@/components/ui/Input";
import { CheckCircle2, Circle, X } from "lucide-react";
import type { CreateQuizFormData } from "@/schemas/quiz/create-quiz";

interface OptionItemProps {
  control: Control<CreateQuizFormData>;
  qIndex: number;
  optIndex: number;
  isDisabled: boolean;
  optionsCount: number;
}

export default function OptionItem({
  control,
  qIndex,
  optIndex,
  isDisabled,
  optionsCount,
}: OptionItemProps) {
  // Watch the correct option value for UI highlighting
  const correctOption = useWatch({
    control,
    name: `questions.${qIndex}.correctOption`,
  }) as string | undefined;

  // Watch all options to enable deletion
  const options = useWatch({
    control,
    name: `questions.${qIndex}.options`,
  }) as string[] | undefined;

  return (
    <Controller
      name={`questions.${qIndex}.options.${optIndex}`}
      control={control}
      render={({ field: optionField }) => {
        const isCorrect =
          correctOption === optionField.value && optionField.value !== "";

        return (
          <div className="flex items-center gap-3 group relative">
            {/* Selection Circle - Single Controller for correctOption */}
            <Controller
              name={`questions.${qIndex}.correctOption`}
              control={control}
              render={({ field: correctField }) => (
                <>
                  {/* Circle Button */}
                  <button
                    type="button"
                    onClick={() => {
                      if (optionField.value) {
                        correctField.onChange(optionField.value);
                      }
                    }}
                    disabled={isDisabled || !optionField.value}
                    className={`p-1.5 rounded-full transition-all duration-200 flex-shrink-0 ${
                      isCorrect
                        ? "text-secondary scale-110 bg-secondary/10 ring-2 ring-secondary/20"
                        : "text-para-muted hover:text-secondary hover:bg-secondary/5"
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                    title="Mark as correct answer"
                  >
                    {isCorrect ? (
                      <CheckCircle2 className="w-5 h-5" fill="currentColor" />
                    ) : (
                      <Circle className="w-5 h-5" />
                    )}
                  </button>

                  {/* Option Input - reuses correctField from parent Controller */}
                  <div className="flex-1 relative">
                    <Input
                      {...optionField}
                      placeholder={`Option ${optIndex + 1}`}
                      disabled={isDisabled}
                      className={`pr-10 transition-all ${
                        isCorrect
                          ? "border-secondary bg-secondary/5 shadow-[0_0_0_1px_rgba(139,92,246,0.1)]"
                          : "hover:border-secondary/30"
                      }`}
                      onChange={(e) => {
                        // If editing the correct answer, sync correctOption
                        if (correctField.value === optionField.value) {
                          correctField.onChange(e.target.value);
                        }
                        optionField.onChange(e);
                      }}
                    />

                    {/* Delete Option Button */}
                    {optionsCount > 2 && (
                      <Controller
                        name={`questions.${qIndex}.options`}
                        control={control}
                        render={({ field: optionsField }) => (
                          <button
                            type="button"
                            onClick={() => {
                              const newOptions = [
                                ...(optionsField.value as string[]),
                              ];
                              newOptions.splice(optIndex, 1);
                              optionsField.onChange(newOptions);
                            }}
                            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-para-muted hover:text-destructive hover:bg-destructive/10 rounded-md opacity-0 group-hover:opacity-100 transition-all focus:opacity-100"
                            disabled={isDisabled}
                            title="Remove option"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        )}
                      />
                    )}
                  </div>
                </>
              )}
            />
          </div>
        );
      }}
    />
  );
}
