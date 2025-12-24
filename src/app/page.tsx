import { Header } from "@/components/Header";
import dynamic from "next/dynamic";
import { FooterSection } from "@/components/sections/FooterSection";
import { CourseGrid } from "@/components/CourseGrid";
import { HeroSection } from "@/components/landing/HeroSection";
import { SectionSkeleton } from "@/components/landing/SkeletonLoader";
import { Suspense } from "react";
import { Reveal } from "@/components/landing/Reveal";

// Dynamically import only necessary heavy sections
const DynamicStayMotivatedSection = dynamic(
  () => import("@/components/sections/StayMotivatedSection").then((mod) => mod.StayMotivatedSection)
);

const DynamicLearningLevelsSection = dynamic(
  () => import("@/components/sections/LearningLevelsSection").then((mod) => mod.LearningLevelsSection)
);

const DynamicDownloadApp = dynamic(
  () => import("@/components/sections/DownloadApp").then((mod) => mod.default)
);

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        <div className="relative">
          {/* Above the fold - Hero is Client Component for animations/user-state */}
          <HeroSection />

          <CourseGrid />

          <Suspense fallback={<SectionSkeleton />}>
            <DynamicStayMotivatedSection />
          </Suspense>

          <Suspense fallback={<SectionSkeleton />}>
            <DynamicLearningLevelsSection />
          </Suspense>

          <Suspense fallback={<SectionSkeleton />}>
            <DynamicDownloadApp />
          </Suspense>

          <FooterSection />
        </div>
      </main>
    </div>
  );
}
