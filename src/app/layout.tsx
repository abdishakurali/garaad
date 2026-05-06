import type { Metadata, Viewport } from "next";
import "./globals.css";
import { notoSansSC, inter, instrumentSerif, dmMono } from "@/lib/fonts";

import ClientLayout from "./client-layout";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Providers } from "./providers";
import { RootErrorBoundary } from "@/components/ErrorBoundary";
import { Suspense } from "react";
import { Loader } from "lucide-react";
import PWARegister from "@/components/PWARegister";
import VersionCheck from "@/components/VersionCheck";

const SITE_URL = "https://garaad.org";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Garaad STEM - Baro Full-Stack, AI & STEM oo Soomaali ah",
    template: "%s | Garaad STEM",
  },
  description:
    "Platform-ka ugu horreeya ee Soomaalida ee STEM iyo Programming. Baro React, Next.js, AI & STEM Af-Soomaali. Bilaash bilow.",
  keywords: [
    "Garaad", "Garaad STEM", "Garaad Academy", "STEM Soomaali", "Baro Programming Soomaali", "Baro Coding Soomaali", "Af-Soomaali",
    "Full-Stack Soomaali", "React Soomaali", "Next.js Soomaali", "AI Soomaali",
    "Xisaabta Soomaali", "Physics Soomaali", "Somali Tech Academy",
    "First Somali Platform", "Online Somali Courses",
    // English stack keywords for diaspora + international discovery
    "learn React Somalia", "Next.js course Somali", "full stack developer Somalia",
    "coding bootcamp Somalia", "learn programming Somalia", "Somali developer",
    "web development Somali", "learn coding in Somali", "software engineer Somalia",
    "MERN stack Somalia", "JavaScript course Somali", "Abdishakur Ali",
  ],
  authors: [{ name: "Garaad Team", url: SITE_URL }],
  creator: "Garaad STEM",
  publisher: "Garaad STEM",
  alternates: {
    canonical: SITE_URL,
    languages: {
      so: SITE_URL,
      "x-default": SITE_URL,
    },
  },
  openGraph: {
    type: "website",
    locale: "so_SO",
    url: SITE_URL,
    siteName: "Garaad STEM",
    title: "Garaad STEM - Baro STEM iyo Programming oo Soomaali ah",
    description: "Platform-ka ugu horreeya ee Soomaalida loogu talagalay barashada STEM. Baro coding iyo technology afkaaga hooyo.",
    images: [{ url: "/images/og-main.jpg", width: 1200, height: 630, alt: "Garaad STEM - Somali Tech Learning" }],
  },
  twitter: {
    card: "summary_large_image",
    site: "@garaadorg",
    title: "Garaad STEM - Baro STEM iyo Programming",
    description: "Platform-ka ugu horreeya ee Soomaalida loogu talagalay barashada STEM.",
    images: ["/images/og-main.jpg"],
    creator: "@Garaadstem",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-video-preview": -1, "max-image-preview": "large", "max-snippet": -1 },
  },
  category: "education",
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

import { Toaster } from "@/components/ui/ToasterUI";
import { OverlayElements } from "@/components/landing/OverlayElements";

import Script from "next/script";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="so" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "EducationalOrganization",
              "@id": "https://garaad.org/#organization",
              name: "Garaad STEM",
              alternateName: "Garaad",
              url: "https://garaad.org",
              logo: "https://garaad.org/logo.png",
              foundingDate: "2023",
              description: "Somalia's first full-stack coding and STEM platform. Learn React, Next.js, Node.js, MongoDB and AI in Somali.",
              inLanguage: ["so", "en"],
              areaServed: ["SO", "IE", "GB", "US"],
              teaches: ["React", "Next.js", "Node.js", "MongoDB", "AI", "Full-Stack Development", "JavaScript", "Python"],
              sameAs: [
                "https://www.linkedin.com/company/garaad",
                "https://x.com/Garaadstem",
                "https://facebook.com/Garaadstem",
              ],
              contactPoint: {
                "@type": "ContactPoint",
                email: "Info@garaad.org",
                contactType: "customer support",
                areaServed: ["SO", "IE", "GB", "US"],
              },
            }),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              "@id": "https://garaad.org/#website",
              url: "https://garaad.org",
              name: "Garaad STEM",
              publisher: { "@id": "https://garaad.org/#organization" },
              inLanguage: ["so-SO", "en"],
              potentialAction: {
                "@type": "SearchAction",
                target: {
                  "@type": "EntryPoint",
                  urlTemplate: "https://garaad.org/courses?q={search_term_string}",
                },
                "query-input": "required name=search_term_string",
              },
            }),
          }}
        />
        {/* Performance Optimization: Move scripts to next/script with lazyOnload */}
        <Script
          src="https://js.stripe.com/v3/"
          strategy="lazyOnload"
        />
        <Script
          id="clarity-script"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `(function(c,l,a,r,i,t,y){
        c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
        t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
        y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
    })(window, document, "clarity", "script", "wmttjsweju");`,
          }}
        />
      </head>
      <body className={`${notoSansSC.variable} ${inter.variable} ${instrumentSerif.variable} ${dmMono.variable} font-sans antialiased text-foreground bg-background`}>

        <Providers>
          <RootErrorBoundary>
            <ClientLayout>
              <PWARegister />
              <VersionCheck />
              <Suspense fallback={<Loader className="spin " />}>
                {children}
              </Suspense>
              <OverlayElements />
            </ClientLayout>
            <Toaster />
            <Analytics />
            <SpeedInsights />
          </RootErrorBoundary>
        </Providers>
      </body>
    </html>
  );
}
