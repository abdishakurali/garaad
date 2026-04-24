import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface Webinar {
    id: number;
    title: string;
    slug: string;
    description: string;
    banner_image: string | null;
    is_past: boolean;
}

async function fetchLatestWebinar(): Promise<Webinar | null> {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/webinars/`, { 
            next: { revalidate: 60 } 
        });
        if (!res.ok) return null;
        const webinars: Webinar[] = await res.json();
        const active = webinars.find((w) => !w.is_past);
        return active || null;
    } catch {
        return null;
    }
}

interface CTASectionProps {
    title: string;
    description: string;
    ctaText: string;
    ctaHref: string;
    imageSrc: string;
    isFirst?: boolean;
}

function CTASection({ title, description, ctaText, ctaHref, imageSrc, isFirst }: CTASectionProps) {
    // Use background image style
    const bgStyle = imageSrc ? {
        backgroundImage: `url(${imageSrc})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
    } : {};

    return (
        <section className={`py-8 md:py-10 ${isFirst ? '' : 'border-t border-border/60'} bg-slate-50 dark:bg-zinc-900`}>
            <div className="max-w-5xl mx-auto px-4">
                <Link 
                    href={ctaHref}
                    className="flex flex-col md:flex-row items-center gap-5 p-4 md:p-5 rounded-xl bg-white dark:bg-zinc-800 shadow-sm hover:shadow-md transition-all overflow-hidden relative"
                >
                    {/* Background image */}
                    {imageSrc && (
                        <div 
                            className="absolute inset-0 opacity-20 pointer-events-none"
                            style={bgStyle}
                        />
                    )}
                    
                    <div className="w-full md:w-44 lg:w-48 shrink-0 relative z-10">
                        <div 
                            className="w-full h-32 md:h-40 rounded-lg bg-zinc-200"
                            style={bgStyle}
                        />
                    </div>
                    
                    <div className="flex-1 text-center md:text-left relative z-10">
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

export async function CommunityCTAServer() {
    const webinar = await fetchLatestWebinar();
    
    const title = webinar?.title || "Freelancing Soomaaliya";
    const description = webinar?.description 
        ? webinar.description.slice(0, 120) + (webinar.description.length > 120 ? "..." : "")
        : "Dhammaanteen waan garawsannahay caqabadaha ka jira dalkeenna marka ay timaaddo ka qayb-qaadashada suuqa caalamka.";
    const imageSrc = webinar?.banner_image || "/images/community.png";
    const linkHref = webinar?.slug ? `/webinars/${webinar.slug}` : "/community";
    
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