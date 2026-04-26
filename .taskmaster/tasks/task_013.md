# Task ID: 13

**Title:** Build the Billing Page

**Status:** pending

**Dependencies:** 11, 9

**Priority:** medium

**Description:** Create /billing page at src/app/(with-layout)/billing/page.tsx with plan comparison, checkout, and payment history

**Details:**

Create d:/FYP/merge/src/app/(with-layout)/billing/page.tsx as 'use client' component.

Use hooks: usePlans(), useMySubscription(), usePaymentHistory(), useCheckout(), useCancelSubscription().

Layout:
- Top: CurrentPlanStatus component
- If unspent badge: DiscountBanner component
- Middle: 4 PlanCard components in responsive grid (1 col mobile → 2 col tablet → 4 col desktop)
  - Upgrade/downgrade click: call checkout mutation → redirect to LemonSqueezy
  - Pass discountPercent from best unspent badge to PlanCard
- Bottom: 'Payment History' section header + PaymentHistoryTable

Handle URL params on mount:
- ?success=true: show sonner toast.success('Subscription activated! Welcome to [plan name]!'). Refetch subscription.
- ?cancelled=true: show sonner toast.info('Checkout cancelled.')

Show loading skeletons for all sections.

**Test Strategy:**

Test complete checkout flow: click Upgrade → redirect to LemonSqueezy test checkout → complete with test card 4242 4242 4242 4242 → return to /billing?success=true → active plan shown.
