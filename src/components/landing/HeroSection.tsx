"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import { Sparkles, Download, Play } from "lucide-react";
import { Reveal } from "./Reveal";
import { Atom, Cpu, Database, Binary, Code2, Layers } from "lucide-react";

const TechIcon = ({ icon: Icon, color, className, delay = "0s" }: any) => (
    <div
        className={`absolute opacity-10 dark:opacity-20 animate-float pointer-events-none ${className}`}
        style={{ animationDelay: delay }}
    >
        <Icon size={120} className={color} strokeWidth={0.5} />
    </div>
);

export function HeroSection() {
    const router = useRouter();
    const { user } = useAuthStore();
    const isAuthenticated = !!user;

    return (
        <section className="relative min-h-[90vh] flex items-center justify-center bg-background px-4 overflow-hidden">
            {/* Advanced background elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-5%] left-[-5%] w-[30%] h-[30%] bg-primary/20 dark:bg-primary/10 rounded-full blur-[100px] animate-pulse-slow" />
                <div
                    className="absolute bottom-[-5%] right-[-5%] w-[30%] h-[30%] bg-blue-500/20 dark:bg-blue-500/10 rounded-full blur-[100px] animate-pulse-slow"
                    style={{ animationDelay: "1.5s" }}
                />

                {/* Subtle Radial Gradient - Light Purple */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(168,85,247,0.15)_0%,transparent_100%)] dark:bg-[radial-gradient(circle_at_50%_50%,rgba(168,85,247,0.1)_0%,transparent_100%)]" />

                {/* Grid Pattern Overlay with Mask */}
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.02] dark:opacity-[0.04] [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_100%)]" />

                {/* Floating particles/sparkles effect */}
                <div className="absolute inset-0 opacity-30 dark:opacity-50">
                    <div className="absolute top-1/4 left-1/4 w-1.5 h-1.5 bg-primary rounded-full animate-sparkle" />
                    <div
                        className="absolute top-3/4 left-1/3 w-2 h-2 bg-secondary rounded-full animate-sparkle"
                        style={{ animationDelay: "2s" }}
                    />
                    <div
                        className="absolute top-1/2 right-1/4 w-1.5 h-1.5 bg-blue-400 rounded-full animate-sparkle"
                        style={{ animationDelay: "4s" }}
                    />
                    <div
                        className="absolute top-1/3 right-1/3 w-1 h-1 bg-purple-500 rounded-full animate-sparkle"
                        style={{ animationDelay: "3s" }}
                    />
                </div>

                {/* Animated Tech Icons */}
                <TechIcon icon={Atom} color="text-blue-400" className="top-20 left-[10%]" delay="0s" />
                <TechIcon icon={Cpu} color="text-emerald-400" className="bottom-40 left-[15%]" delay="1s" />
                <TechIcon icon={Database} color="text-green-500" className="top-40 right-[15%]" delay="2s" />
                <TechIcon icon={Binary} color="text-purple-400" className="bottom-20 right-[10%]" delay="3s" />
                <TechIcon icon={Layers} color="text-primary" className="top-1/2 left-1/4 -translate-y-1/2" delay="4s" />
                <TechIcon icon={Code2} color="text-blue-500" className="top-2/3 right-1/4" delay="5s" />
            </div>

            <div className="relative z-10 max-w-5xl mx-auto py-6 sm:py-10 text-center space-y-8 sm:space-y-12">
                {/* Main Content */}
                <div className="space-y-6 sm:space-y-10 px-4 sm:px-0">
                    {/* Badge */}
                    <Reveal>
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 glassmorphism animate-in fade-in slide-in-from-top-4 duration-1000">
                            <Sparkles className="w-4 h-4 text-primary animate-pulse" />
                            <span className="text-[10px] sm:text-xs font-black uppercase tracking-[0.2em] text-primary">
                                Jiilka Cusub ee STEM
                            </span>
                        </div>
                    </Reveal>

                    {/* Headline */}
                    <h1 className="text-4xl sm:text-5xl lg:text-7xl font-black text-foreground leading-[1.1] tracking-tight">
                        <span className="block mt-2 font-black transition-all duration-500">
                            Noqo Developer{" "}
                            <span className="relative inline-block">
                                <span className="absolute -inset-4 blur-3xl bg-gradient-to-r from-primary/40 to-blue-600/40 opacity-40" />
                                <span className="relative text-transparent bg-clip-text bg-gradient-to-r from-primary via-emerald-500 to-primary">
                                    Heer Caalami ah
                                </span>
                            </span>
                        </span>
                    </h1>

                    {/* Description */}
                    <p className="text-sm sm:text-lg lg:text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed font-medium px-4">
                        Ka dhis mustaqbalkaaga Garaad. Baro <span className="text-foreground font-bold">Frontend (React), Backend (Node.js),</span> iyo <span className="text-foreground font-bold">Mobile Apps</span> adiga oo isticmaalaya Af-Soomaali. Ku biir kumanaan dhalinyaro ah oo dhisaya Startups-ka berrito—<span className="text-primary font-bold">macalin la'aan.</span>
                    </p>
                </div>

                {/* CTAs */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 px-4 pt-4">
                    <Button
                        size="lg"
                        className="w-full sm:w-auto text-lg h-14 px-12 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground font-black shadow-lg shadow-primary/25 hover:shadow-2xl hover:shadow-primary/40 transition-all duration-300 transform hover:-translate-y-1.5 active:scale-95 group overflow-hidden"
                        onClick={() => router.push(isAuthenticated ? "/courses" : "/welcome")}
                    >
                        <Play className="w-5 h-5 mr-3 group-hover:animate-pulse" />
                        <span>{isAuthenticated ? "Sii wad Barashada" : "KU SOO BIIR"}</span>
                    </Button>
                </div>
            </div>
        </section>
    );
}
