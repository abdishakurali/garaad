import Head from 'next/head';

export default function HomepageSEO() {
    return (
        <Head>
            {/* Primary Meta Tags */}
            <title>Garaad - #1 Somali STEM Platform | Xisaab, Algebra, Geometry, Physics, AI, Crypto</title>
            <meta name="description" content="Garaad waa platform-ka ugu horreeya ee Soomaalida oo ku saabsan barashada xisaabta, algebra, geometry, physics, AI, crypto iyo STEM-ka oo dhan. Waxaan kuu diyaarisay koorsooyin tayo sare leh oo ku qoran Af-Soomaali." />
            <meta name="keywords" content="Garaad, Xisaab Soomaali, Algebra Soomaali, Geometry Soomaali, Physics Soomaali, AI Soomaali, Crypto Soomaali, STEM Soomaali, Somali Math, Somali Algebra, Somali Geometry, Somali Physics, Somali AI, Somali Crypto, Somali STEM, Barashada Xisaabta Soomaalida, Barashada Algebra Soomaalida, Barashada Geometry Soomaalida, Barashada Physics Soomaalida, Barashada AI Soomaalida, Barashada Crypto Soomaalida, Barashada STEM Soomaalida" />

            {/* Canonical URL */}
            <link rel="canonical" href="https://garaad.so" />

            {/* Open Graph Meta Tags */}
            <meta property="og:title" content="Garaad - #1 Somali STEM Platform | Xisaab, Algebra, Geometry, Physics, AI, Crypto" />
            <meta property="og:description" content="Garaad waa platform-ka ugu horreeya ee Soomaalida oo ku saabsan barashada xisaabta, algebra, geometry, physics, AI, crypto iyo STEM-ka oo dhan." />
            <meta property="og:type" content="website" />
            <meta property="og:url" content="https://garaad.so" />
            <meta property="og:image" content="https://garaad.so/images/og-image.jpg" />
            <meta property="og:image:width" content="1200" />
            <meta property="og:image:height" content="630" />
            <meta property="og:site_name" content="Garaad - Somali STEM Education" />
            <meta property="og:locale" content="so_SO" />

            {/* Twitter Meta Tags */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content="Garaad - #1 Somali STEM Platform | Xisaab, Algebra, Geometry, Physics, AI, Crypto" />
            <meta name="twitter:description" content="Garaad waa platform-ka ugu horreeya ee Soomaalida oo ku saabsan barashada xisaabta, algebra, geometry, physics, AI, crypto iyo STEM-ka oo dhan." />
            <meta name="twitter:image" content="https://garaad.so/images/twitter-image.jpg" />
            <meta name="twitter:site" content="@garaad_so" />
            <meta name="twitter:creator" content="@garaad_so" />

            {/* Additional Meta Tags */}
            <meta name="author" content="Garaad Team" />
            <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
            <meta name="language" content="Somali" />
            <meta name="geo.region" content="SO" />
            <meta name="geo.country" content="Somalia" />
            <meta name="geo.placename" content="Somalia" />
            <meta name="ICBM" content="2.0469, 45.3181" />

            {/* Homepage-specific Structured Data */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "WebSite",
                        "name": "Garaad",
                        "alternateName": "Garaad Somali STEM Platform",
                        "url": "https://garaad.so",
                        "description": "Garaad waa platform-ka ugu horreeya ee Soomaalida oo ku saabsan barashada xisaabta, algebra, geometry, physics, AI, crypto iyo STEM-ka oo dhan.",
                        "inLanguage": "so-SO",
                        "potentialAction": {
                            "@type": "SearchAction",
                            "target": {
                                "@type": "EntryPoint",
                                "urlTemplate": "https://garaad.so/search?q={search_term_string}"
                            },
                            "query-input": "required name=search_term_string"
                        },
                        "publisher": {
                            "@type": "Organization",
                            "name": "Garaad",
                            "url": "https://garaad.so",
                            "logo": {
                                "@type": "ImageObject",
                                "url": "https://garaad.so/logo.png"
                            }
                        }
                    })
                }}
            />

            {/* Organization Structured Data */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "EducationalOrganization",
                        "name": "Garaad",
                        "alternateName": "Garaad Somali STEM Platform",
                        "description": "Garaad waa platform-ka ugu horreeya ee Soomaalida oo ku saabsan barashada xisaabta, algebra, geometry, physics, AI, crypto iyo STEM-ka oo dhan.",
                        "url": "https://garaad.so",
                        "logo": "https://garaad.so/logo.png",
                        "image": "https://garaad.so/images/og-image.jpg",
                        "sameAs": [
                            "https://twitter.com/garaad_so",
                            "https://facebook.com/garaad.so",
                            "https://instagram.com/garaad.so",
                            "https://youtube.com/@garaad.so"
                        ],
                        "address": {
                            "@type": "PostalAddress",
                            "addressCountry": "SO",
                            "addressRegion": "Somalia"
                        },
                        "contactPoint": {
                            "@type": "ContactPoint",
                            "contactType": "customer service",
                            "email": "info@garaad.so",
                            "availableLanguage": ["Somali", "English"]
                        },
                        "hasOfferCatalog": {
                            "@type": "OfferCatalog",
                            "name": "Somali STEM Courses",
                            "itemListElement": [
                                {
                                    "@type": "Offer",
                                    "itemOffered": {
                                        "@type": "Course",
                                        "name": "Xisaabta Aasaasiga - Somali Basic Math",
                                        "description": "Barashada xisaabta aasaasiga ee Soomaalida",
                                        "provider": {
                                            "@type": "Organization",
                                            "name": "Garaad"
                                        },
                                        "educationalLevel": "Beginner",
                                        "inLanguage": "so-SO"
                                    }
                                },
                                {
                                    "@type": "Offer",
                                    "itemOffered": {
                                        "@type": "Course",
                                        "name": "Algebra Soomaali - Somali Algebra",
                                        "description": "Barashada algebra ee Soomaalida",
                                        "provider": {
                                            "@type": "Organization",
                                            "name": "Garaad"
                                        },
                                        "educationalLevel": "Intermediate",
                                        "inLanguage": "so-SO"
                                    }
                                },
                                {
                                    "@type": "Offer",
                                    "itemOffered": {
                                        "@type": "Course",
                                        "name": "Geometry Soomaali - Somali Geometry",
                                        "description": "Barashada geometry ee Soomaalida",
                                        "provider": {
                                            "@type": "Organization",
                                            "name": "Garaad"
                                        },
                                        "educationalLevel": "Intermediate",
                                        "inLanguage": "so-SO"
                                    }
                                },
                                {
                                    "@type": "Offer",
                                    "itemOffered": {
                                        "@type": "Course",
                                        "name": "Physics Soomaali - Somali Physics",
                                        "description": "Barashada physics ee Soomaalida",
                                        "provider": {
                                            "@type": "Organization",
                                            "name": "Garaad"
                                        },
                                        "educationalLevel": "Intermediate",
                                        "inLanguage": "so-SO"
                                    }
                                },
                                {
                                    "@type": "Offer",
                                    "itemOffered": {
                                        "@type": "Course",
                                        "name": "AI Soomaali - Somali Artificial Intelligence",
                                        "description": "Barashada AI ee Soomaalida",
                                        "provider": {
                                            "@type": "Organization",
                                            "name": "Garaad"
                                        },
                                        "educationalLevel": "Advanced",
                                        "inLanguage": "so-SO"
                                    }
                                },
                                {
                                    "@type": "Offer",
                                    "itemOffered": {
                                        "@type": "Course",
                                        "name": "Crypto Soomaali - Somali Cryptocurrency",
                                        "description": "Barashada cryptocurrency ee Soomaalida",
                                        "provider": {
                                            "@type": "Organization",
                                            "name": "Garaad"
                                        },
                                        "educationalLevel": "Intermediate",
                                        "inLanguage": "so-SO"
                                    }
                                }
                            ]
                        }
                    })
                }}
            />

            {/* Local Business Structured Data */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "LocalBusiness",
                        "name": "Garaad",
                        "description": "Somali STEM Education Platform",
                        "url": "https://garaad.so",
                        "telephone": "+252-XX-XXXXXXX",
                        "address": {
                            "@type": "PostalAddress",
                            "addressCountry": "SO",
                            "addressRegion": "Somalia"
                        },
                        "geo": {
                            "@type": "GeoCoordinates",
                            "latitude": "2.0469",
                            "longitude": "45.3181"
                        },
                        "openingHours": "Mo-Su 00:00-23:59",
                        "priceRange": "Free to Premium",
                        "currenciesAccepted": "USD, EUR, SOS",
                        "paymentAccepted": "Cash, Credit Card, Mobile Money"
                    })
                }}
            />

            {/* FAQ Schema for Homepage */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "FAQPage",
                        "mainEntity": [
                            {
                                "@type": "Question",
                                "name": "Waa maxay Garaad?",
                                "acceptedAnswer": {
                                    "@type": "Answer",
                                    "text": "Garaad waa platform-ka ugu horreeya ee Soomaalida oo ku saabsan barashada xisaabta, algebra, geometry, physics, AI, crypto iyo STEM-ka oo dhan."
                                }
                            },
                            {
                                "@type": "Question",
                                "name": "Ma heli kartaa koorsooyinka xisaabta Soomaalida?",
                                "acceptedAnswer": {
                                    "@type": "Answer",
                                    "text": "Haa, waxaan kuu diyaarisay koorsooyin dhammeysan oo ku saabsan xisaabta, algebra, geometry, physics, AI, crypto iyo STEM-ka oo dhan."
                                }
                            },
                            {
                                "@type": "Question",
                                "name": "Ma lacag baa looga baahan yahay?",
                                "acceptedAnswer": {
                                    "@type": "Answer",
                                    "text": "Waxaa jira koorsooyin bilaash ah iyo kuwo lacag leh. Waxaad dooran kartaa midka aad rabto."
                                }
                            },
                            {
                                "@type": "Question",
                                "name": "Ma ku baran kartaa AI Soomaalida?",
                                "acceptedAnswer": {
                                    "@type": "Answer",
                                    "text": "Haa, waxaan kuu diyaarisay koorsooyin dhammeysan oo ku saabsan AI, machine learning, iyo artificial intelligence ee ku qoran Af-Soomaali."
                                }
                            },
                            {
                                "@type": "Question",
                                "name": "Ma ku baran kartaa Crypto Soomaalida?",
                                "acceptedAnswer": {
                                    "@type": "Answer",
                                    "text": "Haa, waxaan kuu diyaarisay koorsooyin ku saabsan cryptocurrency, blockchain, Bitcoin, Ethereum iyo digital finance ee ku qoran Af-Soomaali."
                                }
                            },
                            {
                                "@type": "Question",
                                "name": "Ma ku baran kartaa Geometry Soomaalida?",
                                "acceptedAnswer": {
                                    "@type": "Answer",
                                    "text": "Haa, waxaan kuu diyaarisay koorsooyin ku saabsan geometry, shapes, angles, areas, iyo volumes ee ku qoran Af-Soomaali."
                                }
                            },
                            {
                                "@type": "Question",
                                "name": "Ma ku baran kartaa Physics Soomaalida?",
                                "acceptedAnswer": {
                                    "@type": "Answer",
                                    "text": "Haa, waxaan kuu diyaarisay koorsooyin ku saabsan physics, mechanics, electricity, magnetism, iyo modern physics ee ku qoran Af-Soomaali."
                                }
                            },
                            {
                                "@type": "Question",
                                "name": "Ma ku baran kartaa Algebra Soomaalida?",
                                "acceptedAnswer": {
                                    "@type": "Answer",
                                    "text": "Haa, waxaan kuu diyaarisay koorsooyin ku saabsan algebra, functions, equations, iyo algebraic expressions ee ku qoran Af-Soomaali."
                                }
                            }
                        ]
                    })
                }}
            />

            {/* Additional Meta Tags for Better SEO */}
            <meta name="theme-color" content="#3B82F6" />
            <meta name="msapplication-TileColor" content="#3B82F6" />
            <meta name="apple-mobile-web-app-capable" content="yes" />
            <meta name="apple-mobile-web-app-status-bar-style" content="default" />
            <meta name="apple-mobile-web-app-title" content="Garaad" />
            <meta name="application-name" content="Garaad" />
            <meta name="msapplication-TileImage" content="/logo.png" />
            <meta name="msapplication-config" content="/browserconfig.xml" />

            {/* Preconnect for Performance */}
            <link rel="preconnect" href="https://fonts.googleapis.com" />
            <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
            <link rel="preconnect" href="https://www.google-analytics.com" />
            <link rel="preconnect" href="https://www.googletagmanager.com" />

            {/* DNS Prefetch */}
            <link rel="dns-prefetch" href="//fonts.googleapis.com" />
            <link rel="dns-prefetch" href="//www.google-analytics.com" />
            <link rel="dns-prefetch" href="//www.googletagmanager.com" />
        </Head>
    );
} 