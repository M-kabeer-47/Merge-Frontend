"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Check,
  Sparkles,
  BookOpen,
  Zap,
  Rocket,
  GraduationCap,
  Building2,
  type LucideIcon,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Plan data — mirrors the backend subscription seed                  */
/*  (merge-backend/src/subscription/subscription.seed.ts)              */
/* ------------------------------------------------------------------ */

type Role = "student" | "instructor";

type Plan = {
  name: string;
  tagline: string;
  /** PKR / month — 0 means free */
  price: number;
  icon: LucideIcon;
  features: string[];
  popular?: boolean;
};

const PLANS: Record<Role, Plan[]> = {
  student: [
    {
      name: "Student Free",
      tagline: "For getting started — no commitment.",
      price: 0,
      icon: BookOpen,
      features: [
        "Join unlimited rooms",
        "5 notes",
        "Calendar tasks",
        "Daily challenges",
      ],
    },
    {
      name: "Student Plus",
      tagline: "For students who want everything unlocked.",
      price: 200,
      icon: Zap,
      features: ["Unlimited notes", "AI Assistant", "Focus tracker"],
      popular: true,
    },
  ],
  instructor: [
    {
      name: "Instructor Starter",
      tagline: "For trying out the platform with a small class.",
      price: 0,
      icon: Rocket,
      features: [
        "2 rooms",
        "Up to 20 students/room",
        "10 notes",
        "Quizzes & assignments",
        "Live sessions",
      ],
    },
    {
      name: "Educator",
      tagline: "For active teachers running real classes.",
      price: 500,
      icon: GraduationCap,
      features: [
        "10 rooms",
        "Up to 100 students/room",
        "Unlimited notes",
        "AI Assistant",
        "AI lecture summaries (shared with room)",
      ],
      popular: true,
    },
    {
      name: "Instructor Pro",
      tagline: "For institutions and power instructors.",
      price: 1500,
      icon: Building2,
      features: [
        "Unlimited rooms",
        "Unlimited students/room",
        "Unlimited notes",
        "AI Assistant",
        "Lecture summaries",
        "AI bot answers in Live Q&A",
      ],
    },
  ],
};

/* ------------------------------------------------------------------ */
/*  Pricing card — same visual language as the billing PlanCard        */
/* ------------------------------------------------------------------ */

function PricingCard({ plan, prevName }: { plan: Plan; prevName?: string }) {
  const isFree = plan.price === 0;
  const isPopular = !!plan.popular;
  // The featured plan is rendered as a solid dark/branded card.
  const dark = isPopular;
  const Icon = plan.icon;

  return (
    <div
      className={`group relative flex h-full flex-col overflow-hidden rounded-3xl p-8 transition-all duration-300 lg:p-9 ${
        dark
          ? "bg-primary text-white shadow-2xl shadow-primary/30"
          : "bg-background text-heading ring-1 ring-light-border hover:-translate-y-1 hover:shadow-lg"
      }`}
    >
      {/* Soft glow inside the dark card */}
      {dark && (
        <div
          aria-hidden
          className="pointer-events-none absolute -right-12 -top-16 h-56 w-56 rounded-full bg-secondary/40 blur-3xl"
        />
      )}

      {/* Header: plan icon + (reserved) pill slot */}
      <div className="relative z-10 mb-6 flex items-start justify-between">
        <span
          className={`flex h-12 w-12 items-center justify-center rounded-2xl ${
            dark ? "bg-white/15 text-white" : "bg-primary/10 text-primary"
          }`}
        >
          <Icon className="h-6 w-6" />
        </span>
        <div className="flex h-7 items-center">
          {isPopular && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-[11px] font-semibold text-white backdrop-blur-sm">
              <Sparkles className="h-3 w-3" /> Most popular
            </span>
          )}
        </div>
      </div>

      {/* Name + tagline */}
      <div className="relative z-10">
        <h3 className="font-raleway text-2xl font-bold">{plan.name}</h3>
        <p
          className={`mt-1.5 min-h-[2.75rem] text-sm leading-relaxed ${
            dark ? "text-white/70" : "text-para-muted"
          }`}
        >
          {plan.tagline}
        </p>
      </div>

      {/* Price */}
      <div className="relative z-10 mt-6">
        <div className="flex items-end gap-1.5">
          {isFree ? (
            <span className="font-raleway text-4xl font-bold leading-none">
              Free
            </span>
          ) : (
            <>
              <span className="font-raleway text-lg font-semibold opacity-70">
                Rs.
              </span>
              <span className="font-raleway text-4xl font-bold leading-none">
                {plan.price}
              </span>
              <span
                className={`mb-0.5 text-sm font-medium ${
                  dark ? "text-white/60" : "text-para-muted"
                }`}
              >
                /mo
              </span>
            </>
          )}
        </div>
        <p
          className={`mt-2 h-4 text-xs ${
            dark ? "text-white/55" : "text-para-muted"
          }`}
        >
          {isFree ? "Free forever" : "Billed monthly · cancel anytime"}
        </p>
      </div>

      {/* Divider */}
      <div
        className={`relative z-10 my-6 h-px w-full ${
          dark ? "bg-white/15" : "bg-light-border"
        }`}
      />

      {/* What's included / ladder line */}
      <p
        className={`relative z-10 mb-4 text-xs font-semibold uppercase tracking-wide ${
          dark ? "text-white/80" : "text-heading"
        }`}
      >
        {prevName ? `Everything in ${prevName}, plus` : "What's included"}
      </p>
      <ul className="relative z-10 mb-8 flex-1 space-y-3">
        {plan.features.map((f, i) => (
          <li key={i} className="flex items-start gap-2.5">
            <span
              className={`mt-0.5 flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full ${
                dark ? "bg-white/20 text-white" : "bg-secondary/15 text-secondary"
              }`}
            >
              <Check className="h-2.5 w-2.5" strokeWidth={3.5} />
            </span>
            <span
              className={`text-sm leading-relaxed ${
                dark ? "text-white/85" : "text-para"
              }`}
            >
              {f}
            </span>
          </li>
        ))}
      </ul>

      {/* CTA */}
      <div className="relative z-10">
        <Link
          href="/sign-up"
          className={`block w-full rounded-xl py-3 text-center text-sm font-semibold transition-all ${
            dark
              ? "bg-white text-primary hover:bg-white/90"
              : isFree
                ? "border border-light-border bg-background text-heading hover:border-secondary/40 hover:bg-secondary/5"
                : "bg-primary text-white shadow-lg shadow-primary/25 hover:bg-primary/90"
          }`}
        >
          {isFree ? "Get started free" : `Start with ${plan.name}`}
        </Link>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Role toggle                                                        */
/* ------------------------------------------------------------------ */

function RoleToggle({
  role,
  onChange,
}: {
  role: Role;
  onChange: (r: Role) => void;
}) {
  const options: { value: Role; label: string }[] = [
    { value: "student", label: "For Students" },
    { value: "instructor", label: "For Instructors" },
  ];

  return (
    <div className="inline-flex items-center gap-1 rounded-full border border-light-border bg-background p-1 shadow-sm">
      {options.map((opt) => {
        const active = role === opt.value;
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            className={`relative z-10 rounded-full px-5 py-2 text-sm font-semibold transition-colors ${
              active ? "text-white" : "text-para hover:text-primary"
            }`}
          >
            {active && (
              <motion.span
                layoutId="role-toggle-pill"
                transition={{ type: "spring", stiffness: 380, damping: 32 }}
                className="absolute inset-0 z-0 rounded-full bg-primary shadow-md shadow-primary/30"
              />
            )}
            <span className="relative z-10">{opt.label}</span>
          </button>
        );
      })}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Section                                                            */
/* ------------------------------------------------------------------ */

export default function Pricing() {
  const [role, setRole] = useState<Role>("student");
  const plans = PLANS[role];

  return (
    <section
      id="pricing"
      className="relative w-full overflow-hidden bg-main-background py-24"
    >
      <div className="pointer-events-none absolute left-1/2 top-1/4 -z-0 h-1/2 w-2/3 -translate-x-1/2 rounded-full bg-primary/5 blur-[120px]" />

      <div className="relative z-10 mx-auto max-w-[1400px] px-6 lg:px-8">
        {/* Heading */}
        <div className="mx-auto max-w-3xl text-center">
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.18em] text-primary">
            Pricing
          </p>
          <h2 className="font-raleway text-4xl font-black leading-tight tracking-tight text-heading text-balance sm:text-5xl">
            Simple pricing for{" "}
            <span className="text-primary">every learner</span>
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-para-muted">
            Start free and upgrade anytime. Plans built for both students and
            instructors — no hidden fees, cancel whenever.
          </p>
        </div>

        {/* Toggle */}
        <div className="mt-10 flex justify-center">
          <RoleToggle role={role} onChange={setRole} />
        </div>

        {/* Cards */}
        <AnimatePresence mode="wait">
          <motion.div
            key={role}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className={`mx-auto mt-12 grid grid-cols-1 items-stretch gap-6 lg:gap-7 ${
              plans.length === 2
                ? "max-w-4xl sm:grid-cols-2"
                : "max-w-[1280px] sm:grid-cols-2 lg:grid-cols-3"
            }`}
          >
            {plans.map((plan, i) => (
              <PricingCard
                key={plan.name}
                plan={plan}
                prevName={i > 0 ? plans[i - 1].name : undefined}
              />
            ))}
          </motion.div>
        </AnimatePresence>

        {/* Footnote */}
        <p className="mt-10 text-center text-sm text-para-muted">
          Prices in PKR. Complete challenges to unlock discounts of up to 30% at
          checkout.
        </p>
      </div>
    </section>
  );
}
