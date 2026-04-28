"use client";
import { useState } from "react";
import { Lock, CheckCircle, Tag, Copy, Check } from "lucide-react";
import { Badge, UserBadge } from "@/types/rewards";
import { format } from "date-fns";
import RewardBadge from "./RewardBadge";

interface Props {
  badge: Badge;
  userBadge?: UserBadge | null;
  monthlyProgress?: { completed: number; threshold: number };
}

const CRITERIA: Record<string, (n: number) => string> = {
  daily: (n) => `Complete ${n} daily challenges this month`,
  weekly: (n) => `Complete ${n} weekly challenges this month`,
  monthly: (n) => `Complete ${n} monthly challenges this month`,
};

const HOW_TO: Record<string, (n: number) => string> = {
  daily: (n) => `Complete a total of ${n} daily challenges within this calendar month to unlock this badge.`,
  weekly: (n) => `Complete a total of ${n} weekly challenges within this calendar month to unlock this badge.`,
  monthly: (n) => `Complete a total of ${n} monthly challenges within this calendar month to unlock this badge.`,
};

const DISCOUNT_INFO: Record<string, string> = {
  daily: "10% off Pro or Max plan",
  weekly: "20% off Pro or Max plan",
  monthly: "30% off Pro or Max plan",
};

export default function BadgeCard({ badge, userBadge, monthlyProgress }: Props) {
  const [copied, setCopied] = useState(false);
  const earned = !!userBadge;

  const handleCopy = () => {
    if (!userBadge?.lsDiscountCode) return;
    navigator.clipboard.writeText(userBadge.lsDiscountCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className={`group relative flex h-full min-h-[380px] flex-col overflow-hidden rounded-2xl bg-background p-6 transition-all duration-300 ${
        earned
          ? "ring-1 ring-accent/30 shadow-md hover:shadow-lg"
          : "ring-1 ring-light-border"
      }`}
    >
      {/* Status indicator */}
      <div className="absolute right-4 top-4 z-30">
        {earned ? (
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-success/15 ring-1 ring-success/30">
            <CheckCircle className="h-3.5 w-3.5 text-success" strokeWidth={2.5} />
          </div>
        ) : (
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-secondary/10 ring-1 ring-light-border">
            <Lock className="h-3 w-3 text-para-muted" />
          </div>
        )}
      </div>

      {/* Reward medal — extra padding for monthly's crown + ribbon */}
      <div
        className={`relative flex justify-center ${
          badge.tier === "monthly" ? "mb-4 mt-6 pb-6" : "mb-2 mt-2"
        }`}
      >
        <RewardBadge
          tier={badge.tier as "daily" | "weekly" | "monthly"}
          earned={earned}
          size={88}
        />
      </div>

      {/* Name + criteria */}
      <div className="relative mt-4 text-center">
        <h4
          className={`font-raleway text-base font-bold ${
            earned ? "text-heading" : "text-para"
          }`}
        >
          {badge.name}
        </h4>
        <p className="mt-1 text-xs leading-relaxed text-para-muted">
          {earned
            ? DISCOUNT_INFO[badge.tier]
            : CRITERIA[badge.tier](monthlyProgress?.threshold ?? 0)}
        </p>
      </div>

      {/* Monthly progress bar — shown only when not yet earned this month */}
      {!earned && monthlyProgress && (
        <div className="relative mt-4 px-1">
          <div className="flex items-center justify-between text-[10px] font-medium text-para-muted">
            <span>Progress this month</span>
            <span className="font-raleway font-bold tabular-nums text-heading">
              {monthlyProgress.completed}
              <span className="font-medium text-para-muted">
                /{monthlyProgress.threshold}
              </span>
            </span>
          </div>
          <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-secondary/10">
            <div
              className="h-full rounded-full bg-accent transition-all"
              style={{
                width: `${Math.min(
                  (monthlyProgress.completed / monthlyProgress.threshold) * 100,
                  100,
                )}%`,
              }}
            />
          </div>
        </div>
      )}

      {/* Discount chip */}
      <div className="relative mt-3 flex justify-center">
        <div
          className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 ring-1 ${
            earned
              ? "bg-accent/10 text-accent ring-accent/20"
              : "bg-secondary/5 text-para-muted ring-light-border"
          }`}
        >
          <Tag className="h-3 w-3" />
          <span className="text-[11px] font-semibold">
            {badge.discountPercentage}% off Pro &amp; Max
          </span>
        </div>
      </div>

      {/* Body */}
      <div className="relative mt-auto pt-5">
        {earned ? (
          <div className="space-y-2">
            {userBadge.lsDiscountCode ? (
              <>
                <p className="text-[10px] font-medium uppercase tracking-wider text-para-muted">
                  Your discount code
                </p>
                <button
                  onClick={handleCopy}
                  className="group/code flex w-full items-center justify-between gap-2 rounded-xl bg-background px-3 py-2.5 ring-1 ring-light-border transition-all hover:ring-accent/40"
                >
                  <span className="truncate font-mono text-xs font-semibold text-heading">
                    {userBadge.lsDiscountCode}
                  </span>
                  {copied ? (
                    <Check className="h-3.5 w-3.5 flex-shrink-0 text-success" />
                  ) : (
                    <Copy className="h-3.5 w-3.5 flex-shrink-0 text-para-muted transition-colors group-hover/code:text-accent" />
                  )}
                </button>
                <div className="flex items-center justify-between text-[10px] text-para-muted">
                  <span>
                    Earned {format(new Date(userBadge.earnedAt), "dd MMM yyyy")}
                  </span>
                  {userBadge.isRedeemed ? (
                    <span className="font-medium text-success">✓ Used</span>
                  ) : (
                    <span className="font-medium text-accent">Auto-applied</span>
                  )}
                </div>
              </>
            ) : (
              <div className="rounded-xl bg-background/50 p-3 ring-1 ring-light-border">
                <p className="text-[11px] text-para-muted">
                  {userBadge.isRedeemed ? (
                    <span className="font-medium text-success">
                      ✓ Discount used
                    </span>
                  ) : (
                    <span className="font-medium text-accent">
                      Discount applies automatically at checkout
                    </span>
                  )}
                </p>
                <p className="mt-1 text-[10px] text-para-muted">
                  Earned {format(new Date(userBadge.earnedAt), "dd MMM yyyy")}
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-light-border bg-secondary/5 p-3">
            <div className="mb-1.5 flex items-center gap-1.5">
              <Lock className="h-3 w-3 text-para-muted" />
              <p className="text-[10px] font-bold uppercase tracking-wider text-para-muted">
                How to unlock
              </p>
            </div>
            <p className="text-[11px] leading-relaxed text-para-muted">
              {HOW_TO[badge.tier](monthlyProgress?.threshold ?? 0)}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
