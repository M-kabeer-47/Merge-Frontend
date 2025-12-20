"use client";

import { type Control, Controller, FieldErrors } from "react-hook-form";
import { FormField } from "@/components/ui/FormField";
import { Input } from "@/components/ui/Input";
import DateTimePicker from "@/components/ui/DateTimePicker";
import { Clock, Calendar } from "lucide-react";
import type { CreateQuizFormData } from "@/schemas/quiz/create-quiz";

interface SettingsSectionProps {
  control: Control<CreateQuizFormData>;
  errors: FieldErrors<CreateQuizFormData>;
  isDisabled?: boolean;
}

export default function SettingsSection({
  control,
  errors,
  isDisabled = false,
}: SettingsSectionProps) {
  return (
    <div className="bg-background border border-light-border rounded-xl p-6 space-y-6">
      <h2 className="text-lg font-semibold text-heading font-raleway">
        Quiz Settings
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Time Limit */}
        <Controller
          name="timeLimitMin"
          control={control}
          render={({ field }) => (
            <FormField
              label="Time Limit (minutes)"
              htmlFor="timeLimitMin"
              error={errors.timeLimitMin?.message}
            >
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-para-muted" />
                <Input
                  {...field}
                  id="timeLimitMin"
                  type="number"
                  min={5}
                  max={180}
                  placeholder="30"
                  className="pl-10"
                  error={errors.timeLimitMin?.message}
                  disabled={isDisabled}
                  onChange={(e) => field.onChange(Number(e.target.value) || "")}
                />
              </div>
              <p className="text-xs text-para-muted mt-1.5">
                Between 5-180 minutes
              </p>
            </FormField>
          )}
        />

        {/* Deadline */}
        <Controller
          name="deadline"
          control={control}
          render={({ field }) => (
            <FormField
              label="Deadline"
              htmlFor="deadline"
              error={errors.deadline?.message}
            >
              <DateTimePicker
                value={field.value || ""}
                onChange={(dateString) => field.onChange(dateString)}
                placeholder="Select deadline"
                minDate={new Date()}
                disabled={isDisabled}
              />
            </FormField>
          )}
        />
      </div>

      {/* Info box */}
      <div className="bg-secondary/5 border border-secondary/20 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <Calendar className="w-5 h-5 text-secondary flex-shrink-0 mt-0.5" />
          <div className="text-sm text-para">
            <p className="font-medium text-secondary mb-1">Auto-graded Quiz</p>
            <p>
              This quiz will be automatically graded when students submit their
              answers. Students can see their score immediately after
              submission.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
