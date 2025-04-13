"use client"
import { Header } from "@/components/Header";
import { ConceptsSection } from "@/components/sections/ConceptsSection";
import { LearnAnimation } from "@/components/LearnAnimation";
import { CourseGrid } from "@/components/CourseGrid";
import { Button } from "@/components/ui/button";
import { LearningLevelsSection } from "@/components/sections/LearningLevelsSection";
import { MotivationSection } from "@/components/sections/MotivationSection";
import { GuidedPathsSection } from "@/components/sections/GuidedPathsSection";
import { FooterSection } from "@/components/sections/FooterSection";
import DownloadApp from "@/components/sections/DownloadApp";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter()

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

          <div className="container mx-auto px-4 pt-12 lg:pt-16 relative">
            <div className="flex flex-col items-center max-w-4xl mx-auto">
              <div className="space-y-8 animate-fade-in text-center">
                <div className="space-y-10">
                  <h1 className="text-5xl lg:text-6xl font-bold tracking-tight animate-slide-in mb-8">
                    <span className="block mb-4">
                      Ku baro{" "}
                      <span className="relative">
                        sameyn
                        <svg
                          className="absolute -bottom-1 left-0 w-full"
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
                    <span className="block mt-5 text-primary">
                      Xal u hel dhibaatooyinka si waxtar leh
                    </span>
                  </h1>
                  <div className="flex justify-center gap-4 animate-fade-in">
                    <Button
                      size="lg"
                      className="bg-primary hover:bg-primary/90 text-white px-8 py-6 text-lg font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
                      onClick={() => router.push('/welcome')}
                    >
                      Bilow Maanta
                    </Button>
                  </div>
                  <div className="container max-w-4xl mx-auto px-4">
                    <LearnAnimation />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <CourseGrid />
        <MotivationSection />
        <GuidedPathsSection />
        <ConceptsSection />

        <LearningLevelsSection />
        <DownloadApp />
        <FooterSection />
      </main>
    </div>
  );
}