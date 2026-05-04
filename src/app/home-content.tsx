"use client";

import { ChallengeHero } from "@/components/landing/ChallengeHero";
import { ThreePathsSection } from "@/components/landing/ThreePathsSection";
import { WorkflowSection } from "@/components/landing/WorkflowSection";
import { CommunityCTA, MentorshipCTA } from "@/components/landing/CommunityCTA";
import { CommunitySection } from "@/components/landing/CommunitySection";
import { PricingSection } from "@/components/landing/PricingSection";
import { FAQSection } from "@/components/landing/FAQSection";
import { useEffect } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { usePostHog } from 'posthog-js/react';

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
                <ThreePathsSection />
                <WorkflowSection />
                <CommunityCTA />
                <CommunitySection />
                <MentorshipCTA />
                <PricingSection />
                <FAQSection />
            </>
        </main>
    );
}