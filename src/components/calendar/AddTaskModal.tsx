"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { CalendarTask, TaskCategory } from "@/app/(with-layout)/calendar/page";
import { getCategoryIcon, getCategoryLabel } from "@/lib/utils/calendar-utils";
import { format } from "date-fns";

interface AddTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (task: Omit<CalendarTask, "id">) => void;
}

const categories: TaskCategory[] = [
  "assignment",
  "quiz",
  "video-session",
  "personal",
];

export default function AddTaskModal({
  isOpen,
  onClose,
  onSubmit,
}: AddTaskModalProps) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "personal" as TaskCategory,
    date: format(new Date(), "yyyy-MM-dd"),
    time: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  if (!isOpen) return null;

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    } else if (formData.title.length > 120) {
      newErrors.title = "Title must be 120 characters or less";
    }

    if (formData.description && formData.description.length > 500) {
      newErrors.description = "Description must be 500 characters or less";
    }

    if (!formData.date) {
      newErrors.date = "Date is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    onSubmit({
      title: formData.title,
      description: formData.description || undefined,
      category: formData.category,
      date: formData.date,
      time: formData.time || undefined,
      status: "pending",
    });

    // Reset form
    setFormData({
      title: "",
      description: "",
      category: "personal",
      date: format(new Date(), "yyyy-MM-dd"),
      time: "",
    });
    setErrors({});
  };

  const handleClose = () => {
    setFormData({
      title: "",
      description: "",
      category: "personal",
      date: format(new Date(), "yyyy-MM-dd"),
      time: "",
    });
    setErrors({});
    onClose();
  };

  // Trap focus inside modal
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      handleClose();
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-50"
        onClick={handleClose}
        aria-hidden="true"
      />

      {/* Modal */}
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        onKeyDown={handleKeyDown}
      >
        <div className="bg-background rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-light-border">
            <h2 id="modal-title" className="text-xl font-semibold text-heading">
              Add New Task
            </h2>
            <button
              onClick={handleClose}
              className="p-1 rounded-lg hover:bg-secondary/10 transition-colors"
              aria-label="Close modal"
            >
              <X className="w-5 h-5 text-para" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {/* Title */}
            <div>
              <label
                htmlFor="task-title"
                className="block text-sm font-medium text-heading mb-2"
              >
                Title <span className="text-red-500">*</span>
              </label>
              <input
                id="task-title"
                type="text"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                className={`
                  w-full px-4 py-2 rounded-lg border bg-background text-heading
                  focus:outline-none focus:ring-2 focus:ring-primary
                  ${errors.title ? "border-red-500" : "border-light-border"}
                `}
                placeholder="Enter task title"
                maxLength={120}
              />
              {errors.title && (
                <p className="text-xs text-red-500 mt-1">{errors.title}</p>
              )}
              <p className="text-xs text-para-muted mt-1">
                {formData.title.length}/120 characters
              </p>
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
                className={`
                  w-full px-4 py-2 rounded-lg border bg-background text-heading
                  focus:outline-none focus:ring-2 focus:ring-primary
                  resize-none
                  ${errors.description ? "border-red-500" : "border-light-border"}
                `}
                placeholder="Add details about the task"
                rows={3}
                maxLength={500}
              />
              {errors.description && (
                <p className="text-xs text-red-500 mt-1">{errors.description}</p>
              )}
              <p className="text-xs text-para-muted mt-1">
                {formData.description.length}/500 characters
              </p>
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-heading mb-2">
                Category <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-2 gap-2">
                {categories.map((category) => {
                  const Icon = getCategoryIcon(category);
                  const isSelected = formData.category === category;

                  return (
                    <button
                      key={category}
                      type="button"
                      onClick={() => setFormData({ ...formData, category })}
                      className={`
                        flex items-center gap-2 px-4 py-3 rounded-lg border transition-colors
                        ${
                          isSelected
                            ? "border-primary bg-primary/10 text-primary"
                            : "border-light-border bg-background text-para hover:bg-secondary/10"
                        }
                      `}
                    >
                      <Icon className="w-4 h-4" />
                      <span className="text-sm font-medium">
                        {getCategoryLabel(category)}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Date and Time */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="task-date"
                  className="block text-sm font-medium text-heading mb-2"
                >
                  Date <span className="text-red-500">*</span>
                </label>
                <input
                  id="task-date"
                  type="date"
                  value={formData.date}
                  onChange={(e) =>
                    setFormData({ ...formData, date: e.target.value })
                  }
                  className={`
                    w-full px-4 py-2 rounded-lg border bg-background text-heading
                    focus:outline-none focus:ring-2 focus:ring-primary
                    ${errors.date ? "border-red-500" : "border-light-border"}
                  `}
                />
                {errors.date && (
                  <p className="text-xs text-red-500 mt-1">{errors.date}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="task-time"
                  className="block text-sm font-medium text-heading mb-2"
                >
                  Time
                </label>
                <input
                  id="task-time"
                  type="time"
                  value={formData.time}
                  onChange={(e) =>
                    setFormData({ ...formData, time: e.target.value })
                  }
                  className="w-full px-4 py-2 rounded-lg border border-light-border bg-background text-heading focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={handleClose}
                className="flex-1 px-4 py-2 rounded-lg border border-light-border bg-background text-para hover:bg-secondary/10 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 px-4 py-2 rounded-lg bg-primary text-white hover:bg-primary/90 transition-colors"
              >
                Add Task
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}