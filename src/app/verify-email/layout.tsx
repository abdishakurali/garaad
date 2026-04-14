import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Verify Email | Garaad",
  description: "Xaqiiji email-kaaga si aad u dhamaystirto akoonka Garaad.",
  alternates: { canonical: "https://garaad.org/verify-email" },
  robots: { index: false, follow: false },
};

export default function VerifyEmailLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
