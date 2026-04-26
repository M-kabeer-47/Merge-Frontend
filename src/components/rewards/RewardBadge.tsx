"use client";
import { Lock, Star } from "lucide-react";

interface Props {
  tier: "daily" | "weekly" | "monthly";
  earned: boolean;
  size?: number;
}

export default function RewardBadge({ tier, earned, size = 88 }: Props) {
  if (!earned) {
    return (
      <div
        style={{ width: size, height: size }}
        className="inline-flex items-center justify-center rounded-full bg-secondary/10 ring-1 ring-light-border"
      >
        <Lock
          style={{ width: size * 0.32, height: size * 0.32 }}
          className="text-para-muted/60"
        />
      </div>
    );
  }

  const gradient = {
    daily: "bg-gradient-to-br from-accent via-accent/85 to-accent/55",
    weekly: "bg-gradient-to-br from-accent via-secondary to-secondary/70",
    monthly: "bg-gradient-to-br from-accent via-secondary to-primary",
  }[tier];

  const wingColor = tier === "weekly" ? "var(--secondary)" : "var(--accent)";

  return (
    <div
      className="relative inline-flex items-center justify-center"
      style={{ width: size, height: size }}
    >
      {/* Wings — weekly + monthly */}
      {tier !== "daily" && (
        <>
          <svg
            className="pointer-events-none absolute z-0"
            style={{
              top: "50%",
              left: -size * 0.42,
              transform: "translateY(-50%)",
              width: size * 0.55,
              height: size * 0.7,
            }}
            viewBox="0 0 44 56"
            fill="none"
            aria-hidden
          >
            <path
              d="M 44 18 Q 22 6 4 16 Q 12 18 18 22 Q 6 26 2 36 Q 14 30 24 32 Q 18 22 30 26 Z"
              fill={wingColor}
              opacity="0.85"
            />
            <path
              d="M 40 22 Q 22 14 12 22 Q 18 22 24 24 Z"
              fill="white"
              opacity="0.25"
            />
          </svg>
          <svg
            className="pointer-events-none absolute z-0"
            style={{
              top: "50%",
              right: -size * 0.42,
              transform: "translateY(-50%) scaleX(-1)",
              width: size * 0.55,
              height: size * 0.7,
            }}
            viewBox="0 0 44 56"
            fill="none"
            aria-hidden
          >
            <path
              d="M 44 18 Q 22 6 4 16 Q 12 18 18 22 Q 6 26 2 36 Q 14 30 24 32 Q 18 22 30 26 Z"
              fill={wingColor}
              opacity="0.85"
            />
            <path
              d="M 40 22 Q 22 14 12 22 Q 18 22 24 24 Z"
              fill="white"
              opacity="0.25"
            />
          </svg>
        </>
      )}

      {/* Crown — monthly only */}
      {tier === "monthly" && (
        <svg
          className="pointer-events-none absolute z-20"
          style={{
            top: -size * 0.22,
            width: size * 0.6,
            height: size * 0.32,
          }}
          viewBox="0 0 48 26"
          fill="none"
          aria-hidden
        >
          <path
            d="M 4 22 L 6 8 L 14 14 L 24 2 L 34 14 L 42 8 L 44 22 Z"
            fill="var(--accent)"
            stroke="var(--accent)"
            strokeWidth="0.6"
            strokeLinejoin="round"
          />
          <path
            d="M 6 8 L 14 14 L 24 2 L 34 14 L 42 8"
            fill="none"
            stroke="white"
            strokeWidth="0.4"
            opacity="0.4"
          />
          <circle cx="14" cy="13" r="1.7" fill="white" opacity="0.7" />
          <circle cx="24" cy="3" r="2.2" fill="white" opacity="0.85" />
          <circle cx="34" cy="13" r="1.7" fill="white" opacity="0.7" />
        </svg>
      )}

      {/* Ribbon — monthly only */}
      {tier === "monthly" && (
        <svg
          className="pointer-events-none absolute z-0"
          style={{
            bottom: -size * 0.28,
            width: size * 0.7,
            height: size * 0.45,
          }}
          viewBox="0 0 56 36"
          fill="none"
          aria-hidden
        >
          <path
            d="M 8 0 L 8 30 L 20 22 L 28 32 L 36 22 L 48 30 L 48 0 Z"
            fill="var(--primary)"
          />
          <path
            d="M 10 4 L 46 4"
            stroke="white"
            strokeWidth="0.5"
            opacity="0.3"
          />
        </svg>
      )}

      {/* Medal body */}
      <div
        className={`relative z-10 inline-flex items-center justify-center rounded-full ${gradient} shadow-lg shadow-accent/30`}
        style={{ width: size, height: size }}
      >
        {/* Outer rim shading */}
        <div className="pointer-events-none absolute inset-1 rounded-full bg-gradient-to-b from-white/30 via-transparent to-black/10" />

        {/* Top highlight */}
        <div
          className="pointer-events-none absolute rounded-full bg-white/45 blur-[2px]"
          style={{
            width: size * 0.42,
            height: size * 0.08,
            top: size * 0.1,
          }}
        />

        {/* Inner face */}
        <div
          className="relative flex items-center justify-center rounded-full bg-gradient-to-br from-white/30 via-white/10 to-transparent ring-2 ring-white/40"
          style={{ width: size * 0.7, height: size * 0.7 }}
        >
          <Star
            className="text-white drop-shadow"
            style={{ width: size * 0.34, height: size * 0.34 }}
            fill="white"
            strokeWidth={1.25}
          />
        </div>
      </div>
    </div>
  );
}
