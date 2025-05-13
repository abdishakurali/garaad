"use client";
import React, { useEffect } from "react";
import { Header } from "@/components/Header";
import { ConceptsSection } from "@/components/sections/ConceptsSection";
import { CourseGrid } from "@/components/CourseGrid";
import { Button } from "@/components/ui/button";
import { LearningLevelsSection } from "@/components/sections/LearningLevelsSection";
import { MotivationSection } from "@/components/sections/MotivationSection";
import { GuidedPathsSection } from "@/components/sections/GuidedPathsSection";
import { FooterSection } from "@/components/sections/FooterSection";
import DownloadApp from "@/components/sections/DownloadApp";
import dynamic from "next/dynamic";
import AuthService from "@/services/auth";
import { useRouter } from "next/navigation";
import { Atom, BarChart, Calculator, Code } from "lucide-react";

// Dynamically import heavy components
const DynamicLearnAnimation = dynamic(
  () => import("@/components/LearnAnimation").then((mod) => mod.LearnAnimation),
  {
    loading: () => (
      <div className="h-[400px] w-full bg-gray-100 animate-pulse" />
    ),
    ssr: false,
  }
);

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const authService = AuthService.getInstance();
    if (authService.isAuthenticated()) router.push("/courses");
  }, [router]);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <div className="relative bg-gradient-to-b from-primary/5 to-background overflow-hidden">
          {/* Decorative Elements */}
          <div className="absolute inset-0 animate-fade-in">
            <div className="absolute top-10 left-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl opacity-50" />
            <div className="absolute bottom-10 right-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl opacity-50" />
            <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)]" />
          </div>

          <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-16 sm:pt-20 lg:pt-24 relative">
            <div className="flex flex-col items-center max-w-4xl mx-auto">
              <div className="space-y-6 sm:space-y-12 animate-fade-in text-center">
                <div className="space-y-6 sm:space-y-12 max-w-xs sm:max-w-2xl mx-auto">
                  <h1 className="text-2xl sm:text-4xl lg:text-6xl xl:text-7xl font-bold tracking-tight animate-slide-in leading-tight">
                    <span className="block mb-2 sm:mb-6">
                      Ku baro{" "}
                      <span className="relative inline-block">
                        sameyn
                        <svg
                          className="absolute -bottom-1 left-0 w-full h-2 sm:h-3"
                          viewBox="0 0 100 10"
                          preserveAspectRatio="none"
                        >
                          <path
                            d="M0,5 Q50,9 100,5"
                            stroke="currentColor"
                            strokeWidth="2"
                            fill="none"
                            className="text-primary"
                          />
                        </svg>
                      </span>
                      !
                    </span>
                    <span className="block mt-2 sm:mt-4 text-primary text-lg sm:text-2xl lg:text-4xl font-bold">
                      Xal u hel dhibaatooyinka si waxtar leh
                    </span>
                  </h1>{" "}
                  <div className="flex gap-4 mb-8 items-center justify-center">
                    <span className="text-primary">
                      <Calculator className="w-8 h-8" />
                    </span>
                    <span className="text-primary">
                      <Atom className="w-8 h-8" />
                    </span>
                    <span className="text-primary">
                      <Code className="w-8 h-8" />
                    </span>
                    <span className="text-primary">
                      <BarChart className="w-8 h-8" />
                    </span>
                  </div>
                  <div className="flex justify-center gap-4 animate-fade-in mt-6 sm:mt-12">
                    <Button
                      size="lg"
                      className="bg-primary/100  cursor-not-allowed hover:bg-primary/50 text-white px-6 sm:px-8 py-3 sm:py-6 text-base sm:text-lg font-semibold rounded-full shadow-lg cursor-not-allowed relative max-w-xs w-full"
                      disabled
                    >
                      {" "}
                      Billaw Maanta
                      <span className="absolute -top-2 -right-2 px-1.5 py-0.5 text-[10px] font-semibold bg-yellow-100 text-yellow-800 rounded-full border border-yellow-200">
                        Dhowaan
                      </span>
                    </Button>
                  </div>
                  <div className="container max-w-xs sm:max-w-4xl mx-auto px-0 sm:px-6 lg:px-8 mt-6 sm:mt-12 lg:mt-16">
                    <div className="relative w-full aspect-[16/9] sm:aspect-[16/8] lg:aspect-[16/7]">
                      <DynamicLearnAnimation />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sections with improved spacing */}
        <div className="space-y-16 sm:space-y-24 lg:space-y-32">
          <CourseGrid />
          <MotivationSection />
          <GuidedPathsSection />
          <ConceptsSection />
          <LearningLevelsSection />
          <DownloadApp />
          <FooterSection />
        </div>
      </main>
    </div>
  );
}
