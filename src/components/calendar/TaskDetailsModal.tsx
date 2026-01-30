"use client";

import { X, Calendar, Clock, MapPin, FileText } from "lucide-react";
import { CalendarTask } from "@/types/calendar";
import {
  getCategoryIcon,
  getCategoryLabel,
  getCategoryColor,
} from "@/lib/utils/calendar-utils";
import { format } from "date-fns";
import { parseISO } from "date-fns/parseISO";

interface TaskDetailsModalProps {
  task: CalendarTask;
  onClose: () => void;
  onMarkDone: (taskId: string) => void;
  onEdit: (taskId: string) => void;
  onDelete: (taskId: string) => void;
}

export default function TaskDetailsModal({
  task,
  onClose,
  onMarkDone,
  onEdit,
  onDelete,
}: TaskDetailsModalProps) {
  const Icon = getCategoryIcon(task.taskCategory);
  const color = getCategoryColor(task.taskCategory);
  const isCompleted = task.status === "completed";

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      onClose();
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-50"
        onClick={onClose}
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
        <div className="bg-background rounded-xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="flex items-start justify-between p-6 border-b border-light-border">
            <div className="flex items-start gap-4 flex-1">
              <div
                className={`w-12 h-12 rounded-lg ${color.bg} flex items-center justify-center flex-shrink-0`}
              >
                <Icon className={`w-6 h-6 ${color.text}`} />
              </div>
              <div className="flex-1">
                <h2
                  id="modal-title"
                  className="text-xl font-semibold text-heading mb-1"
                >
                  {task.title}
                </h2>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-secondary/10 text-secondary">
                  {getCategoryLabel(task.taskCategory)}
                </span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded-lg hover:bg-secondary/10 transition-colors flex-shrink-0 ml-2"
              aria-label="Close modal"
            >
              <X className="w-5 h-5 text-para" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-4">
            {/* Status Badge */}
            {isCompleted && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                <p className="text-sm font-medium text-green-800">
                  ✓ Task completed
                </p>
              </div>
            )}

            {/* Date & Time */}
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-para">
                <Calendar className="w-5 h-5 flex-shrink-0" />
                <span className="text-sm">
                  {format(parseISO(task.date), "EEEE, MMMM d, yyyy")}
                </span>
              </div>

              {task.time && (
                <div className="flex items-center gap-3 text-para">
                  <Clock className="w-5 h-5 flex-shrink-0" />
                  <span className="text-sm">{task.time}</span>
                </div>
              )}

              {task.roomName && (
                <div className="flex items-center gap-3 text-para">
                  <MapPin className="w-5 h-5 flex-shrink-0" />
                  <span className="text-sm">{task.roomName}</span>
                </div>
              )}
            </div>

            {/* Description */}
            {task.description && (
              <div className="pt-4 border-t border-light-border">
                <div className="flex items-center gap-2 mb-2">
                  <FileText className="w-5 h-5 text-para" />
                  <h3 className="text-sm font-medium text-heading">
                    Description
                  </h3>
                </div>
                <p className="text-sm text-para leading-relaxed">
                  {task.description}
                </p>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="p-6 border-t border-light-border">
            <div className="flex gap-3">
              {!isCompleted && (
                <button
                  onClick={() => {
                    onMarkDone(task.id);
                    onClose();
                  }}
                  className="flex-1 px-4 py-2 rounded-lg bg-primary text-white hover:bg-primary/90 transition-colors"
                >
                  Mark as Done
                </button>
              )}
              <button
                onClick={() => {
                  onEdit(task.id);
                  onClose();
                }}
                className="flex-1 px-4 py-2 rounded-lg border border-light-border bg-background text-para hover:bg-secondary/10 transition-colors"
              >
                Edit
              </button>
              <button
                onClick={() => {
                  onDelete(task.id);
                  onClose();
                }}
                className="px-4 py-2 rounded-lg border border-red-200 bg-background text-red-600 hover:bg-red-50 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
