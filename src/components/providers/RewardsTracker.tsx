"use client";

import { useEffect, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { getRewardsProfile } from "@/server-api/rewards";
import { useAuth } from "@/providers/AuthProvider";

/**
 * Fires once per session on mount to call `getRewardsProfile()`, which
 * triggers the daily streak update on the backend. Mounted in the app layout
 * so any page visit ticks the streak.
 */
export default function RewardsTracker() {
  const { isAuthenticated } = useAuth();
  const queryClient = useQueryClient();
  const fired = useRef(false);

  useEffect(() => {
    if (!isAuthenticated || fired.current) return;
    fired.current = true;

    // Fire-and-forget — populates the React Query cache so widgets that
    // call useRewardsProfile() get instant data, and ticks the streak server-side.
    getRewardsProfile().then((profile) => {
      if (profile) {
        queryClient.setQueryData(["rewards", "profile"], profile);
      }
    }).catch(() => {});
  }, [isAuthenticated, queryClient]);

  return null;
}
