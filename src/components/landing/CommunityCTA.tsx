"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Users, GraduationCap } from "lucide-react";

function CTASection({ 
    title, 
    description, 
    ctaText, 
    ctaHref,
    imageSrc,
    isFirst = false 
}: {
    title: string;
    description: string;
    ctaText: string;
    ctaHref: string;
    imageSrc?: string;
    isFirst?: boolean;
}) {
    return (
        <section className={`py-8 md:py-10 ${isFirst ? '' : 'border-t border-border/60'} bg-slate-50 dark:bg-zinc-900`}>
            <div className="max-w-5xl mx-auto px-4">
                <Link 
                    href={ctaHref}
                    className="flex flex-col md:flex-row items-center gap-6 p-5 md:p-6 rounded-xl bg-white dark:bg-zinc-800 shadow-sm hover:shadow-md transition-all"
                >
                    {imageSrc && (
                        <div className="w-full md:w-48 lg:w-56 shrink-0 relative aspect-video md:aspect-square rounded-lg overflow-hidden">
                            <Image 
                                src={imageSrc} 
                                alt={title}
                                fill
                                className="object-cover"
                            />
                        </div>
                    )}
                    <div className="flex-1 text-center md:text-left">
                        <h2 className="text-lg md:text-xl font-bold text-foreground mb-1">{title}</h2>
                        <p className="text-sm text-muted-foreground mb-3">{description}</p>
                        <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-violet-600 hover:bg-violet-500 text-white font-semibold text-sm">
                            {ctaText}
                            <ArrowRight className="w-4 h-4" />
                        </span>
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
            imageSrc="/images/community.png"
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
            imageSrc="/images/mentorship.png"
        />
    );
}