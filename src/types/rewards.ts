export type ChallengeTier = 'daily' | 'weekly' | 'monthly';
export type BadgeTier = 'daily' | 'weekly' | 'monthly';

export interface UserStreak {
  currentStreak: number;
  longestStreak: number;
  lastActivityDate: string | null;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  tier: BadgeTier;
  discountPercentage: number;
}

export interface UserBadge {
  id: string;
  badge: Badge;
  earnedAt: string;
  periodMonth: string;
  isRedeemed: boolean;
  lsDiscountCode?: string | null;
}

export interface BadgeWithStatus {
  badge: Badge;
  userBadge: UserBadge | null;
}

// Per-tier progress *within the current calendar month*. Drives the
// X / threshold display on the badge cards.
export interface MonthlyProgress {
  completed: number;
  threshold: number;
}

export interface BadgeHistoryEntry {
  periodMonth: string; // "YYYY-MM"
  badges: BadgeWithStatus[];
}

export interface ChallengeProgress {
  id: string;
  name: string;
  description: string;
  icon: string;
  type: ChallengeTier;
  actionType: string;
  currentCount: number;
  target: number;
  isCompleted: boolean;
  points: number;
  periodStart: string;
  expiresAt: string;
}

export interface RewardsProfile {
  streak: UserStreak;
  badges: BadgeWithStatus[];
  monthlyProgress: Record<ChallengeTier, MonthlyProgress>;
  badgeHistory: BadgeHistoryEntry[];
  totalPoints: number;
  challenges: ChallengeProgress[];
}
