import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Soo gal | Garaad",
  description: "Geli akoonkaaga si aad ugu soo noqoto Garaad.",
  alternates: { canonical: "https://garaad.org/login" },
  robots: { index: false, follow: true },
  openGraph: {
    type: "website",
    url: "https://garaad.org/login",
    title: "Soo gal | Garaad",
    description: "Geli akoonkaaga si aad ugu soo noqoto Garaad.",
  },
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
