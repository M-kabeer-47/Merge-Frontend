"use client";

import { type Control, Controller, FieldErrors } from "react-hook-form";
import { FormField } from "@/components/ui/FormField";
import { Input } from "@/components/ui/Input";
import type { CreateQuizFormData } from "@/schemas/quiz/create-quiz";

interface BasicInfoSectionProps {
  control: Control<CreateQuizFormData>;
  errors: FieldErrors<CreateQuizFormData>;
  isDisabled?: boolean;
}

export default function BasicInfoSection({
  control,
  errors,
  isDisabled = false,
}: BasicInfoSectionProps) {
  return (
    <div className="bg-background border border-light-border rounded-xl p-6 space-y-6">
      <h2 className="text-lg font-semibold text-heading font-raleway">
        Quiz Details
      </h2>

      {/* Title */}
      <Controller
        name="title"
        control={control}
        render={({ field }) => (
          <FormField
            label="Quiz Title"
            htmlFor="title"
            error={errors.title?.message}
          >
            <Input
              {...field}
              id="title"
              placeholder="e.g., JavaScript Fundamentals Quiz"
              error={errors.title?.message}
              disabled={isDisabled}
              maxLength={200}
            />
            <p className="text-xs text-para-muted mt-1.5">
              {field.value?.length || 0}/200 characters
            </p>
          </FormField>
        )}
      />
    </div>
  );
}
