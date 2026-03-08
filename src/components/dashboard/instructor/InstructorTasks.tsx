"use client";

import { Check } from "lucide-react";
import { format } from "date-fns";
import InstructorTaskItem from "./InstructorTaskItem";

// ═══════════════════════════════════════════════════════════════════
// TYPE DEFINITIONS
// ═══════════════════════════════════════════════════════════════════

export interface InstructorTask {
  id: string;
  title: string;
  date: Date;
  time?: string;
  location?: string;
  participants?: number;
  completed?: boolean;
}

interface InstructorTasksProps {
  selectedDate: Date | null;
  tasks: InstructorTask[];
}

// ═══════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════

export default function InstructorTasks({
  selectedDate,
  tasks,
}: InstructorTasksProps) {
  const displayDate = selectedDate || new Date();
  const isToday =
    format(displayDate, "yyyy-MM-dd") === format(new Date(), "yyyy-MM-dd");

  const completedCount = tasks.filter((t) => t.completed).length;
  const totalCount = tasks.length;

  return (
    <div className="bg-background border border-light-border rounded-xl p-5 shadow-sm max-h-[670px] flex flex-col">
      {/* Header */}
      <div className="mb-4 pb-3 border-b border-light-border flex-shrink-0">
        <h3 className="font-raleway font-semibold text-heading text-base mb-1">
          {isToday ? "Today's Schedule" : format(displayDate, "MMM d, yyyy")}
        </h3>
        <p className="text-xs text-para-muted">
          {totalCount === 0
            ? "No tasks scheduled"
            : `${completedCount} of ${totalCount} completed`}
        </p>
      </div>

      {/* Tasks List */}
      {totalCount === 0 ? (
        <div className="text-center py-8 flex-shrink-0">
          <Check className="w-12 h-12 text-para-muted mx-auto mb-2 opacity-50" />
          <p className="text-sm text-para-muted">No tasks for this day</p>
        </div>
      ) : (
        <div className="space-y-2 overflow-y-auto flex-1">
          {tasks.map((task, index) => (
            <InstructorTaskItem key={task.id} task={task} index={index} />
          ))}
        </div>
      )}
    </div>
  );
}
