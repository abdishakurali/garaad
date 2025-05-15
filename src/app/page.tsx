"use client";

import { Header } from "@/components/Header";
import { GuidedPathsSection } from "@/components/sections/GuidedPathsSection";
import { ConceptsSection } from "@/components/sections/ConceptsSection";
import { LearningLevelsSection } from "@/components/sections/LearningLevelsSection";
import DownloadApp from "@/components/sections/DownloadApp";
import { FooterSection } from "@/components/sections/FooterSection";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

function HeroSection() {
  return (
    <div className="relative bg-gradient-to-b from-primary/5 to-background overflow-hidden">
      <div className="absolute inset-0 animate-fade-in">
        <div className="absolute top-10 left-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl opacity-50" />
        <div className="absolute bottom-10 right-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl opacity-50" />
        <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 sm:pt-20 lg:pt-24 relative">
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
              </h1>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <Header />
      <main>
        <div className="relative">
          <HeroSection />
          <ProtectedRoute>
            <GuidedPathsSection />
            <ConceptsSection />
            <LearningLevelsSection />
          </ProtectedRoute>
          <DownloadApp />
          <FooterSection />
        </div>
      </main>
    </div>
  );
}
