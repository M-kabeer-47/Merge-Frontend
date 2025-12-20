"use client";

import { useState } from "react";
import { Control, Controller, FieldErrors } from "react-hook-form";
import { Award, AlertCircle, Calendar } from "lucide-react";
import { FormField } from "@/components/ui/FormField";
import { Input } from "@/components/ui/Input";
import DateTimePicker from "@/components/ui/DateTimePicker";
import { AnimatePresence, motion } from "framer-motion";

interface FormData {
  title: string;
  description?: string;
  points: number;
  startAt?: string;
  endAt: string;
  isTurnInLateEnabled: boolean;
}

interface SchedulePointsSectionProps {
  control: Control<FormData>;
  errors: FieldErrors<FormData>;
  isDisabled?: boolean;
}

export default function SchedulePointsSection({
  control,
  errors,
  isDisabled = false,
}: SchedulePointsSectionProps) {
  const [isScheduled, setIsScheduled] = useState(false);

  return (
    <div className="bg-main-background border border-light-border rounded-xl p-6 space-y-6">
      <h2 className="text-lg font-semibold text-heading font-raleway">
        Schedule & Points
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Points */}
        <Controller
          name="points"
          control={control}
          render={({ field: { value, onChange, ...field } }) => (
            <FormField
              label="Points"
              htmlFor="points"
              error={errors.points?.message}
            >
              <div className="relative">
                <Award className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-para-muted" />
                <Input
                  {...field}
                  value={value === 0 ? "" : value}
                  id="points"
                  type="number"
                  min={0}
                  max={1000}
                  placeholder="Enter points"
                  className="pl-11"
                  error={errors.points?.message}
                  disabled={isDisabled}
                  onChange={(e) => {
                    const val = e.target.value;
                    onChange(val === "" ? 0 : parseInt(val));
                  }}
                />
              </div>
            </FormField>
          )}
        />

        {/* Due Date */}
        <Controller
          name="endAt"
          control={control}
          render={({ field }) => (
            <FormField
              label="Due Date"
              htmlFor="endAt"
              error={errors.endAt?.message}
            >
              <DateTimePicker
                value={field.value}
                onChange={field.onChange}
                placeholder="Select due date and time"
                disabled={isDisabled}
                minDate={new Date()}
                error={errors.endAt?.message}
              />
            </FormField>
          )}
        />
      </div>

      {/* Schedule Posting Toggle */}
      <div className="bg-background border border-light-border rounded-xl p-4">
        <label className="flex items-center justify-between cursor-pointer">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
              <Calendar className="w-5 h-5 text-secondary" />
            </div>
            <div>
              <p className="text-sm font-medium text-heading">
                Schedule Posting
              </p>
              <p className="text-xs text-para-muted mt-0.5">
                Set a future date to publish this assignment
              </p>
            </div>
          </div>
          <div className="relative">
            <input
              type="checkbox"
              checked={isScheduled}
              onChange={(e) => setIsScheduled(e.target.checked)}
              className="sr-only peer"
              id="schedule-toggle"
              disabled={isDisabled}
            />
            <div className="w-11 h-6 bg-gray-200 rounded-full peer-checked:bg-secondary transition-colors" />
            <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-5 shadow-sm" />
          </div>
        </label>
      </div>

      {/* Start Date - Only shown when Schedule Posting is enabled */}
      <AnimatePresence>
        {isScheduled && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
          >
            <Controller
              name="startAt"
              control={control}
              render={({ field }) => (
                <FormField
                  label="Start Date"
                  htmlFor="startAt"
                  error={errors.startAt?.message}
                >
                  <DateTimePicker
                    value={field.value || ""}
                    onChange={field.onChange}
                    placeholder="Select when to publish the assignment"
                    disabled={isDisabled}
                    minDate={new Date()}
                    error={errors.startAt?.message}
                  />
                  <p className="text-xs text-para-muted mt-1.5">
                    Assignment will be visible to students from this date
                  </p>
                </FormField>
              )}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Allow Late Submissions */}
      <Controller
        name="isTurnInLateEnabled"
        control={control}
        render={({ field: { value, onChange, ...field } }) => (
          <div className="bg-background border border-light-border rounded-xl p-4">
            <label className="flex items-center justify-between cursor-pointer">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <AlertCircle className="w-5 h-5 text-secondary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-heading">
                    Allow Late Submissions
                  </p>
                  <p className="text-xs text-para-muted mt-0.5">
                    Students can submit after the due date
                  </p>
                </div>
              </div>
              <div className="relative">
                <input
                  {...field}
                  type="checkbox"
                  checked={value}
                  onChange={(e) => onChange(e.target.checked)}
                  className="sr-only peer"
                  id="late-submissions-toggle"
                  disabled={isDisabled}
                />
                <div className="w-11 h-6 bg-gray-200 rounded-full peer-checked:bg-secondary transition-colors" />
                <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-5 shadow-sm" />
              </div>
            </label>
          </div>
        )}
      />
    </div>
  );
}
