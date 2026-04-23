"use client";

import { Clock, Users, MapPin, Check } from "lucide-react";
import type { InstructorTask } from "./InstructorTasks";

interface InstructorTaskItemProps {
  task: InstructorTask;
  index: number;
}

export default function InstructorTaskItem({ task, index }: InstructorTaskItemProps) {
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
