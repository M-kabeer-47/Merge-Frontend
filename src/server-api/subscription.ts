"use server";
import { getWithAuth } from "./fetch-with-auth";
import { API_BASE_URL } from "@/lib/constants/api";
import { SubscriptionPlan, UserSubscription, PaymentRecord } from "@/types/subscription";

// All three endpoints below use `cache: "no-store"` to bypass Next.js's
// fetch cache. These are user-specific, real-time data:
//   - "my" subscription must reflect the current tier the moment the
//     LemonSqueezy webhook updates the DB. A 60s server cache made this
//     impossible — React Query invalidation on the client can't reach
//     the server-side cache, so the frontend kept seeing the stale tier
//     after a successful checkout.
//   - Plans rarely change but cheap to refetch; not worth the cache complexity.
//   - Payment history must show the latest payment immediately after checkout.
// React Query on the client already dedupes/caches across components,
// which is the appropriate caching layer for per-user data.

export async function getPlans(): Promise<SubscriptionPlan[]> {
  const { data, error } = await getWithAuth<SubscriptionPlan[]>(
    `${API_BASE_URL}/subscriptions/plans`,
    { cache: "no-store" },
  );
  if (error || !data) return [];
  return data;
}

export async function getMySubscription(): Promise<UserSubscription | null> {
  const { data, error } = await getWithAuth<UserSubscription>(
    `${API_BASE_URL}/subscriptions/my`,
    { cache: "no-store" },
  );
  if (error || !data) return null;
  return data;
}

export async function getPaymentHistory(page = 1): Promise<{ data: PaymentRecord[]; total: number }> {
  const { data, error } = await getWithAuth<{ data: PaymentRecord[]; total: number }>(
    `${API_BASE_URL}/subscriptions/payments?page=${page}&limit=10`,
    { cache: "no-store" },
  );
  if (error || !data) return { data: [], total: 0 };
  return data;
}
