"use server";
import { getWithAuth } from "./fetch-with-auth";
import { API_BASE_URL } from "@/lib/constants/api";
import { SubscriptionPlan, UserSubscription, PaymentRecord } from "@/types/subscription";

export async function getPlans(): Promise<SubscriptionPlan[]> {
  const { data, error } = await getWithAuth<SubscriptionPlan[]>(
    `${API_BASE_URL}/subscriptions/plans`,
    { next: { revalidate: 300, tags: ["subscription-plans"] } },
  );
  if (error || !data) return [];
  return data;
}

export async function getMySubscription(): Promise<UserSubscription | null> {
  const { data, error } = await getWithAuth<UserSubscription>(
    `${API_BASE_URL}/subscriptions/my`,
    { next: { revalidate: 60, tags: ["my-subscription"] } },
  );
  if (error || !data) return null;
  return data;
}

export async function getPaymentHistory(page = 1): Promise<{ data: PaymentRecord[]; total: number }> {
  const { data, error } = await getWithAuth<{ data: PaymentRecord[]; total: number }>(
    `${API_BASE_URL}/subscriptions/payments?page=${page}&limit=10`,
    { next: { revalidate: 60, tags: ["payment-history"] } },
  );
  if (error || !data) return { data: [], total: 0 };
  return data;
}
