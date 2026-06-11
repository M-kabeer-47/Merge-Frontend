"use client";

import { useEffect, useRef, useState } from "react";
import {
  motion,
  AnimatePresence,
  useInView,
  useAnimation,
  type Variants,
} from "framer-motion";
import {
  Sparkles,
  ArrowUp,
  ChevronLeft,
  ChevronRight,
  Video,
  FileQuestion,
  Megaphone,
  NotebookPen,
  ClipboardCheck,
  Flame,
  Check,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Variants                                                           */
/* ------------------------------------------------------------------ */

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.12 } },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

const popVariants: Variants = {
  hidden: { opacity: 0, scale: 0.85, y: 8 },
  show: { opacity: 1, scale: 1, y: 0, transition: { type: "spring", bounce: 0.4 } },
};

const slideVariants: Variants = {
  hidden: { opacity: 0, x: 16 },
  show: { opacity: 1, x: 0, transition: { duration: 0.4, ease: "easeOut" } },
};

/* ------------------------------------------------------------------ */
/*  Primitives                                                         */
/* ------------------------------------------------------------------ */

function Card({
  className = "",
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <motion.div
      variants={cardVariants}
      whileHover={{ y: -6 }}
      transition={{ type: "spring", stiffness: 300, damping: 24 }}
      className={`group relative min-h-[320px] overflow-hidden rounded-3xl border border-light-border transition-colors duration-300 hover:border-primary/30 ${className}`}
    >
      <div className="pointer-events-none absolute -left-16 -top-16 h-44 w-44 rounded-full bg-primary/10 opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-100" />
      {children}
    </motion.div>
  );
}

function CardHeading({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="relative z-10 max-w-[46%] p-7">
      <h3 className="text-xl font-bold text-heading">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-para-muted">{desc}</p>
    </div>
  );
}

/* a framed mockup "window" */
function Window({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`flex flex-col overflow-hidden rounded-xl border border-light-border bg-main-background shadow-2xl ${className}`}
    >
      {children}
    </div>
  );
}

function WinChrome({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-2 border-b border-light-border bg-white px-3 py-2 dark:bg-card">
      <span className="h-2 w-2 rounded-full bg-destructive/70" />
      <span className="h-2 w-2 rounded-full" style={{ background: "var(--accent)" }} />
      <span className="h-2 w-2 rounded-full" style={{ background: "var(--success)" }} />
      <span className="ml-1.5 flex items-center gap-1 text-[11px] font-medium text-primary">
        <Sparkles className="h-3 w-3" />
        {label}
      </span>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  AI Study Assistant — live looping chat (hero, wide card)           */
/* ------------------------------------------------------------------ */

function AIChat() {
  const [phase, setPhase] = useState<"typing" | "answer">("typing");
  useEffect(() => {
    const id = setInterval(
      () => setPhase((p) => (p === "typing" ? "answer" : "typing")),
      1900
    );
    return () => clearInterval(id);
  }, []);

  return (
    <div className="flex flex-1 flex-col gap-2 p-3">
      <motion.div
        initial={{ opacity: 0, scale: 0.85, y: 8 }}
        whileInView={{ opacity: 1, scale: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ type: "spring", bounce: 0.4 }}
        className="max-w-[80%] self-end rounded-2xl rounded-tr-none bg-primary px-3 py-2 shadow-sm"
      >
        <p className="text-[11px] leading-snug text-white">
          Explain backpropagation simply
        </p>
      </motion.div>

      <AnimatePresence mode="wait" initial={false}>
        {phase === "typing" ? (
          <motion.div
            key="typing"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="flex items-center gap-1 self-start rounded-2xl rounded-tl-none border border-light-border bg-white px-3 py-3 shadow-sm dark:bg-card"
          >
            {[0, 1, 2].map((i) => (
              <motion.span
                key={i}
                animate={{ y: [0, -3, 0], opacity: [0.4, 1, 0.4] }}
                transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.15 }}
                className="h-1.5 w-1.5 rounded-full bg-para-muted"
              />
            ))}
          </motion.div>
        ) : (
          <motion.div
            key="answer"
            initial={{ opacity: 0, scale: 0.9, y: 6 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ type: "spring", bounce: 0.35 }}
            className="flex max-w-[90%] flex-col gap-1.5 self-start rounded-2xl rounded-tl-none border border-light-border bg-white px-3 py-2.5 shadow-sm dark:bg-card"
          >
            <p className="text-[11px] leading-relaxed text-heading">
              It sends the output error backward through the network, nudging
              each weight to shrink it — repeated until predictions improve.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function AICard() {
  return (
    <Card className="bg-white dark:bg-card md:col-span-2">
      <CardHeading
        title="AI Study Assistant"
        desc="Context-aware AI trained on your room's materials — answers relevant to your syllabus, not the generic internet."
      />
      <div className="absolute -bottom-5 -right-5 flex h-[74%] w-[58%] transition-transform duration-500 group-hover:scale-[1.03]">
        <Window className="w-full">
          <WinChrome label="Merge AI" />
          <AIChat />
          <div className="flex items-center gap-2 border-t border-light-border bg-white p-2.5 dark:bg-card">
            <div className="flex flex-1 items-center text-xs text-para-muted">
              Ask Merge AI…
              <motion.span
                aria-hidden
                animate={{ opacity: [1, 0, 1] }}
                transition={{ duration: 1.1, repeat: Infinity }}
                className="ml-0.5 inline-block h-3.5 w-px bg-primary"
              />
            </div>
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-white">
              <ArrowUp className="h-3.5 w-3.5" />
            </div>
          </div>
        </Window>
      </div>
    </Card>
  );
}

/* ------------------------------------------------------------------ */
/*  Focus Tracker — gauge (narrow card)                                */
/* ------------------------------------------------------------------ */

function FocusGauge() {
  const ref = useRef<SVGSVGElement>(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });
  const arc = useAnimation();
  const dot = useAnimation();

  useEffect(() => {
    if (!inView) return;
    arc.start({
      strokeDashoffset: 1 - 0.75,
      transition: { duration: 1.4, ease: "easeOut" },
    });
    dot.start({ opacity: 1, transition: { delay: 1.3, duration: 0.4 } });
  }, [inView, arc, dot]);

  const angle = (180 + 0.75 * 180) * (Math.PI / 180);
  const dx = 100 + 80 * Math.cos(angle);
  const dy = 100 + 80 * Math.sin(angle);

  return (
    <div className="relative">
      <svg ref={ref} viewBox="0 0 200 108" className="w-full" fill="none">
        <defs>
          <linearGradient id="focusGradient" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="var(--primary)" />
            <stop offset="100%" stopColor="var(--secondary)" />
          </linearGradient>
        </defs>
        <path
          d="M 20 100 A 80 80 0 0 1 180 100"
          stroke="var(--light-border)"
          strokeWidth={12}
          strokeLinecap="round"
        />
        <motion.path
          d="M 20 100 A 80 80 0 0 1 180 100"
          stroke="url(#focusGradient)"
          strokeWidth={12}
          strokeLinecap="round"
          pathLength={1}
          strokeDasharray={1}
          initial={{ strokeDashoffset: 1 }}
          animate={arc}
          style={{
            filter: "drop-shadow(0 0 6px color-mix(in srgb, var(--primary) 45%, transparent))",
          }}
        />
        <motion.circle
          cx={dx}
          cy={dy}
          r={6}
          fill="white"
          stroke="var(--secondary)"
          strokeWidth={3}
          initial={{ opacity: 0 }}
          animate={dot}
        />
      </svg>
      <div className="absolute inset-x-0 bottom-0 text-center">
        <div className="text-3xl font-black text-heading">75%</div>
        <div className="text-xs text-para-muted">Focus Score</div>
      </div>
    </div>
  );
}

function FocusBars() {
  return (
    <div className="flex h-7 items-end gap-1">
      {[40, 65, 50, 80, 70, 90, 60, 78, 55, 72].map((h, i) => (
        <motion.div
          key={i}
          initial={{ height: 0 }}
          whileInView={{ height: `${h}%` }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.06, type: "spring" }}
          className="w-full rounded-t bg-gradient-to-t from-primary/20 to-primary"
        />
      ))}
    </div>
  );
}

function FocusCard() {
  return (
    <Card className="bg-gradient-to-br from-primary/5 to-secondary/5 md:col-span-1">
      <div className="flex h-full flex-col p-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-heading">Focus Tracker</h3>
          <span className="flex items-center gap-1.5 text-[11px] font-medium text-para-muted">
            <motion.span
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ duration: 1.4, repeat: Infinity }}
              className="h-2 w-2 rounded-full bg-destructive"
            />
            Live
          </span>
        </div>

        <div className="mt-auto">
          <FocusGauge />
          <div className="mt-4 border-t border-light-border pt-3">
            <FocusBars />
          </div>
        </div>
      </div>
    </Card>
  );
}

/* ------------------------------------------------------------------ */
/*  Calendar — (narrow card)                                           */
/* ------------------------------------------------------------------ */

const WEEKDAYS = ["S", "M", "T", "W", "T", "F", "S"];
const CAL_DAYS: { day: number; muted?: boolean; active?: boolean; event?: boolean }[] = [
  { day: 26, muted: true }, { day: 27, muted: true }, { day: 28, muted: true },
  { day: 1, active: true }, { day: 2 }, { day: 3 }, { day: 4 },
  { day: 5 }, { day: 6 }, { day: 7 }, { day: 8, event: true }, { day: 9 }, { day: 10 }, { day: 11 },
  { day: 12 }, { day: 13 }, { day: 14 }, { day: 15, event: true }, { day: 16 }, { day: 17 }, { day: 18 },
];

function CalendarCard() {
  return (
    <Card className="bg-white dark:bg-card md:col-span-1">
      <div className="p-6 pb-0">
        <h3 className="text-lg font-bold text-heading">Calendar</h3>
        <p className="mt-1 text-xs leading-relaxed text-para-muted">
          Lectures &amp; deadlines, auto-scheduled.
        </p>
      </div>

      <div className="absolute -bottom-6 left-5 right-[-12px] mt-4">
        <Window className="transition-transform duration-500 group-hover:scale-[1.02]">
          <div className="flex items-center justify-between border-b border-light-border bg-white px-3 py-2 dark:bg-card">
            <ChevronLeft className="h-4 w-4 text-para-muted" />
            <span className="text-xs font-semibold text-heading">November</span>
            <ChevronRight className="h-4 w-4 text-para-muted" />
          </div>
          <div className="p-3">
            <div className="mb-2 grid grid-cols-7 text-center text-[10px] text-para-muted">
              {WEEKDAYS.map((d, i) => (
                <span key={i}>{d}</span>
              ))}
            </div>
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="grid grid-cols-7 gap-y-1 text-center text-xs"
            >
              {CAL_DAYS.map((c) =>
                c.active ? (
                  <div key={c.day} className="flex justify-center">
                    <motion.div
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                      className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-[11px] font-semibold text-white shadow-[0_0_12px_color-mix(in_srgb,var(--primary)_55%,transparent)]"
                    >
                      {c.day}
                    </motion.div>
                  </div>
                ) : (
                  <motion.span
                    key={c.day}
                    variants={popVariants}
                    className={`relative mx-auto flex h-6 w-6 items-center justify-center rounded-md transition-colors ${
                      c.event
                        ? "bg-secondary/15 font-medium text-heading"
                        : c.muted
                          ? "text-para-muted/40"
                          : "text-heading/70 hover:bg-secondary/10"
                    }`}
                  >
                    {c.day}
                  </motion.span>
                )
              )}
            </motion.div>
          </div>
        </Window>
      </div>
    </Card>
  );
}

/* ------------------------------------------------------------------ */
/*  Room Management — dashboard (hero, wide card)                      */
/* ------------------------------------------------------------------ */

const ROOM_ROWS = [
  { icon: Video, label: "Live Session", sub: "Screen share · canvas", pill: "Live", live: true },
  { icon: FileQuestion, label: "Quiz 3", sub: "Neural Networks", pill: "Graded" },
  { icon: Megaphone, label: "Announcement", sub: "Posted 2h ago", pill: "New" },
];

function RoomCard() {
  return (
    <Card className="bg-white dark:bg-card md:col-span-2">
      <CardHeading
        title="Room Management"
        desc="Invite-only or public rooms with full control over content, members, quizzes, and announcements."
      />
      <div className="absolute -bottom-5 -right-5 h-[78%] w-[58%] transition-transform duration-500 group-hover:scale-[1.03]">
        <Window className="h-full">
          {/* room header */}
          <div className="flex items-center justify-between border-b border-light-border bg-white px-3 py-2.5 dark:bg-card">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary">
                <Video className="h-4 w-4 text-white" />
              </div>
              <span className="text-xs font-semibold text-heading">
                CS101 · Neural Nets
              </span>
            </div>
            <div className="flex items-center">
              {["MA", "SH", "MK"].map((initials, i) => (
                <span
                  key={initials}
                  className={`flex h-5 w-5 items-center justify-center rounded-full border-2 border-white bg-primary text-[7px] font-bold text-white dark:border-card ${
                    i > 0 ? "-ml-1.5" : ""
                  }`}
                >
                  {initials}
                </span>
              ))}
              <span className="-ml-1.5 flex h-5 w-5 items-center justify-center rounded-full border-2 border-white bg-primary/10 text-[7px] font-bold text-primary dark:border-card">
                +9
              </span>
            </div>
          </div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="space-y-2 p-3"
          >
            {ROOM_ROWS.map((r) => (
              <motion.div
                key={r.label}
                variants={slideVariants}
                className="flex items-center justify-between rounded-lg border border-light-border bg-white px-3 py-2 dark:bg-card"
              >
                <div className="flex items-center gap-2.5">
                  <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary/10 text-primary">
                    <r.icon className="h-3.5 w-3.5" />
                  </div>
                  <div>
                    <div className="text-[11px] font-medium text-heading">{r.label}</div>
                    <div className="text-[10px] text-para-muted">{r.sub}</div>
                  </div>
                </div>
                <span
                  className={`flex items-center gap-1 rounded-full px-2 py-0.5 text-[9px] font-medium ${
                    r.live
                      ? "bg-destructive/10 text-destructive"
                      : "bg-secondary/10 text-para-muted"
                  }`}
                >
                  {r.live && (
                    <motion.span
                      animate={{ opacity: [1, 0.3, 1] }}
                      transition={{ duration: 1.4, repeat: Infinity }}
                      className="h-1.5 w-1.5 rounded-full bg-destructive"
                    />
                  )}
                  {r.pill}
                </span>
              </motion.div>
            ))}
          </motion.div>
        </Window>
      </div>
    </Card>
  );
}

/* ------------------------------------------------------------------ */
/*  Compact feature cards (third row)                                  */
/* ------------------------------------------------------------------ */

function MiniCard({
  icon: Icon,
  title,
  desc,
  children,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  desc: string;
  children: React.ReactNode;
}) {
  return (
    <Card className="bg-white dark:bg-card md:col-span-1">
      <div className="flex h-full flex-col p-6">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <Icon className="h-5 w-5" />
        </div>
        <h3 className="mt-4 text-lg font-bold text-heading">{title}</h3>
        <p className="mt-2 text-sm leading-relaxed text-para-muted">{desc}</p>
        <div className="mt-auto pt-5">{children}</div>
      </div>
    </Card>
  );
}

function NotesCard() {
  return (
    <MiniCard
      icon={NotebookPen}
      title="Smart Notes"
      desc="A block-based editor for structured notes — headings, lists, and code, organized room by room."
    >
      <div className="rounded-xl border border-light-border bg-main-background p-3 shadow-sm transition-transform duration-500 group-hover:scale-[1.02]">
        {/* editor toolbar */}
        <div className="mb-2.5 flex items-center gap-1.5 border-b border-light-border pb-2">
          <span className="rounded bg-primary/10 px-1.5 py-0.5 text-[9px] font-bold text-primary">
            H1
          </span>
          <span className="px-0.5 text-[11px] font-bold text-para-muted">B</span>
          <span className="px-0.5 text-[11px] italic text-para-muted">I</span>
          <span className="ml-auto text-[10px] text-para-muted">Saved</span>
        </div>
        <div className="text-[11px] font-bold text-heading">
          Lecture 4 — Backprop
        </div>
        <p className="mt-1.5 text-[10px] leading-relaxed text-para">
          Gradients flow backward via the chain rule, from the output layer to
          each weight.
        </p>
        <p className="mt-1.5 text-[10px] leading-relaxed text-para-muted">
          Steps: forward pass → compute loss → backward pass → update weights.
        </p>
      </div>
    </MiniCard>
  );
}

function QuizCard() {
  const options = [
    { t: "Gradient descent", correct: true },
    { t: "Random initialization", correct: false },
  ];
  return (
    <MiniCard
      icon={ClipboardCheck}
      title="Quizzes & Assignments"
      desc="Build quizzes and assignments with instant auto-grading and submission tracking — inside every room."
    >
      <div className="rounded-xl border border-light-border bg-main-background p-3 shadow-sm transition-transform duration-500 group-hover:scale-[1.02]">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-[10px] font-bold text-heading">Quiz · Q3</span>
          <span className="rounded-full bg-success/10 px-2 py-0.5 text-[9px] font-bold text-success">
            Auto-graded
          </span>
        </div>
        <div className="space-y-1.5">
          {options.map((o) => (
            <div
              key={o.t}
              className={`flex items-center justify-between rounded-lg border px-2.5 py-1.5 text-[11px] font-medium ${
                o.correct
                  ? "border-primary/30 bg-primary/[0.07] text-heading"
                  : "border-light-border text-para-muted"
              }`}
            >
              {o.t}
              {o.correct && (
                <span className="flex h-4 w-4 items-center justify-center rounded-full bg-primary text-white">
                  <Check className="h-2.5 w-2.5" strokeWidth={3} />
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </MiniCard>
  );
}

function RewardsCard() {
  return (
    <MiniCard
      icon={Flame}
      title="Rewards & Streaks"
      desc="Daily challenges, XP, and badges that unlock real checkout discounts as you keep your streak alive."
    >
      <div className="rounded-xl border border-light-border bg-main-background p-3 shadow-sm transition-transform duration-500 group-hover:scale-[1.02]">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-semibold text-heading">
            Daily challenge
          </span>
          <span className="rounded-full bg-accent/10 px-2 py-0.5 text-[10px] font-bold text-accent">
            +30 XP
          </span>
        </div>
        <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-secondary/15">
          <div className="h-full w-2/3 rounded-full bg-gradient-to-r from-primary to-secondary" />
        </div>
        <div className="mt-3 flex items-center justify-between">
          <span className="text-[10px] font-semibold text-para-muted">
            Streak
          </span>
          <div className="flex gap-1">
            {["M", "T", "W", "T", "F", "S", "S"].map((d, i) => (
              <span
                key={i}
                className={`flex h-5 w-5 items-center justify-center rounded-full text-[9px] font-bold ${
                  i < 5
                    ? "bg-primary text-white"
                    : "bg-secondary/10 text-para-muted"
                }`}
              >
                {d}
              </span>
            ))}
          </div>
        </div>
      </div>
    </MiniCard>
  );
}

/* ------------------------------------------------------------------ */
/*  Section                                                            */
/* ------------------------------------------------------------------ */

export default function FeaturesBento() {
  return (
    <section className="relative w-full overflow-hidden bg-white py-24" id="features">
      <div className="pointer-events-none absolute left-1/2 top-1/3 -z-10 h-1/2 w-2/3 -translate-x-1/2 rounded-full bg-primary/5 blur-[120px]" />

      <div className="mx-auto mb-14 max-w-3xl px-6 text-center lg:px-8">
        <p className="mb-4 text-sm font-semibold uppercase tracking-[0.18em] text-primary">
          Features
        </p>
        <h2 className="font-raleway text-4xl font-black leading-tight tracking-tight text-heading text-balance sm:text-5xl">
          Everything you need,{" "}
          <span className="text-primary">nothing you don&apos;t</span>
        </h2>
        <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-para-muted">
          Every tool students and instructors need — live sessions, AI, focus
          tracking, collaborative notes, and more — unified in one
          distraction-free platform.
        </p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.6 }}
        className="mx-auto max-w-[1400px] px-6 lg:px-8"
      >
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-60px" }}
          className="grid grid-cols-1 gap-4 md:grid-cols-3"
        >
          <AICard />
          <FocusCard />
          <CalendarCard />
          <RoomCard />
          <NotesCard />
          <QuizCard />
          <RewardsCard />
        </motion.div>
      </motion.div>
    </section>
  );
}
