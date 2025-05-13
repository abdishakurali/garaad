import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { inter } from "@/lib/fonts";
import ClientLayout from "./client-layout";
import { Analytics } from "@vercel/analytics/react";
import { Providers } from "./providers";
import ShakeInitializer from "@/components/ShakeInitializer";

export const metadata: Metadata = {
  title: {
    default: "Garaad - Barashada Xisaabta iyo Sayniska ee Soomaalida",
    template: "%s | Garaad",
  },
  description:
    "Garaad waa platform-ka ugu horreeya ee Soomaalida oo ku saabsan barashada xisaabta, sayniska, iyo fikradaha cilmi-baarista. Waxaan kuu diyaarisay koorsooyin tayo sare leh oo ku qoran Af-Soomaali, gaar ahaan ardayda Soomaalida ee Gen Z.",
  keywords: [
    "Garaad",
    "Barashada Xisaabta Soomaalida",
    "Barashada Sayniska Soomaalida",
    "STEM Soomaali",
    "Xisaab Soomaali",
    "Saynis Soomaali",
    "Gen Z Soomaali",
    "Barashada Online Soomaali",
    "Koorsooyinka Xisaabta",
    "Koorsooyinka Sayniska",
    "Barashada Af-Soomaali",
    "Barashada Cilmiga",
    "Barashada Fikradaha Cilmiga",
    "Barashada Xisaabta Aasaasiga",
    "Barashada Xisaabta Heerka Sare",
    "Barashada Sayniska Aasaasiga",
    "Barashada Sayniska Heerka Sare",
    "Barashada Online ee Soomaalida",
    "Barashada Xisaabta ee Soomaalida",
    "Barashada Sayniska ee Soomaalida",
    "Barashada Fikradaha Cilmiga ee Soomaalida",
    "Barashada Xisaabta ee Gen Z",
    "Barashada Sayniska ee Gen Z",
    "Barashada Fikradaha Cilmiga ee Gen Z",
    "Barashada Xisaabta ee Ardayda",
    "Barashada Sayniska ee Ardayda",
    "Barashada Fikradaha Cilmiga ee Ardayda",
    "Barashada Xisaabta ee Macallimiinta",
    "Barashada Sayniska ee Macallimiinta",
    "Barashada Fikradaha Cilmiga ee Macallimiinta",
    "Barashada Xisaabta ee Qoysaska",
    "Barashada Sayniska ee Qoysaska",
    "Barashada Fikradaha Cilmiga ee Qoysaska",
    "Barashada Xisaabta ee Bulshada",
    "Barashada Sayniska ee Bulshada",
    "Barashada Fikradaha Cilmiga ee Bulshada",
    "Barashada Xisaabta ee Dalka",
    "Barashada Sayniska ee Dalka",
    "Barashada Fikradaha Cilmiga ee Dalka",
    "Barashada Xisaabta ee Dunida",
    "Barashada Sayniska ee Dunida",
    "Barashada Fikradaha Cilmiga ee Dunida",
    "Barashada Xisaabta ee Caalamka",
    "Barashada Sayniska ee Caalamka",
    "Barashada Fikradaha Cilmiga ee Caalamka",
    "Barashada Xisaabta ee Afrika",
    "Barashada Sayniska ee Afrika",
    "Barashada Fikradaha Cilmiga ee Afrika",
    "Barashada Xisaabta ee Geeska Afrika",
    "Barashada Sayniska ee Geeska Afrika",
    "Barashada Fikradaha Cilmiga ee Geeska Afrika",
    "Barashada Xisaabta ee Soomaalida",
    "Barashada Sayniska ee Soomaalida",
    "Barashada Fikradaha Cilmiga ee Soomaalida",
    "Barashada Xisaabta ee Soomaaliyeed",
    "Barashada Sayniska ee Soomaaliyeed",
    "Barashada Fikradaha Cilmiga ee Soomaaliyeed",
    "Barashada Xisaabta ee Soomaaliland",
    "Barashada Sayniska ee Soomaaliland",
    "Barashada Fikradaha Cilmiga ee Soomaaliland",
    "Barashada Xisaabta ee Puntland",
    "Barashada Sayniska ee Puntland",
    "Barashada Fikradaha Cilmiga ee Puntland",
    "Barashada Xisaabta ee Jubaland",
    "Barashada Sayniska ee Jubaland",
    "Barashada Fikradaha Cilmiga ee Jubaland",
    "Barashada Xisaabta ee Galmudug",
    "Barashada Sayniska ee Galmudug",
    "Barashada Fikradaha Cilmiga ee Galmudug",
    "Barashada Xisaabta ee Hirshabelle",
    "Barashada Sayniska ee Hirshabelle",
    "Barashada Fikradaha Cilmiga ee Hirshabelle",
    "Barashada Xisaabta ee Koonfur Galbeed",
    "Barashada Sayniska ee Koonfur Galbeed",
    "Barashada Fikradaha Cilmiga ee Koonfur Galbeed",
    "Barashada Xisaabta ee Banaadir",
    "Barashada Sayniska ee Banaadir",
    "Barashada Fikradaha Cilmiga ee Banaadir",
    "Barashada Xisaabta ee Muqdisho",
    "Barashada Sayniska ee Muqdisho",
    "Barashada Fikradaha Cilmiga ee Muqdisho",
    "Barashada Xisaabta ee Hargeysa",
    "Barashada Sayniska ee Hargeysa",
    "Barashada Fikradaha Cilmiga ee Hargeysa",
    "Barashada Xisaabta ee Garoowe",
    "Barashada Sayniska ee Garoowe",
    "Barashada Fikradaha Cilmiga ee Garoowe",
    "Barashada Xisaabta ee Kismaayo",
    "Barashada Sayniska ee Kismaayo",
    "Barashada Fikradaha Cilmiga ee Kismaayo",
    "Barashada Xisaabta ee Dhuusamareeb",
    "Barashada Sayniska ee Dhuusamareeb",
    "Barashada Fikradaha Cilmiga ee Dhuusamareeb",
    "Barashada Xisaabta ee Jowhar",
    "Barashada Sayniska ee Jowhar",
    "Barashada Fikradaha Cilmiga ee Jowhar",
    "Barashada Xisaabta ee Baidoa",
    "Barashada Sayniska ee Baidoa",
    "Barashada Fikradaha Cilmiga ee Baidoa",
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
    title: "Garaad - Barashada Xisaabta iyo Sayniska ee Soomaalida",
    description:
      "Garaad waa platform-ka ugu horreeya ee Soomaalida oo ku saabsan barashada xisaabta, sayniska, iyo fikradaha cilmi-baarista. Waxaan kuu diyaarisay koorsooyin tayo sare leh oo ku qoran Af-Soomaali.",
    siteName: "Garaad",
    images: [
      {
        url: "/images/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Garaad - Barashada Xisaabta iyo Sayniska ee Soomaalida",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Garaad - Barashada Xisaabta iyo Sayniska ee Soomaalida",
    description:
      "Garaad waa platform-ka ugu horreeya ee Soomaalida oo ku saabsan barashada xisaabta, sayniska, iyo fikradaha cilmi-baarista.",
    images: ["/images/twitter-image.jpg"],
    creator: "@garaad_so",
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
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="so" suppressHydrationWarning>
      <head>
        {/* <link
          rel="preload"
          href="/fonts/inter-var.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        /> */}
      </head>
      <body className={inter.className}>
        <Providers>
          <ClientLayout>
            <ShakeInitializer />
            {children}
            <Toaster />
          </ClientLayout>
          <Analytics />
        </Providers>
      </body>
    </html>
  );
}
