"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import confetti from "canvas-confetti";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { CircleCheck } from "lucide-react";

// Success page config based on type
const successConfig = {
  experience: {
    title: "Experience Created!",
    description:
      "Your experience has been successfully created and is now live. You can manage or edit it from your dashboard.",
    buttonText: "Go to Dashboard",
    buttonHref: "/dashboard",
  },
  booking: {
    title: "Booking Confirmed!",
    description:
      "Your booking is confirmed. You can view your trip details and itinerary in your bookings.",
    buttonText: "View My Bookings",
    buttonHref: "/bookings",
  },
  update: {
    title: "Experience Updated!",
    description:
      "Your experience has been updated successfully. Check your dashboard for the latest details.",
    buttonText: "Back to Dashboard",
    buttonHref: "/dashboard",
  },
  blog: {
    title: "Blog published",
    description: "Your blog post has been published successfully.",
    buttonText: "View Blog",
    buttonHref: "/blog",
  },
  trip: {
    title: "Trip Planned!",
    description: "Your trip has been successfully planned.",
    buttonText: "View Trip",
    buttonHref: "/trips",
  },
  email_verified: {
    title: "Email Verified Successfully!",
    description:
      "Welcome to Merge! Your email has been verified and your account is now active.",
    buttonText: "Dashboard",
    buttonHref: "/dashboard",
  },
  default: {
    title: "Success!",
    description: "Your action was successful.",
    buttonText: "Go Home",
    buttonHref: "/",
  },
};

export default function SuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const type = searchParams.get("type") || "default";
  // @ts-expect-error - type is validated
  const config = successConfig[type] || successConfig.default;

  // Trigger confetti on mount
  useEffect(() => {
    const end = Date.now() + 1000;
    const colors = ["#8668c0"];

    const frame = () => {
      if (Date.now() > end) return;
      confetti({
        particleCount: 2,
        angle: 60,
        spread: 55,
        startVelocity: 60,
        origin: { x: 0, y: 0.5 },
        colors,
      });
      confetti({
        particleCount: 2,
        angle: 120,
        spread: 55,
        startVelocity: 60,
        origin: { x: 1, y: 0.5 },
        colors,
      });
      requestAnimationFrame(frame);
    };
    frame();
  }, [type]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="shadow-xl p-8 max-w-md rounded-2xl bg-background w-full text-center"
    >
      {/* Animated Tick Icon */}
      <motion.div
        className="mx-auto mb-6 flex items-center justify-center"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <CircleCheck
          className="h-[100px] w-[100px] text-white text-center border-primary"
          fill="#4CAF50"
        />
      </motion.div>

      <h1 className="text-2xl font-bold font-raleway text-heading mb-2">
        {config.title}
      </h1>
      <p className="text-para mb-8 text-sm">{config.description}</p>

      <Button
        className="w-full"
        onClick={() => {
          const askNotifications = searchParams.get("askNotifications");
          const separator = config.buttonHref.includes("?") ? "&" : "?";
          const href = askNotifications
            ? `${config.buttonHref}${separator}askNotifications=${askNotifications}`
            : config.buttonHref;
          router.push(href);
        }}
      >
        {config.buttonText}
      </Button>
    </motion.div>
  );
}
