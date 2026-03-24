"use client";

import { useState } from "react";
import { Play, X } from "lucide-react";
import { Reveal } from "./Reveal";
import Image from "next/image";
import { cn } from "@/lib/utils";

const reviewImages = [
    {
        id: 1,
        src: "/images/review/1.png",
        alt: "Ilyas Omar — dib u eegis WhatsApp",
        name: "Ilyas Omar",
        byline: "3 bilood ka hor waxba ma aqoon — hadda waa Tailwind CSS expert.",
        outcome: "Isbeddel dhab ah",
        outcomeLine:
            "Wax ka barasho eber ilaa xirfadle layout & Tailwind CSS: wuxuu hadda ku dhawaaday shaqooyinka dhabta ah.",
        nowTag: "Tailwind CSS expert",
        featured: false,
    },
    {
        id: 2,
        src: "/images/review/2.png",
        alt: "Abdiladif Salah — dib u eegis WhatsApp",
        name: "Abdiladif Salah",
        byline: "Laga soo bilaabo barashada ilaa horumariye coding wax ku ool ah",
        outcome: "Front Developer noqday",
        outcomeLine: "Natiijada: barashadii waxay noqotay shaqo dhab ah oo isku xiran — ma ahan kaliya teori.",
        nowTag: "Front-End Developer",
        featured: false,
    },
    {
        id: 3,
        src: "/images/review/3.jpeg",
        alt: "Abdiaziz — dib u eegis WhatsApp",
        name: "Abdiaziz",
        byline: "Garaad waxay i bartay sida fikrad loogu beddelo shirkad (Sofaritech).",
        outcome: "Fikrad → shirkad dhab ah",
        outcomeLine: "3 bilood kadib: shirkad IT oo macaamiil leh, website la shaqeeya, mustaqbal la taaban karo.",
        nowTag: "Aasaasaha Sofaritech",
        featured: true,
        companyHref: "https://sofaritech-global-it-solutions.vercel.app",
    },
] as const;

const videos = [
    {
        id: "bolhbU8tiU8",
        title: "Dhisidda SaaS-ka",
        subtitle: "Daawo sida ardaydeena ay u dhisayaan SaaS mashaariicda ah.",
        thumbnail: "https://img.youtube.com/vi/bolhbU8tiU8/maxresdefault.jpg"
    },
    {
        id: "78HYiX0FwxE",
        title: "Sheekada Guusha",
        subtitle: "Sidee Garaad u beddeshay nolosheyda - Sheeko arday.",
        thumbnail: "https://img.youtube.com/vi/78HYiX0FwxE/maxresdefault.jpg"
    }
];

export function TestimonialsSection() {
    const [showVideoModal, setShowVideoModal] = useState<string | null>(null);

    return (
        <section className="py-12 sm:py-16 md:py-20 px-3 sm:px-4 md:px-6 bg-background overflow-hidden border-t border-border/50">
            <div className="max-w-7xl mx-auto w-full min-w-0">
                <Reveal>
                    <div className="text-center mb-8 sm:mb-10 md:mb-12 max-w-2xl mx-auto px-1">
                        <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-foreground tracking-tight text-balance">
                            Sheekooyinka <span className="text-primary">Guusha</span>
                        </h2>
                        <p className="mt-2 sm:mt-3 text-sm sm:text-base text-muted-foreground leading-relaxed">
                            Sheekooyinka isbeddelka — sida eber ugu noqoshada xirfad ama ganacsi dhab ah.
                        </p>
                    </div>
                </Reveal>

                <div className="space-y-10 sm:space-y-14 md:space-y-16">
                    {/* 1. WhatsApp / screenshot reviews */}
                    <Reveal>
                        <div className="grid w-full min-w-0 grid-cols-1 gap-5 sm:gap-6 md:grid-cols-3 md:gap-8">
                            {reviewImages.map((img, index) => (
                                <div
                                    key={img.id}
                                    className="flex min-w-0 flex-col gap-3 sm:gap-4"
                                    style={{ animationDelay: `${index * 150}ms` }}
                                >
                                    <div
                                        className={cn(
                                            "relative w-full overflow-hidden rounded-2xl border border-border/50 bg-muted/10 shadow-lg sm:rounded-3xl sm:border-border/60 group transition-all duration-300 hover:border-primary/35",
                                            img.featured
                                                ? "aspect-[4/3] min-h-[180px] sm:aspect-[4/5] sm:min-h-0"
                                                : "aspect-square sm:aspect-[4/5] max-h-[min(72vh,520px)] sm:max-h-none"
                                        )}
                                    >
                                        <Image
                                            src={img.src}
                                            alt={img.alt}
                                            fill
                                            className="object-contain p-3 sm:p-4 group-hover:scale-[1.01] transition-transform duration-300"
                                            sizes="(max-width:768px) 100vw, 33vw"
                                            unoptimized
                                        />
                                        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/[0.03] to-transparent" />
                                    </div>
                                    <div className="px-0.5 text-center sm:text-left">
                                        <p className="text-sm font-bold text-foreground">{img.name}</p>
                                        <p className="mt-1 text-xs font-semibold leading-snug text-foreground/90">
                                            {img.byline}
                                        </p>
                                        {img.featured ? (
                                            <span className="mt-1 inline-block rounded-full bg-emerald-600/90 px-2.5 py-0.5 text-[10px] font-black text-white">
                                                🏢 Shirkad Dhisay
                                            </span>
                                        ) : null}
                                        <p className="mt-1 text-xs font-semibold text-primary">Hadda {img.nowTag}</p>
                                        <p className="mt-0.5 text-sm leading-snug text-muted-foreground">{img.outcome}</p>
                                        <p className="mt-2 border-l-2 border-primary/70 pl-3 text-xs font-medium leading-relaxed text-foreground sm:text-sm">
                                            {img.outcomeLine}
                                        </p>
                                        <p className="mt-1.5 text-xs font-medium text-muted-foreground sm:text-sm">
                                            Tan xigta adiga ayay noqon kartaa.
                                        </p>
                                        {"companyHref" in img && img.companyHref ? (
                                            <a
                                                href={img.companyHref}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="mt-2 inline-block max-w-full break-all text-xs font-bold text-violet-500 hover:underline sm:break-normal"
                                            >
                                                sofaritech-global-it-solutions.vercel.app →
                                            </a>
                                        ) : null}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Reveal>

                    {/* 2. Video testimonials */}
                    <Reveal>
                        <h3 className="mb-5 text-center text-lg font-black text-foreground sm:mb-6 sm:text-xl">
                            Muuqaallada <span className="text-primary">dhiirigelinta</span>
                        </h3>
                        <div className="grid w-full min-w-0 grid-cols-1 gap-6 sm:gap-8 md:grid-cols-2">
                            {videos.map((vid) => (
                                <div
                                    key={vid.id}
                                    className="relative min-w-0 cursor-pointer group"
                                    onClick={() => setShowVideoModal(vid.id)}
                                >
                                    <div className="relative aspect-video w-full min-h-[min(52vw,200px)] overflow-hidden rounded-2xl border-2 border-primary/20 shadow-lg transition-all duration-300 dark:border-violet-500/30 sm:min-h-0 sm:rounded-3xl sm:shadow-xl group-hover:border-primary/40 group-hover:shadow-primary/15">
                                        <Image
                                            src={vid.thumbnail}
                                            alt={vid.title}
                                            fill
                                            className="object-cover opacity-95 transition-opacity duration-300 group-hover:opacity-100"
                                            sizes="(max-width:768px) 100vw, 50vw"
                                        />

                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/95 shadow-xl backdrop-blur-sm transition-transform duration-300 group-hover:scale-105 sm:h-20 sm:w-20">
                                                <Play className="h-7 w-7 translate-x-0.5 fill-current text-white sm:h-9 sm:w-9" />
                                            </div>
                                        </div>

                                        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/45 to-transparent px-4 pb-4 pt-12 sm:p-6 sm:pt-16">
                                            <h4 className="text-base font-black text-white sm:text-xl">{vid.title}</h4>
                                            <p className="mt-0.5 text-xs italic text-white/85 sm:text-sm">{vid.subtitle}</p>
                                        </div>
                                    </div>
                                    <p className="mt-2 text-center text-sm font-bold text-foreground sm:mt-3 sm:font-black">{vid.title}</p>
                                </div>
                            ))}
                        </div>
                    </Reveal>
                </div>

            </div>

            {/* Video Modal */}
            {showVideoModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 p-3 backdrop-blur-md sm:p-6 md:p-8">
                    <div className="relative aspect-video w-full max-h-[min(85dvh,100vw*9/16)] max-w-5xl overflow-hidden rounded-2xl border border-white/10 bg-black shadow-2xl sm:rounded-3xl animate-in fade-in zoom-in duration-300">
                        <button
                            onClick={() => setShowVideoModal(null)}
                            className="absolute top-4 right-4 bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-full p-3 z-10 transition-colors duration-200 border border-white/20 shadow-xl group"
                        >
                            <X className="w-6 h-6 text-white group-hover:rotate-90 transition-transform duration-300" />
                        </button>
                        <iframe
                            src={`https://www.youtube.com/embed/${showVideoModal}?autoplay=1`}
                            title="Garaad Testimonial"
                            className="w-full h-full"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        />
                    </div>
                </div>
            )}
        </section>
    );
}
