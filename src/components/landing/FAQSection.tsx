"use client";

import { useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";

interface FAQ {
    question: string;
    answer: string;
}

const faqs: FAQ[] = [
    {
        question: "Ma u baahanahay aqoon coding ah si aan u bilaabo?",
        answer: "Maya, waxaad u baahan tahay oo kaliya aqoonta aasaasiga ah ee isticmaalka kombuyuutarka iyo rabitaan barasho. Haddii aad taqaanid isticmaalka baraha bulshada iyo internet-ka, intaas ayaa kuugu filan. Wax kasta oo kale, laga bilaabo aasaaska coding-ka ilaa dhisidda SaaS, tallaabo-tallaabo ayaan kuu bari doonnaa.",
    },
    {
        question: "Yaa ka qaybgali kara tartankan?",
        answer: "Tartankan waxaa loogu talagalay qof kasta oo raba inuu dhiso ganacsi software dhab ah. In kasta oo aan xoogga saarno dhiirigelinta dhallinyarada Soomaaliyeed, haddana qof kasta oo dunida ku nool oo raba inuu barto dhisidda SaaS wuu ku soo biiri karaa. Qorshayaashan waxay u shaqaynayaan qof kasta, meel kasta oo uu joogo.",
    },
    {
        question: "Goormaan arki doonaa natiijooyin dhab ah?",
        answer: "Toddobaadka 2-aad waxaad haysan doontaa prototype shaqeynaya, Toddobaadka 4-aad waxaad u soo bandhigi doontaa macaamiil dhab ah, Toddobaadka 5-aadna hadafkeenu waa inaad hesho macmiilkii ugu horreeyay ee lacag bixiya. Garaad wuxuu ku siinayaa dhammaan agabkii aad ku bilaabi lahayd oo aad ku guulaysan lahayd.",
    },
    {
        question: "Haddaanan waqti badan haysan, ma maareyn karaa?",
        answer: "Haa, barnaamijkan waxaa loogu talagalay dadka mashquulka ah. Mid kasta oo ka mid ah 5-ta toddobaad wuxuu u baahan yahay 10-18 saacadood oo shaqo xooggan ah. Waxaad u qaybin kartaa habeenkii iyo maalmaha fasaxa. Furaha guushu waa joogteyn—xitaa 2 saacadood maalintii way ku gaarsiin karaan hadafkaba.",
    },
    {
        question: "Waa kuwee agabka ama (tools-ka) aan baran doono?",
        answer: "Waxaad baran doontaa wax kasta oo looga baahan yahay dhisidda SaaS casri ah sida: Next.js, React, TypeScript, AI Integration (OpenAI API), Database-yada (Supabase), Payments (Stripe), iyo Deploy-gareynta. Kuwani waa kuwa ay isticmaalaan shirkadaha software-ka ee ugu guulaha badan caalamka.",
    },
    {
        question: "Runtii lacag ma ka samayn karaa ganacsigan?",
        answer: "Haa, haddii aad si dhab ah u shaqayso. Toddobaadka 5-aad, waxaad haysan doontaa xirfadda iyo software-ka aad ku bilaabi lahayd dakhli samayn. Macaamiil badan ayaa hesha macmiilkoodii ugu horreeyay tartanka gudihiisa. Success-kaaga wuxuu ku xiran yahay sida aad u xalliso dhibaatada macaamiisha iyo dadaalkaaga.",
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
