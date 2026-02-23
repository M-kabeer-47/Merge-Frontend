"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import DateTimePicker from "@/components/ui/DateTimePicker";
import Modal from "@/components/ui/Modal";
import useCreateTask from "@/hooks/calendar/use-create-task";
import useUpdateTask from "@/hooks/calendar/use-update-task";
import { CalendarTask } from "@/types/calendar";
import { tryIt } from "@/utils/try-it";

interface AddTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  taskToEdit?: CalendarTask | null;
}

export default function AddTaskModal({
  isOpen,
  onClose,
  taskToEdit,
}: AddTaskModalProps) {
  const { createTask, isCreating } = useCreateTask();
  const { updateTask, isUpdating } = useUpdateTask();

  const isEditMode = !!taskToEdit;
  const isLoading = isCreating || isUpdating;

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    deadline: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (isOpen) {
      if (taskToEdit) {
        const isoDeadline = taskToEdit.deadline;
        setFormData({
          title: taskToEdit.title,
          description: taskToEdit.description || "",
          deadline: isoDeadline,
        });
      } else {
        setFormData({
          title: "",
          description: "",
          deadline: "",
        });
      }
      setErrors({});
    }
  }, [isOpen, taskToEdit]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    } else if (formData.title.length > 120) {
      newErrors.title = "Title must be 120 characters or less";
    }

    if (!formData.deadline) {
      newErrors.deadline = "Deadline is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    const deadlineDate = new Date(formData.deadline);
    if (isNaN(deadlineDate.getTime())) {
      setErrors({ deadline: "Invalid deadline format" });
      return;
    }
    const isoDeadline = deadlineDate.toISOString();
    const [res, err] = await tryIt(
      isEditMode && taskToEdit
        ? updateTask({
            id: taskToEdit.id,
            title: formData.title,
            description: formData.description || undefined,
            deadline: isoDeadline,
          })
        : createTask({
            title: formData.title,
            description: formData.description || undefined,
            deadline: isoDeadline,
          }),
    );

    if (err) {
      return;
    }

    onClose();
  };

  const handleClose = () => {
    if (isLoading) return;
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={isEditMode ? "Edit Task" : "Add New Task"}
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Title */}
        <div>
          <label
            htmlFor="task-title"
            className="block text-sm font-medium text-heading mb-2"
          >
            Title <span className="text-red-500">*</span>
          </label>
          <Input
            id="task-title"
            type="text"
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            placeholder="Enter task title"
            autoFocus
            disabled={isLoading}
            maxLength={120}
            error={errors.title}
          />
          {errors.title && (
            <p className="text-xs text-red-500 mt-1">{errors.title}</p>
          )}
        </div>

        {/* Description */}
        <div>
          <label
            htmlFor="task-description"
            className="block text-sm font-medium text-heading mb-2"
          >
            Description
          </label>
          <textarea
            id="task-description"
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            className="flex w-full font-roboto rounded-md border-2 bg-transparent px-3 py-2 text-sm text-para transition-colors placeholder:text-para-muted/60 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 border-light-border hover:border-secondary/30 focus:ring-[2px] focus:ring-secondary/70 resize-none"
            placeholder="Add details about the task"
            rows={3}
            maxLength={500}
            disabled={isLoading}
          />
        </div>

        {/* Deadline */}
        <div>
          <label className="block text-sm font-medium text-heading mb-2">
            Deadline <span className="text-red-500">*</span>
          </label>
          <DateTimePicker
            value={formData.deadline}
            onChange={(value) =>
              setFormData({ ...formData, deadline: value })
            }
            placeholder="Select deadline"
            disabled={isLoading}
            showTime={true}
            minDate={new Date()}
            error={errors.deadline}
            expandUp={true}
          />
          {errors.deadline && (
            <p className="text-xs text-red-500 mt-1">{errors.deadline}</p>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={
              !formData.title.trim() || !formData.deadline || isLoading
            }
          >
            {isLoading ? (
              <LoadingSpinner
                size="sm"
                text={isEditMode ? "Updating..." : "Adding..."}
              />
            ) : isEditMode ? (
              "Update Task"
            ) : (
              "Add Task"
            )}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
