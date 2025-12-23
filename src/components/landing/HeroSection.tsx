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

            <div className="relative z-10 max-w-4xl mx-auto py-20 text-center space-y-12">
                {/* Main Content */}
                <div className="space-y-8">
                    {/* Premium Badge */}
                    <div className="flex justify-center">
                        <motion.a
                            href="https://saas.garaad.org"
                            target="_blank"
                            rel="noopener noreferrer"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="group relative inline-flex items-center gap-3 px-1 py-1 pr-6 rounded-full bg-slate-900 text-white border border-white/10 hover:border-primary/50 transition-all shadow-xl"
                        >
                            <span className="flex items-center justify-center p-2 bg-primary rounded-full group-hover:bg-primary/90 transition-colors">
                                <Sparkles size={14} className="text-white animate-pulse" />
                            </span>
                            <div className="flex flex-col items-start leading-tight">
                                <span className="text-[10px] uppercase tracking-widest text-primary font-black">SaaS Challenge</span>
                                <span className="text-xs font-bold">Ku biir 5 toddobaadka SaaS challenge-ka</span>
                            </div>
                            <div className="ml-2 pl-4 border-l border-white/10 text-[10px] font-mono text-slate-400 group-hover:text-primary transition-colors">
                                saas.garaad.org
                            </div>
                        </motion.a>
                    </div>

                    {/* Headline */}
                    <h1 className="text-6xl sm:text-7xl lg:text-8xl font-black text-foreground leading-[1.1] tracking-tight">
                        Noqo Garaadka <br />
                        <span className="inline-block relative min-w-[280px]">
                            <AnimatePresence mode="wait">
                                <motion.span
                                    key={cycleTexts[activeIndex]}
                                    initial={{ y: 20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    exit={{ y: -20, opacity: 0 }}
                                    transition={{ duration: 0.5, ease: "easeOut" }}
                                    className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-blue-600 to-indigo-500"
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

                {/* Iconic Visual Element (Instead of photo) */}
                <div className="pt-16 flex justify-center gap-12 opacity-40 grayscale hover:grayscale-0 transition-all duration-500">
                    <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 hover:bg-primary/10 transition-colors cursor-help">
                        <Zap size={32} className="text-primary" />
                    </div>
                    <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 hover:bg-primary/10 transition-colors cursor-help">
                        <Trophy size={32} className="text-primary" />
                    </div>
                    <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 hover:bg-primary/10 transition-colors cursor-help">
                        <Star size={32} className="text-primary" />
                    </div>
                </div>
            </div>
        </section>
    );
}
