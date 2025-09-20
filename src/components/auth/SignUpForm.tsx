import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const SignUpForm = () => {
  return (
    <div className="flex flex-col h-full justify-center px-8 py-12">
      <div className="w-full mx-auto">
        {/* Header */}
        <div className="mb-8 animate-in slide-in-from-bottom-4 duration-500">
          <h1 className="text-3xl font-raleway font-bold text-heading mb-2">
            Create Account
          </h1>
          <p className="text-normal-text-muted">
            Choose your role and get started with Merge
          </p>
        </div>

        {/* Role Selection Cards */}
        <div className="mb-8 animate-in slide-in-from-bottom-4 duration-500 delay-100">
          <div className="grid grid-cols-2 gap-3">
            {/* Student Card */}
            <div className="group cursor-pointer">
              <div className="bg-white rounded-lg border-2 border-gray-200 p-4 transition-all duration-200 hover:border-secondary/50 hover:shadow-md group-hover:scale-[1.01] ">
                <div className="flex items-center space-x-4">
                  <img
                    src="/illustrations/student.png"
                    alt="Student"
                    className="w-15 h-15 mt-1 flex-shrink-0 scale-120"
                  />
                  
                    <h3 className="font-raleway text-center font-semibold text-heading text-lg mb-1">
                      Student
                    </h3>
                  
                </div>
              </div>
            </div>

            {/* Instructor Card */}
            <div className="group cursor-pointer">
              <div className="bg-white rounded-lg border-2 border-gray-200 p-4 transition-all duration-200 hover:border-accent/50 hover:shadow-md group-hover:scale-[1.01] hover:bg-accent/5">
                <div className="flex items-center space-x-4">
                  <img
                    src="/illustrations/instructor.png"
                    alt="Instructor"
                    className="w-15 h-15 mt-1 flex-shrink-0 scale-120"
                  />
                  
                    <h3 className="font-raleway font-semibold text-heading text-lg mb-1">
                      Instructor
                    </h3>
                 
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Form Fields */}
        <form className="space-y-5 animate-in slide-in-from-bottom-4 duration-500 delay-200">
          {/* Name Fields */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-[5px]">
              <label
                htmlFor="firstName"
                className="text-sm font-medium text-heading"
              >
                First Name
              </label>
              <Input
                id="firstName"
                placeholder="John"
                className="transition-all duration-200 hover:border-secondary/30"
              />
            </div>
            <div className="flex flex-col gap-[5px]">
              <label
                htmlFor="lastName"
                className="text-sm font-medium text-heading"
              >
                Last Name
              </label>
              <Input
                id="lastName"
                placeholder="Doe"
                className="transition-all duration-200 hover:border-secondary/30"
              />
            </div>
          </div>

          {/* Email */}
          <div className="flex flex-col gap-[5px]">
            <label htmlFor="email" className="text-sm font-medium text-heading">
              Email
            </label>
            <Input
              id="email"
              type="email"
              placeholder="john@example.com"
              className="transition-all duration-200 hover:border-secondary/30"
            />
          </div>

          {/* Password */}
          <div className="flex flex-col gap-[5px]">
            <label
              htmlFor="password"
              className="text-sm font-medium text-heading"
            >
              Password
            </label>
            <Input
              id="password"
              type="password"
              placeholder="Create a strong password"
              className="transition-all duration-200 hover:border-secondary/30"
            />
          </div>

          {/* Confirm Password */}
          <div className="flex flex-col gap-[5px]">
            <label
              htmlFor="confirmPassword"
              className="text-sm font-medium text-heading"
            >
              Confirm Password
            </label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="Confirm your password"
              className="transition-all duration-200 hover:border-secondary/30"
            />
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full mt-8 bg-primary hover:bg-primary/90 transition-all duration-200 transform hover:scale-[1.02]"
            size="lg"
          >
            Create Account
          </Button>
        </form>

        {/* Sign In Link */}
        <div className="mt-6 text-center animate-in slide-in-from-bottom-4 duration-500 delay-300">
          <p className="text-normal-text-muted text-sm">
            Already have an account?{" "}
            <a
              href="/signin"
              className="text-primary hover:text-primary/80 font-medium transition-colors duration-200"
            >
              Sign in
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUpForm;
