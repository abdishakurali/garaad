"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { Reveal } from "./Reveal";
import { cn } from "@/lib/utils";

const faqs = [
    {
        q: "Garaad maxay tahay?",
        a: "Garaad waa platform-ka coding-ka ugu weyn Somaliya. Waxaad ku baranaysaa React, Next.js, Node.js, MongoDB iyo AI — oo dhan Af-Soomaaliga.",
    },
    {
        q: "Ma bilaash baa?",
        a: "Haa, waxaad bilaash ku bilaabanaysaa. Qorshaha premium-ka ayaa fulinaya dhammaan cashararrada iyo tababarka shakhsi-ahaaneed.",
    },
    {
        q: "Miyaan u baahanahay khibrad hore?",
        a: "Maya, khibrad hore looma baahna. Garaad waxaa loogu talagalay kuwa bilaa khibrad. Waxaad ka bilaabaysaa HTML, CSS, iyo JavaScript aasaasiga ah.",
    },
    {
        q: "Maxay cashararadu ku dhigan yihiin?",
        a: "Dhammaan cashararadu waxay ku dhigan yihiin Af-Soomaali, ereyada farsamada English-ga ah ayaa la dhawraa. Tani waxay barashada fududeynaysaa Soomaaliga adduunka oo dhan.",
    },
    {
        q: "Garaad Challenge maxay tahay?",
        a: "Garaad Challenge waa barnaamij tababar 3 bilood ah oo leh hanuannaan shakhsi-ahaaneed (1:1), dhisidda mashaariic dhabta ah, iyo koox wada-barato — jidka ugu degdegga badan ee aad ku noqonaysid developer xirfad leh.",
    },
    {
        q: "Muddo intee leh ayaan developer ku noqon karaa?",
        a: "Barnaamijka Challenge waa 3 bilood oo adag. 30 daqiiqo maalin walba ayaad ku dhisi kartaa mashaariic dhabta ah oo aad shaqo uga heli kartaa.",
    },
    {
        q: "Maxay taqanatiinta Garaad barto?",
        a: "Garaad waxay barsataa React, Next.js, Node.js, MongoDB (MERN stack), iyo AI — oo la mid ah taqanatiinta ay isticmaalaan shirkadaha teknoolajiyada ugu waaweyn adduunka.",
    },
    {
        q: "Ma heli karaa shaqo Garaad dhammaystirka ka dib?",
        a: "Haa. Garaad waxay bixisaa mashaariic portfolio, shahaadooyin, iyo taageerada raadinta shaqada. Ardaydayadu waxay ka shaqeeyaan shirkadaha teknoolajiyada iyo freelance.",
    },
];

export function FAQSection() {
    const [open, setOpen] = useState<number | null>(null);

    return (
        <section className="py-12 sm:py-16 md:py-20 px-3 sm:px-4 md:px-6 bg-background border-t border-border/50">
            <div className="max-w-3xl mx-auto w-full">
                <Reveal>
                    <div className="text-center mb-8 sm:mb-10 md:mb-12">
                        <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-foreground tracking-tight text-balance">
                            Su'aalaha <span className="text-primary">Badanaa La Weydiiyo</span>
                        </h2>
                        <p className="mt-2 sm:mt-3 text-sm sm:text-base text-muted-foreground leading-relaxed">
                            Haddaad su'aal kale qabtid, nagala soo xiriir WhatsApp-ka.
                        </p>
                    </div>
                </Reveal>

                <Reveal>
                    <div className="space-y-2 sm:space-y-3">
                        {faqs.map((faq, i) => (
                            <div
                                key={i}
                                className={cn(
                                    "rounded-xl sm:rounded-2xl border transition-colors duration-200",
                                    open === i
                                        ? "border-primary/40 bg-primary/5"
                                        : "border-border/50 bg-card hover:border-border"
                                )}
                            >
                                <button
                                    className="flex w-full items-center justify-between gap-4 px-4 sm:px-5 py-4 text-left"
                                    onClick={() => setOpen(open === i ? null : i)}
                                    aria-expanded={open === i}
                                >
                                    <span className="text-sm sm:text-base font-bold text-foreground leading-snug">
                                        {faq.q}
                                    </span>
                                    <ChevronDown
                                        className={cn(
                                            "h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-300",
                                            open === i && "rotate-180 text-primary"
                                        )}
                                    />
                                </button>
                                <div
                                    className={cn(
                                        "overflow-hidden transition-all duration-300",
                                        open === i ? "max-h-96" : "max-h-0"
                                    )}
                                >
                                    <p className="px-4 sm:px-5 pb-4 text-sm sm:text-base text-muted-foreground leading-relaxed">
                                        {faq.a}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </Reveal>
            </div>
        </section>
    );
}
