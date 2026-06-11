"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { motion } from "framer-motion";
import {
  Twitter,
  Github,
  Linkedin,
  Mail,
  ArrowRight,
  Sun,
  Moon,
} from "lucide-react";

// Fine fractal-noise grain for a premium matte finish
const grain =
  "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")";

const footerLinks: { heading: string; links: { label: string; href: string }[] }[] = [
  {
    heading: "Product",
    links: [
      { label: "Features", href: "#features" },
      { label: "How it works", href: "#how-it-works" },
      { label: "Pricing", href: "#pricing" },
      { label: "Testimonials", href: "#testimonials" },
    ],
  },
  {
    heading: "Company",
    links: [
      { label: "About", href: "#" },
      { label: "Blog", href: "#" },
      { label: "Careers", href: "#" },
      { label: "Contact", href: "#" },
    ],
  },
  {
    heading: "Resources",
    links: [
      { label: "Help Center", href: "#" },
      { label: "Community", href: "#" },
      { label: "FAQ", href: "#faq" },
      { label: "Status", href: "#" },
    ],
  },
  {
    heading: "Legal",
    links: [
      { label: "Terms", href: "#" },
      { label: "Privacy", href: "#" },
      { label: "Cookies", href: "#" },
      { label: "Security", href: "#" },
    ],
  },
];

const socials = [
  { label: "Twitter", icon: Twitter, href: "#" },
  { label: "GitHub", icon: Github, href: "#" },
  { label: "LinkedIn", icon: Linkedin, href: "#" },
  { label: "Email", icon: Mail, href: "#" },
];

/* Link with a left-to-right animated underline on hover */
function FooterLink({ label, href }: { label: string; href: string }) {
  return (
    <a
      href={href}
      className="group/link relative inline-block text-sm text-white/60 transition-colors hover:text-white"
    >
      {label}
      <span className="absolute -bottom-0.5 left-0 h-px w-0 bg-white transition-all duration-300 ease-out group-hover/link:w-full" />
    </a>
  );
}

function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return <div className="h-9 w-[88px]" aria-hidden />;
  }

  const isDark = resolvedTheme === "dark";
  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
      className="flex h-9 items-center gap-2 rounded-full border border-white/20 bg-white/5 px-3 text-xs font-semibold text-white/70 transition-colors hover:border-white/40 hover:text-white"
    >
      {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
      {isDark ? "Light" : "Dark"}
    </button>
  );
}

export default function Footer() {
  return (
    <footer className="relative w-full overflow-hidden bg-primary text-white">
      {/* ---- Decorative background ---- */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -right-24 -top-28 h-[26rem] w-[26rem] rounded-full bg-secondary/45 blur-[130px]"
        animate={{ scale: [1, 1.15, 1], x: [0, 40, 0], y: [0, 24, 0], opacity: [0.5, 0.85, 0.5] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -bottom-28 -left-20 h-[26rem] w-[26rem] rounded-full bg-secondary/30 blur-[130px]"
        animate={{ scale: [1, 1.12, 1], x: [0, -30, 0], y: [0, -20, 0], opacity: [0.35, 0.7, 0.35] }}
        transition={{ duration: 17, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          background:
            "radial-gradient(ellipse 60% 45% at 50% 0%, rgba(255,255,255,0.10) 0%, transparent 65%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0 opacity-[0.06] mix-blend-soft-light"
        style={{ backgroundImage: grain }}
      />

      <div className="relative z-10 mx-auto max-w-[1400px] px-6 lg:px-8">
        {/* ============ Brand + newsletter + links ============ */}
        <div className="grid grid-cols-1 gap-12 py-14 lg:grid-cols-12 lg:pt-20">
          {/* Brand + newsletter */}
          <div className="lg:col-span-4">
            <Link href="/" className="flex items-center gap-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/logo.svg"
                alt="Merge logo"
                className="h-8 w-8 brightness-0 invert"
              />
              <span className="font-raleway text-2xl font-bold tracking-tight text-white">
                Merge
              </span>
            </Link>

            <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/65">
              The all-in-one learning platform — live sessions, AI assistance,
              focus tracking, and collaboration in one distraction-free space.
            </p>

            {/* Newsletter */}
            <form
              className="mt-6 flex max-w-sm items-center gap-2"
              onSubmit={(e) => e.preventDefault()}
            >
              <input
                type="email"
                required
                placeholder="Enter your email"
                aria-label="Email address"
                className="h-11 w-full flex-1 rounded-full border border-white/20 bg-white/10 px-4 text-sm text-white placeholder:text-white/50 focus:border-white/40 focus:outline-none focus:ring-2 focus:ring-white/20"
              />
              <button
                type="submit"
                aria-label="Subscribe"
                className="group flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-white text-primary shadow-lg shadow-black/15 transition-colors hover:bg-white/90"
              >
                <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
              </button>
            </form>
            <p className="mt-2 text-xs text-white/55">
              Join the newsletter — product updates, no spam.
            </p>
          </div>

          {/* Link columns */}
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4 lg:col-span-8">
            {footerLinks.map((col) => (
              <div key={col.heading}>
                <h3 className="text-sm font-bold text-white">{col.heading}</h3>
                <ul className="mt-4 space-y-3">
                  {col.links.map((link) => (
                    <li key={link.label}>
                      <FooterLink label={link.label} href={link.href} />
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* ============ Bottom bar ============ */}
        <div className="flex flex-col items-center gap-4 border-t border-white/10 py-6 md:flex-row md:justify-between">
          <div className="flex flex-col items-center gap-3 sm:flex-row sm:gap-4">
            <p className="text-xs leading-5 text-white/60">
              &copy; {new Date().getFullYear()} Merge Inc. All rights reserved.
            </p>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/10 px-2.5 py-1 text-[11px] font-semibold text-white/80">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-success" />
              </span>
              All systems operational
            </span>
          </div>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            <div className="h-5 w-px bg-white/15" />
            <div className="flex items-center gap-2">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-white/5 text-white/70 transition-colors hover:border-white hover:bg-white hover:text-primary"
                >
                  <s.icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Oversized brand watermark */}
      <div
        aria-hidden
        className="pointer-events-none relative z-0 mx-auto max-w-[1400px] select-none px-6 lg:px-8"
      >
        <span className="block translate-y-[18%] font-raleway text-[24vw] font-bold leading-[0.75] tracking-tight text-white/[0.05] lg:text-[17vw]">
          Merge
        </span>
      </div>
    </footer>
  );
}
