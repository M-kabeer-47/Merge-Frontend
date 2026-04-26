# Task ID: 5

**Title:** Build Subscription NestJS Module

**Status:** pending

**Dependencies:** 1

**Priority:** high

**Description:** Create src/subscription/ module with LemonSqueezy integration for checkout, webhook processing, and payment history

**Details:**

Run: npm install @lemonsqueezy/lemonsqueezy.js (in merge-backend directory).

Create d:/FYP/merge-backend/src/subscription/plan-limits.const.ts with PLAN_LIMITS constant map.

Create subscription.module.ts, subscription.service.ts, subscription.controller.ts.

Key service methods:
- getPlans(): Return all active SubscriptionPlans ordered by priceMonthly ASC
- getUserSubscription(userId): Find UserSubscription with plan relation. If none, return free plan object.
- createCheckout(userId, planId): Init LS with lemonSqueezySetup({ apiKey: process.env.LEMON_SQUEEZY_API_KEY }). Find plan. Find best unspent UserBadge. Build checkout data with variantId, redirectUrl (FRONTEND_URL/billing?success=true), cancelUrl (FRONTEND_URL/billing?cancelled=true). If discount code available, include in checkout. Return { checkoutUrl }.
- cancelSubscription(userId): Call LS cancelSubscription API. Set cancelAtPeriodEnd=true.
- getPaymentHistory(userId, page, limit): Return paginated PaymentRecords.
- handleWebhook(rawBody, signature): Verify HMAC. Parse. Switch on event type. Handle: subscription_created, subscription_updated, subscription_cancelled, subscription_expired, order_created, subscription_payment_failed.

In main.ts, add raw body middleware for /subscriptions/webhook before global JSON parser.

**Test Strategy:**

Test checkout URL generation. Simulate webhook events with test tool. Verify subscription status updates in DB.

## Subtasks

### 5.1. Install LemonSqueezy SDK and create plan-limits.const.ts

**Status:** pending  
**Dependencies:** None  

Install @lemonsqueezy/lemonsqueezy.js and create the plan limits constant

**Details:**

Run: npm install @lemonsqueezy/lemonsqueezy.js in d:/FYP/merge-backend/.

Create src/subscription/plan-limits.const.ts:
export const PLAN_LIMITS = {
  free:  { roomLimit: 2,  noteLimit: 5,   hasLectureSummary: false, hasFocusTracker: false },
  basic: { roomLimit: 5,  noteLimit: 10,  hasLectureSummary: false, hasFocusTracker: false },
  pro:   { roomLimit: 10, noteLimit: 20,  hasLectureSummary: true,  hasFocusTracker: true  },
  max:   { roomLimit: 50, noteLimit: -1,  hasLectureSummary: true,  hasFocusTracker: true  },
};

### 5.2. Create subscription.module.ts

**Status:** pending  
**Dependencies:** 5.1  

Create subscription module with TypeORM, Bull queue, and NotificationModule imports

**Details:**

Module imports: TypeOrmModule.forFeature([SubscriptionPlan, UserSubscription, PaymentRecord, User, UserBadge]), BullModule.registerQueue({ name: 'subscription' }), NotificationModule. Exports: SubscriptionService.

### 5.3. Create subscription.service.ts - plans and checkout

**Status:** pending  
**Dependencies:** 5.2  

Implement getPlans, getUserSubscription, and createCheckout methods

**Details:**

getPlans(): find all active plans ordered by priceMonthly ASC.
getUserSubscription(userId): find UserSubscription with plan relation. If null, return { plan: freePlan, status: 'active', ... } virtual object.
createCheckout(userId, planId): (1) lemonSqueezySetup({ apiKey }). (2) Find SubscriptionPlan by id. (3) Find user's best unspent UserBadge by highest discountPercentage. (4) Call createCheckout from @lemonsqueezy/lemonsqueezy.js with storeId, variantId, checkoutOptions: { redirectUrl, cancelUrl }. If discount code exists, add to checkout. (5) Return { checkoutUrl: data.data.attributes.url }.

### 5.4. Create subscription.service.ts - webhook handler

**Status:** pending  
**Dependencies:** 5.3  

Implement handleWebhook with HMAC verification and all subscription event handlers

**Details:**

handleWebhook(rawBody: Buffer, signature: string):
1. Verify: const digest = crypto.createHmac('sha256', webhookSecret).update(rawBody).digest('hex'). Throw UnauthorizedException if mismatch.
2. Parse: const payload = JSON.parse(rawBody.toString()).
3. Switch payload.meta.event_name:
  - subscription_created: upsert UserSubscription with lsSubscriptionId, lsCustomerId, status, period dates. Update user.subscriptionTier to match plan. Schedule renewal reminder Bull job.
  - subscription_updated: update status, period dates, cancelAtPeriodEnd.
  - subscription_cancelled: set cancelAtPeriodEnd=true.
  - subscription_expired: set status=expired, update user.subscriptionTier='free'. Send notification.
  - order_created: create PaymentRecord with amountPkr, lsOrderId, invoiceUrl, status=paid.
  - subscription_payment_failed: set status=past_due. Send notification via NotificationService.

### 5.5. Create subscription.service.ts - cancel and payment history

**Status:** pending  
**Dependencies:** 5.3  

Implement cancelSubscription and getPaymentHistory methods

**Details:**

cancelSubscription(userId): Find active UserSubscription. Call LS updateSubscription API to cancel. Set cancelAtPeriodEnd=true. Save.
getPaymentHistory(userId, page=1, limit=10): Return paginated PaymentRecords for user ordered by createdAt DESC. Return { data, total, page, limit }.

### 5.6. Create subscription.controller.ts

**Status:** pending  
**Dependencies:** 5.5  

Create REST controller with all subscription endpoints including raw body webhook

**Details:**

@Controller('subscriptions').
GET /subscriptions/plans — @Public().
GET /subscriptions/my — JwtAuthGuard.
POST /subscriptions/checkout — JwtAuthGuard, @Body() body: { planId: string }.
DELETE /subscriptions/my — JwtAuthGuard.
GET /subscriptions/payments — JwtAuthGuard, @Query() { page?, limit? }.
POST /subscriptions/webhook — @Public(), inject raw body from request: in handleWebhook pass req.rawBody (Buffer) and req.headers['x-signature'] (string).

### 5.7. Configure raw body middleware in main.ts

**Status:** pending  
**Dependencies:** 5.6  

Add raw body parsing for webhook route in NestJS main.ts before global JSON middleware

**Details:**

In d:/FYP/merge-backend/src/main.ts, add before app.init(): app.use('/subscriptions/webhook', express.raw({ type: 'application/json' })); Import express from 'express'. This must be registered before the global body parser so the webhook route gets raw Buffer body instead of parsed JSON.
