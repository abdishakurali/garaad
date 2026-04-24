"use client";

import Link from "next/link";
import Image from "next/image";
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

    const bg = isDark ? "#18181B" : "#F4F4F5";
    const text = isDark ? "#FAFAFA" : "#18181B";
    const textMuted = isDark ? "#A1A1AA" : "#52525B";

    return (
        <section 
            className="py-8 md:py-10 rounded-2xl mx-4 my-6 md:m-6"
            style={{ background: bg, maxWidth: 1100, margin: '0 auto' }}
        >
            <div className="grid gap-5 md:grid-cols-2 md:items-center md:gap-8 max-w-5xl mx-auto px-3">
                <div className="order-2 md:order-1">
                    <h2 className="text-lg md:text-xl font-bold mb-1.5" style={{ color: text }}>
                        {title}
                    </h2>
                    <p className="text-sm mb-4" style={{ color: textMuted }}>{description}</p>
                    <Link
                        href={ctaHref}
                        className="inline-block px-4 py-2 rounded-lg font-semibold bg-violet-600 text-white text-sm hover:bg-violet-500 transition-colors"
                    >
                        {ctaText}
                    </Link>
                </div>
                <div className="order-1 md:order-2 relative aspect-[3/2] md:aspect-square rounded-xl overflow-hidden">
                    <Image 
                        src={imageSrc} 
                        alt={title} 
                        fill 
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 50vw"
                    />
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