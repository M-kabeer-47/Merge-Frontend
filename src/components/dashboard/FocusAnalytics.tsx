"use client";

import { useState } from "react";
import FocusAnalyticsChart from "./FocusChart";
import { TrendingUp, TrendingDown } from "lucide-react";

interface FocusSessionData {
  sessionName: string;
  date: string;
  focusPercent: number;
  durationMinutes: number;
}

export default function FocusAnalytics() {
  // Sample data - replace with real data from your backend
  const [focusData] = useState<FocusSessionData[]>([
    {
      sessionName: "React Study",
      date: "Oct 6",
      focusPercent: 85,
      durationMinutes: 90,
    },
    {
      sessionName: "ML Concepts",
      date: "Oct 7",
      focusPercent: 72,
      durationMinutes: 60,
    },
    {
      sessionName: "Database Review",
      date: "Oct 8",
      focusPercent: 90,
      durationMinutes: 75,
    },
    {
      sessionName: "UI/UX Workshop",
      date: "Oct 9",
      focusPercent: 68,
      durationMinutes: 120,
    },
    {
      sessionName: "Algorithms",
      date: "Oct 10",
      focusPercent: 88,
      durationMinutes: 80,
    },
    {
      sessionName: "Web Dev",
      date: "Oct 11",
      focusPercent: 95,
      durationMinutes: 100,
    },
    {
      sessionName: "Testing",
      date: "Oct 12",
      focusPercent: 78,
      durationMinutes: 65,
    },
  ]);

  // Calculate average focus
  const averageFocus = Math.round(
    focusData.reduce((sum, session) => sum + session.focusPercent, 0) /
      focusData.length
  );

  // Calculate improvement from last week (mock calculation)
  const improvement = 12; // This should be calculated based on previous week's data

  // Set target threshold
  const targetFocus = 80;

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-raleway font-semibold text-heading">
          Focus Analytics
        </h2>
        <button className="text-primary hover:text-primary/80 text-sm font-medium transition-colors">
          This Week
        </button>
      </div>

      <div className="bg-background border border-light-border rounded-xl p-6 shadow-sm transition-all duration-300 ease-in-out">
        {/* Stats Row */}

        {/* Chart */}
        <FocusAnalyticsChart
          data={focusData}
          averageFocus={averageFocus}
          threshold={targetFocus}
        />

        {/* Summary Message */}
      </div>
    </div>
  );
}
