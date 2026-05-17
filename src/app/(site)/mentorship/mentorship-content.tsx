"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef } from "react";
import { usePostHog } from "posthog-js/react";
import { useAuthStore } from "@/store/useAuthStore";
import {
  ArrowRight,
  Check,
  ChevronDown,
  Play,
  Users,
  Zap,
  Trophy,
  MessageCircle,
  Clock,
  Star,
  BookOpen,
  TrendingUp,
} from "lucide-react";

const ROADMAP_WEEKS = [
  { week: "Todobaadka 1–2", title: "Aasaaska Web Dev", desc: "HTML, CSS, JavaScript — adigoo dhisaya mashruucaada ugu horeysay", free: true },
  { week: "Todobaadka 3–4", title: "React & Next.js", desc: "UI casri ah, routing, iyo xaalad maareynta", free: false },
  { week: "Todobaadka 5–6", title: "Backend & API", desc: "Django, REST API, xog kaydinta (database)", free: false },
  { week: "Todobaadka 7–8", title: "AI Integration", desc: "OpenAI, claude API, dhisidda AI-powered apps", free: false },
  { week: "Todobaadka 9–10", title: "Freelance Launch", desc: "Portfolio, client-helitaanka, lacag-kasbaashada ugu horeysay", free: false },
  { week: "Todobaadka 11–12", title: "Dakhliga Sii Wad", desc: "Shaqada sii wad, scaling, macaamiisha la xiriir", free: false },
];

const TESTIMONIALS = [
  {
    quote: "Markii aan bilaabay waxaan u maleynayay in ay adag tahay. Laakin ka dib 3 todobaad, website oo buuxda ayaan dhisay. Taas baan u mahadcelinayaa.",
    name: "Ilyas Omar",
    role: "Front-End Developer · Muqdisho",
    initials: "IO",
  },
  {
    quote: "Hadda Front-End Developer ahaan ayaan ku shaqeynayaa shirkaddayda Sofaritech. Waxaan bilaabay ereygii koowaad ee JavaScript sidaan baray.",
    name: "Abdiaziz",
    role: "Founder · Sofaritech Global IT Solutions",
    initials: "AA",
  },
  {
    quote: "Koorsada iyo macallinku waxay iga caawiyeen in aan xirfad dhabta ah u sameeyo. Maanta waxaan sameeynayaa freelance projects caalami ah.",
    name: "Abdiladif Salah",
    role: "Full-Stack Developer · Helsinki",
    initials: "AS",
  },
];

const OUTCOMES = [
  { icon: TrendingUp, label: "Dhakhli", value: "$500–$2,000/bilood", sub: "60 casho gudahood" },
  { icon: Trophy,     label: "Mashruuc", value: "3+ portfolio projects", sub: "Diyaar oo la arki karo" },
  { icon: Users,      label: "Network",  value: "150+ arday",           sub: "Bulsho khibrad leh" },
  { icon: Zap,        label: "Xawaaraha", value: "60 casho",            sub: "Oo habaysan" },
];

const FIRST_WEEK = [
  { day: "Maalin 1", action: "Casharka 1aad — HTML aasaasiga", done: true },
  { day: "Maalin 2", action: "Casharka 2aad — CSS & design", done: true },
  { day: "Maalin 3", action: "Casharka 3aad — JavaScript basics", done: true },
  { day: "Maalin 4–5", action: "Mashruucaaga ugu horeysay", done: false },
  { day: "Maalin 6–7", action: "Code review + feedback toos ah", done: false },
];

function FaqItem({ q, a }: { q: string; a: string }) {
  return (
    <details className="group border-b border-border last:border-0">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-5">
        <span className="text-base font-medium text-foreground">{q}</span>
        <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-open:rotate-180" />
      </summary>
      <p className="pb-5 pr-8 text-sm leading-relaxed text-muted-foreground">{a}</p>
    </details>
  );
}

export function MentorshipContent() {
  const posthog = usePostHog();
  const { user } = useAuthStore();
  const tracked = useRef(false);

  useEffect(() => {
    if (tracked.current || !posthog) return;
    tracked.current = true;
    posthog.capture("mentorship_landing_view", { signed_in: !!user });
  }, [posthog, user]);

  const freeLessonHref = user
    ? "/courses/freelancing"
    : "/welcome?redirect=/courses/freelancing";

  const handleFreeLessonClick = () => {
    posthog?.capture("free_lesson_cta_clicked", { location: "hero", signed_in: !!user });
  };

  const handlePricingCtaClick = () => {
    posthog?.capture("mentorship_cta_clicked", { location: "pricing_section", signed_in: !!user });
  };

  return (
    <main className="bg-background text-foreground">

      {/* ── HERO ─────────────────────────────────────────────────── */}
      <section className="mx-auto max-w-5xl px-4 pb-16 pt-20 sm:pt-28 sm:px-6">
        <div className="grid items-center gap-12 md:grid-cols-2 lg:gap-20">

          {/* Copy */}
          <div>
            <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-gold/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-gold">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-gold" />
              Casharkaaga 1aad — Bilaash
            </div>

            <h1 className="mb-5 font-serif text-4xl font-bold leading-tight text-foreground sm:text-5xl">
              Lix bilood gudahood{" "}
              <span className="text-gold">developer</span> noqo.
            </h1>

            <p className="mb-3 text-base leading-relaxed text-muted-foreground">
              Ma ahayn daraasad kaliya. Waa jid habaysan oo lagugu geeyaa
              mashruucaada ugu horeysay, lacagta ugu horeysay, shaqadaada ugu horeysay —
              iyadoo macallin kugu jira kol walba.
            </p>

            <p className="mb-8 text-sm font-medium text-gold">
              Billow bilaash. Lacag kama bixino ilaa aad aragto qiimaynta.
            </p>

            {/* Social proof */}
            <div className="mb-8 flex items-center gap-3">
              <div className="flex -space-x-2">
                {["IO", "AS", "AA", "MF"].map((l) => (
                  <div
                    key={l}
                    className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-background bg-gold text-[10px] font-bold text-black"
                  >
                    {l}
                  </div>
                ))}
              </div>
              <div>
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-3 w-3 fill-gold text-gold" />
                  ))}
                </div>
                <p className="text-xs text-muted-foreground">150+ arday ayaa horey u bilaabay</p>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link
                href={freeLessonHref}
                onClick={handleFreeLessonClick}
                className="btn-gold inline-flex items-center justify-center gap-2 py-4 text-base font-bold"
              >
                <Play className="h-4 w-4 fill-current" />
                Bilaw Casharka 1aad — Bilaash
              </Link>
              <a
                href="#roadmap"
                className="inline-flex items-center justify-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                Arag Qorshaha
                <ArrowRight className="h-3.5 w-3.5" />
              </a>
            </div>

            <p className="mt-3 text-xs text-muted-foreground">
              Kaarka kama bixino. Casharka 1aad ilaa 3aad — 100% bilaash.
            </p>
          </div>

          {/* Image */}
          <div className="relative h-[420px] overflow-hidden rounded-2xl border border-border bg-card md:h-[520px]">
            <Image
              src="/images/mentorship_cover.png"
              alt="Macallin Abdishakuur — Garaad Mentorship"
              fill
              className="object-cover"
              priority
            />
            {/* Floating badge */}
            <div className="absolute bottom-4 left-4 flex items-center gap-2.5 rounded-xl border border-gold/30 bg-background/90 px-3 py-2 shadow-lg backdrop-blur-sm">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gold text-xs font-bold text-black">
                SA
              </div>
              <div>
                <p className="text-xs font-semibold text-foreground">Abdishakuur Ali</p>
                <p className="text-[10px] text-muted-foreground">Macallin &amp; Mentor</p>
              </div>
              <div className="ml-1 h-2 w-2 rounded-full bg-green-500" />
            </div>
          </div>
        </div>
      </section>

      {/* ── OUTCOMES BAR ─────────────────────────────────────────── */}
      <section className="border-y border-border bg-card/50 py-8">
        <div className="mx-auto grid max-w-4xl grid-cols-2 gap-6 px-4 sm:grid-cols-4 sm:px-6">
          {OUTCOMES.map(({ icon: Icon, label, value, sub }) => (
            <div key={label} className="text-center">
              <Icon className="mx-auto mb-2 h-5 w-5 text-gold" strokeWidth={1.5} />
              <p className="text-sm font-bold text-foreground">{value}</p>
              <p className="text-[11px] text-muted-foreground">{sub}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── FIRST 7 DAYS ─────────────────────────────────────────── */}
      <section className="mx-auto max-w-3xl px-4 py-20 sm:px-6">
        <div className="mb-10 text-center">
          <p className="mb-3 text-xs font-bold uppercase tracking-widest text-gold">Bilowga</p>
          <h2 className="font-serif text-3xl font-bold">
            7 Maalin Koowaad — Waxa dhaca
          </h2>
          <p className="mt-3 text-sm text-muted-foreground">
            Ma jiro wax la baranayo oo kaliya. Maalin kasta waxaad dhisaysaa wax dhab ah.
          </p>
        </div>

        <div className="relative space-y-3">
          {FIRST_WEEK.map(({ day, action, done }, i) => (
            <div
              key={i}
              className={`flex items-start gap-4 rounded-xl border p-4 transition-all ${
                done
                  ? "border-gold/30 bg-gold/5"
                  : "border-border bg-card"
              }`}
            >
              <div
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                  done ? "bg-gold text-black" : "bg-muted text-muted-foreground"
                }`}
              >
                {done ? <Check className="h-4 w-4" /> : i + 1}
              </div>
              <div>
                <p className={`text-xs font-semibold uppercase tracking-wider ${done ? "text-gold" : "text-muted-foreground"}`}>
                  {day}
                  {done && <span className="ml-2 text-[10px] normal-case font-normal text-gold/70">— bilaash</span>}
                </p>
                <p className="mt-0.5 text-sm font-medium text-foreground">{action}</p>
              </div>
            </div>
          ))}

          {/* Unlock hint */}
          <div className="flex items-center gap-3 rounded-xl border border-dashed border-border bg-card/50 px-4 py-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted">
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </div>
            <p className="text-xs text-muted-foreground">
              <span className="font-semibold text-foreground">Todobaadka 2–12</span> — mentor-ku kugu biiri doonaa casharka oo si gaar ah laguu hagayo.
            </p>
          </div>
        </div>

        <div className="mt-8 text-center">
          <Link
            href={freeLessonHref}
            onClick={handleFreeLessonClick}
            className="btn-gold inline-flex items-center gap-2 px-8 py-3.5 font-bold"
          >
            Bilaw Maalin 1da Maanta
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* ── ROADMAP ──────────────────────────────────────────────── */}
      <section id="roadmap" className="border-t border-border py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <div className="mb-10 text-center">
            <p className="mb-3 text-xs font-bold uppercase tracking-widest text-gold">Qorshaha</p>
            <h2 className="font-serif text-3xl font-bold">60 Casho · 12 Todobaad</h2>
            <p className="mt-3 text-sm text-muted-foreground">
              Qorshaha oo dhan waa habaysan yahay. Kol walba waxaad garanaysaa halka aad joogto.
            </p>
          </div>

          <div className="space-y-3">
            {ROADMAP_WEEKS.map(({ week, title, desc, free }, i) => (
              <div
                key={i}
                className={`relative flex items-start gap-4 rounded-xl border p-4 ${
                  free ? "border-gold/40 bg-gold/5" : "border-border bg-card"
                }`}
              >
                <div
                  className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[11px] font-bold ${
                    free ? "bg-gold text-black" : "bg-muted text-muted-foreground"
                  }`}
                >
                  {i + 1}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      {week}
                    </p>
                    {free && (
                      <span className="rounded-full bg-gold px-2 py-0.5 text-[10px] font-bold uppercase text-black">
                        Bilaash
                      </span>
                    )}
                  </div>
                  <p className="mt-0.5 text-sm font-semibold text-foreground">{title}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">{desc}</p>
                </div>
                {!free && (
                  <div className="shrink-0 text-[10px] font-medium text-muted-foreground/60">
                    Premium
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── MENTOR ───────────────────────────────────────────────── */}
      <section className="border-t border-border py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <div className="overflow-hidden rounded-2xl border border-border bg-card">
            <div className="grid items-center gap-0 sm:grid-cols-[auto_1fr]">
              {/* Photo */}
              <div className="relative h-56 w-full sm:h-full sm:w-48">
                <Image
                  src="/images/mentorship_cover.png"
                  alt="Abdishakuur Ali"
                  fill
                  className="object-cover object-top"
                />
              </div>
              {/* Copy */}
              <div className="p-6 sm:p-8">
                <p className="mb-1 text-xs font-bold uppercase tracking-widest text-gold">Macallinkaaga</p>
                <h2 className="mb-3 font-serif text-2xl font-bold">Abdishakuur Ali</h2>
                <p className="mb-4 text-sm leading-relaxed text-muted-foreground">
                  Waxaan ahay software developer oo 5+ sano khibrad leh.
                  Waxaan u shaqeeyay shirkadaha caalamiga ah, waxaan dhisay apps
                  ay isticmaalaan kumanaan qof. Hadda waxaan u hiil geliyaa
                  Soomaalida in ay noqdaan developers caalami ah.
                </p>
                <div className="flex flex-wrap gap-3">
                  {["5+ sano khibrad", "150+ arday", "Shirkado caalami ah"].map((t) => (
                    <span
                      key={t}
                      className="rounded-full border border-border bg-background px-3 py-1 text-xs font-medium text-foreground"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ─────────────────────────────────────────── */}
      <section className="border-t border-border py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <div className="mb-10 text-center">
            <p className="mb-3 text-xs font-bold uppercase tracking-widest text-gold">Ardayda</p>
            <h2 className="font-serif text-3xl font-bold">Natiijada Dhab ah</h2>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            {TESTIMONIALS.map((t, i) => (
              <div
                key={i}
                className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-5"
              >
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, s) => (
                    <Star key={s} className="h-3.5 w-3.5 fill-gold text-gold" />
                  ))}
                </div>
                <p className="flex-1 text-sm italic leading-relaxed text-muted-foreground">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gold text-[11px] font-bold text-black">
                    {t.initials}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">{t.name}</p>
                    <p className="text-[11px] text-muted-foreground">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── COMMUNITY PREVIEW ────────────────────────────────────── */}
      <section className="border-t border-border py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <div className="mb-10 text-center">
            <p className="mb-3 text-xs font-bold uppercase tracking-widest text-gold">Bulshadda</p>
            <h2 className="font-serif text-3xl font-bold">Ma Baranayso Kaligiis</h2>
            <p className="mt-3 text-sm text-muted-foreground">
              150+ developer oo Soomaali ah ayaa hore kugu jira.
            </p>
          </div>

          {/* Mock community messages */}
          <div className="space-y-3 rounded-2xl border border-border bg-card p-4">
            {[
              { user: "Ilyas", msg: "Maanta website-kayga ugu horeysay ayaan la soo baxay 🎉", time: "2 daqiiqo", initials: "IO", highlight: true },
              { user: "Faadumo", msg: "Su'aal: React useState iyo useEffect — meesha kala duwan ee ay ku kala habboon tahay?", time: "15 daqiiqo", initials: "FM", highlight: false },
              { user: "Macallin", msg: "useState = xaalad. useEffect = waxyaabaha xaaladu ay saameeyso. Ku eeg casharka 8aad, tusaale fudud ayaad ku heli doontaa ✓", time: "12 daqiiqo", initials: "SA", highlight: false, isMentor: true },
              { user: "Cabdirashiid", msg: "Waxaan galay $800 freelance project-kayga ugu horeysa! Garaad waa isbedel dhab ah 🚀", time: "1 saac", initials: "CR", highlight: true },
            ].map((msg, i) => (
              <div
                key={i}
                className={`flex gap-3 rounded-xl p-3 ${
                  msg.highlight
                    ? "border border-gold/20 bg-gold/5"
                    : msg.isMentor
                      ? "border border-border bg-background"
                      : ""
                }`}
              >
                <div
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[10px] font-bold ${
                    msg.isMentor ? "bg-gold text-black" : "bg-muted text-muted-foreground"
                  }`}
                >
                  {msg.initials}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-foreground">{msg.user}</span>
                    {msg.isMentor && (
                      <span className="rounded-full bg-gold/20 px-1.5 py-0.5 text-[9px] font-bold uppercase text-gold">
                        Macallin
                      </span>
                    )}
                    <span className="text-[10px] text-muted-foreground">{msg.time}</span>
                  </div>
                  <p className="mt-0.5 text-sm text-foreground/80">{msg.msg}</p>
                </div>
              </div>
            ))}

            {/* Blurred teaser */}
            <div className="relative overflow-hidden rounded-xl border border-border p-3">
              <div className="flex gap-3 blur-[3px] select-none">
                <div className="h-8 w-8 rounded-full bg-muted" />
                <div className="flex-1 space-y-1.5">
                  <div className="h-2.5 w-24 rounded bg-muted" />
                  <div className="h-2.5 w-48 rounded bg-muted" />
                </div>
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <Link
                  href={freeLessonHref}
                  onClick={handleFreeLessonClick}
                  className="rounded-full border border-gold/40 bg-background/90 px-3 py-1.5 text-xs font-semibold text-gold backdrop-blur-sm"
                >
                  Bilow si aad u arki karto →
                </Link>
              </div>
            </div>

            <div className="flex items-center gap-2 px-1 pt-1">
              <MessageCircle className="h-3.5 w-3.5 text-muted-foreground" />
              <p className="text-xs text-muted-foreground">
                <span className="font-semibold text-foreground">24+</span> farriin maanta
              </p>
              <span className="text-muted-foreground">·</span>
              <Clock className="h-3.5 w-3.5 text-muted-foreground" />
              <p className="text-xs text-muted-foreground">Jawaab &lt; 24 saacadood</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── PRICING ──────────────────────────────────────────────── */}
      <section id="pricing" className="border-t border-border py-20">
        <div className="mx-auto max-w-md px-4 sm:px-6">
          <div className="mb-8 text-center">
            <p className="mb-3 text-xs font-bold uppercase tracking-widest text-gold">Qiimaha</p>
            <h2 className="font-serif text-3xl font-bold">Ku biir Mentorship-ka</h2>
            <p className="mt-3 text-sm text-muted-foreground">
              Ka dib markii aad aragto qiimaynta — codso booska.
            </p>
          </div>

          <div className="relative rounded-2xl border-2 border-gold bg-card p-8 shadow-xl shadow-gold/10">
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-gold px-4 py-0.5 text-[11px] font-bold uppercase tracking-wide text-black">
              Lagu taliyay
            </div>

            <div className="mb-6 text-center">
              <p className="mb-1 text-sm font-medium text-gold">Tartanka Garaad</p>
              <div className="flex items-baseline justify-center gap-1">
                <span className="text-4xl font-bold text-foreground">$49</span>
                <span className="text-sm text-muted-foreground">/bilood</span>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">ama $149 hal mar · 3 bilood</p>
            </div>

            <ul className="mb-8 space-y-3">
              {[
                "Casharrada oo dhan (60 casho)",
                "Xidhiidh toos ah oo Abdishakuur",
                "Code review shakhsiyeed",
                "Bulshadda 150+ developer",
                "Dammaanad: lacag-celinta 5 maalmood",
              ].map((f) => (
                <li key={f} className="flex items-center gap-3 text-sm text-foreground">
                  <Check className="h-4 w-4 shrink-0 text-gold" />
                  {f}
                </li>
              ))}
            </ul>

            <Link
              href="/subscribe"
              onClick={handlePricingCtaClick}
              className="btn-gold flex w-full items-center justify-center gap-2 py-4 text-base font-bold"
            >
              Bilow Mentorship-ka
              <ArrowRight className="h-4 w-4" />
            </Link>

            <p className="mt-4 text-center text-xs text-muted-foreground">
              Kaarka kama bixino maanta · Lacag-celinta 5 maalmood
            </p>
          </div>

          {/* OR free start */}
          <div className="mt-6 rounded-xl border border-border bg-card p-4 text-center">
            <p className="mb-2 text-sm font-medium text-foreground">
              Ma hubtid weli?
            </p>
            <p className="mb-3 text-xs text-muted-foreground">
              Bilaw casharka 1aad — bilaash. Lacag kuma baahna.
            </p>
            <Link
              href={freeLessonHref}
              onClick={handleFreeLessonClick}
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-gold hover:underline"
            >
              <Play className="h-3.5 w-3.5 fill-current" />
              Bilaw Casharka 1aad
            </Link>
          </div>
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────────────── */}
      <section className="border-t border-border py-20">
        <div className="mx-auto max-w-2xl px-4 sm:px-6">
          <h2 className="mb-8 text-center font-serif text-2xl font-bold">Su&apos;aalaha Inta Badan</h2>
          <div className="divide-y divide-border rounded-2xl border border-border bg-card px-6">
            {[
              {
                q: "Casharka 1aad bilaash miyuu yahay?",
                a: "Haa. Casharka 1aad ilaa 3aad — 100% bilaash. Kaarka kama bixino, signup kama bixino. Iska bilaw oo bilanayso waxa aad baranayso.",
              },
              {
                q: "Runtii ma jirtaa dammaanad lacag-celin ah?",
                a: "Haa. Haddii aad raacdo qorshaha oo aadan gaarin hiigsigadii muddo 5 casho ah, si shakhsi ah ayaan kula shaqaynayaa. Haddii intaas ka dib aad wali ku qanci waydo, lacagtaada ayaan kuu soo celinayaa.",
              },
              {
                q: "Waa maxay farqiga casharrada bilaashka ah iyo Premium?",
                a: "Casharka 1–3 waa furan yihiin si aad ula tijaabiso. Premium wuxuu ku siinayaa casharrada oo dhan (60 casho), xidhiidh toos ah oo macallinkaaga, code reviews, iyo bulshadda.",
              },
              {
                q: "Ma baranayaa Af-Soomaali?",
                a: "Haa. Casharrada oo dhan waxaa lagu barayaa Af-Soomaali. Waa barnaamij gaar ah oo loogu talagalay ardayda Soomaalida adduunka oo dhan.",
              },
              {
                q: "Marka aan xidid maxaa dhacaya?",
                a: "Waxaad xidid kartaa goor kasta. Wax xukun ah oo hore kuma jiraan. Hadba hawlaha aad buuxiyeyso ayaa lagugu xifaaliyaa.",
              },
            ].map((faq) => (
              <FaqItem key={faq.q} q={faq.q} a={faq.a} />
            ))}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ────────────────────────────────────────────── */}
      <section className="border-t border-border py-20">
        <div className="mx-auto max-w-xl px-4 text-center sm:px-6">
          <h2 className="mb-4 font-serif text-3xl font-bold">
            Casharka 1aad waa lacag la&apos;aan.
          </h2>
          <p className="mb-8 text-muted-foreground">
            Boosaas kama bixino. Kaarka kama weydiino. Bilaw oo ka dib go&apos;aan gaar ah.
          </p>
          <Link
            href={freeLessonHref}
            onClick={handleFreeLessonClick}
            className="btn-gold inline-flex items-center gap-2 px-10 py-4 text-base font-bold"
          >
            <Play className="h-4 w-4 fill-current" />
            Bilaw Bilaash Hadda
          </Link>
          <p className="mt-3 text-xs text-muted-foreground">
            Casharka 1–3 bilaash · Si fudud u billoow
          </p>
        </div>
      </section>

    </main>
  );
}
