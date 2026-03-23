"use client";

import Link from "next/link";
import { useAuthStore } from "@/store/useAuthStore";
import { Rocket } from "lucide-react";

export function ClosingCTA() {
    const { user } = useAuthStore();
    const isAuthenticated = !!user;

    const ctaHref = isAuthenticated ? "/courses" : "/welcome";

    return (
        <section className="border-t border-white/5 bg-zinc-950 py-16 dark:bg-zinc-950 md:py-20">
            <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
                <div className="mx-auto mb-6 flex h-12 w-12 items-center justify-center rounded-lg border border-white/10 bg-zinc-900">
                    <Rocket className="h-6 w-6 text-zinc-400" />
                </div>

                <h2 className="mb-4 text-2xl font-bold text-zinc-50 sm:text-3xl md:text-4xl">
                    Ma diyaar u tahay inaad <span className="text-violet-400">bilowdo</span>?
                </h2>

                <p className="mx-auto mb-8 max-w-xl text-base leading-relaxed text-zinc-400 md:text-lg">
                    Challenge: 6 toddobaad oo mentor. Koorsooyinka joogta ah waxaad ka heli kartaa heerka{" "}
                    <strong className="font-semibold text-zinc-200">Bilaash</strong>.
                </p>

                <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
                    <Link
                        href="/subscribe"
                        className="inline-flex w-full max-w-xs items-center justify-center rounded-lg bg-violet-600 px-8 py-3 text-base font-semibold text-white hover:bg-violet-500 sm:w-auto"
                    >
                        Hel Bilaash
                    </Link>
                    <Link
                        href={ctaHref}
                        className="inline-flex w-full max-w-xs items-center justify-center rounded-lg border border-white/15 bg-transparent px-8 py-3 text-base font-medium text-zinc-200 hover:bg-white/5 sm:w-auto"
                    >
                        {isAuthenticated ? "Bilow koorsada" : "Bilow bilaash"}
                    </Link>
                </div>
            </div>
        </section>
    );
}
