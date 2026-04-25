"use client";

import { useCallback, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Briefcase,
  CalendarDays,
  CheckCircle2,
  Clock,
  Code2,
  GraduationCap,
  Store,
  Users,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

const ROLE_OPTIONS = [
  { value: "student", label: "Arday" },
  { value: "professional", label: "Xirfad-le" },
  { value: "business", label: "Milkiile ganacsi · Freelancer" },
  { value: "aspiring_dev", label: "Qof raba inuu noqdo Developer" },
  { value: "developer", label: "Developer" },
] as const;

type RoleValue = (typeof ROLE_OPTIONS)[number]["value"];

interface WebinarData {
  id: number;
  title: string;
  slug: string;
  description: string;
  banner_image: string | null;
  date_utc: string;
  zoom_url: string;
  meeting_id: string;
  passcode: string;
  is_active: boolean;
  is_past: boolean;
}

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}

function parseApiError(data: unknown): string | null {
  if (!isRecord(data)) return null;
  const email = data.email;
  if (Array.isArray(email) && typeof email[0] === "string") return email[0];
  const detail = data.detail;
  if (typeof detail === "string") return detail;
  const nfe = data.non_field_errors;
  if (Array.isArray(nfe) && typeof nfe[0] === "string") return nfe[0];
  for (const [, val] of Object.entries(data)) {
    if (Array.isArray(val) && typeof val[0] === "string") return val[0];
  }
  return null;
}

function formatDate(utc: string) {
  return new Date(utc).toLocaleDateString("so-SO", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "Africa/Nairobi",
  });
}

function formatTimes(utc: string) {
  const d = new Date(utc);
  const eat = d.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", timeZone: "Africa/Nairobi" });
  const dub = d.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", timeZone: "Europe/Dublin" });
  const et  = d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", timeZone: "America/New_York" });
  return { eat, dub, et };
}

function formatIcsUtcCompact(d: Date) {
  const p = (n: number) => String(n).padStart(2, "0");
  return `${d.getUTCFullYear()}${p(d.getUTCMonth()+1)}${p(d.getUTCDate())}T${p(d.getUTCHours())}${p(d.getUTCMinutes())}00Z`;
}

function buildIcs(webinar: WebinarData) {
  const start = new Date(webinar.date_utc);
  const end = new Date(start.getTime() + 2 * 60 * 60 * 1000);
  return [
    "BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Garaad//Webinar//SO",
    "CALSCALE:GREGORIAN", "METHOD:PUBLISH", "BEGIN:VEVENT",
    `UID:webinar-garaad-${webinar.slug}@garaad.org`,
    `DTSTAMP:${formatIcsUtcCompact(new Date())}`,
    `DTSTART:${formatIcsUtcCompact(start)}`,
    `DTEND:${formatIcsUtcCompact(end)}`,
    `SUMMARY:${webinar.title}`,
    "LOCATION:Online — Zoom",
    `URL:https://garaad.org/webinars/${webinar.slug}`,
    "END:VEVENT", "END:VCALENDAR",
  ].join("\r\n");
}

function firstNameFromFullName(fullName: string) {
  return fullName.trim().split(/\s+/)[0] || "saaxiib";
}

export function WebinarDetailClient({ webinar }: { webinar: WebinarData }) {
  const router = useRouter();
  const { toast } = useToast();
  const times = formatTimes(webinar.date_utc);

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [country, setCountry] = useState("");
  const [role, setRole] = useState<RoleValue | "">("");
  const [clientEmailError, setClientEmailError] = useState("");
  const [clientErrors, setClientErrors] = useState<{ fullName?: string; country?: string; role?: string }>({});
  const [submitting, setSubmitting] = useState(false);
  const [successName, setSuccessName] = useState<string | null>(null);

  const scrollToRegister = useCallback(() => {
    document.getElementById("register")?.scrollIntoView({ behavior: "smooth" });
  }, []);

  const validate = () => {
    const next: typeof clientErrors = {};
    let emailErr = "";
    if (!fullName.trim() || fullName.trim().length < 2) next.fullName = "Fadlan geli magacaaga oo dhammaystiran.";
    const em = email.trim();
    if (!em) emailErr = "Email-kaaga waa lagama maarmaan.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(em)) emailErr = "Email sax ah geli.";
    if (!country.trim()) next.country = "Fadlan geli waddankaaga ama magaaladaada.";
    if (!role) next.role = "Dooro sida aad uga soo biirayso.";
    setClientErrors(next);
    setClientEmailError(emailErr);
    return !emailErr && Object.keys(next).length === 0;
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setClientEmailError("");
    if (!validate()) return;
    setSubmitting(true);
    try {
      const res = await fetch(`/api/webinars/${webinar.slug}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ full_name: fullName.trim(), email: email.trim(), whatsapp: whatsapp.trim(), country: country.trim(), role }),
      });
      const raw: unknown = await res.json().catch(() => null);
      if (res.ok && isRecord(raw) && raw.message === "Registered" && typeof raw.name === "string") {
        setSuccessName(raw.name);
        // Redirect to /welcome after successful registration
        setTimeout(() => {
          router.push("/welcome?utm_source=webinar_register");
        }, 1500);
        return;
      }
      const errMsg = parseApiError(raw);
      if (errMsg?.toLowerCase().includes("email")) {
        setClientEmailError(errMsg);
      } else {
        toast({ variant: "destructive", title: "Waxbaa khaldamay", description: errMsg ?? "Isku day mar kale." });
      }
    } catch {
      toast({ variant: "destructive", title: "Cillad shabakadda", description: "Adeegga lama gaari karo. Fadlan mar kale isku day." });
    } finally {
      setSubmitting(false);
    }
  };

  const downloadIcs = () => {
    const blob = new Blob([buildIcs(webinar)], { type: "text/calendar;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `garaad-webinar-${webinar.slug}.ics`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const shareCopy = async () => {
    const text = `Waxaan iska diiwaangeliyey webinar bilaash ah oo ay qabaneyso Garaad. Mid kasta waa soo dhaweyn. Is-diiwaangeli: garaad.org/webinars/${webinar.slug}`;
    try {
      await navigator.clipboard.writeText(text);
      toast({ title: "Waa la koobiyey", description: "Qoraalka waxaa lagu koobiyey dib udhaca." });
    } catch {
      toast({ variant: "destructive", title: "Lama koobi karin", description: `Gacanta ku qor: garaad.org/webinars/${webinar.slug}` });
    }
  };

  const fieldClass = (invalid: boolean) =>
    cn(
      "mt-2.5 w-full rounded-xl border bg-background px-4 py-3.5 text-[15px] text-foreground shadow-inner outline-none transition placeholder:text-muted-foreground focus:border-primary/50 focus:ring-2 focus:ring-primary/25 dark:bg-zinc-950/40",
      invalid ? "border-destructive/80" : "border-border dark:border-zinc-800/90"
    );

  return (
    <main lang="so" className="relative pb-28 md:pb-36">
      {/* Ambient bg */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden" aria-hidden>
        <div className="absolute -left-1/4 top-0 h-[min(80vh,720px)] w-[min(80vw,720px)] rounded-full bg-primary/[0.08] blur-[120px]" />
        <div className="absolute -right-1/4 top-1/3 h-[min(70vh,560px)] w-[min(70vw,560px)] rounded-full bg-violet-600/[0.06] blur-[100px]" />
      </div>

      {/* Breadcrumb */}
      <div className="border-b border-border/60 px-4 py-3 text-sm text-muted-foreground">
        <div className="mx-auto max-w-5xl">
          <Link href="/webinars" className="hover:text-foreground">Webinars</Link>
          <span className="mx-2 text-border">›</span>
          <span className="text-foreground">{webinar.title}</span>
        </div>
      </div>

      {/* Hero */}
      <section className="relative flex w-full min-h-[88vh] flex-col items-center justify-center overflow-hidden border-b border-border/60 bg-gradient-to-b from-primary/[0.06] via-violet-500/[0.04] to-background px-6 py-20 text-center dark:border-white/5 dark:from-violet-950/45 dark:via-background dark:to-background">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_85%_55%_at_50%_-15%,rgba(139,61,252,0.22),transparent_55%)]" aria-hidden />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-background to-transparent" aria-hidden />

        <div className="relative z-10 mx-auto w-full max-w-3xl">
          <div className="mb-6 flex flex-wrap justify-center gap-3">
            <span className="rounded-full border border-primary/50 bg-primary/5 px-3 py-1.5 text-[10px] font-medium uppercase tracking-[0.2em] text-primary">
              Webinar toos ah oo lacag la&apos;aan ah
            </span>
            {webinar.is_past ? (
              <span className="rounded-full border border-border px-3 py-1.5 text-[10px] font-medium uppercase tracking-[0.2em] text-muted-foreground">
                Waa dhamaatay
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-emerald-600 dark:text-emerald-400">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
                Boosasku waa xaddidan yihiin
              </span>
            )}
          </div>

          {/* Banner image */}
          {webinar.banner_image && (
            <div className="mx-auto mb-8 overflow-hidden rounded-2xl border border-border shadow-xl">
              <Image
                src={webinar.banner_image}
                alt={webinar.title}
                width={800}
                height={400}
                className="w-full object-cover"
                priority
              />
            </div>
          )}

          <h1 className="mx-auto mb-4 max-w-3xl font-serif text-4xl font-bold leading-[1.12] tracking-tight text-foreground md:text-5xl lg:text-6xl">
            {webinar.title}
          </h1>

          <div className="mb-8 mt-4 flex justify-center">
            <div className="h-px w-24 rounded-full bg-gradient-to-r from-transparent via-primary to-primary/80" />
            <div className="ms-1 h-px w-8 rounded-full bg-primary/40" />
          </div>

          <p className="mx-auto mb-10 max-w-xl text-base text-muted-foreground md:text-lg">
            {webinar.description}
          </p>

          <p className="mb-4 text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground/90">
            {formatDate(webinar.date_utc)}
          </p>

          <div className="mb-10 flex flex-wrap justify-center gap-2">
            <span className="rounded-full border border-primary/35 bg-primary/10 px-5 py-2.5 text-sm font-semibold text-zinc-900 shadow-sm dark:border-primary/30 dark:bg-primary/15 dark:text-zinc-100">
              <span className="font-bold">{times.eat}</span>
              <span className="font-medium"> — Geeska Afrika (EAT)</span>
            </span>
            <span className="rounded-full border border-border/80 bg-muted/80 px-5 py-2.5 text-sm text-zinc-900 shadow-sm dark:border-white/10 dark:bg-white/[0.07] dark:text-zinc-100">
              <span className="font-semibold">{times.dub}</span>
              <span className="font-medium"> — Dublin · UK</span>
            </span>
            <span className="rounded-full border border-border/80 bg-muted/80 px-5 py-2.5 text-sm text-zinc-900 shadow-sm dark:border-white/10 dark:bg-white/[0.07] dark:text-zinc-100">
              <span className="font-semibold">{times.et}</span>
              <span className="font-medium"> — US (ET)</span>
            </span>
          </div>

          {!webinar.is_past && (
            <button
              type="button"
              onClick={scrollToRegister}
              className="group mx-auto mb-4 block rounded-sm bg-primary px-10 py-4 text-sm font-semibold uppercase tracking-widest text-primary-foreground shadow-lg shadow-primary/20 transition hover:bg-primary/90"
            >
              Is-diiwaangeli lacag la&apos;aan
              <span className="ms-2 inline-block transition group-hover:translate-x-0.5" aria-hidden>→</span>
            </button>
          )}
        </div>
      </section>

      {/* Who it's for */}
      <section className="border-t border-border bg-muted/40 px-4 py-16 dark:border-zinc-800/80 dark:bg-zinc-950/40 md:py-24">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-center font-serif text-2xl font-medium text-foreground md:text-3xl">Cidda loogu talagalay</h2>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
            {[
              { icon: GraduationCap, title: "Ardayda", desc: "Hel aqoon dheeri ah iyo fursad aad ku dhisto xirfadaada." },
              { icon: Briefcase, title: "Xirfadlayaasha", desc: "Arag sida ay shaqada kugu habboon tahay freelancing-ka." },
              { icon: Store, title: "Milkiilayaasha ganacsiga", desc: "Fikrado wax ku ool ah loogu talagalay founders iyo freelancers-ka." },
              { icon: Code2, title: "Developers-ka", desc: "Sida aad u hesho macaamiisha global-ka iyadoo lagaga shaqeynayo Soomaaliya." },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="rounded-2xl border border-border bg-card p-7 shadow-md transition hover:border-primary/30 hover:shadow-lg dark:border-zinc-800/90">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/15 text-primary">
                  <Icon className="h-6 w-6" aria-hidden />
                </div>
                <h3 className="mt-5 text-lg font-semibold text-foreground">{title}</h3>
                <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground dark:text-zinc-400">{desc}</p>
              </div>
            ))}
          </div>
          <p className="mt-10 text-center text-sm text-muted-foreground">Ma jiro khibrad hore oo loo baahan yahay — qof kasta waa lagu soo dhoweeyaa.</p>
        </div>
      </section>

      {/* Speaker */}
      <section className="border-t border-border px-4 py-16 dark:border-zinc-800/80 md:py-24">
        <div className="mx-auto max-w-5xl">
          <div className="flex flex-col items-center gap-10 md:flex-row md:gap-14">
            <div className="relative shrink-0">
              <div className="absolute -inset-3 rounded-3xl bg-gradient-to-br from-primary/25 via-transparent to-violet-600/20 blur-xl" aria-hidden />
              <div className="relative overflow-hidden rounded-3xl border-2 border-primary/25 bg-card shadow-2xl dark:bg-zinc-900">
                <div className="aspect-square w-[min(100%,260px)] sm:w-[280px]">
                  <Image src="/presenter.jpg" alt="Abdishakur Ali — Founder, Garaad" width={560} height={560} className="h-full w-full object-cover object-top" priority onError={() => {}} />
                </div>
              </div>
            </div>
            <div className="max-w-xl text-center md:text-start">
              <p className="text-xs font-semibold uppercase tracking-wider text-primary">Hogaamiyaha barnaamijka</p>
              <h2 className="mt-2 font-serif text-3xl font-medium text-foreground md:text-4xl">Abdishakur Ali</h2>
              <p className="mt-3 text-base font-medium leading-snug text-muted-foreground">Founder, Garaad · Full-Stack Developer</p>
              <p className="mt-5 text-[15px] leading-relaxed text-muted-foreground md:text-base dark:text-zinc-400">
                Wuxuu freelancing ku sameeyay Soomaaliya — iyada oo uu ka gudbay caqabadaha lacag-bixinta,
                cinwaanka, iyo macaamiisha. Wuxuu dhisayaa Garaad si uu u saarayo caqabadahaas oo dhan.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Register / Past notice */}
      <section id="register" className="scroll-mt-24 border-t border-border px-4 py-16 dark:border-zinc-800/80 md:py-24">
        <div className="mx-auto max-w-lg">
          {webinar.is_past ? (
            <div className="rounded-2xl border border-border bg-card p-8 text-center shadow-lg md:p-10">
              <CheckCircle2 className="mx-auto h-14 w-14 text-muted-foreground/40" aria-hidden />
              <h2 className="mt-6 font-serif text-xl font-medium text-foreground">Webinarkaan waa dhamaatay</h2>
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                Raadi webinar soo socda oo furan.
              </p>
              <Link
                href="/webinars"
                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
              >
                Arag dhammaan webinars-ka
              </Link>
            </div>
          ) : successName ? (
            <div className="rounded-2xl border border-primary/20 bg-card p-8 text-center shadow-lg md:p-10">
              <CheckCircle2 className="mx-auto h-16 w-16 text-primary" aria-hidden />
              <p className="mt-6 font-serif text-xl font-medium text-foreground">
                Waad ku guulaysatay, {firstNameFromFullName(successName)}!
              </p>
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground dark:text-zinc-400">
                Hubi sanduuqa soo gelitaanka (inbox) iyo spam-ka. Waxaad heli doontaa email leh faahfaahinta kulanka.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
                <button
                  type="button"
                  onClick={downloadIcs}
                  className="cursor-pointer rounded-xl border border-border bg-muted px-6 py-3.5 text-sm font-semibold text-foreground transition hover:border-primary/40 hover:bg-muted/80 dark:border-zinc-700 dark:bg-zinc-900/80"
                >
                  Ku dar jadwalka (calendar)
                </button>
                <button
                  type="button"
                  onClick={shareCopy}
                  className="cursor-pointer rounded-xl bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground shadow-md transition hover:bg-primary/90"
                >
                  La wadaag saaxiib
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="mb-10 text-center">
                <h2 className="font-serif text-2xl font-medium text-foreground md:text-3xl">Xajiso booskaaga</h2>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground md:text-base">
                  Lacag la&apos;aan. Toos (live). Duubis ma jirto. Boosasku waa xaddidan yihiin.
                </p>
              </div>
              <form
                onSubmit={onSubmit}
                className="rounded-2xl border border-border bg-card/90 p-6 shadow-xl backdrop-blur-sm md:p-8 dark:border-zinc-800/90 dark:bg-zinc-950/50"
                noValidate
              >
                <div className="space-y-6">
                  <div>
                    <label htmlFor="wf-name" className="block text-sm font-medium text-foreground">Magacaaga oo dhammaystiran</label>
                    <input id="wf-name" type="text" autoComplete="name" value={fullName} onChange={(e) => setFullName(e.target.value)} className={fieldClass(!!clientErrors.fullName)} required />
                    {clientErrors.fullName && <p className="mt-1.5 text-sm text-destructive">{clientErrors.fullName}</p>}
                  </div>
                  <div>
                    <label htmlFor="wf-email" className="block text-sm font-medium text-foreground">Email-kaaga</label>
                    <input id="wf-email" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} className={fieldClass(!!clientEmailError)} required />
                    {clientEmailError && <p className="mt-1.5 text-sm text-destructive">{clientEmailError}</p>}
                  </div>
                  <div>
                    <label htmlFor="wf-whatsapp" className="block text-sm font-medium text-foreground">WhatsApp (ikhtiyaari — xusuusin)</label>
                    <input id="wf-whatsapp" type="tel" autoComplete="tel" value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} className={fieldClass(false)} />
                  </div>
                  <div>
                    <label htmlFor="wf-country" className="block text-sm font-medium text-foreground">Waddanka / Magaalada</label>
                    <input id="wf-country" type="text" placeholder="Tusaale: Muqdisho, Dublin, Minneapolis" value={country} onChange={(e) => setCountry(e.target.value)} className={fieldClass(!!clientErrors.country)} required />
                    {clientErrors.country && <p className="mt-1.5 text-sm text-destructive">{clientErrors.country}</p>}
                  </div>
                  <fieldset>
                    <legend className="text-sm font-medium text-foreground">Waxaan uga soo biirayaa sidii:</legend>
                    <div className={cn("mt-3 space-y-3 rounded-xl border bg-muted/50 p-4 dark:bg-zinc-950/40", clientErrors.role ? "border-destructive/60" : "border-border dark:border-zinc-800")}>
                      {ROLE_OPTIONS.map((opt) => (
                        <label key={opt.value} className="flex cursor-pointer items-start gap-3.5 text-sm text-foreground dark:text-zinc-200">
                          <input type="radio" name="role" value={opt.value} checked={role === opt.value} onChange={() => setRole(opt.value)} className="mt-1 size-4 shrink-0 border-border text-primary focus:ring-primary" />
                          <span className="leading-snug">{opt.label}</span>
                        </label>
                      ))}
                    </div>
                    {clientErrors.role && <p className="mt-1.5 text-sm text-destructive">{clientErrors.role}</p>}
                  </fieldset>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex w-full cursor-pointer items-center justify-center rounded-xl bg-primary py-4 text-base font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition hover:bg-primary/90 disabled:pointer-events-none disabled:opacity-55"
                  >
                    {submitting ? "Waa la dirayaa…" : "Is-diiwaangeli lacag la'aan →"}
                  </button>
                  <p className="text-center text-xs leading-relaxed text-muted-foreground">
                    Isla markiiba waxaad heli doontaa email leh faahfaahinta kulanka. Hubi spam haddii aadan arkin.
                  </p>
                </div>
              </form>
            </>
          )}
        </div>
      </section>
    </main>
  );
}
