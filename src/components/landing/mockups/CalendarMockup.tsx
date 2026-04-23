"use client";

import { motion } from "framer-motion";
import { Calendar } from "lucide-react";

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

export default CalendarMockup;
