"use client";

import Link from "next/link";
import Image from "next/image";
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
    return (
        <section className="py-10 md:py-12 bg-slate-50 dark:bg-zinc-900">
            <div className="max-w-6xl mx-auto px-4 md:px-6">
                <div className={`flex flex-col md:flex-row items-center gap-6 md:gap-10 ${reverse ? 'md:flex-row-reverse' : ''}`}>
                    <div className="flex-1 w-full">
                        <h2 className="text-2xl md:text-3xl font-bold text-violet-600 dark:text-violet-400 mb-2 pb-2 border-b-2 border-violet-500 inline-block">{title}</h2>
                        <p className="text-base md:text-lg text-zinc-600 dark:text-zinc-300 mb-5">{description}</p>
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
                            priority={false}
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