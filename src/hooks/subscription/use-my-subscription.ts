"use client";
import { useQuery } from "@tanstack/react-query";
import { getMySubscription } from "@/server-api/subscription";

export default function useMySubscription() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["subscription", "my"],
    queryFn: () => getMySubscription(),
  });
  return { subscription: data ?? null, isLoading, error };
}
