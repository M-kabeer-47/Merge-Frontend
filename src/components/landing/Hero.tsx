"use client"

import { motion } from "motion/react"

const easeOutExpo = [0.25, 0.46, 0.45, 0.94] as const

export default function HeroSection() {
  return (
    <section className="relative flex w-full items-center overflow-hidden bg-white py-20 lg:min-h-screen lg:py-16">
      {/* Background gradient */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 80% 10%, rgba(155,93,229,0.08) 0%, transparent 60%)",
        }}
      />

      {/* Decorative connector lines */}
      <svg
        className="pointer-events-none absolute inset-0 h-full w-full opacity-20"
        aria-hidden="true"
      >
        <line x1="55%" y1="8%" x2="78%" y2="2%" stroke="#2f1a58" strokeWidth="1" />
        <line x1="60%" y1="92%" x2="85%" y2="98%" stroke="#2f1a58" strokeWidth="1" />
        <line x1="50%" y1="50%" x2="40%" y2="60%" stroke="#2f1a58" strokeWidth="1" />
      </svg>

      {/* Abstract spheres */}
      <motion.div
        animate={{ scale: [1, 1.05, 1] }}
        transition={{ duration: 6, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
        className="pointer-events-none absolute right-0 top-0 h-48 w-48 rounded-full bg-gradient-to-br from-[#2f1a58]/30 to-[#a78bfa]/10 blur-2xl"
      />
      <motion.div
        animate={{ scale: [1, 1.05, 1] }}
        transition={{
          duration: 6,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
          delay: 1,
        }}
        className="pointer-events-none absolute right-8 top-1/3 h-24 w-24 rounded-full bg-gradient-to-br from-[#9b5de5]/20 to-[#2f1a58]/10 blur-xl"
      />

      <div className="relative z-10 mx-auto flex w-full max-w-[1400px] flex-col items-center gap-16 px-8 lg:flex-row lg:gap-0 lg:px-16">
        {/* LEFT COLUMN */}
        <div className="flex w-full flex-col justify-center lg:w-[45%] lg:pl-8">
          {/* Heading */}
          <h1 className="text-5xl font-black leading-[1.1] tracking-tight text-[#0a0a0a] lg:text-6xl">
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
              <span className="bg-gradient-to-r from-[#2f1a58] to-[#9b5de5] bg-clip-text text-transparent">
                Students &amp; Instructors
              </span>
            </motion.span>
          </h1>

          {/* Subtext */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-5 max-w-md text-base leading-relaxed text-[#555]"
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
            className="mt-8 flex flex-wrap items-center gap-4"
          >
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center gap-3 rounded-full bg-[#2f1a58] px-7 py-3.5 text-base font-semibold text-white shadow-lg shadow-[#9b5de5]/30 transition-colors duration-200 hover:bg-[#8b4fd5]"
            >
              Get Started Free
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20 text-white">
                {"\u2192"}
              </span>
            </motion.button>
          </motion.div>

          {/* Trust indicators */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.65 }}
            className="mt-6 flex flex-wrap items-center gap-5"
          >
            {["No credit card required", "Free plan available", "Cancel anytime"].map((t) => (
              <div key={t} className="flex items-center gap-1.5 text-sm text-[#555]">
                <span className="font-bold text-[#2f1a58]">{"\u2713"}</span>
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
            className="relative"
          >
            <motion.div
              animate={{ y: [0, -12, 0] }}
              transition={{ duration: 5, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
              style={{ perspective: "1400px" }}
            >
              {/* iPad/Tablet Frame */}
              <div
                style={{
                  transform: "rotateY(-12deg) rotateX(6deg) rotateZ(1.5deg)",
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
                    <div className="relative" style={{ background: "#f8f7ff" }}>
                      <div
                        className="pointer-events-none absolute inset-0 z-10"
                        style={{
                          background: "linear-gradient(135deg, rgba(255,255,255,0.18) 0%, transparent 50%)",
                          borderRadius: "20px",
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
              </div>
            </motion.div>

            {/* Floating badges */}
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
              className="absolute right-16 top-8 flex items-center rounded-xl border border-[#f0edf8] bg-white px-4 py-2.5 text-xs font-semibold text-[#0a0a0a] shadow-lg lg:right-32"
            >
              <span className="mr-1.5 h-2 w-2 animate-pulse rounded-full bg-[#10b981]" />
              Focus Score: 94%
            </motion.div>
            <motion.div
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 3.5, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut", delay: 0.8 }}
              className="absolute -right-2 top-1/2 flex items-center gap-1.5 rounded-xl border border-[#f0edf8] bg-white px-4 py-2.5 text-xs font-semibold text-[#0a0a0a] shadow-lg lg:-right-6"
            >
              <span className="h-2 w-2 rounded-full bg-[#2f1a58]" />
              AI Assistant
            </motion.div>
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut", delay: 1.5 }}
              className="absolute -bottom-2 left-16 flex items-center gap-1.5 rounded-xl border border-[#f0edf8] bg-white px-4 py-2.5 text-xs font-semibold text-[#0a0a0a] shadow-lg lg:left-24"
            >
              <span className="h-2 w-2 rounded-full bg-[#fbbf24]" />
              3 sessions today
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
                  { t: "Session is live: Live Session - 26/04/2026", time: "13 minutes ago" },
                  { t: "New assignment in Next JS: For Task", time: "about 3 hours ago" },
                  { t: "JS Quiz graded", time: "about 13 hours ago" },
                  { t: "New room created — Physics 301", time: "1 day ago" },
                ].map((a) => (
                  <div key={a.t} className="rounded-md bg-[#faf9fd] px-2 py-1.5">
                    <div className="flex items-start gap-1.5">
                      <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-[#2f1a58]" />
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
              <div className="h-full w-1/5 rounded-full bg-[#2f1a58]" />
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
