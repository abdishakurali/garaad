import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | Garaad",
  description: "Privacy Policy for Garaad.org – how we collect, use, and protect your data.",
  alternates: { canonical: "https://garaad.so/privacy" },
  openGraph: {
    type: "website",
    locale: "so_SO",
    url: "https://garaad.so/privacy",
    siteName: "Garaad STEM",
    title: "Privacy Policy | Garaad",
  },
  robots: { index: true, follow: true },
};

export default function PrivacyLayout({ children }: { children: React.ReactNode }) {
  return children;
}
