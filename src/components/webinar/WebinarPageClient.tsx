"use client";

import { useCallback, useState } from "react";
import Image from "next/image";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useToast } from "@/hooks/use-toast";
import { API_BASE_URL } from "@/lib/constants";
import { cn } from "@/lib/utils";
import {
  Briefcase,
  Brain,
  CheckCircle2,
  Code2,
  GraduationCap,
  Mic2,
  Store,
  Users,
} from "lucide-react";

const ROLE_OPTIONS = [
  { value: "student", label: "Arday" },
  { value: "professional", label: "Xirfad-le" },
  { value: "business", label: "Milkiile ganacsi · Freelancer" },
  { value: "aspiring_dev", label: "Qof raba inuu noqdo Developer" },
  { value: "developer", label: "Developer" },
] as const;

type RoleValue = (typeof ROLE_OPTIONS)[number]["value"];

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}

function parseApiEmailErrors(data: unknown): string | null {
  if (!isRecord(data)) return null;
  const emailField = data.email;
  if (!Array.isArray(emailField) || emailField.length === 0) return null;
  const first = emailField[0];
  return typeof first === "string" ? first : null;
}

function formatIcsUtcCompact(d: Date): string {
  const y = d.getUTCFullYear();
  const m = String(d.getUTCMonth() + 1).padStart(2, "0");
  const day = String(d.getUTCDate()).padStart(2, "0");
  const h = String(d.getUTCHours()).padStart(2, "0");
  const min = String(d.getUTCMinutes()).padStart(2, "0");
  const s = String(d.getUTCSeconds()).padStart(2, "0");
  return `${y}${m}${day}T${h}${min}${s}Z`;
}

function escapeIcsText(s: string): string {
  return s
    .replace(/\\/g, "\\\\")
    .replace(/\n/g, "\\n")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,");
}

function buildWebinarIcs(): string {
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Garaad//Webinar//SO",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    "UID:webinar-garaad-ai-2026-04-09@garaad.org",
    `DTSTAMP:${formatIcsUtcCompact(new Date())}`,
    "DTSTART:20260409T150000Z",
    "DTEND:20260409T170000Z",
    "SUMMARY:AI Webinar — Garaad",
    `DESCRIPTION:${escapeIcsText(
      "Kulan toos ah oo 2 saacadood ah (Ingiriis / Soomaali). Link-ga Zoom waxaa laguugu soo diri doonaa 1 saac ka hor."
    )}`,
    "URL:https://garaad.org/webinar",
    "LOCATION:Online — Zoom",
    "END:VEVENT",
    "END:VCALENDAR",
  ];
  return lines.join("\r\n");
}

const SHARE_TEXT =
  "Waxaan iska diiwaangeliyey webinar AI oo bilaash ah oo ay qabaneyso Garaad — 9 April 2026. Mid kasta waa soo dhaweyn. Is-diiwaangeli: garaad.org/webinar";

const LEARN_ITEMS = [
  "Waxa ay AI dhab ahaan tahay — iyadoo laga fog yahay ereyada adag, laguna barayo aasaaska dhabta ah.",
  "Sababta xilligan uu uga duwan yahay wax kasta oo ka horreeyay.",
  "Sida ay u isticmaali karaan ardayda, xirfadlayaasha & aasaasayaasha ganacsiga (founders).",
  "Runta dhabta ah ee ku saabsan AI ee aan lagugu sheegin buunbuuninta (hype-ka) jira.",
  "Open source models, agents & iyo waxa xiga ee soo socda.",
  "Live demo — adiga ayaa tijaabinaya inta aynaan dhammayn kulanka.",
] as const;

const FAQ_ITEMS = [
  {
    q: "Ma lacag la'aan baa dhab ahaan?",
    a: "Haa. Ma jiro kaarka bangiga, iyo wax la isku qariyo. Kaliya is-diiwaangeli oo imow.",
  },
  {
    q: "Luuqadee ayaa lagu qabanayaa kulanka?",
    a: "Badankood Ingiriis, laakiin Af-Soomaali waxaa loo isticmaali doonaa meesha ay caawiso. Heerka luqaddu ha kaa cabsi gelin — qof walbaa waa lagu soo dhaweynayaa.",
  },
  {
    q: "Ma u baahnahay aqoon farsamo (technical background) oo hore?",
    a: "Maya. Kulanka waxaa loogu talagalay qof walba — ardayda, xirfadlayaasha, iyo developers-ka oo dhan.",
  },
  {
    q: "Ma jiri doontaa duubis (recording)?",
    a: "Maya. Waa kulan kaliya oo toos ah (live). Si aad u hesho khibrada buuxda waa inaad waqtiga joogtaa.",
  },
] as const;

const EXPERT_VISUALS = [
  {
    icon: Brain,
    title: "AI & fikirka dhinaca xogta",
    subtitle: "Aasaaska iyo isticmaalka dhabta ah",
  },
  {
    icon: Mic2,
    title: "Kulan toos ah (live)",
    subtitle: "Su'aalo & tijaabooyin isku mar ah",
  },
  {
    icon: Users,
    title: "Bulshada STEM & tech",
    subtitle: "Isku xirnaanta & wada-shaqaynta",
  },
  {
    icon: Code2,
    title: "Horumarinta software-ka",
    subtitle: "Full-stack & nidaamyada waaweyn",
  },
] as const;

function firstNameFromFullName(fullName: string): string {
  const part = fullName.trim().split(/\s+/)[0];
  return part || "saaxiib";
}

export function WebinarPageClient() {
  const { toast } = useToast();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [country, setCountry] = useState("");
  const [role, setRole] = useState<RoleValue | "">("");
  const [clientEmailError, setClientEmailError] = useState("");
  const [clientErrors, setClientErrors] = useState<{
    fullName?: string;
    country?: string;
    role?: string;
  }>({});
  const [submitting, setSubmitting] = useState(false);
  const [successName, setSuccessName] = useState<string | null>(null);
  const [presenterImageError, setPresenterImageError] = useState(false);

  const scrollToRegister = useCallback(() => {
    document.getElementById("register")?.scrollIntoView({ behavior: "smooth" });
  }, []);

  const validateClient = (): boolean => {
    const next: typeof clientErrors = {};
    let emailErr = "";

    if (!fullName.trim() || fullName.trim().length < 2) {
      next.fullName = "Fadlan geli magacaaga oo dhammaystiran.";
    }
    const em = email.trim();
    if (!em) {
      emailErr = "Email-kaaga waa lagama maarmaan.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(em)) {
      emailErr = "Email sax ah geli.";
    }
    if (!country.trim()) {
      next.country = "Fadlan geli waddankaaga ama magaaladaada.";
    }
    if (!role) {
      next.role = "Dooro sida aad uga soo biirayso.";
    }

    setClientErrors(next);
    setClientEmailError(emailErr);
    return !emailErr && Object.keys(next).length === 0;
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setClientEmailError("");
    if (!validateClient()) return;

    setSubmitting(true);
    const base = API_BASE_URL.replace(/\/$/, "");
    try {
      const res = await fetch(`${base}/api/webinar/register/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          full_name: fullName.trim(),
          email: email.trim(),
          whatsapp: whatsapp.trim(),
          country: country.trim(),
          role,
        }),
      });

      const raw: unknown = await res.json().catch(() => null);

      if (res.status === 201 && isRecord(raw)) {
        const message = raw.message;
        const name = raw.name;
        if (message === "Registered" && typeof name === "string") {
          setSuccessName(name);
          return;
        }
      }

      if (res.status === 400) {
        const serverEmail = parseApiEmailErrors(raw);
        if (serverEmail) {
          setClientEmailError(serverEmail);
          setSubmitting(false);
          return;
        }
      }

      toast({
        variant: "destructive",
        title: "Waxbaa khaldamay",
        description:
          "Is-diiwaangelintu ma dhicin. Hubi internetka oo mar kale isku day.",
      });
    } catch {
      toast({
        variant: "destructive",
        title: "Cillad shabakadda",
        description: "Adeegga lama gaari karo. Fadlan mar kale isku day.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const downloadIcs = () => {
    const blob = new Blob([buildWebinarIcs()], {
      type: "text/calendar;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "garaad-ai-webinar.ics";
    a.click();
    URL.revokeObjectURL(url);
  };

  const shareCopy = async () => {
    try {
      await navigator.clipboard.writeText(SHARE_TEXT);
      toast({
        title: "Waa la koobiyey",
        description: "Qoraalka waxaa lagu koobiyey dib udhaca.",
      });
    } catch {
      toast({
        variant: "destructive",
        title: "Lama koobi karin",
        description: "Gacanta ku qor linkka: garaad.org/webinar",
      });
    }
  };

  const fieldClass = (invalid: boolean) =>
    cn(
      "mt-2.5 w-full rounded-xl border bg-background px-4 py-3.5 text-[15px] text-foreground shadow-inner outline-none transition placeholder:text-muted-foreground focus:border-primary/50 focus:ring-2 focus:ring-primary/25 dark:bg-zinc-950/40",
      invalid ? "border-destructive/80" : "border-border dark:border-zinc-800/90"
    );

  return (
    <main lang="so" className="relative pb-28 md:pb-36">
      {/* ambient background */}
      <div
        className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
        aria-hidden
      >
        <div className="absolute -left-1/4 top-0 h-[min(80vh,720px)] w-[min(80vw,720px)] rounded-full bg-primary/[0.08] blur-[120px] dark:bg-primary/[0.12]" />
        <div className="absolute -right-1/4 top-1/3 h-[min(70vh,560px)] w-[min(70vw,560px)] rounded-full bg-violet-600/[0.06] blur-[100px] dark:bg-violet-600/[0.08]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(148,163,184,0.07)_1px,transparent_1px),linear-gradient(to_bottom,rgba(148,163,184,0.07)_1px,transparent_1px)] bg-[length:64px_64px] opacity-40 dark:bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] dark:opacity-[0.35]" />
      </div>

      {/* Hero */}
      <section className="relative flex w-full min-h-[92vh] flex-col items-center justify-center overflow-hidden border-b border-border/60 bg-background px-6 py-24 text-center dark:border-white/5">
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-10%,rgba(139,61,252,0.14),transparent)] dark:bg-[radial-gradient(ellipse_80%_50%_at_50%_-10%,rgba(154,47,187,0.18),transparent)]"
          aria-hidden
        />

        <div className="relative z-10 mx-auto w-full max-w-3xl">
          <div className="mb-8 flex flex-wrap justify-center gap-3">
            <span className="rounded-full border border-primary/40 px-3 py-1.5 text-[10px] font-medium uppercase tracking-[0.2em] text-primary">
              Webinar toos ah oo lacag la&apos;aan ah
            </span>
            <span className="rounded-full border border-border px-3 py-1.5 text-[10px] font-medium uppercase tracking-[0.2em] text-muted-foreground dark:border-white/10 dark:text-white/40">
              Waa toos oo kaliya — duubis (recording) ma jirto
            </span>
          </div>

          <h1 className="mx-auto mb-4 max-w-3xl font-serif text-5xl font-bold leading-[1.1] tracking-tight text-foreground md:text-6xl lg:text-7xl dark:text-white">
            <span className="inline-block text-[1.06em] leading-none md:text-[1.08em]">
              AI:
            </span>{" "}
            Waxa ay tahay, sababta ay muhiim u tahay, iyo waxaad ku qaban
            karto
          </h1>

          <div className="mb-8 mt-4 flex justify-center">
            <div className="h-px w-24 rounded-full bg-primary/60" />
            <div className="ms-1 h-px w-8 rounded-full bg-primary/30" />
            <div className="ms-1 h-px w-3 rounded-full bg-primary/15" />
          </div>

          <p className="mx-auto mb-10 max-w-xl text-base text-muted-foreground md:text-lg dark:text-white/50">
            Kulan toos ah oo 2-saacadood ah oo loogu talagalay bulshada
            Soomaaliyeed.
          </p>

          <p className="mb-6 text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground/90 dark:text-white/30">
            Khamiis, 9 April 2026
          </p>

          <div className="mb-10 flex flex-wrap justify-center gap-2">
            <span className="rounded-full bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground">
              <span className="font-bold">4:00 PM</span>
              <span className="font-medium"> — Dublin · UK (IST / BST)</span>
            </span>
            <span className="rounded-full border border-border bg-muted/70 px-5 py-2 text-sm text-muted-foreground dark:border-white/8 dark:bg-white/[0.06] dark:text-white/60">
              <span className="font-semibold text-foreground dark:text-inherit">6:00 PM</span>
              <span className="font-medium"> — Geeska Afrika (EAT)</span>
            </span>
            <span className="rounded-full border border-border bg-muted/70 px-5 py-2 text-sm text-muted-foreground dark:border-white/8 dark:bg-white/[0.06] dark:text-white/60">
              <span className="font-semibold text-foreground dark:text-inherit">11:00 AM</span>
              <span className="font-medium"> — US (ET)</span>
            </span>
          </div>

          <button
            type="button"
            onClick={scrollToRegister}
            className="group mx-auto mb-4 block rounded-sm bg-primary px-10 py-4 text-sm font-semibold uppercase tracking-widest text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Is-diiwaangeli lacag la&apos;aan
            <span
              className="ms-2 inline-block transition group-hover:translate-x-0.5"
              aria-hidden
            >
              →
            </span>
          </button>

          <p className="text-xs tracking-wide text-muted-foreground/70 dark:text-white/20">
            Boosasku waa xaddidan yihiin
          </p>
        </div>
      </section>

      {/* Waxa aad baran doonto */}
      <section className="border-t border-border px-4 py-20 md:py-28 dark:border-zinc-800/80">
        <div className="mx-auto max-w-5xl">
          <div className="mx-auto mb-12 max-w-2xl text-center md:mb-16">
            <p className="text-xs font-bold uppercase tracking-[0.28em] text-primary">
              Waxa aad baran doonto
            </p>
            <p className="mt-3 text-sm text-muted-foreground md:text-base">
              Liis taxane ah oo ku saabsan aasaaska AI iyo waxa maanta muhiim u ah.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 md:gap-5 lg:gap-6">
            {LEARN_ITEMS.map((text, i) => (
              <div
                key={i}
                className="group relative overflow-hidden rounded-2xl border border-border bg-card/80 p-6 shadow-sm transition hover:border-primary/35 hover:bg-card md:p-8 dark:border-zinc-800/90 dark:bg-zinc-950/50 dark:hover:bg-zinc-950/70"
              >
                <div className="absolute start-0 top-0 h-full w-1 bg-gradient-to-b from-primary to-primary/40 opacity-80 transition group-hover:opacity-100" />
                <div className="flex gap-5 ps-1 md:gap-6">
                  <span className="shrink-0 font-mono text-2xl font-bold tabular-nums text-primary md:text-[1.65rem]">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <p className="text-[15px] leading-relaxed text-foreground/90 md:text-base dark:text-zinc-300">
                    {text}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Cidda loogu talagalay */}
      <section className="border-t border-border bg-muted/40 px-4 py-20 md:py-28 dark:border-zinc-800/80 dark:bg-zinc-950/40">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-center font-serif text-2xl font-medium text-foreground md:text-3xl lg:text-[2rem]">
            Cidda loogu talagalay
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-center text-sm text-muted-foreground md:text-base">
            Laba saf oo ka muuqda mobilka; afar kaarar weyn oo kombiyuutarka.
          </p>

          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:mt-14 lg:grid-cols-4 lg:gap-6">
            {[
              {
                icon: GraduationCap,
                title: "Ardayda",
                desc: "Dhis fahan suubban ka hor imtixaannada, mashaariicda, ama tallaabadaada xigta.",
              },
              {
                icon: Briefcase,
                title: "Xirfadlayaasha",
                desc: "Arag sida AI ugu habboon tahay shaqadaada dhabta ah (workflows) — adigoo ka fogaanaya buunbuuninta.",
              },
              {
                icon: Store,
                title: "Milkiilayaasha ganacsiga",
                desc: "Fikrado wax ku ool ah oo loogu talagalay founders-ka, kuwa madax-bannaan (freelancers), iyo maamulayaasha.",
              },
              {
                icon: Code2,
                title: "Developers-ka",
                desc: "Aasaas adag, agents, iyo waxa nagu soo socda ee tignoolajiyada.",
              },
            ].map(({ icon: Icon, title, desc }) => (
              <div
                key={title}
                className="rounded-2xl border border-border bg-card p-7 shadow-md transition hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 dark:border-zinc-800/90 dark:bg-gradient-to-b dark:from-zinc-900/80 dark:to-zinc-950/90"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/15 text-primary">
                  <Icon className="h-6 w-6" aria-hidden />
                </div>
                <h3 className="mt-5 text-lg font-semibold text-foreground">
                  {title}
                </h3>
                <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground dark:text-zinc-400">
                  {desc}
                </p>
              </div>
            ))}
          </div>

          <p className="mt-12 text-center text-sm leading-relaxed text-muted-foreground md:mt-14 md:text-base">
            Ma jiro khibrad hore oo loo baahan yahay — qof kasta waa lagu soo
            dhoweeyaa.
          </p>
        </div>
      </section>

      {/* Khibrada & muuqaalada */}
      <section className="border-t border-border px-4 py-20 md:py-28 dark:border-zinc-800/80">
        <div className="mx-auto max-w-6xl">
          <div className="mx-auto mb-12 max-w-2xl text-center md:mb-16">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-primary">
              Khibrada & hogaaminta
            </p>
            <h2 className="mt-3 font-serif text-2xl font-medium text-foreground md:text-3xl">
              Kooxda khubarta ah ee kula jirta kulanka
            </h2>
            <p className="mt-3 text-sm text-muted-foreground md:text-base">
              Muuqaallo muujinaya awoodda farsamada, bulshada, iyo kulan tooska ah —
              adiga oo isku xiran khibrada dhabta ah.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
            {EXPERT_VISUALS.map(({ icon: Icon, title, subtitle }) => (
              <div
                key={title}
                className="relative overflow-hidden rounded-2xl border border-border bg-muted/30 p-6 text-center transition hover:border-primary/25 dark:border-zinc-800/90 dark:bg-zinc-900/30"
              >
                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-primary/30 via-primary/10 to-transparent ring-1 ring-primary/20">
                  <Icon className="h-9 w-9 text-primary" strokeWidth={1.5} aria-hidden />
                </div>
                <p className="mt-5 text-sm font-semibold text-foreground md:text-base">
                  {title}
                </p>
                <p className="mt-2 text-xs leading-relaxed text-muted-foreground md:text-sm">
                  {subtitle}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Hogaamiyaha — sawirka */}
      <section className="border-t border-border px-4 py-20 md:py-28 dark:border-zinc-800/80">
        <div className="mx-auto max-w-5xl">
          <div className="flex flex-col items-center gap-10 md:flex-row md:items-center md:gap-14 lg:gap-16">
            <div className="relative shrink-0">
              <div
                className="absolute -inset-3 rounded-3xl bg-gradient-to-br from-primary/25 via-transparent to-violet-600/20 blur-xl"
                aria-hidden
              />
              <div className="relative overflow-hidden rounded-3xl border-2 border-primary/25 bg-card shadow-2xl ring-1 ring-black/5 dark:bg-zinc-900 dark:ring-white/5">
                <div className="aspect-square w-[min(100%,280px)] sm:w-[300px] md:w-[320px]">
                  {!presenterImageError ? (
                    <Image
                      src="/presenter.jpg"
                      alt="Abdishakur Ali — Founder, Garaad"
                      width={640}
                      height={640}
                      className="h-full w-full object-cover object-top"
                      priority
                      onError={() => setPresenterImageError(true)}
                    />
                  ) : (
                    <div className="flex h-full min-h-[200px] flex-col items-center justify-center gap-2 bg-muted px-6 text-center text-sm text-muted-foreground dark:bg-zinc-900">
                      <Users className="h-10 w-10 text-primary/50" aria-hidden />
                      <span>Fadlan ku dar sawirka hogaamiyaha</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="max-w-xl text-center md:text-start">
              <p className="text-xs font-semibold uppercase tracking-wider text-primary">
                Hogaamiyaha barnaamijka
              </p>
              <h2 className="mt-2 font-serif text-3xl font-medium text-foreground md:text-4xl">
                Abdishakur Ali
              </h2>
              <p className="mt-3 text-base font-medium leading-snug text-muted-foreground dark:text-zinc-300">
                Founder, Garaad · Full-Stack Developer &amp; AI Engineer
              </p>
              <p className="mt-5 text-[15px] leading-relaxed text-muted-foreground md:text-base dark:text-zinc-400">
                Wuxuu dhisayaa bulshada STEM iyo developers-ka Soomaaliyeed
                iyada oo loo marayo Garaad — laga bilaabo aasaaska dadka bilowga ah
                ilaa nidaamyada waaweyn ee production AI iyo full-stack systems.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Diiwaangeli */}
      <section
        id="register"
        className="scroll-mt-24 border-t border-border px-4 py-20 md:py-28 dark:border-zinc-800/80"
      >
        <div className="mx-auto max-w-lg">
          <div className="mb-10 text-center md:mb-12">
            <h2 className="font-serif text-2xl font-medium text-foreground md:text-3xl">
              Xajiso booskaaga
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground md:text-base">
              Lacag la&apos;aan. Toos (live). Duubis ma jirto. Boosasku waa xaddidan
              yihiin.
            </p>
          </div>

          {successName ? (
            <div className="rounded-2xl border border-primary/20 bg-card p-8 text-center shadow-lg md:p-10 dark:bg-gradient-to-b dark:from-zinc-900/80 dark:to-zinc-950/90">
              <CheckCircle2
                className="mx-auto h-16 w-16 text-primary"
                aria-hidden
              />
              <p className="mt-6 font-serif text-xl font-medium text-foreground md:text-2xl">
                Waad ku guulaysatay, {firstNameFromFullName(successName)}!
              </p>
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground md:text-[15px] dark:text-zinc-400">
                Hubi emailkaaga xaqiijinta. Link-ga Zoom waxaa laguugu soo diri
                doonaa 1 saac ka hor intaanan bilownin.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
                <button
                  type="button"
                  onClick={downloadIcs}
                  className="rounded-xl border border-border bg-muted px-6 py-3.5 text-sm font-semibold text-foreground transition hover:border-primary/40 hover:bg-muted/80 dark:border-zinc-700 dark:bg-zinc-900/80 dark:hover:bg-zinc-900"
                >
                  Ku dar jadwalka (calendar)
                </button>
                <button
                  type="button"
                  onClick={shareCopy}
                  className="rounded-xl bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90"
                >
                  La wadaag saaxiib
                </button>
              </div>
            </div>
          ) : (
            <form
              onSubmit={onSubmit}
              className="rounded-2xl border border-border bg-card/90 p-6 shadow-xl backdrop-blur-sm md:p-8 dark:border-zinc-800/90 dark:bg-zinc-950/50"
              noValidate
            >
              <div className="space-y-6 md:space-y-7">
                <div>
                  <label
                    htmlFor="webinar-full-name"
                    className="block text-sm font-medium text-foreground"
                  >
                    Magacaaga oo dhammaystiran
                  </label>
                  <input
                    id="webinar-full-name"
                    name="full_name"
                    type="text"
                    autoComplete="name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className={fieldClass(!!clientErrors.fullName)}
                    required
                  />
                  {clientErrors.fullName ? (
                    <p className="mt-1.5 text-sm text-destructive">
                      {clientErrors.fullName}
                    </p>
                  ) : null}
                </div>

                <div>
                  <label
                    htmlFor="webinar-email"
                    className="block text-sm font-medium text-foreground"
                  >
                    Email-kaaga
                  </label>
                  <input
                    id="webinar-email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={fieldClass(!!clientEmailError)}
                    required
                  />
                  {clientEmailError ? (
                    <p className="mt-1.5 text-sm text-destructive">
                      {clientEmailError}
                    </p>
                  ) : null}
                </div>

                <div>
                  <label
                    htmlFor="webinar-whatsapp"
                    className="block text-sm font-medium text-foreground"
                  >
                    WhatsApp (waa ikhtiyaari — si xusuusin laguugu soo diro)
                  </label>
                  <input
                    id="webinar-whatsapp"
                    name="whatsapp"
                    type="tel"
                    autoComplete="tel"
                    value={whatsapp}
                    onChange={(e) => setWhatsapp(e.target.value)}
                    className={fieldClass(false)}
                  />
                </div>

                <div>
                  <label
                    htmlFor="webinar-country"
                    className="block text-sm font-medium text-foreground"
                  >
                    Waddanka / Magaalada
                  </label>
                  <input
                    id="webinar-country"
                    name="country"
                    type="text"
                    placeholder="Tusaale: Dublin, London, Minneapolis"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className={fieldClass(!!clientErrors.country)}
                    required
                  />
                  {clientErrors.country ? (
                    <p className="mt-1.5 text-sm text-destructive">
                      {clientErrors.country}
                    </p>
                  ) : null}
                </div>

                <fieldset>
                  <legend className="text-sm font-medium text-foreground">
                    Waxaan uga soo biirayaa sidii:
                  </legend>
                  <div
                    className={cn(
                      "mt-3 space-y-3 rounded-xl border bg-muted/50 p-4 md:p-5 dark:bg-zinc-950/40",
                      clientErrors.role ? "border-destructive/60" : "border-border dark:border-zinc-800"
                    )}
                  >
                    {ROLE_OPTIONS.map((opt) => (
                      <label
                        key={opt.value}
                        className="flex cursor-pointer items-start gap-3.5 text-sm text-foreground dark:text-zinc-200"
                      >
                        <input
                          type="radio"
                          name="role"
                          value={opt.value}
                          checked={role === opt.value}
                          onChange={() => setRole(opt.value)}
                          className="mt-1 size-4 shrink-0 border-border text-primary focus:ring-primary dark:border-zinc-600"
                        />
                        <span className="leading-snug">{opt.label}</span>
                      </label>
                    ))}
                  </div>
                  {clientErrors.role ? (
                    <p className="mt-1.5 text-sm text-destructive">
                      {clientErrors.role}
                    </p>
                  ) : null}
                </fieldset>

                <button
                  type="submit"
                  disabled={submitting}
                  className="flex w-full items-center justify-center rounded-xl bg-primary py-4 text-base font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition hover:bg-primary/90 disabled:opacity-55"
                >
                  {submitting ? "Waa la dirayaa…" : "Is-diiwaangeli lacag la'aan →"}
                </button>
                <p className="text-center text-xs leading-relaxed text-muted-foreground md:text-[13px]">
                  Waxaad isla markiiba heli doontaa email xaqiijin ah. Link-ga
                  Zoom-ka waxaa lagu soo diri doonaa 1 saac ka hor kulanka.
                </p>
              </div>
            </form>
          )}
        </div>
      </section>

      {/* FAQ */}
      <section className="border-t border-border px-4 py-20 md:py-28 dark:border-zinc-800/80">
        <div className="mx-auto max-w-2xl">
          <h2 className="text-center font-serif text-2xl font-medium text-foreground md:text-3xl">
            Su&apos;aalaha badanaa la is weydiiyo
          </h2>
          <Accordion type="single" collapsible className="mt-10 w-full space-y-3">
            {FAQ_ITEMS.map((item, idx) => (
              <AccordionItem
                key={item.q}
                value={`item-${idx}`}
                className="overflow-hidden rounded-xl border border-border border-b-0 bg-card/70 px-1 data-[state=open]:border-primary/25 dark:border-zinc-800/90 dark:bg-zinc-950/40"
              >
                <AccordionTrigger className="px-4 py-4 text-start text-[15px] font-medium text-foreground hover:no-underline md:px-5 md:text-base">
                  {item.q}
                </AccordionTrigger>
                <AccordionContent className="px-4 pb-4 text-sm leading-relaxed text-muted-foreground md:px-5 md:text-[15px] dark:text-zinc-400">
                  {item.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>
    </main>
  );
}
