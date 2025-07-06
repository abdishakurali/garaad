import Head from 'next/head';

interface SEOHeadProps {
    title?: string;
    description?: string;
    keywords?: string[];
    image?: string;
    url?: string;
    type?: 'website' | 'article' | 'course';
    courseData?: {
        name: string;
        description: string;
        level: string;
        category: string;
    };
}

export default function SEOHead({
    title = "Garaad - #1 Somali STEM Platform | Xisaab, Algebra, Geometry, Physics, AI, Crypto",
    description = "Garaad waa platform-ka ugu horreeya ee Soomaalida oo ku saabsan barashada xisaabta, algebra, geometry, physics, AI, crypto iyo STEM-ka oo dhan.",
    keywords = [
        "Garaad",
        "Xisaab Soomaali",
        "Algebra Soomaali",
        "Geometry Soomaali",
        "Physics Soomaali",
        "AI Soomaali",
        "Crypto Soomaali",
        "STEM Soomaali",
        "Somali Math",
        "Somali Algebra",
        "Somali Geometry",
        "Somali Physics",
        "Somali AI",
        "Somali Crypto",
        "Somali STEM"
    ],
    image = "/images/og-image.jpg",
    url = "https://garaad.so",
    type = "website",
    courseData
}: SEOHeadProps) {
    const fullUrl = url.startsWith('http') ? url : `https://garaad.so${url}`;
    const fullImageUrl = image.startsWith('http') ? image : `https://garaad.so${image}`;

    return (
        <Head>
            {/* Basic Meta Tags */}
            <title>{title}</title>
            <meta name="description" content={description} />
            <meta name="keywords" content={keywords.join(', ')} />
            <meta name="author" content="Garaad Team" />
            <meta name="robots" content="index, follow" />
            <meta name="language" content="Somali" />
            <meta name="revisit-after" content="7 days" />
            <meta name="distribution" content="global" />
            <meta name="rating" content="general" />

            {/* Canonical URL */}
            <link rel="canonical" href={fullUrl} />

            {/* Open Graph Meta Tags */}
            <meta property="og:title" content={title} />
            <meta property="og:description" content={description} />
            <meta property="og:type" content={type} />
            <meta property="og:url" content={fullUrl} />
            <meta property="og:image" content={fullImageUrl} />
            <meta property="og:image:width" content="1200" />
            <meta property="og:image:height" content="630" />
            <meta property="og:site_name" content="Garaad - Somali STEM Education" />
            <meta property="og:locale" content="so_SO" />

            {/* Twitter Meta Tags */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={title} />
            <meta name="twitter:description" content={description} />
            <meta name="twitter:image" content={fullImageUrl} />
            <meta name="twitter:site" content="@garaad_so" />
            <meta name="twitter:creator" content="@garaad_so" />

            {/* Additional Meta Tags for Somali STEM */}
            <meta name="geo.region" content="SO" />
            <meta name="geo.country" content="Somalia" />
            <meta name="geo.placename" content="Somalia" />
            <meta name="ICBM" content="2.0469, 45.3181" />

            {/* Course-specific Structured Data */}
            {courseData && (
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify({
                            "@context": "https://schema.org",
                            "@type": "Course",
                            "name": courseData.name,
                            "description": courseData.description,
                            "provider": {
                                "@type": "Organization",
                                "name": "Garaad",
                                "url": "https://garaad.so"
                            },
                            "educationalLevel": courseData.level,
                            "inLanguage": "so-SO",
                            "courseCategory": courseData.category,
                            "url": fullUrl,
                            "image": fullImageUrl,
                            "offers": {
                                "@type": "Offer",
                                "price": "0",
                                "priceCurrency": "USD",
                                "availability": "https://schema.org/InStock"
                            }
                        })
                    }}
                />
            )}

            {/* Breadcrumb Structured Data */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "BreadcrumbList",
                        "itemListElement": [
                            {
                                "@type": "ListItem",
                                "position": 1,
                                "name": "Home",
                                "item": "https://garaad.so"
                            },
                            {
                                "@type": "ListItem",
                                "position": 2,
                                "name": "Courses",
                                "item": "https://garaad.so/courses"
                            },
                            courseData && {
                                "@type": "ListItem",
                                "position": 3,
                                "name": courseData.category,
                                "item": `https://garaad.so/courses/${courseData.category.toLowerCase().replace(/\s+/g, '-')}`
                            },
                            courseData && {
                                "@type": "ListItem",
                                "position": 4,
                                "name": courseData.name,
                                "item": fullUrl
                            }
                        ].filter(Boolean)
                    })
                }}
            />

            {/* Organization Structured Data */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "Organization",
                        "name": "Garaad",
                        "alternateName": "Garaad Somali STEM Platform",
                        "url": "https://garaad.so",
                        "logo": "https://garaad.so/logo.png",
                        "sameAs": [
                            "https://twitter.com/garaad_so",
                            "https://facebook.com/garaad.so",
                            "https://instagram.com/garaad.so",
                            "https://youtube.com/@garaad.so"
                        ],
                        "contactPoint": {
                            "@type": "ContactPoint",
                            "contactType": "customer service",
                            "email": "info@garaad.so",
                            "availableLanguage": ["Somali", "English"]
                        },
                        "address": {
                            "@type": "PostalAddress",
                            "addressCountry": "SO",
                            "addressRegion": "Somalia"
                        }
                    })
                }}
            />

            {/* WebSite Structured Data */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "WebSite",
                        "name": "Garaad",
                        "url": "https://garaad.so",
                        "description": "Somali STEM Education Platform",
                        "potentialAction": {
                            "@type": "SearchAction",
                            "target": {
                                "@type": "EntryPoint",
                                "urlTemplate": "https://garaad.so/search?q={search_term_string}"
                            },
                            "query-input": "required name=search_term_string"
                        }
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