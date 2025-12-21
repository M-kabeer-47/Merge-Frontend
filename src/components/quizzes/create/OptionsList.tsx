"use client";

import { type Control, Controller, useWatch } from "react-hook-form";
import { Button } from "@/components/ui/Button";
import { Plus, AlertCircle } from "lucide-react";
import type { CreateQuizFormData } from "@/schemas/quiz/create-quiz";
import OptionItem from "./OptionItem";

interface OptionsListProps {
  control: Control<CreateQuizFormData>;
  qIndex: number;
  isDisabled: boolean;
  errors: any;
}

export default function OptionsList({
  control,
  qIndex,
  isDisabled,
  errors,
}: OptionsListProps) {
  // Watch the current options array directly
  const options = useWatch({
    control,
    name: `questions.${qIndex}.options`,
  }) as string[] | undefined;

  const optionsCount = options?.length ?? 0;

  return (
    <div className="space-y-4">
      <div className="space-y-3">
        {options?.map((_, optIndex) => (
          <OptionItem
            key={optIndex}
            control={control}
            qIndex={qIndex}
            optIndex={optIndex}
            isDisabled={isDisabled}
            optionsCount={optionsCount}
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
