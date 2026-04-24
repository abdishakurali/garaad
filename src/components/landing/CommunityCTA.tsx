"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function CommunityCTA() {
    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);
    const { resolvedTheme } = useTheme();
    const isDark = mounted ? resolvedTheme === "dark" : true;

    const bg = isDark ? "#0A0A0F" : "#FFFFFF";
    const text = isDark ? "#FAFAFA" : "#0A0A0A";
    const textMuted = isDark ? "#A1A1AA" : "#52525B";

    return (
        <section style={{ background: bg, color: text }} className="py-16 md:py-20">
            <div className="mx-auto max-w-4xl px-4 text-center">
                <h2 className="text-3xl md:text-4xl font-black mb-4">
                    Ku Biir Kooxda Guuleystayaasha
                </h2>
                <p className="text-lg mb-8" style={{ color: textMuted }}>
                    Hel marin aad kula xiriirto dad hammi leh oo adiga kula mid ah. Aan si wadajir ah u guuleysanno, u koraan, isuna caawinno. Waa wehel iyo walaaltinnimo dhab ah.
                </p>

                <div className="relative aspect-video rounded-2xl overflow-hidden mb-8">
                    <Image
                        src="/images/community.png"
                        alt="Kooxda Garaad"
                        fill
                        className="object-cover"
                    />
                </div>

                <Link
                    href="/community"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold bg-violet-600 text-white transition-all hover:bg-violet-500"
                >
                    Ku Biir Kooxda
                    <ArrowRight className="w-4 h-4" />
                </Link>
            </div>
        </section>
    );
}