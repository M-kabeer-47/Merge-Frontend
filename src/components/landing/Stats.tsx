"use client";

import { motion } from "framer-motion";

const stats = [
  { id: 1, name: "Active Students", value: "10k+" },
  { id: 2, name: "Messages Sent", value: "500k+" },
  { id: 3, name: "Rooms Created", value: "1,200+" },
  { id: 4, name: "Uptime", value: "99.9%" },
];

export default function Stats() {
  return (
    <div className="bg-main-background py-24 sm:py-32 relative overflow-hidden text-center">
      {/* Decorative Background */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-light-border to-transparent" />

      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mx-auto max-w-2xl lg:max-w-none"
        >
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-heading sm:text-4xl font-raleway">
              Built for <span className="text-primary">Impact</span>
            </h2>
            <p className="mt-4 text-lg leading-8 text-para-muted">
              Empowering academic communities across the globe.
            </p>
          </div>

          <dl className="grid grid-cols-1 gap-x-8 gap-y-16 text-center lg:grid-cols-4">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.id}
                initial={{ scale: 0.5, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                transition={{
                  delay: index * 0.1,
                  type: "spring",
                  stiffness: 100,
                }}
                className="mx-auto flex max-w-xs flex-col gap-y-4"
              >
                <dt className="text-base leading-7 text-para-muted">
                  {stat.name}
                </dt>
                <dd className="order-first text-5xl font-semibold tracking-tight text-heading sm:text-6xl font-raleway">
                  {stat.value}
                </dd>
              </motion.div>
            ))}
          </dl>
        </motion.div>
      </div>

      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-light-border to-transparent" />
    </div>
  );
}
