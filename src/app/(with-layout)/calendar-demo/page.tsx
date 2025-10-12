"use client";

import { useState } from "react";
import TaskCalendar, { Task } from "@/components/dashboard/TaskCalendar";
import TasksToday from "@/components/dashboard/TasksToday";

export default function CalendarDemoPage() {
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [selectedTasks, setSelectedTasks] = useState<Task[]>([]);

  const handleDateSelect = (date: Date, tasks: Task[]) => {
    setSelectedDate(date);
    setSelectedTasks(tasks);
  };

  return (
    <div className="min-h-screen bg-main-background p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-raleway font-bold text-heading mb-2">
            Task Calendar Demo
          </h1>
          <p className="text-para-muted">
            Interactive calendar showing assignments, live sessions, and personal tasks
          </p>
        </div>

        {/* Calendar & Tasks Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <TaskCalendar onDateSelect={handleDateSelect} />
          </div>
          <div>
            <TasksToday selectedDate={selectedDate} tasks={selectedTasks} />
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-card border border-light-border rounded-xl p-6 mt-8">
          <h2 className="text-lg font-semibold text-heading mb-4">
            How to Use
          </h2>
          <ul className="space-y-2 text-sm text-para">
            <li className="flex items-start gap-2">
              <span className="text-primary font-bold">•</span>
              <span>
                <strong>Dates with subtle background</strong> have tasks scheduled
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary font-bold">•</span>
              <span>
                <strong>Today&apos;s date</strong> is highlighted with primary color
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary font-bold">•</span>
              <span>
                <strong>Click on any date</strong> to view tasks in the sidebar
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary font-bold">•</span>
              <span>
                <strong>Completed tasks</strong> show a green checkmark
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary font-bold">•</span>
              <span>
                <strong>Pending tasks</strong> show numbered dashed circles
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary font-bold">•</span>
              <span>
                <strong>Use arrow buttons</strong> to navigate between months
              </span>
            </li>
          </ul>

          <div className="mt-6 pt-6 border-t border-light-border">
            <h3 className="text-sm font-semibold text-heading mb-3">
              Task Types
            </h3>
            <div className="flex flex-wrap gap-3">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-accent/20 border border-accent"></div>
                <span className="text-xs text-para">Assignment</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-info/20 border border-info"></div>
                <span className="text-xs text-para">Live Session</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-success/20 border border-success"></div>
                <span className="text-xs text-para">Personal Task</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
