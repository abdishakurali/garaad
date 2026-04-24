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
        <section className={`py-8 md:py-10 ${isFirst ? '' : 'border-t border-border/60'} bg-slate-50 dark:bg-zinc-900`}>
            <div className="max-w-4xl mx-auto px-4">
                <Link 
                    href={ctaHref}
                    className="flex items-center gap-5 p-6 rounded-xl bg-white dark:bg-zinc-800 shadow-sm hover:shadow-md transition-all"
                >
                    <div className="p-3 rounded-xl bg-violet-100 dark:bg-violet-900/30">
                        {title.includes("Kooxda") ? (
                            <Users className="w-6 h-6 text-violet-600" />
                        ) : (
                            <GraduationCap className="w-6 h-6 text-violet-600" />
                        )}
                    </div>
                    <div className="flex-1">
                        <h2 className="text-lg font-bold text-foreground mb-0.5">{title}</h2>
                        <p className="text-sm text-muted-foreground">{description}</p>
                    </div>
                    <span className="shrink-0 inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-violet-600 hover:bg-violet-500 text-white font-semibold text-sm">
                        {ctaText}
                        <ArrowRight className="w-4 h-4" />
                    </span>
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
            title="Mentorship Gaar ah: Ka Gudub Caqabadaha"
            description="Ma rabtaa inaad xawaarahaaga koodh qorista labanlaabto? Mentorship-kayagu wuxuu ku siinayaa fursad aad si toos ah iila shaqayso."
            ctaText="Bilow"
            ctaHref="/mentorship"
        />
    );
}