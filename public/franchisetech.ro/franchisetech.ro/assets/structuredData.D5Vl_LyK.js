const e = {
        pos: ["software POS România", "sistem POS restaurant", "POS Datecs România", "software vânzări restaurant", "sistem casă restaurant", "POS fiscal românia", "software bonuri fiscale", "sistem plată restaurant", "POS tabletă restaurant", "software comandă restaurant"],
        restaurant: ["sistem management cafenea", "software cafenea România", "management cafenele", "software pentru cafenele", "sistem comandă cafenea", "software meniu cafenea", "management inventar cafenea", "sistem rezervări cafenea", "software staff cafenea", "management multi-locații cafenele"],
        fiscal: ["sistem fiscal românia", "registrul de casă", "e-factura România", "conformitate fiscală", "software ANAF", "imprimantă fiscală", "bonuri fiscale", "raportări fiscale", "software contabilitate", "sistem fiscalizare"],
        inventory: ["sistem inventar", "management stocuri", "software inventar", "control inventar", "sistem aprovizionare", "management stoc restaurant", "software stocuri", "inventar automat", "sistem warehouse", "management produse"],
        business: ["management afaceri", "software business", "automatizare business", "soluții business", "software enterprise", "management companie", "sistem integrat business", "platformă business", "software profesional", "soluții enterprise"],
        cloud: ["soluții cloud România", "software SaaS", "platformă cloud", "software online", "sistem cloud", "servicii cloud", "software web", "platformă online", "soluții digitale", "software remote"],
        franchise: ["software pentru francize România", "management franciză automatizat", "soluții POS fiscalizare România", "aplicație gestiune stocuri franciză", "platformă centralizată franciză", "rapoarte vânzări franciză", "automatizare procese franciză", "scalabilitate franciză software", "suport franciză România", "conformitate fiscală franciză", "analiză date franciză", "integrare POS fiscalizare", "software franciză mică afacere", "gestionare franciză multiple locații", "automatizare fiscalizare România", "software franchise", "management lanțuri", "sistem multi-locații", "software franșize", "management sucursale", "sistem centralizat", "software lanțuri", "management grup", "sistem distribuție", "software expansion", "CEO franciză România", "director franciză România", "proprietar franciză România", "francizați România", "franchizori România", "software pentru proprietari franciză", "management franciză pentru CEO", "soluții franciză pentru directori", "platformă franciză pentru proprietari", "automatizare franciză pentru franchizori", "dashboard franciză pentru manageri"],
        industries: {
            fastfood: ["software fast food", "sistem fast food", "POS fast food", "management fast food", "software burger", "sistem pizza", "software kebab"],
            healthcare: ["software medical", "sistem cabinet medical", "software clinică", "management medical", "sistem programări medicale", "software farmacie"],
            retail: ["software retail", "sistem magazin", "POS retail", "software shop", "sistem vânzări retail", "management magazin"],
            manufacturing: ["software producție", "sistem manufactură", "management producție", "software industrial", "sistem fabrică", "management operațiuni"]
        },
        longTail: ["aplicație POS pentru francize mici în România", "software de gestiune stocuri pentru francize în România", "platformă de management pentru francize cu multiple locații în România", "soluție de automatizare fiscalizare pentru francize în România", "rapoarte de vânzări personalizate pentru francize în România", "cel mai bun software POS România", "software POS pentru restaurant", "sistem management restaurant complet", "software cafenea cu imprimantă fiscală", "sistem POS cu e-factura", "software restaurant cu inventar", "sistem management afaceri integrat", "software POS Datecs compatibil", "sistem restaurant cu raportări fiscale", "software management multi-locații", "cel mai bun sistem POS restaurant", "software restaurant cu conformitate ANAF", "sistem POS cu backup automat", "software restaurant cu programe loialitate", "sistem management cu analiză vânzări", "software management franciză pentru proprietari 30-70 ani România", "soluții POS pentru CEO franciză România", "platformă management pentru directorii franciză România", "automatizare fiscalizare pentru franchizori România", "dashboard centralizat pentru proprietari franciză România", "software pentru francizați cu vârsta 30-70 ani România", "sistem management cafenele pentru proprietari România", "software POS cafenea pentru manageri România", "automatizare procese pentru proprietari restaurante România", "soluții complete pentru CEO cafenele România"],
        local: ["software POS București", "sistem restaurant Cluj", "software cafenea Timișoara", "POS restaurant Iași", "sistem management Constanța", "software restaurant Brașov", "POS cafenea Craiova", "sistem restaurant Galați", "software POS Ploiești", "management restaurant Arad", "software franciză București", "management franciză Cluj", "soluții franciză Timișoara", "software POS franciză Iași", "management restaurant franciză Constanța", "software cafenele Brașov", "POS franciză Craiova", "sistem management franciză Galați", "software restaurant franciză Ploiești", "management franciză Arad"],
        problems: ["cum să gestionez inventarul restaurantului", "software pentru raportări fiscale", "sistem POS cu imprimantă fiscală", "cum să automatizez restaurantul", "software pentru management staff", "sistem pentru multi-locații", "software cu backup automat", "sistem POS offline", "software cu analiză vânzări", "sistem cu programe loialitate"],
        comparison: ["software POS vs sistem manual", "cel mai bun software restaurant", "comparatie sisteme POS", "software POS vs Excel", "sistem POS vs software contabilitate", "cel mai ieftin software POS", "software POS profesional vs basic", "sistem cloud vs local"],
        features: ["POS cu imprimantă fiscală", "software cu e-factura", "sistem cu inventar automat", "POS cu backup cloud", "software cu raportări automate", "sistem cu programe loialitate", "POS cu analiză vânzări", "software cu multi-locații", "sistem cu staff management", "POS cu integrare contabilitate"]
    },
    o = (t, i) => {
        const a = e.pos.concat(e.restaurant);
        switch (t) {
            case "home":
                return a.concat(["software cafenea România", "management cafenele", "sistem POS cafenea"], e.business, e.cloud).join(", ");
            case "pricing":
                return a.concat(e.comparison, e.features).join(", ");
            case "cafenele":
                return e.restaurant.concat(e.industries.fastfood).concat(e.longTail.slice(0, 5)).join(", ");
            case "restaurant":
                return e.restaurant.concat(e.pos).concat(e.fiscal).join(", ");
            case "franchise":
                return e.franchise.concat(e.business).concat(e.cloud).join(", ");
            default:
                return i && e.industries[i] ? e.industries[i].concat(a).join(", ") : a.join(", ")
        }
    },
    s = t => {
        const i = {
            home: "FranchiseTech - Software pentru cafenele România și sistem management cafenele. Soluții complete cu automatizare fiscalizare, gestiune stocuri cafenea, rapoarte vânzări și scalabilitate pentru afaceri de cafea cu multiple locații.",
            pricing: "Planuri software POS și management franciză România. Prețuri transparente pentru sistem complet cu automatizare fiscalizare, gestiune stocuri, rapoarte vânzări personalizate și suport franciză 24/7.",
            cafenele: "Software POS specializat pentru cafenele România. Sistem complet cu imprimantă fiscală, inventar automat cafea, programe loialitate și conformitate ANAF. Începe gratuit.",
            restaurant: "Sistem management franciză cafea complet România. Software POS cu e-factura, inventar automat, staff management și raportări fiscale. Soluție profesională pentru francizele de cafea.",
            franchise: "Software management franciză automatizat România. Platformă centralizată pentru francize cu multiple locații, automatizare fiscalizare, gestiune stocuri și rapoarte vânzări personalizate.",
            default: "Software pentru francize România și management afaceri. Soluții complete cu automatizare fiscalizare, gestiune stocuri franciză și rapoarte vânzări. Pentru restaurante, cafenele și business-uri cu multiple locații."
        };
        return i[t] || i.default
    },
    c = () => ({
        "@context": "https://schema.org",
        "@type": "Organization",
        name: "FranchiseTech România",
        alternateName: "FranchiseTech",
        url: "https://franchisetech.ro",
        logo: "https://franchisetech.ro/logo.png",
        description: "Software POS și sistem management restaurant România. Soluții complete cu conformitate fiscală, e-factura, inventar automat și raportări pentru cafenele, restaurante și lanțuri.",
        foundingDate: "2024-03-04",
        address: {
            "@type": "PostalAddress",
            addressCountry: "RO",
            addressRegion: "Ilfov",
            addressLocality: "Dobroești"
        },
        sameAs: ["https://linkedin.com/company/franchisetech-romania", "https://twitter.com/FranchiseTechRO", "https://facebook.com/FranchiseTechRomania", "https://instagram.com/franchisetech_ro"],
        contactPoint: [{
            "@type": "ContactPoint",
            telephone: "+40 729 917 823",
            contactType: "customer service",
            areaServed: "RO",
            availableLanguage: "Romanian"
        }, {
            "@type": "ContactPoint",
            telephone: "+40 729 917 823",
            contactType: "technical support",
            areaServed: "RO",
            availableLanguage: "Romanian"
        }],
        makesOffer: [{
            "@type": "Offer",
            itemOffered: {
                "@type": "SoftwareApplication",
                name: "Software POS Restaurant",
                applicationCategory: "BusinessApplication",
                operatingSystem: "Web, iOS, Android"
            },
            price: "49",
            priceCurrency: "EUR",
            availability: "https://schema.org/InStock"
        }, {
            "@type": "Offer",
            itemOffered: {
                "@type": "SoftwareApplication",
                name: "Software Management Franciză",
                applicationCategory: "BusinessApplication",
                operatingSystem: "Web, iOS, Android"
            },
            price: "99",
            priceCurrency: "EUR",
            availability: "https://schema.org/InStock"
        }],
        areaServed: {
            "@type": "Country",
            name: "Romania"
        }
    }),
    m = (t, i) => {
        const a = t.split("/").filter(Boolean),
            n = a.map(r => ({
                "@type": "ListItem",
                position: a.indexOf(r) + 1,
                name: i(`breadcrumbs.${r}`),
                item: `https://franchisetech.ro/${a.slice(0,a.indexOf(r)+1).join("/")}`
            }));
        return {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [{
                "@type": "ListItem",
                position: 1,
                name: i("breadcrumbs.home"),
                item: "https://franchisetech.ro"
            }, ...n]
        }
    },
    f = (t, i, a, n) => ({
        "@context": "https://schema.org",
        "@type": "Service",
        name: t,
        description: i,
        provider: {
            "@type": "Organization",
            name: "FranchiseTech",
            url: "https://franchisetech.ro"
        },
        offers: {
            "@type": "Offer",
            price: "0",
            priceCurrency: "USD"
        },
        featureList: a,
        areaServed: "Worldwide",
        hasOfferCatalog: {
            "@type": "OfferCatalog",
            name: "Enterprise Services",
            itemListElement: a.map(r => ({
                "@type": "Offer",
                itemOffered: {
                    "@type": "Service",
                    name: r,
                    description: n(`services.features.${r.toLowerCase().replace(/\s+/g,"_")}.description`)
                }
            }))
        }
    }),
    u = () => ({
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        name: "FranchiseTech POS - Software Management Restaurant România",
        applicationCategory: "BusinessApplication",
        operatingSystem: "Web, iOS, Android",
        description: "Software POS complet pentru restaurante și cafenele România. Sistem integrat cu e-factura, inventar automat, raportări fiscale și conformitate ANAF.",
        url: "https://franchisetech.ro",
        screenshot: "https://franchisetech.ro/pos-screenshot.jpg",
        softwareVersion: "2.0",
        datePublished: "2020-01-01",
        dateModified: "2024-01-01",
        author: {
            "@type": "Organization",
            name: "FranchiseTech România"
        },
        offers: [{
            "@type": "Offer",
            price: "49",
            priceCurrency: "EUR",
            priceValidUntil: "2024-12-31",
            availability: "https://schema.org/InStock",
            seller: {
                "@type": "Organization",
                name: "FranchiseTech România"
            }
        }],
        featureList: ["Sistem POS cu imprimantă fiscală", "E-factura România", "Inventar automat", "Raportări fiscale", "Conformitate ANAF", "Management multi-locații", "Backup automat", "Suport 24/7"],
        aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: "4.8",
            reviewCount: "127",
            bestRating: "5",
            worstRating: "1"
        }
    }),
    p = () => ({
        "@context": "https://schema.org",
        "@type": "LocalBusiness",
        name: "FranchiseTech România",
        description: "Software POS și sistem management restaurant România",
        url: "https://franchisetech.ro",
        telephone: "+40 729 917 823",
        email: "info@franchisetech.ro",
        address: {
            "@type": "PostalAddress",
            streetAddress: "Strada Exemplu, Nr. 123",
            addressLocality: "București",
            addressRegion: "București",
            postalCode: "010001",
            addressCountry: "RO"
        },
        geo: {
            "@type": "GeoCoordinates",
            latitude: "44.4268",
            longitude: "26.1025"
        },
        openingHours: "Mo-Fr 09:00-18:00",
        priceRange: "€€",
        paymentAccepted: "Cash, Credit Card, Bank Transfer",
        currenciesAccepted: "EUR, RON"
    }),
    l = () => ({
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        name: "Software Management Franciză România - FranchiseTech",
        alternateName: "FranchiseTech Management Franciză",
        applicationCategory: "BusinessApplication",
        operatingSystem: "Web, iOS, Android",
        description: "Software complet pentru managementul francizelor și lanțurilor din România. Soluții de automatizare fiscalizare, gestiune stocuri, rapoarte vânzări și scalabilitate pentru francize cu multiple locații. Perfect pentru proprietari, francizați și franchizori cu vârsta 30-70 ani.",
        url: "https://franchisetech.ro",
        screenshot: "https://franchisetech.ro/franchise-screenshot.jpg",
        softwareVersion: "2.0",
        datePublished: "2020-01-01",
        dateModified: "2024-01-01",
        author: {
            "@type": "Organization",
            name: "FranchiseTech România",
            url: "https://franchisetech.ro",
            address: {
                "@type": "PostalAddress",
                addressCountry: "RO",
                addressRegion: "București",
                addressLocality: "București"
            }
        },
        offers: [{
            "@type": "Offer",
            price: "49",
            priceCurrency: "EUR",
            priceValidUntil: "2024-12-31",
            priceSpecification: {
                "@type": "PriceSpecification",
                price: "49",
                priceCurrency: "EUR",
                billingIncrement: "Monthly",
                unitText: "per location"
            },
            availability: "https://schema.org/InStock",
            seller: {
                "@type": "Organization",
                name: "FranchiseTech România"
            }
        }],
        audience: {
            "@type": "BusinessAudience",
            audienceType: "Franchise Owners, Franchisees, Franchisors, CEOs, Directors",
            geographicArea: {
                "@type": "Country",
                name: "Romania"
            }
        },
        featureList: ["Management franciză automatizat", "Soluții POS fiscalizare România", "Aplicație gestiune stocuri franciză", "Platformă centralizată franciză", "Rapoarte vânzări franciză", "Automatizare procese franciză", "Scalabilitate franciză software", "Suport franciză România", "Conformitate fiscală franciză", "Analiză date franciză", "Integrare POS fiscalizare", "Gestionare franciză multiple locații", "Automatizare fiscalizare România", "Dashboard centralizat pentru proprietari", "Software pentru CEO franciză", "Soluții pentru directori franciză", "Platformă pentru franchizori România"],
        keywords: "software management franciză România, automatizare fiscalizare România, aplicație gestiune stocuri franciză, platformă centralizată franciză, rapoarte vânzări franciză, scalabilitate franciză software, suport franciză România, conformitate fiscală franciză, analiză date franciză, integrare POS fiscalizare, gestionare franciză multiple locații, software franchise România, management lanțuri, sistem multi-locații, software franșize, management sucursale, sistem centralizat, software lanțuri, management grup, sistem distribuție, software expansion, CEO franciză România, director franciză România, proprietar franciză România, francizați România, franchizori România",
        aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: "4.9",
            reviewCount: "89",
            bestRating: "5",
            worstRating: "1"
        },
        inLanguage: "ro",
        isAccessibleForFree: !1
    }),
    d = () => ({
        "@context": "https://schema.org",
        "@type": "Service",
        name: "Soluții Management Franciză România",
        description: "Servicii complete de management pentru francize și lanțuri din România. Automatizare fiscalizare, gestiune stocuri, rapoarte vânzări și scalabilitate pentru afaceri cu multiple locații.",
        provider: {
            "@type": "Organization",
            name: "FranchiseTech România",
            url: "https://franchisetech.ro"
        },
        serviceType: "Software Management Franciză",
        areaServed: {
            "@type": "Country",
            name: "Romania"
        },
        hasOfferCatalog: {
            "@type": "OfferCatalog",
            name: "Soluții Franciză România",
            itemListElement: [{
                "@type": "Offer",
                itemOffered: {
                    "@type": "Service",
                    name: "Software pentru Francize Mici",
                    description: "Aplicație POS pentru francize mici în România cu automatizare fiscalizare"
                }
            }, {
                "@type": "Offer",
                itemOffered: {
                    "@type": "Service",
                    name: "Gestiune Stocuri Franciză",
                    description: "Software de gestiune stocuri pentru francize în România"
                }
            }, {
                "@type": "Offer",
                itemOffered: {
                    "@type": "Service",
                    name: "Management Multiple Locații",
                    description: "Platformă de management pentru francize cu multiple locații în România"
                }
            }, {
                "@type": "Offer",
                itemOffered: {
                    "@type": "Service",
                    name: "Automatizare Fiscalizare",
                    description: "Soluție de automatizare fiscalizare pentru francize în România"
                }
            }, {
                "@type": "Offer",
                itemOffered: {
                    "@type": "Service",
                    name: "Rapoarte Vânzări Personalizate",
                    description: "Rapoarte de vânzări personalizate pentru francize în România"
                }
            }]
        }
    }),
    z = () => ({
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: [{
            "@type": "Question",
            name: "Ce este software-ul pentru francize România?",
            acceptedAnswer: {
                "@type": "Answer",
                text: "Software-ul pentru francize România este o soluție completă de management care automatizează procesele de franciză, oferă conformitate fiscală, gestiune stocuri și rapoarte vânzări pentru lanțuri cu multiple locații."
            }
        }, {
            "@type": "Question",
            name: "Cum funcționează managementul franciză automatizat?",
            acceptedAnswer: {
                "@type": "Answer",
                text: "Managementul franciză automatizat centralizează toate operațiunile, automatizează fiscalizarea, gestionează stocurile și generează rapoarte în timp real pentru toate locațiile din franciză."
            }
        }, {
            "@type": "Question",
            name: "Este compatibil cu soluțiile POS fiscalizare România?",
            acceptedAnswer: {
                "@type": "Answer",
                text: "Da, software-ul nostru este complet compatibil cu soluțiile POS fiscalizare România, incluzând e-factura, bonuri fiscale și toate cerințele ANAF."
            }
        }, {
            "@type": "Question",
            name: "Cum pot gestiona multiple locații cu o singură platformă?",
            acceptedAnswer: {
                "@type": "Answer",
                text: "Platforma centralizată permite gestionarea tuturor locațiilor dintr-un singur dashboard, cu rapoarte consolidate, control centralizat al stocurilor și monitorizare performanță în timp real."
            }
        }]
    }),
    g = () => ({
        "@context": "https://schema.org",
        "@type": "Service",
        name: "Servicii de Configurare și Implementare FranchiseTech",
        description: "Servicii profesionale de configurare și implementare pentru soluțiile FranchiseTech. Echipa noastră de specialiști vă ajută să configurați inventarul, să setați produsele, să introduceți datele clienților și să instruiți echipa pentru o implementare de succes.",
        provider: {
            "@type": "Organization",
            name: "FranchiseTech România",
            url: "https://franchisetech.ro"
        },
        serviceType: "Implementation and Setup Services",
        areaServed: {
            "@type": "Country",
            name: "Romania"
        },
        offers: [{
            "@type": "Offer",
            price: "50",
            priceCurrency: "EUR",
            priceValidUntil: "2024-12-31",
            priceSpecification: {
                "@type": "PriceSpecification",
                price: "50",
                priceCurrency: "EUR",
                unitText: "per hour",
                billingIncrement: "Hourly"
            },
            availability: "https://schema.org/InStock",
            seller: {
                "@type": "Organization",
                name: "FranchiseTech România"
            },
            description: "Tarif orar pentru servicii de implementare și configurare"
        }],
        hasOfferCatalog: {
            "@type": "OfferCatalog",
            name: "Servicii de Implementare",
            itemListElement: [{
                "@type": "Offer",
                itemOffered: {
                    "@type": "Service",
                    name: "Configurarea Inventarului la Locația Dumneavoastră",
                    description: "Configurarea completă a inventarului direct la locația dumneavoastră de business"
                }
            }, {
                "@type": "Offer",
                itemOffered: {
                    "@type": "Service",
                    name: "Setarea Produselor în Sistem",
                    description: "Configurarea și implementarea produselor în sistemul FranchiseTech"
                }
            }, {
                "@type": "Offer",
                itemOffered: {
                    "@type": "Service",
                    name: "Introducerea Datelor Clienților",
                    description: "Migrarea și introducerea datelor clienților în sistemul nostru"
                }
            }, {
                "@type": "Offer",
                itemOffered: {
                    "@type": "Service",
                    name: "Instruirea Echipei de Lucru",
                    description: "Instruire completă a echipei pentru utilizarea eficientă a sistemului"
                }
            }, {
                "@type": "Offer",
                itemOffered: {
                    "@type": "Service",
                    name: "Configurarea Personalizată a Sistemului",
                    description: "Adaptarea sistemului conform nevoilor specifice ale afacerii dumneavoastră"
                }
            }, {
                "@type": "Offer",
                itemOffered: {
                    "@type": "Service",
                    name: "Suport Tehnic în Timpul Implementării",
                    description: "Asistență tehnică dedicată în timpul implementării și după"
                }
            }]
        },
        audience: {
            "@type": "BusinessAudience",
            audienceType: "Franchise Owners, Restaurant Owners, Business Owners",
            geographicArea: {
                "@type": "Country",
                name: "Romania"
            }
        }
    });
export {
    o as a, c as b, u as c, l as d, d as e, z as f, s as g, f as h, m as i, g as j, p as k
};