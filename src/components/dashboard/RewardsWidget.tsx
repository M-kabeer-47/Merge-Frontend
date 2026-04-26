"use client";

import {
  Trophy, Flame, BookOpen, CheckCircle, FileText, Users, Target,
  CalendarCheck, Video, HelpCircle, PlusCircle, PenLine, Monitor,
  ClipboardCheck, Award, Star, Upload, Book,
} from "lucide-react";
import useRewardsProfile from "@/hooks/rewards/use-rewards-profile";
import { ChallengeProgress, BadgeWithStatus } from "@/types/rewards";

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  iconColor: string;
  iconBg: string;
  progress: number;
  total: number;
  points: number;
  unlocked: boolean;
}

// Maps the icon string from the backend challenge definition to a Lucide icon
const ICON_MAP: Record<string, React.ElementType> = {
  "check-circle": CheckCircle, "file-text": FileText, "users": Users,
  "target": Target, "calendar-check": CalendarCheck, "book-open": BookOpen,
  "video": Video, "help-circle": HelpCircle, "plus-circle": PlusCircle,
  "trophy": Trophy, "pen-line": PenLine, "monitor": Monitor,
  "clipboard-check": ClipboardCheck, "flame": Flame, "award": Award,
  "star": Star, "upload": Upload, "book": Book,
};

const TIER_COLOR: Record<string, { color: string; bg: string }> = {
  daily:   { color: "text-info",      bg: "bg-info/10" },
  weekly:  { color: "text-accent",    bg: "bg-accent/10" },
  monthly: { color: "text-secondary", bg: "bg-secondary/10" },
};

function toAchievement(ch: ChallengeProgress): Achievement {
  const tierColor = TIER_COLOR[ch.type] ?? TIER_COLOR.daily;
  return {
    id: ch.id,
    title: ch.name,
    description: ch.description,
    icon: ICON_MAP[ch.icon] ?? CheckCircle,
    iconColor: tierColor.color,
    iconBg: tierColor.bg,
    progress: ch.currentCount,
    total: ch.target,
    points: ch.points,
    unlocked: ch.isCompleted,
  };
}

function badgeToAchievement(bs: BadgeWithStatus): Achievement {
  const tierColor = TIER_COLOR[bs.badge.tier as keyof typeof TIER_COLOR] ?? TIER_COLOR.daily;
  return {
    id: `badge-${bs.badge.id}`,
    title: bs.badge.name,
    description: bs.badge.description,
    icon: ICON_MAP[bs.badge.icon] ?? Trophy,
    iconColor: tierColor.color,
    iconBg: tierColor.bg,
    progress: bs.userBadge ? 1 : 0,
    total: 1,
    points: bs.badge.discountPercentage * 10, // crude xp conversion
    unlocked: !!bs.userBadge,
  };
}

export default function RewardsWidget() {
  const { profile, isLoading } = useRewardsProfile();

  const achievements: Achievement[] = [
    ...(profile?.challenges ?? []).map(toAchievement),
    ...(profile?.badges ?? []).map(badgeToAchievement),
  ];

  const unlockedCount = achievements.filter((a) => a.unlocked).length;
  const totalPoints = profile?.totalPoints ?? 0;

  if (isLoading) {
    return (
      <div className="bg-background border border-light-border rounded-xl shadow-sm flex flex-col max-h-[735px]">
        <div className="p-5 space-y-3">
          <div className="h-4 w-32 bg-secondary/10 rounded animate-pulse" />
          <div className="h-16 bg-secondary/10 rounded-lg animate-pulse" />
          <div className="h-2 bg-secondary/10 rounded-full animate-pulse" />
        </div>
        <div className="flex-1 px-5 pb-5 space-y-2">
          {[1, 2, 3].map((i) => <div key={i} className="h-16 bg-secondary/10 rounded-lg animate-pulse" />)}
        </div>
      </div>
    );
  }

  // Sort: pending first, then completed
  const displayedAchievements = [...achievements].sort((a, b) => {
    // Pending (not unlocked) comes first
    if (!a.unlocked && b.unlocked) return -1;
    if (a.unlocked && !b.unlocked) return 1;
    return 0;
  });

  return (
    <div className="bg-background border border-light-border rounded-xl shadow-sm flex flex-col max-h-[735px]">
      {/* Header - Fixed */}
      <div className="p-5 pb-4 flex-shrink-0">
        <h3 className="font-raleway font-semibold text-heading text-base mb-3">
          Your Achievements
        </h3>

        {/* Summary Stats */}
        <div className="bg-gradient-to-r from-primary/5 to-secondary/5 rounded-lg p-3 mb-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-para-muted mb-0.5">Progress</p>
              <p className="text-lg font-bold text-heading">
                {unlockedCount}/{achievements.length}
                <span className="text-sm font-normal text-para-muted ml-1">
                  Unlocked
                </span>
              </p>
            </div>
            <div className="flex items-center gap-1">
              <Trophy className="w-5 h-5 text-accent" />
              <span className="text-lg font-bold text-accent">
                {totalPoints} XP
              </span>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-secondary/10 rounded-full h-2">
          <div
            className="bg-gradient-to-r from-primary to-secondary h-2 rounded-full transition-all duration-500"
            style={{
              width: `${(unlockedCount / achievements.length) * 100}%`,
            }}
          />
        </div>
      </div>

      {/* Achievements List - Scrollable */}
      <div className="flex-1 overflow-y-auto px-5 pb-5 min-h-0">
        <div className="space-y-2">
          {displayedAchievements.map((achievement) => {
            const Icon = achievement.icon;
            const progressPercent =
              (achievement.progress / achievement.total) * 100;

            return (
              <div
                key={achievement.id}
                className={`
                  group relative rounded-lg p-3 border-[0.5px] transition-all duration-200
                  ${
                    achievement.unlocked
                      ? "bg-gradient-to-br from-accent/5 to-primary/5 border-primary/20 hover:border-primary/40 hover:shadow-md"
                      : "bg-background border-light-border hover:border-secondary/30 hover:shadow-sm"
                  }
                `}
              >
                <div className="flex items-start gap-3">
                  {/* Icon Badge */}
                  <div
                    className={`
                      relative flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-200
                      ${
                        achievement.unlocked
                          ? achievement.iconBg
                          : "bg-para-muted/10"
                      }
                      ${
                        achievement.unlocked
                          ? "group-hover:scale-110"
                          : "opacity-50"
                      }
                    `}
                  >
                    <Icon
                      className={`w-6 h-6 ${
                        achievement.unlocked
                          ? achievement.iconColor
                          : "text-para-muted"
                      }`}
                    />

                    {/* Unlock Badge */}
                    {achievement.unlocked && (
                      <div className="absolute -top-1 -right-1 w-5 h-5 bg-success rounded-full flex items-center justify-center border-2 border-background">
                        <CheckCircle
                          className="w-3 h-3 text-white"
                          strokeWidth={3}
                        />
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h4
                        className={`text-sm font-semibold ${
                          achievement.unlocked
                            ? "text-heading"
                            : "text-para-muted"
                        }`}
                      >
                        {achievement.title}
                      </h4>

                      {/* Points Badge */}
                      <span
                        className={`
                          flex-shrink-0 px-2 py-0.5 rounded-full text-xs font-medium
                          ${
                            achievement.unlocked
                              ? "bg-accent/20 text-accent"
                              : "bg-para-muted/10 text-para-muted"
                          }
                        `}
                      >
                        +{achievement.points} XP
                      </span>
                    </div>

                    <p className="text-xs text-para-muted mb-2">
                      {achievement.description}
                    </p>

                    {/* Progress */}
                    {!achievement.unlocked && (
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-medium text-para">
                            {achievement.progress}/{achievement.total}
                          </span>
                          <span className="text-xs text-para-muted">
                            {Math.round(progressPercent)}%
                          </span>
                        </div>
                        <div className="w-full bg-secondary/10 rounded-full h-1.5">
                          <div
                            className="bg-secondary h-1.5 rounded-full transition-all duration-300"
                            style={{ width: `${progressPercent}%` }}
                          />
                        </div>
                      </div>
                    )}

                    {achievement.unlocked && (
                      <div className="flex items-center gap-1">
                        <CheckCircle className="w-3.5 h-3.5 text-success" />
                        <span className="text-xs font-medium text-success">
                          Completed!
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Shine effect for unlocked achievements */}
                {achievement.unlocked && (
                  <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
