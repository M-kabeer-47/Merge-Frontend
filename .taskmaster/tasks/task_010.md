# Task ID: 10

**Title:** Build Reward UI Components

**Status:** pending

**Dependencies:** 8

**Priority:** medium

**Description:** Create StreakDisplay, ChallengeCard, and BadgeCard components in src/components/rewards/

**Details:**

Use Tailwind CSS design tokens: bg-main-background, text-heading, text-para-muted, border-light-border, text-primary, bg-primary/10, text-accent, bg-accent/10, text-success. Use Lucide React icons. Match the visual style of existing RewardsWidget.

1. StreakDisplay.tsx: Show Flame icon + currentStreak in large bold font. Longest streak as secondary text. 7 small circles (filled primary if active, muted if inactive) representing last 7 days based on lastActivityDate. Motivational message (e.g. '🔥 Keep it up!' for streak > 3).

2. ChallengeCard.tsx: Props: challenge: ChallengeProgress. Type badge (Daily=blue/info, Weekly=purple/accent, Monthly=gold/secondary). SVG circular progress ring. currentCount/target display. '7 consecutive days' counter below. Framer Motion scale animation on complete.

3. BadgeCard.tsx: Props: badge: Badge, userBadge?: UserBadge. Unlocked: colored icon, badge name, discount % chip in accent. Locked: opacity-50, lock icon overlay, 'Complete X challenges to unlock'.

**Test Strategy:**

Components render correctly with mock data. Progress rings show correct percentages. Locked/unlocked states display properly.
