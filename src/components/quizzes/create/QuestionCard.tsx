"use client";

import { type Control, Controller, FieldErrors } from "react-hook-form";
import { FormField } from "@/components/ui/FormField";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Trash2, GripVertical, AlertCircle } from "lucide-react";
import type { CreateQuizFormData } from "@/schemas/quiz/create-quiz";
import OptionsList from "./OptionsList";

interface QuestionCardProps {
  control: Control<CreateQuizFormData>;
  qIndex: number;
  isExpanded: boolean;
  onToggle: () => void;
  onRemove: () => void;
  canRemove: boolean;
  isDisabled: boolean;
  errors?: FieldErrors<CreateQuizFormData>["questions"];
}

export default function QuestionCard({
  control,
  qIndex,
  isExpanded,
  onToggle,
  onRemove,
  canRemove,
  isDisabled,
  errors,
}: QuestionCardProps) {
  const questionErrors = errors?.[qIndex];

  return (
    <div className="border border-light-border rounded-xl overflow-hidden bg-background flex flex-col h-fit hover:shadow-md transition-all duration-200">
      {/* Question Header */}
      <div
        className="w-full flex items-center justify-between p-4 bg-secondary/5 transition-colors cursor-pointer"
        onClick={onToggle}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onToggle();
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
          {/* Delete button */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onRemove();
            }}
            disabled={isDisabled || !canRemove}
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
                      field.onChange(
                        e.target.value === "" ? "" : Number(e.target.value)
                      )
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
}
