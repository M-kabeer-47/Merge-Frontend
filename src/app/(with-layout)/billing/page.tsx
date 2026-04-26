"use client";

import { useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { History, Sparkles } from "lucide-react";
import { toast } from "sonner";
import usePlans from "@/hooks/subscription/use-plans";
import useMySubscription from "@/hooks/subscription/use-my-subscription";
import usePaymentHistory from "@/hooks/subscription/use-payment-history";
import useCheckout from "@/hooks/subscription/use-checkout";
import useCancelSubscription from "@/hooks/subscription/use-cancel-subscription";
import useRewardsProfile from "@/hooks/rewards/use-rewards-profile";
import PlanCard from "@/components/subscription/PlanCard";
import CurrentPlanStatus from "@/components/subscription/CurrentPlanStatus";
import PaymentHistoryTable from "@/components/subscription/PaymentHistoryTable";

const container = { hidden: {}, show: { transition: { staggerChildren: 0.07 } } };
const item = { hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } };

export default function BillingPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { plans, isLoading: plansLoading } = usePlans();
  const { subscription, isLoading: subLoading } = useMySubscription();
  const { payments, isLoading: paymentsLoading } = usePaymentHistory();
  const { checkout, isLoading: checkoutLoading } = useCheckout();
  const { cancel, isCancelling } = useCancelSubscription();
  const { profile } = useRewardsProfile();

  const unspentBadges = (profile?.badges ?? [])
    .filter((b) => b.userBadge && !b.userBadge.isRedeemed && b.userBadge.lsDiscountCode)
    .map((b) => b.userBadge!);
  const bestDiscount = [...unspentBadges].sort(
    (a, b) => b.badge.discountPercentage - a.badge.discountPercentage,
  )[0];

  useEffect(() => {
    const success = searchParams.get("success");
    const cancelled = searchParams.get("cancelled");
    if (success === "true") {
      toast.success("Subscription activated! Updating your account...");
      // Force everything related to subscription + rewards to refetch so the
      // new plan + redeemed-badge state shows up immediately.
      queryClient.invalidateQueries({ queryKey: ["subscription"] });
      queryClient.invalidateQueries({ queryKey: ["rewards"] });
      // Strip the query params from the URL so a refresh doesn't re-toast
      router.replace("/billing");
    } else if (cancelled === "true") {
      toast.info("Checkout cancelled.");
      router.replace("/billing");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  const currentPlanName = subscription?.plan?.name ?? "free";

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-12 p-6"
    >
      {/* Current plan hero */}
      <motion.div variants={item}>
        {subLoading ? (
          <div className="h-44 rounded-3xl bg-secondary/10 animate-pulse" />
        ) : (
          <CurrentPlanStatus
            subscription={subscription}
            onCancel={cancel}
            isCancelling={isCancelling}
          />
        )}
      </motion.div>

      {/* Plans section */}
      <motion.div variants={item} className="space-y-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-raleway text-2xl font-bold text-heading sm:text-3xl">
            Choose your plan
          </h2>
          <p className="mt-2 text-sm text-para-muted">
            Affordable and flexible — upgrade anytime as your study habits
            grow.
          </p>
          {bestDiscount && (
            <div className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-accent/10 px-3 py-1.5 text-xs font-semibold text-accent ring-1 ring-accent/20">
              <Sparkles className="h-3.5 w-3.5" />
              {bestDiscount.badge.discountPercentage}% discount auto-applied at
              checkout
            </div>
          )}
        </div>

        {plansLoading ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="h-96 rounded-3xl bg-secondary/10 animate-pulse"
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 items-stretch gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {plans.map((plan) => (
              <PlanCard
                key={plan.id}
                plan={plan}
                isCurrentPlan={plan.name === currentPlanName}
                onUpgrade={(id) => checkout(id)}
                isLoading={checkoutLoading}
                discountPercent={bestDiscount?.badge.discountPercentage}
              />
            ))}
          </div>
        )}
      </motion.div>

      {/* Payment history */}
      <motion.div variants={item}>
        <div className="mb-4 flex items-center gap-2">
          <History className="h-4 w-4 text-para-muted" />
          <h2 className="text-base font-semibold text-heading">
            Payment history
          </h2>
        </div>
        <div className="overflow-hidden rounded-2xl bg-background ring-1 ring-light-border">
          {paymentsLoading ? (
            <div className="h-20 animate-pulse bg-secondary/10" />
          ) : (
            <PaymentHistoryTable payments={payments} />
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
