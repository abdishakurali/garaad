"use client";

import { HeroSection } from "@/components/landing/HeroSection";
import { SectionSkeleton } from "@/components/landing/SkeletonLoader";
import { Suspense, useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { useAuthStore } from "@/store/useAuthStore";
import { StudentDashboard } from "@/components/dashboard/StudentDashboard";
import { usePostHog } from 'posthog-js/react';
import { Loader2 } from "lucide-react";

const TestimonialsSection = dynamic(() => import("@/components/landing/TestimonialsSection").then(mod => mod.TestimonialsSection), {
    loading: () => <SectionSkeleton />,
    ssr: true
});

const CommunityCTASection = dynamic(() => import("@/components/landing/CommunityCTASection").then(mod => mod.CommunityCTASection), {
    loading: () => <SectionSkeleton />,
    ssr: true
});

export function HomeContent() {
    const { user, isAuthenticated } = useAuthStore();
    const posthog = usePostHog();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        posthog?.capture('home_viewed', {
            authenticated: isAuthenticated,
            user_id: user?.id
        });
    }, [isAuthenticated, user?.id, posthog]);

    // Wait for client-side hydration and auth check
    useEffect(() => {
        // Give the middleware time to redirect if needed
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 500);

        return () => clearTimeout(timer);
    }, []);

    // Show loading state while checking auth
    if (isLoading) {
        return (
            <main className="min-h-screen flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                    <p className="text-sm text-muted-foreground">Ku sugid...</p>
                </div>
            </main>
        );
    }

    return (
        <main>
            {isAuthenticated ? (
                <StudentDashboard />
            ) : (
                <>
                    <HeroSection />

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
