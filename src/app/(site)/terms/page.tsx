"use client";

import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';

export default function TermsPage() {
    const { language } = useLanguage();

    const content = {
        en: {
            title: "Terms of Use",
            effectiveDate: "Effective as of February 6, 2026",
            welcome: {
                title: "Welcome to Garaad",
                text: "These Terms of Use govern your access to and use of Garaad.org (the \"Platform\"), including our website, mobile applications, and all related services (collectively, the \"Service\"). The Service is owned and operated by Garaad (\"we,\" \"us,\" or \"our\"). By using the Service, you agree to these terms. If you don't agree, please don't use our Platform."
            },
            sections: [
                {
                    title: "1. Access to the Service",
                    content: "The Service is for your personal, non-commercial use. We may change, suspend, or discontinue any part of the Service at any time without notice."
                },
                {
                    title: "Age Requirements",
                    content: "If you are under 18, you must have permission from a parent or guardian to use the Service."
                },
                {
                    title: "2. Fees and Subscriptions",
                    content: "Basic access to Garaad is free. Explorer subscription gives access to all gamified courses, community, and launchpad (view only). Challenge is a quarterly 4–6 week mentorship program with launchpad submit access; course access is not included unless you also have Explorer. Current pricing is shown on the Subscribe page. All fees are charged through your online account. Subscriptions automatically renew unless you cancel. You must cancel at least 1 business day before renewal to avoid charges. Fees are non-refundable except as required by law. We may change prices with notice to you. To cancel your subscription, email us at info@garaad.org or use the cancellation option in your account settings."
                },
                {
                    title: "3. Your Content",
                    content: "When you submit content to the Platform (such as comments or solutions), you grant us a license to use, display, and distribute that content to operate and improve the Service. You are responsible for your content and must ensure it: Doesn't violate anyone's rights, isn't harmful, offensive, or illegal, doesn't contain false information, and is appropriate for all ages. We may remove any content that violates these terms."
                },
                {
                    title: "4. What You Can't Do",
                    content: "You agree not to: Scrape, copy, or harvest data from the Platform, attempt to hack or breach our security, impersonate others or create fake accounts, use the Service for any illegal purpose, or interfere with other users' access to the Service."
                },
                {
                    title: "5. Intellectual Property",
                    content: "All content on the Platform (lessons, problems, videos, designs) is protected by copyright and other laws. You may use it for personal learning, but you can't copy, distribute, or create derivative works without our permission."
                },
                {
                    title: "6. Disclaimers",
                    content: "THE SERVICE IS PROVIDED \"AS IS\" WITHOUT WARRANTIES OF ANY KIND. WE DON'T GUARANTEE THAT: The Service will always be available or error-free, all content will be accurate or complete, or the Service will meet your specific needs."
                },
                {
                    title: "7. Limitation of Liability",
                    content: "To the maximum extent permitted by law, Garaad is not liable for any indirect, incidental, or consequential damages arising from your use of the Service."
                },
                {
                    title: "8. Dispute Resolution",
                    content: "If you have a concern, please contact us at info@garaad.org. We're committed to resolving issues fairly and quickly. These terms are governed by the laws of the United Kingdom."
                },
                {
                    title: "9. Changes to These Terms",
                    content: "We may update these terms from time to time. We'll notify you of material changes by email or through the Platform. Continued use of the Service after changes means you accept the new terms."
                },
                {
                    title: "10. Contact Us",
                    content: "Questions about these terms? Contact us: Email: info@garaad.org, Address: London, UK"
                }

            ]
        },
        so: {
            title: "Shuruudaha Isticmaalka",
            effectiveDate: "Wax ku ool ah laga bilaabo: 6-da Febraayo, 2026",
            welcome: {
                title: "Ku soo dhowow Garaad",
                text: "Shuruudahan Isticmaalka waxay maamulayaan gelitaankaaga iyo isticmaalkaaga ee Garaad.org (oo laga wado \"Madalka\"), oo ay ku jiraan mareegtayada, barnaamijyadeenna moobilka, iyo dhammaan adeegyada la xiriira (wadajir ahaan loo yaqaan \"Adeegga\"). Adeegga waxaa iska leh oo maamula Garaad (\"anaga\", \"annaga\", ama \"keenna\"). Markaad isticmaasho Adeegga, waxaad ku raacsan tahay shuruudahan. Haddii aadan ku raacsanayn, fadlan ha isticmaalin Madalka."
            },
            sections: [
                {
                    title: "1. Helitaanka Adeegga",
                    content: "Adeegga waxaa loogu talagalay isticmaalkaaga shaqsiyeed ee aan ganacsi ahayn. Waxaan beddeli karnaa, joojin karnaa, ama hakad gelin karnaa qayb kasta oo Adeegga ah wakhti kasta ogeysiis la’aan."
                },
                {
                    title: "Shuruudaha Da’da",
                    content: "Haddii aad ka yar tahay 18 sano, waa in aad haysaa oggolaanshaha waalid ama mas’uul si aad u isticmaasho Adeegga."
                },
                {
                    title: "2. Kharashaadka iyo Is-diiwaangelinta",
                    content: "Helitaanka aasaasiga ah ee Garaad waa bilaash. Haddii aad doorato in aad is-diiwaangeliso si aad u hesho astaamo dheeraad ah: Dhammaan khidmadaha waxaa lagu soo xareeyaa akoonkaaga internetka. Is-diiwaangelintu si toos ah ayey isu cusboonaysiinaysaa haddii aadan kansalin. Waa inaad kansashaa ugu yaraan hal maalin shaqo ka hor cusboonaysiinta si aad uga fogaato lacag-dalacsiin. Kharashaadka lama soo celinayo, marka laga reebo haddii sharcigu qasbo. Waxaan isku beddeli karnaa qiimaha, ogeysiis ayaana laguu soo diri doonaa. Si aad u kansasho is-diiwaangelintaada, nagala soo xiriir info@garaad.org ama isticmaal xulashada kansalka ee goobaha akoonkaaga."
                },
                {
                    title: "3. Nuxurkaaga (Content)",
                    content: "Markaad soo geliso wax nuxur ah Madalka (sida faallooyin ama xalal), waxaad na siineysaa ruqsad aan xadidnayn oo aan toos ahayn oo aan ku isticmaalno, ku muujinno, oo ku qaybinno nuxurkaas si aan u howlgalino una horumarino Adeegga. Adiga ayaa mas’uul ka ah nuxurka aad soo gudbiso, waa innaad hubisaa inuusan: Ku xadgudbin xuquuqda cid kale, ahayn mid waxyeello ama aflagaaddo leh, ama sharci-darro ah, xambaarsan macluumaad been ah, ku habboon yahay dhammaan da’daha. Waxaan tirtiri karnaa nuxur kasta oo jebiya shuruudahan."
                },
                {
                    title: "4. Waxyaabaha Aadan Samayn Karin",
                    content: "Waxaad ku raacaysaa inaadan: Nuqulan, xoqin, ama ururin xogta Madalka, isku dayin inaad jebiso ama weerarto amniga adeegga, ku milicsan dadka kale ama aad samaysato akoono been ah, u isticmaalin adeegga ujeeddo sharci-darro ah, faragelin isticmaalka Adeegga ee dadka kale."
                },
                {
                    title: "5. Xuquuqda Hantida Maskaxda (Intellectual Property)",
                    content: "Dhammaan nuxurka Madalka (casharro, dhibaatooyin, fiidiyowyo, naqshado) waxaa ilaaliya xuquuqda daabacaadda iyo sharciyo kale. Waxaad u isticmaali kartaa barashadaada shakhsiyadeed, laakiin ma nuqulan kartid, qaybin kartid, ama ka dhigi kartid shaqooyin farcaamaan la’aan oggolaansho naga iman."
                },
                {
                    title: "6. Caddeyn La’aan (Disclaimers)",
                    content: "ADEEGGA WAA SIDUU YAHAY, LAMA SIINAYO DAMIINNO AMA BALANQAADYO NOOC KASTA AH. MA DAMMAANAD QAADNO IN: Adeeggu had iyo jeer shaqayn doono ama qalad la’aan noqon doono. Dhammaan nuxurku sax ama dhammaystiran yahay. Adeeggu buuxin doono baahiyahaaga gaarka ah."
                },
                {
                    title: "7. Xaddidaadda Mas’uuliyadda",
                    content: "Ilaa heerka ugu sarreeya ee uu sharcigu oggol yahay, Garaad mas’uul kama aha waxyeellooyin si toos ah ama si dadban uga dhasha isticmaalka Adeegga."
                },
                {
                    title: "8. Xallinta Khilaafaadka",
                    content: "Haddii aad qabto walaac, fadlan nala soo xiriir info@garaad.org. Waxaan u heellanahay in aan si cadaalad ah oo dhaqso leh u xallinno arrimaha. Shuruudahan waxaa maamula sharciyada Boqortooyada Ingiriiska (United Kingdom)."
                },
                {
                    title: "9. Isbeddellada Shuruudahan",
                    content: "Mararka qaar waxaan cusboonaysiin karnaa shuruudahan. Isbeddello muhiim ah ayaannu ku ogeysiin doonaa iimayl ahaan ama annagoo adeegsanayna Madalka. Adeegsiga joogtada ah kadib isbeddelka waxay ka dhigan tahay inaad aqbashay shuruudaha cusub."
                },
                {
                    title: "10. Nala Soo Xiriir",
                    content: "Su’aalo ku saabsan shuruudahan? Nala soo xiriir: Iimayl: info@garaad.org, Cinwaan: London, UK"
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

                {/* Content */}
                <div className="prose prose-lg max-w-none">
                    <section className="mb-8">
                        <h2 className="text-2xl font-bold text-foreground mb-4">{t.welcome.title}</h2>
                        <p className="text-foreground/80 leading-relaxed">
                            {t.welcome.text}
                        </p>
                    </section>

                    {t.sections.map((section, index) => (
                        <section className="mb-8" key={index}>
                            <h2 className="text-xl font-bold text-foreground mb-3 mt-6">{section.title}</h2>
                            <p className="text-foreground/80 leading-relaxed">{section.content}</p>
                        </section>
                    ))}
                </div>
            </div>
        </div>
    );
}
