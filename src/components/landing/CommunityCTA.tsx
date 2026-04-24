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
                            className="w-full h-full object-cover rounded-lg"
                            style={{ aspectRatio: '1/1' }}
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

export async function CommunityCTAServer() {
    const webinar = await fetchLatestWebinar();
    
    const title = webinar?.title || "Ku Biir Kooxda";
    const description = webinar?.description 
        ? webinar.description.slice(0, 100) + (webinar.description.length > 100 ? "..." : "")
        : "Hel marin aad kula xiriirto dad hammi leh, u koraan, isuna caawinno.";
    const imageSrc = webinar?.banner_image || "/images/community.png";
    
    return (
        <CTASection
            title={title}
            description={description}
            ctaText="Ku Biir"
            ctaHref="/community"
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