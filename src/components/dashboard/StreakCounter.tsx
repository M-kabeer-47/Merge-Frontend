"use client";

import { Flame } from "lucide-react";
import useRewardsProfile from "@/hooks/rewards/use-rewards-profile";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
export default function StreakCounter() {
  const { profile } = useRewardsProfile();
  const streakDays = profile?.streak.currentStreak ?? 0;
  const lastActivityDate = profile?.streak.lastActivityDate ?? null;

  const getWeekDays = () => {
    const days = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const last = lastActivityDate ? new Date(lastActivityDate) : null;
    if (last) last.setHours(0, 0, 0, 0);

    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      // Mark as completed if this day is within the current streak window
      const daysAgo = i;
      const isCompleted = last !== null && daysAgo < streakDays && date <= last;
      days.push({
        day: date.toLocaleDateString("en-US", { weekday: "short" }).charAt(0),
        date: date.getDate(),
        isCompleted,
        isToday: i === 0,
      });
    }
    return days;
  };

  const weekDays = getWeekDays();

  return (
    <div className="bg-background border border-light-border rounded-xl p-6 shadow-sm">
      {/* Flame Icon Circle */}
      <div className="flex justify-center mb-4">
        <div className="w-24 h-24 rounded-full bg-accent/10 flex items-center justify-center relative">
          <div className="rounded-full bg-accent/10 flex items-center justify-center">
            <DotLottieReact
              src="/Fire.lottie"
              autoplay
              loop
              style={{ width: "70px", height: "70px" }}
            />
          </div>
        </div>
      </div>

      {/* Streak Number */}
      <div className="text-center mb-2">
        <p className="text-6xl font-bold text-heading leading-none">
          {streakDays}
        </p>
      </div>

      {/* Title */}
      <div className="text-center mb-1">
        <h3 className="text-xl font-semibold text-heading">Days</h3>
      </div>

      {/* Encouragement Message */}
      <p className="text-center text-sm text-para-muted mb-6">
        {streakDays > 0
          ? `${streakDays > 3 ? "You're on fire!" : "Keep it up!"} 🔥`
          : "Complete tasks to start your streak!"}
      </p>

      {/* Week Days Grid */}
      <div className="grid grid-cols-7 gap-2">
        {weekDays.map((day, index) => (
          <div key={index} className="flex flex-col items-center gap-1">
            {/* Day Letter */}
            <span className="text-xs font-medium text-para-muted uppercase">
              {day.day}
            </span>

            {/* Date Circle */}
            <div
              className={`
                w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all
                ${
                  day.isCompleted
                    ? "bg-accent text-white"
                    : day.isToday
                      ? "border-2 border-primary text-heading bg-background"
                      : "bg-background border border-light-border text-para-muted"
                }
              `}
            >
              {day.isCompleted ? (
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={3}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              ) : (
                <span>{day.date}</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
