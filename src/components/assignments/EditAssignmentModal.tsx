"use client";

import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Edit, Award, AlertCircle } from "lucide-react";
import Modal from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { FormField } from "@/components/ui/FormField";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import DateTimePicker from "@/components/ui/DateTimePicker";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import useEditAssignment from "@/hooks/assignments/use-edit-assignment";
import type { Assignment } from "@/types/assignment";
import { format } from "date-fns";

const editAssignmentSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(200, "Title must be 200 characters or less")
    .trim(),
  description: z
    .string()
    .max(2000, "Description must be 2000 characters or less")
    .optional(),
  points: z.preprocess(
    (val) => (val === "" || val === undefined ? 0 : Number(val)),
    z
      .number()
      .min(0, "Total score must be a positive number")
      .max(1000, "Total score cannot exceed 1000"),
  ),
  endAt: z.string().min(1, "Due date is required"),
  isTurnInLateEnabled: z.boolean(),
});

type EditFormData = z.infer<typeof editAssignmentSchema>;

interface EditAssignmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  assignment: Assignment;
  roomId: string;
}

export default function EditAssignmentModal({
  isOpen,
  onClose,
  assignment,
  roomId,
}: EditAssignmentModalProps) {
  const { editAssignment, isEditing } = useEditAssignment({
    onSuccess: onClose,
  });

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isValid, isDirty },
  } = useForm<EditFormData>({
    //@ts-ignore
    resolver: zodResolver(editAssignmentSchema),
    mode: "onChange",
    defaultValues: {
      title: assignment.title,
      description: assignment.description || "",
      points: assignment.totalScore,
      endAt: assignment.endAt ? format(new Date(assignment.endAt), "yyyy-MM-dd'T'HH:mm") : "",
      isTurnInLateEnabled: assignment.isTurnInLateEnabled,
    },
  });

  // Reset form when assignment changes or modal opens
  useEffect(() => {
    if (isOpen) {
      reset({
        title: assignment.title,
        description: assignment.description || "",
        points: assignment.totalScore,
        endAt: assignment.endAt ? format(new Date(assignment.endAt), "yyyy-MM-dd'T'HH:mm") : "",
        isTurnInLateEnabled: assignment.isTurnInLateEnabled,
      });
    }
  }, [isOpen, assignment, reset]);

  const onSubmit = handleSubmit(async (data) => {
    await editAssignment({
      assignmentId: assignment.id,
      roomId,
      data: {
        title: data.title,
        description: data.description,
        totalScore: data.points,
        endAt: new Date(data.endAt).toISOString(),
        isTurnInLateEnabled: data.isTurnInLateEnabled,
      },
    });
  });

  return (
    <Modal
      isOpen={isOpen}
      onClose={isEditing ? () => {} : onClose}
      title="Edit Assignment"
      icon={
        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
          <Edit className="w-5 h-5 text-primary" />
        </div>
      }
      maxWidth="2xl"
      footer={
        <div className="flex items-center justify-end gap-3 p-4">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isEditing}
          >
            Cancel
          </Button>
          <Button
            onClick={onSubmit}
            disabled={isEditing || !isValid || !isDirty}
          >
            {isEditing ? (
              <LoadingSpinner size="sm" text="Saving..." />
            ) : (
              "Save Changes"
            )}
          </Button>
        </div>
      }
    >
      <form onSubmit={onSubmit} className="space-y-6">
        {/* Title */}
        <Controller
          name="title"
          control={control}
          render={({ field }) => (
            <FormField
              label="Assignment Title"
              htmlFor="edit-title"
              error={errors.title?.message}
            >
              <Input
                {...field}
                id="edit-title"
                placeholder="e.g., React Components Assignment"
                error={errors.title?.message}
                disabled={isEditing}
                maxLength={200}
              />
              <p className="text-xs text-para-muted mt-1.5">
                {field.value?.length || 0}/200 characters
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
              htmlFor="edit-description"
              error={errors.description?.message}
            >
              <Textarea
                {...field}
                id="edit-description"
                rows={4}
                placeholder="Provide detailed instructions for the assignment..."
                error={errors.description?.message}
                disabled={isEditing}
                maxLength={2000}
              />
              <p className="text-xs text-para-muted mt-1.5">
                {field.value?.length || 0}/2000 characters
              </p>
            </FormField>
          )}
        />

        {/* Points and Due Date */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Points */}
          <Controller
            name="points"
            control={control}
            render={({ field: { value, onChange, ...field } }) => (
              <FormField
                label="Points"
                htmlFor="edit-points"
                error={errors.points?.message}
              >
                <div className="relative">
                  <Award className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-para-muted" />
                  <Input
                    {...field}
                    value={value === 0 ? "" : value}
                    id="edit-points"
                    type="number"
                    min={0}
                    max={1000}
                    placeholder="Enter points"
                    className="pl-11"
                    error={errors.points?.message}
                    disabled={isEditing}
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
                htmlFor="edit-endAt"
                error={errors.endAt?.message}
              >
                <DateTimePicker
                  value={field.value}
                  onChange={field.onChange}
                  placeholder="Select due date and time"
                  disabled={isEditing}
                  error={errors.endAt?.message}
                />
              </FormField>
            )}
          />
        </div>

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
                    id="edit-late-submissions-toggle"
                    disabled={isEditing}
                  />
                  <div className="w-11 h-6 bg-gray-200 rounded-full peer-checked:bg-secondary transition-colors" />
                  <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-5 shadow-sm" />
                </div>
              </label>
            </div>
          )}
        />
      </form>
    </Modal>
  );
}
