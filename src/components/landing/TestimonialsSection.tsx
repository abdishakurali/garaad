"use client";

import { useState } from "react";
import { Play, X } from "lucide-react";
import { Reveal } from "./Reveal";
import Image from "next/image";

const reviewImages = [
    {
        id: 1,
        src: "/images/review/1.png",
        alt: "Student Review 1"
    },
    {
        id: 2,
        src: "/images/review/2.png",
        alt: "Student Review 2"
    },
    {
        id: 3,
        src: "/images/review/3.jpeg",
        alt: "Student Review 3"
    }
];

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
                    {/* Unified Testimonials Section */}

                    {/* 1. Videos First */}
                    <Reveal>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
                            {videos.map((vid, index) => (
                                <div
                                    key={vid.id}
                                    className="relative group cursor-pointer"
                                    onClick={() => setShowVideoModal(vid.id)}
                                >
                                    <div className="relative aspect-video rounded-[2.5rem] overflow-hidden shadow-2xl border-4 border-white dark:border-slate-800 transition-all duration-500 group-hover:shadow-primary/20 group-hover:translate-y-[-4px]">
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
                                </div>
                            ))}
                        </div>
                    </Reveal>

                    {/* 2. Review Images Second */}
                    <Reveal>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                            {reviewImages.map((img, index) => (
                                <div
                                    key={img.id}
                                    className="relative aspect-square sm:aspect-[4/5] rounded-[2rem] overflow-hidden border-2 border-border/60 shadow-xl bg-muted/20 group hover:border-primary/40 transition-all duration-500"
                                    style={{ animationDelay: `${index * 150}ms` }}
                                >
                                    <Image
                                        src={img.src}
                                        alt={img.alt}
                                        fill
                                        className="object-contain p-4 group-hover:scale-[1.02] transition-transform duration-500"
                                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                        unoptimized
                                    />
                                    {/* Subtle gradient for depth */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent pointer-events-none" />
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
