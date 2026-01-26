"use client";

import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { Button } from "@/components/ui/Button"; // Check if Button exists, otherwise use standard motion.button
import { ArrowRight } from "lucide-react";

export default function Navbar() {
  const { scrollY } = useScroll();
  const bgOpacity = useTransform(scrollY, [0, 100], [0, 0.9]);
  const backdropBlur = useTransform(
    scrollY,
    [0, 100],
    ["blur(0px)", "blur(12px)"],
  );
  const borderOpacity = useTransform(scrollY, [0, 100], [0, 0.1]);

  return (
    <motion.header
      style={{
        backgroundColor: "rgba(255, 255, 255, 0)", // handled vs opacity
        // We'll use a dynamic background style
      }}
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
    >
      <motion.div
        className="absolute inset-0 bg-background/80 dark:bg-main-background/80"
        style={{ opacity: bgOpacity, backdropFilter: backdropBlur }}
      />
      <motion.div
        className="absolute inset-x-0 bottom-0 h-[1px] bg-para/10"
        style={{ opacity: borderOpacity }}
      />

      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          {/* Logo */}
          <div className="flex lg:flex-1">
            <Link href="/" className="-m-1.5 p-1.5 flex items-center gap-2">
              <span className="font-raleway font-black text-2xl tracking-tighter text-primary dark:text-white">
                MERGE<span className="text-accent">.</span>
              </span>
            </Link>
          </div>

          {/* Desktop Links - Minimal for landing */}
          <div className="hidden lg:flex lg:gap-x-12">
            {["Features", "Testimonials", "Pricing"].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                className="text-sm font-semibold leading-6 text-heading hover:text-primary transition-colors"
              >
                {item}
              </a>
            ))}
          </div>

          {/* Actions */}
          <div className="flex flex-1 items-center justify-end gap-x-4">
            <Link href="/login">
              <span className="hidden lg:block text-sm font-semibold leading-6 text-heading hover:text-primary transition-colors cursor-pointer">
                Log in
              </span>
            </Link>
            <Link href="/signup">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-primary/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary flex items-center gap-2"
              >
                Get Started <ArrowRight className="w-4 h-4" />
              </motion.button>
            </Link>
          </div>
        </div>
      </div>
    </motion.header>
  );
}
