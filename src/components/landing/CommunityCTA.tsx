"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";

interface Webinar {
    id: number;
    title: string;
    slug: string;
    description: string;
    banner_image: string | null;
    is_past: boolean;
}

function CTASection({ title, description, ctaText, ctaHref, imageSrc, isFirst }: {
    title: string;
    description: string;
    ctaText: string;
    ctaHref: string;
    imageSrc: string;
    isFirst?: boolean;
}) {
    return (
        <section className={`py-8 md:py-10 ${isFirst ? '' : 'border-t border-border/60'} bg-slate-50 dark:bg-zinc-900`}>
            <div className="max-w-5xl mx-auto px-4">
                <Link 
                    href={ctaHref}
                    className="flex flex-col md:flex-row items-center gap-5 p-4 md:p-5 rounded-xl bg-white dark:bg-zinc-800 shadow-sm hover:shadow-md transition-all"
                >
                    <div className="w-full md:w-44 lg:w-48 shrink-0">
                        <img 
                            src={imageSrc} 
                            alt={title}
                            className="w-full h-32 md:h-40 object-cover rounded-lg"
                        />
                    </div>
                    <div className="flex-1 text-center md:text-left">
                        <h2 className="text-lg md:text-xl font-bold text-foreground mb-1">{title}</h2>
                        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{description}</p>
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

    const title = webinar?.title || "Freelancing Soomaaliya";
    const description = webinar?.description 
        ? webinar.description.slice(0, 120) + (webinar.description.length > 120 ? "..." : "")
        : "Dhammaanteen waan garawsannahay caqabadaha ka jira dalkeenna marka ay timaaddo ka qayb-qaadashada suuqa caalamka.";
    const imageSrc = webinar?.banner_image || "/images/community.png";
    const linkHref = webinar?.slug ? `/welcome?utm_source=webinar_cta` : "/welcome";
    
    return (
        <CTASection
            title={title}
            description={description}
            ctaText="Is-diiwaangeli"
            ctaHref={linkHref}
            imageSrc={imageSrc}
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
            isFirst={false}
        />
    );
}