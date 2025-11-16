"use client";
import React from "react";
import AuthIllustration from "@/components/auth/AuthIllustration";
import SignUpForm from "@/components/auth/sign-up/SignUpForm";
import { useTheme } from "next-themes";

const SignUpPage = () => {
  const { theme } = useTheme();
  const isDarkMode = theme === "dark";
  return (
    <div className="min-h-screen bg-main-background flex items-center justify-center p-4">
      {/* Main Container */}
      <div className="w-full max-w-7xl bg-background rounded-2xl shadow-lg overflow-hidden">
        <div className="flex min-h-[600px]">
          {/* Left Column - Illustration */}
          <div className="hidden lg:flex lg:w-1/2">
            <AuthIllustration
              imageUrl={`${isDarkMode ? "/illustrations/dark-sign-up-illustration.png" : "/illustrations/sign-up-illustration.png"}`}
              title="Join Our Community"
              subtitle="Connect, learn, and grow with students and instructors worldwide"
            />
          </div>

          {/* Right Column - Form */}
          <div className="w-full lg:w-1/2">
            <SignUpForm />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
