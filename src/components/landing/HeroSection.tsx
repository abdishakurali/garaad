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
        <section className="relative min-h-[90vh] flex items-center justify-center bg-white dark:bg-slate-950 px-4 overflow-hidden">
            {/* Advanced background elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/10 rounded-full blur-[120px]" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,rgba(var(--primary-rgb),0.03)_0%,transparent_70%)]" />
            </div>

            {/* Floating Icons Animation */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-[15%] left-[10%] animate-bounce delay-1000 opacity-20">
                    <Sparkles className="w-12 h-12 text-yellow-400" />
                </div>
                <div className="absolute top-[25%] right-[15%] animate-pulse delay-700 opacity-20">
                    <Zap className="w-10 h-10 text-blue-500" />
                </div>
                <div className="absolute bottom-[20%] left-[15%] animate-bounce delay-500 opacity-20">
                    <Trophy className="w-14 h-14 text-primary" />
                </div>
                <div className="absolute bottom-[30%] right-[10%] animate-pulse delay-200 opacity-20">
                    <Star className="w-8 h-8 text-purple-500" />
                </div>
            </div>

            <div className="relative z-10 max-w-5xl mx-auto py-10 text-center space-y-12">

                {/* Community Badge */}
                <div className="flex justify-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50/50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 backdrop-blur-sm cursor-pointer hover:bg-blue-100/50 transition-colors"
                        onClick={() => window.open('https://github.com/StartUp-Somalia/garaad', '_blank')}>
                        <Github className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                        <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
                            Proudly Open Source | Star us on GitHub
                        </span>
                    </div>
                </div>

                {/* Main Content */}
                <div className="space-y-8 px-4 sm:px-0">
                    {/* Headline */}
                    <h1 className="text-5xl sm:text-7xl lg:text-8xl font-black text-foreground leading-[1.1] tracking-tight flex flex-col sm:block items-center justify-center gap-x-4">
                        <span className="whitespace-nowrap">Ku baro Sameyn</span>
                        <span className="hidden sm:inline-block mx-3"></span>
                        <span className="inline-block relative mt-2 sm:mt-0">
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
                    <p className="text-lg sm:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed font-medium px-4">
                        Ku baro <span className="text-foreground font-semibold">Xisaabta, Fiisikiska, iyo Tiknoolajiyadda</span> afkaaga hooyo.
                        Casharo heer sare ah oo u furan ardayda iyo horumariyeyaasha.
                    </p>
                </div>

                {/* CTAs */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 px-4 pt-4">
                    <Button
                        size="lg"
                        className="w-full sm:w-auto text-lg h-14 px-8 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold shadow-lg hover:shadow-primary/25 transition-all transform hover:-translate-y-1"
                        onClick={() => router.push(isAuthenticated ? "/courses" : "/welcome")}
                    >
                        {isAuthenticated ? "Sii wad Barashada" : "Bilow Hadda - Waa Bilaash"}
                    </Button>

                    <Button
                        variant="outline"
                        size="lg"
                        className="w-full sm:w-auto text-lg h-14 px-8 rounded-full border-2 hover:bg-secondary/50 font-semibold gap-2 transition-all transform hover:-translate-y-1 backdrop-blur-sm"
                        onClick={() => window.open('https://github.com/StartUp-Somalia/garaad', '_blank')}
                    >
                        <Github className="w-5 h-5" />
                        Contribute
                    </Button>
                </div>

            </div>
        </section>
    );
}
