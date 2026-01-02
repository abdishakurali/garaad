"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "@/store/features/authSlice";
import { Sparkles, Zap, Trophy, Star, Github } from "lucide-react";
import { useState, useEffect } from "react";

export function HeroSection() {
    const router = useRouter();
    const user = useSelector(selectCurrentUser);
    const isAuthenticated = !!user;

    const [activeIndex, setActiveIndex] = useState(0);
    const cycleTexts = ["Xisaab", "AI", "Fiisikis", "Tiknoolajiyad"];

    useEffect(() => {
        const interval = setInterval(() => {
            setActiveIndex((current) => (current + 1) % cycleTexts.length);
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    return (
        <section className="relative min-h-[90vh] flex items-center justify-center bg-background px-4 overflow-hidden">
            {/* Advanced background elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 dark:bg-primary/10 rounded-full blur-[120px] animate-pulse-slow" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/20 dark:bg-blue-500/10 rounded-full blur-[120px] animate-pulse-slow" style={{ animationDelay: '1.5s' }} />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,rgba(var(--primary-rgb),0.05)_0%,transparent_70%)]" />

                {/* Floating particles/sparkles effect */}
                <div className="absolute inset-0 opacity-20 dark:opacity-40">
                    <div className="absolute top-1/4 left-1/4 w-1 h-1 bg-primary rounded-full animate-sparkle" />
                    <div className="absolute top-3/4 left-1/3 w-1.5 h-1.5 bg-secondary rounded-full animate-sparkle" style={{ animationDelay: '2s' }} />
                    <div className="absolute top-1/2 right-1/4 w-1 h-1 bg-blue-400 rounded-full animate-sparkle" style={{ animationDelay: '4s' }} />
                </div>
            </div>


            <div className="relative z-10 max-w-5xl mx-auto py-6 sm:py-10 text-center space-y-8 sm:space-y-12">


                {/* Main Content */}
                <div className="space-y-6 sm:space-y-8 px-4 sm:px-0">
                    {/* Headline */}
                    <h1 className="text-4xl sm:text-7xl lg:text-8xl font-black text-foreground leading-[1.2] sm:leading-[1.1] tracking-tight flex flex-col sm:block items-center justify-center gap-x-4">
                        <span className="whitespace-nowrap">Ku baro Sameyn</span>
                        <span className="hidden sm:inline-block mx-3"></span>
                        <span className="inline-block relative mt-1 sm:mt-0">
                            <span className="absolute -inset-1 blur-2xl bg-gradient-to-r from-primary/30 to-blue-600/30 opacity-50"></span>
                            <span
                                key={cycleTexts[activeIndex]}
                                className="relative text-transparent bg-clip-text bg-gradient-to-r from-primary via-blue-600 to-indigo-500 inline-block animate-in fade-in slide-in-from-bottom-2 duration-300"
                            >
                                {cycleTexts[activeIndex]}
                            </span>
                        </span>
                    </h1>

                    {/* Description */}
                    <p className="text-base sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed font-medium px-4">
                        Barashada <span className="text-foreground font-semibold">Xisaabta iyo Tiknoolajiyadda</span> afkaaga hooyo.
                    </p>
                </div>

                {/* CTAs */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 px-4 pt-4">
                    <Button
                        size="lg"
                        className="w-full sm:w-auto text-lg h-14 px-8 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold shadow-lg hover:shadow-primary/25 transition-all transform hover:-translate-y-1"
                        onClick={() => router.push(isAuthenticated ? "/courses" : "/welcome")}
                    >
                        {isAuthenticated ? "Sii wad Barashada" : "Bilow Hadda "}
                    </Button>



                </div>

            </div>
        </section>
    );
}
