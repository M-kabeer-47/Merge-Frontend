"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  format,
  isSameDay,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  isSameMonth,
  isToday,
  addMonths,
  subMonths,
} from "date-fns";
import { parseISO } from "date-fns/parseISO";
import { CalendarTask } from "@/types/calendar";

// ═══════════════════════════════════════════════════════════════════
// TYPE DEFINITIONS
// ═══════════════════════════════════════════════════════════════════

interface CalendarDay {
  date: Date;
  dateNumber: number;
  isCurrentMonth: boolean;
  isToday: boolean;
  tasks: CalendarTask[];
}

interface TaskCalendarProps {
  tasks?: CalendarTask[];
  onDateSelect: (date: Date) => void;
}

// ═══════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════

export default function TaskCalendar({
  tasks = [],
  onDateSelect,
}: TaskCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  // ═════════════════════════════════════════════════════════════════
  // CALENDAR GENERATION LOGIC
  // ═════════════════════════════════════════════════════════════════

  const generateCalendarDays = (month: Date): CalendarDay[] => {
    const monthStart = startOfMonth(month);
    const monthEnd = endOfMonth(month);
    const calendarStart = startOfWeek(monthStart);
    const calendarEnd = endOfWeek(monthEnd);

    const days: CalendarDay[] = [];
    let currentDate = calendarStart;

    while (currentDate <= calendarEnd) {
      const tasksForDate = getTasksForDate(currentDate);

      days.push({
        date: new Date(currentDate),
        dateNumber: currentDate.getDate(),
        isCurrentMonth: isSameMonth(currentDate, month),
        isToday: isToday(currentDate),
        tasks: tasksForDate,
      });

      currentDate = addDays(currentDate, 1);
    }

    return days;
  };

  const getTasksForDate = (date: Date): CalendarTask[] => {
    return tasks.filter((task) => {
      const taskDate = parseISO(task.date);
      return isSameDay(taskDate, date);
    });
  };

  // ═════════════════════════════════════════════════════════════════
  // EVENT HANDLERS
  // ═════════════════════════════════════════════════════════════════

  const handlePreviousMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };

  const handleDateClick = (day: CalendarDay) => {
    setSelectedDate(day.date);
    onDateSelect(day.date);
  };

  // ═════════════════════════════════════════════════════════════════
  // DERIVED DATA
  // ═════════════════════════════════════════════════════════════════

  const calendarDays = generateCalendarDays(currentMonth);

  const dayNames = ["SU", "MO", "TU", "WE", "TH", "FR", "SA"];

  // ═════════════════════════════════════════════════════════════════
  // RENDER
  // ═════════════════════════════════════════════════════════════════

  return (
    <div className="bg-background border border-light-border rounded-xl p-6 shadow-sm">
      {/* Calendar Header */}
      <div className="flex justify-between items-center mb-4">
        {/* Month and Year Display */}
        <h3 className="text-lg font-semibold text-heading">
          {format(currentMonth, "MMMM yyyy")}
        </h3>

        {/* Navigation Buttons */}
        <div className="flex gap-1">
          <button
            onClick={handlePreviousMonth}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-secondary/10 transition-colors"
            aria-label="Previous month"
          >
            <ChevronLeft className="w-4 h-4 text-para" />
          </button>
          <button
            onClick={handleNextMonth}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-secondary/10 transition-colors"
            aria-label="Next month"
          >
            <ChevronRight className="w-4 h-4 text-para" />
          </button>
        </div>
      </div>

      {/* Day Headers */}
      <div className="grid grid-cols-7 gap-2 mb-2">
        {dayNames.map((day) => (
          <div
            key={day}
            className="text-xs font-medium text-para-muted text-center uppercase"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-2">
        {calendarDays.map((day, index) => {
          const hasTasks = day.tasks.length > 0;
          const isSelected = selectedDate && isSameDay(day.date, selectedDate);

          // Determine cell styling
          let cellClasses =
            "aspect-square relative flex items-center justify-center rounded-lg transition-all duration-200 ";

          if (!day.isCurrentMonth) {
            // Empty cells (previous/next month dates)
            cellClasses += "text-para-muted cursor-default";
          } else if (day.isToday) {
            // Today
            cellClasses +=
              "bg-primary text-white font-bold hover:bg-primary/90 cursor-pointer";
          } else if (isSelected) {
            // Selected date
            cellClasses +=
              "bg-secondary/20 text-heading font-semibold border-2 border-primary cursor-pointer";
          } else if (hasTasks) {
            // Dates with tasks
            cellClasses +=
              "bg-secondary/20 text-para font-semibold hover:bg-secondary/10 cursor-pointer";
          } else {
            // Regular dates
            cellClasses +=
              "text-para font-medium hover:bg-secondary/5 cursor-pointer";
          }

          const ariaLabel = `${format(day.date, "MMMM d, yyyy")}${
            hasTasks
              ? `, ${day.tasks.length} task${day.tasks.length > 1 ? "s" : ""}`
              : ""
          }`;

          return (
            <div
              key={index}
              className={cellClasses}
              onClick={() => handleDateClick(day)}
              aria-label={ariaLabel}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  handleDateClick(day);
                }
              }}
            >
              <span className="text-sm">{day.dateNumber}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
