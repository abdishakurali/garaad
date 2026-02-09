"use client";

import { useState } from "react";
import { Clock, Zap, Target, CheckCircle2, ArrowRight } from "lucide-react";

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
];

const difficultyColors = {
    Beginner: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
    Intermediate: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
    Advanced: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
};

export function TransformationSection() {
    const [selectedWeek, setSelectedWeek] = useState(0);
    const currentWeek = weeks[selectedWeek];

    return (
        <section className="relative py-20 md:py-32 bg-slate-50 dark:bg-slate-900 overflow-hidden">
            {/* Background */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,.02)_1px,transparent_1px)] dark:bg-[linear-gradient(rgba(255,255,255,.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.02)_1px,transparent_1px)] bg-[size:64px_64px]" />

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section Header */}
                <div className="text-center mb-16">
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-black mb-6 uppercase tracking-tighter">
                        <span className="bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">
                            Transformation
                        </span>
                    </h2>
                    <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto font-bold uppercase tracking-widest">
                        Builder to Founder
                    </p>
                </div>

                {/* Week Selector */}
                <div className="flex flex-wrap justify-center gap-3 mb-12">
                    {weeks.map((week, index) => (
                        <button
                            key={week.number}
                            onClick={() => setSelectedWeek(index)}
                            className={`px-6 py-3 rounded-xl font-bold transition-all duration-300 ${selectedWeek === index
                                ? "bg-primary text-white shadow-lg shadow-primary/30 scale-105"
                                : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
                                }`}
                        >
                            Toddobaadka {week.number}
                        </button>
                    ))}
                </div>

                {/* Week Content */}
                <div className="max-w-5xl mx-auto">
                    <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 md:p-12 shadow-2xl border border-slate-200 dark:border-slate-700">
                        {/* Week Header */}
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8 pb-8 border-b border-slate-200 dark:border-slate-700">
                            <div>
                                <div className="flex items-center gap-3 mb-3">
                                    <span className="text-5xl font-black text-primary">
                                        {currentWeek.number}
                                    </span>
                                    <div>
                                        <h3 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white">
                                            {currentWeek.title}
                                        </h3>
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-wrap gap-3">
                                <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-700">
                                    <Clock className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                                    <span className="font-bold text-sm text-slate-900 dark:text-white">
                                        {currentWeek.hours}
                                    </span>
                                </div>
                                <div className={`px-4 py-2 rounded-xl font-bold text-sm ${difficultyColors[currentWeek.difficulty]}`}>
                                    <Zap className="w-4 h-4 inline mr-1" />
                                    {currentWeek.difficulty}
                                </div>
                            </div>
                        </div>

                        {/* The Win */}
                        <div className="mb-8 p-6 rounded-2xl bg-gradient-to-br from-primary/10 to-purple-500/10 border border-primary/20">
                            <div className="flex items-start gap-3">
                                <Target className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                                <div>
                                    <h4 className="font-bold text-lg mb-2 text-slate-900 dark:text-white">
                                        Guusha Toddobaadka (Weekly Win)
                                    </h4>
                                    <p className="text-slate-700 dark:text-slate-300 text-lg">
                                        {currentWeek.win}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Skills to Master */}
                        <div className="mb-8">
                            <h4 className="font-bold text-lg mb-4 text-slate-900 dark:text-white flex items-center gap-2">
                                <Zap className="w-5 h-5 text-primary" />
                                Maxaad Baran doontaa? (Skills)
                            </h4>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {currentWeek.skills.map((skill, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center gap-3 p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700"
                                    >
                                        <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0" />
                                        <span className="font-medium text-slate-700 dark:text-slate-300">
                                            {skill}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Weekly Actions */}
                        <div>
                            <h4 className="font-bold text-lg mb-4 text-slate-900 dark:text-white flex items-center gap-2">
                                <ArrowRight className="w-5 h-5 text-primary" />
                                Qorsha Hawleedka (Action Plan)
                            </h4>
                            <div className="space-y-3">
                                {currentWeek.actions.map((action, index) => (
                                    <div
                                        key={index}
                                        className="flex items-start gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 hover:border-primary/50 dark:hover:border-primary/50 transition-colors"
                                    >
                                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                                            <span className="text-primary font-bold text-sm">
                                                {index + 1}
                                            </span>
                                        </div>
                                        <p className="text-slate-700 dark:text-slate-300 pt-1">
                                            {action}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Progress Indicator */}
                    <div className="mt-8 flex items-center justify-center gap-2">
                        {weeks.map((_, index) => (
                            <div
                                key={index}
                                className={`h-2 rounded-full transition-all duration-300 ${index === selectedWeek
                                    ? "w-12 bg-primary"
                                    : "w-2 bg-slate-300 dark:bg-slate-700"
                                    }`}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
