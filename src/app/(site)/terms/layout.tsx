import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Use | Garaad",
  description: "Terms of Use for Garaad.org – access, subscriptions, and use of the Platform.",
  alternates: { canonical: "https://garaad.so/terms" },
  openGraph: {
    type: "website",
    locale: "so_SO",
    url: "https://garaad.so/terms",
    siteName: "Garaad STEM",
    title: "Terms of Use | Garaad",
  },
  robots: { index: true, follow: true },
};

export default function TermsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
