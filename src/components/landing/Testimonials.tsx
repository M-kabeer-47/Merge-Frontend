"use client";

import { motion } from "framer-motion";

const testimonials = [
  {
    content:
      "Merge has completely transformed how I manage my coursework. It's like Slack and Canvas had a baby.",
    author: "Sarah J.",
    role: "Computer Science Student",
  },
  {
    content:
      "The real-time collaboration features are a game changer for group projects.",
    author: "David L.",
    role: "UX Design Major",
  },
  {
    content:
      "Finally, an academic platform that doesn't look like it was built in 2005.",
    author: "Emily R.",
    role: "Instructor",
  },
  {
    content:
      "I love how easy it is to organize materials for different classes. The UI is stunning.",
    author: "Michael C.",
    role: "Research Assistant",
  },
  {
    content: "The best part is the speed. Everything loads instantly.",
    author: "Jessica T.",
    role: "Engineering Student",
  },
];

// Duplicate for marquee effect
const marqueeItems = [...testimonials, ...testimonials, ...testimonials];

export default function Testimonials() {
  return (
    <section className="py-24 bg-main-background overflow-hidden relative">
      <div className="mx-auto max-w-7xl px-6 lg:px-8 mb-12 text-center">
        <h2 className="text-3xl font-bold font-raleway text-heading">
          Trusted by Scholars
        </h2>
      </div>

      {/* Gradient Masks */}
      <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-main-background to-transparent z-10" />
      <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-main-background to-transparent z-10" />

      <div className="flex">
        <motion.div
          animate={{ x: "-33.33%" }}
          transition={{
            duration: 40,
            ease: "linear",
            repeat: Infinity,
          }}
          className="flex gap-6 px-3"
        >
          {marqueeItems.map((item, i) => (
            <div
              key={i}
              className="w-[350px] flex-shrink-0 bg-white dark:bg-card p-6 rounded-2xl border border-light-border shadow-sm hover:shadow-md transition-shadow"
            >
              <p className="text-para text-sm leading-relaxed mb-6">
                "{item.content}"
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold text-sm">
                  {item.author.charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-bold text-heading">
                    {item.author}
                  </p>
                  <p className="text-xs text-para-muted">{item.role}</p>
                </div>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
