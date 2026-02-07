import React, { useState, useEffect, useCallback, useMemo } from "react";
import { cn } from "@/lib/utils";
import { Users, Rocket, Coins, CheckCircle2, GraduationCap, Heart } from "lucide-react";
import { baseURL } from "@/config";
import { useAuthStore } from "@/store/useAuthStore";
import { usePathname, useSearchParams } from "next/navigation";

interface BackendSignup {
    first_name: string;
    last_name: string;
    date_joined: string;
}

interface Signup {
    name: string;
    activity: string;
    icon: React.ReactNode;
}

const UNIVERSITIES = [
    "Mogadishu University",
    "SIMAD University",
    "Jaamacadda Banaadir",
    "Somali National University",
    "Hormuud University",
    "Jamhuriya University",
    "Zamzam University",
    "Hargeisa University",
    "Amoud University",
    "Puntland State University"
];

const ACTIVITIES = [
    { text: "ayaa hadda ku soo biiray bulshada!", icon: <Users className="w-6 h-6 text-primary" /> },
    { text: "ayaa bilaabay barashada Coding-ka!", icon: <Rocket className="w-6 h-6 text-primary" /> },
    { text: "ayaa helay access-ka Garaad!", icon: <GraduationCap className="w-6 h-6 text-primary" /> },
    { text: "ayaa hadda galay fadhiga waxbarashada!", icon: <CheckCircle2 className="w-6 h-6 text-emerald-500" /> },
    { text: "ayaa noqday Premium User!", icon: <Heart className="w-6 h-6 text-rose-500" /> }
];

const SESSION_LIMIT_KEY = "garaad_social_proof_count";
const MAX_NOTIFICATIONS_PER_SESSION = 10;

export function SocialProof() {
    const { user } = useAuthStore();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [signups, setSignups] = useState<BackendSignup[]>([]);
    const [currentSignup, setCurrentSignup] = useState<Signup | null>(null);
    const [isVisible, setIsVisible] = useState(false);
    const [hasFetched, setHasFetched] = useState(false);

    // Normalize pathname
    const normalizedPath = pathname?.replace(/\/$/, "") || "/";
    const isAllowedPage = normalizedPath === "" || normalizedPath === "/" || normalizedPath === "/welcome";
    const shouldShow = !user && isAllowedPage;

    // Reset logic for developer testing
    useEffect(() => {
        if (searchParams.get("reset_proof") === "true") {
            sessionStorage.removeItem(SESSION_LIMIT_KEY);
        }
    }, [searchParams]);

    const fetchSignups = useCallback(async () => {
        try {
            const response = await fetch(`${baseURL}/api/public/social-proof/`);
            if (response.ok) {
                const data = await response.json();
                setSignups(data);
            }
        } catch (error) {
            console.error("[SocialProof] Error fetching:", error);
        }
    }, []);

    const showNext = useCallback(() => {
        const sessionCount = parseInt(sessionStorage.getItem(SESSION_LIMIT_KEY) || "0");
        if (sessionCount >= MAX_NOTIFICATIONS_PER_SESSION) return;

        if (signups.length === 0) return;

        // Pick a random recent signup
        const randomSignup = signups[Math.floor(Math.random() * signups.length)];
        const randomActivity = ACTIVITIES[Math.floor(Math.random() * ACTIVITIES.length)];

        // Use real names from the backend
        const fullName = `${randomSignup.first_name} ${randomSignup.last_name || ""}`.trim();

        setCurrentSignup({
            name: fullName || "Arday Garaad",
            activity: randomActivity.text,
            icon: randomActivity.icon
        });

        updateStats();

        function updateStats() {
            setIsVisible(true);
            sessionStorage.setItem(SESSION_LIMIT_KEY, (sessionCount + 1).toString());
            setTimeout(() => setIsVisible(false), 8000); // Show for 8 seconds
        }
    }, [signups]);

    useEffect(() => {
        if (!shouldShow) return;

        const initialTimer = setTimeout(() => {
            fetchSignups().then(() => setHasFetched(true));
        }, 8000);

        return () => clearTimeout(initialTimer);
    }, [fetchSignups, shouldShow]);

    useEffect(() => {
        if (!shouldShow || !hasFetched || signups.length === 0) return;

        showNext();

        const interval = setInterval(() => {
            if (!isVisible) showNext();
        }, Math.floor(Math.random() * (90000 - 45000 + 1) + 45000));

        return () => clearInterval(interval);
    }, [hasFetched, signups, showNext, isVisible, shouldShow]);

    if (!shouldShow || !currentSignup) return null;

    return (
        <div
            className={cn(
                "fixed bottom-8 left-8 z-50 transition-all duration-700 ease-out transform pointer-events-none",
                isVisible ? "translate-y-0 opacity-100 scale-100" : "translate-y-16 opacity-0 scale-95"
            )}
        >
            <div className="glassmorphism flex items-center gap-5 p-5 px-6 rounded-3xl bg-card/95 dark:bg-zinc-900/95 border-2 border-primary/20 shadow-[0_20px_50px_rgba(0,0,0,0.3)] max-w-[400px] backdrop-blur-xl ring-1 ring-white/20">
                <div className="flex-shrink-0 w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center border-2 border-primary/20 shadow-xl">
                    {currentSignup.icon}
                </div>
                <div className="flex flex-col min-w-0">
                    <p className="text-sm font-black text-foreground leading-tight flex items-center gap-2">
                        <span className="text-primary tracking-tight">🎯 {currentSignup.name}</span>
                    </p>
                    <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed font-bold">
                        {currentSignup.activity}
                    </p>
                </div>
            </div>
        </div>
    );
}
