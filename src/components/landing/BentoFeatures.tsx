"use client";

import { motion } from "framer-motion";
import {
  MessageSquare,
  FileText,
  Calendar,
  BarChart3,
  Users,
  Zap,
} from "lucide-react";

// --- Mini Mockup Components ---

const DashboardMockup = () => (
  <div className="w-full h-full bg-white dark:bg-card rounded-xl border border-light-border p-4 shadow-sm overflow-hidden relative">
    {/* Sidebar */}
    <div className="absolute left-0 top-0 bottom-0 w-16 bg-main-background border-r border-light-border flex flex-col items-center py-4 space-y-3">
      <div className="w-8 h-8 rounded-lg bg-primary/20" />
      <div className="w-8 h-8 rounded-lg bg-secondary/10" />
      <div className="w-8 h-8 rounded-lg bg-secondary/10" />
    </div>
    {/* Header */}
    <div className="ml-16 h-12 border-b border-light-border flex items-center px-4 justify-between">
      <div className="w-24 h-3 bg-gray-200 dark:bg-gray-700 rounded-full" />
      <div className="flex gap-2">
        <div className="w-6 h-6 rounded-full bg-gray-200 dark:bg-gray-700" />
        <div className="w-6 h-6 rounded-full bg-gray-200 dark:bg-gray-700" />
      </div>
    </div>
    {/* Content */}
    <div className="ml-16 p-4 space-y-3">
      {[1, 2, 3].map((i) => (
        <motion.div
          key={i}
          initial={{ x: 20, opacity: 0 }}
          whileInView={{ x: 0, opacity: 1 }}
          transition={{ delay: i * 0.2 }}
          className="flex items-center justify-between p-3 rounded-lg bg-main-background border border-light-border"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-primary/10" />
            <div className="space-y-1">
              <div className="w-20 h-2 bg-gray-200 dark:bg-gray-700 rounded" />
              <div className="w-12 h-2 bg-gray-100 dark:bg-gray-800 rounded" />
            </div>
          </div>
          <div className="w-12 h-6 rounded-full bg-green-500/10" />
        </motion.div>
      ))}
    </div>
  </div>
);

const ChatMockup = () => (
  <div className="w-full h-full bg-main-background p-4 flex flex-col gap-3 overflow-hidden relative rounded-xl border border-light-border">
    <div className="absolute top-0 left-0 right-0 h-8 bg-white dark:bg-card border-b border-light-border flex items-center px-3 gap-2">
      <div className="w-2 h-2 rounded-full bg-red-400" />
      <div className="w-2 h-2 rounded-full bg-yellow-400" />
      <div className="w-2 h-2 rounded-full bg-green-400" />
    </div>
    <div className="mt-6 flex flex-col gap-3">
      <motion.div
        initial={{ scale: 0.8, opacity: 0, y: 10 }}
        whileInView={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="self-start bg-white dark:bg-card border border-light-border rounded-2xl rounded-tl-none p-3 max-w-[80%] shadow-sm"
      >
        <div className="w-32 h-2 bg-gray-200 dark:bg-gray-700 rounded mb-1" />
        <div className="w-24 h-2 bg-gray-200 dark:bg-gray-700 rounded" />
      </motion.div>
      <motion.div
        initial={{ scale: 0.8, opacity: 0, y: 10 }}
        whileInView={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="self-end bg-primary text-white rounded-2xl rounded-tr-none p-3 max-w-[80%] shadow-sm"
      >
        <div className="w-28 h-2 bg-white/40 rounded" />
      </motion.div>
      <motion.div
        initial={{ scale: 0.8, opacity: 0, y: 10 }}
        whileInView={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ delay: 1.0 }}
        className="self-start bg-white dark:bg-card border border-light-border rounded-2xl rounded-tl-none p-3 max-w-[80%] shadow-sm"
      >
        <div className="w-40 h-2 bg-gray-200 dark:bg-gray-700 rounded" />
      </motion.div>
    </div>
  </div>
);

const CalendarMockup = () => (
  <div className="w-full h-full bg-white dark:bg-card rounded-xl border border-light-border p-4 relative overflow-hidden">
    <div className="grid grid-cols-7 gap-2 mb-2">
      {["S", "M", "T", "W", "T", "F", "S"].map((d) => (
        <div key={d} className="text-center text-xs text-para-muted">
          {d}
        </div>
      ))}
    </div>
    <div className="grid grid-cols-7 gap-2">
      {Array.from({ length: 14 }).map((_, i) => (
        <div
          key={i}
          className="aspect-square rounded-md bg-main-background border border-light-border relative group"
        >
          {i === 3 && (
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              className="absolute inset-1 bg-accent/20 rounded-sm"
            />
          )}
          {i === 8 && (
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              transition={{ delay: 0.2 }}
              className="absolute inset-1 bg-primary/20 rounded-sm"
            />
          )}
        </div>
      ))}
    </div>
    {/* Floating card */}
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      whileInView={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.5 }}
      className="absolute bottom-4 left-4 right-4 bg-background/80 backdrop-blur-md border border-light-border rounded-lg p-3 shadow-lg flex items-center gap-3"
    >
      <div className="w-10 h-10 rounded bg-accent/10 flex items-center justify-center text-accent">
        <Calendar className="w-5 h-5" />
      </div>
      <div>
        <div className="w-20 h-2 bg-heading/20 rounded mb-1" />
        <div className="w-12 h-2 bg-para-muted/20 rounded" />
      </div>
    </motion.div>
  </div>
);

const AnalyticsMockup = () => (
  <div className="w-full h-full flex items-end justify-between p-6 bg-main-background rounded-xl gap-2">
    {[40, 70, 50, 90, 60, 80].map((h, i) => (
      <motion.div
        key={i}
        initial={{ height: 0 }}
        whileInView={{ height: `${h}%` }}
        transition={{ delay: i * 0.1, type: "spring" }}
        className="w-full bg-gradient-to-t from-primary/20 to-primary rounded-t-lg opacity-80"
      />
    ))}
  </div>
);

// --- Main Component ---

export default function BentoFeatures() {
  return (
    <section className="py-24 sm:py-32 bg-background relative" id="features">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center mb-16">
          <h2 className="text-3xl font-bold font-raleway tracking-tight text-heading sm:text-5xl mb-4">
            Engineered for <span className="text-primary">Focus</span>.
          </h2>
          <p className="text-lg text-para-muted">
            A complete ecosystem of tools designed to remove friction from your
            academic life.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 grid-rows-[auto_auto_auto] gap-6">
          {/* Card 1: Command Center (Big, Standard) */}
          <motion.div
            className="col-span-1 md:col-span-2 lg:col-span-2 row-span-2 rounded-3xl bg-secondary/5 border border-light-border p-8 overflow-hidden relative group"
            whileHover={{ y: -5 }}
          >
            <div className="relative z-10 mb-8">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-2xl font-bold text-heading font-raleway">
                Command Center
              </h3>
              <p className="text-para-muted mt-2">
                Access all your rooms, assignments, and discussions from a
                single, unified dashboard.
              </p>
            </div>
            <div className="absolute right-[-40px] bottom-[-40px] w-4/5 h-3/5 shadow-2xl rounded-tl-2xl overflow-hidden border border-light-border/50 group-hover:scale-105 transition-transform duration-500">
              <DashboardMockup />
            </div>
          </motion.div>

          {/* Card 2: Real-time Chat (Tall) */}
          <motion.div
            className="col-span-1 md:col-span-1 lg:col-span-1 row-span-2 rounded-3xl bg-white dark:bg-card border border-light-border p-6 overflow-hidden relative group"
            whileHover={{ y: -5 }}
          >
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background/50 z-10" />
            <div className="h-full flex flex-col">
              <div className="flex-1 min-h-[200px] mb-4 relative">
                <ChatMockup />
              </div>
              <div className="z-20 relative">
                <h3 className="text-xl font-bold text-heading font-raleway flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-accent" />
                  Real-time
                </h3>
                <p className="text-sm text-para-muted mt-1">
                  Instant communication with zero latency.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Card 3: Analytics (Wide) */}
          <motion.div
            className="col-span-1 md:col-span-3 lg:col-span-1 row-span-1 rounded-3xl bg-background border border-light-border p-6 relative group overflow-hidden"
            whileHover={{ y: -5 }}
          >
            <div className="flex items-center justify-between mb-4 relative z-10">
              <h3 className="text-lg font-bold text-heading font-raleway">
                Insights
              </h3>
              <BarChart3 className="w-5 h-5 text-gray-400" />
            </div>
            <div className="h-32 w-full">
              <AnalyticsMockup />
            </div>
          </motion.div>

          {/* Card 4: Scheduling (Square) */}
          <motion.div
            className="col-span-1 md:col-span-1 lg:col-span-1 row-span-1 rounded-3xl bg-gradient-to-br from-primary/5 to-secondary/5 border border-light-border p-6 relative group overflow-hidden"
            whileHover={{ y: -5 }}
          >
            <h3 className="text-lg font-bold text-heading font-raleway mb-4 relative z-10">
              Scheduling
            </h3>
            <div className="absolute right-[-20px] bottom-[-20px] w-[140%] h-[140%] opacity-50 group-hover:opacity-100 transition-opacity duration-300">
              <CalendarMockup />
            </div>
          </motion.div>

          {/* Card 5: File Sharing (Wide) */}
          <motion.div
            className="col-span-1 md:col-span-3 lg:col-span-2 row-span-1 rounded-3xl bg-heading text-background p-8 relative overflow-hidden group"
            whileHover={{ y: -5 }}
          >
            <div className="relative z-10 grid grid-cols-2 gap-8 items-center h-full">
              <div>
                <h3 className="text-2xl font-bold font-raleway text-white mb-2">
                  Resource Library
                </h3>
                <p className="text-gray-400">
                  Drag, drop, and share resources effortlessly. Unlimited
                  storage for your academic needs.
                </p>
              </div>
              <div className="relative h-full flex items-center justify-center">
                {/* Stacked Cards Animation */}
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    initial={{ rotate: i * 5, y: i * 10, x: i * 10 }}
                    whileInView={{ rotate: i * 10 - 10, y: i * 5, x: i * 20 }}
                    transition={{ delay: 0.2 }}
                    className="absolute w-24 h-32 bg-white/10 backdrop-blur-md border border-white/20 rounded-lg"
                    style={{ zIndex: 3 - i }}
                  />
                ))}
                <div className="absolute z-10 w-24 h-32 bg-white rounded-lg flex items-center justify-center shadow-2xl transform group-hover:scale-110 transition-transform">
                  <FileText className="w-8 h-8 text-primary" />
                </div>
              </div>
            </div>
          </motion.div>

          {/* Card 6: Community (Small) */}
          <motion.div
            className="col-span-1 lg:col-span-2 row-span-1 rounded-3xl bg-secondary/10 border border-light-border p-8 flex items-center justify-between group overflow-hidden relative"
            whileHover={{ y: -5 }}
          >
            <div className="relative z-10">
              <h3 className="text-xl font-bold text-heading font-raleway">
                Community Driven
              </h3>
              <p className="text-para-muted">Join thousands of students.</p>
            </div>
            <div className="flex -space-x-4 relative z-10">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="w-12 h-12 rounded-full border-2 border-background bg-gray-300 flex items-center justify-center text-xs font-bold ring-2 ring-white dark:ring-card"
                >
                  <div
                    className={`w-full h-full rounded-full bg-gradient-to-br from-gray-200 to-gray-400`}
                  />
                </div>
              ))}
              <div className="w-12 h-12 rounded-full border-2 border-background bg-primary text-white flex items-center justify-center font-bold text-xs ring-2 ring-white dark:ring-card z-20">
                +1k
              </div>
            </div>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white/20 dark:to-white/5 opacity-0 group-hover:opacity-100 transition-opacity" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
