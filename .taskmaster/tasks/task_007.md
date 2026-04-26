# Task ID: 7

**Title:** Register New Modules and Configure AppModule

**Status:** pending

**Dependencies:** 3, 5

**Priority:** high

**Description:** Add RewardsModule and SubscriptionModule to app.module.ts imports and add env variable documentation

**Details:**

In d:/FYP/merge-backend/src/app.module.ts:
- Import RewardsModule from './rewards/rewards.module'
- Import SubscriptionModule from './subscription/subscription.module'
- Add both to the imports array

In d:/FYP/merge-backend/.env (add the following new variables):
LEMON_SQUEEZY_API_KEY=your_test_api_key_here
LEMON_SQUEEZY_STORE_ID=your_store_id_here
LEMON_SQUEEZY_WEBHOOK_SECRET=your_webhook_secret_here
LEMON_SQUEEZY_BASIC_VARIANT_ID=variant_id_for_basic
LEMON_SQUEEZY_PRO_VARIANT_ID=variant_id_for_pro
LEMON_SQUEEZY_MAX_VARIANT_ID=variant_id_for_max
FRONTEND_URL=http://localhost:3000

**Test Strategy:**

Backend starts without errors. All new endpoints are accessible.
