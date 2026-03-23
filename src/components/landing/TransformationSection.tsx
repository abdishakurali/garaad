"use client";

import { useEffect, useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";
import {
    Clock,
    Zap,
    Target,
    CheckCircle2,
    Rocket,
    TrendingUp,
    Search,
    Database,
    Plug,
    Brain,
    Cog,
    Megaphone,
    CreditCard,
    Award,
    BookOpen,
    BarChart3,
    Users,
    Globe,
} from "lucide-react";

interface Week {
    number: number;
    title: string;
    hours: string;
    difficulty: "Beginner" | "Intermediate" | "Advanced";
    win: string;
    skills: string[];
    actions: string[];
}

const weeks: Week[] = [
    {
        number: 1,
        title: "Naqshadda Fikradda ilaa MVP",
        hours: "10-12 saacadood",
        difficulty: "Beginner",
        win: "Fikrad SaaS ah oo la hubiyay iyo suuq cad oo lala beegsado",
        skills: [
            "Baaritaanka suuqa (Market Research)",
            "Xaqiijinta dhibaatada (Problem Validation)",
            "Falanqaynta tartamayaasha",
            "Xaddididda MVP-ga",
        ],
        actions: [
            "Aqoonso 3 dhibaato oo software lagu xallin karo",
            "Warayso 10 qof oo macmiil noqon kara",
            "Falanqee 5 tartame oo suuqa ku jira",
            "Samee liiska sifooyinka ugu muhiimsan ee MVP-ga",
        ],
    },
    {
        number: 2,
        title: "Dhisidda Aaladaha Shaqada",
        hours: "15-18 saacadood",
        difficulty: "Intermediate",
        win: "Nooc tijaabo ah (Prototype) oo leh sifooyinkii aasaasiga ahaa",
        skills: [
            "Horumarinta web-ka ee casriga ah",
            "Naqshadda xog-kaydka (Database)",
            "Xiriirinta API-yada",
            "Habka aqoonsiga dadka (Auth)",
        ],
        actions: [
            "Diyaari goobtaada shaqo ee coding-ka",
            "Dhis habka lagu galo barnaamijka (Login/Signup)",
            "Nashqadeey xog-kaydka barnaamijkaaga",
            "Dhis 2-da sifo ee ugu muhiimsan software-kaaga",
        ],
    },
    {
        number: 3,
        title: "Xiriirinta AI & Otomaatigga",
        hours: "12-15 saacadood",
        difficulty: "Intermediate",
        win: "Awoodo AI ah oo soo jiita isticmaalayaasha",
        skills: [
            "Isticmaalka API-yada AI",
            "Prompt Engineering",
            "Habaynta otomaatigga ah",
            "Maareynta xogta",
        ],
        actions: [
            "Ku xir barnaamijkaaga OpenAI ama adeegyada AI",
            "Dhis sifo xooggan oo ku shaqeysa AI",
            "Samee habab otomaatig u fuliya shaqooyinka",
            "Tijaabi oo sifeey jawaabaha AI-ga",
        ],
    },
    {
        number: 4,
        title: "Daah-furka & Macmiishii Ugu Horreeyay",
        hours: "10-12 saacadood",
        difficulty: "Intermediate",
        win: "Software toos ah iyo 10+ qof oo tijaabinaya",
        skills: [
            "Qorshaha daah-furka (Launch Strategy)",
            "Habaynta bogga hore (Landing Page)",
            "Hagidda isticmaalayaasha cusub",
            "Ururinta ra'yiga macaamiisha",
        ],
        actions: [
            "Internet-ka geli (Deploy) barnaamijkaaga",
            "Abuur bog hore oo soo jiidasho leh",
            "Ku daah-fur barnaamijkaaga Product Hunt ama baraha kale",
            "Ka caawi 10-ka macmiil ee hore sidii ay u isticmaali lahaayeen",
        ],
    },
    {
        number: 5,
        title: "Lacag-samaynta & Ballaarinta",
        hours: "12-15 saacadood",
        difficulty: "Advanced",
        win: "Macmiilkii ugu horreeyay ee bixiya lacag iyo qorshe koboc",
        skills: [
            "Qorsheynta qiimaha (Pricing)",
            "Xiriirinta hababka lacag-bixinta",
            "Suuqgeynta koboca (Growth Marketing)",
            "Haysashada macaamiisha",
        ],
        actions: [
            "Ku xir habka lacag-bixinta sida Stripe ama kuwa kale",
            "U beddel 3 macmiil oo tijaabo ahaa kuwa lacag bixiya",
            "Abuur hab ay macaamiishu ku soo xera galiyaan kuwa kale",
            "Deji qorshaha koboca ee 30-ka maalmood ee soo socda",
        ],
    },
    {
        number: 6,
        title: "Xaqiijinta & Shahaadada MERN",
        hours: "10-14 saacadood",
        difficulty: "Advanced",
        win: "Mashruucaaga oo diyaar ah, shahaadada MERN, iyo qorshe xiga oo cad",
        skills: [
            "Dib-u-eegista koodka (Code review)",
            "Hagaajinta waxqabadka (Performance)",
            "Diyaarinta portfolio & CV",
            "Wicitaanka xiga & taageerada joogtada ah",
        ],
        actions: [
            "Dhammaystir mashruuca ugu dambeeya ee MERN",
            "Soo gudbi dib-u-eegis kooxda",
            "Diyaari demo iyo sharaxaad ganacsi",
            "Ka qayb gal wicitaanka toddobaadlaha ah",
        ],
    },
];

const difficultyColors = {
    Beginner: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
    Intermediate: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
    Advanced: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
};

const difficultyLabelSo: Record<Week["difficulty"], string> = {
    Beginner: "Bilow",
    Intermediate: "Dhexdhexaad",
    Advanced: "Heer sare",
};

function skillIconFor(text: string): LucideIcon {
    const s = text.toLowerCase();
    if (/market|suuq|baaritaan|tartam|validation|xaqiijin/i.test(s)) return Search;
    if (/database|xog|mongo|postgres|sql/i.test(s)) return Database;
    if (/api|xiriir|stripe|lacag/i.test(s)) return Plug;
    if (/ai|openai|prompt|otomaatig/i.test(s)) return Brain;
    if (/auth|login|signup|aqoons/i.test(s)) return Users;
    if (/deploy|internet|bog|landing|daah/i.test(s)) return Globe;
    if (/pricing|qiime|macaami|haysash/i.test(s)) return CreditCard;
    if (/marketing|suuqgeyn|koboc/i.test(s)) return Megaphone;
    if (/review|dib-u-eeg|portfolio|shahaad|performance/i.test(s)) return Award;
    if (/web|horumar|react|frontend/i.test(s)) return Cog;
    if (/qorshe|strategy|falanqayn/i.test(s)) return BarChart3;
    if (/tijaab|beta|macmiil/i.test(s)) return Users;
    return BookOpen;
}

function SkillIcon({ text }: { text: string }) {
    const Icon = skillIconFor(text);
    return <Icon className="h-4 w-4 shrink-0 text-slate-500 dark:text-zinc-500" aria-hidden />;
}

export interface TransformationSectionProps {
    /** Max weeks to show (default 6). Challenge page uses 5. */
    weekCount?: number;
    /** Merged onto the outer `<section>` (e.g. challenge page rhythm). */
    className?: string;
}

export function TransformationSection({ weekCount = 6, className }: TransformationSectionProps) {
    const weeksShown = useMemo(() => weeks.slice(0, Math.min(weekCount, weeks.length)), [weekCount]);
    const [selectedWeek, setSelectedWeek] = useState(0);

    const safeIndex = Math.min(selectedWeek, Math.max(0, weeksShown.length - 1));
    const currentWeek = weeksShown[safeIndex];

    useEffect(() => {
        if (selectedWeek > weeksShown.length - 1) {
            setSelectedWeek(Math.max(0, weeksShown.length - 1));
        }
    }, [weeksShown.length, selectedWeek]);

    return (
        <section
            className={cn(
                "relative overflow-hidden bg-slate-50 py-14 dark:bg-zinc-950 sm:py-16 md:py-20",
                className
            )}
        >
            <div className="relative mx-auto max-w-7xl px-3 sm:px-4 md:px-6 lg:px-8">
                {/* Section Header */}
                <div className="mb-10 text-center sm:mb-12 md:mb-14">
                    <h2 className="mb-3 text-2xl font-bold tracking-tight text-slate-900 dark:text-zinc-50 sm:text-3xl md:text-4xl">
                        <span className="text-violet-400 dark:text-violet-400">Wadada</span>{" "}
                        <span className="text-slate-900 dark:text-zinc-100">Todobaadka</span>
                    </h2>
                    <p className="mx-auto max-w-2xl text-sm text-slate-500 dark:text-zinc-500 sm:text-base">
                        Ka dhise ilaa aasaasaha
                    </p>
                </div>

                {/* Week Selector */}
                <div className="mb-8 flex flex-wrap justify-center gap-2 sm:mb-10 sm:gap-2 md:mb-12">
                    {weeksShown.map((week, index) => (
                        <button
                            key={week.number}
                            type="button"
                            onClick={() => setSelectedWeek(index)}
                            className={`inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors sm:px-4 sm:py-2.5 ${safeIndex === index
                                ? "bg-violet-600 text-white dark:bg-violet-600"
                                : "border border-slate-300 bg-white text-slate-600 hover:bg-slate-50 dark:border-white/10 dark:bg-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800"
                                }`}
                        >
                            <span className="text-lg tabular-nums opacity-90">{week.number}</span>
                            <span className="hidden sm:inline">Todobaadka {week.number}</span>
                            <span className="sm:hidden">T{week.number}</span>
                        </button>
                    ))}
                </div>

                {/* Week Content */}
                <div className="mx-auto max-w-5xl">
                    <div className="rounded-lg border border-slate-200 bg-white p-6 dark:border-white/10 dark:bg-zinc-900 md:p-8">
                        {/* Week Header */}
                        <div className="mb-6 flex flex-col gap-4 border-b border-slate-200 pb-6 dark:border-white/10 md:flex-row md:items-center md:justify-between">
                            <div>
                                <div className="mb-2 flex items-center gap-3">
                                    <span className="text-3xl font-bold text-violet-600 dark:text-violet-400 md:text-4xl">
                                        {currentWeek.number}
                                    </span>
                                    <div>
                                        <h3 className="text-lg font-bold text-slate-900 dark:text-zinc-50 md:text-xl">
                                            {currentWeek.title}
                                        </h3>
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 dark:border-white/10 dark:bg-zinc-950">
                                    <Clock className="h-4 w-4 text-zinc-500 dark:text-zinc-400" />
                                    <span className="text-sm font-medium text-slate-800 dark:text-zinc-200">
                                        {currentWeek.hours}
                                    </span>
                                </div>
                                <div className={`rounded-lg px-3 py-2 text-sm font-medium ${difficultyColors[currentWeek.difficulty]}`}>
                                    <Zap className="w-4 h-4 inline mr-1" />
                                    {difficultyLabelSo[currentWeek.difficulty]}
                                </div>
                            </div>
                        </div>

                        {/* The Win */}
                        <div className="mb-6 rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-white/10 dark:bg-zinc-950 sm:p-5">
                            <div className="flex items-start gap-3">
                                <Target className="mt-0.5 h-5 w-5 shrink-0 text-slate-400 dark:text-zinc-500" />
                                <div>
                                    <h4 className="mb-1 text-sm font-semibold text-slate-900 dark:text-zinc-200">
                                        Guusha toddobaadka
                                    </h4>
                                    <p className="text-sm leading-relaxed text-slate-600 dark:text-zinc-400 md:text-base">
                                        {currentWeek.win}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Skills to Master */}
                        <div className="mb-6">
                            <h4 className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-zinc-200">
                                <Rocket className="h-4 w-4 text-zinc-500" />
                                Maxaad baran doontaa
                            </h4>
                            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 sm:gap-3">
                                {currentWeek.skills.map((skill, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 p-3 dark:border-white/10 dark:bg-zinc-950"
                                    >
                                        <SkillIcon text={skill} />
                                        <span className="text-sm text-slate-700 dark:text-zinc-300">{skill}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Weekly Actions */}
                        <div>
                            <h4 className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-zinc-200">
                                <TrendingUp className="h-4 w-4 text-zinc-500" />
                                Qorshaha hawleedka
                            </h4>
                            <div className="space-y-2">
                                {currentWeek.actions.map((action, index) => (
                                    <div
                                        key={index}
                                        className="flex items-start gap-3 rounded-lg border border-slate-200 bg-slate-50 p-3 dark:border-white/10 dark:bg-zinc-950"
                                    >
                                        <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded border border-slate-200 bg-white text-xs font-medium text-slate-500 dark:border-white/10 dark:bg-zinc-900 dark:text-zinc-500">
                                            {index + 1}
                                        </span>
                                        <p className="text-sm leading-relaxed text-slate-700 dark:text-zinc-300">{action}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Progress Indicator */}
                    <div className="mt-6 flex items-center justify-center gap-1.5">
                        {weeksShown.map((_, index) => (
                            <div
                                key={index}
                                className={`h-1.5 rounded-full transition-all ${index === safeIndex ? "w-8 bg-violet-500" : "w-1.5 bg-zinc-700"}`}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
