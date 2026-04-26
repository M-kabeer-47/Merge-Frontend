# Task ID: 15

**Title:** Add Rewards and Billing Navigation Links

**Status:** pending

**Dependencies:** 12, 13

**Priority:** low

**Description:** Add Rewards (/rewards) and Billing (/billing) links to the sidebar navigation

**Details:**

Find the sidebar navigation component. Based on the project structure it's likely in d:/FYP/merge/src/components/layout/ or referenced in src/app/(with-layout)/layout.tsx.

Add two new nav items following the exact same pattern and styling as existing nav items:
- Rewards: href='/rewards', icon=Trophy (from lucide-react), label='Rewards'
- Billing: href='/billing', icon=CreditCard (from lucide-react), label='Billing'

Place Rewards near the top of nav (after Dashboard). Place Billing near the bottom (near Profile/Settings).

**Test Strategy:**

Nav links appear in sidebar. Clicking navigates to correct pages. Active state highlights correctly on current route.
