"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function CallToAction() {
  return (
    <section className="relative py-24 sm:py-32 overflow-hidden">
      {/* Background Mesh */}
      <div className="absolute inset-0 bg-primary/95 dark:bg-primary/20">
        <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80">
          <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-accent to-secondary opacity-60 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]" />
        </div>
        <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-10" />
      </div>

      <div className="relative mx-auto max-w-7xl px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="mx-auto max-w-2xl"
        >
          <h2 className="text-3xl font-bold font-raleway tracking-tight text-white sm:text-4xl">
            Ready to upgrade your academic workflow?
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-white/80">
            Join the community of students and instructors who are reclaiming
            their focus. Start for free today.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Link
              href="/signup"
              className="rounded-full bg-white px-8 py-3.5 text-sm font-semibold text-primary shadow-sm hover:bg-gray-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white transition-all hover:scale-105 flex items-center gap-2"
            >
              Get Started for Free <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/about"
              className="text-sm font-semibold leading-6 text-white hover:text-white/80"
            >
              Learn more <span aria-hidden="true">→</span>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
