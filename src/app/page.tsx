"use client";

import Navbar from "@/components/landing/Navbar";
import Hero from "@/components/landing/Hero";
// import Features from "@/components/landing/Features"; // Replaced by BentoFeatures
import BentoFeatures from "@/components/landing/BentoFeatures";
import FeaturesBento from "@/components/landing/FeaturesBento";
import ProblemSection from "@/components/landing/ProblemSection";
import Workflow from "@/components/landing/Workflow";
import Stats from "@/components/landing/Stats";
import Testimonials from "@/components/landing/Testimonials";
import FAQ from "@/components/landing/FAQ";
import CallToAction from "@/components/landing/CallToAction";
import Footer from "@/components/landing/Footer";
import HowItWorks from "@/components/landing/HowItWorks";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground font-roboto relative">
      <Navbar />
      <main>
        <Hero />
        <ProblemSection />
        {/* <BentoFeatures /> */}
        <FeaturesBento />
        {/* <Workflow /> */}
        {/* <Stats /> */}
        <HowItWorks />
        <Testimonials />
        <FAQ />
        <CallToAction />
      </main>
      <Footer />
    </div>
  );
}
