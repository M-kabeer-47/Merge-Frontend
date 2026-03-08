"use client";

import { Check, Clock, Users, ClipboardList, Video, User } from "lucide-react";

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

export const getTaskIcon = (type: Task["type"]) => {
  switch (type) {
    case "assignment":
      return ClipboardList;
    case "session":
      return Video;
    case "personal":
      return User;
  }
};

export const getTaskTypeColor = (type: Task["type"]) => {
  switch (type) {
    case "assignment":
      return "text-accent";
    case "session":
      return "text-primary";
    case "personal":
      return "text-secondary";
  }
};

interface TaskItemProps {
  task: Task;
  index: number;
}

export default function TaskItem({ task, index }: TaskItemProps) {
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
