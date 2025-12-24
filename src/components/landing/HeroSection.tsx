"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "@/store/features/authSlice";
import { Sparkles, Zap, Trophy, Star } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

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

            <div className="relative z-10 max-w-4xl mx-auto py-10 text-center space-y-12">
                {/* Main Content */}
                <div className="space-y-8">
                    {/* Headline */}
                    <h1 className="text-6xl sm:text-8xl lg:text-6xl font-black text-foreground leading-[1.1] tracking-tight flex flex-wrap items-center justify-center gap-x-4 sm:gap-x-8">
                        <span className="whitespace-nowrap">Ku baro Sameyn</span>
                        <span className="inline-block relative  ">
                            <AnimatePresence mode="wait">
                                <motion.span
                                    key={cycleTexts[activeIndex]}
                                    initial={{ y: 20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    exit={{ y: -20, opacity: 0 }}
                                    transition={{ duration: 0.5, ease: "easeOut" }}
                                    className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-blue-600 to-indigo-500 inline-block"
                                >
                                    {cycleTexts[activeIndex]}
                                </motion.span>
                            </AnimatePresence>
                        </span>
                    </h1>

                    {/* Description */}
                    <p className="text-xl sm:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed font-medium">
                        Ku baro <span className="text-foreground">Xisaabta, Fiisikiska, iyo Tiknoolajiyadda</span> afkaaga hooyo. Casharo heer sare ah oo loo diyaariyay ardayda Soomaaliyeed meel kasta oo ay joogaan.
                    </p>
                </div>

                {/* CTAs */}
                <div className="flex justify-center">
                    <Button
                        size="lg"
                        className="w-full sm:w-auto text-xl px-16 py-8 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground font-extrabold shadow-[0_0_20px_rgba(var(--primary-rgb),0.3)] hover:shadow-[0_0_30px_rgba(var(--primary-rgb),0.5)] transition-all transform hover:-translate-y-1"
                        onClick={() => router.push(isAuthenticated ? "/courses" : "/welcome")}
                    >
                        {isAuthenticated ? "Koorsooyinka" : "Bilow Hadda"}
                    </Button>
                </div>


            </div>
        </section>
    );
}
