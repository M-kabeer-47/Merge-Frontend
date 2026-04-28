"use client";
import { Flame, Trophy } from "lucide-react";
import { UserStreak } from "@/types/rewards";

interface Props {
  streak: UserStreak;
}

const WEEKDAY_LETTERS = ["S", "M", "T", "W", "T", "F", "S"];
const MONTH_SHORT = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

interface StreakDay {
  date: Date;
  weekday: string;
  dayNum: number;
  monthShort: string;
  isToday: boolean;
  isFuture: boolean;
  isLit: boolean;
}

// 3 past + today + 3 future. A day is "lit" if it falls inside the user's
// current streak window: from (lastActivityDate - currentStreak + 1) up to
// lastActivityDate. Future days are never lit.
function getStreakWindow(
  lastActivityDate: string | null,
  currentStreak: number,
): StreakDay[] {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const last = lastActivityDate ? new Date(lastActivityDate) : null;
  if (last) last.setHours(0, 0, 0, 0);
  const litStart =
    last && currentStreak > 0
      ? new Date(last.getTime() - (currentStreak - 1) * 86_400_000)
      : null;

  return Array.from({ length: 7 }, (_, i) => {
    const date = new Date(today);
    date.setDate(today.getDate() + (i - 3));
    const isToday = date.getTime() === today.getTime();
    const isFuture = date.getTime() > today.getTime();
    const isLit =
      !isFuture &&
      !!litStart &&
      !!last &&
      date.getTime() >= litStart.getTime() &&
      date.getTime() <= last.getTime();
    return {
      date,
      weekday: WEEKDAY_LETTERS[date.getDay()],
      dayNum: date.getDate(),
      monthShort: MONTH_SHORT[date.getMonth()],
      isToday,
      isFuture,
      isLit,
    };
  });
}

function getMessage(streak: number): string {
  if (streak === 0) return "Complete a task to start your streak.";
  if (streak < 3) return "Good start — keep going!";
  if (streak < 7) return "You're on fire!";
  if (streak < 14) return "Incredible streak — don't break it!";
  return "Legendary dedication.";
}

export default function StreakDisplay({ streak }: Props) {
  const days = getStreakWindow(streak.lastActivityDate, streak.currentStreak);
  const isActive = streak.currentStreak > 0;

  return (
    <div className="flex flex-col items-stretch gap-5 rounded-2xl bg-background p-5 ring-1 ring-light-border md:flex-row md:items-center md:gap-7 md:p-6">
      {/* Streak count */}
      <div className="flex items-center gap-3.5">
        <div
          className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl ${
            isActive
              ? "bg-accent text-white"
              : "bg-secondary/10 text-para-muted"
          }`}
        >
          <Flame className="h-6 w-6" strokeWidth={2.25} />
        </div>

        <div>
          <p className="text-[11px] font-semibold uppercase tracking-wider text-para-muted">
            Current streak
          </p>
          <p className="font-raleway text-2xl font-bold leading-none text-heading">
            {streak.currentStreak}
            <span className="ml-1 text-sm font-medium text-para-muted">
              {streak.currentStreak === 1 ? "day" : "days"}
            </span>
          </p>
          <p className="mt-1 text-[11px] text-para-muted">
            {getMessage(streak.currentStreak)}
          </p>
        </div>
      </div>

      <div className="hidden h-12 w-px bg-light-border md:block" />

      {/* 7-day strip — 3 past + today + 3 future */}
      <div className="flex flex-1 items-center justify-between gap-1.5">
        {days.map((d, i) => (
          <div key={i} className="flex flex-1 flex-col items-center gap-1">
            <span
              className={`text-[10px] font-semibold uppercase tracking-wide ${
                d.isToday ? "text-accent" : "text-para-muted"
              }`}
            >
              {d.weekday}
            </span>
            <div
              className={`flex h-9 w-full items-center justify-center rounded-xl transition-all ${
                d.isLit
                  ? "bg-accent text-white"
                  : d.isToday
                    ? "bg-secondary/5 ring-1 ring-dashed ring-accent/40"
                    : d.isFuture
                      ? "bg-transparent ring-1 ring-dashed ring-light-border opacity-60"
                      : "bg-secondary/5 ring-1 ring-light-border"
              }`}
            >
              {d.isLit ? (
                <Flame className="h-4 w-4" strokeWidth={2.5} />
              ) : (
                <span
                  className={`text-[11px] font-semibold ${
                    d.isToday ? "text-accent" : "text-para-muted"
                  }`}
                >
                  {d.dayNum}
                </span>
              )}
            </div>
            <span className="text-[9px] font-medium text-para-muted">
              {d.monthShort}
            </span>
          </div>
        ))}
      </div>

      <div className="hidden h-12 w-px bg-light-border md:block" />

      {/* Best */}
      <div className="flex items-center gap-2.5">
        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-secondary/10 text-secondary ring-1 ring-secondary/20">
          <Trophy className="h-4 w-4" />
        </div>
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-wider text-para-muted">
            Best streak
          </p>
          <p className="font-raleway text-lg font-bold leading-none text-heading">
            {streak.longestStreak}
            <span className="ml-1 text-xs font-medium text-para-muted">
              days
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
