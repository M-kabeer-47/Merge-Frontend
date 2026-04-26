"use client";
import { useQuery } from "@tanstack/react-query";
import { getPlans } from "@/server-api/subscription";

export default function usePlans() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["subscription", "plans"],
    queryFn: () => getPlans(),
    staleTime: 5 * 60 * 1000,
  });
  return { plans: data ?? [], isLoading, error };
}
