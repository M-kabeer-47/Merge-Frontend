"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Plus, Minus } from "lucide-react";

const faqs = [
  {
    question: "Is Merge free to use?",
    answer:
      "Yes — both students and instructors get a free plan, no credit card required. Student Free lets you join unlimited rooms, take notes, and use the calendar, while Instructor Starter lets you run up to 2 rooms with quizzes, assignments, and live sessions. Paid plans unlock the AI Assistant, focus tracking, unlimited notes, and larger classes.",
  },
  {
    question: "What do the paid plans cost, and what do they unlock?",
    answer:
      "Student Plus is Rs. 200/month and adds unlimited notes, the AI Assistant, and the focus tracker. For instructors, Educator is Rs. 500/month (10 rooms, up to 100 students per room, AI lecture summaries) and Instructor Pro is Rs. 1,500/month (unlimited rooms and students, plus an AI bot that answers Live Q&A). You can upgrade or cancel anytime.",
  },
  {
    question: "What can the AI Assistant do?",
    answer:
      "The AI Assistant is grounded in your own course materials. Attach files from your rooms or upload your own — PDF, DOCX, PPTX, XLSX, TXT, CSV, and images (up to 50 MB each) — and it answers questions using that content instead of generic guesses. It's available on the Student Plus, Educator, and Instructor Pro plans.",
  },
  {
    question: "What happens during a live session?",
    answer:
      "Live sessions include real-time video and audio, a collaborative shared canvas, and a Live Q&A where students post and upvote questions so the most relevant ones rise to the top. On Instructor Pro, an AI bot can answer Q&A questions in real time.",
  },
  {
    question: "How does focus tracking work?",
    answer:
      "During live sessions, Merge measures attention and turns it into a focus score from 0–100, plus a post-session report breaking down focused versus distracted time and your longest focus streak. Focus tracking is included on the Student Plus, Educator, and Instructor Pro plans.",
  },
  {
    question: "Can I earn discounts on my subscription?",
    answer:
      "Yes. Completing daily, weekly, and monthly challenges earns badges that unlock discounts of up to 30% off at checkout — and the best available discount is applied to your subscription automatically.",
  },
  {
    question: "How do I sign up, and is my account secure?",
    answer:
      "You can sign up with your email or with Google in seconds and pick your role — student or instructor. Email sign-ups are verified by email, and you can enable two-factor authentication (2FA) for an extra layer of security. Room content is protected by role-based permissions so only the right people can access it.",
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="py-24 bg-main-background" id="faq">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-8 flex flex-col lg:flex-row gap-16">
        {/* Header */}
        <div className="lg:w-1/3">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-primary">
            Support
          </h2>
          <h3 className="mb-6 font-raleway text-4xl font-black tracking-tight text-heading sm:text-5xl">
            Frequently Asked Questions
          </h3>
          <p className="text-para-muted mb-8">
            Can't find the answer you're looking for? Reach out to our support
            team at{" "}
            <a href="#" className="text-primary hover:underline">
              support@merge.edu
            </a>
          </p>
        </div>

        {/* Accordion */}
        <div className="lg:w-2/3">
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="border border-light-border rounded-lg bg-white dark:bg-card overflow-hidden transition-all duration-200"
              >
                <button
                  onClick={() =>
                    setOpenIndex(openIndex === index ? null : index)
                  }
                  className="w-full flex items-center justify-between p-6 text-left"
                >
                  <span className="font-semibold text-heading">
                    {faq.question}
                  </span>
                  <span className="ml-6 flex-shrink-0 text-primary">
                    {openIndex === index ? (
                      <Minus className="w-5 h-5" />
                    ) : (
                      <Plus className="w-5 h-5" />
                    )}
                  </span>
                </button>
                <AnimatePresence initial={false}>
                  {openIndex === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                    >
                      <div className="px-6 pb-6 text-para-muted leading-relaxed border-t border-light-border/50 pt-4">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
