"use client";

import { useState, useRef } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Upload, FileText, Trash2, Calendar, Award } from "lucide-react";
import { format } from "date-fns";
import Modal from "@/components/ui/Modal";
import { FormField } from "@/components/ui/FormField";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import {
  createAssignmentSchema,
  type CreateAssignmentType,
} from "@/schemas/assignment/create-assignment";

interface CreateAssignmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (assignment: CreateAssignmentType) => void;
  roomId: string;
}

export default function CreateAssignmentModal({
  isOpen,
  onClose,
  onSubmit,
  roomId,
}: CreateAssignmentModalProps) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    control,
    handleSubmit,
    watch,
    reset,
    setValue,
    formState: { errors, isValid, isSubmitting },
  } = useForm({
    resolver: zodResolver(createAssignmentSchema),
    mode: "onChange" as const,
    defaultValues: {
      title: "",
      description: "",
      attachments: [] as File[],
      points: 100,
      dueDate: format(new Date(), "yyyy-MM-dd'T'HH:mm"),
      allowLateSubmissions: false,
    },
  });

  const attachments = watch("attachments");
  const allowLateSubmissions = watch("allowLateSubmissions");

  const handleFormSubmit = async (data: CreateAssignmentType) => {
    console.log("createAssignment", {
      ...data,
      roomId,
      attachmentCount: data.attachments.length,
    });

    onSubmit(data);
    reset();
  };

  const handleClose = () => {
    if (!isSubmitting) {
      reset();
      onClose();
    }
  };

  const handleFileSelect = (files: FileList | null) => {
    if (!files) return;

    const newFiles = Array.from(files);
    const validFiles = newFiles.filter((file) => {
      // Max 10MB per file
      if (file.size > 10 * 1024 * 1024) {
        console.warn(`File ${file.name} exceeds 10MB limit`);
        return false;
      }
      return true;
    });

    setValue("attachments", [...attachments, ...validFiles], {
      shouldValidate: true,
    });
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileSelect(e.dataTransfer.files);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const removeAttachment = (index: number) => {
    setValue(
      "attachments",
      attachments.filter((_, i) => i !== index),
      { shouldValidate: true }
    );
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Create New Assignment"
      description="Set up a new assignment for your students"
      maxWidth="2xl"
      
    >
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-5">
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
                disabled={isSubmitting}
                maxLength={200}
              />
              <p className="text-xs text-para-muted mt-1.5">
                {field.value.length}/200 characters
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
              label="Description"
              htmlFor="description"
              error={errors.description?.message}
            >
              <Textarea
                {...field}
                id="description"
                rows={5}
                placeholder="Provide detailed instructions for the assignment..."
                error={errors.description?.message}
                disabled={isSubmitting}
                maxLength={2000}
              />
              <p className="text-xs text-para-muted mt-1.5">
                {field.value.length}/2000 characters
              </p>
            </FormField>
          )}
        />

            {/* Attachments */}
            <div>
              <label className="block text-sm font-medium text-heading mb-2">
                Attachments
              </label>

              {/* Upload Area */}
              <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                className={`
                  border-2 border-dashed rounded-lg p-6 text-center transition-colors
                  ${
                    isDragging
                      ? "border-primary "
                      : "border-light-border bg-background"
                  }
                `}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  onChange={(e) => handleFileSelect(e.target.files)}
                  className="hidden"
                  id="file-upload"
                />
                <Upload className="w-8 h-8 text-para-muted mx-auto mb-2" />
                <p className="text-sm text-heading mb-1">
                  Drop files here or{" "}
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="text-primary hover:underline font-medium"
                  >
                    browse
                  </button>
                </p>
                <p className="text-xs text-para-muted">
                  Max 10MB per file. Support for all file types.
                </p>
              </div>

              {/* Attached Files List */}
              {attachments.length > 0 && (
                <div className="mt-3 space-y-2">
                  {attachments.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-background border border-light-border rounded-lg"
                    >
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <FileText className="w-4 h-4 text-primary flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-heading truncate">
                            {file.name}
                          </p>
                          <p className="text-xs text-para-muted">
                            {formatFileSize(file.size)}
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeAttachment(index)}
                        className="p-1.5 hover:bg-red-50 rounded transition-colors flex-shrink-0 ml-2"
                        aria-label={`Remove ${file.name}`}
                        disabled={isSubmitting}
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Points and Due Date Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Points */}
              <Controller
                name="points"
                control={control}
                render={({ field }) => (
                  <FormField
                    label="Points"
                    htmlFor="points"
                    error={errors.points?.message}
                  >
                    <div className="relative">
                      <Award className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-para-muted" />
                      <Input
                        {...field}
                        id="points"
                        type="number"
                        min={0}
                        max={1000}
                        placeholder="100"
                        className="pl-10"
                        error={errors.points?.message}
                        disabled={isSubmitting}
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                      />
                    </div>
                  </FormField>
                )}
              />

              {/* Due Date */}
              <Controller
                name="dueDate"
                control={control}
                render={({ field }) => (
                  <FormField
                    label="Due Date"
                    htmlFor="dueDate"
                    error={errors.dueDate?.message}
                  >
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-para-muted z-10" />
                      <Input
                        {...field}
                        id="dueDate"
                        type="datetime-local"
                        className="pl-10"
                        error={errors.dueDate?.message}
                        disabled={isSubmitting}
                      />
                    </div>
                  </FormField>
                )}
              />
            </div>

            {/* Allow Late Submissions Toggle */}
            <div className="bg-background border border-light-border rounded-lg p-4">
              <label className="flex items-center justify-between cursor-pointer">
                <div className="flex-1">
                  <p className="text-sm font-medium text-heading">
                    Allow Late Submissions
                  </p>
                  <p className="text-xs text-para-muted mt-0.5">
                    Students can submit after the due date
                  </p>
                </div>
                <div className="relative ml-4">
                  <Controller
                    name="allowLateSubmissions"
                    control={control}
                    render={({ field: { value, onChange, ...field } }) => (
                      <>
                        <input
                          {...field}
                          type="checkbox"
                          checked={value}
                          onChange={(e) => onChange(e.target.checked)}
                          className="sr-only peer"
                          id="late-submissions-toggle"
                          disabled={isSubmitting}
                        />
                        <div className="w-11 h-6 bg-gray-200 rounded-full peer-checked:bg-primary transition-colors" />
                        <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-5 shadow-sm" />
                      </>
                    )}
                  />
                </div>
              </label>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4 border-t border-light-border">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={isSubmitting}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="flex-1"
              >
                {isSubmitting ? "Creating..." : "Create Assignment"}
              </Button>
            </div>
          </form>
        </Modal>
      );
    }
