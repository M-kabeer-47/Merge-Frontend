"use client";

import React from "react";
import AuthIllustration from "@/components/auth/AuthIllustration";
import SignUpForm from "@/components/auth/sign-up/SignUpForm";

export default function SignUpPage() {
    return (
        <div className="h-screen bg-main-background flex items-center justify-center p-4">
            {/* Main Container */}
            <div className="w-full max-w-7xl bg-background rounded-2xl shadow-lg overflow-hidden">
                <div className="flex">
                    {/* Left Column - Illustration */}
                    <div className="hidden lg:flex lg:w-[60%]">
                        <AuthIllustration
                            page="sign-up"
                            imageUrl="/illustrations/sign-up-illustration.png"
                            title="Join thousands of learners!"
                            subtitle="Start your learning journey with expert instructors and comprehensive courses"
                        />
                    </div>

                    {/* Right Column - Form */}
                    <div className="w-full lg:w-[40%] h-full">
                        <SignUpForm />
                    </div>
                </div>
            </div>
        </div>
    );
}
