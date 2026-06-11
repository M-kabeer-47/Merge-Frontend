"use client"

import { useEffect, useRef, useState } from "react"
import { motion } from "motion/react"

type Testimonial = {
  stars: number
  review: string
  name: string
  role: string
  gradient: string
  initials: string
  meta: string
}

const testimonials: Testimonial[] = [
  {
    stars: 5,
    review:
      "Merge completely changed how I study. Having live sessions, notes, and AI all in one place means I actually stay focused instead of jumping between five different apps.",
    name: "Aisha K.",
    role: "CS Student",
    gradient: "from-[#9b5de5] to-[#a78bfa]",
    initials: "AK",
    meta: "2 days ago",
  },
  {
    stars: 5,
    review:
      "The focus tracker is genuinely eye-opening. I didn't realize how often I zoned out until I saw my post-session report. My scores have improved every week since.",
    name: "Daniel M.",
    role: "Engineering Student",
    gradient: "from-[#3b82f6] to-[#60a5fa]",
    initials: "DM",
    meta: "5 days ago",
  },
  {
    stars: 5,
    review:
      "The voting Q&A during live sessions is brilliant. My most important questions always make it to the top — I finally feel heard in a class of 60 students.",
    name: "Priya S.",
    role: "Medical Student",
    gradient: "from-[#10b981] to-[#34d399]",
    initials: "PS",
    meta: "1 week ago",
  },
  {
    stars: 5,
    review:
      "The AI assistant actually knows my course content. I asked it about a concept from Week 4 slides and it gave me a perfect, context-aware explanation. No other tool does this.",
    name: "Rayan A.",
    role: "Data Science Student",
    gradient: "from-[#e69a29] to-[#fbbf24]",
    initials: "RA",
    meta: "3 days ago",
  },
  {
    stars: 5,
    review:
      "I replaced Zoom, Notion, and Google Calendar with just Merge. My students are more engaged, my workflow is cleaner, and I spend way less time on logistics.",
    name: "Prof. Sarah L.",
    role: "Instructor",
    gradient: "from-[#2f1a58] to-[#8c6dc9]",
    initials: "SL",
    meta: "1 week ago",
  },
  {
    stars: 5,
    review:
      "Creating quizzes, grading submissions, and posting announcements — all in one place. I used to need three separate tools for this. Merge is a game changer for instructors.",
    name: "Dr. James O.",
    role: "Instructor",
    gradient: "from-[#e54545] to-[#f87171]",
    initials: "JO",
    meta: "4 days ago",
  },
  {
    stars: 4,
    review:
      "The automated lecture summaries save me so much time. I used to spend an hour writing notes after every session. Now Merge does it for me and I just review and edit.",
    name: "Fatima Z.",
    role: "Law Student",
    gradient: "from-[#9b5de5] to-[#60a5fa]",
    initials: "FZ",
    meta: "6 days ago",
  },
  {
    stars: 5,
    review:
      "The study streak and badge system keeps me accountable in a way I didn't expect. It's a small thing but it genuinely motivates me to show up every day.",
    name: "Leo T.",
    role: "Undergrad Student",
    gradient: "from-[#10b981] to-[#9b5de5]",
    initials: "LT",
    meta: "2 weeks ago",
  },
]

const STEP = 380 // 360px card + 20px gap

function Stars({ count }: { count: number }) {
  return (
    <div className="flex items-center gap-0.5 text-base text-accent" aria-label={`${count} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <span key={i} aria-hidden="true">
          {i < count ? "★" : "☆"}
        </span>
      ))}
    </div>
  )
}

export default function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const viewportRef = useRef<HTMLDivElement>(null)
  const [maxScroll, setMaxScroll] = useState(0)

  // Measure how far the track can scroll so the last card always lands flush.
  // Using the viewport's own scrollWidth accounts for its left padding.
  useEffect(() => {
    const measure = () => {
      const el = viewportRef.current
      if (!el) return
      setMaxScroll(Math.max(0, el.scrollWidth - el.clientWidth))
    }
    measure()
    window.addEventListener("resize", measure)
    return () => window.removeEventListener("resize", measure)
  }, [])

  const maxIndex = Math.ceil(maxScroll / STEP)

  const goPrev = () => setCurrentIndex((i) => Math.max(0, i - 1))
  const goNext = () => setCurrentIndex((i) => Math.min(maxIndex, i + 1))

  // Clamp the translation so we never scroll past the final card.
  const offset = Math.min(currentIndex * STEP, maxScroll)
  const progress = maxIndex === 0 ? 100 : (currentIndex / maxIndex) * 100

  return (
    <section id="testimonials" className="relative w-full overflow-hidden bg-white py-16 sm:py-20 lg:py-24">
      {/* Heading + trust row */}
      <motion.div
        className="mx-auto max-w-[1400px] px-6 text-center sm:px-8"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <p className="mb-4 text-sm font-semibold uppercase tracking-[0.18em] text-primary">
          Testimonials
        </p>
        <h2 className="font-raleway text-4xl font-black tracking-tight text-heading text-balance sm:text-5xl">
          Reviews from <span className="text-primary">real people</span>
        </h2>
        <div className="mt-5 flex flex-wrap items-center justify-center gap-x-3 gap-y-1">
          <span className="text-sm font-semibold text-heading">4.5/5</span>
          <span className="text-lg text-accent" aria-hidden="true">
            ★
          </span>
          <span className="h-1 w-1 rounded-full bg-para-muted/40" aria-hidden="true" />
          <span className="text-sm text-para-muted">Based on 2,400+ reviews</span>
        </div>
      </motion.div>

      {/* Two-column body */}
      <div className="mx-auto mt-12 flex max-w-[1400px] flex-col items-start sm:mt-16 lg:flex-row">
        {/* LEFT: label column */}
        <motion.div
          className="w-full flex-shrink-0 px-6 sm:px-8 lg:w-[280px] lg:pr-0 lg:pl-16 lg:pt-4"
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.15, ease: "easeOut" }}
        >
          <span className="block text-7xl font-black leading-none text-[#cccccc] sm:text-[100px]" aria-hidden="true">
            &ldquo;
          </span>
          <p className="mt-4 max-w-[180px] text-xl font-bold leading-snug text-[#0a0a0a] font-raleway">
            What our students and instructors are saying
          </p>

          <div className="mt-10 flex items-center gap-3">
            <motion.button
              type="button"
              onClick={goPrev}
              disabled={currentIndex === 0}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.94 }}
              aria-label="Previous testimonials"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-[#d0d0d0] bg-white text-sm text-[#0a0a0a] transition-colors duration-200 hover:border-[#9b5de5] hover:text-[#9b5de5] disabled:cursor-not-allowed disabled:opacity-40"
            >
              ←
            </motion.button>

            <div className="relative h-[2px] w-28 rounded-full bg-[#e0e0e0]">
              <motion.div
                className="absolute left-0 top-0 h-full rounded-full bg-[#0a0a0a]"
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.4, ease: "easeOut" }}
              />
            </div>

            <motion.button
              type="button"
              onClick={goNext}
              disabled={currentIndex >= maxIndex}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.94 }}
              aria-label="Next testimonials"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-[#d0d0d0] bg-white text-sm text-[#0a0a0a] transition-colors duration-200 hover:border-[#9b5de5] hover:text-[#9b5de5] disabled:cursor-not-allowed disabled:opacity-40"
            >
              →
            </motion.button>
          </div>
        </motion.div>

        {/* RIGHT: cards carousel */}
        <motion.div
          ref={viewportRef}
          className="mt-8 w-full overflow-hidden pl-6 sm:pl-8 lg:mt-0 lg:w-auto lg:flex-1 lg:pl-24"
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
        >
          <motion.div
            className="flex flex-row gap-5 will-change-transform"
            animate={{ x: -offset }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            {testimonials.map((t) => (
              <div
                key={t.name}
                className="group relative flex min-h-[340px] w-[360px] flex-shrink-0 flex-col overflow-hidden rounded-3xl border border-light-border bg-white p-8 shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-primary/30 hover:shadow-2xl hover:shadow-primary/10"
              >
                {/* Soft top wash */}
                <div className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-primary/[0.05] to-transparent" />
                {/* Decorative quote watermark — kept inside the card so it isn't clipped */}
                <span
                  className="pointer-events-none absolute right-6 top-3 select-none font-raleway text-[96px] leading-none text-primary/[0.10] transition-colors duration-300 group-hover:text-primary/[0.16]"
                  aria-hidden="true"
                >
                  &rdquo;
                </span>

                <div className="relative">
                  <Stars count={t.stars} />
                  <p className="mt-4 text-[15px] leading-relaxed text-para">{t.review}</p>
                </div>

                {/* Footer pinned to the bottom so avatars align across every card */}
                <div className="relative mt-auto flex items-center gap-3 border-t border-light-border pt-6">
                  <div
                    className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-white shadow-md shadow-primary/25 ring-2 ring-white"
                    aria-hidden="true"
                  >
                    {t.initials}
                  </div>
                  <div className="min-w-0">
                    <p className="flex items-center gap-1.5 text-sm font-bold text-heading">
                      {t.name}
                      <span className="inline-flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full bg-primary text-white">
                        <svg
                          viewBox="0 0 24 24"
                          className="h-2.5 w-2.5"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="3.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          aria-hidden="true"
                        >
                          <path d="M5 13l4 4L19 7" />
                        </svg>
                      </span>
                    </p>
                    <p className="truncate text-xs text-para-muted">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
