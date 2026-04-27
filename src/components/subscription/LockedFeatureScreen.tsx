"use client";

import Link from "next/link";
import { Lock, Sparkles, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

interface Props {
  /** Short feature name, e.g. "AI Assistant" */
  featureName: string;
  /** One-line explanation of what the feature does */
  description: string;
  /** Bullet list of what the feature unlocks (3-5 items) */
  perks?: string[];
  /** Plan name needed, e.g. "Student Plus" or "Educator" */
  requiredPlan?: string;
  /** Custom upgrade link target (defaults to /billing) */
  upgradeHref?: string;
}

export default function LockedFeatureScreen({
  featureName,
  description,
  perks = [],
  requiredPlan,
  upgradeHref = "/billing",
}: Props) {
  return (
    <div className="flex h-full w-full items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="relative max-w-md w-full overflow-hidden rounded-3xl bg-background p-8 ring-1 ring-light-border shadow-xl"
      >
        {/* Decorative gradient orb */}
        <div className="pointer-events-none absolute -top-24 -right-24 h-56 w-56 rounded-full bg-gradient-to-br from-primary/30 via-secondary/20 to-accent/10 blur-3xl" />

        {/* Lock badge */}
        <div className="relative mb-6 flex justify-center">
          <div className="relative">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-secondary shadow-lg shadow-primary/30">
              <Lock className="h-8 w-8 text-white" strokeWidth={2.25} />
            </div>
            {/* Glow */}
            <div className="absolute inset-0 -z-10 rounded-2xl bg-primary/40 blur-xl" />
          </div>
        </div>

        {/* Heading */}
        <div className="relative text-center">
          <p className="inline-flex items-center gap-1 rounded-full bg-accent/10 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-accent ring-1 ring-accent/20">
            <Sparkles className="h-3 w-3" /> Premium feature
          </p>
          <h2 className="mt-3 font-raleway text-2xl font-bold text-heading">
            {featureName} is locked
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-para-muted">
            {description}
          </p>
        </div>

        {/* Perks */}
        {perks.length > 0 && (
          <ul className="relative mt-6 space-y-2">
            {perks.map((p, i) => (
              <li key={i} className="flex items-start gap-2.5">
                <span className="mt-0.5 flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full bg-success/15">
                  <svg className="h-2.5 w-2.5 text-success" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                    <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
                <span className="text-xs text-para">{p}</span>
              </li>
            ))}
          </ul>
        )}

        {/* CTA */}
        <Link
          href={upgradeHref}
          className="relative mt-7 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-primary to-secondary px-5 py-3 text-sm font-semibold text-white shadow-md shadow-primary/20 transition-all hover:shadow-lg hover:shadow-primary/30"
        >
          {requiredPlan ? `Upgrade to ${requiredPlan}` : "View plans"}
          <ArrowRight className="h-4 w-4" />
        </Link>

        <p className="relative mt-3 text-center text-[11px] text-para-muted">
          Cancel anytime. Earn badges from challenges to get up to 30% off.
        </p>
      </motion.div>
    </div>
  );
}
