"use client";

import { motion } from "framer-motion";
import {
  MessageSquare,
  FileText,
  BarChart3,
  Zap,
} from "lucide-react";
import DashboardMockup from "./mockups/DashboardMockup";
import ChatMockup from "./mockups/ChatMockup";
import CalendarMockup from "./mockups/CalendarMockup";
import AnalyticsMockup from "./mockups/AnalyticsMockup";

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
