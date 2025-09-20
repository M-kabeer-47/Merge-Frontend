import React from "react";
import SignUpIllustration from "@/components/auth/SignUpIllustration";
import SignUpForm from "@/components/auth/SignUpForm";

const SignUpPage = () => {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      {/* Main Container */}
      <div className="w-full max-w-6xl bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="flex min-h-[600px]">
          {/* Left Column - Illustration */}
          <div className="hidden lg:flex lg:w-1/2">
            <SignUpIllustration />
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
