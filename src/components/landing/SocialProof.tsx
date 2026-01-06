"use client";

import React, { useState, useEffect, useCallback } from "react";
import { cn } from "@/lib/utils";
import { Users, Rocket, Coins, CheckCircle2 } from "lucide-react";
import { baseURL } from "@/config";

interface BackendSignup {
    first_name: string;
    date_joined: string;
}

interface Signup {
    name: string;
    activity: string;
    icon: React.ReactNode;
}

const ACTIVITIES = [
    { text: "kusoo biiray Garaad family", icon: <Users className="w-4 h-4 text-primary" /> },
    { text: "bilaabay SaaS Challenge", icon: <Rocket className="w-4 h-4 text-primary" /> },
    { text: "noqday Premium User", icon: <Coins className="w-4 h-4 text-emerald-500" /> },
    { text: "bilaabay barashada Coding-ka", icon: <Rocket className="w-4 h-4 text-primary" /> },
    { text: "dhameeyay lesson-kii u horeeyay", icon: <CheckCircle2 className="w-4 h-4 text-blue-500" /> },
    { text: "helay dhibco xirfadeed", icon: <Coins className="w-4 h-4 text-amber-500" /> }
];

export function SocialProof() {
    const [signups, setSignups] = useState<BackendSignup[]>([]);
    const [currentSignup, setCurrentSignup] = useState<Signup | null>(null);
    const [isVisible, setIsVisible] = useState(false);
    const [hasFetched, setHasFetched] = useState(false);

    const fetchSignups = useCallback(async () => {
        try {
            const response = await fetch(`${baseURL}/api/public/social-proof/`);
            if (response.ok) {
                const data = await response.json();
                setSignups(data);
            }
        } catch (error) {
            console.error("Failed to fetch social proof:", error);
        }
    }, []);

    const showNext = useCallback(() => {
        if (signups.length === 0) return;

        const randomSignup = signups[Math.floor(Math.random() * signups.length)];
        const randomActivity = ACTIVITIES[Math.floor(Math.random() * ACTIVITIES.length)];

        setCurrentSignup({
            name: randomSignup.first_name,
            activity: randomActivity.text,
            icon: randomActivity.icon
        });

        setIsVisible(true);

        // Hide after 6 seconds
        setTimeout(() => {
            setIsVisible(false);
        }, 6000);
    }, [signups]);

    useEffect(() => {
        // Initial delay: 2 minutes (120,000 ms) as per user request
        const initialDelay = 120000;

        const initialTimer = setTimeout(() => {
            fetchSignups().then(() => {
                setHasFetched(true);
            });
        }, initialDelay);

        return () => clearTimeout(initialTimer);
    }, [fetchSignups]);

    useEffect(() => {
        if (!hasFetched || signups.length === 0) return;

        // Show first one immediately after fetch
        showNext();

        // Loop with random intervals (30-60 seconds)
        const interval = setInterval(() => {
            if (!isVisible) {
                showNext();
            }
        }, Math.floor(Math.random() * (60000 - 30000 + 1) + 30000));

        return () => clearInterval(interval);
    }, [hasFetched, signups, showNext, isVisible]);

    if (!currentSignup) return null;

    return (
        <div
            className={cn(
                "fixed bottom-6 left-6 z-50 transition-all duration-700 ease-out transform",
                isVisible ? "translate-x-0 opacity-100" : "-translate-x-full opacity-0"
            )}
        >
            <div className="glassmorphism flex items-center gap-3 p-3 px-4 rounded-2xl bg-card/80 dark:bg-zinc-900/80 border border-border/50 shadow-2xl max-w-[280px]">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    {currentSignup.icon}
                </div>
                <div className="flex-col">
                    <p className="text-xs font-semibold text-foreground leading-tight">
                        Soo dhawow <span className="text-primary">{currentSignup.name}</span>!
                    </p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">
                        {currentSignup.activity}
                    </p>
                </div>
            </div>
        </div>
    );
}
