"use client";

import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { Rocket, ArrowRight, Sparkles } from "lucide-react";

export function ClosingCTA() {
    const router = useRouter();
    const { isAuthenticated } = useSelector((state: RootState) => state.auth);

    const handleCTA = () => {
        if (isAuthenticated) {
            router.push("/courses");
        } else {
            router.push("/welcome");
        }
    };

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
                <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black mb-6 text-white text-center">
                    Ma diyaar u tahay inaad gasho{" "}
                    <br className="hidden md:block" />
                    <span className="bg-gradient-to-r from-primary via-blue-500 to-purple-500 bg-clip-text text-transparent">
                        Maqaamka? (Lead)
                    </span>
                </h2>

                {/* Body */}
                <p className="text-xl md:text-2xl text-slate-300 max-w-3xl mx-auto mb-12 leading-relaxed">
                    Ku biir dhalinyarada Soomaaliyeed ee dhisaya mustaqbalka AI. 🚀
                </p>

                {/* Stats */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-8 mb-12">
                    <div className="text-center">
                        <div className="text-4xl md:text-5xl font-black text-white mb-2">
                            500+
                        </div>
                        <div className="text-[10px] md:text-xs text-slate-400 uppercase tracking-wider font-bold">
                            Builders Tartamay
                        </div>
                    </div>
                    <div className="hidden sm:block w-px h-16 bg-slate-700" />
                    <div className="text-center">
                        <div className="text-4xl md:text-5xl font-black text-white mb-2">
                            $50K+
                        </div>
                        <div className="text-[10px] md:text-xs text-slate-400 uppercase tracking-wider font-bold">
                            Dakhli la Abuuray
                        </div>
                    </div>
                    <div className="hidden sm:block w-px h-16 bg-slate-700" />
                    <div className="text-center">
                        <div className="text-4xl md:text-5xl font-black text-white mb-2">
                            5 Weeks
                        </div>
                        <div className="text-[10px] md:text-xs text-slate-400 uppercase tracking-wider font-bold">
                            Ilaa SaaS-kaaga
                        </div>
                    </div>
                </div>

                {/* CTA Button */}
                <button
                    onClick={handleCTA}
                    className="group relative inline-flex items-center gap-3 px-10 py-5 bg-primary hover:bg-primary/90 text-white text-lg font-bold rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-primary/50"
                >
                    <Sparkles className="w-6 h-6" />
                    <span>Bilow Safarkaaga (Start Journey)</span>
                    <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                </button>

                {/* Trust Indicators */}
                <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-6 text-slate-400 text-sm">
                    <div className="flex items-center gap-2">
                        <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span>Bilaash ku bilow</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span>Is-diiwaangelin degdeg ah</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span>Access nolol-ka-nolol ah</span>
                    </div>
                </div>
            </div>
        </section>
    );
}
