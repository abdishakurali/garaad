"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

function CTASection({ title, description, ctaText, imageSrc, ctaHref }: {
    title: string;
    description: string;
    ctaText: string;
    imageSrc: string;
    ctaHref: string;
}) {
    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);
    const { resolvedTheme } = useTheme();
    const isDark = mounted ? resolvedTheme === "dark" : true;

    const bg = isDark ? "#0A0A0F" : "#FFFFFF";
    const text = isDark ? "#FAFAFA" : "#0A0A0A";
    const textMuted = isDark ? "#A1A1AA" : "#52525B";

    return (
        <section style={{ background: bg, color: text }} className="py-12 md:py-14">
            <div className="mx-auto max-w-5xl px-4">
                <div className="grid gap-6 md:grid-cols-2 md:items-center">
                    <div>
                        <h2 className="text-lg md:text-xl font-semibold mb-2">{title}</h2>
                        <p className="text-sm mb-4" style={{ color: textMuted }}>{description}</p>
                        <Link
                            href={ctaHref}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium bg-violet-600 text-white text-sm hover:bg-violet-500"
                        >
                            {ctaText}
                            <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>
                    <div className="relative aspect-[4/3] rounded-lg overflow-hidden">
                        <Image src={imageSrc} alt={title} fill className="object-cover" />
                    </div>
                </div>
            </div>
        </section>
    );
}

export function CommunityCTA() {
    return (
        <CTASection
            title="Ku Biir Kooxda"
            description="Hel marin aad kula xiriirto dad hammi leh, u koraan, isuna caawinno."
            ctaText="Ku Biir"
            imageSrc="/images/community.png"
            ctaHref="/community"
        />
    );
}

export function MentorshipCTA() {
    return (
        <CTASection
            title="Baro Code, Hel Shaqo"
            description="Barnaamij 3-bilood ah oo lagugu barayo Software Dev & AI."
            ctaText="Bilow"
            imageSrc="/images/mentorship.png"
            ctaHref="/mentorship"
        />
    );
}