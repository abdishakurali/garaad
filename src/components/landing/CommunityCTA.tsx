"use client";

import Link from "next/link";
import { ArrowRight, Users, GraduationCap } from "lucide-react";

function CTASection({ 
    title, 
    description, 
    ctaText, 
    ctaHref,
    isFirst = false 
}: {
    title: string;
    description: string;
    ctaText: string;
    ctaHref: string;
    isFirst?: boolean;
}) {
    return (
        <section className={`py-10 md:py-12 ${isFirst ? '' : 'border-t border-border/60'} bg-slate-50 dark:bg-zinc-900`}>
            <div className="max-w-4xl mx-auto px-4 md:px-6">
                <Link 
                    href={ctaHref}
                    className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 p-6 sm:p-8 rounded-2xl bg-white dark:bg-zinc-800 shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5"
                >
                    <div className="p-4 rounded-xl bg-violet-100 dark:bg-violet-900/30">
                        {title.includes("Kooxda") ? (
                            <Users className="w-8 h-8 text-violet-600 dark:text-violet-400" />
                        ) : (
                            <GraduationCap className="w-8 h-8 text-violet-600 dark:text-violet-400" />
                        )}
                    </div>
                    <div className="flex-1 text-center sm:text-left">
                        <h2 className="text-xl md:text-2xl font-bold text-foreground mb-1">{title}</h2>
                        <p className="text-sm text-muted-foreground">{description}</p>
                    </div>
                    <div className="px-5 py-2.5 rounded-lg bg-violet-600 hover:bg-violet-500 text-white font-semibold text-sm flex items-center gap-2 transition-colors">
                        {ctaText}
                        <ArrowRight className="w-4 h-4" />
                    </div>
                </Link>
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
            ctaHref="/community"
            isFirst={true}
        />
    );
}

export function MentorshipCTA() {
    return (
        <CTASection
            title="Baro Code, Hel Shaqo"
            description="Barnaamij 3-bilood ah oo lagugu barayo Software Dev & AI."
            ctaText="Bilow"
            ctaHref="/mentorship"
        />
    );
}