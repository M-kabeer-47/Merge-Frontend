"use client";

import { useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
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

// ═══════════════════════════════════════════════════════════════════
// TYPE DEFINITIONS
// ═══════════════════════════════════════════════════════════════════

export interface Task {
  id: string;
  title: string;
  type: "assignment" | "session" | "personal";
  date: Date;
  time?: string;
  room?: string;
  description?: string;
  completed?: boolean;
}

interface CalendarDay {
  date: Date;
  dateNumber: number;
  isCurrentMonth: boolean;
  isToday: boolean;
  tasks: Task[];
}

interface TaskCalendarProps {
  onDateSelect: (date: Date, tasks: Task[]) => void;
}

// ═══════════════════════════════════════════════════════════════════
// SAMPLE DATA
// ═══════════════════════════════════════════════════════════════════

export const sampleTasks: Task[] = [
  // October 2025 - Current Month Tasks
  // Today's tasks (Oct 12, 2025)
  {
    id: "today-1",
    title: "UI/UX Design Workshop",
    type: "session",
    date: new Date(2025, 9, 12), // Oct 12, 2025
    time: "3:00 PM - 4:30 PM",
    room: "Design Fundamentals",
    description: "Live session covering modern design principles and Figma workflows.",
    completed: true,
  },
  {
    id: "today-2",
    title: "Complete React Hooks Assignment",
    type: "assignment",
    date: new Date(2025, 9, 12), // Oct 12, 2025
    time: "Due by 11:59 PM",
    room: "Advanced React Development",
    description: "Build a custom hooks library with comprehensive tests.",
    completed: false,
  },
  {
    id: "today-3",
    title: "Prepare Presentation Slides",
    type: "personal",
    date: new Date(2025, 9, 12), // Oct 12, 2025
    time: "7:00 PM - 8:30 PM",
    description: "Create slides for next week's project presentation.",
    completed: false,
  },
  {
    id: "1",
    title: "Web Development Midterm",
    type: "assignment",
    date: new Date(2025, 9, 15), // Oct 15, 2025
    time: "Due by 11:59 PM",
    room: "Advanced Web Development",
    description:
      "Complete the full-stack application with authentication and database integration.",
    completed: false,
  },
  {
    id: "2",
    title: "AI Ethics Discussion",
    type: "session",
    date: new Date(2025, 9, 16), // Oct 16, 2025
    time: "2:00 PM - 3:30 PM",
    room: "Artificial Intelligence & Ethics",
    description:
      "Live discussion on ethical implications of AI in modern society.",
    completed: false,
  },
  {
    id: "3",
    title: "Complete React Tutorial",
    type: "personal",
    date: new Date(2025, 9, 17), // Oct 17, 2025
    time: "10:00 AM - 12:00 PM",
    description:
      "Finish advanced hooks tutorial and build practice project.",
    completed: false,
  },
  {
    id: "4",
    title: "Database Optimization Assignment",
    type: "assignment",
    date: new Date(2025, 9, 18), // Oct 18, 2025
    time: "Due by 11:59 PM",
    room: "Database Systems",
    description: "Optimize queries and implement proper indexing strategies.",
    completed: false,
  },
  {
    id: "5",
    title: "Team Project Meeting",
    type: "session",
    date: new Date(2025, 9, 20), // Oct 20, 2025
    time: "4:00 PM - 6:00 PM",
    room: "Software Engineering Project",
    description: "Sprint planning and task distribution for next iteration.",
    completed: false,
  },
  {
    id: "6",
    title: "Review for Algorithms Exam",
    type: "personal",
    date: new Date(2025, 9, 22), // Oct 22, 2025
    time: "6:00 PM - 9:00 PM",
    description: "Study dynamic programming and graph algorithms.",
    completed: false,
  },
  {
    id: "7",
    title: "UI/UX Case Study Presentation",
    type: "assignment",
    date: new Date(2025, 9, 23), // Oct 23, 2025
    time: "Due by 2:00 PM",
    room: "User Experience Design",
    description: "Present redesign proposal with user research and prototypes.",
    completed: false,
  },
  {
    id: "8",
    title: "Cloud Computing Workshop",
    type: "session",
    date: new Date(2025, 9, 24), // Oct 24, 2025
    time: "1:00 PM - 3:00 PM",
    room: "Cloud Architecture & DevOps",
    description: "Hands-on session with AWS services and deployment strategies.",
    completed: false,
  },
  {
    id: "9",
    title: "Practice Coding Problems",
    type: "personal",
    date: new Date(2025, 9, 25), // Oct 25, 2025
    time: "8:00 AM - 10:00 AM",
    description: "LeetCode medium difficulty problems for interview prep.",
    completed: false,
  },
  {
    id: "10",
    title: "Machine Learning Project Demo",
    type: "assignment",
    date: new Date(2025, 9, 28), // Oct 28, 2025
    time: "Due by 11:59 PM",
    room: "Applied Machine Learning",
    description: "Submit final trained model and comprehensive documentation.",
    completed: false,
  },
  {
    id: "11",
    title: "Career Fair Preparation",
    type: "session",
    date: new Date(2025, 9, 29), // Oct 29, 2025
    time: "3:00 PM - 4:30 PM",
    room: "Professional Development",
    description: "Resume review and mock interviews with industry professionals.",
    completed: false,
  },
  {
    id: "12",
    title: "Final Project Planning",
    type: "personal",
    date: new Date(2025, 9, 30), // Oct 30, 2025
    time: "5:00 PM - 7:00 PM",
    description: "Outline architecture and create development timeline for capstone project.",
    completed: false,
  },
  // November 2025 - Upcoming Tasks
  {
    id: "13",
    title: "System Design Quiz",
    type: "assignment",
    date: new Date(2025, 10, 5), // Nov 5, 2025
    time: "Due by 11:59 PM",
    room: "Software Architecture",
    description: "Design scalable distributed systems with proper trade-off analysis.",
    completed: false,
  },
  {
    id: "14",
    title: "Hackathon Kickoff",
    type: "session",
    date: new Date(2025, 10, 8), // Nov 8, 2025
    time: "6:00 PM - 8:00 PM",
    room: "Annual Tech Hackathon",
    description: "24-hour coding challenge with teams competing for prizes.",
    completed: false,
  },
  {
    id: "15",
    title: "Study Group - Final Prep",
    type: "personal",
    date: new Date(2025, 10, 12), // Nov 12, 2025
    time: "7:00 PM - 9:00 PM",
    description: "Group review session for upcoming final examinations.",
    completed: false,
  },
];

// ═══════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════

export default function TaskCalendar({ onDateSelect }: TaskCalendarProps) {
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

  const getTasksForDate = (date: Date): Task[] => {
    return sampleTasks.filter((task) => isSameDay(task.date, date));
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
    onDateSelect(day.date, day.tasks);
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
          const isSelected =
            selectedDate && isSameDay(day.date, selectedDate);

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
            cellClasses += "text-para font-medium hover:bg-secondary/5 cursor-pointer";
          }

          const ariaLabel = `${format(day.date, "MMMM d, yyyy")}${
            hasTasks ? `, ${day.tasks.length} task${day.tasks.length > 1 ? "s" : ""}` : ""
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
