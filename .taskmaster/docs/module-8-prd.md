# Module 8: Subscription & Reward System — PRD

## Overview

Add a reward system and subscription/payment system to the Merge platform. Users earn badges by completing daily/weekly/monthly calendar task challenges. Earned badges unlock discount codes for subscription plan upgrades. Subscriptions are managed via LemonSqueezy (PKR pricing, Pakistani merchant support, free test mode).

## Tech Stack Context

- **Frontend**: Next.js 16, React Query (@tanstack/react-query), Tailwind CSS v4, Radix UI / shadcn, Framer Motion, Sonner (toasts), Lucide React icons
- **Backend**: NestJS 11, TypeORM 0.3.27, PostgreSQL, Bull (job queues), Firebase FCM (push notifications), SendGrid (email)
- **Auth**: Custom JWT with JwtAuthGuard + @Public() decorator. All routes use JwtAuthGuard by default via APP_GUARD
- **API proxy**: Frontend calls its own `/api/[...path]` route which proxies to NestJS backend at `http://localhost:3001`
- **Existing patterns**: Feature modules in `src/` (each has entity + service + controller + module files). Entities in `src/entities/`. React Query hooks in `src/hooks/[feature]/`. Server API calls in `src/server-api/[feature].ts`

## Subscription Plans

| Plan | Price | Rooms | Notes | Lecture Summary | Focus Tracker |
|------|-------|-------|-------|-----------------|---------------|
| Free | 0 PKR | 2 rooms | 5 notes | No | No |
| Basic | 100 PKR/month | 5 rooms | 10 notes | No | No |
| Pro | 200 PKR/month | 10 rooms | 20 notes | Yes | Yes |
| Max | 500 PKR/month | 50 rooms | Unlimited | Yes | Yes |

## Reward System

### Challenges (resets each period)
- **Daily Challenge**: Complete 3 calendar tasks before their deadline today (resets at midnight)
- **Weekly Challenge**: Complete 10 calendar tasks in the current Mon–Sun period
- **Monthly Challenge**: Complete 30 calendar tasks in the current calendar month

### Badges
| Badge | Criteria | Discount |
|-------|----------|----------|
| Daily Champion | 7 consecutive daily challenges completed | 10% off any plan |
| Weekly Scholar | 4 consecutive weekly challenges completed | 20% off any plan |
| Monthly Master | 1 monthly challenge completed | 30% off any plan |

When a badge is awarded, the backend creates a single-use LemonSqueezy discount code and stores it on the UserBadge record. The code is auto-applied when the user initiates checkout.

### Trigger
Task completion fires from `PATCH /calendar/{id}/status` with `status: "completed"`. This calls `RewardsService.onTaskCompleted(userId, completedAt)` which updates streak, challenge progress, and awards badges.

---

## Backend Tasks

### Task 1: Create Reward & Subscription Database Entities

Create the following TypeORM entity files in `d:/FYP/merge-backend/src/entities/`:

1. **`user-streak.entity.ts`**: Tracks user streaks.
   - Fields: id (uuid), user (ManyToOne → User), currentStreak (number, default 0), longestStreak (number, default 0), lastActivityDate (Date nullable), updatedAt (UpdateDateColumn)

2. **`badge.entity.ts`**: Static badge definitions (seeded).
   - Fields: id (uuid), name (string), description (string), icon (string), tier (enum: daily|weekly|monthly), discountPercentage (number), isActive (boolean, default true)

3. **`user-badge.entity.ts`**: Badges earned by users.
   - Fields: id (uuid), user (ManyToOne → User), badge (ManyToOne → Badge), earnedAt (Date), lsDiscountCode (string nullable), isRedeemed (boolean, default false), createdAt (CreateDateColumn)

4. **`user-challenge-progress.entity.ts`**: Tracks challenge progress per period.
   - Fields: id (uuid), user (ManyToOne → User), challengeType (enum: daily|weekly|monthly), periodStart (Date), currentCount (number, default 0), isCompleted (boolean, default false), completedAt (Date nullable), consecutiveCount (number, default 0), updatedAt (UpdateDateColumn)
   - Unique constraint on (user, challengeType, periodStart)

5. **`subscription-plan.entity.ts`**: Static plan definitions (seeded).
   - Fields: id (uuid), name (enum: free|basic|pro|max), displayName (string), priceMonthly (number), currency (string, default PKR), lsVariantId (string nullable), features (simple-json array of strings), roomLimit (number), noteLimit (number, -1 = unlimited), hasLectureSummary (boolean), hasFocusTracker (boolean), isActive (boolean, default true)

6. **`user-subscription.entity.ts`**: User's active subscription.
   - Fields: id (uuid), user (OneToOne → User), plan (ManyToOne → SubscriptionPlan), status (enum: active|cancelled|expired|past_due|trialing, default active), lsSubscriptionId (string nullable, unique), lsCustomerId (string nullable), currentPeriodStart (Date nullable), currentPeriodEnd (Date nullable), cancelAtPeriodEnd (boolean, default false), appliedDiscountPercentage (number, default 0), createdAt (CreateDateColumn), updatedAt (UpdateDateColumn)

7. **`payment-record.entity.ts`**: Payment history.
   - Fields: id (uuid), user (ManyToOne → User), subscription (ManyToOne → UserSubscription nullable), amountPkr (number), status (enum: paid|failed|refunded), lsOrderId (string nullable), invoiceUrl (string nullable), paidAt (Date nullable), createdAt (CreateDateColumn)

Also add `subscriptionTier` field (enum: free|basic|pro|max, default free) to `d:/FYP/merge-backend/src/entities/user.entity.ts`.

### Task 2: Write SQL Migration

Create `d:/FYP/merge-backend/migrations/2026-04-25-add-rewards-and-subscription.sql` with:
- CREATE TABLE IF NOT EXISTS for all 7 new tables with proper foreign keys and indexes
- INSERT seed data for `badges` table (3 rows: Daily Champion, Weekly Scholar, Monthly Master)
- INSERT seed data for `subscription_plans` table (4 rows: free/basic/pro/max with correct limits)
- ALTER TABLE users ADD COLUMN IF NOT EXISTS subscription_tier

### Task 3: Build the Rewards NestJS Module

Create `d:/FYP/merge-backend/src/rewards/` with:

**`rewards.module.ts`**: Import TypeOrmModule.forFeature([UserStreak, Badge, UserBadge, UserChallengeProgress, User]) + NotificationModule. Export RewardsService.

**`rewards.service.ts`** with methods:
- `onTaskCompleted(userId: string, completedAt: Date)`: Called when a calendar task is marked completed. Steps: (1) upsert UserStreak - set lastActivityDate, increment currentStreak if consecutive day, update longestStreak. (2) Get or create UserChallengeProgress for daily/weekly/monthly current periods. (3) Increment currentCount for each. (4) If currentCount >= target (3/10/30), mark isCompleted, increment consecutiveCount. (5) Call checkAndAwardBadges for each newly completed challenge. All steps wrapped in a try/catch so calendar task updates never fail due to rewards errors.
- `checkAndAwardBadges(userId, challengeType)`: Check if consecutive count meets badge threshold (7/4/1). If badge not already earned, create UserBadge, call createLsDiscountCode(), send notification via NotificationService.
- `createLsDiscountCode(discountPercent)`: POST to LemonSqueezy API `https://api.lemonsqueezy.com/v1/discounts` with Authorization Bearer header using LEMON_SQUEEZY_API_KEY env var. Create a unique code like `BADGE-{uuid}`, amount_off = discountPercent as percentage, single-use, applies to all variants. Return the code string.
- `getUserRewardsProfile(userId)`: Return { streak: UserStreak, badges: UserBadge[] with relations, challenges: current period progress for all 3 types, totalPoints: sum of points per earned badge (daily=100, weekly=200, monthly=300) }
- `getUserChallenges(userId)`: Return current daily/weekly/monthly ChallengeProgress objects including target counts and whether completed

**`rewards.controller.ts`**:
- `GET /rewards/profile` — protected by JwtAuthGuard (inherited from global guard), calls getUserRewardsProfile(req.user.id)
- `GET /rewards/challenges` — calls getUserChallenges(req.user.id)

### Task 4: Hook Rewards into Calendar Task Completion

In `d:/FYP/merge-backend/src/calendar/calendar.service.ts`:
- Inject RewardsService
- In the `updateStatus()` method, after saving the event, if `dto.status === TaskStatus.COMPLETED`, call `this.rewardsService.onTaskCompleted(userId, new Date())` with await but wrapped in try/catch to prevent reward errors from breaking task updates.

In `d:/FYP/merge-backend/src/calendar/calendar.module.ts`:
- Import RewardsModule (use forwardRef if needed to avoid circular dependency)

### Task 5: Build the Subscription NestJS Module

Install `@lemonsqueezy/lemonsqueezy.js` in the backend.

Create `d:/FYP/merge-backend/src/subscription/` with:

**`plan-limits.const.ts`**: Export a constant map `PLAN_LIMITS` keyed by tier (free/basic/pro/max) with values `{ roomLimit, noteLimit, hasLectureSummary, hasFocusTracker }`. Use -1 for unlimited notes.

**`subscription.module.ts`**: Import TypeOrmModule.forFeature for all subscription + payment entities + User entity. Import BullModule.registerQueue({ name: 'subscription' }). Import NotificationModule. Export SubscriptionService.

**`subscription.service.ts`** with methods:
- `getPlans()`: Return all active SubscriptionPlans ordered by priceMonthly ASC
- `getUserSubscription(userId)`: Find UserSubscription with plan relation. If none exists, return a virtual "free" plan object.
- `createCheckout(userId, planId)`: (1) Find plan. (2) Find user's unspent UserBadge with highest discount. (3) Initialize LemonSqueezy with lemonSqueezySetup({ apiKey }). (4) Call createCheckout API with variantId, custom redirect URLs (FRONTEND_URL/billing?success=true and FRONTEND_URL/billing?cancelled=true), custom user data. (5) If discount code exists, include it. (6) Return checkout URL.
- `cancelSubscription(userId)`: Find active subscription, call LS cancel subscription API, set cancelAtPeriodEnd = true.
- `getPaymentHistory(userId, page, limit)`: Return paginated PaymentRecord list for user ordered by createdAt DESC.
- `handleWebhook(rawBody: Buffer, signature: string)`: (1) Verify HMAC-SHA256 signature using crypto module. (2) Parse JSON. (3) Switch on eventName: subscription_created → upsert UserSubscription + update user.subscriptionTier + schedule renewal reminder job. subscription_updated → update status/period. subscription_cancelled → set cancelAtPeriodEnd. subscription_expired → set expired + reset user.subscriptionTier to free + notify. order_created → create PaymentRecord. subscription_payment_failed → set past_due + notify user.
- `scheduleRenewalReminder(subscriptionId, renewalDate)`: Add Bull job to 'subscription' queue delayed to 7 days before renewalDate.

**`subscription.controller.ts`**:
- `GET /subscriptions/plans` — @Public()
- `GET /subscriptions/my` — JwtAuthGuard
- `POST /subscriptions/checkout` — JwtAuthGuard, body: { planId: string }
- `DELETE /subscriptions/my` — JwtAuthGuard
- `GET /subscriptions/payments` — JwtAuthGuard, query params: page (default 1), limit (default 10)
- `POST /subscriptions/webhook` — @Public(), must receive raw Buffer body

**Raw body for webhook**: In `d:/FYP/merge-backend/src/main.ts`, add before `app.init()`:
```typescript
app.use('/subscriptions/webhook', express.raw({ type: 'application/json' }));
```

### Task 6: Add Feature Gating to Existing Services

Create a shared constant/helper in `src/subscription/plan-limits.const.ts` (already created in Task 5).

Modify these backend services to enforce plan limits by checking `user.subscriptionTier`:

1. **`src/room/room.service.ts`** — In `create()`: count user's existing rooms. If count >= PLAN_LIMITS[tier].roomLimit, throw ForbiddenException('Room limit reached for your plan. Please upgrade.').

2. **`src/note/note.service.ts`** — In `create()`: count user's notes. If noteLimit !== -1 and count >= noteLimit, throw ForbiddenException.

3. **`src/transcription/transcription.service.ts`** (lecture summary) — At entry of the main transcription method: check `user.subscriptionTier`, if !PLAN_LIMITS[tier].hasLectureSummary throw ForbiddenException.

4. Focus tracker check — Find the focus tracker service/endpoint and add similar gate for `hasFocusTracker`.

### Task 7: Register New Modules in AppModule

In `d:/FYP/merge-backend/src/app.module.ts`, add `RewardsModule` and `SubscriptionModule` to the imports array.

Add env variable validation comments for: LEMON_SQUEEZY_API_KEY, LEMON_SQUEEZY_STORE_ID, LEMON_SQUEEZY_WEBHOOK_SECRET, LEMON_SQUEEZY_BASIC_VARIANT_ID, LEMON_SQUEEZY_PRO_VARIANT_ID, LEMON_SQUEEZY_MAX_VARIANT_ID, FRONTEND_URL.

---

## Frontend Tasks

### Task 8: Create TypeScript Types

**`d:/FYP/merge/src/types/rewards.ts`**:
```typescript
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
  isRedeemed: boolean;
  lsDiscountCode?: string;
}

export interface ChallengeProgress {
  type: ChallengeTier;
  currentCount: number;
  target: number;
  isCompleted: boolean;
  consecutiveCount: number;
  periodStart: string;
}

export interface RewardsProfile {
  streak: UserStreak;
  badges: UserBadge[];
  totalPoints: number;
  challenges: ChallengeProgress[];
}
```

**`d:/FYP/merge/src/types/subscription.ts`**:
```typescript
export type PlanTier = 'free' | 'basic' | 'pro' | 'max';
export type SubscriptionStatus = 'active' | 'cancelled' | 'expired' | 'past_due' | 'trialing';

export interface SubscriptionPlan {
  id: string;
  name: PlanTier;
  displayName: string;
  priceMonthly: number;
  currency: string;
  lsVariantId: string | null;
  features: string[];
  roomLimit: number;
  noteLimit: number;
  hasLectureSummary: boolean;
  hasFocusTracker: boolean;
}

export interface UserSubscription {
  id: string;
  plan: SubscriptionPlan;
  status: SubscriptionStatus;
  currentPeriodEnd: string | null;
  cancelAtPeriodEnd: boolean;
  appliedDiscountPercentage: number;
}

export interface PaymentRecord {
  id: string;
  amountPkr: number;
  status: 'paid' | 'failed' | 'refunded';
  invoiceUrl: string | null;
  paidAt: string | null;
  createdAt: string;
}
```

### Task 9: Create Server API and React Query Hooks

**`d:/FYP/merge/src/server-api/rewards.ts`**: Two async functions using the existing fetch pattern in the project (look at `src/server-api/calendar.ts` for the exact pattern):
- `getRewardsProfile()` — GET /rewards/profile
- `getChallenges()` — GET /rewards/challenges

**`d:/FYP/merge/src/server-api/subscription.ts`**:
- `getPlans()` — GET /subscriptions/plans
- `getMySubscription()` — GET /subscriptions/my
- `getPaymentHistory(page)` — GET /subscriptions/payments?page={page}&limit=10
- `createCheckout(planId: string)` — POST /subscriptions/checkout body { planId }
- `cancelSubscription()` — DELETE /subscriptions/my

**React Query Hooks** (follow the pattern from `src/hooks/calendar/use-calendar-tasks.ts`):

`src/hooks/rewards/use-rewards-profile.ts` — useQuery key ['rewards', 'profile'], calls getRewardsProfile()
`src/hooks/rewards/use-challenges.ts` — useQuery key ['rewards', 'challenges'], calls getChallenges()
`src/hooks/subscription/use-plans.ts` — useQuery key ['subscription', 'plans'], calls getPlans(), staleTime 5 minutes
`src/hooks/subscription/use-my-subscription.ts` — useQuery key ['subscription', 'my'], calls getMySubscription()
`src/hooks/subscription/use-payment-history.ts` — useQuery key ['subscription', 'payments'], calls getPaymentHistory(1)
`src/hooks/subscription/use-checkout.ts` — useMutation, on success: window.location.href = data.checkoutUrl
`src/hooks/subscription/use-cancel-subscription.ts` — useMutation, on success: invalidate ['subscription', 'my'], show sonner toast

### Task 10: Build Reward UI Components

Use existing Tailwind CSS design tokens (bg-main-background, text-heading, text-para-muted, text-para, border-light-border, bg-primary, text-primary, bg-secondary, text-secondary, text-accent, bg-accent, text-success, bg-success, text-info). Use Lucide React icons. Follow the visual style of existing dashboard widgets.

**`src/components/rewards/StreakDisplay.tsx`**:
- Show flame icon + currentStreak number in large font
- Show "Longest: X days" secondary text
- Show 7 small dots representing the last 7 days (filled if active, hollow if inactive) based on lastActivityDate
- Show a motivational message based on streak length

**`src/components/rewards/ChallengeCard.tsx`**:
- Props: challenge: ChallengeProgress
- Show challenge type (Daily/Weekly/Monthly) as a colored badge
- Show title and description (e.g. "Complete 3 tasks today")
- Show circular progress indicator (SVG circle) with currentCount/target
- Show consecutiveCount below: "X consecutive [days/weeks/months]"
- Animate with framer-motion when completed (scale up briefly)

**`src/components/rewards/BadgeCard.tsx`**:
- Props: badge: Badge, userBadge?: UserBadge
- If earned (userBadge exists): show full color, badge icon, name, discount % chip in accent color, "Earned on [date]", "Redeemed" or "Available" chip
- If locked: show grayscale/dimmed, lock icon overlay, "Complete X challenges to unlock" text

### Task 11: Build Subscription UI Components

**`src/components/subscription/PlanCard.tsx`**:
- Props: plan: SubscriptionPlan, isCurrentPlan: boolean, onUpgrade: () => void, isLoading: boolean, discountPercent?: number
- Show plan name, price (with strikethrough original + discounted price if discount available)
- Feature list with check/x icons
- CTA button: "Current Plan" (disabled) | "Upgrade" | "Downgrade"
- Highlight current plan with primary color border
- Mark "Pro" plan with a "Most Popular" badge

**`src/components/subscription/CurrentPlanStatus.tsx`**:
- Props: subscription: UserSubscription | null
- Show current plan chip, renewal date formatted as "Renews on DD MMM YYYY"
- If cancelAtPeriodEnd: show "Cancels on [date]" in warning color
- If past_due: show "Payment failed" warning banner
- Cancel subscription link (with confirmation dialog using Radix AlertDialog or simple confirm)

**`src/components/subscription/DiscountBanner.tsx`**:
- Props: badges: UserBadge[]
- Find highest unspent discount from badges
- If found: show info banner "You have a [X]% discount from your [Badge Name] badge! Applied at checkout."
- Use Lucide Tag icon, accent/info color scheme

**`src/components/subscription/PaymentHistoryTable.tsx`**:
- Props: payments: PaymentRecord[]
- Table columns: Date, Amount (in PKR), Status (colored chip), Invoice
- Invoice column: ExternalLink icon that opens invoiceUrl in new tab (disabled if no URL)
- Empty state if no payments

### Task 12: Build the Rewards Page

**`src/app/(with-layout)/rewards/page.tsx`**:
- "use client" page
- Use `useRewardsProfile()` hook
- Layout: 
  - Top: Page title "Rewards & Achievements" with Trophy icon
  - Left column: StreakDisplay component + total XP counter
  - Center: 3 ChallengeCard components (daily, weekly, monthly) in a grid
  - Right/Bottom: BadgeCard grid for all 3 badges
  - If any badge has unspent discount: show a CTA button "Use your discount → Go to Billing"
- Show loading skeletons while data loads
- Use Framer Motion for page entrance animation (fade in + slide up)

### Task 13: Build the Billing Page

**`src/app/(with-layout)/billing/page.tsx`**:
- "use client" page
- Use usePlans(), useMySubscription(), usePaymentHistory(), useCheckout(), useCancelSubscription() hooks
- Layout:
  - Top: CurrentPlanStatus component
  - If unspent badge discount: DiscountBanner component
  - Middle: PlanComparison — 4 PlanCard components in a responsive grid (1 col mobile, 2 col tablet, 4 col desktop)
  - Upgrade/downgrade click → call useCheckout mutation with planId → redirect to LemonSqueezy checkout
  - Bottom: PaymentHistoryTable
- Handle ?success=true query param: show a sonner toast "Subscription activated! Welcome to [Plan]"
- Handle ?cancelled=true query param: show a sonner toast "Checkout cancelled"
- Show loading skeletons

### Task 14: Update Dashboard Widgets with Real Data

**`src/components/dashboard/RewardsWidget.tsx`** (currently uses hardcoded useState):
- Replace hardcoded achievements array with `useRewardsProfile()` hook
- Map the returned `badges` (UserBadge[]) and `challenges` (ChallengeProgress[]) to the existing Achievement interface shape so the existing card UI renders correctly
- Keep all existing JSX/styling unchanged — only swap the data source
- Show loading state while data fetches

**`src/components/dashboard/StreakCounter.tsx`** (currently uses mock data):
- Import and use `useRewardsProfile()` hook  
- Replace mock streak number with `profile.streak.currentStreak`
- Replace mock 7-day activity array with real data derived from `profile.streak.lastActivityDate`

### Task 15: Add Navigation Links for Rewards and Billing Pages

Find the sidebar navigation component (likely in `src/components/layout/` or similar) and add two new nav items:
- **Rewards** → `/rewards` (use Trophy icon from lucide-react)
- **Billing** → `/billing` (use CreditCard icon from lucide-react)

Follow the exact same pattern/styling as existing nav items.
