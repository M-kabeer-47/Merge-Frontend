"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  ArrowRight,
  Sparkles,
  Users,
  BookOpen,
  MessageCircle,
} from "lucide-react";

export default function Hero() {
  return (
    <div className="relative isolate pt-14 dark:bg-main-background overflow-hidden min-h-screen flex items-center">
      {/* Background Gradients */}
      <div
        className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
        aria-hidden="true"
      >
        <div
          className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-accent to-secondary opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
          style={{
            clipPath:
              "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
          }}
        />
      </div>

      {/* Animated Blobs */}
      <motion.div
        animate={{
          x: [0, 100, 0],
          y: [0, -50, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute top-1/4 right-0 w-96 h-96 bg-primary/20 rounded-full blur-[100px] -z-10"
      />
      <motion.div
        animate={{
          x: [0, -70, 0],
          y: [0, 100, 0],
          scale: [1, 1.3, 1],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2,
        }}
        className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-secondary/10 rounded-full blur-[120px] -z-10"
      />

      <div className="mx-auto max-w-7xl px-6 lg:px-8 py-24 sm:py-32">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          {/* Text Content */}
          <div className="lg:w-1/2 text-center lg:text-left z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center rounded-full px-3 py-1 text-sm font-medium text-secondary ring-1 ring-inset ring-secondary/20 bg-secondary/5 mb-6"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Reimagining Academic Collaboration
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-4xl font-bold font-raleway tracking-tight text-heading sm:text-6xl mb-6 leading-[1.1]"
            >
              Where{" "}
              <span className="text-primary italic relative">
                Knowledge
                <svg
                  className="absolute w-full h-3 -bottom-1 left-0 text-accent opacity-60"
                  viewBox="0 0 100 10"
                  preserveAspectRatio="none"
                >
                  <path
                    d="M0 5 Q 50 10 100 5"
                    stroke="currentColor"
                    strokeWidth="3"
                    fill="none"
                  />
                </svg>
              </span>{" "}
              Meets <br /> collaboration.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mt-4 text-lg leading-8 text-para-muted mb-8 max-w-2xl mx-auto lg:mx-0"
            >
              Seamlessly merge your academic life. Connect with classmates,
              manage assignments, and engage in real-time discussions—all in one
              beautiful workspace.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex items-center justify-center lg:justify-start gap-x-6"
            >
              <Link
                href="/join"
                className="rounded-full bg-primary px-8 py-3.5 text-sm font-semibold text-white shadow-sm hover:bg-primary/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary transition-all hover:scale-105 flex items-center gap-2"
              >
                Start Learning <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/about"
                className="text-sm font-semibold leading-6 text-heading hover:text-primary transition-colors"
              >
                Learn more <span aria-hidden="true">→</span>
              </Link>
            </motion.div>

            {/* Stats / Social Proof */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="mt-12 pt-8 border-t border-light-border flex items-center justify-center lg:justify-start gap-8 grayscale opacity-70 hover:grayscale-0 hover:opacity-100 transition-all duration-500"
            >
              {/* Placeholder logos or stats */}
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="w-10 h-10 rounded-full border-2 border-background bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-500 overflow-hidden"
                  >
                    <Users className="w-5 h-5 opacity-50" />
                  </div>
                ))}
              </div>
              <div className="text-sm">
                <span className="font-bold text-heading">1,000+</span> Students
                Joined
              </div>
            </motion.div>
          </div>

          {/* Visual/Image Side */}
          <div className="lg:w-1/2 relative z-0">
            <motion.div
              initial={{ opacity: 0, scale: 0.8, rotate: 5 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ duration: 0.8, type: "spring" }}
              className="relative"
            >
              {/* Abstract UI Composition */}
              <div className="relative z-10 bg-white/60 dark:bg-card/60 backdrop-blur-xl border border-white/20 dark:border-white/10 rounded-2xl p-6 shadow-2xl transform rotate-[-2deg] hover:rotate-0 transition-transform duration-500">
                {/* Mock Header */}
                <div className="flex items-center justify-between mb-6 border-b border-gray-200/50 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-red-400" />
                    <div className="w-3 h-3 rounded-full bg-yellow-400" />
                    <div className="w-3 h-3 rounded-full bg-green-400" />
                  </div>
                  <div className="h-2 w-20 bg-gray-200 rounded-full" />
                </div>

                {/* Mock Content */}
                <div className="space-y-4">
                  <div className="flex gap-4">
                    <div className="w-1/3 h-32 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center">
                      <BookOpen className="w-8 h-8 text-primary/40" />
                    </div>
                    <div className="w-2/3 h-32 rounded-xl bg-gradient-to-br from-secondary/10 to-secondary/5 flex items-center justify-center">
                      <MessageCircle className="w-8 h-8 text-secondary/40" />
                    </div>
                  </div>
                  <div className="h-4 w-3/4 bg-gray-100 rounded animate-pulse" />
                  <div className="h-4 w-1/2 bg-gray-100 rounded animate-pulse" />
                  <div className="h-4 w-full bg-gray-100 rounded animate-pulse" />
                </div>

                {/* Floating Badge */}
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="absolute -top-6 -right-6 bg-accent text-white p-4 rounded-2xl shadow-lg transform rotate-12"
                >
                  <Sparkles className="w-6 h-6" />
                </motion.div>
              </div>

              {/* Background Decor */}
              <div className="absolute top-10 -right-10 w-full h-full bg-primary/5 rounded-2xl -z-10 transform rotate-[4deg]" />
              <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-accent/20 rounded-full blur-2xl -z-20" />
            </motion.div>
          </div>
        </div>
      </div>

      {/* Bottom Gradient Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent" />
    </div>
  );
}
