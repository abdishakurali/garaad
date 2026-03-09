import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shuruudaha Isticmaalka — Terms of Use | Garaad",
  description:
    "Shuruudaha isticmaalka Garaad.org — gelitaan, subscription-yada Explorer iyo Challenge, iyo isticmaalka madalka. Terms of Use in Somali and English.",
  alternates: { canonical: "https://garaad.org/terms" },
  openGraph: {
    type: "website",
    locale: "so_SO",
    url: "https://garaad.org/terms",
    siteName: "Garaad",
    title: "Shuruudaha Isticmaalka — Terms of Use | Garaad",
    description:
      "Shuruudaha isticmaalka Garaad.org — gelitaan, subscription-yada, iyo xuquuqda isticmaalaya. Terms in Somali and English.",
    images: [{ url: "https://garaad.org/images/og-main.jpg", width: 1200, height: 630 }],
  },
  twitter: { card: "summary_large_image", title: "Terms of Use | Garaad" },
  robots: { index: true, follow: true },
};

export default function TermsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
