"use client";

import { Clock, Users, MapPin, Check } from "lucide-react";
import { format } from "date-fns";

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
            <TaskItem key={task.id} task={task} index={index} />
          ))}
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// TASK ITEM COMPONENT
// ═══════════════════════════════════════════════════════════════════

interface TaskItemProps {
  task: InstructorTask;
  index: number;
}

function TaskItem({ task, index }: TaskItemProps) {
  return (
    <div className="flex items-start gap-3 bg-main-background/70 hover:bg-primary/10 rounded-lg p-3 transition-all duration-200 border border-primary/10">
      {/* Status Circle */}
      <div className="flex-shrink-0 mt-0.5">
        {task.completed ? (
          // Filled circle with check icon
          <div className="w-5 h-5 rounded-full bg-success flex items-center justify-center shadow-sm">
            <Check className="w-3 h-3 text-white" strokeWidth={3} />
          </div>
        ) : (
          // Dashed empty circle with number
          <div className="w-5 h-5 rounded-full border-2 border-dashed border-primary flex items-center justify-center">
            <span className="text-[10px] font-semibold text-primary">
              {index + 1}
            </span>
          </div>
        )}
      </div>

      {/* Task Details */}
      <div className="flex-1 min-w-0">
        <h5
          className={`text-sm font-medium mb-1 ${
            task.completed
              ? "text-para-muted line-through"
              : "text-heading"
          }`}
        >
          {task.title}
        </h5>

        <div className="space-y-1">
          {/* Time */}
          {task.time && (
            <div className="flex items-center gap-1.5 text-xs text-para">
              <Clock className="w-3 h-3" />
              <span>{task.time}</span>
            </div>
          )}

          {/* Location */}
          {task.location && (
            <div className="flex items-center gap-1.5 text-xs text-para">
              <MapPin className="w-3 h-3" />
              <span className="truncate">{task.location}</span>
            </div>
          )}

          {/* Participants */}
          {task.participants && (
            <div className="flex items-center gap-1.5 text-xs text-para">
              <Users className="w-3 h-3" />
              <span>{task.participants} participants</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
