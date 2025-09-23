"use client";
import React from "react";
import { easeOut, motion } from "framer-motion";

interface AuthIllustrationProps {
  imageUrl: string;
  title: string;
  subtitle: string;
  page?: "sign-in" | "sign-up";
}

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.6,
      staggerChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: easeOut,
    },
  },
};

const logoVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.4,
      ease: easeOut,
    },
  },
};

const illustrationVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.7,
      ease: easeOut,
    },
  },
};

export default function AuthIllustration({
  imageUrl,
  title,
  subtitle,
  page = "sign-up",
}: AuthIllustrationProps) {
  return (
    <motion.div
      className="flex flex-col h-full p-8 w-full"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Logo */}
      <motion.div className="mb-8" variants={logoVariants}>
        <div className="flex items-center space-x-2">
          <img src={"/logo.svg"} alt="Logo" className="h-10 w-10" />
          <span className="text-2xl font-raleway font-bold text-heading">
            Merge
          </span>
        </div>
      </motion.div>

      {/* Centered Illustration */}
      <div className="flex-1 flex items-center justify-center">
        <motion.div className="w-full max-w-sm" variants={illustrationVariants}>
          <motion.img
            src={imageUrl}
            alt="Authentication illustration"
            className={`w-full h-auto ${
              page === "sign-in"
                ? "scale-120 relative top-[-30px]"
                : "scale-120"
            }`}
          />
        </motion.div>
      </div>

      {/* Bottom Text */}

      <motion.div
        className={`text-center relative  top-[-50px]`}
        variants={itemVariants}
      >
        <h2 className="text-2xl font-raleway font-semibold text-heading mb-2">
          {title}
        </h2>
        <p className="text-normal-text-muted">{subtitle}</p>
      </motion.div>
    </motion.div>
  );
}
