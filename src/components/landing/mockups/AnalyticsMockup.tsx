"use client";

import { motion } from "framer-motion";

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

export default AnalyticsMockup;
