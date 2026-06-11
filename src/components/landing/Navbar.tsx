"use client";

import Link from "next/link";
import { useState } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useMotionValueEvent,
} from "framer-motion";
import { ArrowRight, Menu, X } from "lucide-react";

const navLinks = [
  { label: "Features", href: "#features" },
  { label: "How it works", href: "#how-it-works" },
  { label: "Testimonials", href: "#testimonials" },
  { label: "Pricing", href: "#pricing" },
  { label: "FAQ", href: "#faq" },
];

export default function Navbar() {
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useMotionValueEvent(scrollY, "change", (latest) => {
    setScrolled(latest > 24);
  });

  return (
    <header className="fixed inset-x-0 top-0 z-50 flex flex-col items-center px-4 pt-3 lg:pt-4">
      <motion.nav
        initial={false}
        animate={{ width: scrolled ? "min(64rem, 100%)" : "min(87.5rem, 100%)" }}
        transition={{ type: "spring", stiffness: 380, damping: 34 }}
        className={`relative flex h-16 w-full items-center justify-between rounded-full px-3 transition-[background-color,box-shadow,border-color] duration-300 lg:px-5 ${
          scrolled || open
            ? "border border-light-border/70 bg-background/70 shadow-[0_10px_40px_-12px_rgba(47,26,88,0.28)] backdrop-blur-xl"
            : "border border-transparent bg-transparent"
        }`}
      >
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.svg" alt="Merge logo" className="h-8 w-8" />
          <span className="font-raleway text-2xl font-bold tracking-tight text-primary">
            Merge
          </span>
        </Link>

        {/* Center links (desktop) */}
        <div className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-1 lg:flex">
          {navLinks.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="rounded-full px-3.5 py-2 text-sm font-medium text-para transition-colors hover:bg-primary/[0.06] hover:text-primary"
            >
              {item.label}
            </a>
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1 lg:gap-2">
          <Link
            href="/sign-in"
            className="hidden rounded-full px-4 py-2 text-sm font-medium text-heading transition-colors hover:text-primary lg:block"
          >
            Log in
          </Link>
          <Link href="/sign-up" className="hidden sm:block">
            <motion.span
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="group flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-primary/25 transition-colors hover:bg-secondary"
            >
              Get Started
              <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
            </motion.span>
          </Link>

          {/* Mobile menu toggle */}
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            className="flex h-10 w-10 items-center justify-center rounded-full text-heading transition-colors hover:bg-primary/[0.06] hover:text-primary lg:hidden"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </motion.nav>

      {/* Mobile dropdown menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="mobile-menu"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="mt-2 w-full max-w-sm overflow-hidden rounded-3xl border border-light-border bg-background/90 p-3 shadow-[0_20px_50px_-12px_rgba(47,26,88,0.3)] backdrop-blur-xl lg:hidden"
          >
            <div className="flex flex-col">
              {navLinks.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="rounded-2xl px-4 py-3 text-sm font-medium text-para transition-colors hover:bg-primary/[0.06] hover:text-primary"
                >
                  {item.label}
                </a>
              ))}

              <div className="my-2 h-px bg-light-border" />

              <Link
                href="/sign-in"
                onClick={() => setOpen(false)}
                className="rounded-2xl px-4 py-3 text-sm font-semibold text-heading transition-colors hover:bg-primary/[0.06] hover:text-primary"
              >
                Log in
              </Link>
              <Link
                href="/sign-up"
                onClick={() => setOpen(false)}
                className="mt-1 flex items-center justify-center gap-2 rounded-2xl bg-primary px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-primary/25 transition-colors hover:bg-secondary"
              >
                Get Started
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
