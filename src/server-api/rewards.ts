"use server";
import { getWithAuth } from "./fetch-with-auth";
import { API_BASE_URL } from "@/lib/constants/api";
import { RewardsProfile, ChallengeProgress } from "@/types/rewards";

// Per-user data that changes when the user earns/redeems badges or
// progresses on challenges. `cache: "no-store"` so React Query
// invalidations on the client actually result in a fresh fetch from
// NestJS — the previous server-side TTL hid stale data behind the
// cache where the client couldn't reach it.
export async function getRewardsProfile(): Promise<RewardsProfile | null> {
  const { data, error } = await getWithAuth<RewardsProfile>(
    `${API_BASE_URL}/rewards/profile`,
    { cache: "no-store" },
  );
  if (error || !data) return null;
  return data;
}

export async function getChallenges(): Promise<ChallengeProgress[]> {
  const { data, error } = await getWithAuth<ChallengeProgress[]>(
    `${API_BASE_URL}/rewards/challenges`,
    { cache: "no-store" },
  );
  if (error || !data) return [];
  return data;
}
