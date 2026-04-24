'use client'

import posthog from 'posthog-js'
import { PostHogProvider as PHProvider } from 'posthog-js/react'
import { useEffect } from 'react'

export function PostHogProvider({ children }: { children: React.ReactNode }) {
    useEffect(() => {
        if (typeof window !== 'undefined' && !posthog.__loaded) {
            const initPostHog = () => {
                posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
                    api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
                    person_profiles: 'identified_only',
                    capture_pageview: true,
                    capture_pageleave: true,
                })
            };

            if ('requestIdleCallback' in window) {
                (window as any).requestIdleCallback(initPostHog);
            } else {
                setTimeout(initPostHog, 2000);
            }
        }
    }, [])

    return <PHProvider client={posthog}>{children}</PHProvider>
}

export function identifyUser(user: { id: string | number; email: string; name?: string }) {
    if (typeof window === 'undefined') return;
    if (!posthog.__loaded) return;

    const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL;
    const isAdmin = adminEmail ? user.email === adminEmail : false;

    posthog.identify(String(user.id), {
        email: user.email,
        name: user.name,
        ...(isAdmin && { is_admin: true }),
    });
}

export function resetUser() {
    if (typeof window === 'undefined') return;
    if (!posthog.__loaded) return;

    posthog.reset();
}
