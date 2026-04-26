# Task ID: 11

**Title:** Build Subscription UI Components

**Status:** pending

**Dependencies:** 8

**Priority:** medium

**Description:** Create PlanCard, CurrentPlanStatus, DiscountBanner, and PaymentHistoryTable components in src/components/subscription/

**Details:**

1. PlanCard.tsx: Props: plan, isCurrentPlan, onUpgrade, isLoading, discountPercent?. Show plan name, original price with strikethrough if discount, discounted price. Feature list with Check/X icons. CTA: 'Current Plan' (disabled, primary border), 'Upgrade' (primary button), 'Downgrade' (outline button). 'Most Popular' badge on Pro plan. Highlighted border on current plan.

2. CurrentPlanStatus.tsx: Props: subscription. Plan name chip + renewal date formatted with date-fns ('Renews on 15 May 2026'). If cancelAtPeriodEnd, show 'Cancels on [date]' in warning. If past_due, show red 'Payment failed' alert. Cancel link with Radix AlertDialog confirmation.

3. DiscountBanner.tsx: Props: badges: UserBadge[]. Find highest unspent discount. Show info banner with Tag icon: 'You have a X% discount from [Badge]! Will be applied at checkout.' Hidden if no unspent badges.

4. PaymentHistoryTable.tsx: Props: payments: PaymentRecord[]. Table: Date | Amount (Rs. XXX) | Status chip (green/red/orange) | Invoice (ExternalLink icon, opens invoiceUrl). Empty state message if no payments.

**Test Strategy:**

Components render with mock data. Discount banner shows/hides correctly. Plan cards show correct pricing with discounts.
