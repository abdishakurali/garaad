"use client";

import Link from "next/link";
import Image from "next/image";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";

function CTASection({ 
    title, 
    description, 
    ctaText, 
    imageSrc, 
    ctaHref,
    reverse = false 
}: {
    title: string;
    description: string;
    ctaText: string;
    imageSrc: string;
    ctaHref: string;
    reverse?: boolean;
}) {
    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);
    const { resolvedTheme } = useTheme();
    const isDark = mounted ? resolvedTheme === "dark" : true;

    return (
        <section className={`py-10 md:py-12 border-t border-border/60 ${reverse ? 'bg-zinc-50 dark:bg-zinc-900/30' : ''}`}>
            <div className="max-w-6xl mx-auto px-4 md:px-6">
                <div className={`flex flex-col md:flex-row items-center gap-6 md:gap-10 ${reverse ? 'md:flex-row-reverse' : ''}`}>
                    <div className="flex-1 w-full">
                        <h2 className="text-xl md:text-2xl font-bold text-foreground mb-2">{title}</h2>
                        <p className="text-sm md:text-base text-muted-foreground mb-4">{description}</p>
                        <Link
                            href={ctaHref}
                            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-violet-600 hover:bg-violet-500 text-white font-semibold text-sm transition-colors"
                        >
                            {ctaText}
                            <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>
                    <div className="flex-1 w-full relative aspect-video md:aspect-[4/3] rounded-xl overflow-hidden">
                        <Image 
                            src={imageSrc} 
                            alt={title} 
                            fill 
                            className="object-cover"
                        />
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
            reverse
            title="Baro Code, Hel Shaqo"
            description="Barnaamij 3-bilood ah oo lagugu barayo Software Dev & AI."
            ctaText="Bilow"
            imageSrc="/images/mentorship.png"
            ctaHref="/mentorship"
        />
    );
}