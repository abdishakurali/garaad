"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { cn } from "@/lib/utils";
import { X, GraduationCap, Rocket, Star, Users, BookOpen } from "lucide-react";
import { baseURL } from "@/config";
import { useAuthStore } from "@/store/useAuthStore";
import { useAuthReady } from "@/hooks/useAuthReady";
import { usePathname } from "next/navigation";

// ──────────────────────────────────────────────────────────────────────────────
// Fallback data — always shown if API is slow / fails
// ──────────────────────────────────────────────────────────────────────────────
const FALLBACK_NAMES = [
    "Axmed C.", "Fadumo M.", "Cabdullahi Y.", "Xaawo I.", "Maxamed H.",
    "Saciid A.", "Asha D.", "Yuusuf K.", "Hodan F.", "Cali O.",
    "Nasteexo B.", "Ibraahim S.", "Amina J.", "Osman A.", "Maryan C.",
    "Cabdi R.", "Sucaad N.", "Mahad L.", "Faadumo X.", "Bashiir W.",
];

const ACTIVITIES: { text: string; emoji: string; icon: React.ReactNode }[] = [
    {
        text: "ayaa hadda ku biirtay Garaad!",
        emoji: "🚀",
        icon: <Rocket className="w-5 h-5 text-primary" />,
    },
    {
        text: "ayaa bilaabay koorsada Full-Stack!",
        emoji: "💻",
        icon: <BookOpen className="w-5 h-5 text-emerald-500" />,
    },
    {
        text: "waxay isticmaalaan qorshaha Bilaash!",
        emoji: "⭐",
        icon: <Star className="w-5 h-5 text-yellow-500" />,
    },
    {
        text: "ayaa soo dhammeeyay koorsadii ugu horreysey!",
        emoji: "🎓",
        icon: <GraduationCap className="w-5 h-5 text-primary" />,
    },
    {
        text: "ayaa ku biiray bulshada Garaad!",
        emoji: "🤝",
        icon: <Users className="w-5 h-5 text-blue-500" />,
    },
];

const SESSION_KEY = "garaad_sp_count";
const MAX_PER_SESSION = 12;
const INITIAL_DELAY_MS = 3_000;    // Show first toast after 3s
const MIN_INTERVAL_MS = 12_000;    // Minimum interval between toasts
const MAX_INTERVAL_MS = 18_000;    // Maximum interval between toasts
const VISIBLE_DURATION_MS = 8_000; // How long each toast stays visible

// ──────────────────────────────────────────────────────────────────────────────

interface Toast {
    name: string;
    flag?: string;
    activity: typeof ACTIVITIES[number];
}

function randomItem<T>(arr: T[]): T {
    return arr[Math.floor(Math.random() * arr.length)];
}

function buildToast(backendData: any[]): Toast {
    if (backendData.length > 0) {
        const item = randomItem(backendData);
        return {
            name: `${item.first_name} ${item.last_name ? item.last_name[0] + "." : ""}`.trim(),
            flag: item.country_flag,
            activity: randomItem(ACTIVITIES),
        };
    }
    return {
        name: randomItem(FALLBACK_NAMES),
        activity: randomItem(ACTIVITIES),
    };
}

export function SocialProof() {
    const { user } = useAuthStore();
    const pathname = usePathname();
    const [toast, setToast] = useState<Toast | null>(null);
    const [visible, setVisible] = useState(false);
    const [dismissed, setDismissed] = useState(false);
    const backendNamesRef = useRef<string[]>([]);
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    // Only show on landing + welcome pages, and only to guests
    const normalizedPath = pathname?.replace(/\/$/, "") || "/";
    const isAllowedPage = normalizedPath === "" || normalizedPath === "/" || normalizedPath === "/welcome";
    const shouldShow = !user && isAllowedPage;

    // Fetch real names once from backend (best-effort)
    useEffect(() => {
        if (!shouldShow) return;
        fetch(`${baseURL}/api/public/social-proof/`)
            .then((r) => r.ok ? r.json() : [])
            .then((data) => {
                if (Array.isArray(data) && data.length > 0) {
                    backendNamesRef.current = data;
                }
            })
            .catch(() => {/* silently use fallback */ });
    }, [shouldShow]);

    const showToast = useCallback(() => {
        const count = parseInt(sessionStorage.getItem(SESSION_KEY) || "0");
        if (count >= MAX_PER_SESSION) return;

        setToast(buildToast(backendNamesRef.current));
        setVisible(true);
        sessionStorage.setItem(SESSION_KEY, (count + 1).toString());

        // Auto-hide after VISIBLE_DURATION_MS
        if (timerRef.current) clearTimeout(timerRef.current);
        timerRef.current = setTimeout(() => setVisible(false), VISIBLE_DURATION_MS);
    }, []);

    // Scheduling loop
    useEffect(() => {
        if (!shouldShow) return;

        let stopped = false;

        const schedule = (delay: number) => {
            timerRef.current = setTimeout(() => {
                if (stopped) return;
                showToast();
                // Schedule next
                const interval = MIN_INTERVAL_MS + Math.random() * (MAX_INTERVAL_MS - MIN_INTERVAL_MS);
                schedule(VISIBLE_DURATION_MS + interval); // wait until current is hidden + gap
            }, delay);
        };

        schedule(INITIAL_DELAY_MS);

        return () => {
            stopped = true;
            if (timerRef.current) clearTimeout(timerRef.current);
        };
    }, [shouldShow, showToast]);

    if (!shouldShow || !toast || dismissed) return null;

    return (
        <div
            className={cn(
                "fixed bottom-8 left-4 sm:left-8 z-[60] max-w-[340px] sm:max-w-[380px] transition-all duration-500 ease-out",
                visible
                    ? "translate-y-0 opacity-100 scale-100 pointer-events-auto"
                    : "translate-y-6 opacity-0 scale-95 pointer-events-none"
            )}
            role="status"
            aria-live="polite"
        >
            <div className="relative flex items-start gap-4 p-4 sm:p-5 rounded-2xl bg-card/98 dark:bg-zinc-900/98 border border-border shadow-2xl shadow-black/20 backdrop-blur-xl ring-1 ring-white/10">
                {/* Avatar */}
                <div className="flex-shrink-0 w-11 h-11 rounded-full bg-primary/10 border-2 border-primary/20 flex items-center justify-center shadow-md">
                    {toast.activity.icon}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0 pr-5">
                    <p className="text-sm font-black text-foreground leading-snug">
                        <span className="text-primary">{toast.name}</span>
                        {toast.flag && <span className="ml-1.5 text-base" title="Country Flag">{toast.flag}</span>}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5 font-bold leading-relaxed">
                        {toast.activity.emoji} {toast.activity.text}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                        <span className="text-[10px] font-black text-primary uppercase tracking-wide">
                            Garaad
                        </span>
                    </div>
                </div>

                {/* Dismiss button */}
                <button
                    onClick={() => {
                        setVisible(false);
                        setDismissed(true);
                    }}
                    className="absolute top-3 right-3 w-6 h-6 rounded-full flex items-center justify-center text-muted-foreground/50 hover:text-muted-foreground hover:bg-muted transition-colors"
                    aria-label="Xir"
                >
                    <X className="w-3.5 h-3.5" />
                </button>

                {/* Pulse dot */}
                <div className="absolute -top-1 -right-1 w-3 h-3">
                    <span className="absolute inset-0 rounded-full bg-emerald-500 animate-ping opacity-75" />
                    <span className="absolute inset-0 rounded-full bg-emerald-500" />
                </div>
            </div>
        </div>
    );
}
