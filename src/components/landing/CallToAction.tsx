"use client"

import { motion } from "motion/react"

const gridPattern = `
  linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px),
  linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)
`

const squareDots = [
  { top: "15%", left: "18%" },
  { top: "12%", left: "42%" },
  { top: "10%", left: "68%" },
  { top: "10%", right: "8%" },
  { bottom: "20%", left: "8%" },
  { bottom: "18%", left: "35%" },
  { bottom: "22%", right: "20%" },
  { top: "50%", left: "55%" },
] as const

const headingLineVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0 },
}

export default function CTASection() {
  return (
    <section id="cta" className="relative w-full px-6 py-24 lg:px-8 bg-white">
      <div className="mx-auto max-w-6xl">
        <motion.div
          className="relative overflow-hidden rounded-[2rem] bg-[#2f1a58] px-8 py-12 shadow-2xl shadow-[#2f1a58]/30 lg:px-16 lg:py-16"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, ease: "easeOut" }}
          viewport={{ once: true, margin: "-60px" }}
        >
          {/* Slowly drifting grid background */}
          <motion.div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 z-0"
            style={{
              backgroundImage: gridPattern,
              backgroundSize: "60px 60px",
            }}
            animate={{ backgroundPosition: ["0px 0px", "60px 60px"] }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          />

          {/* Scattered square dots */}
          {squareDots.map((pos, i) => (
            <motion.div
              key={i}
              aria-hidden="true"
              className="pointer-events-none absolute z-0 h-3 w-3 rounded-sm bg-[rgba(255,255,255,0.10)]"
              style={pos}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 0.1 }}
              transition={{
                duration: 0.8,
                delay: (i * 1.2) / squareDots.length,
                ease: "easeOut",
              }}
              viewport={{ once: true }}
            />
          ))}

          {/* Content */}
          <div className="relative z-10 flex flex-col items-center gap-10 lg:flex-row lg:gap-0">
            {/* LEFT — heading */}
            <motion.div
              className="flex w-full items-center lg:w-1/2"
              initial="hidden"
              whileInView="visible"
              transition={{ staggerChildren: 0.15, delayChildren: 0.1 }}
              viewport={{ once: true, margin: "-60px" }}
            >
              <h2 className="text-center font-[family-name:var(--font-playfair)] text-4xl font-bold leading-[1.15] tracking-tight text-white lg:text-left lg:text-6xl">
                <motion.span
                  className="block"
                  variants={headingLineVariants}
                  transition={{ duration: 0.55, ease: "easeOut" }}
                >
                  Ready To Start
                </motion.span>
                <motion.span
                  className="block"
                  variants={headingLineVariants}
                  transition={{ duration: 0.55, ease: "easeOut" }}
                >
                  Learning Smarter?
                </motion.span>
              </h2>
            </motion.div>

            {/* RIGHT — body + CTA */}
            <div className="flex w-full flex-col items-center justify-center text-center lg:w-1/2 lg:pl-16">
              <motion.p
                className="mx-auto max-w-xs text-sm leading-relaxed text-[rgba(255,255,255,0.65)]"
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.25, ease: "easeOut" }}
                viewport={{ once: true, margin: "-60px" }}
              >
                Start free and upgrade when you&apos;re ready. No pressure, no
                hidden fees. Just one platform that brings your entire learning
                experience together — for students and instructors alike.
              </motion.p>

              <motion.button
                type="button"
                className="mt-7 cursor-pointer rounded-full border border-[rgba(255,255,255,0.45)] bg-transparent px-8 py-3 text-sm font-medium text-white transition-all duration-200 hover:border-white/80 hover:bg-white/10 hover:shadow-lg hover:shadow-white/10"
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: 0.4, ease: "easeOut" }}
                viewport={{ once: true, margin: "-60px" }}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
              >
                Get Started Free
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
