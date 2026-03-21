import { redirect } from "next/navigation";
import { isAllowedRedirect } from "@/lib/auth-redirect";

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
