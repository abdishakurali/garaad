"use client";

import { MapPin, Calendar, Quote } from "lucide-react";
import Image from "next/image";

interface Era {
    number: number;
    title: string;
    subtitle: string;
    location: string;
    period: string;
    age: string;
    body: string;
    quote: string;
    tags: string[];
    image: string;
}

const eras: Era[] = [
    {
        number: 1,
        title: "The Self-Taught Rebel | Is-barid",
        subtitle: "The Awakening | Toosniin",
        location: "Mogadishu, Somalia",
        period: "2019–2020",
        age: "Age 16–17",
        body: "Markii aan ahaa 16 jir, anigoo dareemaya niyad jab waxbarashadii hore, waxaan iskii u bartay programming-ka casriga ah anigoo isticmaalaya YouTube iyo kheyraad bilaash ah.",
        quote: "Barashada dhabta ah waxay ka dhacdaa bannaanka fasalka. I built the future while others stuck to old textbooks.",
        tags: ["Self-taught", "Dropout", "Grit"],
        image: "/images/garaad.jpg",
    },
    {
        number: 2,
        title: "The Freelancer | Shaqo Madax-banaan",
        subtitle: "The Hustle | Dadaal",
        location: "Mogadishu, Somalia",
        period: "2020–2021",
        age: "Age 17–18",
        body: "Waxaan bilaabay freelancing ka Upwork iyo Fiverr, anigoo u dhisaya websites iyo apps macaamiil caalami ah. Waxaan bartay qiimeynta, xiriirka macaamiisha, iyo bixinta mashaariicda.",
        quote: "Waaya-aragnimada ayaa ka muhiimsan aragtida (theory). Every project taught me more.",
        tags: ["Freelancer", "Global Clients", "Business"],
        image: "/images/freelancer.png",
    },
    {
        number: 3,
        title: "The European Builder | Dhisaha Caalamiga",
        subtitle: "The Global Player",
        location: "Nairobi → Europe",
        period: "2022–2023",
        age: "Age 19–20",
        body: "Waxaan helay shaqooyin remote ah oo aan la shaqeynayay shirkado Yurub ah, anigoo u dhisaya alaabada SaaS kumanaan isticmaalayaal ah.",
        quote: "Internet-ku wuxuu furaa suuqyo caalami ah. Ha isku xirin deegaankaaga kaliya.",
        tags: ["SaaS", "Remote Work", "Scale"],
        image: "/images/builder.png",
    },
    {
        number: 4,
        title: "The Visionary | Aragtida Fog",
        subtitle: "The Empire Builder",
        location: "Europe",
        period: "2023–2024",
        age: "Age 20–21",
        body: "Hadda waxaan maamulaa shirkado badan oo SaaS ah waxaanan dhiirigelinayaa dhalinyarada Soomaaliyeed. Focused on edtech and community impact.",
        quote: "Guushu waa inaad kor u qaaddaa bulshadaada oo aad abuurtaa saameyn waara.",
        tags: ["Founder", "EdTech", "Impact"],
        image: "/images/last.png",
    },
];

export function OurStorySection() {
    return (
        <section id="our-story" className="relative py-20 md:py-32 bg-white dark:bg-slate-950 overflow-hidden">
            {/* Background Elements */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,.02)_1px,transparent_1px)] dark:bg-[linear-gradient(rgba(255,255,255,.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.02)_1px,transparent_1px)] bg-[size:64px_64px]" />

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section Header */}
                <div className="text-center mb-16 md:mb-24">
                    <div className="inline-block px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
                        <span className="text-sm font-bold text-primary uppercase tracking-wider">
                            Qisadeena | Our Story
                        </span>
                    </div>
                    <h2 className="text-4xl sm:text-5xl md:text-6xl font-black mb-6">
                        From{" "}
                        <span className="bg-gradient-to-r from-primary to-blue-500 bg-clip-text text-transparent">
                            Mogadishu Hustler
                        </span>
                        <br />
                        to SaaS Builder 🚀
                    </h2>
                    <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto">
                        Safarkii dhabta ahaa ee dhalinyaro Soomaaliyeed oo ka soo bilowday eber ilaa ay ka dhisayaan shirkado SaaS oo faa'iido leh—haddana ku baraya adiga.
                    </p>
                </div>

                {/* Timeline */}
                <div className="relative">
                    {/* Vertical Line */}
                    <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary via-blue-500 to-purple-500 hidden sm:block" />

                    {/* Era Cards */}
                    <div className="space-y-16 md:space-y-24">
                        {eras.map((era, index) => (
                            <div
                                key={era.number}
                                className={`relative flex flex-col ${index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                                    } items-center gap-8`}
                            >
                                {/* Timeline Dot */}
                                <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 w-12 h-12 rounded-full bg-primary border-4 border-white dark:border-slate-950 shadow-lg items-center justify-center z-10">
                                    <span className="text-white font-bold text-lg">{era.number}</span>
                                </div>

                                {/* Content Card */}
                                <div className={`w-full md:w-[calc(50%-3rem)] ${index % 2 === 0 ? "md:text-right" : "md:text-left"}`}>
                                    <div className="group relative p-8 rounded-3xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-primary/50 dark:hover:border-primary/50 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-1">
                                        {/* Image */}
                                        <div className="relative w-full aspect-video mb-6 rounded-2xl overflow-hidden border-2 border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800/50">
                                            <Image
                                                src={era.image}
                                                alt={era.title}
                                                fill
                                                className="object-contain group-hover:scale-105 transition-transform duration-500"
                                                sizes="(max-width: 768px) 100vw, 50vw"
                                            />
                                        </div>

                                        {/* Era Badge */}
                                        <div className={`flex items-center gap-3 mb-4 ${index % 2 === 0 ? "md:justify-end" : "md:justify-start"}`}>
                                            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider">
                                                <span className="block md:hidden">{era.number}.</span>
                                                <span>{era.subtitle}</span>
                                            </div>
                                        </div>

                                        {/* Location & Period */}
                                        <div className={`flex flex-wrap items-center gap-4 mb-4 text-sm text-slate-600 dark:text-slate-400 ${index % 2 === 0 ? "md:justify-end" : "md:justify-start"}`}>
                                            <div className="flex items-center gap-1.5">
                                                <MapPin className="w-4 h-4" />
                                                <span className="font-medium">{era.location}</span>
                                            </div>
                                            <div className="flex items-center gap-1.5">
                                                <Calendar className="w-4 h-4" />
                                                <span className="font-medium">{era.period}</span>
                                            </div>
                                            <span className="px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-800 text-xs font-bold">
                                                {era.age}
                                            </span>
                                        </div>

                                        {/* Title */}
                                        <h3 className="text-2xl md:text-3xl font-black mb-4 text-slate-900 dark:text-white">
                                            {era.title}
                                        </h3>

                                        {/* Body */}
                                        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-6">
                                            {era.body}
                                        </p>

                                        {/* Quote */}
                                        <div className="relative p-4 rounded-xl bg-white dark:bg-slate-950 border-l-4 border-primary mb-6">
                                            <Quote className="absolute top-4 right-4 w-6 h-6 text-primary/20" />
                                            <p className="text-sm md:text-base font-medium italic text-slate-800 dark:text-slate-200">
                                                "{era.quote}"
                                            </p>
                                        </div>

                                        {/* Tags */}
                                        <div className={`flex flex-wrap gap-2 ${index % 2 === 0 ? "md:justify-end" : "md:justify-start"}`}>
                                            {era.tags.map((tag) => (
                                                <span
                                                    key={tag}
                                                    className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider"
                                                >
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Spacer for opposite side */}
                                <div className="hidden md:block w-[calc(50%-3rem)]" />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
