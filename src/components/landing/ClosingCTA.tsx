"use client";

import Link from "next/link";
import { useAuthStore } from "@/store/useAuthStore";
import { Rocket } from "lucide-react";

export function ClosingCTA() {
    const { user } = useAuthStore();
    const isAuthenticated = !!user;

    const ctaHref = isAuthenticated ? "/courses" : "/welcome";

    return (
        <section className="relative py-20 md:py-32 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 dark:from-black dark:via-slate-950 dark:to-black overflow-hidden">
            {/* Animated Background */}
            <div className="absolute inset-0">
                <div className="absolute top-1/4 -left-48 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse-slow" />
                <div className="absolute bottom-1/4 -right-48 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse-slow delay-1000" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-500/10 rounded-full blur-3xl animate-float" />
            </div>

            {/* Grid Pattern */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.02)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_80%)]" />

            <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                {/* Icon */}
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/20 border-2 border-primary/30 mb-8 animate-float">
                    <Rocket className="w-10 h-10 text-primary" />
                </div>

                {/* Headline */}
                <h2 className="text-4xl sm:text-5xl md:text-6xl font-black mb-8 text-white">
                    Ma diyaar u tahay inaad{" "}
                    <span className="bg-gradient-to-r from-primary via-blue-500 to-purple-500 bg-clip-text text-transparent">
                        bilowdo?
                    </span>
                </h2>

                {/* Body */}
                <p className="text-xl md:text-2xl text-slate-400 max-w-2xl mx-auto mb-8">
                    Challenge: 4–6 toddobaad oo mentorship, €149 hal bixi (4x sannadkii). Koorsooyinka joogta ah waxaad ka heli kartaa <strong className="text-white">Explorer</strong> (€29/bil).
                </p>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <Link
                        href="/subscribe"
                        className="group relative inline-block px-10 py-5 bg-primary hover:bg-primary/90 text-white text-xl font-black rounded-2xl transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-primary/50"
                    >
                        <span>HEL EXPLORER — €29/BIL</span>
                    </Link>
                    <Link
                        href={ctaHref}
                        className="px-10 py-5 bg-white/5 hover:bg-white/10 text-white text-lg font-bold rounded-2xl border border-white/20 transition-all duration-300"
                    >
                        {isAuthenticated ? "BILOW KOORSOOYINKA" : "BILOW BILAASH AH"}
                    </Link>
                </div>
            </div>
        </section>
    );
}
