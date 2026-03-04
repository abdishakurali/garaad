"use client";

import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';

export default function PrivacyPage() {
    const { language } = useLanguage();

    const content = {
        en: {
            title: "Privacy Policy",
            effectiveDate: "Effective as of February 6, 2026",
            snapshot: {
                title: "Privacy Snapshot",
                text: "We collect only what we need to provide you with a great learning experience. We don't sell your data, and we're transparent about how we use it."
            },
            sections: [
                {
                    title: "What We Collect",
                    content: "Information You Provide: Account Information (Name, email, age, profile picture), Learning Data (Courses accessed, progress, answers, and interactions), Payment Information (Processed by our payment providers, we don't store card numbers), Communications (Messages you send us for support or feedback).\n\nAutomatic Data Collection: Device Information (Browser type, operating system, IP address), Usage Data (Pages viewed, features used, time spent), Cookies (Small files that help us remember your preferences)."
                },
                {
                    title: "How We Use Your Information",
                    content: "Provide the Service: Deliver lessons, track progress, personalize learning. Improve Our Platform: Analyze usage patterns, fix bugs, develop new features. Communicate: Send important updates, respond to support requests. Safety: Prevent fraud, enforce our terms, protect users."
                },
                {
                    title: "How We Share Your Information",
                    content: "We don't sell your personal information. We may share it with: Service Providers (Companies that help us operate - hosting, analytics, payment processing), Legal Requirements (When required by law or to protect rights and safety), Business Transfers (If Garaad is acquired or merged with another company)."
                },

                {
                    title: "Your Privacy Rights",
                    content: "You have the right to: Access (Request a copy of your personal information), Correct (Update inaccurate information), Delete (Request deletion of your data), Opt-Out (Unsubscribe from marketing emails), Export (Download your data in a portable format). To exercise these rights, email us at info@garaad.org or use the data export feature in your account settings."
                },
                {
                    title: "Data Security",
                    content: "We use industry-standard security measures to protect your information, including encryption, secure servers, and access controls. However, no system is 100% secure, so we can't guarantee absolute security."
                },
                {
                    title: "Data Retention",
                    content: "We keep your information as long as your account is active or as needed to provide the Service. You can request deletion at any time."
                },
                {
                    title: "Cookies and Tracking",
                    content: "We use cookies to: Remember your login and preferences, Understand how you use the Platform, Improve our Service. You can disable cookies in your browser settings, but some features may not work properly."
                },
                {
                    title: "International Users",
                    content: "Your information may be transferred to and stored in the United States. By using the Service, you consent to this transfer."
                },
                {
                    title: "Changes to This Policy",
                    content: "We may update this Privacy Policy from time to time. We'll notify you of significant changes by email or through the Platform."
                },
                {
                    title: "Contact Us",
                    content: "Questions or concerns about privacy? Contact us: Email: info@garaad.org, Address: London, UK"
                }
            ]
        },
        so: {
            title: "Qaanuunka Arrimaha Gaarka ah (Privacy Policy)",
            effectiveDate: "Wax ku ool ah laga bilaabo: 6-da Febraayo, 2026",
            snapshot: {
                title: "Dulmar Kooban (Privacy Snapshot)",
                text: "Waxaan ururinaa oo keliya xogta aan ugu baahan nahay si aan kuu siino khibrad waxbarasho oo wanaagsan. Ma iibinno xogtaada, waxaana si daahfuran u sheegaynaa sida aan u isticmaalno."
            },
            sections: [
                {
                    title: "Waxa Aan Ururinno",
                    content: "Xogta Aad Bixiso: Macluumaadka Akoonka (Magaca, iimaylka, da’da, sawirka astaanta), Xogta Waxbarashada (Koorsooyinka aad gasho, horumarkaaga, jawaabaha, iyo isdhexgalka), Macluumaadka Lacag-bixinta (Waxaa maamula adeeg bixiyeyaasha lacag-bixinta, ma kaydinno lambarrada kaararka), Isgaarsiinta (Farriimaha aad noo dirto taageero ama jawaab celin ahaan).\n\nUrurinta Xogta Si Toos ah: Xogta Aaladda (Nooca browser-ka, nidaamka hawlgalka, ciwaanka IP), Xogta Isticmaalka (Bogagga la daawaday, astaamaha la isticmaalay, waqtiga la qaatay), Kukiyada (Faylal yaryar oo naga caawiya inaan xasuusano doorbidkaaga)."
                },
                {
                    title: "Sida Aan U Isticmaalno Xogtaada",
                    content: "Bixinta Adeegga: Casharro siinta, la socodka horumarka, iyo waxbarasho shaqsiyaysan. Horumarinta Madalka: Falanqaynta qaabka isticmaalka, hagaajinta qaladaadka, iyo abuurista astaamo cusub. Isgaarsiinta: Dirista ogeysiisyo muhiim ah, ka jawaabidda codsiyada taageerada. Badbaadada: Ka hortagga khiyaanooyinka, ilaalinta xuquuqda, iyo ilaalinta isticmaalayaasha."
                },
                {
                    title: "Sida Aan U Wadaagno Xogtaada",
                    content: "Ma iibinno macluumaadkaaga gaarka ah. Si kastaba ha ahaatee, waxaan la wadaagi karnaa: Adeeg bixiyeyaasha (Shirkadaha naga caawiya hawlgalka - martigelinta, falanqaynta, lacag-bixinta), Shuruudaha sharciga (Marka uu sharcigu qasbo ama si loo ilaaliyo xuquuqda iyo badbaadada), Is-beddel ganacsi (Haddii Garaad la iibsado ama la midoobo shirkad kale)."
                },

                {
                    title: "Xuquuqda Gaarka ah ee Isticmaalaha",
                    content: "Waxaad leedahay xuquuqda aad ku: Helitaan (Codsato nuqul xogtaada shaqsiyadeed), Saxid (Cusboonaysiiso macluumaad khaldan), Tirtirid (Codsato tirtiridda xogtaada), Ka Bixid (Ka bax suuq-geynta iimaylada), Dhoofin (Soo dejiso xogtaada si fudud loo qaadi karo). Si aad u isticmaasho xuquuqahan, nagala soo xiriir info@garaad.org ama isticmaal doorashada data export ee goobaha akoonkaaga."
                },
                {
                    title: "Amniga Xogta (Data Security)",
                    content: "Waxaan adeegsannaa habab amni oo heer warshadeed ah si aan u ilaalino xogtaada, oo ay ku jiraan sirgelin (encryption), serverro ammaan ah, iyo xakameyn gelitaan. Si kastaba ha ahaatee, ma jirto nidaam amni oo gebi ahaanba sugan, sidaas darteed ma dammaanad qaadi karno ilaalin buuxda."
                },
                {
                    title: "Kaydinta Xogta (Data Retention)",
                    content: "Waxaan haynaa xogtaada inta akoonkaagu firfircoon yahay ama inta loo baahan yahay si loo bixiyo Adeegga. Waxaad mar kasta codsan kartaa in xogtaada la tirtiro."
                },
                {
                    title: "Kukiyada iyo Dareemidda Raadka (Cookies and Tracking)",
                    content: "Waxaan isticmaalnaa kukiyo si aan u: Xasuusanno gelitaankaaga iyo doorbidkaaga, Fahanno sida aad u isticmaasho Madalka, Hagaajino Adeegga. Waxaad damin kartaa kukiyada adigoo isticmaalaya goobaha browser-kaaga, laakiin astaamo qaarkood si buuxda uma shaqeyn karaan."
                },
                {
                    title: "Isticmaalayaasha Caalamiga ah (International Users)",
                    content: "Xogtaada waxaa laga yaabaa in loo wareejiyo laguna kaydiyo Mareykanka. Markaad Adeegga isticmaasho, waxaad oggolaanaysaa wareejintaas xogeed."
                },
                {
                    title: "Isbeddellada Qaanuunkan",
                    content: "Waxaan mararka qaar cusboonaysiinnaa Qaanuunka Arrimaha Gaarka ah. Isbeddellada muhiimka ah waxaan ku ogeysiin doonaa iimayl ahaan ama Madalka dhexdiisa."
                },
                {
                    title: "Nala Soo Xiriir",
                    content: "Su’aalo ama walaac ku saabsan arrimaha gaarka ah? Nala soo xiriir: Iimayl: info@garaad.org, Cinwaan: London, UK"
                }
            ]
        }
    };

    const t = content[language];

    return (
        <div className="min-h-screen bg-background">
            <div className="max-w-4xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-12">
                    <div className="flex items-center justify-between mb-4">
                        <Link href="/" className="text-primary hover:underline text-sm font-medium inline-block">
                            ← {language === 'en' ? "Back to Home" : "Kusoo noqo Guriga"}
                        </Link>
                        <LanguageSwitcher />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black text-foreground mb-2 tracking-tight">
                        {t.title}
                    </h1>
                    <p className="text-muted-foreground">
                        {t.effectiveDate}
                    </p>
                </div>

                {/* Quick Summary */}
                <div className="bg-primary/5 border-l-4 border-primary rounded-r-2xl p-6 mb-12">
                    <h2 className="text-xl font-bold text-foreground mb-3">{t.snapshot.title}</h2>
                    <p className="text-foreground/80 leading-relaxed">
                        {t.snapshot.text}
                    </p>
                </div>

                {/* Content */}
                <div className="prose prose-lg max-w-none">
                    {t.sections.map((section, index) => (
                        <section className="mb-8" key={index}>
                            <h2 className="text-2xl font-bold text-foreground mb-4">{section.title}</h2>
                            <p className="text-foreground/80 leading-relaxed whitespace-pre-wrap">{section.content}</p>
                        </section>
                    ))}
                </div>
            </div>
        </div>
    );
}
