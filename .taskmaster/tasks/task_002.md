# Task ID: 2

**Title:** Write SQL Migration for Rewards & Subscription Tables

**Status:** pending

**Dependencies:** 1

**Priority:** high

**Description:** Create SQL migration file that creates all 7 new tables plus seed data for badges and subscription plans

**Details:**

Create d:/FYP/merge-backend/migrations/2026-04-25-add-rewards-and-subscription.sql

Tables to create:
- user_streaks (id uuid PK, user_id uuid FK→users, current_streak int default 0, longest_streak int default 0, last_activity_date date nullable, updated_at timestamp)
- badges (id uuid PK, name varchar unique, description text, icon varchar, tier varchar, discount_percentage int, is_active boolean default true)
- user_badges (id uuid PK, user_id uuid FK→users, badge_id uuid FK→badges, earned_at timestamp, ls_discount_code varchar nullable, is_redeemed boolean default false, created_at timestamp)
- user_challenge_progress (id uuid PK, user_id uuid FK→users, challenge_type varchar, period_start date, current_count int default 0, is_completed boolean default false, completed_at timestamp nullable, consecutive_count int default 0, updated_at timestamp, UNIQUE(user_id, challenge_type, period_start))
- subscription_plans (id uuid PK, name varchar unique, display_name varchar, price_monthly numeric, currency varchar default 'PKR', ls_variant_id varchar nullable, features jsonb, room_limit int, note_limit int, has_lecture_summary boolean, has_focus_tracker boolean, is_active boolean default true)
- user_subscriptions (id uuid PK, user_id uuid FK→users unique, plan_id uuid FK→subscription_plans, status varchar default 'active', ls_subscription_id varchar unique nullable, ls_customer_id varchar nullable, current_period_start timestamp nullable, current_period_end timestamp nullable, cancel_at_period_end boolean default false, applied_discount_percentage int default 0, created_at timestamp, updated_at timestamp)
- payment_records (id uuid PK, user_id uuid FK→users, subscription_id uuid FK→user_subscriptions nullable, amount_pkr numeric, status varchar, ls_order_id varchar nullable, invoice_url varchar nullable, paid_at timestamp nullable, created_at timestamp)

ALTER TABLE users ADD COLUMN IF NOT EXISTS subscription_tier varchar DEFAULT 'free';

Seed badges:
- Daily Champion: tier=daily, discount=10
- Weekly Scholar: tier=weekly, discount=20
- Monthly Master: tier=monthly, discount=30

Seed subscription_plans:
- free: price=0, room_limit=2, note_limit=5, has_lecture_summary=false, has_focus_tracker=false
- basic: price=100, room_limit=5, note_limit=10, has_lecture_summary=false, has_focus_tracker=false
- pro: price=200, room_limit=10, note_limit=20, has_lecture_summary=true, has_focus_tracker=true
- max: price=500, room_limit=50, note_limit=-1, has_lecture_summary=true, has_focus_tracker=true

**Test Strategy:**

Run migration against local dev database. Verify all tables exist, foreign keys are valid, and seed data is inserted.
