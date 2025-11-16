"use client";

import { Plus } from "lucide-react";
import { CalendarTask } from "@/app/(with-layout)/calendar/page";
import { getCategoryIcon, getCategoryColor } from "@/lib/utils/calendar-utils";


interface TodayTasksBarProps {
  tasks: CalendarTask[];
  onAddTask: () => void;
  onTaskClick: (task: CalendarTask) => void;
}

export default function TodayTasksBar({
  tasks,
  onAddTask,
  onTaskClick,
}: TodayTasksBarProps) {
  return (
    <div className="bg-background border border-light-border rounded-xl p-4 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-semibold text-heading">Today's Tasks</h2>
          <p className="text-sm text-para-muted">
            {tasks.length} {tasks.length === 1 ? "task" : "tasks"} scheduled
          </p>
        </div>
        <button
          onClick={onAddTask}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
          aria-label="Add new task"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">Add Task</span>
        </button>
      </div>

      {tasks.length === 0 ? (
        <div className="text-center py-8 text-para-muted">
          <p>No tasks scheduled for today</p>
        </div>
      ) : (
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
          {tasks.map((task) => {
            const Icon = getCategoryIcon(task.category);
            const color = getCategoryColor(task.category);

            return (
              <button
                key={task.id}
                onClick={() => onTaskClick(task)}
                className="flex-shrink-0 bg-card border border-light-border rounded-lg p-3 hover:shadow-md transition-shadow min-w-[200px]"
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`w-10 h-10 rounded-lg ${color.bg} flex items-center justify-center flex-shrink-0`}
                  >
                    <Icon className={`w-5 h-5 ${color.text}`} />
                  </div>
                  <div className="flex-1 text-left">
                    <h3 className="font-medium text-heading text-sm line-clamp-1">
                      {task.title}
                    </h3>
                    {task.time && (
                      <p className="text-xs text-para-muted mt-1">
                        {task.time}
                      </p>
                    )}
                    {task.roomName && (
                      <p className="text-xs text-secondary mt-1">
                        {task.roomName}
                      </p>
                    )}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}