"use client";
import { Flame, Trophy } from "lucide-react";
import { UserStreak } from "@/types/rewards";

interface Props {
  streak: UserStreak;
}

function getLast7Days(lastActivityDate: string | null): boolean[] {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return Array.from({ length: 7 }, (_, i) => {
    if (!lastActivityDate) return false;
    const day = new Date(today);
    day.setDate(today.getDate() - (6 - i));
    const last = new Date(lastActivityDate);
    last.setHours(0, 0, 0, 0);
    return last >= day && last <= day;
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
  const days = getLast7Days(streak.lastActivityDate);
  const dayLabels = ["M", "T", "W", "T", "F", "S", "S"];
  const isActive = streak.currentStreak > 0;
  const todayIdx = 6;

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

      {/* 7-day strip */}
      <div className="flex flex-1 items-center justify-between gap-1.5">
        {days.map((active, i) => (
          <div
            key={i}
            className="flex flex-1 flex-col items-center gap-1.5"
          >
            <div
              className={`flex h-9 w-full items-center justify-center rounded-xl transition-all ${
                active
                  ? "bg-accent text-white"
                  : i === todayIdx
                    ? "bg-secondary/5 ring-1 ring-dashed ring-accent/40"
                    : "bg-secondary/5 ring-1 ring-light-border"
              }`}
            >
              {active ? (
                <Flame className="h-4 w-4" strokeWidth={2.5} />
              ) : (
                <span className="text-xs text-para-muted">·</span>
              )}
            </div>
            <span
              className={`text-[10px] font-semibold ${
                i === todayIdx && !active
                  ? "text-accent"
                  : "text-para-muted"
              }`}
            >
              {dayLabels[i]}
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
