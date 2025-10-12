"use client";

import { Check, Clock, Users, Video, ClipboardList, User } from "lucide-react";
import { format } from "date-fns";

// ═══════════════════════════════════════════════════════════════════
// TYPE DEFINITIONS
// ═══════════════════════════════════════════════════════════════════

export interface Task {
  id: string;
  title: string;
  type: "assignment" | "session" | "personal";
  date: Date;
  time?: string;
  room?: string;
  description?: string;
  completed?: boolean;
}

interface TasksTodayProps {
  selectedDate: Date | null;
  tasks: Task[];
}

// ═══════════════════════════════════════════════════════════════════
// HELPER FUNCTIONS
// ═══════════════════════════════════════════════════════════════════

const getTaskIcon = (type: Task["type"]) => {
  switch (type) {
    case "assignment":
      return ClipboardList;
    case "session":
      return Video;
    case "personal":
      return User;
  }
};

const getTaskTypeColor = (type: Task["type"]) => {
  switch (type) {
    case "assignment":
      return "text-accent";
    case "session":
      return "text-primary";
    case "personal":
      return "text-secondary";
  }
};

// ═══════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════

export default function TasksToday({ selectedDate, tasks }: TasksTodayProps) {
  const displayDate = selectedDate || new Date();
  const isToday =
    format(displayDate, "yyyy-MM-dd") === format(new Date(), "yyyy-MM-dd");

  // Separate assignments, sessions, and personal tasks
  const assignments = tasks.filter((t) => t.type === "assignment");
  const sessions = tasks.filter((t) => t.type === "session");
  const personalTasks = tasks.filter((t) => t.type === "personal");

  const completedCount = tasks.filter((t) => t.completed).length;
  const totalCount = tasks.length;

  return (
    <div className="bg-background border border-light-border rounded-xl p-5 shadow-md">
      {/* Header */}
      <div className="mb-4 pb-3 border-b border-light-border">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-raleway font-semibold text-heading text-base">
            {isToday ? "Today's Schedule" : format(displayDate, "MMM d, yyyy")}
          </h3>
          <span className="text-xs font-medium text-para-muted">
            {completedCount}/{totalCount}
          </span>
        </div>

        {/* Progress Bar */}
        {totalCount > 0 && (
          <div className="w-full bg-secondary/10 rounded-full h-1.5">
            <div
              className="bg-primary h-1.5 rounded-full transition-all duration-300"
              style={{ width: `${(completedCount / totalCount) * 100}%` }}
            />
          </div>
        )}
      </div>

      {/* Tasks List */}
      {totalCount === 0 ? (
        <div className="text-center py-8">
          <User className="w-12 h-12 text-white/30 mx-auto mb-2" />
          <p className="text-sm text-white/60">No tasks for this day</p>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Assignments Section */}
          {assignments.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-2.5">
                <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center">
                  <ClipboardList className="w-4 h-4 text-accent" strokeWidth={2.5} />
                </div>
                <h4 className="text-xs font-semibold uppercase tracking-wide text-accent/80">
                  Assignments ({assignments.length})
                </h4>
              </div>
              <div className="space-y-2">
                {assignments.map((task, idx) => (
                  <TaskItem task={task} index={idx} />
                ))}
              </div>
            </div>
          )}

          {/* Live Sessions Section */}
          {sessions.length > 0 && (
            <div>
              <h4 className="text-xs font-semibold text-primary uppercase tracking-wide mb-2 flex items-center gap-1.5 opacity-90">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Video className="w-3.5 h-3.5" strokeWidth={2.5} />
                </div>
                Live Sessions ({sessions.length})
              </h4>
              <div className="space-y-2">
                {sessions.map((task, index) => (
                  <TaskItem key={task.id} task={task} index={index} />
                ))}
              </div>
            </div>
          )}

          {/* Personal Tasks Section */}
          {personalTasks.length > 0 && (
            <div>
              <h4 className="text-xs font-semibold text-secondary uppercase tracking-wide mb-2 flex items-center gap-1.5 opacity-90">
                <div className="w-8 h-8 rounded-lg bg-secondary/10 flex items-center justify-center">
                  <User className="w-3.5 h-3.5 " strokeWidth={2.5} />
                </div>
               
                Personal ({personalTasks.length})
              </h4>
              <div className="space-y-2">
                {personalTasks.map((task, index) => (
                  <TaskItem key={task.id} task={task} index={index} />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// TASK ITEM COMPONENT
// ═══════════════════════════════════════════════════════════════════

interface TaskItemProps {
  task: Task;
  index: number;
}

function TaskItem({ task, index }: TaskItemProps) {
  const Icon = getTaskIcon(task.type);
  const colorClass = getTaskTypeColor(task.type);

  return (
    <div className="flex items-start gap-3 bg-main-background/50  rounded-lg p-3 transition-all duration-200 group border border-white/5">
      {/* Status Circle */}
      <div className="flex-shrink-0 mt-0.5">
        {task.completed ? (
          // Filled circle with check icon
          <div className="w-5 h-5 rounded-full bg-success flex items-center justify-center shadow-sm">
            <Check className="w-3 h-3 text-white" strokeWidth={3} />
          </div>
        ) : (
          // Dashed empty circle with number
          <div className="w-5 h-5 rounded-full border-2 border-dashed border-para-muted flex items-center justify-center">
            <span className="text-[10px] font-semibold text-para">
              {index + 1}
            </span>
          </div>
        )}
      </div>

      {/* Task Details */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start gap-2 mb-1">
          <Icon className={`w-3.5 h-3.5 ${colorClass} flex-shrink-0 mt-0.5`} />
          <h5
            className={`text-sm font-medium flex-1 ${
              task.completed ? "text-para-muted" : "text-para"
            }`}
          >
            {task.title}
          </h5>
        </div>

        {/* Time */}
        {task.time && (
          <div className="flex items-center gap-1.5 text-xs text-para-muted ml-5">
            <Clock className="w-3 h-3" />
            <span>{task.time}</span>
          </div>
        )}

        {/* Room */}
        {task.room && (
          <div className="flex items-center gap-1.5 text-xs text-para-muted ml-5 mt-0.5">
            <Users className="w-3 h-3" />
            <span className="truncate">{task.room}</span>
          </div>
        )}
      </div>
    </div>
  );
}
