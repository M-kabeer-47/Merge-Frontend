"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Plus, Minus } from "lucide-react";

const faqs = [
  {
    question: "Is Merge free for students?",
    answer:
      "Yes! Merge is completely free for students and individual instructors. We believe in accessible education for everyone.",
  },
  {
    question: "Can I manage multiple classes?",
    answer:
      "Absolutely. You can create or join as many rooms as you need, keeping each class's assignments and discussions completely separate.",
  },
  {
    question: "How secure is my data?",
    answer:
      "We use industry-standard encryption and secure role-based access controls to ensure your classroom data remains private and safe.",
  },
  {
    question: "Does it support real-time messaging?",
    answer:
      "Yes, every room comes with built-in real-time chat, meaning you don't need external tools like WhatsApp or Discord to stay connected.",
  },
  {
    question: "What file types can I upload?",
    answer:
      "We support all common academic file formats including PDF, DOCX, PPT, ZIP, and images, with generous size limits.",
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="py-24 bg-main-background" id="faq">
      <div className="mx-auto max-w-7xl px-6 lg:px-8 flex flex-col lg:flex-row gap-16">
        {/* Header */}
        <div className="lg:w-1/3">
          <h2 className="text-primary font-semibold mb-2">Support</h2>
          <h3 className="text-3xl font-bold font-raleway text-heading sm:text-4xl mb-6">
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
