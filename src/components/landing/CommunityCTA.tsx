"use client";

import Link from "next/link";
import { ArrowRight, Users, GraduationCap } from "lucide-react";
import { useEffect, useState } from "react";

interface Webinar {
    id: number;
    title: string;
    slug: string;
    description: string;
    banner_image: string | null;
    is_past: boolean;
}

function CTASection({ title, description, ctaText, ctaHref, imageSrc, isFirst, icon: Icon }: {
    title: string;
    description: string;
    ctaText: string;
    ctaHref: string;
    imageSrc: string;
    isFirst?: boolean;
    icon?: React.ComponentType<{ className?: string }>;
}) {
    return (
        <section className={`py-10 md:py-12 ${isFirst ? '' : 'border-t border-border/60'} bg-slate-50 dark:bg-zinc-900`}>
            <div className="max-w-5xl mx-auto px-4">
                <Link 
                    href={ctaHref}
                    className="flex flex-col md:flex-row items-center gap-6 md:gap-8 p-6 md:p-8 rounded-2xl bg-white dark:bg-zinc-800 border border-border hover:border-primary/50 hover:shadow-lg transition-all"
                >
                    <div className="relative shrink-0">
                        <div className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-4 border-primary/20 shadow-lg">
                            <img 
                                src={imageSrc} 
                                alt={title}
                                className="w-full h-full object-cover"
                            />
                        </div>
                        {Icon && (
                            <div className="absolute -bottom-2 -right-2 w-10 h-10 rounded-full bg-primary flex items-center justify-center shadow-lg">
                                <Icon className="w-5 h-5 text-white" />
                            </div>
                        )}
                    </div>
                    <div className="flex-1 text-center md:text-left">
                        <h2 className="text-xl md:text-2xl font-bold text-foreground mb-2">{title}</h2>
                        <p className="text-base text-muted-foreground mb-4 max-w-lg">{description}</p>
                        <span className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary hover:bg-primary/90 text-white font-semibold text-sm transition-colors">
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
    const [webinar, setWebinar] = useState<Webinar | null>(null);
    
    useEffect(() => {
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/webinars/`)
            .then(res => res.json())
            .then((data: Webinar[]) => {
                const active = data.find((w: Webinar) => !w.is_past);
                if (active) setWebinar(active);
            })
            .catch(() => {});
    }, []);

    const title = webinar?.title || "Bulshada";
    const description = webinar?.description 
        ? webinar.description.slice(0, 120) + (webinar.description.length > 120 ? "..." : "")
        : "Ku biir bulshada ardayda technology-ga. Hel courses, mentorship, iyo community.";
    const imageSrc = webinar?.banner_image || "/images/community.png";
    const linkHref = webinar?.slug ? `/welcome?utm_source=webinar_cta` : "/welcome";
    
    return (
        <CTASection
            title={title}
            description={description}
            ctaText="Is-diiwaangeli"
            ctaHref={linkHref}
            imageSrc={imageSrc}
            icon={Users}
            isFirst={true}
        />
    );
}

export function MentorshipCTA() {
    return (
        <CTASection
            title="Mentorship Gaar ah"
            description="Hel taageero shaqsi ah oo khubaro ah. Dhis aasaaskaada, qurux weynaha portfolio-gaaga, oo bilow shaqa."
            ctaText="Bilow"
            ctaHref="/mentorship"
            imageSrc="/images/mentorship.png"
            icon={GraduationCap}
            isFirst={false}
        />
    );
}