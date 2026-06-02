import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Codso Access | Garaad",
  description: "Codso access Garaad adigoo email u diraya info@garaad.org.",
  alternates: { canonical: "https://garaad.org/welcome" },
  robots: { index: false, follow: true },
  openGraph: {
    type: "website",
    url: "https://garaad.org/welcome",
    title: "Codso Access | Garaad",
    description: "Codso access Garaad adigoo email u diraya info@garaad.org.",
  },
};

export default function WelcomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
