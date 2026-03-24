"use client";

import Link from "next/link";
import { Rocket } from "lucide-react";
import { pricingTranslations as t } from "@/config/translations/pricing";

export function ClosingCTA() {
    return (
        <section className="border-t border-white/5 bg-zinc-950 py-16 dark:bg-zinc-950 md:py-20">
            <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
                <div className="mx-auto mb-6 flex h-12 w-12 items-center justify-center rounded-lg border border-white/10 bg-zinc-900">
                    <Rocket className="h-6 w-6 text-zinc-400" />
                </div>

                <h2 className="mb-4 text-2xl font-bold text-zinc-50 sm:text-3xl md:text-4xl">
                    Diyaar ma u tahay inaad bilowdo safarkaaga Tech-ka?
                </h2>

                <p className="mx-auto mb-8 max-w-xl text-base leading-relaxed text-zinc-400 md:text-lg">
                    Ku biir 88+ arday oo maanta dhisaya mustaqbalkooda. Ma jirto halis (Risk) — ku bilow bilaash.
                </p>

                <Link
                    href="/challenge"
                    className="inline-flex w-full max-w-md items-center justify-center rounded-lg bg-violet-600 px-8 py-3 text-base font-semibold text-white hover:bg-violet-500 sm:w-auto"
                >
                    {t.challenge_cta} →
                </Link>
            </div>
        </section>
    );
}
