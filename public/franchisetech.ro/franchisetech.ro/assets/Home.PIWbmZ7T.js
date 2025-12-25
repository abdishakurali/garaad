import {
    j as e
} from "./ui-vendor.Bl07kmxE.js";
import {
    u as c,
    B as l
} from "./index.DrC_YY1K.js";
import {
    OnboardingModal as d
} from "./OnboardingModal.Bf5Dzp1K.js";
import {
    r as m
} from "./react-vendor.CoFnG1Cb.js";
import {
    H as x
} from "./Helmet.B9sVbWhk.js";
import {
    g as n,
    a as h,
    b as p,
    c as u,
    d as g,
    e as j,
    f
} from "./structuredData.D5Vl_LyK.js";
import {
    u as b
} from "./i18n-vendor.CxbKsUuT.js";
import "./query-vendor.Ckm1xsuj.js";
import "./utils-vendor.B2rm_Apj.js";
import "./icons-vendor.BaRxkmJj.js";
import "./form-vendor.CYdr9quq.js";
import "./motion-vendor.CwL1EI4n.js";
import "./odooVATHelper.BJeXAh4R.js";
import "./checkbox.DrjMjESB.js";
import "./index.DfBlkqaH.js";
import "./index.JulBJio6.js";

function v() {
    const [t, r] = m.useState(!1), [, a] = c();
    return e.jsxs("section", {
        className: "relative overflow-hidden bg-gradient-to-b from-primary/5 to-transparent pt-16 pb-16 sm:pt-20 sm:pb-24",
        "aria-labelledby": "hero-title",
        children: [e.jsxs("div", {
            className: "absolute inset-0 animate-fade-in",
            "aria-hidden": "true",
            children: [e.jsx("div", {
                className: "absolute top-10 left-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl opacity-50"
            }), e.jsx("div", {
                className: "absolute bottom-10 right-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl opacity-50"
            }), e.jsx("div", {
                className: "absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)]"
            })]
        }), e.jsx("div", {
            className: "container mx-auto px-0 sm:px-4 pt-8 sm:pt-12 lg:pt-16 relative",
            children: e.jsx("div", {
                className: "flex flex-col items-center max-w-5xl mx-auto",
                children: e.jsx("div", {
                    className: "space-y-6 sm:space-y-8 animate-fade-in text-center",
                    children: e.jsxs("div", {
                        className: "space-y-6 sm:space-y-10",
                        children: [e.jsxs("h1", {
                            id: "hero-title",
                            className: "text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight animate-slide-in",
                            children: [e.jsx("span", {
                                className: "block",
                                children: "Simplificați Cafeneaua"
                            }), e.jsxs("span", {
                                className: "block mt-2",
                                children: ["cu", " ", e.jsxs("span", {
                                    className: "relative text-primary",
                                    children: ["Franchise Tech", e.jsx("svg", {
                                        className: "absolute -bottom-1 left-0 w-full",
                                        viewBox: "0 0 100 10",
                                        preserveAspectRatio: "none",
                                        "aria-hidden": "true",
                                        children: e.jsx("path", {
                                            d: "M0,5 Q50,9 100,5",
                                            stroke: "currentColor",
                                            strokeWidth: "2",
                                            fill: "none",
                                            className: "text-primary"
                                        })
                                    })]
                                })]
                            }), e.jsx("p", {
                                className: "mt-2 sm:mt-4 text-lg sm:text-xl lg:text-2xl text-gray-600 font-medium max-w-4xl mx-auto leading-relaxed",
                                children: "Gestionați-vă cafeneaua complet și eficient cu soluția noastră integrată, de la POS la controlul stocurilor, totul la un preț competitiv de 49 € pe lună .                 "
                            }), e.jsx("div", {
                                className: "flex -mb-5 items-center justify-center",
                                "aria-hidden": "true",
                                children: e.jsx("img", {
                                    src: "https://odoocdn.com/openerp_website/static/src/img/graphics/arrow_doodle_1.svg",
                                    alt: "",
                                    loading: "lazy",
                                    className: "w-16 h-16 sm:w-20 sm:h-20"
                                })
                            })]
                        }), e.jsx("div", {
                            className: "flex flex-col items-center gap-4 animate-fade-in",
                            children: e.jsxs("div", {
                                className: "flex flex-col sm:flex-row justify-center gap-4",
                                children: [e.jsx(l, {
                                    size: "lg",
                                    className: "bg-primary hover:bg-primary/90 text-white px-8 py-3 text-lg font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300",
                                    onClick: () => r(!0),
                                    children: "Începeți Acum"
                                }), e.jsx(l, {
                                    size: "lg",
                                    variant: "outline",
                                    className: "border-2 border-primary text-primary hover:bg-primary hover:text-white px-8 py-3 text-lg font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300",
                                    onClick: () => a("/coffee-shops"),
                                    children: "Află Mai Multe"
                                })]
                            })
                        }), e.jsx("div", {
                            className: "container  mx-auto mt-16 sm:mt-20",
                            children: e.jsxs("div", {
                                className: "grid md:grid-cols-2 lg:grid-cols-4  gap-3  ",
                                children: [e.jsx("div", {
                                    className: "text-center w-full group  ",
                                    children: e.jsxs("div", {
                                        className: "bg-white/80 backdrop-blur-sm rounded-2xl py-8 text-center px-3 shadow-lg border border-white/50 hover:shadow-xl transition-all duration-300 group-hover:-translate-y-2",
                                        children: [e.jsx("div", {
                                            className: "w-16 h-16 bg-gradient-to-br from-primary/20 to-primary/10 rounded-xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300",
                                            children: e.jsx("svg", {
                                                className: "w-8 h-8 text-primary",
                                                fill: "none",
                                                viewBox: "0 0 24 24",
                                                stroke: "currentColor",
                                                children: e.jsx("path", {
                                                    strokeLinecap: "round",
                                                    strokeLinejoin: "round",
                                                    strokeWidth: 2,
                                                    d: "M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
                                                })
                                            })
                                        }), e.jsx("h3", {
                                            className: "text-xl font-bold text-gray-900 mb-4",
                                            children: "Tabletă POS"
                                        }), e.jsx("p", {
                                            className: "text-gray-600 leading-relaxed",
                                            children: "Comenzi rapide și plăți instantanee cu un design intuitiv."
                                        })]
                                    })
                                }), e.jsx("div", {
                                    className: "text-center group",
                                    children: e.jsxs("div", {
                                        className: "bg-white/80 backdrop-blur-sm rounded-2xl  py-8 text-center px-3 shadow-lg border border-white/50 hover:shadow-xl transition-all duration-300 group-hover:-translate-y-2",
                                        children: [e.jsx("div", {
                                            className: "w-16 h-16 bg-gradient-to-br from-primary/20 to-primary/10 rounded-xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300",
                                            children: e.jsx("svg", {
                                                className: "w-8 h-8 text-primary",
                                                fill: "none",
                                                viewBox: "0 0 24 24",
                                                stroke: "currentColor",
                                                children: e.jsx("path", {
                                                    strokeLinecap: "round",
                                                    strokeLinejoin: "round",
                                                    strokeWidth: 2,
                                                    d: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                                })
                                            })
                                        }), e.jsx("h3", {
                                            className: "text-lg font-bold text-gray-900 mb-4",
                                            children: "Casă de Marcat"
                                        }), e.jsx("p", {
                                            className: "text-gray-600 leading-relaxed",
                                            children: "Tranzacții sigure și rapoarte automate, conform legislației fiscale."
                                        })]
                                    })
                                }), e.jsx("div", {
                                    className: "text-center group",
                                    children: e.jsxs("div", {
                                        className: "bg-white/80 backdrop-blur-sm rounded-2xl  py-8 text-center px-3 shadow-lg border border-white/50 hover:shadow-xl transition-all duration-300 group-hover:-translate-y-2",
                                        children: [e.jsx("div", {
                                            className: "w-16 h-16 bg-gradient-to-br from-primary/20 to-primary/10 rounded-xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300",
                                            children: e.jsxs("svg", {
                                                className: "w-8 h-8 text-primary",
                                                fill: "none",
                                                viewBox: "0 0 24 24",
                                                stroke: "currentColor",
                                                children: [e.jsx("path", {
                                                    strokeLinecap: "round",
                                                    strokeLinejoin: "round",
                                                    strokeWidth: 2,
                                                    d: "M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                                                }), e.jsx("path", {
                                                    strokeLinecap: "round",
                                                    strokeLinejoin: "round",
                                                    strokeWidth: 2,
                                                    d: "M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                                                })]
                                            })
                                        }), e.jsx("h3", {
                                            className: "text-lg font-bold text-gray-900 mb-4",
                                            children: "Gestionare Multi-Locație"
                                        }), e.jsx("p", {
                                            className: "text-gray-600 leading-relaxed",
                                            children: "Control centralizat pentru toate cafenelele cu un dashboard unificat."
                                        })]
                                    })
                                }), e.jsx("div", {
                                    className: "text-center group",
                                    children: e.jsxs("div", {
                                        className: "bg-white/80 backdrop-blur-sm rounded-2xl  py-8 text-center px-3 shadow-lg border border-white/50 hover:shadow-xl transition-all duration-300 group-hover:-translate-y-2",
                                        children: [e.jsx("div", {
                                            className: "w-16 h-16 bg-gradient-to-br from-primary/20 to-primary/10 rounded-xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300",
                                            children: e.jsx("svg", {
                                                className: "w-8 h-8 text-primary",
                                                fill: "none",
                                                viewBox: "0 0 24 24",
                                                stroke: "currentColor",
                                                children: e.jsx("path", {
                                                    strokeLinecap: "round",
                                                    strokeLinejoin: "round",
                                                    strokeWidth: 2,
                                                    d: "M20 13V7a2 2 0 00-2-2H6a2 2 0 00-2 2v6m16 0v6a2 2 0 01-2 2H6a2 2 0 01-2-2v-6m16 0H4"
                                                })
                                            })
                                        }), e.jsx("h3", {
                                            className: "text-lg font-bold text-gray-900 mb-4",
                                            children: "Inventar în Timp Real"
                                        }), e.jsx("p", {
                                            className: "text-gray-600 leading-relaxed",
                                            children: "Alerte automate pentru stocuri scăzute și calcul precis al costurilor."
                                        })]
                                    })
                                })]
                            })
                        })]
                    })
                })
            })
        }), e.jsx(d, {
            open: t,
            onOpenChange: r
        })]
    })
}

function W() {
    const {
        t
    } = b(), [, r] = c(), [a, o] = m.useState(!1);
    return e.jsxs(e.Fragment, {
        children: [e.jsxs(x, {
            children: [e.jsx("title", {
                children: "Simplificați Gestionarea Cafenelelor cu FranchiseTech - Software POS pentru Cafenele România"
            }), e.jsx("meta", {
                name: "description",
                content: n("home")
            }), e.jsx("meta", {
                name: "keywords",
                content: h("home")
            }), e.jsx("meta", {
                property: "og:title",
                content: "Simplificați Gestionarea Cafenelelor cu FranchiseTech - Software POS pentru Cafenele România"
            }), e.jsx("meta", {
                property: "og:description",
                content: n("home")
            }), e.jsx("meta", {
                property: "og:type",
                content: "website"
            }), e.jsx("meta", {
                property: "og:url",
                content: "https://franchisetech.ro"
            }), e.jsx("meta", {
                property: "og:image",
                content: "https://franchisetech.ro/og-image.jpg"
            }), e.jsx("meta", {
                property: "og:image:width",
                content: "1200"
            }), e.jsx("meta", {
                property: "og:image:height",
                content: "630"
            }), e.jsx("meta", {
                property: "og:site_name",
                content: "FranchiseTech România"
            }), e.jsx("meta", {
                property: "og:locale",
                content: "ro_RO"
            }), e.jsx("meta", {
                property: "og:country-name",
                content: "Romania"
            }), e.jsx("meta", {
                name: "twitter:card",
                content: "summary_large_image"
            }), e.jsx("meta", {
                name: "twitter:site",
                content: "@FranchiseTechRO"
            }), e.jsx("meta", {
                name: "twitter:creator",
                content: "@FranchiseTechRO"
            }), e.jsx("meta", {
                name: "twitter:title",
                content: "Simplificați Gestionarea Cafenelelor cu FranchiseTech - Software POS pentru Cafenele"
            }), e.jsx("meta", {
                name: "twitter:description",
                content: n("home")
            }), e.jsx("meta", {
                name: "twitter:image",
                content: "https://franchisetech.ro/og-image.jpg"
            }), e.jsx("meta", {
                name: "robots",
                content: "index, follow"
            }), e.jsx("meta", {
                name: "author",
                content: "FranchiseTech"
            }), e.jsx("link", {
                rel: "canonical",
                href: "https://franchisetech.ro"
            }), e.jsx("link", {
                rel: "alternate",
                hrefLang: "en",
                href: "https://franchisetech.ro"
            }), e.jsx("link", {
                rel: "alternate",
                hrefLang: "ro",
                href: "https://franchisetech.ro/ro"
            }), e.jsx("script", {
                type: "application/ld+json",
                children: JSON.stringify(p())
            }), e.jsx("script", {
                type: "application/ld+json",
                children: JSON.stringify(u())
            }), e.jsx("script", {
                type: "application/ld+json",
                children: JSON.stringify(g())
            }), e.jsx("script", {
                type: "application/ld+json",
                children: JSON.stringify(j())
            }), e.jsx("script", {
                type: "application/ld+json",
                children: JSON.stringify(f())
            }), e.jsx("script", {
                type: "application/ld+json",
                children: JSON.stringify({
                    "@context": "https://schema.org",
                    "@type": "Organization",
                    name: "FranchiseTech",
                    url: "https://franchisetech.ro",
                    logo: "https://franchisetech.ro/logo.jpeg",
                    description: "Soluții de management pentru cafenele cu software POS și sistem de gestiune integrat pentru afaceri de cafea în România.",
                    address: {
                        "@type": "PostalAddress",
                        addressLocality: "Bucharest",
                        addressCountry: "Romania"
                    },
                    contactPoint: {
                        "@type": "ContactPoint",
                        telephone: "+40 729 917 823",
                        contactType: "sales",
                        email: "info@franchisetech.ro"
                    }
                })
            })]
        }), e.jsx(v, {}), e.jsx("section", {
            className: "py-16 bg-white",
            "aria-labelledby": "complete-solution-title",
            children: e.jsx("div", {
                className: "container mx-auto px-0 sm:px-6",
                children: e.jsx("div", {
                    className: "max-w-6xl mx-auto",
                    children: e.jsxs("div", {
                        className: "grid lg:grid-cols-2 gap-8 items-stretch min-h-[600px]",
                        children: [e.jsx("div", {
                            className: "flex items-center",
                            children: e.jsxs("div", {
                                className: "bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/50 p-8 relative overflow-hidden w-full h-full flex items-center justify-center",
                                children: [e.jsx("div", {
                                    className: "absolute -top-20 -left-20 w-40 h-40 bg-primary/10 rounded-full blur-3xl"
                                }), e.jsx("div", {
                                    className: "absolute -bottom-20 -right-20 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl"
                                }), e.jsxs("div", {
                                    className: "relative overflow-hidden rounded-2xl w-full",
                                    children: [e.jsx("img", {
                                        src: "/package.png",
                                        alt: "Pachet Complet pentru Cafenele - Tablet, Casă de Marcat și Software de Gestiune",
                                        className: "w-full h-auto object-cover hover:scale-105 transition-all duration-500 filter brightness-110 contrast-110",
                                        loading: "eager"
                                    }), e.jsx("div", {
                                        className: "absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"
                                    }), e.jsx("div", {
                                        className: "absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-blue-500/5"
                                    }), e.jsx("div", {
                                        className: "absolute top-6 right-6 bg-primary/90 backdrop-blur-md text-white px-4 py-2 rounded-full text-sm font-semibold shadow-xl border border-white/20",
                                        children: "Gata de Livrare"
                                    }), e.jsx("div", {
                                        className: "absolute bottom-4 left-4 bg-white/80 backdrop-blur-md px-3 py-1 rounded-lg text-xs font-medium text-gray-700 border border-white/50",
                                        children: "Pachet Complet"
                                    }), e.jsx("div", {
                                        className: "absolute top-1/4 left-1/4 w-8 h-8 bg-yellow-400/30 rounded-full blur-md"
                                    }), e.jsx("div", {
                                        className: "absolute bottom-1/3 right-1/3 w-6 h-6 bg-green-400/30 rounded-full blur-md"
                                    })]
                                })]
                            })
                        }), e.jsxs("div", {
                            className: "flex flex-col justify-between space-y-6 px-4 sm:px-0",
                            children: [e.jsx("div", {
                                className: "absolute -top-10 -right-10 w-32 h-32 bg-primary/5 rounded-full blur-2xl"
                            }), e.jsx("div", {
                                className: "absolute -bottom-10 -left-10 w-24 h-24 bg-blue-500/5 rounded-full blur-2xl"
                            }), e.jsxs("div", {
                                className: "relative",
                                children: [e.jsx("h2", {
                                    id: "complete-solution-title",
                                    className: "text-3xl lg:text-4xl font-bold text-gray-900 mb-4",
                                    children: "Gestiune Eficientă a Cafenelei cu Franchise Tech"
                                }), e.jsx("p", {
                                    className: "text-lg text-gray-600 leading-relaxed mb-4",
                                    children: "Sistem POS intuitiv special conceput pentru cafenele."
                                })]
                            }), e.jsx("div", {
                                className: "relative",
                                children: e.jsx("div", {
                                    className: "grid grid-cols-1 gap-4",
                                    children: e.jsxs("div", {
                                        className: "flex items-start gap-3 group",
                                        children: [e.jsx("div", {
                                            className: "w-6 h-6 bg-green-100 rounded-full flex items-center justify-center group-hover:bg-green-200 transition-colors flex-shrink-0 mt-1",
                                            children: e.jsx("svg", {
                                                className: "w-4 h-4 text-green-600",
                                                fill: "none",
                                                viewBox: "0 0 24 24",
                                                stroke: "currentColor",
                                                children: e.jsx("path", {
                                                    strokeLinecap: "round",
                                                    strokeLinejoin: "round",
                                                    strokeWidth: 2,
                                                    d: "M5 13l4 4L19 7"
                                                })
                                            })
                                        }), e.jsxs("div", {
                                            children: [e.jsx("span", {
                                                className: "text-base text-gray-700 group-hover:text-gray-900 transition-colors font-medium",
                                                children: "Casă de marcată integrată"
                                            }), e.jsx("p", {
                                                className: "text-sm text-gray-500 mt-1",
                                                children: "Franchisetech te ajută să ții evidența mișcărilor de numerar – vânzări, plăți sau bani de schimb – rapid, fără pix și hârtie. Compatibile cu Datecs, Daisy, Tremol și altele."
                                            })]
                                        })]
                                    })
                                })
                            }), e.jsx("div", {
                                className: "relative",
                                children: e.jsxs("div", {
                                    className: "grid grid-cols-1 gap-4",
                                    children: [e.jsxs("div", {
                                        className: "flex items-start gap-3 group",
                                        children: [e.jsx("div", {
                                            className: "w-6 h-6 bg-green-100 rounded-full flex items-center justify-center group-hover:bg-green-200 transition-colors flex-shrink-0 mt-1",
                                            children: e.jsx("svg", {
                                                className: "w-4 h-4 text-green-600",
                                                fill: "none",
                                                viewBox: "0 0 24 24",
                                                stroke: "currentColor",
                                                children: e.jsx("path", {
                                                    strokeLinecap: "round",
                                                    strokeLinejoin: "round",
                                                    strokeWidth: 2,
                                                    d: "M5 13l4 4L19 7"
                                                })
                                            })
                                        }), e.jsxs("div", {
                                            children: [e.jsx("span", {
                                                className: "text-base text-gray-700 group-hover:text-gray-900 transition-colors font-medium",
                                                children: "POS Simplu și Rapid"
                                            }), e.jsx("p", {
                                                className: "text-sm text-gray-500 mt-1",
                                                children: "Categorizați produsele cu poze, gestionați comenzile în câteva secunde."
                                            })]
                                        })]
                                    }), e.jsxs("div", {
                                        className: "flex items-start gap-3 group",
                                        children: [e.jsx("div", {
                                            className: "w-6 h-6 bg-green-100 rounded-full flex items-center justify-center group-hover:bg-green-200 transition-colors flex-shrink-0 mt-1",
                                            children: e.jsx("svg", {
                                                className: "w-4 h-4 text-green-600",
                                                fill: "none",
                                                viewBox: "0 0 24 24",
                                                stroke: "currentColor",
                                                children: e.jsx("path", {
                                                    strokeLinecap: "round",
                                                    strokeLinejoin: "round",
                                                    strokeWidth: 2,
                                                    d: "M5 13l4 4L19 7"
                                                })
                                            })
                                        }), e.jsxs("div", {
                                            children: [e.jsx("span", {
                                                className: "text-base text-gray-700 group-hover:text-gray-900 transition-colors font-medium",
                                                children: "Plăți Flexibile"
                                            }), e.jsx("p", {
                                                className: "text-sm text-gray-500 mt-1",
                                                children: "Acceptați orice metodă de plată, integrare directă cu terminalul bancar."
                                            })]
                                        })]
                                    }), e.jsxs("div", {
                                        className: "flex items-start gap-3 group",
                                        children: [e.jsx("div", {
                                            className: "w-6 h-6 bg-green-100 rounded-full flex items-center justify-center group-hover:bg-green-200 transition-colors flex-shrink-0 mt-1",
                                            children: e.jsx("svg", {
                                                className: "w-4 h-4 text-green-600",
                                                fill: "none",
                                                viewBox: "0 0 24 24",
                                                stroke: "currentColor",
                                                children: e.jsx("path", {
                                                    strokeLinecap: "round",
                                                    strokeLinejoin: "round",
                                                    strokeWidth: 2,
                                                    d: "M5 13l4 4L19 7"
                                                })
                                            })
                                        }), e.jsxs("div", {
                                            children: [e.jsx("span", {
                                                className: "text-base text-gray-700 group-hover:text-gray-900 transition-colors font-medium",
                                                children: "Funcționează Offline"
                                            }), e.jsx("p", {
                                                className: "text-sm text-gray-500 mt-1",
                                                children: "Emiteți facturi și gestionați operațiunile fără conexiune la internet."
                                            })]
                                        })]
                                    }), e.jsxs("div", {
                                        className: "flex items-start gap-3 group",
                                        children: [e.jsx("div", {
                                            className: "w-6 h-6 bg-green-100 rounded-full flex items-center justify-center group-hover:bg-green-200 transition-colors flex-shrink-0 mt-1",
                                            children: e.jsx("svg", {
                                                className: "w-4 h-4 text-green-600",
                                                fill: "none",
                                                viewBox: "0 0 24 24",
                                                stroke: "currentColor",
                                                children: e.jsx("path", {
                                                    strokeLinecap: "round",
                                                    strokeLinejoin: "round",
                                                    strokeWidth: 2,
                                                    d: "M5 13l4 4L19 7"
                                                })
                                            })
                                        }), e.jsxs("div", {
                                            children: [e.jsx("span", {
                                                className: "text-base text-gray-700 group-hover:text-gray-900 transition-colors font-medium",
                                                children: "Loialitate și Reduceri"
                                            }), e.jsx("p", {
                                                className: "text-sm text-gray-500 mt-1",
                                                children: "Aplicați programe de fidelitate și promoții personalizate instant."
                                            })]
                                        })]
                                    }), e.jsxs("div", {
                                        className: "flex items-start gap-3 group",
                                        children: [e.jsx("div", {
                                            className: "w-6 h-6 bg-green-100 rounded-full flex items-center justify-center group-hover:bg-green-200 transition-colors flex-shrink-0 mt-1",
                                            children: e.jsx("svg", {
                                                className: "w-4 h-4 text-green-600",
                                                fill: "none",
                                                viewBox: "0 0 24 24",
                                                stroke: "currentColor",
                                                children: e.jsx("path", {
                                                    strokeLinecap: "round",
                                                    strokeLinejoin: "round",
                                                    strokeWidth: 2,
                                                    d: "M5 13l4 4L19 7"
                                                })
                                            })
                                        }), e.jsxs("div", {
                                            children: [e.jsx("span", {
                                                className: "text-base text-gray-700 group-hover:text-gray-900 transition-colors font-medium",
                                                children: "Inventar în Timp Real"
                                            }), e.jsx("p", {
                                                className: "text-sm text-gray-500 mt-1",
                                                children: "Urmăriți stocurile (ex. cafea, lapte) și eliminați risipa."
                                            })]
                                        })]
                                    }), e.jsxs("div", {
                                        className: "flex items-start gap-3 group",
                                        children: [e.jsx("div", {
                                            className: "w-6 h-6 bg-green-100 rounded-full flex items-center justify-center group-hover:bg-green-200 transition-colors flex-shrink-0 mt-1",
                                            children: e.jsx("svg", {
                                                className: "w-4 h-4 text-green-600",
                                                fill: "none",
                                                viewBox: "0 0 24 24",
                                                stroke: "currentColor",
                                                children: e.jsx("path", {
                                                    strokeLinecap: "round",
                                                    strokeLinejoin: "round",
                                                    strokeWidth: 2,
                                                    d: "M5 13l4 4L19 7"
                                                })
                                            })
                                        }), e.jsxs("div", {
                                            children: [e.jsx("span", {
                                                className: "text-base text-gray-700 group-hover:text-gray-900 transition-colors font-medium",
                                                children: "Fără Restricții de Dispozitiv"
                                            }), e.jsx("p", {
                                                className: "text-sm text-gray-500 mt-1",
                                                children: "Utilizați pe tabletă, telefon sau laptop, oriunde."
                                            })]
                                        })]
                                    })]
                                })
                            }), e.jsx("div", {
                                className: "relative space-y-6",
                                children: e.jsxs("div", {
                                    className: "flex flex-col sm:flex-row gap-3",
                                    children: [e.jsx("button", {
                                        onClick: () => o(!0),
                                        className: "bg-gradient-to-r from-primary to-primary/90 text-white px-6 py-3 rounded-xl font-medium hover:from-primary/90 hover:to-primary transition-all duration-300 shadow-lg hover:shadow-xl backdrop-blur-sm",
                                        children: "Începe Acum"
                                    }), e.jsx("button", {
                                        onClick: () => r("/products"),
                                        className: "border border-gray-300/50 text-gray-700 px-6 py-3 rounded-xl font-medium hover:bg-gray-50/80 transition-all duration-300 backdrop-blur-sm",
                                        children: "Află Mai Multe"
                                    })]
                                })
                            })]
                        })]
                    })
                })
            })
        }), e.jsx("section", {
            className: "py-24 bg-gradient-to-br from-background via-primary/5 to-background",
            "aria-labelledby": "comparison-title",
            children: e.jsxs("div", {
                className: "container mx-auto px-4",
                children: [e.jsxs("div", {
                    className: "text-center mb-16 relative",
                    children: [e.jsx("div", {
                        className: "absolute inset-0 bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 blur-3xl -z-10"
                    }), e.jsx("h2", {
                        id: "comparison-title",
                        className: "text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent",
                        children: t("common.company_name")
                    }), e.jsx("p", {
                        className: "mt-6 text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed",
                        children: t("home.comparison.subtitle")
                    })]
                }), e.jsxs("div", {
                    className: "grid lg:grid-cols-2 gap-8 mb-16 relative",
                    children: [e.jsx("div", {
                        className: "absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/10 rounded-3xl blur-2xl -z-10"
                    }), e.jsxs("div", {
                        className: "p-8 rounded-xl bg-white/80 backdrop-blur shadow-xl",
                        children: [e.jsx("h3", {
                            className: "text-2xl font-bold mb-6 text-gray-800",
                            children: t("home.comparison.traditional.title")
                        }), e.jsx("div", {
                            className: "space-y-4",
                            children: t("home.comparison.traditional.items", {
                                returnObjects: !0
                            }).map((s, i) => e.jsxs("div", {
                                className: "flex items-start gap-3",
                                children: [e.jsx("svg", {
                                    className: "w-5 h-5 text-red-500 mt-1 flex-shrink-0",
                                    fill: "none",
                                    viewBox: "0 0 24 24",
                                    stroke: "currentColor",
                                    "aria-hidden": "true",
                                    children: e.jsx("path", {
                                        strokeLinecap: "round",
                                        strokeLinejoin: "round",
                                        strokeWidth: 2,
                                        d: "M6 18L18 6M6 6l12 12"
                                    })
                                }), e.jsx("span", {
                                    className: "text-gray-700",
                                    children: s
                                })]
                            }, i))
                        })]
                    }), e.jsxs("div", {
                        className: "p-8 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 backdrop-blur shadow-xl",
                        children: [e.jsx("h3", {
                            className: "text-2xl font-bold mb-6 bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent",
                            children: t("home.comparison.ai.title")
                        }), e.jsx("div", {
                            className: "space-y-4",
                            children: t("home.comparison.ai.items", {
                                returnObjects: !0
                            }).map((s, i) => e.jsxs("div", {
                                className: "flex items-start gap-3",
                                children: [e.jsx("svg", {
                                    className: "w-5 h-5 text-primary mt-1 flex-shrink-0",
                                    fill: "none",
                                    viewBox: "0 0 24 24",
                                    stroke: "currentColor",
                                    "aria-hidden": "true",
                                    children: e.jsx("path", {
                                        strokeLinecap: "round",
                                        strokeLinejoin: "round",
                                        strokeWidth: 2,
                                        d: "M5 13l4 4L19 7"
                                    })
                                }), e.jsx("span", {
                                    className: "text-gray-700",
                                    children: s
                                })]
                            }, i))
                        })]
                    })]
                })]
            })
        }), e.jsx(d, {
            open: a,
            onOpenChange: o
        })]
    })
}
export {
    W as Home
};