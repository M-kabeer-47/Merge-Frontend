"use client";

import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";
import { TrendingUp, Calendar, Clock } from "lucide-react";

/**
 * Focus Analytics Chart Component
 *
 * @interface FocusSessionData
 * @property {string} sessionName - Name/title of the focus session
 * @property {string} date - Date of the session (formatted string)
 * @property {number} focusPercent - Focus percentage (0-100)
 * @property {number} durationMinutes - Session duration in minutes
 */
interface FocusSessionData {
  sessionName: string;
  date: string;
  focusPercent: number;
  durationMinutes: number;
}

interface FocusAnalyticsChartProps {
  /** Array of focus session data */
  data: FocusSessionData[];
  /** Average focus percentage across all sessions */
  averageFocus: number;
  /** Optional threshold line (e.g., target focus percentage) */
  threshold?: number;
}

/**
 * Custom Tooltip Component for displaying session details
 */
const CustomTooltip = ({ active, payload }: any) => {
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

/**
 * Custom dot component for the line chart
 */
const CustomDot = (props: any) => {
  const { cx, cy, payload } = props;

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

export default function FocusAnalyticsChart({
  data,
  averageFocus,
  threshold,
}: FocusAnalyticsChartProps) {
  const [primaryColor, setPrimaryColor] = useState("#2f1a58");
  const [isResizing, setIsResizing] = useState(false);

  // Get CSS variables on mount
  useEffect(() => {
    const root = document.documentElement;
    const computedStyle = getComputedStyle(root);

    setPrimaryColor(
      computedStyle.getPropertyValue("--primary").trim() || "#2f1a58"
    );
  }, []);

  // Handle smooth resize
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    
    const handleResize = () => {
      setIsResizing(true);
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        setIsResizing(false);
      }, 300);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      clearTimeout(timeoutId);
    };
  }, []);

  // For mobile: show last 10 sessions if data length > 10
  const displayData = data.length > 10 ? data.slice(-10) : data;

  return (
    <div
      className="w-full transition-all duration-300 ease-in-out"
      role="region"
      aria-label="Focus Analytics Chart showing percentage of focus per session"
    >
      <ResponsiveContainer 
        width="100%" 
        height={400}
        debounce={50}
      >
        <AreaChart
          data={displayData}
          margin={{
            top: 20,
            right: 30,
            left: 0,
            bottom: 20,
          }}
        >
          {/* Define gradient for area fill */}
          <defs>
            <linearGradient id="colorFocus" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={primaryColor} stopOpacity={0.3} />
              <stop offset="95%" stopColor={primaryColor} stopOpacity={0} />
            </linearGradient>
          </defs>

          {/* Grid */}
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" opacity={0.5} />

          {/* X Axis - Session Names */}
          <XAxis
            dataKey="sessionName"
            tick={{ fill: "#6b7280", fontSize: 12 }}
            label={{
              value: "Session / Date",
              position: "insideBottom",
              offset: -10,
              style: { fill: "#3a424d", fontWeight: 500, fontSize: 13 },
            }}
          />

          {/* Y Axis - Focus Percentage */}
          <YAxis
            domain={[0, 100]}
            tick={{ fill: "#6b7280", fontSize: 12 }}
            label={{
              value: "Focus %",
              angle: -90,
              position: "insideLeft",
              style: { fill: "#3a424d", fontWeight: 500, fontSize: 13 },
            }}
            tickFormatter={(value) => `${value}%`}
          />

          {/* Tooltip */}
          <Tooltip
            content={<CustomTooltip />}
            cursor={{
              stroke: primaryColor,
              strokeWidth: 1,
              strokeDasharray: "5 5",
            }}
          />

          {/* Area */}
          <Area
            type="monotone"
            dataKey="focusPercent"
            stroke={primaryColor}
            strokeWidth={3}
            fill="url(#colorFocus)"
            animationDuration={800}
            dot={<CustomDot />}
            activeDot={{
              r: 7,
              fill: primaryColor,
              stroke: "#ffffff",
              strokeWidth: 3,
            }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
