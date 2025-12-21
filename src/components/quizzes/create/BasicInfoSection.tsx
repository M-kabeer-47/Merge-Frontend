"use client";

import {
  type Control,
  Controller,
  FieldErrors,
  UseFormRegister,
} from "react-hook-form";
import { FormField } from "@/components/ui/FormField";
import { Input } from "@/components/ui/Input";
import type { CreateQuizFormData } from "@/schemas/quiz/create-quiz";

interface BasicInfoSectionProps {
  errors: FieldErrors<CreateQuizFormData>;
  isDisabled?: boolean;
  register: UseFormRegister<CreateQuizFormData>;
  title: string;
}

export default function BasicInfoSection({
  register,
  title,
  errors,
  isDisabled = false,
}: BasicInfoSectionProps) {
  return (
    <div className="bg-background border border-light-border rounded-xl p-6 space-y-6">
      <h2 className="text-lg font-semibold text-heading font-raleway">
        Quiz Details
      </h2>

      {/* Title */}
      <FormField
        label="Quiz Title"
        htmlFor="title"
        error={errors.title?.message}
      >
        <Input
          id="title"
          placeholder="e.g., JavaScript Fundamentals Quiz"
          error={errors.title?.message}
          disabled={isDisabled}
          maxLength={200}
          {...register("title")}
        />

        <p className="text-xs text-para-muted mt-1.5">
          {title.length || 0}/200 characters
        </p>
      </FormField>
    </div>
  );
}
