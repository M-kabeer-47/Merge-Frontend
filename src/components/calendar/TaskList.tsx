"use client";

import { CalendarTask } from "@/types/calendar";
import TaskItem from "./TaskItem";

interface TaskListProps {
  tasks: CalendarTask[];
  onTaskClick: (task: CalendarTask) => void;
  onMarkDone: (taskId: string) => void;
  onEdit: (taskId: string) => void;
  onDelete: (taskId: string) => void;
}

export default function TaskList({
  tasks,
  onTaskClick,
  onMarkDone,
  onEdit,
  onDelete,
}: TaskListProps) {
  return (
    <div className="space-y-2">
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          onClick={() => onTaskClick(task)}
          onMarkDone={() => onMarkDone(task.id)}
          onEdit={() => onEdit(task.id)}
          onDelete={() => onDelete(task.id)}
        />
      ))}
    </div>
  );
}
