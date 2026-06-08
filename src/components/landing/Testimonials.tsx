"use client"

import { useState } from "react"
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

const STEP = 320 // 300px card + 20px gap
const MAX_INDEX = testimonials.length - 3

function Stars({ count }: { count: number }) {
  return (
    <div className="flex items-center gap-0.5 text-base text-[#f5b301]" aria-label={`${count} out of 5 stars`}>
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

  const goPrev = () => setCurrentIndex((i) => Math.max(0, i - 1))
  const goNext = () => setCurrentIndex((i) => Math.min(MAX_INDEX, i + 1))

  const progress = (currentIndex / MAX_INDEX) * 100

  return (
    <section id="testimonials" className="relative w-full overflow-hidden bg-white py-16 sm:py-20 lg:py-24">
      {/* Heading + trust row */}
      <motion.div
        className="mx-auto max-w-7xl px-6 text-center sm:px-8"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <h2 className="text-center text-3xl font-normal tracking-tight text-[#0a0a0a] text-balance font-raleway sm:text-4xl lg:text-5xl">
          Reviews from <span className="font-black italic">real people</span>
        </h2>
        <div className="mt-5 flex flex-wrap items-center justify-center gap-x-3 gap-y-1">
          <span className="text-sm font-semibold text-[#0a0a0a]">4.5/5</span>
          <span className="text-lg text-[#f5b301]" aria-hidden="true">
            ★
          </span>
          <span className="text-sm font-bold text-[#0a0a0a]">Trustpilot</span>
          <span className="h-1 w-1 rounded-full bg-[#ccc]" aria-hidden="true" />
          <span className="text-sm text-[#999]">Based on 2,400+ reviews</span>
        </div>
      </motion.div>

      {/* Two-column body */}
      <div className="mx-auto mt-12 flex max-w-7xl flex-col items-start sm:mt-16 lg:flex-row">
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
              disabled={currentIndex === MAX_INDEX}
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
          className="mt-8 w-full overflow-hidden pl-6 sm:pl-8 lg:mt-0 lg:w-auto lg:flex-1 lg:pl-10"
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
        >
          <motion.div
            className="flex flex-row gap-5"
            animate={{ x: -currentIndex * STEP }}
            transition={{ duration: 0.5, ease: [0.32, 0.72, 0, 1] }}
          >
            {testimonials.map((t, i) => (
              <motion.div
                key={i}
                className="flex w-[300px] flex-shrink-0 flex-col rounded-2xl bg-[#f5f5f5] p-7 shadow-sm"
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.2 + i * 0.08, ease: "easeOut" }}
              >
                <p className="text-sm leading-relaxed text-[#444]">{t.review}</p>
                <div className="mt-5">
                  <Stars count={t.stars} />
                </div>
                <div className="mt-5 flex items-center gap-3">
                  <div
                    className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br ${t.gradient} text-xs font-bold text-white`}
                    aria-hidden="true"
                  >
                    {t.initials}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[#0a0a0a]">{t.name}</p>
                    <p className="mt-0.5 text-xs text-[#999]">{t.meta}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
