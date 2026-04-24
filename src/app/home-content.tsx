"use client";

import { ChallengeHero } from "@/components/landing/ChallengeHero";
import { CommunityCTA } from "@/components/landing/CommunityCTA";
import { FAQSection } from "@/components/landing/FAQSection";
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
                <CommunityCTA />
                <FAQSection />
            </>
        </main>
    );
}
