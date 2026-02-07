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
  title: {
    default:
      "Garaad - #1 Somali STEM Platform | Xisaab, Algebra, Geometry, Physics, AI, Crypto",
    template: "%s | Garaad - Somali STEM Education",
  },
  description:
    "Garaad waa platform-ka waxbarasho ee ugu horreeya ee Soomaalida oo lagu barto STEM: Xisaabta, Physics, iyo Programming. Ku baro afkaaga hooyo casharo tayo leh meel kasta.",
  keywords: [
    "Garaad", "Garaad STEM", "Xisaabta Soomaali", "Baro Coding", "STEM Soomaali",
    "AI Soomaali", "Physics Soomaali", "Soomaali Education", "Tiknoolajiyad Soomaali",
    "Somali STEM Education", "Garaad Education", "Xisaab", "Algebra Soomaaliya"
  ],
  authors: [{ name: "Garaad Team", url: "https://garaad.so" }],
  creator: "Abdishakur Ali",
  publisher: "Garaad",
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
      "Garaad waa platform-ka ugu horreeya ee Soomaalida oo ku saabsan barashada xisaabta, algebra, geometry, physics, AI, crypto iyo STEM-ka oo dhan.",
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
