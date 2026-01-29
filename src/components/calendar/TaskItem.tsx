"use client";
import { format, isValid } from "date-fns";

import { CalendarTask } from "@/types/calendar";
import { getCategoryIcon, getCategoryColor } from "@/lib/utils/calendar-utils";
import { MoreVertical, Check, Edit2, Trash2 } from "lucide-react";
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
  const Icon = getCategoryIcon(task.category);
  const color = getCategoryColor(task.category);
  const isCompleted = task.status === "completed";

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

  return (
    <div
      className={`
        group relative bg-card border border-light-border rounded-lg p-3 
        hover:shadow-md transition-all cursor-pointer
        ${isCompleted ? "opacity-60" : ""}
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
            ) : task.time ? (
              <span className="flex items-center gap-1">
                <span>🕐</span>
                {task.time}
              </span>
            ) : null}
            {task.roomName && (
              <span className="text-secondary">{task.roomName}</span>
            )}
          </div>

          {task.description && (
            <p className="text-xs text-para-muted mt-1 line-clamp-1">
              {task.description}
            </p>
          )}
        </div>

        {/* Actions Menu */}
        <div className="relative flex-shrink-0" ref={menuRef}>
          <button
            onClick={handleMenuClick}
            className="p-1 rounded hover:bg-secondary/10 opacity-0 group-hover:opacity-100 transition-opacity"
            aria-label="Task actions"
            aria-expanded={showMenu}
            aria-haspopup="true"
          >
            <MoreVertical className="w-4 h-4 text-para" />
          </button>

          {showMenu && (
            <div className="absolute right-0 top-8 w-40 bg-background border border-light-border rounded-lg shadow-lg py-1 z-10">
              {!isCompleted && (
                <button
                  onClick={(e) => handleAction(e, onMarkDone)}
                  className="w-full px-4 py-2 text-left text-sm text-para hover:bg-secondary/10 flex items-center gap-2"
                >
                  <Check className="w-4 h-4" />
                  Mark Done
                </button>
              )}
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

      {/* Completion Badge */}
      {isCompleted && (
        <div className="absolute top-2 right-2">
          <div className="bg-green-100 text-green-700 px-2 py-0.5 rounded-full text-xs font-medium">
            Completed
          </div>
        </div>
      )}
    </div>
  );
}
