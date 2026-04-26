# Task ID: 9

**Title:** Create Frontend Server API Files and React Query Hooks

**Status:** pending

**Dependencies:** 8

**Priority:** high

**Description:** Create server-api files and all 7 React Query hooks for rewards and subscription data fetching

**Details:**

Follow the exact pattern used in d:/FYP/merge/src/server-api/calendar.ts and d:/FYP/merge/src/hooks/calendar/use-calendar-tasks.ts.

Create d:/FYP/merge/src/server-api/rewards.ts:
- getRewardsProfile(): GET /rewards/profile
- getChallenges(): GET /rewards/challenges

Create d:/FYP/merge/src/server-api/subscription.ts:
- getPlans(): GET /subscriptions/plans
- getMySubscription(): GET /subscriptions/my
- getPaymentHistory(page): GET /subscriptions/payments?page={page}&limit=10
- createCheckout(planId): POST /subscriptions/checkout { planId }
- cancelSubscription(): DELETE /subscriptions/my

Create hooks:
- src/hooks/rewards/use-rewards-profile.ts: useQuery(['rewards','profile'], getRewardsProfile)
- src/hooks/rewards/use-challenges.ts: useQuery(['rewards','challenges'], getChallenges)
- src/hooks/subscription/use-plans.ts: useQuery(['subscription','plans'], getPlans, staleTime 5min)
- src/hooks/subscription/use-my-subscription.ts: useQuery(['subscription','my'], getMySubscription)
- src/hooks/subscription/use-payment-history.ts: useQuery(['subscription','payments'], () => getPaymentHistory(1))
- src/hooks/subscription/use-checkout.ts: useMutation(createCheckout), onSuccess: window.location.href = data.checkoutUrl
- src/hooks/subscription/use-cancel-subscription.ts: useMutation(cancelSubscription), onSuccess: invalidate ['subscription','my'], show sonner toast

**Test Strategy:**

Hooks return data without errors when backend is running. TypeScript has no errors.
