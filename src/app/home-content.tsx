"use client";

import { HeroSection } from "@/components/landing/HeroSection";
import { SectionSkeleton } from "@/components/landing/SkeletonLoader";
import { Suspense, useEffect } from "react";
import dynamic from "next/dynamic";
import { useAuthStore } from "@/store/useAuthStore";
import { StudentDashboard } from "@/components/dashboard/StudentDashboard";
import { usePostHog } from 'posthog-js/react';
const TestimonialsSection = dynamic(() => import("@/components/landing/TestimonialsSection").then(mod => mod.TestimonialsSection), {
    loading: () => <SectionSkeleton />,
    ssr: true
});

const CommunityCTASection = dynamic(() => import("@/components/landing/CommunityCTASection").then(mod => mod.CommunityCTASection), {
    loading: () => <SectionSkeleton />,
    ssr: true
});

const FreePreviewSection = dynamic(() => import("@/components/landing/FreePreviewSection").then(mod => mod.FreePreviewSection), {
    loading: () => <SectionSkeleton />,
    ssr: false
});

export function HomeContent() {
    const { user, isAuthenticated } = useAuthStore();
    const posthog = usePostHog();

    useEffect(() => {
        posthog?.capture('home_viewed', {
            authenticated: isAuthenticated,
            user_id: user?.id
        });
    }, [isAuthenticated, user?.id, posthog]);



    return (
        <main className="min-h-screen bg-background dark:bg-[#09090b] transition-colors duration-300">
            {isAuthenticated ? (
                <StudentDashboard />
            ) : (
                <>
                    <HeroSection />

                    <Suspense fallback={<SectionSkeleton />}>
                        <FreePreviewSection />
                    </Suspense>

                    <Suspense fallback={<SectionSkeleton />}>
                        <TestimonialsSection />
                    </Suspense>

                    <Suspense fallback={<SectionSkeleton />}>
                        <CommunityCTASection />
                    </Suspense>
                </>
            )}
        </main>
    );
}
