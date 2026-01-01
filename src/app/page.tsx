import { Header } from "@/components/Header";
import dynamic from "next/dynamic";
import { FooterSection } from "@/components/sections/FooterSection";
import { CourseGrid } from "@/components/CourseGrid";
import { HeroSection } from "@/components/landing/HeroSection";
import { SectionSkeleton } from "@/components/landing/SkeletonLoader";
import { Suspense } from "react";
import { Reveal } from "@/components/landing/Reveal";
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Garaad STEM | Baro Xisaabta, Fiisigiska iyo Tiknoolajiyadda',
  description: 'Garaad waa goob waxbarasho oo casri ah oo lagu barto maaddooyinka STEM (Xisaabta, Fiisigiska, iyo Tiknoolajiyadda) afka Soomaaliga.',
};

// Dynamically import only necessary heavy sections
const DynamicGuidedPathsSection = dynamic(
  () => import("@/components/sections/GuidedPathsSection").then((mod) => mod.GuidedPathsSection)
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
      {/* JSON-LD for Search Engines */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "EducationalOrganization",
            "name": "Garaad STEM",
            "url": "https://garaad.so",
            "logo": "https://garaad.so/logo.png",
            "description": "Garaad waa goob waxbarasho oo lagu barto STEM afka Soomaaliga.",
            "sameAs": [
              "https://www.linkedin.com/company/garaad",
              "https://x.com/Garaadstem",
              "http://facebook.com/Garaadstem"
            ]
          })
        }}
      />
      <Header />
      <main>
        <div className="relative">
          {/* Above the fold - Hero is Client Component for animations/user-state */}
          <HeroSection />

          <CourseGrid />

          <Suspense fallback={<SectionSkeleton />}>
            <DynamicGuidedPathsSection />
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
