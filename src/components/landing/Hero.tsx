"use client"

import { motion, useMotionValue, useSpring, useTransform, useMotionTemplate } from "motion/react"
import Link from "next/link"
import { Sparkles, CalendarDays } from "lucide-react"

const easeOutExpo = [0.25, 0.46, 0.45, 0.94] as const

export default function HeroSection() {
  // Mouse-driven parallax tilt for the device
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const springX = useSpring(mouseX, { stiffness: 150, damping: 18, mass: 0.3 })
  const springY = useSpring(mouseY, { stiffness: 150, damping: 18, mass: 0.3 })
  const rotateY = useTransform(springX, [-0.5, 0.5], [-20, -4])
  const rotateX = useTransform(springY, [-0.5, 0.5], [14, -2])
  const deviceTransform = useMotionTemplate`rotateY(${rotateY}deg) rotateX(${rotateX}deg) rotateZ(1.5deg)`

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    mouseX.set((e.clientX - rect.left) / rect.width - 0.5)
    mouseY.set((e.clientY - rect.top) / rect.height - 0.5)
  }
  const handleMouseLeave = () => {
    mouseX.set(0)
    mouseY.set(0)
  }

  return (
    <section className="relative flex w-full items-center overflow-hidden bg-white pt-28 pb-20 lg:min-h-screen lg:pt-32 lg:pb-16">
      {/* Layered gradient mesh */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 50% at 88% 4%, rgba(140,109,201,0.16) 0%, transparent 55%), radial-gradient(ellipse 55% 50% at 0% 100%, rgba(47,26,88,0.06) 0%, transparent 55%)",
        }}
      />

      {/* Subtle dot grid with radial fade */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(circle at center, rgba(47,26,88,0.08) 1px, transparent 1px)",
          backgroundSize: "26px 26px",
          maskImage:
            "radial-gradient(ellipse 75% 65% at 50% 35%, black 0%, transparent 78%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 75% 65% at 50% 35%, black 0%, transparent 78%)",
        }}
      />

      {/* Abstract glow spheres */}
      <motion.div
        animate={{ scale: [1, 1.08, 1], opacity: [0.7, 1, 0.7] }}
        transition={{ duration: 7, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
        className="pointer-events-none absolute -right-10 top-0 h-72 w-72 rounded-full bg-gradient-to-br from-primary/25 to-secondary/10 blur-3xl"
      />
      <motion.div
        animate={{ scale: [1, 1.06, 1], opacity: [0.6, 0.9, 0.6] }}
        transition={{
          duration: 6,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
          delay: 1,
        }}
        className="pointer-events-none absolute right-8 top-1/3 h-32 w-32 rounded-full bg-gradient-to-br from-secondary/25 to-accent/10 blur-2xl"
      />

      <div className="relative z-10 mx-auto flex w-full max-w-[1400px] flex-col items-center gap-16 px-8 lg:flex-row lg:gap-0 lg:px-16">
        {/* LEFT COLUMN */}
        <div className="flex w-full flex-col justify-center lg:w-[45%] lg:pl-8">
          {/* Eyebrow badge */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="mb-6 inline-flex w-fit items-center gap-2 rounded-full border border-primary/15 bg-primary/[0.06] py-1 pl-1 pr-3.5 text-xs font-semibold text-primary backdrop-blur-sm"
          >
            <span className="rounded-full bg-primary px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
              New
            </span>
            AI assistant now built in
          </motion.div>

          {/* Heading */}
          <h1 className="text-5xl font-black leading-[1.05] tracking-tight text-heading lg:text-[4rem]">
            {["The All-in-One", "Learning Platform"].map((line, i) => (
              <motion.span
                key={line}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut", delay: i * 0.12 }}
                className="block"
              >
                {line}
              </motion.span>
            ))}
            <motion.span
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut", delay: 0.24 }}
              className="block"
            >
              for{" "}
              <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                Students &amp; Instructors
              </span>
            </motion.span>
          </h1>

          {/* Subtext */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-5 max-w-md text-base leading-relaxed text-para"
          >
            Merge brings live sessions, AI assistance, focus tracking, collaborative notes, and
            room management into one distraction-free space — built for how modern learning
            actually works.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.55 }}
            className="mt-8 flex flex-wrap items-center gap-3"
          >
            <Link href="/sign-up">
              <motion.span
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="group flex items-center gap-3 rounded-full bg-primary px-7 py-3.5 text-base font-semibold text-white shadow-lg shadow-primary/30 transition-colors duration-200 hover:bg-secondary"
              >
                Get Started Free
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20 text-white transition-transform duration-200 group-hover:translate-x-0.5">
                  {"\u2192"}
                </span>
              </motion.span>
            </Link>
            <a href="#how-it-works">
              <motion.span
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center gap-2.5 rounded-full border border-light-border bg-white px-6 py-3.5 text-base font-semibold text-heading shadow-sm transition-colors duration-200 hover:border-primary/30 hover:text-primary"
              >
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-primary">
                  {"\u25b6"}
                </span>
                See how it works
              </motion.span>
            </a>
          </motion.div>

          {/* Social proof */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.65 }}
            className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-4"
          >
            <div className="flex items-center gap-3">
              <div className="flex -space-x-2.5">
                {["SK", "AR", "MJ", "Ta"].map((initials) => (
                  <span
                    key={initials}
                    className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-white bg-primary text-[10px] font-bold text-white shadow-sm"
                  >
                    {initials}
                  </span>
                ))}
                <span className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-white bg-primary text-[10px] font-bold text-white shadow-sm">
                  10k+
                </span>
              </div>
              <div>
                <div className="flex items-center gap-0.5 text-accent">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <span key={i} className="text-sm leading-none">
                      {"\u2605"}
                    </span>
                  ))}
                </div>
                <p className="mt-0.5 text-xs font-medium text-para-muted">
                  Loved by 10,000+ students &amp; instructors
                </p>
              </div>
            </div>
          </motion.div>

          {/* Trust indicators */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.75 }}
            className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2"
          >
            {["No credit card required", "Free plan available", "Cancel anytime"].map((t) => (
              <div key={t} className="flex items-center gap-1.5 text-sm text-para-muted">
                <span className="font-bold text-primary">{"\u2713"}</span>
                {t}
              </div>
            ))}
          </motion.div>
        </div>

        {/* RIGHT COLUMN — MOCKUP */}
        <div className="relative flex w-full justify-center lg:w-[55%] lg:justify-end">
          <motion.div
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.9, ease: easeOutExpo }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className="relative w-full max-w-[440px] lg:max-w-none"
          >
            {/* Ambient glow halo behind device */}
            <div
              className="pointer-events-none absolute left-1/2 top-1/2 z-0 h-[115%] w-[115%] -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl"
              style={{
                background:
                  "radial-gradient(circle at 50% 45%, rgba(140,109,201,0.30) 0%, rgba(47,26,88,0.10) 42%, transparent 70%)",
              }}
            />
            {/* Decorative slow-rotating dashed ring */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 60, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
              className="pointer-events-none absolute left-1/2 top-1/2 z-0 hidden h-[108%] w-[108%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-primary/15 lg:block"
            />
            {/* Grounding floor shadow (breathes opposite to float) */}
            <motion.div
              animate={{ scaleX: [1, 0.9, 1], opacity: [0.45, 0.3, 0.45] }}
              transition={{ duration: 5, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
              className="pointer-events-none absolute -bottom-8 left-1/2 z-0 h-10 w-3/4 -translate-x-1/2 rounded-[50%] bg-primary/25 blur-2xl"
            />

            <motion.div
              animate={{ y: [0, -12, 0] }}
              transition={{ duration: 5, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
              style={{ perspective: "1400px" }}
              className="relative z-10"
            >
              {/* iPad/Tablet Frame */}
              <motion.div
                style={{
                  transform: deviceTransform,
                  transformStyle: "preserve-3d",
                  backfaceVisibility: "hidden",
                  WebkitBackfaceVisibility: "hidden",
                  willChange: "transform",
                }}
              >
                {/* Tablet outer shell */}
                <div
                  className="relative rounded-[32px] p-3"
                  style={{
                    background: "linear-gradient(145deg, #2f1a58 0%, #2f1a58 10%, #2f1a58 100%)",
                    boxShadow:
                      "inset 0 1px 0 rgba(255,255,255,0.4), inset 0 -2px 4px rgba(0,0,0,0.2), 8px 8px 0px rgba(100,60,160,0.35), -24px 32px 60px rgba(155,93,229,0.25), -8px 16px 32px rgba(0,0,0,0.18)",
                  }}
                >
                  {/* Top bar with camera + speaker */}
                  <div className="flex items-center justify-center gap-3 pb-2.5">
                    <div className="h-1.5 w-1.5 rounded-full bg-[#7c5cbf]/60" />
                    <div className="h-1 w-16 rounded-full bg-[#7c5cbf]/40" />
                  </div>

                  {/* Screen bezel */}
                  <div
                    className="overflow-hidden rounded-[20px]"
                    style={{
                      boxShadow: "inset 0 0 0 1px rgba(0,0,0,0.15), inset 0 2px 4px rgba(0,0,0,0.2)",
                    }}
                  >
                    {/* Screen glow layer */}
                    <div className="relative overflow-hidden" style={{ background: "#f8f7ff" }}>
                      <div
                        className="pointer-events-none absolute inset-0 z-10"
                        style={{
                          background: "linear-gradient(135deg, rgba(255,255,255,0.18) 0%, transparent 50%)",
                          borderRadius: "20px",
                        }}
                      />
                      {/* Periodic light sheen sweep */}
                      <motion.div
                        className="pointer-events-none absolute inset-y-0 z-20 w-1/2"
                        initial={{ x: "-160%" }}
                        animate={{ x: "260%" }}
                        transition={{
                          duration: 1.6,
                          repeat: Number.POSITIVE_INFINITY,
                          repeatDelay: 4.5,
                          ease: "easeInOut",
                        }}
                        style={{
                          background:
                            "linear-gradient(105deg, transparent 20%, rgba(255,255,255,0.45) 50%, transparent 80%)",
                        }}
                      />
                      <DashboardMockup />
                    </div>
                  </div>

                  {/* Bottom home bar */}
                  <div className="flex items-center justify-center pt-2.5">
                    <div className="h-1 w-20 rounded-full bg-[#7c5cbf]/40" />
                  </div>
                </div>

                {/* Tablet side edge (3D depth illusion) */}
                <div
                  className="absolute inset-y-0 right-0 w-3 rounded-r-[32px]"
                  style={{
                    transform: "translateX(11px) rotateY(90deg) translateZ(-6px)",
                    background: "linear-gradient(to bottom, #8a6bb0, #6a4c93)",
                    transformOrigin: "left center",
                  }}
                />
                {/* Tablet bottom edge */}
                <div
                  className="absolute inset-x-0 bottom-0 h-3 rounded-b-[32px]"
                  style={{
                    transform: "translateY(11px) rotateX(-90deg) translateZ(-6px)",
                    background: "linear-gradient(to right, #8a6bb0, #6a4c93)",
                    transformOrigin: "top center",
                  }}
                />
              </motion.div>
            </motion.div>

            {/* Floating product cards */}
            {/* Focus Score — with progress ring */}
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
              className="absolute right-16 top-8 z-20 flex items-center gap-2.5 rounded-2xl border border-light-border/80 bg-white/90 px-3.5 py-2.5 shadow-xl shadow-primary/10 backdrop-blur-md lg:right-32"
            >
              <div className="relative h-9 w-9 text-success">
                <svg viewBox="0 0 36 36" className="h-9 w-9 -rotate-90">
                  <circle cx="18" cy="18" r="15" fill="none" stroke="currentColor" strokeOpacity="0.15" strokeWidth="4" />
                  <circle
                    cx="18"
                    cy="18"
                    r="15"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeDasharray="94.2"
                    strokeDashoffset="5.7"
                  />
                </svg>
                <span className="absolute inset-0 flex items-center justify-center text-[9px] font-bold text-success">
                  94
                </span>
              </div>
              <div className="leading-tight">
                <div className="text-[10px] font-medium text-para-muted">Focus Score</div>
                <div className="text-sm font-bold text-heading">94%</div>
              </div>
            </motion.div>

            {/* AI Assistant — gradient chip + live status */}
            <motion.div
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 3.5, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut", delay: 0.8 }}
              className="absolute -right-2 top-1/2 z-20 flex items-center gap-2.5 rounded-2xl border border-light-border/80 bg-white/90 px-3.5 py-2.5 shadow-xl shadow-primary/10 backdrop-blur-md lg:-right-6"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-secondary text-white shadow-sm shadow-primary/30">
                <Sparkles className="h-4 w-4" />
              </div>
              <div className="leading-tight">
                <div className="text-sm font-bold text-heading">AI Assistant</div>
                <div className="flex items-center gap-1 text-[10px] font-medium text-para-muted">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-success" />
                  Online now
                </div>
              </div>
            </motion.div>

            {/* Sessions — accent chip */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut", delay: 1.5 }}
              className="absolute -bottom-2 left-16 z-20 flex items-center gap-2.5 rounded-2xl border border-light-border/80 bg-white/90 px-3.5 py-2.5 shadow-xl shadow-primary/10 backdrop-blur-md lg:left-24"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent/15 text-accent">
                <CalendarDays className="h-4 w-4" />
              </div>
              <div className="leading-tight">
                <div className="text-sm font-bold text-heading">3 sessions</div>
                <div className="text-[10px] font-medium text-para-muted">Scheduled today</div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

/* ----------------------------- Dashboard Mockup ----------------------------- */

function DashboardMockup() {
  return (
    <div className="flex h-[560px] text-[10px]">
      <Sidebar />
      <MainArea />
    </div>
  )
}

function Sidebar() {
  const items: { label: string; icon: React.ReactNode; active?: boolean }[] = [
    { label: "Dashboard", icon: <GaugeIcon /> },
    { label: "Discover", icon: <CompassIcon /> },
    { label: "Rooms", icon: <UsersIcon />, active: true },
    { label: "Notes", icon: <NotesIcon /> },
    { label: "AI Assistant", icon: <BotIcon /> },
    { label: "Calendar", icon: <CalIcon /> },
    { label: "Rewards", icon: <TrophyIcon /> },
    { label: "Billing", icon: <CardIcon /> },
  ]
  return (
    <aside className="hidden sm:flex w-[150px] shrink-0 flex-col border-r border-[#e5e7eb] bg-[#f8f7fc] px-3 py-4">
      <div className="mb-6 flex items-center gap-2 px-1">
        <img src="/logo.svg" alt="Merge logo" className="h-6 w-6 object-contain" />
        <span className="text-base font-bold text-[#1a1a1a]">Merge</span>
      </div>
      <nav className="flex flex-col gap-1">
        {items.map((it) => (
          <div
            key={it.label}
            className={`flex items-center gap-2.5 rounded-lg px-2.5 py-2 font-medium ${it.active ? "bg-[#2f1a58]/10 text-[#2f1a58]" : "text-[#666]"
              }`}
          >
            <span className={it.active ? "text-[#2f1a58]" : "text-[#888]"}>{it.icon}</span>
            {it.label}
          </div>
        ))}
      </nav>
    </aside>
  )
}

function MainArea() {
  return (
    <div className="flex flex-1 flex-col overflow-hidden bg-white">
      {/* Top bar */}
      <div className="flex items-center justify-between border-b border-[#eee] px-4 py-2.5">
        <span className="text-xs font-bold text-[#1a1a1a]">Dashboard</span>
        <div className="flex items-center gap-2">
          <div className="hidden h-6 w-32 items-center rounded-full bg-[#f3f3f7] px-2 text-[9px] text-[#999] sm:flex">
            Search anything...
          </div>
          <div className="h-6 w-6 rounded-full bg-[#f3f3f7]" />
          <div className="h-6 w-6 rounded-full bg-gradient-to-br from-[#9b5de5] to-[#2f1a58]" />
        </div>
      </div>

      <div className="flex flex-1 gap-2.5 overflow-hidden p-3">
        {/* ---------- LEFT / CENTER ---------- */}
        <div className="flex flex-1 flex-col gap-2.5 overflow-hidden">
          {/* Greeting banner */}
          <div className="rounded-lg bg-gradient-to-r from-[#2f1a58] to-[#9b5de5] px-3 py-2.5 text-white">
            <div className="flex items-center gap-1.5 text-[11px] font-bold">
              <span className="flex h-4 w-4 items-center justify-center rounded-full bg-white/20 text-[8px]">
                {"\u263E"}
              </span>
              Good Evening, Arslan!
            </div>
            <div className="mt-0.5 text-[8px] text-white/80">
              Keep up the great work! You&apos;re on track for this week.
            </div>
          </div>

          {/* Stat cards */}
          <div className="grid grid-cols-4 gap-2">
            {[
              { label: "Rooms", value: "12", icon: <HomeIcon />, tint: "#2f1a58" },
              { label: "Pending Assignments", value: "7", icon: <ClipboardIcon />, tint: "#2f1a58" },
              { label: "Scheduled Tasks", value: "9", icon: <CalIcon />, tint: "#2f1a58" },
              { label: "Day Streak", value: "24", icon: <FireIcon />, tint: "#2f1a58" },
            ].map((s) => (
              <div key={s.label} className="rounded-lg border border-[#eee] bg-white p-2">
                <div className="flex items-center justify-between">
                  <span style={{ color: s.tint }}>{s.icon}</span>
                  <span className="text-[#bbb]">{"\u2197"}</span>
                </div>
                <div className="mt-1.5 text-[7.5px] leading-tight text-[#888]">{s.label}</div>
                <div className="text-base font-bold text-[#1a1a1a]">{s.value}</div>
              </div>
            ))}
          </div>

          {/* Pending Assignments + Recent Activity */}
          <div className="grid grid-cols-2 gap-2">
            {/* Pending Assignments */}
            <div className="rounded-lg border border-[#eee] p-2.5">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-[9px] font-bold text-[#1a1a1a]">Pending Assignments</span>
                <span className="text-[8px] font-medium text-[#2f1a58]">View All</span>
              </div>
              <div className="flex flex-col gap-1.5">
                {[
                  { t: "For Task", s: "Next JS · 25 pts", b: "3d left", danger: false },
                  { t: "test 3", s: "Current Affairs · 10 pts", b: "4d left", danger: false },
                  { t: "Check 4", s: "Current Affairs · 10 pts", b: "4d left", danger: false },
                  { t: "React App", s: "Next JS · 25 pts", b: "Overdue", danger: true },
                ].map((a) => (
                  <div
                    key={a.t}
                    className="flex items-center justify-between border-b border-[#f3f3f3] pb-1.5 last:border-0 last:pb-0"
                  >
                    <div>
                      <div className="text-[8.5px] font-semibold text-[#1a1a1a]">{a.t}</div>
                      <div className="text-[7px] text-[#999]">{a.s}</div>
                    </div>
                    <span
                      className={`rounded-full px-1.5 py-0.5 text-[6.5px] font-semibold ${a.danger
                          ? "bg-[#fde8e8] text-[#e02424]"
                          : "bg-[#f3eefc] text-[#2f1a58]"
                        }`}
                    >
                      {a.b}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Activity */}
            <div className="rounded-lg border border-[#eee] p-2.5">
              <div className="mb-2 text-[9px] font-bold text-[#1a1a1a]">Recent Activity</div>
              <div className="flex flex-col gap-2">
                {[
                  { t: "Session is live: Live Session - 26/04/2026", time: "13 minutes ago", live: true },
                  { t: "New assignment in Next JS: For Task", time: "about 3 hours ago", live: false },
                  { t: "JS Quiz graded", time: "about 13 hours ago", live: false },
                  { t: "New room created — Physics 301", time: "1 day ago", live: false },
                ].map((a) => (
                  <div key={a.t} className="rounded-md bg-[#faf9fd] px-2 py-1.5">
                    <div className="flex items-start gap-1.5">
                      {a.live ? (
                        <span className="relative mt-1 flex h-1.5 w-1.5 shrink-0">
                          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#10b981] opacity-75" />
                          <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#10b981]" />
                        </span>
                      ) : (
                        <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-[#2f1a58]" />
                      )}
                      <div>
                        <div className="text-[8px] leading-tight text-[#1a1a1a]">{a.t}</div>
                        <div className="text-[6.5px] text-[#aaa]">{a.time}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* My Rooms */}
          <div className="rounded-lg border border-[#eee] p-2.5">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-[9px] font-bold text-[#1a1a1a]">My Rooms</span>
              <span className="text-[8px] font-medium text-[#2f1a58]">View All</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {[
                { t: "Next JS", d: "Bootcamp for beginners to master SSR.", tag: "Joined", action: "Enter" },
                { t: "Advanced Backend", d: "Learn advanced backend techniques.", tag: "Owner", action: "Enter" },
                { t: "Current Affairs", d: "Learn the current affairs of the world.", tag: "Joined", action: "Enter" },
              ].map((r) => (
                <div key={r.t} className="rounded-md border border-[#eee] p-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[8.5px] font-bold text-[#1a1a1a]">{r.t}</span>
                    <span className="rounded-full bg-[#f3eefc] px-1.5 py-0.5 text-[6px] font-semibold text-[#9b5de5]">
                      {r.tag}
                    </span>
                  </div>
                  <div className="mt-1 text-[6.5px] leading-tight text-[#999]">{r.d}</div>
                  <div className="mt-1.5 flex items-center justify-between">
                    <div className="flex -space-x-1">
                      {[0, 1, 2].map((i) => (
                        <span
                          key={i}
                          className="h-3 w-3 rounded-full border border-white bg-gradient-to-br from-[#2f1a58] to-[#9b5de5]"
                        />
                      ))}
                    </div>
                    <span className="rounded-md bg-[#2f1a58] px-2 py-0.5 text-[6.5px] font-semibold text-white">
                      {r.action}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ---------- RIGHT RAIL ---------- */}
        <div className="hidden sm:flex w-[150px] shrink-0 flex-col gap-2.5">
          {/* Calendar */}
          <div className="rounded-lg border border-[#eee] p-2.5">
            <div className="mb-1.5 flex items-center justify-between">
              <span className="text-[8.5px] font-bold text-[#1a1a1a]">April 2026</span>
              <div className="flex gap-1 text-[#bbb]">
                <span>{"\u2039"}</span>
                <span>{"\u203a"}</span>
              </div>
            </div>
            <div className="grid grid-cols-7 gap-0.5 text-center text-[6px]">
              {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
                <span key={i} className="text-[#aaa]">
                  {d}
                </span>
              ))}
              {Array.from({ length: 30 }).map((_, i) => {
                const day = i + 1
                const isToday = day === 26
                return (
                  <span
                    key={i}
                    className={`flex h-3.5 items-center justify-center rounded-full ${isToday ? "bg-[#2f1a58] font-bold text-white" : "text-[#666]"
                      }`}
                  >
                    {day}
                  </span>
                )
              })}
            </div>
          </div>

          {/* Today's Schedule */}
          <div className="rounded-lg border border-[#eee] p-2.5">
            <div className="mb-1.5 text-[8.5px] font-bold text-[#1a1a1a]">Today&apos;s Schedule</div>
            <div className="flex flex-col items-center justify-center py-2 text-center">
              <span className="text-base text-[#ddd]">{"\u2299"}</span>
              <span className="mt-1 text-[6.5px] text-[#aaa]">No tasks for this day</span>
            </div>
          </div>

          {/* Streak card */}
          <div className="flex flex-col items-center rounded-lg border border-[#eee] p-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#fff4e5]">
              <span className="text-[#f59e0b]">
                <FireIcon />
              </span>
            </div>
            <div className="mt-1 text-lg font-black text-[#1a1a1a]">24</div>
            <div className="text-[7px] font-semibold text-[#666]">Days · Keep it up!</div>
            <div className="mt-1.5 flex gap-1">
              {["M", "T", "W", "T", "F", "S", "S"].map((d, i) => (
                <span
                  key={i}
                  className={`flex h-3 w-3 items-center justify-center rounded-full text-[5.5px] ${i < 5 ? "bg-[#2f1a58] text-white" : "bg-[#f0f0f0] text-[#bbb]"
                    }`}
                >
                  {d}
                </span>
              ))}
            </div>
          </div>

          {/* Achievements */}
          <div className="rounded-lg border border-[#eee] p-2.5">
            <div className="mb-1 text-[8px] font-bold text-[#1a1a1a]">Your Achievements</div>
            <div className="flex items-center justify-between text-[7px] text-[#888]">
              <span>Progress 1/11</span>
              <span className="font-bold text-[#f59e0b]">40 XP</span>
            </div>
            <div className="mt-1 h-1 w-full overflow-hidden rounded-full bg-[#f0f0f0]">
              <motion.div
                className="h-full rounded-full bg-[#2f1a58]"
                initial={{ width: "0%" }}
                animate={{ width: "20%" }}
                transition={{ duration: 1.4, ease: "easeOut", delay: 1 }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ----------------------------- Icons ----------------------------- */

function HomeIcon() {
  return (
    <svg {...iconProps}>
      <path d="M4 10l8-6 8 6v9a1 1 0 01-1 1H5a1 1 0 01-1-1z" />
      <path d="M9 20v-6h6v6" />
    </svg>
  )
}

function ClipboardIcon() {
  return (
    <svg {...iconProps}>
      <rect x="6" y="4" width="12" height="17" rx="2" />
      <path d="M9 4V3h6v1M9 10h6M9 14h6M9 18h3" />
    </svg>
  )
}

const iconProps = {
  width: 13,
  height: 13,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.75,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
}

const fireIconProps = {
  width: 40,
  height: 40,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.75,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
}

function GaugeIcon() {
  return (
    <svg {...iconProps}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 12l4-3" />
    </svg>
  )
}
function CompassIcon() {
  return (
    <svg {...iconProps}>
      <circle cx="12" cy="12" r="9" />
      <path d="M15.5 8.5l-2 5-5 2 2-5z" />
    </svg>
  )
}
function UsersIcon() {
  return (
    <svg {...iconProps}>
      <circle cx="9" cy="8" r="3" />
      <path d="M3 20c0-3 3-5 6-5s6 2 6 5" />
      <path d="M17 6a3 3 0 010 6M21 20c0-2.5-1.5-4-3.5-4.5" />
    </svg>
  )
}
function NotesIcon() {
  return (
    <svg {...iconProps}>
      <rect x="5" y="3" width="14" height="18" rx="2" />
      <path d="M9 8h6M9 12h6M9 16h3" />
    </svg>
  )
}
function BotIcon() {
  return (
    <svg {...iconProps}>
      <rect x="4" y="9" width="16" height="10" rx="2" />
      <path d="M12 5v4M9 14h.01M15 14h.01" />
      <circle cx="12" cy="4" r="1" />
    </svg>
  )
}
function CalIcon() {
  return (
    <svg {...iconProps}>
      <rect x="4" y="5" width="16" height="16" rx="2" />
      <path d="M4 9h16M8 3v4M16 3v4" />
    </svg>
  )
}
function TrophyIcon() {
  return (
    <svg {...iconProps}>
      <path d="M7 4h10v4a5 5 0 01-10 0z" />
      <path d="M5 4H3v2a3 3 0 003 3M19 4h2v2a3 3 0 01-3 3M10 14h4M9 20h6M12 14v3" />
    </svg>
  )
}
function CardIcon() {
  return (
    <svg {...iconProps}>
      <rect x="3" y="6" width="18" height="12" rx="2" />
      <path d="M3 10h18M7 15h3" />
    </svg>
  )
}
function FireIcon() {
  return (
    <svg {...fireIconProps}>
      <path d="M12 3c1 3-2 4-2 7a4 4 0 008 0c0-2-1-3-2-4 0 2-1 3-2 3 0-3-1-5-2-6z" />
    </svg>
  )
}
