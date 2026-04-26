"use client";

import { Sun, Moon } from "lucide-react";
import { useAuth } from "@/providers/AuthProvider";

interface WelcomeSectionProps {
  userName?: string;
  userRole?: "student" | "instructor";
}

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return "Good Morning";
  if (hour < 17) return "Good Afternoon";
  return "Good Evening";
};

const getGreetingIcon = () => {
  const hour = new Date().getHours();
  if (hour < 17) return Sun;
  return Moon;
};

const getWelcomeMessage = (role?: "student" | "instructor") => {
  if (role === "instructor") {
    return "Ready to inspire and guide your students today!";
  }
  return "Keep up the great work! You're on track for this week.";
};

export default function WelcomeSection({
  userName,
  userRole,
}: WelcomeSectionProps) {
  const { user } = useAuth();
  const GreetingIcon = getGreetingIcon();
  const displayName = userName || user?.firstName || "there";
  const role = userRole || (user?.role === "instructor" ? "instructor" : "student");

  return (
    <div className="bg-gradient-to-r from-primary to-secondary rounded-2xl p-6 text-white relative overflow-hidden mb-6">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-full -translate-y-16 translate-x-16"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white rounded-full translate-y-12 -translate-x-12"></div>
      </div>

      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
            <GreetingIcon className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold font-raleway">
              {getGreeting()}, {displayName}! 👋
            </h1>
          </div>
        </div>
        <div className="mt-3">
          <p className="text-white/90 text-sm">{getWelcomeMessage(role)}</p>
        </div>
      </div>
    </div>
  );
}
