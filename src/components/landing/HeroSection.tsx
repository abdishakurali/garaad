"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import { Play } from "lucide-react";

export function HeroSection() {
  const router = useRouter();
  const { user } = useAuthStore();
  const isAuthenticated = !!user;

  return (
    <section className="relative min-h-[85vh] flex items-center justify-center bg-background px-4 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] max-w-2xl h-96 bg-primary/10 dark:bg-primary/5 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 max-w-3xl mx-auto py-12 text-center space-y-8">
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-foreground leading-tight tracking-tight">
          Baro Full-Stack & AI{" "}
          <span className="text-primary">oo Soomaali ah</span>
        </h1>
        <p className="text-base sm:text-lg text-muted-foreground max-w-xl mx-auto">
          React, Next.js, AI, Cybersecurity — Af-Soomaali. Bilaash bilow.
        </p>
        <div className="pt-2">
          <Button
            size="lg"
            className="text-base h-12 px-8 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold"
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
