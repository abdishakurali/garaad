"use client";

import { HeroSection } from "@/components/landing/HeroSection";
import { UrgencyStrip } from "@/components/ui/UrgencyStrip";
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

const GaraadFeaturesShowcase = dynamic(() => import("@/components/landing/GaraadFeaturesShowcase").then(mod => mod.GaraadFeaturesShowcase), {
    loading: () => <SectionSkeleton />,
    ssr: true
});

// Selector: only re-render when the effective view changes (hero vs dashboard).
// Before hydration we show hero; after, we show dashboard only if authenticated.
// This avoids an extra Hero re-render when only _hasHydrated flips and user is still guest.
const selectShowDashboard = (s: { _hasHydrated: boolean; isAuthenticated: boolean }) =>
    s._hasHydrated && s.isAuthenticated;

export function HomeContent() {
    const showDashboard = useAuthStore(selectShowDashboard);
    const user = useAuthStore((s) => s.user);
    const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
    const posthog = usePostHog();

    useEffect(() => {
        posthog?.capture('home_viewed', {
            authenticated: isAuthenticated,
            user_id: user?.id
        });
    }, [isAuthenticated, user?.id, posthog]);

    return (
        <main className="min-h-screen bg-background dark:bg-[#09090b] transition-colors duration-300">
            {showDashboard ? (
                <StudentDashboard />
            ) : (
                <>
                    <HeroSection />

                    <UrgencyStrip />

                    <Suspense fallback={<SectionSkeleton />}>
                        <TestimonialsSection />
                    </Suspense>

                    <Suspense fallback={<SectionSkeleton />}>
                        <GaraadFeaturesShowcase />
                    </Suspense>

                    <Suspense fallback={<SectionSkeleton />}>
                        <CommunityCTASection />
                    </Suspense>
                </>
            )}
        </main>
    );
}
