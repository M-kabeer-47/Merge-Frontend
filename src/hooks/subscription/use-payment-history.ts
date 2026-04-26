"use client";
import { useQuery } from "@tanstack/react-query";
import { getPaymentHistory } from "@/server-api/subscription";

export default function usePaymentHistory() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["subscription", "payments"],
    queryFn: () => getPaymentHistory(1),
  });
  return { payments: data?.data ?? [], total: data?.total ?? 0, isLoading, error };
}
