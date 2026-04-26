# Task ID: 12

**Title:** Build the Rewards Page

**Status:** pending

**Dependencies:** 10, 9

**Priority:** medium

**Description:** Create /rewards page at src/app/(with-layout)/rewards/page.tsx showing streak, challenges, and badges

**Details:**

Create d:/FYP/merge/src/app/(with-layout)/rewards/page.tsx as 'use client' component.

Use useRewardsProfile() hook. Show loading skeleton while fetching.

Layout:
- Page header: 'Rewards & Achievements' with Trophy icon. Total XP counter top-right.
- Grid layout: Left column (streak display + 'Go to Billing' CTA if any unspent badge discount). Center/main: 3 ChallengeCard components in a grid (1 col on mobile, 3 col on desktop). Right/Bottom: BadgeCard grid for all 3 badges.
- If any badge is unspent: show a prominent CTA: 'You have a discount waiting! → Go to Billing'

Use Framer Motion for entrance animation: stagger children fade-in + slide-up (same pattern as other pages if they use it).

**Test Strategy:**

Page renders with data from backend. Challenges show correct progress. Badges show locked/unlocked state correctly.
