"use client";

import { useState } from "react";
import {
  type Control,
  Controller,
  FieldErrors,
  useFieldArray,
  useWatch,
} from "react-hook-form";
import { FormField } from "@/components/ui/FormField";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import {
  Plus,
  Trash2,
  GripVertical,
  CheckCircle2,
  Circle,
  AlertCircle,
  X,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import type { CreateQuizFormData } from "@/schemas/quiz/create-quiz";

interface QuestionsSectionProps {
  control: Control<CreateQuizFormData>;
  errors: FieldErrors<CreateQuizFormData>;
  isDisabled?: boolean;
}

export default function QuestionsSection({
  control,
  errors,
  isDisabled = false,
}: QuestionsSectionProps) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: "questions",
  });

  const [expandedQuestions, setExpandedQuestions] = useState<Set<number>>(
    new Set([0])
  );

  const toggleQuestion = (index: number) => {
    setExpandedQuestions((prev) => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  };

  const addNewQuestion = () => {
    const newIndex = fields.length;
    append({
      text: "",
      options: ["", "", "", ""], // Start with 4 empty options
      correctOption: "",
      points: 1,
    });
    setExpandedQuestions((prev) => new Set([...prev, newIndex]));
  };

  const removeQuestion = (index: number) => {
    remove(index);
    setExpandedQuestions((prev) => {
      const next = new Set(prev);
      next.delete(index);
      // Adjust indices for questions after the removed one
      const adjusted = new Set<number>();
      next.forEach((i) => {
        if (i > index) {
          adjusted.add(i - 1);
        } else {
          adjusted.add(i);
        }
      });
      return adjusted;
    });
  };

  return (
    <div className="bg-main-background border border-light-border rounded-xl p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-heading font-raleway">
            Questions
          </h2>
          <p className="text-sm text-para-muted mt-1">
            Add questions to your quiz. Each question starts with 4 options.
          </p>
        </div>
        <div className="text-sm text-para-muted text-right">
          {fields.length} question{fields.length !== 1 ? "s" : ""}
        </div>
      </div>

      {/* Error for questions array */}
      {errors.questions?.message && (
        <div className="flex items-center gap-2 text-destructive text-sm bg-destructive/10 border border-destructive/20 rounded-lg p-3">
          <AlertCircle className="w-4 h-4" />
          {errors.questions.message}
        </div>
      )}

      {/* Questions List */}
      <div className="flex flex-col gap-6">
        {fields.map((field, qIndex) => {
          const isExpanded = expandedQuestions.has(qIndex);
          const questionErrors = errors.questions?.[qIndex];

          return (
            <div
              key={field.id}
              className="border border-light-border rounded-xl overflow-hidden bg-background flex flex-col h-fit hover:shadow-md transition-all duration-200"
            >
              {/* Question Header - Using div instead of button to avoid nesting */}
              <div
                className="w-full flex items-center justify-between p-4 bg-secondary/5 transition-colors cursor-pointer"
                onClick={() => toggleQuestion(qIndex)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    toggleQuestion(qIndex);
                  }
                }}
              >
                <div className="flex items-center gap-3">
                  <GripVertical className="w-4 h-4 text-para-muted" />
                  <span className="text-sm font-medium text-heading">
                    Question {qIndex + 1}
                  </span>
                  {questionErrors && (
                    <AlertCircle className="w-4 h-4 text-destructive" />
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <Controller
                    name={`questions.${qIndex}.points`}
                    control={control}
                    render={({ field: pointsField }) => (
                      <span className="text-xs text-para-muted bg-secondary/10 px-2 py-1 rounded">
                        {pointsField.value || 1} pt
                        {(pointsField.value || 1) !== 1 ? "s" : ""}
                      </span>
                    )}
                  />
                  {/* Delete button - now NOT nested inside a button */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeQuestion(qIndex);
                    }}
                    disabled={isDisabled || fields.length <= 1}
                    className="p-1.5 rounded text-para-muted hover:text-destructive hover:bg-destructive/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Delete question"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Expanded Question Content */}
              {isExpanded && (
                <div className="p-4 space-y-4 border-t border-light-border flex-1">
                  {/* Question Text */}
                  <Controller
                    name={`questions.${qIndex}.text`}
                    control={control}
                    render={({ field }) => (
                      <FormField
                        label="Question Text"
                        htmlFor={`question-${qIndex}-text`}
                        error={questionErrors?.text?.message}
                      >
                        <Textarea
                          {...field}
                          id={`question-${qIndex}-text`}
                          placeholder="Enter your question here..."
                          error={questionErrors?.text?.message}
                          disabled={isDisabled}
                          maxLength={500}
                          className="min-h-[100px] text-base resize-y"
                        />
                      </FormField>
                    )}
                  />

                  {/* Options Section */}
                  <div className="space-y-3">
                    <label className="text-sm font-medium text-heading">
                      Answer Options
                    </label>
                    <p className="text-xs text-para-muted -mt-1">
                      Click circle to mark correct. Minimum 2 options required.
                    </p>

                    <OptionsList
                      control={control}
                      qIndex={qIndex}
                      isDisabled={isDisabled}
                      errors={questionErrors}
                    />
                  </div>

                  {/* Points */}
                  <div className="pt-2">
                    <Controller
                      name={`questions.${qIndex}.points`}
                      control={control}
                      render={({ field }) => (
                        <FormField
                          label="Points"
                          htmlFor={`question-${qIndex}-points`}
                          error={questionErrors?.points?.message}
                          className="w-24"
                        >
                          <Input
                            {...field}
                            id={`question-${qIndex}-points`}
                            type="number"
                            min={1}
                            max={100}
                            placeholder="1"
                            error={questionErrors?.points?.message}
                            disabled={isDisabled}
                            onChange={(e) =>
                              field.onChange(Number(e.target.value) || 1)
                            }
                          />
                        </FormField>
                      )}
                    />
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {/* Add Question Button */}
        <div>
          <Button
            type="button"
            variant="outline"
            onClick={addNewQuestion}
            disabled={isDisabled || fields.length >= 50}
            className="w-full h-12 border-dashed border-2 hover:border-secondary/50 hover:bg-secondary/5"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add Another Question
          </Button>
        </div>
      </div>
    </div>
  );
}

// Sub-component for dynamic options list
function OptionsList({
  control,
  qIndex,
  isDisabled,
  errors,
}: {
  control: Control<CreateQuizFormData>;
  qIndex: number;
  isDisabled: boolean;
  errors: any;
}) {
  // Watch the current options array directly
  const options = useWatch({
    control,
    name: `questions.${qIndex}.options`,
  }) as string[] | undefined;

  // Watch the correct option value
  const correctOption = useWatch({
    control,
    name: `questions.${qIndex}.correctOption`,
  }) as string | undefined;

  const optionsCount = options?.length ?? 0;

  return (
    <div className="space-y-4">
      <div className="space-y-3">
        {options?.map((_, optIndex) => (
          <Controller
            key={optIndex}
            name={`questions.${qIndex}.options.${optIndex}`}
            control={control}
            render={({ field: optionField }) => {
              const isCorrect =
                correctOption === optionField.value && optionField.value !== "";

              return (
                <div className="flex items-center gap-3 group relative">
                  {/* Selection Circle */}
                  <Controller
                    name={`questions.${qIndex}.correctOption`}
                    control={control}
                    render={({ field: correctField }) => (
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
                          <CheckCircle2
                            className="w-5 h-5"
                            fill="currentColor"
                          />
                        ) : (
                          <Circle className="w-5 h-5" />
                        )}
                      </button>
                    )}
                  />

                  {/* Option Input */}
                  <div className="flex-1 relative">
                    <Controller
                      name={`questions.${qIndex}.correctOption`}
                      control={control}
                      render={({ field: correctField }) => (
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
                            // If this option was the correct answer, update correctOption
                            if (correctField.value === optionField.value) {
                              correctField.onChange(e.target.value);
                            }
                            optionField.onChange(e);
                          }}
                        />
                      )}
                    />

                    {/* Delete Option Button - only show if more than 2 options */}
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
                </div>
              );
            }}
          />
        ))}
      </div>

      {/* Add Option Button */}
      <div>
        {optionsCount < 10 && (
          <Controller
            name={`questions.${qIndex}.options`}
            control={control}
            render={({ field: optionsField }) => (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  const currentOptions = optionsField.value as string[];
                  optionsField.onChange([...currentOptions, ""]);
                }}
                disabled={isDisabled}
                className="w-[200px] border-dashed border-light-border text-para-muted hover:text-primary hover:border-primary/30 hover:bg-primary/5"
              >
                <Plus className="w-3 h-3 mr-1.5" />
                Add Another Option
              </Button>
            )}
          />
        )}

        {/* Correct answer error */}
        {errors?.correctOption?.message && (
          <p className="text-destructive text-xs mt-2 font-medium flex items-center gap-1.5">
            <AlertCircle className="w-3 h-3" />
            {errors.correctOption.message}
          </p>
        )}

        {errors?.options?.message && (
          <p className="text-destructive text-xs mt-2 font-medium flex items-center gap-1.5">
            <AlertCircle className="w-3 h-3" />
            {errors.options.message}
          </p>
        )}
      </div>
    </div>
  );
}
