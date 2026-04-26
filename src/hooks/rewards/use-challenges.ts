"use client";
import { useQuery } from "@tanstack/react-query";
import { getChallenges } from "@/server-api/rewards";

export default function useChallenges() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["rewards", "challenges"],
    queryFn: () => getChallenges(),
  });
  return { challenges: data ?? [], isLoading, error };
}
