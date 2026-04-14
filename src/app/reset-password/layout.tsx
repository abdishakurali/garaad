import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Reset Password | Garaad",
  description: "Dib u deji sirta akoonkaaga Garaad.",
  alternates: { canonical: "https://garaad.org/reset-password" },
  robots: { index: false, follow: false },
};

export default function ResetPasswordLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
