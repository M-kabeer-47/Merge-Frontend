"use client";

import React from "react";
import Image from "next/image";
import { motion } from "motion/react";

interface NoContentStateProps {
  message?: string;
  description?: string;
}

export function NoContentState({
  message = "No content available",
  description = "There are no items to display at this time.",
}: NoContentStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-16 px-4"
    >
      {/* Illustration */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 15 }}
        className="mb-6"
      >
        <Image
          src="/illustrations/empty-folder.png"
          alt="No content"
          width={160}
          height={160}
          className="object-contain"
        />
      </motion.div>

      {/* Heading */}
      <h3 className="text-xl font-bold text-heading mb-2">{message}</h3>

      {/* Description */}
      <p className="text-para-muted text-center max-w-md">{description}</p>
    </motion.div>
  );
}
