"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import {
  AppWindow,
  Users,
  Share2,
  Zap,
  Layers,
  Command,
  CheckCircle2,
} from "lucide-react";
import { cn } from "@/lib/shadcn/utils";

// --- Visual Components (Aligned with Bento Grid Style) ---

const StepOneVisual = () => (
  <div className="w-full h-full bg-secondary/5 rounded-3xl border border-light-border p-8 relative overflow-hidden flex flex-col items-center justify-center shadow-md">
    {/* Floating Mockup */}
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      whileInView={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-sm bg-white dark:bg-card rounded-xl border border-light-border shadow-xl overflow-hidden relative"
    >
      {/* Header */}
      <div className="h-10 border-b border-light-border bg-main-background flex items-center px-4 gap-2">
        <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
        <div className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
        <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        <div className="flex gap-3">
          <div className="w-1/3 h-20 rounded-lg bg-primary/10 border border-primary/20" />
          <div className="w-2/3 h-20 rounded-lg bg-secondary/10 border border-secondary/20" />
        </div>
        <div className="h-2 w-3/4 bg-gray-100 dark:bg-gray-800 rounded-full" />
        <div className="h-2 w-1/2 bg-gray-100 dark:bg-gray-800 rounded-full" />
      </div>
    </motion.div>

    {/* Floating Badge */}
    <motion.div
      initial={{ scale: 0.8, opacity: 0, y: 10 }}
      whileInView={{ scale: 1, opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="absolute bottom-10 right-10 flex items-center gap-2 bg-heading text-background px-4 py-2 rounded-full shadow-lg z-20"
    >
      <CheckCircle2 className="w-4 h-4 text-green-400" />
      <span className="text-xs font-bold font-raleway">Space Created</span>
    </motion.div>
  </div>
);

const StepTwoVisual = () => (
  <div className="w-full h-full bg-white dark:bg-card rounded-3xl border border-light-border relative overflow-hidden flex items-center justify-center shadow-md">
    {/* Central Hub */}
    <motion.div
      initial={{ scale: 0.8 }}
      whileInView={{ scale: 1 }}
      className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg z-20 relative"
    >
      <Zap className="w-8 h-8 text-white" />
    </motion.div>

    {/* Connection Lines (Subtle) */}
    <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20 dark:opacity-40">
      <motion.circle
        cx="50%"
        cy="50%"
        r="80"
        stroke="currentColor"
        strokeDasharray="4 4"
        fill="none"
        className="text-para-muted"
        animate={{ rotate: 360 }}
        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
      />
      <motion.circle
        cx="50%"
        cy="50%"
        r="160"
        stroke="currentColor"
        fill="none"
        className="text-light-border"
      />
    </svg>

    {/* Floating Nodes */}
    {[0, 120, 240].map((deg, i) => (
      <motion.div
        key={i}
        initial={{ opacity: 0, x: 0, y: 0 }}
        whileInView={{
          opacity: 1,
          x: Math.cos((deg * Math.PI) / 180) * 120,
          y: Math.sin((deg * Math.PI) / 180) * 120,
        }}
        transition={{ delay: i * 0.2, type: "spring" }}
        className="absolute w-12 h-12 rounded-xl bg-main-background border border-light-border shadow-sm flex items-center justify-center z-10"
      >
        <Users className="w-5 h-5 text-para-muted" />
      </motion.div>
    ))}
  </div>
);

const StepThreeVisual = () => (
  <div className="w-full h-full bg-main-background rounded-3xl border border-light-border p-6 relative overflow-hidden flex items-center justify-center shadow-md">
    <div className="w-full max-w-[320px] space-y-3">
      {[1, 2, 3].map((i) => (
        <motion.div
          key={i}
          initial={{ x: i % 2 === 0 ? 20 : -20, opacity: 0 }}
          whileInView={{ x: 0, opacity: 1 }}
          transition={{ delay: i * 0.15 }}
          className={cn(
            "p-4 rounded-2xl border shadow-sm flex gap-3 items-center",
            i === 3
              ? "bg-primary/5 border-primary/20"
              : "bg-white dark:bg-card border-light-border",
          )}
        >
          <div
            className={cn(
              "w-10 h-10 rounded-full flex items-center justify-center",
              i === 3
                ? "bg-primary text-white"
                : "bg-gray-100 dark:bg-gray-800 text-gray-500",
            )}
          >
            {i === 3 ? (
              <Share2 className="w-5 h-5" />
            ) : (
              <Users className="w-5 h-5" />
            )}
          </div>
          <div>
            <div className="h-2 w-24 bg-gray-200 dark:bg-gray-700 rounded-full mb-1.5" />
            <div className="h-1.5 w-16 bg-gray-100 dark:bg-gray-800 rounded-full" />
          </div>
        </motion.div>
      ))}
    </div>
  </div>
);

const steps = [
  {
    title: "Architect Your Chaos",
    description:
      "Transform scattered assignments, deadlines, and resources into a singular, cohesive command center. Your entire academic life, indexed and searchable.",
    visual: StepOneVisual,
    icon: Layers,
  },
  {
    title: "Zero-Latency Connection",
    description:
      "Bypass the bureaucracy. Invite teams via magic links and sync instantly. No friction, no setup fatigue, just pure neural collaboration.",
    visual: StepTwoVisual,
    icon: Zap,
  },
  {
    title: "The Living Workspace",
    description:
      "Documents that breathe. Chats that flow. A unified canvas where code, design, and dialogue merge into one continuous stream of thought.",
    visual: StepThreeVisual,
    icon: Share2,
  },
];

export default function Workflow() {
  const [activeStep, setActiveStep] = useState(0);

  return (
    <section className="bg-background relative py-24 lg:py-32" id="workflow">
      {/* Section Header */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 mb-20 lg:mb-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-2xl"
        >
          <h2 className="text-primary font-bold tracking-wide uppercase text-sm mb-4">
            The Workflow
          </h2>
          <h3 className="text-4xl md:text-5xl font-raleway font-bold text-heading leading-tight tracking-tight">
            From chaos to <span className="text-secondary">clarity.</span>
          </h3>
        </motion.div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-24">
          {/* Sticky Visual Side */}
          <div className="lg:w-1/2 hidden lg:block h-[500px] sticky top-32">
            <div className="relative w-full h-full">
              {steps.map((step, index) => (
                <motion.div
                  key={index}
                  className="absolute inset-0 w-full h-full"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{
                    opacity: activeStep === index ? 1 : 0,
                    scale: activeStep === index ? 1 : 0.95,
                  }}
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                >
                  <step.visual />
                </motion.div>
              ))}
            </div>
          </div>

          {/* Scrollable Text Side */}
          <div className="lg:w-1/2 flex flex-col gap-[30vh] pb-[20vh] pt-[5vh]">
            {steps.map((step, index) => (
              <StepCard
                key={index}
                step={step}
                index={index}
                setActiveStep={setActiveStep}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// Sub-component for individual steps to handle Viewport detection
function StepCard({
  step,
  index,
  setActiveStep,
}: {
  step: any;
  index: number;
  setActiveStep: (i: number) => void;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { margin: "-50% 0px -50% 0px" });

  useEffect(() => {
    if (isInView) setActiveStep(index);
  }, [isInView, index, setActiveStep]);

  return (
    <div ref={ref} className="flex flex-col justify-center">
      {/* Mobile Visual */}
      <div className="lg:hidden mb-8 h-[350px] w-full rounded-3xl overflow-hidden border border-light-border bg-main-background shadow-md">
        <div className="w-full h-full p-2">
          <step.visual />
        </div>
      </div>

      <div
        className={cn(
          "transition-all duration-500 ease-out border-l-4 pl-6",
          isInView
            ? "border-primary opacity-100"
            : "border-transparent opacity-30",
        )}
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
            <step.icon className="w-5 h-5" />
          </div>
          <span className="text-sm font-mono text-para-muted/50 font-bold">
            0{index + 1}
          </span>
        </div>
        <h3 className="text-3xl font-bold font-raleway text-heading mb-4">
          {step.title}
        </h3>
        <p className="text-lg text-para-muted leading-relaxed max-w-md">
          {step.description}
        </p>
      </div>
    </div>
  );
}
