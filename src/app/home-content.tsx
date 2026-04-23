"use client";

import { ChallengeHero } from "@/components/landing/ChallengeHero";
import { CurriculumSection } from "@/components/landing/CurriculumSection";
import { FAQSection } from "@/components/landing/FAQSection";
import { OurStorySection } from "@/components/landing/OurStorySection";
import { TestimonialsSection } from "@/components/landing/TestimonialsSection";
import { useEffect } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { usePostHog } from 'posthog-js/react';

const selectShowDashboard = (s: { _hasHydrated: boolean; isAuthenticated: boolean }) =>
    s._hasHydrated && s.isAuthenticated;

export function HomeContent() {
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
        <main className="min-h-screen bg-background text-foreground">
            <>
                <ChallengeHero />
                <CurriculumSection />
                <TestimonialsSection />
                <FAQSection />
                <OurStorySection
                    className="py-12 md:py-16"
                    innerClassName="px-3 sm:px-4 md:px-6 lg:px-8"
                />
            </>
        </main>
    );
}
