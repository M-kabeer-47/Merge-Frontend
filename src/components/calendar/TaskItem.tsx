"use client";
import { format, isValid } from "date-fns";

import { CalendarTask } from "@/types/calendar";
import { getCategoryIcon, getCategoryColor } from "@/lib/utils/calendar-utils";
import {
  MoreVertical,
  Circle,
  CheckCircle2,
  Edit2,
  Trash2,
} from "lucide-react";
import { useState, useRef } from "react";
import { useOnClickOutside } from "@/hooks/use-on-click-outside";

interface TaskItemProps {
  task: CalendarTask;
  onClick: () => void;
  onMarkDone: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export default function TaskItem({
  task,
  onClick,
  onMarkDone,
  onEdit,
  onDelete,
}: TaskItemProps) {
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const Icon = getCategoryIcon(task.taskCategory);
  const color = getCategoryColor(task.taskCategory);
  const isCompleted = task.taskStatus === "completed";

  // Close menu when clicking outside
  useOnClickOutside(menuRef, () => setShowMenu(false), showMenu);

  const handleMenuClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowMenu(!showMenu);
  };

  const handleAction = (e: React.MouseEvent, action: () => void) => {
    e.stopPropagation();
    action();
    setShowMenu(false);
  };

  const handleMarkDone = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isCompleted) {
      onMarkDone();
    }
  };

  return (
    <div
      className={`
        group relative bg-card border border-light-border rounded-lg p-3
        hover:shadow-md transition-all cursor-pointer
      `}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick();
        }
      }}
      aria-label={`Task: ${task.title}`}
    >
      <div className="flex items-start gap-3">
        {/* Completion Toggle */}
        <button
          onClick={handleMarkDone}
          className={`
            flex-shrink-0 mt-2 transition-colors
            ${isCompleted
              ? "text-green-500"
              : "text-para-muted hover:text-green-500"
            }
          `}
          aria-label={isCompleted ? "Completed" : "Mark as done"}
        >
          {isCompleted ? (
            <CheckCircle2 className="w-[22px] h-[22px]" fill="currentColor" stroke="white" />
          ) : (
            <Circle className="w-[22px] h-[22px]" />
          )}
        </button>

        {/* Category Icon */}
        <div
          className={`
            flex-shrink-0 w-10 h-10 rounded-lg ${color.bg}
            flex items-center justify-center
          `}
        >
          <Icon className={`w-5 h-5 ${color.text}`} />
        </div>

        {/* Task Details */}
        <div className="flex-1 min-w-0">
          <h3
            className={`
              font-medium text-sm mb-1 line-clamp-1
              ${isCompleted ? "line-through text-para-muted" : "text-heading"}
            `}
          >
            {task.title}
          </h3>

          <div className="flex flex-wrap items-center gap-2 text-xs text-para-muted">
            {task.deadline && isValid(new Date(task.deadline)) ? (
              <span className="flex items-center gap-1">
                <span>🕐</span>
                {format(new Date(task.deadline), "HH:mm")}
              </span>
            ) : null}
          </div>

          {task.description && (
            <p className="text-xs text-para-muted mt-1 line-clamp-1">
              {task.description}
            </p>
          )}
        </div>

        {/* Mark as Done text button - visible when not completed */}
        {!isCompleted && (
          <button
            onClick={handleMarkDone}
            className="flex-shrink-0 text-xs font-medium text-para-muted hover:text-green-600 transition-colors"
            aria-label="Mark as done"
          >
            Mark as Done
          </button>
        )}

        {/* Actions Menu - always visible */}
        <div className="relative flex-shrink-0" ref={menuRef}>
          <button
            onClick={handleMenuClick}
            className="p-1 rounded hover:bg-secondary/10 transition-colors"
            aria-label="Task actions"
            aria-expanded={showMenu}
            aria-haspopup="true"
          >
            <MoreVertical className="w-4 h-4 text-para-muted" />
          </button>

          {showMenu && (
            <div className="absolute right-0 top-8 w-40 bg-background border border-light-border rounded-lg shadow-lg py-1 z-10">
              <button
                onClick={(e) => handleAction(e, onEdit)}
                className="w-full px-4 py-2 text-left text-sm text-para hover:bg-secondary/10 flex items-center gap-2"
              >
                <Edit2 className="w-4 h-4" />
                Edit
              </button>
              <button
                onClick={(e) => handleAction(e, onDelete)}
                className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
