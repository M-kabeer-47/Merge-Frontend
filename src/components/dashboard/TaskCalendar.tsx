"use client";

import { useState, useEffect } from "react";
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
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());

  // Fire selection of today on mount so the parent shows today's tasks
  useEffect(() => {
    onDateSelect(new Date());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
      if (!task.deadline) return false;
      const taskDate = parseISO(task.deadline);
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

          // Determine task category dot colors (up to 3 dots, deduped by category)
          const dotCategories = Array.from(
            new Set(day.tasks.map((t) => t.taskCategory)),
          ).slice(0, 3);
          const categoryColor = (cat: string) => {
            switch (cat) {
              case "assignment":
                return "bg-accent";
              case "quiz":
                return "bg-info";
              case "video-session":
                return "bg-primary";
              default:
                return "bg-secondary";
            }
          };

          // Determine cell styling
          let cellClasses =
            "aspect-square relative flex flex-col items-center justify-center rounded-lg transition-all duration-200 cursor-pointer ";

          if (!day.isCurrentMonth) {
            cellClasses += "text-para-muted/60 hover:bg-secondary/5";
          } else if (day.isToday && isSelected) {
            cellClasses += "bg-primary text-white font-bold ring-2 ring-primary/30";
          } else if (day.isToday) {
            cellClasses += "bg-primary text-white font-bold hover:bg-primary/90";
          } else if (isSelected) {
            cellClasses +=
              "bg-secondary/15 text-heading font-semibold ring-2 ring-primary";
          } else if (hasTasks) {
            cellClasses +=
              "bg-secondary/10 text-para font-semibold hover:bg-secondary/20";
          } else {
            cellClasses += "text-para font-medium hover:bg-secondary/5";
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

              {/* Task indicator dots */}
              {hasTasks && (
                <div className="absolute bottom-1 flex gap-0.5">
                  {dotCategories.map((cat) => (
                    <span
                      key={cat}
                      className={`h-1 w-1 rounded-full ${
                        day.isToday ? "bg-white" : categoryColor(cat)
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="mt-3 flex flex-wrap items-center gap-3 border-t border-light-border pt-3">
        <div className="flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-accent" />
          <span className="text-[10px] text-para-muted">Assignment</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-info" />
          <span className="text-[10px] text-para-muted">Quiz</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-primary" />
          <span className="text-[10px] text-para-muted">Session</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-secondary" />
          <span className="text-[10px] text-para-muted">Personal</span>
        </div>
      </div>
    </div>
  );
}
