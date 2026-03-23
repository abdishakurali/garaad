"use client";

import { useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { DEFAULT_WHATSAPP_MESSAGE, whatsappHref } from "@/lib/whatsapp";

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

export function FAQSection({ className }: { className?: string }) {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    const toggleFAQ = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <section
            className={cn(
                "relative overflow-hidden bg-white py-14 dark:bg-zinc-950 sm:py-16 md:py-20",
                className
            )}
        >
            <div className="relative mx-auto max-w-4xl px-3 sm:px-4 md:px-6 lg:px-8">
                {/* Section Header */}
                <div className="mb-10 text-center sm:mb-12">
                    <h2 className="mb-2 text-2xl font-bold text-slate-900 dark:text-zinc-50 sm:text-3xl">
                        Su&apos;aalaha badanaa la isweydiiyo
                    </h2>
                    <p className="text-sm text-slate-500 dark:text-zinc-500">FAQ</p>
                </div>

                {/* FAQ Accordion */}
                <div className="space-y-2">
                    {faqs.map((faq, index) => (
                        <div
                            key={index}
                            className="overflow-hidden rounded-lg border border-slate-200 bg-slate-50 dark:border-white/10 dark:bg-zinc-900"
                        >
                            <button
                                onClick={() => toggleFAQ(index)}
                                className="flex w-full items-center justify-between gap-4 p-4 text-left transition-colors hover:bg-slate-100 dark:hover:bg-zinc-800/80 sm:p-5"
                            >
                                <div className="flex flex-1 items-start gap-3">
                                    <HelpCircle className="mt-0.5 h-5 w-5 shrink-0 text-slate-400 dark:text-zinc-500" />
                                    <h3 className="text-base font-medium text-slate-900 dark:text-zinc-100 sm:text-lg">
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
                                <div className="border-t border-slate-200 px-4 pb-4 pl-12 dark:border-white/10 sm:px-5 sm:pb-5 sm:pl-14">
                                    <p className="text-sm leading-relaxed text-slate-600 dark:text-zinc-400">
                                        {faq.answer}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Still Have Questions CTA */}
                <div className="mt-10 rounded-lg border border-slate-200 bg-slate-50 p-6 text-center dark:border-white/10 dark:bg-zinc-900 sm:p-8">
                    <h3 className="mb-2 text-lg font-semibold text-slate-900 dark:text-zinc-100">
                        Weli ma haysaa su&apos;aalo kale?
                    </h3>
                    <p className="mb-5 text-sm text-slate-600 dark:text-zinc-400">
                        Nagala soo xiriir WhatsApp.
                    </p>
                    <a
                        href={whatsappHref(DEFAULT_WHATSAPP_MESSAGE)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 rounded-lg bg-[#25D366] px-5 py-2.5 text-sm font-semibold text-white hover:opacity-90"
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
