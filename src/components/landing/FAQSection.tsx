"use client";

import { useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";

interface FAQ {
    question: string;
    answer: string;
}

const faqs: FAQ[] = [
    {
        question: "Do I need any experience with computers?",
        answer: "You need basic computer skills and willingness to learn. If you can browse the web and use social media, you have enough to start. We'll teach you everything else step by step, from coding basics to advanced SaaS development.",
    },
    {
        question: "Is this only for Somalis?",
        answer: "While our founder's story is rooted in the Somali experience and we're passionate about empowering Somali youth, this challenge is open to anyone worldwide who wants to build a profitable SaaS business. The principles and strategies work regardless of your background.",
    },
    {
        question: "How fast will I see results?",
        answer: "You'll have a working prototype by Week 2, launch to real users by Week 4, and aim for your first paying customer by Week 5. However, building a sustainable business takes time beyond these 5 weeks. This challenge gives you the foundation and momentum to continue growing.",
    },
    {
        question: "What if I don't have much time?",
        answer: "The program is designed for busy people. Each week requires 10-18 hours of focused work. You can spread this across evenings and weekends. The key is consistency—even 2 hours a day will get you there. We provide clear priorities so you focus on what matters most.",
    },
    {
        question: "What tools will I learn?",
        answer: "You'll master modern web development (Next.js, React, TypeScript), AI integration (OpenAI API), databases (PostgreSQL/Supabase), authentication (NextAuth), payments (Stripe), and deployment (Vercel). All industry-standard tools used by successful SaaS companies.",
    },
    {
        question: "Can I really make money from this?",
        answer: "Yes, if you execute. By Week 5, you'll have the skills and product to start generating revenue. Many students land their first paying customer within the challenge period. Your success depends on your commitment, the problem you solve, and how well you serve your customers. We provide the roadmap—you provide the hustle.",
    },
];

export function FAQSection() {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    const toggleFAQ = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <section className="relative py-20 md:py-32 bg-white dark:bg-slate-950 overflow-hidden">
            {/* Background */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,.02)_1px,transparent_1px)] dark:bg-[linear-gradient(rgba(255,255,255,.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.02)_1px,transparent_1px)] bg-[size:64px_64px]" />

            <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section Header */}
                <div className="text-center mb-16">
                    <div className="inline-block px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
                        <span className="text-sm font-bold text-primary uppercase tracking-wider">
                            Su'aalaha | FAQ
                        </span>
                    </div>
                    <h2 className="text-4xl sm:text-5xl md:text-6xl font-black mb-6">
                        Ma qabtaa su'aalo?{" "}
                        <br />
                        <span className="bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">
                            We Have Answers
                        </span>
                    </h2>
                    <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400">
                        Everything you need to know about the 5-Week Tech Challenge.
                    </p>
                </div>

                {/* FAQ Accordion */}
                <div className="space-y-4">
                    {faqs.map((faq, index) => (
                        <div
                            key={index}
                            className="bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden transition-all duration-300 hover:border-primary/50 dark:hover:border-primary/50"
                        >
                            <button
                                onClick={() => toggleFAQ(index)}
                                className="w-full flex items-center justify-between gap-4 p-6 text-left transition-colors hover:bg-slate-100 dark:hover:bg-slate-800"
                            >
                                <div className="flex items-start gap-4 flex-1">
                                    <HelpCircle className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                                    <h3 className="text-lg md:text-xl font-bold text-slate-900 dark:text-white">
                                        {faq.question}
                                    </h3>
                                </div>
                                <ChevronDown
                                    className={`w-6 h-6 text-slate-600 dark:text-slate-400 flex-shrink-0 transition-transform duration-300 ${openIndex === index ? "rotate-180" : ""
                                        }`}
                                />
                            </button>
                            <div
                                className={`overflow-hidden transition-all duration-300 ${openIndex === index ? "max-h-96" : "max-h-0"
                                    }`}
                            >
                                <div className="px-6 pb-6 pl-16">
                                    <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                                        {faq.answer}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Still Have Questions CTA */}
                <div className="mt-12 text-center p-8 rounded-2xl bg-gradient-to-br from-primary/10 to-purple-500/10 border border-primary/20">
                    <h3 className="text-2xl font-bold mb-3 text-slate-900 dark:text-white">
                        Weli ma haysaa su'aalo kale?
                    </h3>
                    <p className="text-slate-700 dark:text-slate-300 mb-6">
                        Nagala soo xiriir WhatsApp si aan kuugu caawino.
                    </p>
                    <a
                        href="https://wa.me/252618995283?text=Salaan!%20Waan%20rabaa%20inaan%20wax%20weydiiyo%20Garaad."
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-primary hover:bg-primary/90 text-white font-bold rounded-xl transition-all duration-300 hover:scale-105"
                    >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                        </svg>
                        Nala Soo Xiriir (Contact Us)
                    </a>
                </div>
            </div>
        </section>
    );
}
