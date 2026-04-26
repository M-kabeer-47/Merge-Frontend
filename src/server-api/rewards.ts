"use server";
import { getWithAuth } from "./fetch-with-auth";
import { API_BASE_URL } from "@/lib/constants/api";
import { RewardsProfile, ChallengeProgress } from "@/types/rewards";

export async function getRewardsProfile(): Promise<RewardsProfile | null> {
  const { data, error } = await getWithAuth<RewardsProfile>(
    `${API_BASE_URL}/rewards/profile`,
    { next: { revalidate: 60, tags: ["rewards-profile"] } },
  );
  if (error || !data) return null;
  return data;
}

export async function getChallenges(): Promise<ChallengeProgress[]> {
  const { data, error } = await getWithAuth<ChallengeProgress[]>(
    `${API_BASE_URL}/rewards/challenges`,
    { next: { revalidate: 30, tags: ["rewards-challenges"] } },
  );
  if (error || !data) return [];
  return data;
}
