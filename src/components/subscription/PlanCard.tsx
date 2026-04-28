"use client";
import { Check, Sparkles, AlertCircle } from "lucide-react";
import { SubscriptionPlan } from "@/types/subscription";

interface Props {
  plan: SubscriptionPlan;
  isCurrentPlan: boolean;
  onUpgrade: (planId: string) => void;
  isLoading: boolean;
  discountPercent?: number;
  /** Price (PKR/month) of the user's current plan — used to label the CTA Upgrade vs Downgrade. */
  currentPlanPrice?: number;
}

const TIER_TAGLINE: Record<string, string> = {
  // Student
  student_free: "For getting started — no commitment.",
  student_plus: "For students who want everything unlocked.",
  // Instructor
  instructor_starter: "For trying out the platform with a small class.",
  instructor_educator: "For active teachers running real classes.",
  instructor_pro: "For institutions and power instructors.",
  // Legacy fallbacks
  free: "For getting started — no commitment.",
  basic: "For learners ready to do a little more.",
  pro: "For students who want everything unlocked.",
  max: "For power users who want unlimited reach.",
};

export default function PlanCard({
  plan,
  isCurrentPlan,
  onUpgrade,
  isLoading,
  discountPercent,
  currentPlanPrice,
}: Props) {
  // Highlight the middle paid tier as the recommended one
  const isPopular = plan.name === "pro" || plan.name === "student_plus" || plan.name === "instructor_educator";
  // Postgres numeric columns deserialize as strings — coerce before comparing
  const isFree = Number(plan.priceMonthly) === 0;
  const notConfigured = !isFree && !plan.lsVariantId;
  const discountedPrice = discountPercent
    ? Math.round(plan.priceMonthly * (1 - discountPercent / 100))
    : null;
  const tagline = TIER_TAGLINE[plan.name] ?? "";
  // User is on a paid plan AND this card is cheaper → it's a downgrade.
  // Only meaningful when the user actually has a paid plan; on free tier
  // every other card is an upgrade.
  const isDowngrade =
    !isCurrentPlan &&
    !isFree &&
    typeof currentPlanPrice === "number" &&
    currentPlanPrice > 0 &&
    Number(plan.priceMonthly) < currentPlanPrice;

  return (
    <div
      className={`group relative flex h-full flex-col overflow-hidden rounded-3xl p-7 transition-all duration-300 ${
        isPopular
          ? "bg-gradient-to-br from-primary/[0.07] via-secondary/[0.05] to-accent/[0.04] ring-1 ring-primary/25 shadow-xl shadow-primary/10 hover:shadow-2xl hover:shadow-primary/20"
          : isCurrentPlan
            ? "bg-background ring-2 ring-primary/40 shadow-md shadow-primary/5"
            : "bg-background ring-1 ring-light-border hover:ring-secondary/40 hover:-translate-y-0.5 hover:shadow-md"
      }`}
    >
      {/* Decorative sparkle for featured */}
      {isPopular && (
        <svg
          className="pointer-events-none absolute -right-6 top-6 h-32 w-32 text-primary/10"
          viewBox="0 0 100 100"
          fill="currentColor"
          aria-hidden
        >
          <path d="M50 8 L56 44 L92 50 L56 56 L50 92 L44 56 L8 50 L44 44 Z" />
        </svg>
      )}

      {/* Status pill (Current overrides Recommended) */}
      {(isCurrentPlan || isPopular) && (
        <div className="relative z-10 mb-4">
          <span
            className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-[11px] font-semibold ring-1 ${
              isCurrentPlan
                ? "bg-primary/10 text-primary ring-primary/20"
                : "bg-primary/10 text-primary ring-primary/20"
            }`}
          >
            {isCurrentPlan ? (
              <>
                <Check className="h-3 w-3" /> Current plan
              </>
            ) : (
              <>
                <Sparkles className="h-3 w-3" /> Recommended for you
              </>
            )}
          </span>
        </div>
      )}

      {/* Name + tagline */}
      <div className="relative z-10">
        <h3 className="font-raleway text-2xl font-bold text-heading">
          {plan.displayName}
        </h3>
        <p className="mt-1 min-h-[2.5rem] text-sm leading-relaxed text-para-muted">
          {tagline}
        </p>
      </div>

      {/* Price */}
      <div className="relative z-10 mt-5">
        <div className="flex items-baseline gap-1.5">
          <span className="font-raleway text-4xl font-bold text-heading">
            {isFree
              ? "Free"
              : discountPercent
                ? `Rs. ${discountedPrice}`
                : `Rs. ${plan.priceMonthly}`}
          </span>
          {!isFree && (
            <span className="text-sm font-medium text-para-muted">/month</span>
          )}
        </div>
        {discountPercent && !isFree && (
          <div className="mt-1.5 flex items-center gap-2">
            <span className="text-xs text-para-muted line-through">
              Rs. {plan.priceMonthly}
            </span>
            <span className="rounded-full bg-success/10 px-2 py-0.5 text-[10px] font-bold text-success">
              −{discountPercent}% applied
            </span>
          </div>
        )}
      </div>

      {/* Divider */}
      <div className="relative z-10 my-6 h-px w-full bg-light-border" />

      {/* What's included */}
      <p className="relative z-10 mb-3 text-xs font-semibold tracking-wide text-heading">
        What&apos;s included:
      </p>
      <ul className="relative z-10 mb-6 flex-1 space-y-2.5">
        {plan.features.map((f, i) => (
          <li key={i} className="flex items-start gap-2.5">
            <Check
              className={`mt-0.5 h-4 w-4 flex-shrink-0 ${
                isPopular ? "text-primary" : "text-secondary"
              }`}
              strokeWidth={2.75}
            />
            <span className="text-sm leading-relaxed text-para">{f}</span>
          </li>
        ))}
      </ul>

      {/* CTA */}
      <div className="relative z-10">
        {isCurrentPlan ? (
          <button
            disabled
            className="w-full rounded-xl border border-primary/30 bg-primary/5 py-3 text-sm font-semibold text-primary"
          >
            Current Plan
          </button>
        ) : isFree ? (
          <button
            disabled
            className="w-full rounded-xl border border-light-border py-3 text-sm font-medium text-para-muted"
          >
            Free Forever
          </button>
        ) : notConfigured ? (
          <div className="space-y-1.5">
            <button
              disabled
              className="flex w-full items-center justify-center gap-1.5 rounded-xl bg-secondary/10 py-3 text-sm text-para-muted"
            >
              <AlertCircle className="h-3.5 w-3.5" /> Not Configured
            </button>
            <p className="text-center text-[10px] leading-tight text-para-muted">
              Add{" "}
              <code className="rounded bg-secondary/10 px-1">
                LEMON_SQUEEZY_*_VARIANT_ID
              </code>{" "}
              to backend .env
            </p>
          </div>
        ) : (
          <button
            onClick={() => onUpgrade(plan.id)}
            disabled={isLoading}
            className={`w-full rounded-xl py-3 text-sm font-semibold transition-all disabled:opacity-60 ${
              isDowngrade
                ? "border border-light-border bg-background text-para hover:border-secondary/40 hover:bg-secondary/5"
                : isPopular
                  ? "bg-primary text-white shadow-lg shadow-primary/30 hover:bg-primary/90 hover:shadow-xl hover:shadow-primary/40"
                  : "border border-light-border bg-secondary/5 text-heading hover:border-secondary/40 hover:bg-secondary/10"
            }`}
          >
            {isLoading
              ? "Loading..."
              : isDowngrade
                ? `Downgrade to ${plan.displayName}`
                : isPopular
                  ? `Start with ${plan.displayName}`
                  : "Get started"}
          </button>
        )}
      </div>
    </div>
  );
}
