import type { Metadata } from "next";
import LoginPage from "@/app/login/page";

export const metadata: Metadata = {
  title: "Request Access | Garaad",
  description: "Request access by emailing info@garaad.org.",
  alternates: { canonical: "https://garaad.org/signup" },
  robots: { index: false, follow: false },
};

export default function SignupPage() {
  return <LoginPage />;
}
