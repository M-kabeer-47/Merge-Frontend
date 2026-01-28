"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronLeft, ChevronRight, Calendar, ArrowLeft } from "lucide-react";
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
  isBefore,
  startOfDay,
} from "date-fns";
import { useOnClickOutside } from "@/hooks/use-on-click-outside";

// ═══════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════

interface DateTimePickerProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  minDate?: Date;
  showTime?: boolean;
  error?: string;

  expandUp?: boolean;
}

interface CalendarDay {
  date: Date;
  isCurrentMonth: boolean;
  isDisabled: boolean;
}

type View = "calendar" | "time";

// ═══════════════════════════════════════════════════════════════════
// CALENDAR HEADER COMPONENT
// ═══════════════════════════════════════════════════════════════════

interface CalendarHeaderProps {
  currentMonth: Date;
  onPrevMonth: () => void;
  onNextMonth: () => void;
}

function CalendarHeader({
  currentMonth,
  onPrevMonth,
  onNextMonth,
}: CalendarHeaderProps) {
  return (
    <div className="flex items-center justify-between px-3 py-2 border-b border-light-border">
      <button
        type="button"
        onClick={onPrevMonth}
        className="p-1.5 hover:bg-secondary/10 rounded-lg transition-colors"
      >
        <ChevronLeft className="w-4 h-4 text-para" />
      </button>
      <span className="text-sm font-semibold text-heading">
        {format(currentMonth, "MMMM yyyy")}
      </span>
      <button
        type="button"
        onClick={onNextMonth}
        className="p-1.5 hover:bg-secondary/10 rounded-lg transition-colors"
      >
        <ChevronRight className="w-4 h-4 text-para" />
      </button>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// CALENDAR GRID COMPONENT
// ═══════════════════════════════════════════════════════════════════

interface CalendarGridProps {
  days: CalendarDay[];
  selectedDate: Date | null;
  onDateClick: (date: Date, isDisabled: boolean) => void;
}

const DAY_NAMES = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

function CalendarGrid({ days, selectedDate, onDateClick }: CalendarGridProps) {
  return (
    <>
      {/* Day Names */}
      <div className="grid grid-cols-7 gap-0.5 px-3 pt-2">
        {DAY_NAMES.map((day) => (
          <div
            key={day}
            className="text-[10px] font-medium text-para-muted text-center py-0.5"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-0.5 px-3 py-2">
        {days.map((day, index) => {
          const isSelected = selectedDate && isSameDay(day.date, selectedDate);
          const isTodayDate = isToday(day.date);

          let cellClasses =
            "w-8 h-8 flex items-center justify-center rounded-md text-xs transition-all ";

          if (!day.isCurrentMonth) {
            cellClasses += "text-para-muted/40";
          } else if (day.isDisabled) {
            cellClasses += "text-para-muted/40 cursor-not-allowed";
          } else if (isSelected) {
            cellClasses +=
              "bg-secondary text-white font-semibold cursor-pointer";
          } else if (isTodayDate) {
            cellClasses +=
              "bg-secondary/20 text-secondary font-semibold hover:bg-secondary/30 cursor-pointer";
          } else {
            cellClasses += "text-heading hover:bg-secondary/10 cursor-pointer";
          }

          return (
            <button
              key={index}
              type="button"
              onClick={() => onDateClick(day.date, day.isDisabled)}
              className={cellClasses}
              disabled={day.isDisabled || !day.isCurrentMonth}
            >
              {day.date.getDate()}
            </button>
          );
        })}
      </div>
    </>
  );
}

// ═══════════════════════════════════════════════════════════════════
// TIME PICKER VIEW COMPONENT
// ═══════════════════════════════════════════════════════════════════

interface TimePickerViewProps {
  selectedDate: Date | null;
  time: string;
  onTimeChange: (time: string) => void;
  onBack: () => void;
  onConfirm: () => void;
}

function TimePickerView({
  selectedDate,
  time,
  onTimeChange,
  onBack,
  onConfirm,
}: TimePickerViewProps) {
  return (
    <>
      {/* Header */}
      <div className="flex items-center gap-2 px-3 py-2 border-b border-light-border">
        <button
          type="button"
          onClick={onBack}
          className="p-1.5 hover:bg-secondary/10 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-4 h-4 text-para" />
        </button>
        <span className="text-sm font-semibold text-heading">Select Time</span>
      </div>

      {/* Selected Date Display */}
      <div className="px-3 py-3 border-b border-light-border bg-secondary/5">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-secondary" />
          <span className="text-sm font-medium text-heading">
            {selectedDate ? format(selectedDate, "EEEE, MMMM d, yyyy") : ""}
          </span>
        </div>
      </div>

      {/* Time Input */}
      <div className="p-4">
        <div className="flex items-center justify-center gap-3 mb-4">
          <input
            type="time"
            value={time}
            onChange={(e) => onTimeChange(e.target.value)}
            className="px-4 py-1 text-base font-medium border border-light-border rounded-lg bg-background text-heading focus:border-secondary focus:outline-none text-center"
          />
        </div>
        <p className="text-xs text-para-muted text-center mb-4">
          Choose the time for your deadline
        </p>
      </div>

      {/* Action Buttons */}
      <div className="px-3 pb-3 flex gap-2">
        <button
          type="button"
          onClick={onBack}
          className="flex-1 py-2 text-para text-xs font-medium rounded-lg hover:bg-secondary/5 transition-colors border border-light-border"
        >
          Back
        </button>
        <button
          type="button"
          onClick={onConfirm}
          className="flex-1 py-2 bg-secondary text-white text-xs font-medium rounded-lg hover:bg-secondary/90 transition-colors"
        >
          Confirm
        </button>
      </div>
    </>
  );
}

// ═══════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════

export default function DateTimePicker({
  value,
  onChange,
  placeholder = "Select date and time",
  disabled = false,
  minDate,
  showTime = true,
  error,
  expandUp = false,
}: DateTimePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [view, setView] = useState<View>("calendar");
  const [currentMonth, setCurrentMonth] = useState(
    value ? new Date(value) : new Date(),
  );
  const [selectedDate, setSelectedDate] = useState<Date | null>(
    value ? new Date(value) : null,
  );
  const [time, setTime] = useState(
    value ? format(new Date(value), "HH:mm") : "23:59",
  );
  const containerRef = useRef<HTMLDivElement>(null);

  // Reset view when closing
  useEffect(() => {
    if (!isOpen) setView("calendar");
  }, [isOpen]);

  // Close on outside click
  useOnClickOutside(containerRef, () => setIsOpen(false), isOpen);

  // Generate calendar days
  const generateCalendarDays = (): CalendarDay[] => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(currentMonth);
    const calendarStart = startOfWeek(monthStart);
    const calendarEnd = endOfWeek(monthEnd);

    const days: CalendarDay[] = [];
    let currentDate = calendarStart;

    while (currentDate <= calendarEnd) {
      days.push({
        date: new Date(currentDate),
        isCurrentMonth: isSameMonth(currentDate, currentMonth),
        isDisabled: minDate
          ? isBefore(currentDate, startOfDay(minDate))
          : false,
      });
      currentDate = addDays(currentDate, 1);
    }

    return days;
  };

  const handleDateClick = (date: Date, isDisabled: boolean) => {
    if (isDisabled) return;
    setSelectedDate(date);
    if (showTime) {
      setView("time");
    } else {
      onChange(format(date, "yyyy-MM-dd'T'HH:mm"));
      setIsOpen(false);
    }
  };

  const handleConfirm = () => {
    if (selectedDate) {
      const [hours, minutes] = time.split(":").map(Number);
      const combined = new Date(selectedDate);
      combined.setHours(hours, minutes, 0, 0);
      onChange(format(combined, "yyyy-MM-dd'T'HH:mm"));
    }
    setIsOpen(false);
  };

  const displayValue = value
    ? format(
        new Date(value),
        showTime ? "MMM d, yyyy 'at' h:mm a" : "MMM d, yyyy",
      )
    : "";

  return (
    <div className="relative" ref={containerRef}>
      {/* Input Button */}
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        className={`
          w-full flex items-center gap-3 px-4 py-3 rounded-lg border text-left transition-all
          ${
            error
              ? "border-red-500 bg-red-50/50"
              : isOpen
                ? "border-secondary bg-secondary/5"
                : "border-light-border bg-background hover:border-secondary/50"
          }
          ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
        `}
        disabled={disabled}
      >
        <Calendar className="w-5 h-5 text-para-muted flex-shrink-0" />
        <span
          className={`flex-1 text-sm ${
            displayValue ? "text-heading" : "text-para-muted"
          }`}
        >
          {displayValue || placeholder}
        </span>
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div
          className={`absolute z-50 ${
            expandUp ? "bottom-full mb-1" : "mt-2"
          } min-w-[280px] bg-main-background border border-light-border rounded-xl shadow-lg overflow-hidden`}
        >
          {view === "calendar" ? (
            <>
              <CalendarHeader
                currentMonth={currentMonth}
                onPrevMonth={() => setCurrentMonth(subMonths(currentMonth, 1))}
                onNextMonth={() => setCurrentMonth(addMonths(currentMonth, 1))}
              />
              <CalendarGrid
                days={generateCalendarDays()}
                selectedDate={selectedDate}
                onDateClick={handleDateClick}
              />
              <div className="px-3 pb-3">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="w-full py-2 text-para-muted text-xs font-medium rounded-lg hover:bg-secondary/5 transition-colors border border-light-border"
                >
                  Cancel
                </button>
              </div>
            </>
          ) : (
            <TimePickerView
              selectedDate={selectedDate}
              time={time}
              onTimeChange={setTime}
              onBack={() => setView("calendar")}
              onConfirm={handleConfirm}
            />
          )}
        </div>
      )}
    </div>
  );
}
