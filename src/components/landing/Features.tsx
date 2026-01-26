"use client";

import { motion } from "framer-motion";
import {
  MessageSquare,
  Calendar,
  Shield,
  Share2,
  Layers,
  Zap,
} from "lucide-react";

const features = [
  {
    name: "Real-time Collaboration",
    description:
      "Chat, share files, and work together instantly with zero latency.",
    icon: MessageSquare,
    color: "bg-blue-500/10 text-blue-500",
  },
  {
    name: "Smart Scheduling",
    description:
      "Automated assignment tracking and deadline reminders tailored for you.",
    icon: Calendar,
    color: "bg-accent/10 text-accent",
  },
  {
    name: "Secure Environment",
    description:
      "Role-based access control ensuring your classroom data stays safe.",
    icon: Shield,
    color: "bg-green-500/10 text-green-500",
  },
  {
    name: "Seamless Sharing",
    description:
      "Drag-and-drop file sharing with generous storage limits for all formats.",
    icon: Share2,
    color: "bg-purple-500/10 text-purple-500",
  },
  {
    name: "Organized Spaces",
    description: "Dedicated rooms for every subject, project, or study group.",
    icon: Layers,
    color: "bg-pink-500/10 text-pink-500",
  },
  {
    name: "Lightning Fast",
    description:
      "Built on modern tech for instant page loads and fluid interactions.",
    icon: Zap,
    color: "bg-yellow-500/10 text-yellow-500",
  },
];

export default function Features() {
  return (
    <div id="features" className="py-24 sm:py-32 relative overflow-hidden">
      {/* Background blobs */}
      <div className="absolute top-1/2 left-0 w-1/3 h-1/3 bg-secondary/5 rounded-full blur-[100px] -z-10" />

      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-base font-semibold leading-7 text-primary"
          >
            Capabilities
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="mt-2 text-3xl font-bold font-raleway tracking-tight text-heading sm:text-4xl"
          >
            Everything you need to <span className="text-secondary">excel</span>
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="mt-6 text-lg leading-8 text-para-muted"
          >
            A comprehensive suite of tools designed to bridge the gap between
            teaching and learning.
          </motion.p>
        </div>

        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
            {features.map((feature, index) => (
              <motion.div
                key={feature.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="flex flex-col relative group"
              >
                <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-white dark:bg-card shadow-sm border border-light-border group-hover:scale-110 transition-transform duration-300">
                  <feature.icon
                    className={`h-6 w-6 ${feature.color.split(" ")[1]}`}
                    aria-hidden="true"
                  />
                </div>
                <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-heading">
                  {feature.name}
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-para-muted">
                  <p className="flex-auto">{feature.description}</p>
                </dd>

                {/* Hover Effect Border */}
                <div className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-transparent via-primary/0 to-transparent group-hover:via-primary/50 transition-all duration-500 w-full" />
              </motion.div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  );
}
