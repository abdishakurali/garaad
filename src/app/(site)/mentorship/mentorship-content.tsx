"use client";

import Link from "next/link";
import Image from "next/image";
import { Video, Clock, ArrowRight, Check } from "lucide-react";

const SESSION_DETAILS = [
  "30 daqiiqo, wicitaan muuqaal ah",
  "Waxaad i tuseysaa meesha aad ku xayiran tahay",
  "Waxaan ku tusi doonaa tillaabada xigta ee saxda ah",
  "Waxaad la tagi doontaa hawl aad qabato, ee maaha kaliya talo",
];

export function MentorshipContent() {
  return (
    <main className="bg-background text-foreground pt-14">

      {/* Hero */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-20 sm:py-28">
        <div className="grid md:grid-cols-2 gap-12 lg:gap-20 items-start">

          <div className="md:order-2">
            <div className="relative w-full h-full min-h-[500px] rounded-[16px] overflow-hidden bg-card border border-border">
              <Image
                src="/images/mentorship_cover.png"
                alt="Tartanka Garaad"
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>

          <div className="md:order-1">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-gold mb-6">
              Latalin (Mentorship)
            </p>
            <h1 className="text-display-md sm:text-display-lg font-serif mb-6">
              Si toos ah iila shaqee.
            </h1>
            <p className="text-muted-foreground text-base leading-relaxed mb-10">
              Kani maaha fariin dhanka caawimaada ah (support ticket) ama fariin Discord.
              Waa wicitaan dhab ah, fool-ka-fool ah, oo aad la yeelanayso qof soo maray halka aad hadda higsanayso.
            </p>

            <div className="mb-8">
              <p className="text-sm font-semibold text-foreground mb-4">Sida uu fadhigu u egyahay:</p>
              <ul className="space-y-3">
                {SESSION_DETAILS.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm text-muted-foreground">
                    <Check className="w-4 h-4 text-gold mt-0.5 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <Link
              href="https://cal.com/garaad/assessment"
              rel="noopener noreferrer"
              className="btn-gold inline-flex"
            >
              Qabso xilli (Book a session) →
            </Link>
            <p className="mt-3 text-xs text-muted-foreground">
              Wuxuu u furan yahay ardayda Tartanka (Challenge) kaliya
            </p>
          </div>
        </div>
      </section>

      {/* What you get */}
      <section className="border-t border-border py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-gold mb-4">Waxa ka mid ah</p>
            <h2 className="text-display-md font-serif">Wicid oo ka badan.</h2>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              { icon: Video,     title: "Wicida Video 1:1",  body: "Wicida screen-share ah oo aan Ku shaqeyno xaaladaada gaarka ah." },
              { icon: Clock,     title: "Rajeynta Async",     body: "Su'aalaha u dhexeeya wicidaha waxaa la garanayaa 24 saacadood gudaheed." },
              { icon: ArrowRight,title: "Mas'uuliyadda",      body: "Check-in toddobaadle ah si loo hubiyo inaad u socoto dhakhligaadii ugu horreysay." },
              { icon: Check,     title: "Dammaanad",       body: "Haddii aad Tartanka ku jirto oo aadan gaarin hiigsigadii, ayaan sii wicdiya — ma khasiisan." },
            ].map(({ icon: Icon, title, body }) => (
              <div key={title} className="p-6 rounded-[16px] border border-border bg-card">
                <Icon className="w-5 h-5 text-gold mb-4" strokeWidth={1.5} />
                <p className="font-semibold text-foreground mb-2">{title}</p>
                <p className="text-sm text-muted-foreground leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Student quotes placeholder */}
      <section className="border-t border-border py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-gold mb-4">Ardayda</p>
          <h2 className="text-display-md font-serif mb-12">Waxay odhan.</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              { quote: "Add a real student quote here.", name: "Student name", detail: "Path · City" },
              { quote: "Add a second real student quote here.", name: "Student name", detail: "Path · City" },
            ].map((t, i) => (
              <div key={i} className="p-6 rounded-[16px] border border-border bg-card text-left">
                <p className="text-sm text-muted-foreground leading-relaxed mb-4 italic">"{t.quote}"</p>
                <p className="text-sm font-semibold text-foreground">{t.name}</p>
                <p className="text-xs text-muted-foreground">{t.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="border-t border-border py-20">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-display-md font-serif mb-4">Ma hubtaa Tartanka?</h2>
          <p className="text-muted-foreground mb-8">
            Tartanka waxaa ku jira Mentorship. Ku biir si aad u hesho gelid 1:1.
          </p>
          <Link href="/subscribe" className="btn-gold">Ku soo biir Tartanka →</Link>
        </div>
      </section>

    </main>
  );
}