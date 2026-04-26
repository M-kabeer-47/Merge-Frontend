# Task ID: 1

**Title:** Create Reward & Subscription Database Entities

**Status:** pending

**Dependencies:** None

**Priority:** high

**Description:** Create 7 new TypeORM entity files in merge-backend/src/entities/ and add subscriptionTier field to user.entity.ts

**Details:**

Create the following entity files:
1. user-streak.entity.ts: id(uuid), user(ManyToOne→User), currentStreak(number,default 0), longestStreak(number,default 0), lastActivityDate(Date nullable), updatedAt(UpdateDateColumn)
2. badge.entity.ts: id(uuid), name(string), description(string), icon(string), tier(enum: daily|weekly|monthly), discountPercentage(number), isActive(boolean,default true)
3. user-badge.entity.ts: id(uuid), user(ManyToOne→User), badge(ManyToOne→Badge), earnedAt(Date), lsDiscountCode(string nullable), isRedeemed(boolean,default false), createdAt(CreateDateColumn)
4. user-challenge-progress.entity.ts: id(uuid), user(ManyToOne→User), challengeType(enum: daily|weekly|monthly), periodStart(Date), currentCount(number,default 0), isCompleted(boolean,default false), completedAt(Date nullable), consecutiveCount(number,default 0), updatedAt(UpdateDateColumn). Add unique constraint on (user, challengeType, periodStart).
5. subscription-plan.entity.ts: id(uuid), name(enum: free|basic|pro|max), displayName(string), priceMonthly(number), currency(string,default PKR), lsVariantId(string nullable), features(simple-json array), roomLimit(number), noteLimit(number; -1=unlimited), hasLectureSummary(boolean), hasFocusTracker(boolean), isActive(boolean,default true)
6. user-subscription.entity.ts: id(uuid), user(OneToOne→User), plan(ManyToOne→SubscriptionPlan), status(enum: active|cancelled|expired|past_due|trialing,default active), lsSubscriptionId(string nullable unique), lsCustomerId(string nullable), currentPeriodStart(Date nullable), currentPeriodEnd(Date nullable), cancelAtPeriodEnd(boolean,default false), appliedDiscountPercentage(number,default 0), createdAt, updatedAt
7. payment-record.entity.ts: id(uuid), user(ManyToOne→User), subscription(ManyToOne→UserSubscription nullable), amountPkr(number), status(enum: paid|failed|refunded), lsOrderId(string nullable), invoiceUrl(string nullable), paidAt(Date nullable), createdAt

Also add to user.entity.ts: subscriptionTier(enum: free|basic|pro|max, default free).

**Test Strategy:**

Verify TypeORM can compile and sync entities without errors. Check that all foreign keys and indexes are created correctly.

## Subtasks

### 1.1. Create user-streak.entity.ts

**Status:** pending  
**Dependencies:** None  

Create user streak tracking entity in d:/FYP/merge-backend/src/entities/user-streak.entity.ts

**Details:**

Entity: @Entity('user_streaks'). Fields: id (PrimaryGeneratedColumn uuid), user (ManyToOne(() => User, { onDelete: 'CASCADE' }), JoinColumn), currentStreak (Column default 0), longestStreak (Column default 0), lastActivityDate (Column nullable), updatedAt (UpdateDateColumn)

### 1.2. Create badge.entity.ts

**Status:** pending  
**Dependencies:** None  

Create static badge definitions entity in d:/FYP/merge-backend/src/entities/badge.entity.ts

**Details:**

Entity: @Entity('badges'). Export enum BadgeTier { DAILY='daily', WEEKLY='weekly', MONTHLY='monthly' }. Fields: id (uuid), name, description, icon, tier (enum BadgeTier), discountPercentage (number), isActive (boolean default true)

### 1.3. Create user-badge.entity.ts

**Status:** pending  
**Dependencies:** 1.2  

Create entity for badges earned by users in d:/FYP/merge-backend/src/entities/user-badge.entity.ts

**Details:**

Entity: @Entity('user_badges'). Fields: id (uuid), user (ManyToOne User), badge (ManyToOne Badge, eager: true), earnedAt (Column type date), lsDiscountCode (Column nullable), isRedeemed (Column default false), createdAt (CreateDateColumn)

### 1.4. Create user-challenge-progress.entity.ts

**Status:** pending  
**Dependencies:** None  

Create challenge progress tracking entity in d:/FYP/merge-backend/src/entities/user-challenge-progress.entity.ts

**Details:**

Entity: @Entity('user_challenge_progress'). Export enum ChallengeType { DAILY='daily', WEEKLY='weekly', MONTHLY='monthly' }. Fields: id, user (ManyToOne), challengeType (enum ChallengeType), periodStart (Date), currentCount (default 0), isCompleted (default false), completedAt (nullable), consecutiveCount (default 0), updatedAt. Add @Unique(['user', 'challengeType', 'periodStart']) constraint on class.

### 1.5. Create subscription-plan.entity.ts

**Status:** pending  
**Dependencies:** None  

Create subscription plan definitions entity in d:/FYP/merge-backend/src/entities/subscription-plan.entity.ts

**Details:**

Entity: @Entity('subscription_plans'). Export enum PlanTier { FREE='free', BASIC='basic', PRO='pro', MAX='max' }. Fields: id, name (enum PlanTier unique), displayName, priceMonthly (number), currency (default 'PKR'), lsVariantId (nullable), features (Column type simple-json), roomLimit (number), noteLimit (number), hasLectureSummary (boolean), hasFocusTracker (boolean), isActive (boolean default true)

### 1.6. Create user-subscription.entity.ts

**Status:** pending  
**Dependencies:** 1.5  

Create user subscription entity in d:/FYP/merge-backend/src/entities/user-subscription.entity.ts

**Details:**

Entity: @Entity('user_subscriptions'). Export enum SubscriptionStatus { ACTIVE='active', CANCELLED='cancelled', EXPIRED='expired', PAST_DUE='past_due', TRIALING='trialing' }. Fields: id, user (OneToOne User, JoinColumn), plan (ManyToOne SubscriptionPlan, eager true), status (enum default active), lsSubscriptionId (nullable, unique), lsCustomerId (nullable), currentPeriodStart (nullable), currentPeriodEnd (nullable), cancelAtPeriodEnd (boolean default false), appliedDiscountPercentage (number default 0), createdAt, updatedAt

### 1.7. Create payment-record.entity.ts

**Status:** pending  
**Dependencies:** 1.6  

Create payment record entity in d:/FYP/merge-backend/src/entities/payment-record.entity.ts

**Details:**

Entity: @Entity('payment_records'). Export enum PaymentStatus { PAID='paid', FAILED='failed', REFUNDED='refunded' }. Fields: id, user (ManyToOne User), subscription (ManyToOne UserSubscription nullable), amountPkr (number), status (enum PaymentStatus), lsOrderId (nullable), invoiceUrl (nullable), paidAt (nullable), createdAt (CreateDateColumn)

### 1.8. Add subscriptionTier to user.entity.ts

**Status:** pending  
**Dependencies:** 1.5  

Add subscriptionTier column to existing User entity

**Details:**

In d:/FYP/merge-backend/src/entities/user.entity.ts, import PlanTier enum from subscription-plan.entity. Add field: @Column({ type: 'enum', enum: PlanTier, default: PlanTier.FREE }) subscriptionTier: PlanTier;
