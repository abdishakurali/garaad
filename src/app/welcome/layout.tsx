import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Bilow | Garaad",
  description: "Ku biir Garaad oo bilaash baro coding iyo tech af-Soomaali.",
  alternates: { canonical: "https://garaad.org/welcome" },
  robots: { index: false, follow: true },
  openGraph: {
    type: "website",
    url: "https://garaad.org/welcome",
    title: "Bilow | Garaad",
    description: "Ku biir Garaad oo bilaash baro coding iyo tech af-Soomaali.",
  },
};

export default function WelcomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
