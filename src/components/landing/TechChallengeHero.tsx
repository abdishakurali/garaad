"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { ArrowRight, Sparkles } from "lucide-react";

export function TechChallengeHero() {
    const router = useRouter();
    const { isAuthenticated } = useSelector((state: RootState) => state.auth);
    const [timeLeft, setTimeLeft] = useState({
        weeks: 5,
        days: 0,
        hours: 0,
        minutes: 0,
    });

    useEffect(() => {
        // Calculate time until challenge starts (example: 5 weeks from now)
        const calculateTimeLeft = () => {
            const now = new Date();
            const challengeStart = new Date(now.getTime() + 5 * 7 * 24 * 60 * 60 * 1000);
            const difference = challengeStart.getTime() - now.getTime();

            if (difference > 0) {
                setTimeLeft({
                    weeks: Math.floor(difference / (1000 * 60 * 60 * 24 * 7)),
                    days: Math.floor((difference / (1000 * 60 * 60 * 24)) % 7),
                    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                    minutes: Math.floor((difference / 1000 / 60) % 60),
                });
            }
        };

        calculateTimeLeft();
        const timer = setInterval(calculateTimeLeft, 60000); // Update every minute

        return () => clearInterval(timer);
    }, []);

    const handlePrimaryCTA = () => {
        if (isAuthenticated) {
            router.push("/courses");
        } else {
            router.push("/welcome");
        }
    };

    const handleSecondaryCTA = () => {
        // Scroll to story section
        const storySection = document.getElementById("our-story");
        if (storySection) {
            storySection.scrollIntoView({ behavior: "smooth" });
        }
    };

    return (
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 dark:from-black dark:via-slate-950 dark:to-black">
            {/* Animated Background */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-1/4 -left-48 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse-slow" />
                <div className="absolute bottom-1/4 -right-48 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse-slow delay-1000" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-500/5 rounded-full blur-3xl animate-float" />
            </div>

            {/* Grid Pattern Overlay */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.02)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_80%)]" />

            {/* Content */}
            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
                {/* Badge */}
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 backdrop-blur-sm mb-8 animate-fade-in">
                    <Sparkles className="w-4 h-4 text-primary" />
                    <span className="text-sm font-bold text-primary uppercase tracking-wider">
                        5-Week Tech Challenge | Tartanka Tech-ga
                    </span>
                </div>

                {/* Main Headline */}
                <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black mb-6 animate-fade-in-up">
                    <span className="text-white">Bilow SaaS-kaaga</span>
                    <br />
                    <span className="bg-gradient-to-r from-primary via-blue-500 to-purple-500 bg-clip-text text-transparent">
                        Online Business
                    </span>
                    <br />
                    <span className="text-white">in 5 Weeks</span>
                </h1>

                {/* Sub-headline */}
                <p className="text-lg sm:text-xl md:text-2xl text-slate-300 max-w-4xl mx-auto mb-12 leading-relaxed animate-fade-in-up delay-200">
                    Ma diyaar u tahay inaad fikradahaaga u beddesho dakhli adigoo dhisaya SaaS?
                    We give you clear steps, expert guidance, and a proven plan—
                    <span className="text-white font-semibold">tallaabo tallaabo ah (step-by-step)</span>.
                </p>

                {/* Countdown Timer */}
                <div className="flex items-center justify-center gap-4 sm:gap-6 mb-12 animate-fade-in-up delay-300">
                    {[
                        { label: "Toddobaad", labelEn: "Weeks", value: timeLeft.weeks },
                        { label: "Maalmood", labelEn: "Days", value: timeLeft.days },
                        { label: "Saacadood", labelEn: "Hours", value: timeLeft.hours },
                        { label: "Daqiiqado", labelEn: "Minutes", value: timeLeft.minutes },
                    ].map((item, index) => (
                        <div
                            key={item.label}
                            className="flex flex-col items-center p-4 sm:p-6 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 min-w-[80px] sm:min-w-[100px]"
                        >
                            <div className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-1">
                                {String(item.value).padStart(2, "0")}
                            </div>
                            <div className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-wider text-center">
                                {item.label}
                                <br />
                                <span className="text-[8px] opacity-70">{item.labelEn}</span>
                            </div>
                        </div>
                    ))}
                </div>

                {/* CTAs */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up delay-400">
                    <button
                        onClick={handlePrimaryCTA}
                        className="group relative px-8 py-4 bg-primary hover:bg-primary/90 text-white font-bold rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-primary/50 flex items-center gap-2"
                    >
                        <span>Ku Biir Hadda (Join Today)</span>
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </button>
                    <button
                        onClick={handleSecondaryCTA}
                        className="px-8 py-4 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white font-bold rounded-xl border border-white/20 transition-all duration-300 hover:scale-105"
                    >
                        Sidee u Shaqaynayaa?
                    </button>
                </div>

                {/* Social Proof */}
                <div className="mt-16 flex flex-col sm:flex-row items-center justify-center gap-8 text-slate-400 animate-fade-in-up delay-500">
                    <div className="flex items-center gap-2">
                        <div className="flex -space-x-2">
                            {[1, 2, 3, 4].map((i) => (
                                <div
                                    key={i}
                                    className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-purple-500 border-2 border-slate-900"
                                />
                            ))}
                        </div>
                        <span className="text-sm font-medium">
                            <span className="text-white font-bold">500+</span> builders joined | builders ku biiray
                        </span>
                    </div>
                    <div className="hidden sm:block w-px h-6 bg-slate-700" />
                    <div className="flex items-center gap-2">
                        <div className="flex gap-1">
                            {[1, 2, 3, 4, 5].map((i) => (
                                <svg
                                    key={i}
                                    className="w-5 h-5 text-yellow-500 fill-current"
                                    viewBox="0 0 20 20"
                                >
                                    <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                                </svg>
                            ))}
                        </div>
                        <span className="text-sm font-medium">
                            <span className="text-white font-bold">4.9/5</span> average rating
                        </span>
                    </div>
                </div>
            </div>

            {/* Scroll Indicator */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
                <div className="w-6 h-10 rounded-full border-2 border-white/30 flex items-start justify-center p-2">
                    <div className="w-1 h-3 rounded-full bg-white/50" />
                </div>
            </div>
        </section>
    );
}
