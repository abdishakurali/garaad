import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { isAllowedRedirect } from "@/lib/auth-redirect";

export const metadata: Metadata = {
  title: "Request Access | Garaad",
  description: "Codso access Garaad adigoo email u diraya info@garaad.org.",
  alternates: { canonical: "https://garaad.org/signup" },
  robots: { index: false, follow: false },
};

type PageProps = {
  searchParams: Promise<{ redirect?: string | string[] }>;
};

export default async function SignupPage({ searchParams }: PageProps) {
  const sp = await searchParams;
  const raw = sp.redirect;
  const r = Array.isArray(raw) ? raw[0] : raw;
  if (r && isAllowedRedirect(r)) {
    redirect(`/welcome?redirect=${encodeURIComponent(r)}`);
  }
  redirect("/welcome");
}
