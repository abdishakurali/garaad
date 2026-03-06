"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import { Sparkles, Play } from "lucide-react";
import { Reveal } from "./Reveal";
import { Atom, Cpu, Database, Code2, Layers, Binary } from "lucide-react";

const TechIcon = ({
  icon: Icon,
  color,
  className,
  delay = "0s",
}: {
  icon: React.ComponentType<{ size?: number; className?: string; strokeWidth?: number }>;
  color: string;
  className: string;
  delay?: string;
}) => (
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
      {/* Background — clean gradient blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-5%] left-[-5%] w-[30%] h-[30%] bg-primary/20 dark:bg-primary/10 rounded-full blur-[100px] animate-pulse-slow" />
        <div
          className="absolute bottom-[-5%] right-[-5%] w-[30%] h-[30%] bg-blue-500/20 dark:bg-blue-500/10 rounded-full blur-[100px] animate-pulse-slow"
          style={{ animationDelay: "1.5s" }}
        />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(168,85,247,0.08)_0%,transparent_70%)] dark:bg-[radial-gradient(circle_at_50%_50%,rgba(168,85,247,0.05)_0%,transparent_70%)]" />

        {/* Floating vector tech icons — clean and fresh */}
        <TechIcon icon={Atom} color="text-blue-400" className="top-20 left-[10%]" delay="0s" />
        <TechIcon icon={Cpu} color="text-emerald-400" className="bottom-40 left-[15%]" delay="1s" />
        <TechIcon icon={Database} color="text-green-500" className="top-40 right-[15%]" delay="2s" />
        <TechIcon icon={Binary} color="text-purple-400" className="bottom-20 right-[10%]" delay="3s" />
        <TechIcon icon={Layers} color="text-primary" className="top-1/2 left-1/4 -translate-y-1/2" delay="4s" />
        <TechIcon icon={Code2} color="text-blue-500" className="top-2/3 right-1/4" delay="5s" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto py-6 sm:py-10 text-center space-y-8 sm:space-y-10">
        <div className="space-y-6 sm:space-y-8 px-4 sm:px-0">
          <Reveal>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary animate-in fade-in slide-in-from-top-4 duration-700">
              <Sparkles className="w-4 h-4 animate-pulse" />
              <span className="text-[10px] sm:text-xs font-black uppercase tracking-[0.2em]">
                Jiilka Cusub ee STEM
              </span>
            </div>
          </Reveal>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-foreground leading-[1.1] tracking-tight">
            <span className="block mt-2">
              Baro Full-Stack{" "}
              <span className="relative inline-block">
                <span className="absolute -inset-2 sm:-inset-3 blur-2xl bg-gradient-to-r from-primary/30 to-blue-600/30 opacity-50" />
                <span className="relative text-transparent bg-clip-text bg-gradient-to-r from-primary via-emerald-500 to-primary">
                  Development & AI
                </span>
              </span>
            </span>
          </h1>

          <p className="text-sm sm:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed font-medium">
            React, Next.js, AI & STEM — Af-Soomaali. Baro si habboon. Bilaash bilow.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
          <Button
            size="lg"
            className="w-full sm:w-auto text-base h-12 px-8 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold shadow-lg shadow-primary/20 transition-all hover:-translate-y-0.5"
            onClick={() => router.push(isAuthenticated ? "/courses" : "/welcome")}
          >
            <Play className="w-4 h-4 mr-2" />
            {isAuthenticated ? "Sii wad Barashada" : "Ku Soo Biir"}
          </Button>
        </div>
      </div>
    </section>
  );
}
