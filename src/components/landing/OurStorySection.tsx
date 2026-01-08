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
        title: "Mucjisada Is-baridda",
        subtitle: "Toosniin | The Awakening",
        location: "Muqdisho, Soomaaliya",
        period: "2019–2020",
        age: "16–17 Sanno",
        body: "Markii aan ahaa 16 jir, anigoo dareemaya inay waxbarashada rasmiga ahi i xaddidayso, waxaan billabay inaan si madax-banaan u barto koodhka (coding-ka) casriga ah anigoo ka faa'iideysanaya khayraadka ka furan internet-ka.",
        quote: "Barashada dhabta ah waxay ka bilaabataa halka ay hamigu yaallo. Waxaan dhisay mustaqbalkayga anigoo adeegsanaya wax kasta oo gacantayda soo galay.",
        tags: ["Is-barid", "Hammi", "Dadaal"],
        image: "/images/garaad.jpg",
    },
    {
        number: 2,
        title: "Shaqo Madax-banaan",
        subtitle: "Dadaal | The Hustle",
        location: "Muqdisho, Soomaaliya",
        period: "2020–2021",
        age: "17–18 Sanno",
        body: "Waxaan u gudbay dunida shaqada madaxa-banaan (freelancing), anigoo software u dhisay macaamiil caalami ah oo jooga qaaradaha kala duwan. Halkaas waxaan ku bartay maamulka mashaariicda iyo tayada adeegga.",
        quote: "Khibradda dhabta ah waxaa laga helaa shaqada. Mashruuc kasta oo aan qabtay wuxuu ii furaayay albaab cusub.",
        tags: ["Freelancing", "Macaamiil Caalami ah", "Ganacsi"],
        image: "/images/freelancer.png",
    },
    {
        number: 3,
        title: "Dhisaha Caalamiga",
        subtitle: "The Global Builder",
        location: "Nairobi → Yurub",
        period: "2022–2023",
        age: "19–20 Sanno",
        body: "Waxaan fursad u helay inaan si remote ah ula shaqeeyo shirkado teknoolajiyadeed oo fadhigoodu yahay Yurub, anigoo qayb ka ahaa dhisidda barnaamijyo SaaS ah oo ay isticmaalaan kumanaan qof.",
        quote: "Internet-ku xuduud maleh. Waxaan ogaaday in aqoontu tahay baasaboorka kaliya ee aad ugu baahan tahay suuqa caalamiga ah.",
        tags: ["SaaS", "Remote Work", "Engineering"],
        image: "/images/builder.png",
    },
    {
        number: 4,
        title: "Aragtida Fog",
        subtitle: "The Visionary Founder",
        location: "Yurub",
        period: "2023–2024",
        age: "20–21 Sanno",
        body: "Maanta, anigoo maamula dhowr shirkadood oo SaaS ah, hadafkaygu waa inaan dhalinyarada Soomaaliyeed u furaa albaabada teknoolajiyada. Garaad waa halkii aan ku wadaagi lahaa khibraddayda si aan u abuuro saameyn dhab ah.",
        quote: "Guusha dhabta ahi waa markaad kor u qaaddo inta kugu hareeraysan oo aad dhaxal reebto.",
        tags: ["Founder", "Impact", "Community"],
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
