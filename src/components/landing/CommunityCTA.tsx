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
        <section style={{ background: bg, color: text }} className="py-12 md:py-16">
            <div className="mx-auto max-w-5xl px-4">
                <div className="grid gap-8 md:grid-cols-2 md:items-center">
                    {/* Text */}
                    <div>
                        <h2 className="text-2xl md:text-3xl font-bold mb-3">
                            Ku Biir Kooxda Guuleystayaasha
                        </h2>
                        <p className="text-base mb-6" style={{ color: textMuted }}>
                            Hel marin aad kula xiriirto dad hammi leh oo adiga kula mid ah. Aan si wadajir ah u guuleysanno, u koraan, isuna caawinno.
                        </p>
                        <Link
                            href="/community"
                            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg font-semibold bg-violet-600 text-white text-sm hover:bg-violet-500"
                        >
                            Ku Biir Kooxda
                            <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>

                    {/* Image */}
                    <div className="relative aspect-video md:aspect-square rounded-xl overflow-hidden">
                        <Image
                            src="/images/community.png"
                            alt="Kooxda Garaad"
                            fill
                            className="object-cover"
                        />
                    </div>
                </div>
            </div>
        </section>
    );
}