import type { Metadata, Viewport } from "next";
import "./globals.css";
import { inter } from "@/lib/fonts";
import ClientLayout from "./client-layout";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Providers } from "./providers";
import { RootErrorBoundary } from "@/components/ErrorBoundary";
import { Suspense } from "react";
import { Loader } from "lucide-react";
import PWARegister from "@/components/PWARegister";
import VersionCheck from "@/components/VersionCheck";

export const metadata: Metadata = {
  metadataBase: new URL("https://garaad.so"),
  title: {
    default: "Garaad STEM - #1 Somali Learning Platform for Tech & Coding",
    template: "%s | Garaad STEM",
  },
  description:
    "Garaad waa platform-ka waxbarasho ee ugu horreeya ee Soomaalida oo lagu barto STEM iyo Programming. Baro Full-Stack Development, AI, Cybersecurity, iyo Xisaabta adiga oo isticmaalaya Af-Soomaali hufan oo casri ah.",
  keywords: [
    "Garaad", "Garaad STEM", "STEM Soomaali", "Baro Programming Soomaali", "Baro Coding Soomaali", "Af-Soomaali",
    "Full-Stack Development Soomaali", "React Soomaali", "Next.js Soomaali",
    "Amniga Internetka", "Cybersecurity Somali", "Sirdoonka Macmalka ah Soomaali", "AI Somali",
    "Sayniska Xogta Soomaali", "Data Science Somali", "Xisaabta Soomaali", "Physics Soomaali",
    "Startup Soomaali", "Launchpad Soomaali", "Somali Tech Academy", "First Somali Platform",
    "Online Somali Courses", "Somali Education Technology", "Garaad Academy"
  ],
  authors: [{ name: "Garaad Team", url: "https://garaad.so" }],
  creator: "Garaad STEM",
  publisher: "Garaad STEM",
  alternates: {
    canonical: "/",
    languages: {
      "so-SO": "/",
      "en-US": "/en",
    },
  },
  openGraph: {
    type: "website",
    locale: "so_SO",
    url: "https://garaad.so",
    siteName: "Garaad STEM",
    title: "Garaad STEM - Baro STEM iyo Programming oo Soomaali ah",
    description: "Platform-ka ugu horreeya ee Soomaalida loogu talagalay barashada STEM. Ku baro afkaaga hooyo adiga oo dhisaya mustaqbalkaaga tech.",
    images: [
      {
        url: "/images/og-main.jpg",
        width: 1200,
        height: 630,
        alt: "Garaad STEM Academy - Learning in Somali",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Garaad STEM - Baro STEM iyo Programming",
    description: "Platform-ka ugu horreeya ee Soomaalida loogu talagalay barashada STEM. Ku baro coding iyo technology afkaaga hooyo.",
    images: ["/images/og-main.jpg"],
    creator: "@Garaadstem",
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
              name: "Garaad",
              url: "https://garaad.so",
              logo: "https://garaad.so/logo.png",
              sameAs: [
                "https://www.linkedin.com/company/garaad",
                "https://x.com/Garaadstem",
                "https://facebook.com/Garaadstem"
              ],
              contactPoint: {
                "@type": "ContactPoint",
                "email": "Info@garaad.org",
                "contactType": "customer support"
              }
            }),
          }}
        />
        {/* Performance Optimization: Move scripts to next/script with lazyOnload */}
        <Script
          src="https://js.stripe.com/v3/"
          strategy="lazyOnload"
        />
        <Script
          src="https://cdn.shakebugs.com/browser/shake.javascript"
          strategy="lazyOnload"
        />
      </head>
      <body className={inter.className}>
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
