import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { CalendarDays, Clock, Users, ArrowRight, CheckCircle2 } from "lucide-react";

export const metadata: Metadata = {
  title: "Webinars — Garaad",
  description: "Webinars bilaash ah. Baro technology, freelance, iyo wax barasho. Is-diiwaangeli webinar-yada soo socda.",
};

export const revalidate = 60;

interface WebinarData {
  id: number;
  title: string;
  slug: string;
  description: string;
  banner_image: string | null;
  date_utc: string;
  is_active: boolean;
  is_past: boolean;
}

async function fetchWebinars(): Promise<WebinarData[]> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/webinars/`,
      { next: { revalidate: 60 } }
    );
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

function formatDate(utc: string) {
  const d = new Date(utc);
  return d.toLocaleDateString("so-SO", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "Africa/Nairobi",
  });
}

function formatTime(utc: string) {
  const d = new Date(utc);
  const eat = d.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Africa/Nairobi",
  });
  const dub = d.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Europe/Dublin",
  });
  return `${eat} EAT · ${dub} Dublin`;
}

export default async function WebinarsPage() {
  const webinars = await fetchWebinars();
  const active = webinars.filter((w) => !w.is_past);
  const past = webinars.filter((w) => w.is_past);

  return (
    <main className="min-h-screen bg-background text-foreground">
      {/* Hero */}
      <section className="relative border-b border-border/60 bg-gradient-to-b from-violet-500/[0.06] to-background px-4 py-16 text-center dark:from-violet-950/30">
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_0%,rgba(139,92,246,0.18),transparent)]"
          aria-hidden
        />
        <div className="relative mx-auto max-w-2xl">
          <span className="mb-4 inline-block rounded-full border border-violet-500/30 bg-violet-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-violet-600 dark:text-violet-400">
            Webinars bilaash ah
          </span>
          <h1 className="mt-4 text-3xl md:text-4xl font-black tracking-tight">
            Free Freelancing Soomaaliya
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-base text-muted-foreground md:text-lg">
            Sida aan u sameeyay, Caqabadaha, iyo Xallinta. Baro sidii aad 
            ushuquuji karto freelance technology-ga Soomaaliya.
          </p>
        </div>
      </section>

      {/* Active webinars */}
      {active.length > 0 && (
        <section className="px-4 py-16 md:py-20">
          <div className="mx-auto max-w-4xl">
            <h2 className="mb-8 text-xs font-bold uppercase tracking-widest text-violet-600 dark:text-violet-400">
              Soo socda — Is-diiwaangeli
            </h2>
            <div className="space-y-6">
              {active.map((w) => (
                <WebinarCard key={w.id} webinar={w} featured />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Past webinars */}
      {past.length > 0 && (
        <section className="border-t border-border px-4 py-16 dark:border-zinc-800/80 md:py-20">
          <div className="mx-auto max-w-4xl">
            <h2 className="mb-8 text-xs font-bold uppercase tracking-widest text-muted-foreground">
              Webinars hore
            </h2>
            <div className="grid gap-5 sm:grid-cols-2">
              {past.map((w) => (
                <WebinarCard key={w.id} webinar={w} />
              ))}
            </div>
          </div>
        </section>
      )}

      {webinars.length === 0 && (
        <div className="flex min-h-[40vh] items-center justify-center px-4 text-center text-muted-foreground">
          Webinars waa la soo gelin doonaa. Soo check mar kale.
        </div>
      )}
    </main>
  );
}

function WebinarCard({
  webinar,
  featured = false,
}: {
  webinar: WebinarData;
  featured?: boolean;
}) {
  return (
    <Link
      href={`/webinars/${webinar.slug}`}
      className={`group block rounded-2xl border transition-all hover:border-violet-500/40 hover:shadow-lg hover:shadow-violet-500/10 ${
        featured
          ? "border-violet-500/30 bg-gradient-to-br from-violet-500/[0.06] to-background p-6 dark:from-violet-950/30 md:p-8"
          : "border-border bg-card p-5 dark:border-zinc-800/90"
      }`}
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-6">
        {/* Banner thumbnail */}
        <div
          className={`shrink-0 overflow-hidden rounded-xl bg-violet-100 dark:bg-violet-950/40 ${
            featured ? "h-40 w-full sm:h-32 sm:w-56" : "h-28 w-full sm:h-24 sm:w-40"
          }`}
        >
          {webinar.banner_image ? (
            <Image
              src={webinar.banner_image}
              alt={webinar.title}
              width={224}
              height={144}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <Users className="h-8 w-8 text-violet-400/60" />
            </div>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <div className="mb-2 flex flex-wrap items-center gap-2">
            {webinar.is_past ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
                <CheckCircle2 className="h-3 w-3" />
                Webinars hore
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
                Furan — Is-diiwaangeli
              </span>
            )}
          </div>

          <h3
            className={`font-bold leading-snug text-foreground group-hover:text-violet-600 dark:group-hover:text-violet-400 ${
              featured ? "text-xl md:text-2xl" : "text-base"
            }`}
          >
            {webinar.title}
          </h3>

          <p
            className={`mt-2 line-clamp-2 text-muted-foreground ${
              featured ? "text-sm md:text-base" : "text-sm"
            }`}
          >
            {webinar.description}
          </p>

          <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <CalendarDays className="h-3.5 w-3.5" />
              {formatDate(webinar.date_utc)}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5" />
              {formatTime(webinar.date_utc)}
            </span>
          </div>

          {!webinar.is_past && (
            <div className="mt-4">
              <span className="inline-flex items-center gap-1.5 rounded-lg bg-violet-600 px-4 py-2 text-sm font-semibold text-white transition group-hover:bg-violet-500">
                Is-diiwaangeli bilaash ah
                <ArrowRight className="h-3.5 w-3.5" />
              </span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
