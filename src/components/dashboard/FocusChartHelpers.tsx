"use client";

import { TrendingUp, Calendar, Clock } from "lucide-react";

export const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-background border border-light-border rounded-lg p-3 shadow-lg">
        <p className="font-semibold text-heading text-sm mb-2">
          {data.sessionName}
        </p>
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs text-para">
            <Calendar className="w-3.5 h-3.5" />
            <span>{data.date}</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-para">
            <Clock className="w-3.5 h-3.5" />
            <span>{data.durationMinutes} minutes</span>
          </div>
          <div className="flex items-center gap-2 text-xs font-semibold">
            <TrendingUp className="w-3.5 h-3.5 text-primary" />
            <span className="text-primary">{data.focusPercent}% Focus</span>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

export const CustomDot = (props: any) => {
  const { cx, cy } = props;

  return (
    <circle
      cx={cx}
      cy={cy}
      r={5}
      fill="#2f1a58"
      stroke="#ffffff"
      strokeWidth={2}
      className="hover:r-6 transition-all"
    />
  );
};
