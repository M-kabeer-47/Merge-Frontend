"use client";

import { CalendarTask } from "@/types/calendar";

import TaskCalendar from "@/components/dashboard/TaskCalendar";

interface CalendarWrapperProps {
  tasks: CalendarTask[];
  selectedDate: Date | null;
  onDateSelect: (date: Date) => void;
}

export default function CalendarWrapper({
  tasks,
  onDateSelect,
}: CalendarWrapperProps) {
  const handleDateSelect = (date: Date) => {
    onDateSelect(date);
  };

  return (
    <div className="bg-background border border-light-border rounded-xl shadow-sm">
      <div className="p-5">
        <h2 className="text-lg font-semibold text-heading mb-4">Calendar</h2>
        {/* Reduced height by wrapping in a constrained container */}
        <div className=" overflow-hidden">
          <TaskCalendar tasks={tasks} onDateSelect={handleDateSelect} />{" "}
        </div>
      </div>

      {/* Task indicators legend */}
    </div>
  );
}
