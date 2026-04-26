"use client";

import { motion } from "framer-motion";
import {
  Trophy,
  Zap,
  Flame,
  CheckCircle, FileText, Users, Target, CalendarCheck,
  BookOpen, Video, HelpCircle, PlusCircle, PenLine,
  Monitor, ClipboardCheck, Clock,
} from "lucide-react";
import useRewardsProfile from "@/hooks/rewards/use-rewards-profile";
import StreakDisplay from "@/components/rewards/StreakDisplay";
import BadgeCard from "@/components/rewards/BadgeCard";
import RewardBadge from "@/components/rewards/RewardBadge";
import type { ChallengeTier, ChallengeProgress } from "@/types/rewards";

const container = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } };
const item = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } };

const NEXT_MILESTONE = 1000;

const ICON_MAP: Record<string, React.ElementType> = {
  "check-circle": CheckCircle, "file-text": FileText, "users": Users,
  "target": Target, "calendar-check": CalendarCheck, "book-open": BookOpen,
  "video": Video, "help-circle": HelpCircle, "plus-circle": PlusCircle,
  "trophy": Trophy, "pen-line": PenLine, "monitor": Monitor,
  "clipboard-check": ClipboardCheck, "flame": Flame,
};

const TIER_META: Record<
  ChallengeTier,
  { label: string; bar: string; ring: string; ringSoft: string; text: string; iconBg: string; tint: string }
> = {
  daily: {
    label: "Daily",
    bar: "bg-info",
    ring: "ring-info/40",
    ringSoft: "ring-info/15",
    text: "text-info",
    iconBg: "bg-info",
    tint: "from-info/[0.06] to-transparent",
  },
  weekly: {
    label: "Weekly",
    bar: "bg-accent",
    ring: "ring-accent/40",
    ringSoft: "ring-accent/15",
    text: "text-accent",
    iconBg: "bg-accent",
    tint: "from-accent/[0.06] to-transparent",
  },
  monthly: {
    label: "Monthly",
    bar: "bg-secondary",
    ring: "ring-secondary/40",
    ringSoft: "ring-secondary/15",
    text: "text-secondary",
    iconBg: "bg-secondary",
    tint: "from-secondary/[0.06] to-transparent",
  },
};

function getTimeLeft(expiresAt: string): string {
  const diff = new Date(expiresAt).getTime() - Date.now();
  if (diff <= 0) return "Expired";
  const h = Math.floor(diff / 3_600_000);
  const m = Math.floor((diff % 3_600_000) / 60_000);
  if (h >= 24) return `${Math.floor(h / 24)}d`;
  if (h > 0) return `${h}h ${m}m`;
  return `${m}m`;
}

// Hex-clipped icon tile — distinctive vs round/square icon containers
const HEX_CLIP = "polygon(25% 5%, 75% 5%, 100% 50%, 75% 95%, 25% 95%, 0% 50%)";

function SegmentedBar({
  current,
  target,
  colorClass,
  completed,
}: {
  current: number;
  target: number;
  colorClass: string;
  completed: boolean;
}) {
  const SEGMENTS = 5;
  const fraction = Math.min(current / target, 1);
  return (
    <div className="flex flex-1 gap-[3px]">
      {Array.from({ length: SEGMENTS }).map((_, i) => {
        const segStart = i / SEGMENTS;
        const segEnd = (i + 1) / SEGMENTS;
        const fillPct =
          fraction >= segEnd
            ? 100
            : fraction <= segStart
              ? 0
              : ((fraction - segStart) / (segEnd - segStart)) * 100;
        return (
          <div
            key={i}
            className="h-1.5 flex-1 overflow-hidden rounded-sm bg-secondary/10"
          >
            <div
              className={`h-full ${
                completed ? "bg-success" : colorClass
              } transition-all`}
              style={{ width: `${fillPct}%` }}
            />
          </div>
        );
      })}
    </div>
  );
}

function ChallengeEntry({ challenge }: { challenge: ChallengeProgress }) {
  const Icon = ICON_MAP[challenge.icon] ?? CheckCircle;
  const meta = TIER_META[challenge.type];
  const timeLeft = challenge.expiresAt ? getTimeLeft(challenge.expiresAt) : null;

  return (
    <li
      className={`relative px-4 py-3.5 transition-colors ${
        challenge.isCompleted
          ? "bg-success/[0.04]"
          : "hover:bg-secondary/[0.03]"
      }`}
    >
      <div className="flex items-start gap-3">
        {/* Hex icon — clipped polygon, distinct from round/square */}
        <div className="relative flex-shrink-0">
          <div
            className={`flex h-11 w-11 items-center justify-center ${
              challenge.isCompleted ? "bg-success" : meta.iconBg
            } text-white`}
            style={{ clipPath: HEX_CLIP }}
          >
            <Icon className="h-5 w-5" strokeWidth={2.25} />
          </div>
        </div>

        {/* Content */}
        <div className="min-w-0 flex-1">
          <div className="flex items-baseline justify-between gap-2">
            <h4 className="truncate text-sm font-bold text-heading">
              {challenge.name}
            </h4>
            <span className="flex flex-shrink-0 items-center gap-0.5 rounded-full bg-accent/10 px-2 py-0.5 text-[10px] font-bold text-accent ring-1 ring-accent/20">
              <Zap className="h-2.5 w-2.5" strokeWidth={2.5} />+
              {challenge.points}
            </span>
          </div>
          <p className="mt-0.5 truncate text-[11px] text-para-muted">
            {challenge.description}
          </p>

          {/* Segmented progress + count + status */}
          <div className="mt-2.5 flex items-center gap-2">
            <SegmentedBar
              current={challenge.currentCount}
              target={challenge.target}
              colorClass={meta.bar}
              completed={challenge.isCompleted}
            />
            <span className="font-raleway text-[11px] font-bold tabular-nums text-heading">
              {challenge.currentCount}
              <span className="font-medium text-para-muted">
                /{challenge.target}
              </span>
            </span>
          </div>

          {/* Footer: status / time */}
          <div className="mt-1.5 flex items-center justify-between text-[10px]">
            {challenge.isCompleted ? (
              <span className="inline-flex items-center gap-1 font-semibold text-success">
                <CheckCircle className="h-3 w-3" strokeWidth={2.5} /> Completed
              </span>
            ) : timeLeft ? (
              <span className="inline-flex items-center gap-1 text-para-muted">
                <Clock className="h-3 w-3" /> {timeLeft} left
              </span>
            ) : (
              <span />
            )}
            {challenge.consecutiveCount > 0 && (
              <span className="inline-flex items-center gap-1 text-para-muted">
                <Flame className="h-3 w-3 text-accent" />
                <span className="font-semibold text-heading">
                  {challenge.consecutiveCount}
                </span>
                {challenge.type === "daily"
                  ? "d"
                  : challenge.type === "weekly"
                    ? "w"
                    : "mo"}{" "}
                streak
              </span>
            )}
          </div>
        </div>
      </div>
    </li>
  );
}

export default function RewardsPage() {
  const { profile, isLoading } = useRewardsProfile();

  const totalXP = profile?.totalPoints ?? 0;
  const streakDays = profile?.streak?.currentStreak ?? 0;
  const allBadges = profile?.badges ?? [];
  const earnedBadges = allBadges.filter((b) => b.userBadge);

  const milestone =
    Math.ceil(Math.max(totalXP, 1) / NEXT_MILESTONE) * NEXT_MILESTONE;
  const milestoneStart = milestone - NEXT_MILESTONE;
  const progressInMilestone = totalXP - milestoneStart;
  const milestonePct = Math.min(
    (progressInMilestone / NEXT_MILESTONE) * 100,
    100,
  );

  const tierOrder: ChallengeTier[] = ["daily", "weekly", "monthly"];
  const challengesByTier = tierOrder
    .map((tier) => ({
      tier,
      list: (profile?.challenges ?? []).filter((c) => c.type === tier),
    }))
    .filter((g) => g.list.length > 0);

  if (isLoading) {
    return (
      <div className="space-y-6 p-6">
        <div className="h-48 animate-pulse rounded-3xl bg-secondary/10" />
        <div className="h-32 animate-pulse rounded-3xl bg-secondary/10" />
        <div className="h-40 animate-pulse rounded-3xl bg-secondary/10" />
      </div>
    );
  }

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-10 p-6"
    >
      {/* Hero */}
      <motion.div
        variants={item}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary via-secondary to-accent p-7 shadow-2xl shadow-primary/20 ring-1 ring-secondary/30 sm:p-9"
      >
        <div className="pointer-events-none absolute -right-16 -top-20 h-64 w-64 rounded-full bg-white/15 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -left-12 h-56 w-56 rounded-full bg-white/10 blur-3xl" />

        <div className="relative z-10">
          <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-white/80">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-white/80" />
            Rewards & Achievements
          </div>

          <h1 className="mt-3 font-raleway text-3xl font-bold text-white sm:text-4xl">
            Keep the streak going
          </h1>
          <p className="mt-1 max-w-xl text-sm text-white/85">
            Earn XP from challenges, unlock badges, and trade them for
            discounts on Pro &amp; Max plans.
          </p>

          {/* Stats */}
          <div className="mt-7 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="rounded-2xl bg-white/10 p-4 backdrop-blur-sm ring-1 ring-white/20">
              <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-white/75">
                <Zap className="h-3.5 w-3.5" /> Total XP
              </div>
              <p className="mt-1.5 font-raleway text-3xl font-bold leading-none text-white">
                {totalXP.toLocaleString()}
              </p>
              <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-white/15">
                <div
                  className="h-full rounded-full bg-white"
                  style={{ width: `${milestonePct}%` }}
                />
              </div>
              <p className="mt-1.5 text-[11px] text-white/70">
                {Math.max(milestone - totalXP, 0)} XP to{" "}
                {milestone.toLocaleString()}
              </p>
            </div>

            <div className="rounded-2xl bg-white/10 p-4 backdrop-blur-sm ring-1 ring-white/20">
              <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-white/75">
                <Flame className="h-3.5 w-3.5" /> Current streak
              </div>
              <p className="mt-1.5 font-raleway text-3xl font-bold leading-none text-white">
                {streakDays}
                <span className="ml-1 text-base font-medium text-white/70">
                  {streakDays === 1 ? "day" : "days"}
                </span>
              </p>
              <p className="mt-3 text-[11px] text-white/70">
                {streakDays === 0
                  ? "Complete a challenge to start"
                  : "Keep going — don't break it!"}
              </p>
            </div>
          </div>

          {/* Trophies — compact strip */}
          {earnedBadges.length > 0 && (
            <div className="relative mt-4 overflow-hidden rounded-2xl bg-white/10 px-5 py-3.5 ring-1 ring-white/25 backdrop-blur-sm">
              <div className="flex items-center gap-5 overflow-x-auto">
                <div className="flex flex-shrink-0 items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/80">
                  <Trophy className="h-3.5 w-3.5" />
                  Earned
                </div>

                <div className="h-8 w-px flex-shrink-0 bg-white/20" />

                {earnedBadges.map(({ badge }) => {
                  const tier = badge.tier as "daily" | "weekly" | "monthly";
                  return (
                    <div
                      key={badge.tier}
                      className="flex flex-shrink-0 items-center gap-3"
                    >
                      {/* Badge with halo */}
                      <div className="relative flex h-14 w-20 items-center justify-center">
                        <div className="pointer-events-none absolute inset-0 rounded-full bg-white/35 blur-xl" />
                        <div
                          className={`relative flex justify-center ${
                            tier === "monthly" ? "pt-2" : ""
                          }`}
                        >
                          <RewardBadge tier={tier} earned size={44} />
                        </div>
                      </div>

                      <div className="min-w-0">
                        <p className="font-raleway text-sm font-bold leading-tight text-white drop-shadow">
                          {badge.name}
                        </p>
                        <span className="mt-0.5 inline-flex items-center rounded-full bg-white/95 px-2 py-0.5 text-[10px] font-bold text-primary">
                          {badge.discountPercentage}% off
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </motion.div>

      {/* Streak strip */}
      <motion.div variants={item}>
        <StreakDisplay
          streak={
            profile?.streak ?? {
              currentStreak: 0,
              longestStreak: 0,
              lastActivityDate: null,
            }
          }
        />
      </motion.div>

      {/* Challenges — 3 tier boards */}
      <motion.div variants={item}>
        <div className="mb-4 flex items-center gap-2">
          <Trophy className="h-4 w-4 text-para-muted" />
          <h2 className="text-base font-semibold text-heading">
            Active challenges
          </h2>
        </div>

        <div className="grid grid-cols-1 items-start gap-5 lg:grid-cols-3">
          {challengesByTier.map(({ tier, list }) => {
            const meta = TIER_META[tier];
            const completed = list.filter((c) => c.isCompleted).length;
            const groupPct = (completed / list.length) * 100;
            return (
              <div
                key={tier}
                className={`overflow-hidden rounded-2xl bg-background ring-1 ${meta.ringSoft}`}
              >
                {/* Tier header — strong tier identity */}
                <div className="relative">
                  <div
                    className={`pointer-events-none absolute inset-0 bg-gradient-to-b ${meta.tint}`}
                  />
                  <div className="relative flex items-center justify-between gap-3 px-5 pt-4">
                    <div className="flex items-center gap-2.5">
                      <span
                        className={`inline-block h-2.5 w-2.5 rounded-full ${meta.iconBg}`}
                      />
                      <h3
                        className={`font-raleway text-sm font-bold uppercase tracking-wider ${meta.text}`}
                      >
                        {meta.label}
                      </h3>
                    </div>
                    <span className="text-[11px] font-semibold text-para-muted">
                      {completed} / {list.length}
                    </span>
                  </div>
                  <div className="relative mx-5 mt-2 mb-3 h-1 overflow-hidden rounded-full bg-secondary/10">
                    <div
                      className={`h-full rounded-full transition-all ${meta.bar}`}
                      style={{ width: `${groupPct}%` }}
                    />
                  </div>
                </div>

                {/* Entries */}
                <ul className="divide-y divide-light-border">
                  {list.map((ch) => (
                    <ChallengeEntry key={ch.id} challenge={ch} />
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* Badges */}
      <motion.div variants={item}>
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Trophy className="h-4 w-4 text-para-muted" />
            <h2 className="text-base font-semibold text-heading">
              Badges &amp; Discounts
            </h2>
          </div>
          <p className="text-xs text-para-muted">
            Earn badges to unlock discounts
          </p>
        </div>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
          {allBadges.map(({ badge, userBadge }) => (
            <BadgeCard key={badge.tier} badge={badge} userBadge={userBadge} />
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}
