# Task ID: 14

**Title:** Update Dashboard Widgets with Real Rewards Data

**Status:** pending

**Dependencies:** 9

**Priority:** medium

**Description:** Replace hardcoded mock data in RewardsWidget.tsx and StreakCounter.tsx with live data from the rewards API

**Details:**

1. d:/FYP/merge/src/components/dashboard/RewardsWidget.tsx (currently uses hardcoded useState):
- Add useRewardsProfile() hook
- Map the returned profile.badges (UserBadge[]) and profile.challenges (ChallengeProgress[]) to the existing Achievement interface shape: { id, title: badge.badge.name or challenge type name, description, icon: mapped from tier, progress: currentCount, total: target, points, unlocked: isCompleted/earned }
- Keep ALL existing JSX and styling exactly as-is — only change the data source
- Add loading skeleton (or keep showing last data) while fetching

2. d:/FYP/merge/src/components/dashboard/StreakCounter.tsx:
- Import useRewardsProfile hook
- Replace hardcoded streak number with profile.streak.currentStreak
- Replace hardcoded 7-day array with real computation from profile.streak.lastActivityDate
- Show loading state gracefully

**Test Strategy:**

Dashboard shows real streak and achievement data. Completing a calendar task causes the dashboard widgets to update after React Query cache invalidation.
