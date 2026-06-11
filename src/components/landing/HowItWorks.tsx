"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "motion/react";

function DeviceFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative w-full overflow-hidden rounded-2xl border border-black/[0.06] bg-white shadow-[0_34px_70px_-28px_rgba(47,26,88,0.35)] ring-1 ring-black/5">
      {/* subtle top sheen */}
      <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-16 bg-gradient-to-b from-white/40 to-transparent" />
      {children}
    </div>
  );
}

function CheckIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-3.5 w-3.5"
      aria-hidden="true"
    >
      <path d="M5 13l4 4L19 7" />
    </svg>
  );
}

function Step1Screen() {
  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-medium text-[#888]">Your Rooms</span>
        <span className="rounded-md bg-[#9b5de5] px-2 py-0.5 text-[9px] text-white">
          + Join Room
        </span>
      </div>

      <div className="mt-2 grid grid-cols-4 text-center text-[9px] text-[#555]">
        <span>Mon</span>
        <span>Tue</span>
        <span>Wed</span>
        <span>Thu</span>
      </div>

      <div className="mt-1 grid grid-cols-4 text-center text-[10px]">
        <span className="text-[#aaa]">26</span>
        <motion.span
          animate={{ scale: [1, 1.1, 1] }}
          transition={{
            duration: 2.5,
            ease: "easeInOut",
            repeat: Number.POSITIVE_INFINITY,
          }}
          className="mx-auto flex h-6 w-6 items-center justify-center rounded-md bg-[#9b5de5] text-[10px] font-bold text-white"
        >
          27
        </motion.span>
        <span className="text-[#aaa]">28</span>
        <span className="text-[#aaa]">29</span>
      </div>

      <div className="mt-3 rounded border-l-2 border-[#9b5de5] bg-[#9b5de5]/20 px-2 py-1.5">
        <p className="text-[9px] font-medium text-[#c4a8ff]">
          Live Session - Neural Networks
        </p>
        <p className="text-[8px] text-[#777]">2:30 pm – 4:00 pm</p>
      </div>

      <div className="mt-1.5 rounded border-l-2 border-[#444] bg-[#1e1e1e] px-2 py-1.5">
        <p className="text-[9px] text-[#888]">Assignment Due: Week 3 Quiz</p>
      </div>
    </div>
  );
}

function Step2Screen({ inView }: { inView: boolean }) {
  return (
    <div className="flex h-full">
      <div className="h-full w-1/3 border-r border-[#2a2a2a] pr-1">
        <p className="px-2 pt-1 text-[10px] font-black text-[#9b5de5]">Merge</p>
        <div className="mt-2 space-y-0.5">
          <p className="rounded-md bg-[#9b5de5]/20 px-2 py-1 text-[9px] text-[#c4a8ff]">
            # CS101 - Neural Nets
          </p>
          <p className="px-2 py-1 text-[9px] text-[#666]"># Physics 301</p>
          <p className="px-2 py-1 text-[9px] text-[#666]"># Study Group: AI</p>
          <p className="px-2 py-1 text-[9px] text-[#666]"># Announcements</p>
        </div>
      </div>

      <div className="flex flex-1 flex-col">
        <p className="px-3 pt-1 text-[9px] font-semibold text-[#ccc]">
          # CS101 - Neural Nets
        </p>

        <div className="mt-2 flex-1 space-y-2 px-3">
          <div>
            <div className="flex items-center gap-1">
              <span className="inline-block h-4 w-4 rounded-full bg-[#9b5de5]" />
              <span className="text-[8px] font-bold text-[#9b5de5]">
                Prof. Sarah
              </span>
            </div>
            <p className="mt-0.5 text-[8px] text-[#aaa]">
              Welcome to CS101! Upload your Week 1 notes.
            </p>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.4, ease: "easeOut", delay: 0.6 }}
            className="ml-auto max-w-[65%] rounded-xl rounded-tr-sm bg-[#9b5de5] px-2 py-1.5 text-[8px] text-white"
          >
            Thanks! Just uploaded the PDF 📎
          </motion.div>
        </div>

        <div className="mx-3 mb-2 flex items-center rounded-lg bg-[#1e1e1e] px-3 py-1.5">
          <span className="text-[8px] text-[#444]">Message #CS101...</span>
        </div>
      </div>
    </div>
  );
}

function Step3Screen({ inView }: { inView: boolean }) {
  const [focus, setFocus] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const target = 91;
    const duration = 1500;
    const start = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      setFocus(Math.round(progress * target));
      if (progress < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView]);

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1">
          <span className="h-2 w-2 animate-pulse rounded-full bg-red-500" />
          <span className="text-[9px] font-bold text-[#ff6b6b]">
            Live Session
          </span>
        </div>
        <span className="text-[9px] text-[#888]">👥 12</span>
      </div>

      <div className="mt-2 flex flex-1">
        <div className="w-1/2 border-r border-[#2a2a2a] pr-2">
          <div className="h-16 rounded-lg bg-[#1e1e1e] p-2">
            <svg
              viewBox="0 0 100 50"
              className="h-full w-full"
              aria-hidden="true"
            >
              <polyline
                points="5,40 20,15 35,30 50,10 65,35 80,20 95,38"
                fill="none"
                stroke="#9b5de5"
                strokeOpacity="0.4"
                strokeWidth="1.5"
              />
              <path
                d="M10,45 C30,25 50,48 70,28 S95,30 95,20"
                fill="none"
                stroke="#9b5de5"
                strokeOpacity="0.4"
                strokeWidth="1.5"
              />
            </svg>
          </div>
          <p className="mt-1 text-center text-[8px] text-[#555]">
            Shared Canvas
          </p>
        </div>

        <div className="w-1/2 pl-2">
          <p className="mb-1.5 text-[9px] font-semibold text-[#888]">
            Live Q&amp;A
          </p>
          <div className="rounded-md bg-[#1e1e1e] px-2 py-1.5 text-[8px] text-[#c4a8ff]">
            <span className="font-bold text-[#9b5de5]">▲ 14</span> How does
            backprop work?
          </div>
          <div className="px-2 py-1.5 text-[8px] text-[#666]">
            <span>▲ 7</span> What&apos;s the learning rate?
          </div>
        </div>
      </div>

      <div className="mt-auto flex items-center justify-between border-t border-[#2a2a2a] px-2 py-1.5">
        <span className="text-[9px] font-medium text-[#34d399]">
          🎯 Focus: {focus}%
        </span>
        <span className="rounded-md bg-[#9b5de5] px-2 py-0.5 text-[8px] text-white">
          🤖 Ask AI
        </span>
      </div>
    </div>
  );
}

const STEPS = [
  {
    badge: "Step 1",
    title: "Create your account",
    description:
      "Sign up with your email or Google in seconds. Set up your profile, choose your role — student or instructor — and you're in.",
    image: "/landing/step1.png",
    points: [
      "Email or one-click Google sign-up",
      "Choose your role — student or instructor",
      "A personalized dashboard, instantly",
    ],
  },
  {
    badge: "Step 2",
    title: "Join or create a room",
    description:
      "Explore public rooms or create your own. Invite students, upload course materials, and set up your space in minutes.",
    image: "/landing/step2.png",
    points: [
      "Browse public rooms or go invite-only",
      "Upload course materials & resources",
      "Add quizzes, assignments & announcements",
    ],
  },
  {
    badge: "Step 3",
    title: "Learn and collaborate",
    description:
      "Access live sessions, AI assistance, shared canvas, focus tracking, and notes — all without leaving Merge.",
    image: "/landing/step3.png",
    points: [
      "Live sessions with a shared canvas",
      "Ask the AI trained on your room",
      "Track focus & take collaborative notes",
    ],
  },
];

export default function HowItWorks() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="how-it-works" className="relative w-full bg-[#efefef] py-24">
      <div className="mx-auto max-w-[1400px] px-8" ref={ref}>
        {/* Eyebrow + heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="text-center"
        >
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.18em] text-primary">
            Get Started
          </p>
          <h2 className="font-raleway text-4xl font-black tracking-tight text-heading text-balance sm:text-5xl">
            Here&apos;s how it works
          </h2>
        </motion.div>

        {/* Alternating step rows */}
        <div className="mt-16 space-y-20 lg:mt-24 lg:space-y-28">
          {STEPS.map((step, i) => {
            const flipped = i % 2 === 1;
            return (
              <div
                key={step.badge}
                className={`flex flex-col items-center gap-10 lg:gap-16 ${
                  flipped ? "lg:flex-row-reverse" : "lg:flex-row"
                }`}
              >
                {/* Device */}
                <motion.div
                  initial={{ opacity: 0, x: flipped ? 40 : -40 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                  className="w-full lg:w-[56%]"
                >
                  <DeviceFrame>
                    <img src={step.image} alt="" className="block h-auto w-full" />
                  </DeviceFrame>
                </motion.div>

                {/* Text */}
                <motion.div
                  initial={{ opacity: 0, y: 28 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.55, ease: "easeOut", delay: 0.1 }}
                  className="w-full lg:w-[44%]"
                >
                  <div className="flex items-center gap-3">
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                      {i + 1}
                    </span>
                    <span className="text-sm font-semibold uppercase tracking-[0.16em] text-primary">
                      {step.badge}
                    </span>
                  </div>

                  <h3 className="mt-5 font-raleway text-3xl font-black tracking-tight text-heading sm:text-4xl">
                    {step.title}
                  </h3>
                  <p className="mt-4 max-w-md text-base leading-relaxed text-para-muted">
                    {step.description}
                  </p>

                  <ul className="mt-6 space-y-3">
                    {step.points.map((point) => (
                      <li key={point} className="flex items-center gap-3">
                        <span className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                          <CheckIcon />
                        </span>
                        <span className="text-sm font-medium text-heading">
                          {point}
                        </span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              </div>
            );
          })}
        </div>

        {/* Bottom trust pill */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.45, ease: "easeOut", delay: 0.5 }}
          className="mx-auto mt-14 flex w-fit flex-col items-start gap-4 rounded-2xl border border-[#e0e0e0] bg-white px-8 py-5 shadow-sm sm:flex-row sm:items-center sm:gap-8 sm:rounded-full sm:py-4"
        >
          <div className="flex items-center gap-2.5 border-b border-[#e0e0e0] pb-4 text-sm font-medium text-[#333] sm:border-b-0 sm:border-r sm:pb-0 sm:pr-8">
            <AllToolsIcon />
            All tools in one place
          </div>
          <div className="flex items-center gap-2.5 border-b border-[#e0e0e0] pb-4 text-sm font-medium text-[#333] sm:border-b-0 sm:border-r sm:pb-0 sm:pr-8">
            <CalendarIcon />
            Auto-synced calendar &amp; tasks
          </div>
          <div className="flex items-center gap-2.5 text-sm font-medium text-[#333]">
            <AIAssistantIcon />
            AI assistant always available
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function AllToolsIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#0a0a0a"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="3" y="3" width="7.5" height="7.5" rx="1.5" />
      <rect x="13.5" y="3" width="7.5" height="7.5" rx="1.5" />
      <rect x="3" y="13.5" width="7.5" height="7.5" rx="1.5" />
      <rect x="13.5" y="13.5" width="7.5" height="7.5" rx="1.5" />
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#0a0a0a"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="3" y="4.5" width="18" height="16.5" rx="2.5" />
      <path d="M3 9.5h18" />
      <path d="M7.5 2.5v4M16.5 2.5v4" />
      <path d="M7.5 13.5h2M14.5 13.5h2M7.5 17h2M14.5 17h2" />
    </svg>
  );
}

function AIAssistantIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#0a0a0a"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {/* Chat bubble */}
      <path d="M12 3C7.03 3 3 6.58 3 11c0 2.1.9 4 2.4 5.4L4 21l4.8-1.6C10 19.8 11 20 12 20c4.97 0 9-3.58 9-8s-4.03-9-9-9z" />
      {/* Three dots suggesting AI thinking */}
      <circle cx="8.5" cy="11" r="1" fill="none" stroke="#0a0a0a" />
      <circle cx="12" cy="11" r="1" fill="none" stroke="#0a0a0a" />
      <circle cx="15.5" cy="11" r="1" fill="none" stroke="#0a0a0a" />
    </svg>
  );
}
