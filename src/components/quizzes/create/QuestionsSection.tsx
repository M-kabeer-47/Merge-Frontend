"use client";

import { useState } from "react";
import { type Control, FieldErrors, useFieldArray } from "react-hook-form";
import { Button } from "@/components/ui/Button";
import { Plus, AlertCircle } from "lucide-react";
import type { CreateQuizFormData } from "@/schemas/quiz/create-quiz";
import QuestionCard from "./QuestionCard";

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
    <div className="bg-background border border-light-border rounded-xl p-6 space-y-6">
      {/* Header */}
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
        {fields.map((field, qIndex) => (
          <QuestionCard
            key={field.id}
            control={control}
            qIndex={qIndex}
            isExpanded={expandedQuestions.has(qIndex)}
            onToggle={() => toggleQuestion(qIndex)}
            onRemove={() => removeQuestion(qIndex)}
            canRemove={fields.length > 1}
            isDisabled={isDisabled}
            errors={errors.questions}
          />
        ))}

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
