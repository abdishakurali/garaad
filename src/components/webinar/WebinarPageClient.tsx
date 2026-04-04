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
  CheckCircle2,
  Code2,
  GraduationCap,
  Store,
} from "lucide-react";

const ROLE_OPTIONS = [
  { value: "student", label: "Student" },
  { value: "professional", label: "Professional" },
  { value: "business", label: "Business owner · Freelancer" },
  { value: "aspiring_dev", label: "Aspiring Developer" },
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
    "PRODID:-//Garaad//Webinar//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    "UID:webinar-garaad-ai-2026-04-09@garaad.org",
    `DTSTAMP:${formatIcsUtcCompact(new Date())}`,
    "DTSTART:20260409T150000Z",
    "DTEND:20260409T170000Z",
    "SUMMARY:AI Webinar — Garaad",
    `DESCRIPTION:${escapeIcsText(
      "Free 2-hour live session (English / Somali). Zoom link is emailed 1 hour before start."
    )}`,
    "URL:https://garaad.org/webinar",
    "LOCATION:Online — Zoom",
    "END:VEVENT",
    "END:VCALENDAR",
  ];
  return lines.join("\r\n");
}

const SHARE_TEXT =
  "I just registered for a free AI webinar by Garaad — 9 April 2026, open to everyone. Register: garaad.org/webinar";

const LEARN_ITEMS = [
  "What AI actually is — no jargon, real foundation",
  "Why this moment is unlike anything before it",
  "Use cases for students, professionals & founders",
  "The hard truths the hype will not tell you",
  "Open source models, agents & what comes next",
  "Live demo — you try it yourself before we finish",
] as const;

const FAQ_ITEMS = [
  {
    q: "Is it really free?",
    a: "Yes. No credit card, no catch. Just register and show up.",
  },
  {
    q: "What language will the session be in?",
    a: "Primarily English, with Somali used where it helps. Everyone is welcome regardless of language level.",
  },
  {
    q: "Do I need any technical background?",
    a: "No. The session is designed for everyone — students, professionals, and developers alike.",
  },
  {
    q: "Will there be a recording?",
    a: "No. This is a live-only session. Register and attend to get the full experience.",
  },
] as const;

function firstNameFromFullName(fullName: string): string {
  const part = fullName.trim().split(/\s+/)[0];
  return part || "there";
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
      next.fullName = "Please enter your full name.";
    }
    const em = email.trim();
    if (!em) {
      emailErr = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(em)) {
      emailErr = "Enter a valid email address.";
    }
    if (!country.trim()) {
      next.country = "Please enter your country or city.";
    }
    if (!role) {
      next.role = "Choose how you're joining.";
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
        title: "Something went wrong",
        description: "We could not complete registration. Check your connection and try again.",
      });
    } catch {
      toast({
        variant: "destructive",
        title: "Network error",
        description: "Could not reach the server. Please try again in a moment.",
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
        title: "Copied",
        description: "Share text copied to your clipboard.",
      });
    } catch {
      toast({
        variant: "destructive",
        title: "Could not copy",
        description: "Copy the link manually: garaad.org/webinar",
      });
    }
  };

  return (
    <main className="pb-24">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border px-4 pb-16 pt-12 sm:pt-20">
        <div className="mx-auto max-w-4xl text-center">
          <p className="mb-4 text-sm font-medium uppercase tracking-widest text-muted-foreground">
            Free live webinar
          </p>
          <h1 className="font-serif text-3xl font-medium leading-tight text-foreground sm:text-4xl md:text-5xl lg:text-[2.75rem] lg:leading-[1.15]">
            AI: Waxa ay tahay, sababta, iyo waxa aad ku qaban karto
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-base text-muted-foreground sm:text-lg">
            A free 2-hour live session for the Somali community
          </p>
          <p className="mt-6 text-lg font-medium text-foreground">
            Thursday, 9 April 2026
          </p>

          <div className="mx-auto mt-6 flex max-w-2xl flex-col gap-3 sm:flex-row sm:flex-wrap sm:justify-center sm:gap-4">
            <span className="inline-flex items-center justify-center gap-2 rounded-full border border-border bg-card/80 px-4 py-2 text-sm text-foreground backdrop-blur">
              <span aria-hidden>🟣</span>
              4:00 PM — Dublin · UK (IST / BST)
            </span>
            <span className="inline-flex items-center justify-center gap-2 rounded-full border border-border bg-card/80 px-4 py-2 text-sm text-foreground backdrop-blur">
              <span aria-hidden>⚪</span>
              6:00 PM — Somali Time (EAT)
            </span>
            <span className="inline-flex items-center justify-center gap-2 rounded-full border border-border bg-card/80 px-4 py-2 text-sm text-foreground backdrop-blur">
              <span aria-hidden>⚫</span>
              11:00 AM — US (ET)
            </span>
          </div>

          <p className="mt-6 text-sm text-muted-foreground">
            Live only — no recording
          </p>

          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <button
              type="button"
              onClick={scrollToRegister}
              className="inline-flex w-full items-center justify-center rounded-full bg-primary px-8 py-3.5 text-base font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition hover:opacity-95 sm:w-auto"
            >
              Register Free →
            </button>
          </div>
          <p className="mt-4 text-sm text-muted-foreground">
            Limited spots available
          </p>
        </div>
      </section>

      {/* What you'll learn */}
      <section className="px-4 py-16 md:py-20">
        <div className="mx-auto max-w-5xl">
          <p className="text-center text-sm font-semibold uppercase tracking-[0.2em] text-primary">
            WHAT YOU WILL LEARN
          </p>
          <div className="mt-10 grid gap-8 sm:grid-cols-2">
            {LEARN_ITEMS.map((text, i) => (
              <div key={text} className="flex gap-4">
                <span className="font-mono text-2xl font-bold tabular-nums text-primary">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <p className="text-base leading-relaxed text-foreground">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Who it's for */}
      <section className="border-y border-border bg-card/40 px-4 py-16 md:py-20">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-center font-serif text-2xl font-medium text-foreground md:text-3xl">
            Who this is for
          </h2>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                icon: GraduationCap,
                title: "Students",
                desc: "Build clarity before exams, projects, or your next step.",
              },
              {
                icon: Briefcase,
                title: "Professionals",
                desc: "See how AI fits real workflows — without the hype.",
              },
              {
                icon: Store,
                title: "Business owners",
                desc: "Practical angles for founders, freelancers, and operators.",
              },
              {
                icon: Code2,
                title: "Developers",
                desc: "Solid foundations, agents, and what is coming next.",
              },
            ].map(({ icon: Icon, title, desc }) => (
              <div
                key={title}
                className="rounded-2xl border border-border bg-background/60 p-6 transition hover:border-primary/40"
              >
                <Icon className="h-10 w-10 text-primary" aria-hidden />
                <h3 className="mt-4 font-semibold text-foreground">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {desc}
                </p>
              </div>
            ))}
          </div>
          <p className="mt-10 text-center text-sm text-muted-foreground">
            No experience required — everyone is welcome.
          </p>
        </div>
      </section>

      {/* Presenter */}
      <section className="px-4 py-16 md:py-20">
        <div className="mx-auto flex max-w-3xl flex-col items-center gap-8 md:flex-row md:items-start">
          <div className="relative h-48 w-48 shrink-0 overflow-hidden rounded-2xl border border-border bg-muted">
            {!presenterImageError ? (
              <Image
                src="/presenter.jpg"
                alt="Abdishakur Ali"
                width={192}
                height={192}
                className="h-full w-full object-cover"
                priority
                onError={() => setPresenterImageError(true)}
              />
            ) : (
              <div className="flex h-full w-full flex-col items-center justify-center gap-1 px-4 text-center text-xs text-muted-foreground">
                <span>Presenter photo</span>
                <span className="text-[10px]">Add /public/presenter.jpg</span>
              </div>
            )}
          </div>
          <div className="text-center md:text-left">
            <h2 className="font-serif text-2xl font-medium text-foreground">
              Abdishakur Ali
            </h2>
            <p className="mt-2 text-sm font-medium text-primary">
              Founder, Garaad · Full-Stack Developer &amp; AI Engineer
            </p>
            <p className="mt-4 max-w-lg text-sm leading-relaxed text-muted-foreground">
              Building Somalia&apos;s STEM and developer community through Garaad — from beginner-friendly foundations to production AI and full-stack systems.
            </p>
          </div>
        </div>
      </section>

      {/* Registration */}
      <section
        id="register"
        className="scroll-mt-24 border-t border-border px-4 py-16 md:py-20"
      >
        <div className="mx-auto max-w-lg">
          <h2 className="text-center font-serif text-2xl font-medium text-foreground md:text-3xl">
            Reserve Your Spot
          </h2>
          <p className="mt-3 text-center text-sm text-muted-foreground">
            Free. Live. No recording. Limited spots.
          </p>

          {successName ? (
            <div className="mt-10 rounded-2xl border border-border bg-card/60 p-8 text-center">
              <CheckCircle2
                className="mx-auto h-16 w-16 text-primary"
                aria-hidden
              />
              <p className="mt-6 font-serif text-2xl font-medium text-foreground">
                You&apos;re in, {firstNameFromFullName(successName)}!
              </p>
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                Check your email for confirmation. Zoom link arrives 1 hour before we
                start.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
                <button
                  type="button"
                  onClick={downloadIcs}
                  className="rounded-full border border-border bg-background px-6 py-3 text-sm font-semibold text-foreground transition hover:border-primary/50"
                >
                  Add to Calendar
                </button>
                <button
                  type="button"
                  onClick={shareCopy}
                  className="rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition hover:opacity-95"
                >
                  Share with a friend
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={onSubmit} className="mt-10 space-y-6" noValidate>
              <div>
                <label
                  htmlFor="webinar-full-name"
                  className="block text-sm font-medium text-foreground"
                >
                  Full name
                </label>
                <input
                  id="webinar-full-name"
                  name="full_name"
                  type="text"
                  autoComplete="name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className={cn(
                    "mt-2 w-full rounded-xl border bg-background px-4 py-3 text-foreground outline-none ring-ring/30 placeholder:text-muted-foreground focus:ring-2",
                    clientErrors.fullName ? "border-destructive" : "border-border"
                  )}
                  required
                />
                {clientErrors.fullName ? (
                  <p className="mt-1 text-sm text-destructive">
                    {clientErrors.fullName}
                  </p>
                ) : null}
              </div>

              <div>
                <label
                  htmlFor="webinar-email"
                  className="block text-sm font-medium text-foreground"
                >
                  Email address
                </label>
                <input
                  id="webinar-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={cn(
                    "mt-2 w-full rounded-xl border bg-background px-4 py-3 text-foreground outline-none ring-ring/30 placeholder:text-muted-foreground focus:ring-2",
                    clientEmailError ? "border-destructive" : "border-border"
                  )}
                  required
                />
                {clientEmailError ? (
                  <p className="mt-1 text-sm text-destructive">{clientEmailError}</p>
                ) : null}
              </div>

              <div>
                <label
                  htmlFor="webinar-whatsapp"
                  className="block text-sm font-medium text-foreground"
                >
                  WhatsApp (optional — for reminders)
                </label>
                <input
                  id="webinar-whatsapp"
                  name="whatsapp"
                  type="tel"
                  autoComplete="tel"
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                  className="mt-2 w-full rounded-xl border border-border bg-background px-4 py-3 text-foreground outline-none ring-ring/30 placeholder:text-muted-foreground focus:ring-2"
                />
              </div>

              <div>
                <label
                  htmlFor="webinar-country"
                  className="block text-sm font-medium text-foreground"
                >
                  Country / City
                </label>
                <input
                  id="webinar-country"
                  name="country"
                  type="text"
                  placeholder="e.g. Dublin, London, Minneapolis"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className={cn(
                    "mt-2 w-full rounded-xl border bg-background px-4 py-3 text-foreground outline-none ring-ring/30 placeholder:text-muted-foreground focus:ring-2",
                    clientErrors.country ? "border-destructive" : "border-border"
                  )}
                  required
                />
                {clientErrors.country ? (
                  <p className="mt-1 text-sm text-destructive">
                    {clientErrors.country}
                  </p>
                ) : null}
              </div>

              <fieldset>
                <legend className="text-sm font-medium text-foreground">
                  I am joining as
                </legend>
                <div
                  className={cn(
                    "mt-3 space-y-3 rounded-xl border p-4",
                    clientErrors.role ? "border-destructive" : "border-border"
                  )}
                >
                  {ROLE_OPTIONS.map((opt) => (
                    <label
                      key={opt.value}
                      className="flex cursor-pointer items-start gap-3 text-sm text-foreground"
                    >
                      <input
                        type="radio"
                        name="role"
                        value={opt.value}
                        checked={role === opt.value}
                        onChange={() => setRole(opt.value)}
                        className="mt-1 border-border text-primary focus:ring-primary"
                      />
                      <span>{opt.label}</span>
                    </label>
                  ))}
                </div>
                {clientErrors.role ? (
                  <p className="mt-1 text-sm text-destructive">
                    {clientErrors.role}
                  </p>
                ) : null}
              </fieldset>

              <button
                type="submit"
                disabled={submitting}
                className="flex w-full items-center justify-center rounded-full bg-primary py-3.5 text-base font-semibold text-primary-foreground transition hover:opacity-95 disabled:opacity-60"
              >
                {submitting ? "Sending…" : "Register Free →"}
              </button>
              <p className="text-center text-xs text-muted-foreground">
                You&apos;ll receive a confirmation email immediately. Zoom link sent
                1 hour before the session.
              </p>
            </form>
          )}
        </div>
      </section>

      {/* FAQ */}
      <section className="px-4 py-16 md:py-20">
        <div className="mx-auto max-w-2xl">
          <h2 className="text-center font-serif text-2xl font-medium text-foreground">
            FAQ
          </h2>
          <Accordion type="single" collapsible className="mt-10 w-full">
            {FAQ_ITEMS.map((item, idx) => (
              <AccordionItem key={item.q} value={`item-${idx}`}>
                <AccordionTrigger className="text-left text-foreground">
                  {item.q}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
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
