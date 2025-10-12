"use client";

import { useState } from "react";
import {
  Trophy,
  Users,
  Video,
  FileText,
  Download,
  CheckCircle,
  Flame,
  Star,
  Award,
} from "lucide-react";

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

export default function RewardsWidget() {
  const [achievements] = useState<Achievement[]>([
    {
      id: "1",
      title: "Room Explorer",
      description: "Join your first room",
      icon: Users,
      iconColor: "text-primary",
      iconBg: "bg-primary/10",
      progress: 1,
      total: 1,
      points: 10,
      unlocked: true,
    },
    {
      id: "2",
      title: "Active Learner",
      description: "Attend 5 live sessions",
      icon: Video,
      iconColor: "text-info",
      iconBg: "bg-info/10",
      progress: 3,
      total: 5,
      points: 25,
      unlocked: false,
    },
    {
      id: "3",
      title: "Note Master",
      description: "Create 10 notes",
      icon: FileText,
      iconColor: "text-accent",
      iconBg: "bg-accent/10",
      progress: 7,
      total: 10,
      points: 20,
      unlocked: false,
    },
    {
      id: "4",
      title: "Resource Hunter",
      description: "Download 5 files",
      icon: Download,
      iconColor: "text-secondary",
      iconBg: "bg-secondary/10",
      progress: 5,
      total: 5,
      points: 15,
      unlocked: true,
    },
    {
      id: "5",
      title: "Assignment Hero",
      description: "Submit 3 assignments on time",
      icon: CheckCircle,
      iconColor: "text-success",
      iconBg: "bg-success/10",
      progress: 2,
      total: 3,
      points: 30,
      unlocked: false,
    },
    {
      id: "6",
      title: "Week Warrior",
      description: "Maintain 7-day focus streak",
      icon: Flame,
      iconColor: "text-accent",
      iconBg: "bg-accent/10",
      progress: 4,
      total: 7,
      points: 50,
      unlocked: false,
    },
    {
      id: "7",
      title: "Perfect Score",
      description: "Score 100% on an assignment",
      icon: Star,
      iconColor: "text-accent",
      iconBg: "bg-accent/10",
      progress: 0,
      total: 1,
      points: 40,
      unlocked: false,
    },
    {
      id: "8",
      title: "Top Contributor",
      description: "Share 10 resources in rooms",
      icon: Award,
      iconColor: "text-primary",
      iconBg: "bg-primary/10",
      progress: 3,
      total: 10,
      points: 35,
      unlocked: false,
    },
  ]);

  const unlockedCount = achievements.filter((a) => a.unlocked).length;
  const totalPoints = achievements
    .filter((a) => a.unlocked)
    .reduce((sum, a) => sum + a.points, 0);

  // Sort: pending first, then completed
  const displayedAchievements = [...achievements].sort((a, b) => {
    // Pending (not unlocked) comes first
    if (!a.unlocked && b.unlocked) return -1;
    if (a.unlocked && !b.unlocked) return 1;
    return 0;
  });

  return (
    <div className="bg-background border border-light-border rounded-xl shadow-sm flex flex-col max-h-[600px]">
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
