"use client";
import { useQuery } from "@tanstack/react-query";
import { getRewardsProfile } from "@/server-api/rewards";

export default function useRewardsProfile() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["rewards", "profile"],
    queryFn: () => getRewardsProfile(),
  });
  return { profile: data ?? null, isLoading, error };
}
