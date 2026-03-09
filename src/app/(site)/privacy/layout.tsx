import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Qaanuunka Arrimaha Gaarka ah — Privacy Policy | Garaad",
  description:
    "Qaanuunka arrimaha gaarka ah ee Garaad.org — xogta aan ururino, sida aan u isticmaalno, iyo sida aan u ilaalinno. Privacy Policy in Somali and English.",
  alternates: { canonical: "https://garaad.org/privacy" },
  openGraph: {
    type: "website",
    locale: "so_SO",
    url: "https://garaad.org/privacy",
    siteName: "Garaad",
    title: "Qaanuunka Arrimaha Gaarka ah — Privacy Policy | Garaad",
    description:
      "Qaanuunka arrimaha gaarka ah ee Garaad.org — ururinta, isticmaalka, iyo ilaalinta xogtaada. Privacy in Somali and English.",
    images: [{ url: "https://garaad.org/images/og-main.jpg", width: 1200, height: 630 }],
  },
  twitter: { card: "summary_large_image", title: "Privacy Policy | Garaad" },
  robots: { index: true, follow: true },
};

export default function PrivacyLayout({ children }: { children: React.ReactNode }) {
  return children;
}
