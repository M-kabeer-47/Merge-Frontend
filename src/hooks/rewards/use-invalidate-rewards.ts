"use client";
import { useQueryClient } from "@tanstack/react-query";

/**
 * Invalidates rewards (profile/badges/challenges) and subscription (plans/my/payments) caches.
 * Call this after any mutation that may have triggered a reward action on the backend.
 * Completing a challenge can earn a badge → which generates a discount code → which
 * affects the billing page price display, so we refresh both surfaces.
 */
export default function useInvalidateRewards() {
  const queryClient = useQueryClient();
  return () => {
    queryClient.invalidateQueries({ queryKey: ["rewards"] });
    queryClient.invalidateQueries({ queryKey: ["subscription"] });
  };
}
