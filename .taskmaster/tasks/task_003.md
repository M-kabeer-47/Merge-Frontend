# Task ID: 3

**Title:** Build Rewards NestJS Module

**Status:** pending

**Dependencies:** 1

**Priority:** high

**Description:** Create src/rewards/ module with service and controller for tracking streaks, challenges, and badges

**Details:**

Create d:/FYP/merge-backend/src/rewards/ with rewards.module.ts, rewards.service.ts, rewards.controller.ts.

Key service methods:
- onTaskCompleted(userId, completedAt): Update streak. Get/create challenge progress for current daily/weekly/monthly periods. Increment counts. If count >= target (3/10/30), mark completed, increment consecutiveCount. Call checkAndAwardBadges. Wrap everything in try/catch.
- checkAndAwardBadges(userId, challengeType): Check threshold (daily=7 consecutive, weekly=4, monthly=1). If not already earned, create UserBadge, call createLsDiscountCode(), notify user via NotificationService.
- createLsDiscountCode(discountPercent): POST to https://api.lemonsqueezy.com/v1/discounts with Bearer auth. Create code BADGE-{uuid}, amount_type=percent, amount=discountPercent, is_limited_to_products=false, is_limited_redemptions=true, max_redemptions=1. Return discount code string.
- getUserRewardsProfile(userId): Return streak + badges (with badge relation) + challenges for current periods + totalPoints (daily badge=100pts, weekly=200pts, monthly=300pts)
- getUserChallenges(userId): Return current daily/weekly/monthly progress objects with target counts.

**Test Strategy:**

Test onTaskCompleted by completing tasks and verifying streak + challenge progress increments. Verify badge award after consecutive completions.

## Subtasks

### 3.1. Create rewards.module.ts

**Status:** pending  
**Dependencies:** None  

Create rewards module file with TypeORM feature registration and NotificationModule import

**Details:**

Module imports: TypeOrmModule.forFeature([UserStreak, Badge, UserBadge, UserChallengeProgress, User]), NotificationModule. Exports: RewardsService. Providers: RewardsService. Controllers: RewardsController.

### 3.2. Create rewards.service.ts - streak and challenge logic

**Status:** pending  
**Dependencies:** 3.1  

Implement onTaskCompleted, streak update, and challenge progress tracking

**Details:**

Implement onTaskCompleted() which: (1) Finds or creates UserStreak. Updates lastActivityDate. If last activity was yesterday, increment currentStreak; if today, skip; if >1 day gap, reset to 1. Update longestStreak if needed. Save. (2) For each of daily/weekly/monthly, get current period start date (start of today / start of this week Monday / start of this month). Find or create UserChallengeProgress. If already completed for this period, skip. Increment currentCount. Check if >= target. If just completed, set isCompleted=true, completedAt=now, increment consecutiveCount. Save. Call checkAndAwardBadges if newly completed.

### 3.3. Create rewards.service.ts - badge award and LemonSqueezy discount

**Status:** pending  
**Dependencies:** 3.2  

Implement checkAndAwardBadges and createLsDiscountCode methods

**Details:**

checkAndAwardBadges(userId, challengeType): Query latest challenge progress for type, check consecutiveCount against threshold (daily=7, weekly=4, monthly=1). Check if user already has this badge type. If not: create UserBadge. Call createLsDiscountCode(badge.discountPercentage). Store code in userBadge.lsDiscountCode. Save. Then call NotificationService to send in-app notification: 'You earned the [Badge Name] badge! You have a [X]% discount available.'.

createLsDiscountCode(): Use node-fetch or axios to POST to LemonSqueezy API. Handle errors gracefully — if LS API fails, still save the badge but with null discount code.

### 3.4. Create rewards.service.ts - profile and challenges query methods

**Status:** pending  
**Dependencies:** 3.2  

Implement getUserRewardsProfile and getUserChallenges

**Details:**

getUserRewardsProfile: Find UserStreak (or return default). Find UserBadges with badge relation eager. Calculate totalPoints from earned badges (100/200/300 per tier). Get current challenges via getUserChallenges. Return combined object.

getUserChallenges: For each type, compute current periodStart. Find UserChallengeProgress. If none found, return default { currentCount:0, isCompleted:false, consecutiveCount:0 }. Include target (3/10/30) in returned object.

### 3.5. Create rewards.controller.ts

**Status:** pending  
**Dependencies:** 3.4  

Create REST controller with GET /rewards/profile and GET /rewards/challenges endpoints

**Details:**

@Controller('rewards'), uses global JwtAuthGuard. GET /rewards/profile → getUserRewardsProfile(req.user.id). GET /rewards/challenges → getUserChallenges(req.user.id). Both return plain JSON.
