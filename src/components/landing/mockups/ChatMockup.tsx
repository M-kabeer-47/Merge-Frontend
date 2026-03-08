"use client";

import { motion } from "framer-motion";

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

export default ChatMockup;
