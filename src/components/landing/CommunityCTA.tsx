"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Users, MessageCircle, Heart } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

const PURPLE = "#7C3AED";

export function CommunityCTA() {
    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);
    const { resolvedTheme } = useTheme();
    const isDark = mounted ? resolvedTheme === "dark" : true;

    const bg = isDark ? "#0A0A0F" : "#FFFFFF";
    const text = isDark ? "#FAFAFA" : "#0A0A0A";
    const textMuted = isDark ? "#A1A1AA" : "#52525B";
    const cardBg = isDark ? "#18181B" : "#FAFAFA";
    const borderColor = isDark ? "#27272A" : "#E4E4E7";

    return (
        <section style={{ background: bg, color: text }} className="py-16 md:py-24">
            <div className="mx-auto max-w-5xl px-4">
                <div className="grid gap-10 md:grid-cols-2 md:items-center md:gap-12">
                    {/* Image side */}
                    <div className="relative aspect-square rounded-2xl overflow-hidden border"
                        style={{ borderColor }}>
                        <Image
                            src="/community-cta.jpg"
                            alt="Kooxda Garaad"
                            fill
                            className="object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                        <div className="absolute bottom-6 left-6 right-6">
                            <div className="flex items-center gap-4">
                                <div className="flex -space-x-3">
                                    {["A", "M", "S", "F"].map((letter, i) => (
                                        <div
                                            key={letter}
                                            className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-xs font-bold text-violet-600 border-2"
                                            style={{ border: '2px solid white' }}
                                        >
                                            {letter}
                                        </div>
                                    ))}
                                </div>
                                <span className="text-sm text-white font-medium">
                                    500+ walaal
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Text side */}
                    <div>
                        <h2 className="text-3xl md:text-4xl font-black mb-4">
                            Ku Biir Kooxda Guuleystayaasha
                        </h2>
                        <p className="text-lg mb-8" style={{ color: textMuted }}>
                            Hel marin aad kula xiriirto dad hammi leh oo adiga kula mid ah. Aan si wadajir ah u guuleysanno, u koraan, isuna caawinno. Waa wehel iyo walaaltinnimo dhab ah.
                        </p>

                        <div className="grid grid-cols-3 gap-4 mb-8">
                            <div className="text-center">
                                <Users className="w-8 h-8 mx-auto mb-2" style={{ color: PURPLE }} />
                                <div className="text-2xl font-bold">500+</div>
                                <div className="text-sm" style={{ color: textMuted }}>Walaal</div>
                            </div>
                            <div className="text-center">
                                <MessageCircle className="w-8 h-8 mx-auto mb-2" style={{ color: PURPLE }} />
                                <div className="text-2xl font-bold">10K+</div>
                                <div className="text-sm" style={{ color: textMuted }}>Fadhi</div>
                            </div>
                            <div className="text-center">
                                <Heart className="w-8 h-8 mx-auto mb-2" style={{ color: PURPLE }} />
                                <div className="text-2xl font-bold">50+</div>
                                <div className="text-sm" style={{ color: textMuted }}>Mashruuc</div>
                            </div>
                        </div>

                        <Link
                            href="/community"
                            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-white transition-all hover:opacity-90"
                            style={{ background: PURPLE }}
                        >
                            Ku Biir Kooxda
                            <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}