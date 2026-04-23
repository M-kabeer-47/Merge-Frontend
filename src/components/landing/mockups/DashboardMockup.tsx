"use client";

import { motion } from "framer-motion";

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

export default DashboardMockup;
