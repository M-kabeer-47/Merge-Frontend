"use client";
import { useState } from "react";
import { Sparkles, AlertTriangle, Calendar, Crown, Zap } from "lucide-react";
import { UserSubscription } from "@/types/subscription";
import { format } from "date-fns";

interface Props {
  subscription: UserSubscription | null;
  onCancel: () => void;
  isCancelling: boolean;
}

const TIER_THEME: Record<
  string,
  { gradient: string; ring: string; glow: string; icon: typeof Crown }
> = {
  free: {
    gradient: "from-para via-para-muted to-para",
    ring: "ring-light-border",
    glow: "shadow-para/10",
    icon: Sparkles,
  },
  basic: {
    gradient: "from-primary via-secondary to-primary",
    ring: "ring-secondary/30",
    glow: "shadow-primary/20",
    icon: Zap,
  },
  pro: {
    gradient: "from-primary via-secondary to-accent",
    ring: "ring-secondary/40",
    glow: "shadow-primary/30",
    icon: Crown,
  },
  max: {
    gradient: "from-accent via-secondary to-primary",
    ring: "ring-accent/40",
    glow: "shadow-accent/30",
    icon: Crown,
  },
};

export default function CurrentPlanStatus({
  subscription,
  onCancel,
  isCancelling,
}: Props) {
  const [showConfirm, setShowConfirm] = useState(false);

  const tier = subscription?.plan?.name ?? "free";
  const planName = subscription?.plan?.displayName ?? "Free";
  const isPastDue = subscription?.status === "past_due";
  const willCancel = subscription?.cancelAtPeriodEnd;
  const renewalDate = subscription?.currentPeriodEnd
    ? format(new Date(subscription.currentPeriodEnd), "dd MMM yyyy")
    : null;
  const theme = TIER_THEME[tier] ?? TIER_THEME.free;
  const TierIcon = theme.icon;
  const statusLabel = isPastDue
    ? "Payment Failed"
    : willCancel
      ? "Cancelling"
      : tier === "free"
        ? "Free tier"
        : "Active";

  return (
    <div
      className={`relative overflow-hidden rounded-3xl bg-gradient-to-br ${theme.gradient} p-7 sm:p-9 shadow-2xl ${theme.glow} ring-1 ${theme.ring}`}
    >
      {/* Decorative blurred orbs (pure white at low opacity to layer on any token gradient) */}
      <div className="pointer-events-none absolute -top-20 -right-20 h-64 w-64 rounded-full bg-white/15 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -left-12 h-56 w-56 rounded-full bg-white/10 blur-3xl" />

      <div className="relative z-10 flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 text-white/80 text-xs font-medium uppercase tracking-wider">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-white/80" />
            Current plan
          </div>

          <div className="mt-3 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15 backdrop-blur-sm ring-1 ring-white/30">
              <TierIcon className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="font-raleway text-3xl font-bold text-white sm:text-4xl">
                {planName}
              </h2>
              <span className="mt-1 inline-flex items-center gap-1.5 rounded-full bg-white/15 px-2.5 py-0.5 text-[11px] font-semibold text-white backdrop-blur-sm">
                <span
                  className={`inline-block h-1.5 w-1.5 rounded-full ${
                    isPastDue
                      ? "bg-destructive"
                      : willCancel
                        ? "bg-accent"
                        : "bg-success"
                  }`}
                />
                {statusLabel}
              </span>
            </div>
          </div>

          {renewalDate && !willCancel && !isPastDue && (
            <div className="mt-5 flex items-center gap-2 text-sm text-white/85">
              <Calendar className="h-3.5 w-3.5" />
              Renews on <span className="font-semibold">{renewalDate}</span>
            </div>
          )}
          {willCancel && renewalDate && (
            <div className="mt-5 flex items-center gap-2 text-sm text-white/85">
              <Calendar className="h-3.5 w-3.5" />
              Access ends on{" "}
              <span className="font-semibold">{renewalDate}</span>
            </div>
          )}
        </div>

        {subscription?.plan?.name && subscription.plan.name !== "free" && !willCancel && (
          <button
            onClick={() => setShowConfirm(true)}
            className="self-start rounded-xl bg-white/10 px-4 py-2 text-xs font-semibold text-white backdrop-blur-sm ring-1 ring-white/20 transition-all hover:bg-white/20"
          >
            Cancel subscription
          </button>
        )}
      </div>

      {isPastDue && (
        <div className="relative z-10 mt-6 flex items-start gap-2.5 rounded-2xl bg-white/10 p-4 backdrop-blur-sm ring-1 ring-white/20">
          <AlertTriangle className="mt-0.5 h-4 w-4 flex-shrink-0 text-white" />
          <p className="text-xs text-white/95">
            Payment failed. Please update your payment method to keep your
            subscription active.
          </p>
        </div>
      )}

      {showConfirm && (
        <div className="relative z-10 mt-6 rounded-2xl bg-background p-5 ring-1 ring-light-border">
          <p className="text-sm font-semibold text-heading">
            Cancel subscription?
          </p>
          <p className="mt-1 text-xs text-para-muted">
            You&apos;ll keep access until {renewalDate}. You can re-subscribe
            anytime.
          </p>
          <div className="mt-4 flex gap-2">
            <button
              onClick={() => {
                onCancel();
                setShowConfirm(false);
              }}
              disabled={isCancelling}
              className="rounded-lg bg-destructive px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-destructive/90 disabled:opacity-60"
            >
              {isCancelling ? "Cancelling..." : "Yes, cancel"}
            </button>
            <button
              onClick={() => setShowConfirm(false)}
              className="rounded-lg border border-light-border px-3 py-1.5 text-xs font-medium text-para-muted hover:bg-secondary/5"
            >
              Keep subscription
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
