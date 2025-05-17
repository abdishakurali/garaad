"use client";

import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Atom, BarChart, Calculator, Code } from "lucide-react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { FooterSection } from "@/components/sections/FooterSection";
import { CourseGrid } from "@/components/CourseGrid";

// Dynamically import heavy components with loading states
const DynamicLearnAnimation = dynamic(
  () => import("@/components/LearnAnimation").then((mod) => mod.LearnAnimation),
  {
    loading: () => (
      <div className="h-[400px] w-full  animate-pulse" />
    ),
    ssr: false,
  }
);

const DynamicMotivationSection = dynamic(
  () => import("@/components/sections/MotivationSection").then((mod) => mod.MotivationSection),
  {
    loading: () => (
      <div className="h-[300px] w-full  animate-pulse" />
    ),
  }
);

const DynamicGuidedPathsSection = dynamic(
  () => import("@/components/sections/GuidedPathsSection").then((mod) => mod.GuidedPathsSection),
  {
    loading: () => (
      <div className="h-[400px] w-full  animate-pulse" />
    ),
  }
);

const DynamicConceptsSection = dynamic(
  () => import("@/components/sections/ConceptsSection").then((mod) => mod.ConceptsSection),
  {
    loading: () => (
      <div className="h-[300px] w-full  animate-pulse" />
    ),
  }
);

const DynamicLearningLevelsSection = dynamic(
  () => import("@/components/sections/LearningLevelsSection").then((mod) => mod.LearningLevelsSection),
  {
    loading: () => (
      <div className="h-[400px] w-full  animate-pulse" />
    ),
  }
);

const DynamicInteractiveLessonsSection = dynamic(
  () => import("@/components/sections/InteractiveLessonsSection").then((mod) => mod.InteractiveLessonsSection),
  {
    loading: () => (
      <div className="h-[300px] w-full  animate-pulse" />
    ),
  }
);

const DynamicDownloadApp = dynamic(
  () => import("@/components/sections/DownloadApp").then((mod) => mod.default),
  {
    loading: () => (
      <div className="h-[200px] w-full  animate-pulse" />
    ),
  }
);

function HeroSection() {
  const router = useRouter();

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

              <div className="flex flex-wrap justify-center gap-4 sm:gap-6">
                <div className="flex items-center gap-2 text-gray-600">
                  <Atom className="w-5 h-5 text-primary" />
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <BarChart className="w-5 h-5 text-primary" />
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Calculator className="w-5 h-5 text-primary" />
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Code className="w-5 h-5 text-primary" />
                </div>
              </div>

              <div className="flex justify-center">
                <Button
                  size="lg"
                  className="text-lg px-8 py-6 rounded-xl bg-primary hover:bg-primary/90 text-white font-semibold"
                  onClick={() => router.push("/welcome")}
                >
                  Is diiwaangeli      </Button>
              </div>
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
          <DynamicLearnAnimation />
          <CourseGrid />
          <DynamicMotivationSection />
          <DynamicGuidedPathsSection />
          <DynamicConceptsSection />
          <DynamicLearningLevelsSection />
          <DynamicDownloadApp />
          <FooterSection />
        </div>
      </main>
    </div>
  );
}
