"use client";

import { type Control, Controller, FieldErrors } from "react-hook-form";
import { FormField } from "@/components/ui/FormField";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";

interface FormData {
  title: string;
  description?: string;
  points: number;
  startAt?: string;
  endAt: string;
  isTurnInLateEnabled: boolean;
}

interface BasicInfoSectionProps {
  control: Control<FormData>;
  errors: FieldErrors<FormData>;
  isDisabled?: boolean;
}

export default function BasicInfoSection({
  control,
  errors,
  isDisabled = false,
}: BasicInfoSectionProps) {
  return (
    <div className="bg-main-background border border-light-border rounded-xl p-6 space-y-6">
      <h2 className="text-lg font-semibold text-heading font-raleway">
        Basic Information
      </h2>

      {/* Title */}
      <Controller
        name="title"
        control={control}
        render={({ field }) => (
          <FormField
            label="Assignment Title"
            htmlFor="title"
            error={errors.title?.message}
          >
            <Input
              {...field}
              id="title"
              placeholder="e.g., React Components Assignment"
              error={errors.title?.message}
              disabled={isDisabled}
              maxLength={50}
            />
            <p className="text-xs text-para-muted mt-1.5">
              {field.value?.length || 0}/50 characters
            </p>
          </FormField>
        )}
      />

      {/* Description */}
      <Controller
        name="description"
        control={control}
        render={({ field }) => (
          <FormField
            label="Description (Optional)"
            htmlFor="description"
            error={errors.description?.message}
          >
            <Textarea
              {...field}
              id="description"
              rows={5}
              placeholder="Provide detailed instructions for the assignment..."
              error={errors.description?.message}
              disabled={isDisabled}
              maxLength={2000}
            />
            <p className="text-xs text-para-muted mt-1.5">
              {field.value?.length || 0}/2000 characters
            </p>
          </FormField>
        )}
      />
    </div>
  );
}
