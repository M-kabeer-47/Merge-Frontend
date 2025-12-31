"use client";


import AuthIllustration from "@/components/auth/AuthIllustration";
import SignInForm from "@/components/auth/sign-in/SignInForm";

export default function SignInPage() {
    return (
        <div className="h-screen bg-main-background flex items-center justify-center p-4">
            {/* Main Container */}
            <div className="w-full  max-w-7xl bg-background rounded-2xl shadow-lg overflow-hidden">
                <div className="flex " >
                    {/* Left Column - Illustration */}
                    <div className="hidden lg:flex lg:w-[60%]">
                        <AuthIllustration
                            page="sign-in"
                            imageUrl="/illustrations/sign-in-illustration.png"
                            title="Glad to see you again!"
                            subtitle="Continue your learning journey with thousands of courses and expert instructors"
                        />
                    </div>

                    {/* Right Column - Form */}
                    <div className="w-full lg:w-[40%] h-full">
                        <SignInForm />
                    </div>
                </div>
            </div>
        </div>
    );
}
