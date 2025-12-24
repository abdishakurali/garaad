import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { inter } from "@/lib/fonts";
import ClientLayout from "./client-layout";
import { Analytics } from "@vercel/analytics/react";
import { Providers } from "./providers";
import ErrorBoundary from "@/components/ErrorBoundary";
import { Suspense } from "react";
import { Loader } from "lucide-react";
import PWARegister from "@/components/PWARegister";

export const metadata: Metadata = {
  title: {
    default:
      "Garaad - #1 Somali STEM Platform | Xisaab, Algebra, Geometry, Physics, AI, Crypto",
    template: "%s | Garaad - Somali STEM Education",
  },
  description:
    "Garaad waa platform-ka ugu horreeya ee Soomaalida oo ku saabsan barashada xisaabta, algebra, geometry, physics, AI, crypto iyo STEM-ka oo dhan. Waxaan kuu diyaarisay koorsooyin tayo sare leh oo ku qoran Af-Soomaali, gaar ahaan ardayda Soomaalida ee Gen Z.",
  keywords: [
    // Primary Somali STEM Keywords
    "Garaad",
    "Xisaab Soomaali",
    "Algebra Soomaali",
    "Geometry Soomaali",
    "Physics Soomaali",
    "Fiisikis Soomaali",
    "Crypto Soomaali",
    "AI Soomaali",
    "STEM Soomaali",
    "Barashada Xisaabta Soomaalida",
    "Barashada Algebra Soomaalida",
    "Barashada Geometry Soomaalida",
    "Barashada Physics Soomaalida",
    "Barashada AI Soomaalida",
    "Barashada Crypto Soomaalida",
    "Barashada STEM Soomaalida",

    // Secondary Keywords
    "Saynis Soomaali",
    "Cilmi-baarista Soomaali",
    "Barashada Online Soomaali",
    "Koorsooyinka Xisaabta",
    "Koorsooyinka Algebra",
    "Koorsooyinka Geometry",
    "Koorsooyinka Physics",
    "Koorsooyinka AI",
    "Koorsooyinka Crypto",
    "Koorsooyinka STEM",
    "Barashada Af-Soomaali",
    "Barashada Cilmiga",
    "Barashada Fikradaha Cilmiga",

    // Regional Keywords
    "Xisaab Soomaaliland",
    "Algebra Soomaaliland",
    "Geometry Soomaaliland",
    "Physics Soomaaliland",
    "AI Soomaaliland",
    "Crypto Soomaaliland",
    "STEM Soomaaliland",
    "Xisaab Puntland",
    "Algebra Puntland",
    "Geometry Puntland",
    "Physics Puntland",
    "AI Puntland",
    "Crypto Puntland",
    "STEM Puntland",
    "Xisaab Jubaland",
    "Algebra Jubaland",
    "Geometry Jubaland",
    "Physics Jubaland",
    "AI Jubaland",
    "Crypto Jubaland",
    "STEM Jubaland",

    // City-specific Keywords
    "Xisaab Muqdisho",
    "Algebra Muqdisho",
    "Geometry Muqdisho",
    "Physics Muqdisho",
    "AI Muqdisho",
    "Crypto Muqdisho",
    "STEM Muqdisho",
    "Xisaab Hargeysa",
    "Algebra Hargeysa",
    "Geometry Hargeysa",
    "Physics Hargeysa",
    "AI Hargeysa",
    "Crypto Hargeysa",
    "STEM Hargeysa",
    "Xisaab Garoowe",
    "Algebra Garoowe",
    "Geometry Garoowe",
    "Physics Garoowe",
    "AI Garoowe",
    "Crypto Garoowe",
    "STEM Garoowe",
    "Xisaab Kismaayo",
    "Algebra Kismaayo",
    "Geometry Kismaayo",
    "Physics Kismaayo",
    "AI Kismaayo",
    "Crypto Kismaayo",
    "STEM Kismaayo",

    // Educational Level Keywords
    "Xisaab Ardayda",
    "Algebra Ardayda",
    "Geometry Ardayda",
    "Physics Ardayda",
    "AI Ardayda",
    "Crypto Ardayda",
    "STEM Ardayda",
    "Xisaab Macallimiinta",
    "Algebra Macallimiinta",
    "Geometry Macallimiinta",
    "Physics Macallimiinta",
    "AI Macallimiinta",
    "Crypto Macallimiinta",
    "STEM Macallimiinta",
    "Xisaab Qoysaska",
    "Algebra Qoysaska",
    "Geometry Qoysaska",
    "Physics Qoysaska",
    "AI Qoysaska",
    "Crypto Qoysaska",
    "STEM Qoysaska",

    // Advanced Keywords
    "Barashada Xisaabta Heerka Sare",
    "Barashada Algebra Heerka Sare",
    "Barashada Geometry Heerka Sare",
    "Barashada Physics Heerka Sare",
    "Barashada AI Heerka Sare",
    "Barashada Crypto Heerka Sare",
    "Barashada STEM Heerka Sare",
    "Barashada Xisaabta Aasaasiga",
    "Barashada Algebra Aasaasiga",
    "Barashada Geometry Aasaasiga",
    "Barashada Physics Aasaasiga",
    "Barashada AI Aasaasiga",
    "Barashada Crypto Aasaasiga",
    "Barashada STEM Aasaasiga",

    // International Keywords
    "Somali Math",
    "Somali Algebra",
    "Somali Geometry",
    "Somali Physics",
    "Somali AI",
    "Somali Crypto",
    "Somali STEM",
    "Somali Mathematics",
    "Somali Science",
    "Somali Technology",
    "Somali Engineering",
    "Somali Education",

    // Gen Z Keywords
    "Gen Z Soomaali",
    "Barashada Xisaabta ee Gen Z",
    "Barashada Algebra ee Gen Z",
    "Barashada Geometry ee Gen Z",
    "Barashada Physics ee Gen Z",
    "Barashada AI ee Gen Z",
    "Barashada Crypto ee Gen Z",
    "Barashada STEM ee Gen Z",

    // Online Learning Keywords
    "Barashada Online ee Soomaalida",
    "Koorsooyinka Online",
    "Barashada Xisaabta Online",
    "Barashada Algebra Online",
    "Barashada Geometry Online",
    "Barashada Physics Online",
    "Barashada AI Online",
    "Barashada Crypto Online",
    "Barashada STEM Online",

    // Platform Keywords
    "Platform-ka Xisaabta Soomaalida",
    "Platform-ka Algebra Soomaalida",
    "Platform-ka Geometry Soomaalida",
    "Platform-ka Physics Soomaalida",
    "Platform-ka AI Soomaalida",
    "Platform-ka Crypto Soomaalida",
    "Platform-ka STEM Soomaalida",
    "Platform-ka Barashada Soomaalida",
    "Platform-ka Cilmiga Soomaalida",
    "Platform-ka Sayniska Soomaalida",

    // Quality Keywords
    "Tayo Sare",
    "Koorsooyin Tayo Sare",
    "Barashada Tayo Sare",
    "Cilmiga Tayo Sare",
    "Sayniska Tayo Sare",
    "Xisaabta Tayo Sare",
    "Algebra Tayo Sare",
    "Geometry Tayo Sare",
    "Physics Tayo Sare",
    "AI Tayo Sare",
    "Crypto Tayo Sare",
    "STEM Tayo Sare",
  ],
  authors: [{ name: "Garaad Team" }],
  creator: "Garaad Team",
  publisher: "Garaad",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://garaad.so"),
  alternates: {
    canonical: "/",
    languages: {
      "so-SO": "/",
      "en-US": "/en",
      "ar-SA": "/ar",
    },
  },
  openGraph: {
    type: "website",
    locale: "so_SO",
    url: "https://garaad.so",
    title:
      "Garaad - #1 Somali STEM Platform | Xisaab, Algebra, Geometry, Physics, AI, Crypto",
    description:
      "Garaad waa platform-ka ugu horreeya ee Soomaalida oo ku saabsan barashada xisaabta, algebra, geometry, physics, AI, crypto iyo STEM-ka oo dhan. Waxaan kuu diyaarisay koorsooyin tayo sare leh oo ku qoran Af-Soomaali.",
    siteName: "Garaad - Somali STEM Education",
    images: [
      {
        url: "/images/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Garaad - #1 Somali STEM Platform | Xisaab, Algebra, Geometry, Physics, AI, Crypto",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title:
      "Garaad - #1 Somali STEM Platform | Xisaab, Algebra, Geometry, Physics, AI, Crypto",
    description:
      "Garaad waa platform-ka ugu horreeya ee Soomaalida oo ku saabsan barashada xisaabta, algebra, geometry, physics, AI, crypto iyo STEM-ka oo dhan.",
    images: ["/images/twitter-image.jpg"],
    creator: "@garaad_so",
    site: "@garaad_so",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-site-verification",
    yandex: "your-yandex-verification",
    yahoo: "your-yahoo-verification",
    other: {
      me: ["your-email@example.com", "https://garaad.so"],
    },
  },
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Garaad",
  },
  icons: {
    apple: "/icons/icon-192x192.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="so" suppressHydrationWarning>
      <head>
        {/* JSON-LD Structured Data for SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "EducationalOrganization",
              name: "Garaad",
              alternateName: "Garaad Somali STEM Platform",
              description:
                "Garaad waa platform-ka ugu horreeya ee Soomaalida oo ku saabsan barashada xisaabta, algebra, geometry, physics, AI, crypto iyo STEM-ka oo dhan.",
              url: "https://garaad.so",
              logo: "https://garaad.so/logo.png",
              image: "https://garaad.so/images/og-image.jpg",
              sameAs: [
                "https://twitter.com/garaad_so",
                "https://facebook.com/garaad.so",
                "https://instagram.com/garaad.so",
              ],
              address: {
                "@type": "PostalAddress",
                addressCountry: "SO",
                addressRegion: "Somalia",
              },
              contactPoint: {
                "@type": "ContactPoint",
                contactType: "customer service",
                email: "info@garaad.so",
              },
              hasOfferCatalog: {
                "@type": "OfferCatalog",
                name: "Somali STEM Courses",
                itemListElement: [
                  {
                    "@type": "Offer",
                    itemOffered: {
                      "@type": "Course",
                      name: "Xisaabta Aasaasiga - Somali Basic Math",
                      description: "Barashada xisaabta aasaasiga ee Soomaalida",
                      provider: {
                        "@type": "Organization",
                        name: "Garaad",
                      },
                      educationalLevel: "Beginner",
                      inLanguage: "so-SO",
                    },
                  },
                  {
                    "@type": "Offer",
                    itemOffered: {
                      "@type": "Course",
                      name: "Algebra Soomaali - Somali Algebra",
                      description: "Barashada algebra ee Soomaalida",
                      provider: {
                        "@type": "Organization",
                        name: "Garaad",
                      },
                      educationalLevel: "Intermediate",
                      inLanguage: "so-SO",
                    },
                  },
                  {
                    "@type": "Offer",
                    itemOffered: {
                      "@type": "Course",
                      name: "Geometry Soomaali - Somali Geometry",
                      description: "Barashada geometry ee Soomaalida",
                      provider: {
                        "@type": "Organization",
                        name: "Garaad",
                      },
                      educationalLevel: "Intermediate",
                      inLanguage: "so-SO",
                    },
                  },
                  {
                    "@type": "Offer",
                    itemOffered: {
                      "@type": "Course",
                      name: "Physics Soomaali - Somali Physics",
                      description: "Barashada physics ee Soomaalida",
                      provider: {
                        "@type": "Organization",
                        name: "Garaad",
                      },
                      educationalLevel: "Intermediate",
                      inLanguage: "so-SO",
                    },
                  },
                  {
                    "@type": "Offer",
                    itemOffered: {
                      "@type": "Course",
                      name: "AI Soomaali - Somali Artificial Intelligence",
                      description: "Barashada AI ee Soomaalida",
                      provider: {
                        "@type": "Organization",
                        name: "Garaad",
                      },
                      educationalLevel: "Advanced",
                      inLanguage: "so-SO",
                    },
                  },
                  {
                    "@type": "Offer",
                    itemOffered: {
                      "@type": "Course",
                      name: "Crypto Soomaali - Somali Cryptocurrency",
                      description: "Barashada cryptocurrency ee Soomaalida",
                      provider: {
                        "@type": "Organization",
                        name: "Garaad",
                      },
                      educationalLevel: "Intermediate",
                      inLanguage: "so-SO",
                    },
                  },
                ],
              },
              potentialAction: {
                "@type": "SearchAction",
                target: {
                  "@type": "EntryPoint",
                  urlTemplate:
                    "https://garaad.so/search?q={search_term_string}",
                },
                "query-input": "required name=search_term_string",
              },
            }),
          }}
        />

        {/* Additional JSON-LD for Local Business */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "LocalBusiness",
              name: "Garaad",
              description: "Somali STEM Education Platform",
              url: "https://garaad.so",
              telephone: "+252-XX-XXXXXXX",
              address: {
                "@type": "PostalAddress",
                addressCountry: "SO",
                addressRegion: "Somalia",
              },
              geo: {
                "@type": "GeoCoordinates",
                latitude: "2.0469",
                longitude: "45.3181",
              },
              openingHours: "Mo-Su 00:00-23:59",
              priceRange: "Free to Premium",
              currenciesAccepted: "USD, EUR, SOS",
              paymentAccepted: "Cash, Credit Card, Mobile Money",
            }),
          }}
        />

        {/* FAQ Schema for Common Questions */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              mainEntity: [
                {
                  "@type": "Question",
                  name: "Waa maxay Garaad?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "Garaad waa platform-ka ugu horreeya ee Soomaalida oo ku saabsan barashada xisaabta, algebra, geometry, physics, AI, crypto iyo STEM-ka oo dhan.",
                  },
                },
                {
                  "@type": "Question",
                  name: "Ma heli kartaa koorsooyinka xisaabta Soomaalida?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "Haa, waxaan kuu diyaarisay koorsooyin dhammeysan oo ku saabsan xisaabta, algebra, geometry, physics, AI, crypto iyo STEM-ka oo dhan.",
                  },
                },
                {
                  "@type": "Question",
                  name: "Ma lacag baa looga baahan yahay?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "Waxaa jira koorsooyin bilaash ah iyo kuwo lacag leh. Waxaad dooran kartaa midka aad rabto.",
                  },
                },
                {
                  "@type": "Question",
                  name: "Ma ku baran kartaa AI Soomaalida?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "Haa, waxaan kuu diyaarisay koorsooyin dhammeysan oo ku saabsan AI, machine learning, iyo artificial intelligence ee ku qoran Af-Soomaali.",
                  },
                },
                {
                  "@type": "Question",
                  name: "Ma ku baran kartaa Crypto Soomaalida?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "Haa, waxaan kuu diyaarisay koorsooyin ku saabsan cryptocurrency, blockchain, Bitcoin, Ethereum iyo digital finance ee ku qoran Af-Soomaali.",
                  },
                },
              ],
            }),
          }}
        />
      </head>
      <body className={inter.className}>
        <ErrorBoundary>
          <Providers>
            <ClientLayout>
              <PWARegister />
              <Suspense fallback={<Loader className="spin " />}>
                {children}
              </Suspense>
              <Toaster />
            </ClientLayout>
            <Analytics />
          </Providers>
        </ErrorBoundary>
      </body>
    </html>
  );
}
