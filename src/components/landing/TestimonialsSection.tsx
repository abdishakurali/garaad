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
        outcome: "Bartay Tailwind CSS",
        nowTag: "Tailwind CSS Developer",
        featured: false,
    },
    {
        id: 2,
        src: "/images/review/2.png",
        alt: "Abdiladif Salah — dib u eegis WhatsApp",
        name: "Abdiladif Salah",
        outcome: "Front Developer noqday",
        nowTag: "Front-End Developer",
        featured: false,
    },
    {
        id: 3,
        src: "/images/review/3.jpeg",
        alt: "Abdiaziz — dib u eegis WhatsApp",
        name: "Abdiaziz",
        outcome: "Website la dhisay Sofaritech",
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
        <section className="py-14 sm:py-20 px-4 bg-background overflow-hidden border-t border-border/50">
            <div className="max-w-7xl mx-auto">
                <Reveal>
                    <div className="text-center mb-10 sm:mb-12">
                        <h2 className="text-3xl sm:text-4xl font-black text-foreground tracking-tight">
                            Sheekooyinka <span className="text-primary">Guusha</span>
                        </h2>
                        <p className="mt-3 text-muted-foreground max-w-xl mx-auto">
                            Ardaydeena iyo muuqaalada dhiirigelinta leh.
                        </p>
                    </div>
                </Reveal>

                <div className="space-y-12">
                    {/* 1. WhatsApp / screenshot reviews (above the fold priority) */}
                    <Reveal>
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
                            {reviewImages.map((img, index) => (
                                <div
                                    key={img.id}
                                    className={cn(
                                        "flex flex-col gap-4",
                                        img.featured && "sm:col-span-2 lg:col-span-2"
                                    )}
                                    style={{ animationDelay: `${index * 150}ms` }}
                                >
                                    <div
                                        className={cn(
                                            "relative rounded-[2rem] overflow-hidden border-2 border-border/60 shadow-xl bg-muted/20 group hover:border-primary/40 transition-all duration-500",
                                            img.featured
                                                ? "aspect-[16/9] sm:aspect-[21/9] min-h-[220px]"
                                                : "aspect-square sm:aspect-[4/5]"
                                        )}
                                    >
                                        <Image
                                            src={img.src}
                                            alt={img.alt}
                                            fill
                                            className="object-contain p-4 group-hover:scale-[1.02] transition-transform duration-500"
                                            sizes={img.featured ? "(max-width:1024px) 100vw, 66vw" : "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"}
                                            unoptimized
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent pointer-events-none" />
                                    </div>
                                    <div className="text-center sm:text-left px-1">
                                        <p className="text-sm font-bold text-foreground">{img.name}</p>
                                        {img.featured ? (
                                            <span className="mt-1 inline-block rounded-full bg-emerald-600/90 px-2.5 py-0.5 text-[10px] font-black text-white">
                                                🏢 Shirkad Dhisay
                                            </span>
                                        ) : null}
                                        <p className="text-xs font-semibold text-primary mt-1">Hadda {img.nowTag}</p>
                                        <p className="text-sm text-muted-foreground mt-0.5">{img.outcome}</p>
                                        {"companyHref" in img && img.companyHref ? (
                                            <a
                                                href={img.companyHref}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-block mt-2 text-xs font-bold text-violet-500 hover:underline"
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
                        <h3 className="text-center text-xl font-black text-foreground mb-6">
                            Muuqaallada <span className="text-primary">dhiirigelinta</span>
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
                            {videos.map((vid) => (
                                <div
                                    key={vid.id}
                                    className="relative group cursor-pointer"
                                    onClick={() => setShowVideoModal(vid.id)}
                                >
                                    <div className="relative aspect-video min-h-[200px] rounded-[2.5rem] overflow-hidden shadow-2xl border-4 border-primary/30 dark:border-violet-500/40 ring-2 ring-primary/10 transition-all duration-500 group-hover:shadow-primary/30 group-hover:translate-y-[-4px]">
                                        <Image
                                            src={vid.thumbnail}
                                            alt={vid.title}
                                            fill
                                            className="object-cover opacity-95 group-hover:opacity-100 transition-opacity duration-300"
                                        />

                                        {/* Play Button Overlay */}
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-primary/95 backdrop-blur-sm rounded-full flex items-center justify-center group-hover:bg-primary transition-all duration-300 shadow-2xl group-hover:scale-110">
                                                <Play className="w-8 h-8 sm:w-10 sm:h-10 text-white fill-current translate-x-1" />
                                            </div>
                                        </div>

                                        {/* Label Overlay */}
                                        <div className="absolute bottom-0 inset-x-0 p-6 sm:p-8 bg-gradient-to-t from-black/90 via-black/40 to-transparent">
                                            <h4 className="text-white font-black text-xl mb-1">{vid.title}</h4>
                                            <p className="text-white/80 text-sm italic">{vid.subtitle}</p>
                                        </div>
                                    </div>
                                    <p className="mt-3 text-center text-sm font-black text-foreground">{vid.title}</p>
                                </div>
                            ))}
                        </div>
                    </Reveal>
                </div>

            </div>

            {/* Video Modal */}
            {showVideoModal && (
                <div className="fixed inset-0 bg-black/95 backdrop-blur-md z-[100] flex items-center justify-center p-4 sm:p-8">
                    <div className="relative max-w-5xl w-full aspect-video bg-black rounded-3xl overflow-hidden shadow-2xl border border-white/10 animate-in fade-in zoom-in duration-300">
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
