"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  motion,
  useInView,
  type Variants,
} from "framer-motion";

/* ------------------------------------------------------------------ */
/*  Animation variants                                                 */
/* ------------------------------------------------------------------ */

const rowVariants: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.12 } },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

/* ------------------------------------------------------------------ */
/*  Count-up number (triggers when scrolled into view)                 */
/* ------------------------------------------------------------------ */

function CountUp({ end, suffix = "" }: { end: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!inView) return;
    let raf = 0;
    let startTs = 0;
    const duration = 1200;
    const tick = (now: number) => {
      if (!startTs) startTs = now;
      const progress = Math.min((now - startTs) / duration, 1);
      setValue(Math.round(progress * end));
      if (progress < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, end]);

  return (
    <span ref={ref}>
      {value}
      {suffix}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/*  Card data                                                          */
/* ------------------------------------------------------------------ */

type CardItem = {
  end: number;
  suffix: string;
  label: string;
  image: string;
  alt: string;
};

// Unified violet fallback shown while the image loads (matches brand palette).
const IMAGE_FALLBACK =
  "linear-gradient(135deg, #13101e 0%, #1a1530 50%, #0b0915 100%)";

const CARDS: CardItem[] = [
  {
    end: 5,
    suffix: "+",
    label: "Apps replaced by Merge",
    image: "/landing/card1.png",
    alt: "Floating app icons converging into a single laptop",
  },
  {
    end: 3,
    suffix: "hrs",
    label: "Lost daily to app switching",
    image: "/landing/card2.png",
    alt: "An overwhelmed person surrounded by floating notification windows",
  },
  {
    end: 68,
    suffix: "%",
    label: "Students report broken focus",
    image: "/landing/card3.png",
    alt: "A distracted, fatigued student in a dim room",
  },
  {
    end: 1,
    suffix: "",
    label: "Platform to replace them all",
    image: "/landing/card4.png",
    alt: "A single unified dashboard glowing in a dark void",
  },
];

/* ------------------------------------------------------------------ */
/*  Single stat card                                                   */
/* ------------------------------------------------------------------ */

function StatCard({ item }: { item: CardItem }) {
  return (
    <motion.div
      variants={cardVariants}
      whileHover={{ scale: 1.03, y: -6 }}
      initial="rest"
      animate="rest"
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="group relative h-[320px] flex-1 cursor-pointer overflow-hidden rounded-[18px] shadow-[inset_0_0_0_1px_rgba(229,69,69,0)] transition-shadow duration-300 hover:shadow-[inset_0_0_0_1px_rgba(229,69,69,0.4)]"
      style={{ background: IMAGE_FALLBACK }}
    >
      {/* Card image */}
      <Image
        src={item.image}
        alt={item.alt}
        fill
        sizes="(max-width: 640px) 100vw, 25vw"
        className="object-cover transition-transform duration-500 group-hover:scale-105"
      />

      {/* Bottom-darkening overlay */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to top, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.1) 55%)",
        }}
      />

      {/* Bottom content */}
      <div className="absolute inset-x-0 bottom-0 z-10 p-5">
        <div className="text-4xl font-black leading-none text-white">
          <CountUp end={item.end} suffix={item.suffix} />
        </div>
        <div className="mt-1 text-xs font-normal text-[#aaa]">{item.label}</div>
      </div>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  Section                                                            */
/* ------------------------------------------------------------------ */

export default function ProblemSection() {
  return (
    <section id="problem" className="relative w-full bg-main-background py-24">
      <div className="mx-auto max-w-7xl overflow-hidden rounded-[2rem] px-6 py-14 sm:px-12 lg:px-16">
        {/* Heading block */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55, ease: "easeOut" }}
          className="text-center"
        >
          {/* Badge pill with continuous shimmer */}
          <span className="relative mx-auto flex w-fit items-center gap-2 overflow-hidden rounded-full bg-destructive px-4 py-1.5 text-xs font-medium text-white">
            <span className="inline-block h-2 w-2 rounded-full bg-white" />
            The Problem
            <motion.span
              aria-hidden
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  "linear-gradient(110deg, transparent 30%, rgba(255,255,255,0.35) 50%, transparent 70%)",
              }}
              animate={{ x: ["-120%", "120%"] }}
              transition={{
                duration: 2.4,
                repeat: Infinity,
                ease: "linear",
                repeatDelay: 0.6,
              }}
            />
          </span>

          <h2 className="mt-5 text-5xl font-black leading-tight text-heading">
            Too Many Apps. Zero Focus.
          </h2>

          <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-para-muted">
            Students and instructors waste hours every day jumping between apps
            for notes, video calls, whiteboards, AI tools, and schedulers. It
            fragments attention and kills productivity.
          </p>
        </motion.div>

        {/* Cards row */}
        <motion.div
          variants={rowVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-60px" }}
          className="mt-12 flex flex-col gap-4 sm:flex-row"
        >
          {CARDS.map((item) => (
            <StatCard key={item.label} item={item} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
