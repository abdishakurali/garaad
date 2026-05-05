"use client";

import Link from "next/link";
import { Shield, User, Clock, ChevronDown, Volume2 } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { usePostHog } from "posthog-js/react";
import { useAuthStore } from "@/store/useAuthStore";
import { getMediaUrl } from "@/lib/utils";

function VimeoHeroPlayer() {

  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);

  const send = (method: string, value?: unknown) =>
    iframeRef.current?.contentWindow?.postMessage(
      JSON.stringify({ method, ...(value !== undefined && { value }) }),
      "https://player.vimeo.com"
    );

  const handlePlay = () => {
    send("play");
    send("setVolume", 1);
    send("setMuted", false);
    setPlaying(true);
  };

  const handlePause = (e: React.MouseEvent) => {
    e.stopPropagation();
    send("pause");
    setPlaying(false);
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    send("setVolume", muted ? 1 : 0);
    send("setMuted", !muted);
    setMuted((m) => !m);
  };

  return (
    <div className="relative overflow-hidden rounded-xl border border-white/10 bg-black select-none">
      <div style={{ padding: "56.29% 0 0 0", position: "relative" }}>
        <iframe
          ref={iframeRef}
          src="https://player.vimeo.com/video/1186028450?badge=0&autopause=0&player_id=0&app_id=58479&autoplay=0&muted=0&controls=0"
          loading="lazy"
          frameBorder="0"
          allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }}
          title="garaad"
        />

        {/* Play button overlay — shown before first play */}
        {!playing && (
          <div
            className="absolute inset-0 flex items-center justify-center bg-black/30 cursor-pointer"
            onClick={handlePlay}
          >
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white/20 backdrop-blur-md border-2 border-white/50 shadow-2xl transition-all duration-200 hover:bg-white/30 hover:scale-105">
              <svg viewBox="0 0 24 24" fill="white" className="w-9 h-9 ml-1.5 drop-shadow">
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
          </div>
        )}

        {/* Controls — visible once playing */}
        {playing && (
          <div className="absolute bottom-3 right-3 flex items-center gap-2">
            <button
              onClick={toggleMute}
              className="flex items-center gap-1.5 rounded-full bg-black/60 backdrop-blur-sm border border-white/20 text-white px-3 py-1.5 text-xs font-semibold hover:bg-black/80 transition-colors"
              aria-label={muted ? "Unmute" : "Mute"}
            >
              <Volume2 className="w-3.5 h-3.5" />
              {muted ? "Dhageyso" : "Aamusi"}
            </button>
            <button
              onClick={handlePause}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-black/60 backdrop-blur-sm border border-white/20 text-white hover:bg-black/80 transition-colors"
              aria-label="Pause"
            >
              <svg viewBox="0 0 24 24" fill="white" className="w-4 h-4">
                <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
              </svg>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
function VideoSection({ src }: { src: string }) {
  const [playing, setPlaying] = useState(false);
  return (
    <div className="relative w-full rounded-[16px] overflow-hidden bg-card border border-border aspect-video">
      {!playing && (
        <div 
          className="absolute inset-0 flex items-center justify-center cursor-pointer"
          onClick={() => setPlaying(true)}
        >
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-black/40 backdrop-blur-sm border-2 border-white/70 flex items-center justify-center hover:bg-black/60 transition-colors">
            <svg viewBox="0 0 24 24" fill="white" className="w-8 h-8 sm:w-10 sm:h-10 ml-1">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>
      )}
      {playing && (
        <iframe
          src={`${src}?autoplay=1&muted=0&controls=0`}
          loading="lazy"
          frameBorder="0"
          allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          className="absolute inset-0 w-full h-full"
          title="garaad"
        />
      )}
    </div>
  );
}

/* ─── FAQ ──────────────────────────────────────────────────────────────── */
const FAQS = [
  {
    q: "Ma u baahanahay inaan aqaan code-ka?",
    a: "Maya. Waxaad u baahan tahay telefoon, internet, iyo diyaar-u-ahaanshaha inaad raacdo qorshaha. Barnaamijku wuxuu ka bilaabanayaa eber.",
  },
  {
    q: "Maxaa dhacaya haddii aanan lacag samayn 30 maalmood gudahood?",
    a: "Aniga ayaa si shakhsi ah kuu caawinaya ilaa aad ka samayso. Tani ma ahan hadal suuq-geyn ah — waa dammaanad qoran.",
  },
  {
    q: "Ma Af-Soomaali baa lagu baranayaa?",
    a: "Haa. Cashar kastaa waa Af-Soomaali. Taas ayaaba ujeedadu tahay.",
  },
  {
    q: "Waa maxay farqiga u dhexeeya casharrada bilaashka ah iyo Tartanka (Challenge)?",
    a: "Bilaashku wuxuu ku siinayaa labada cashar ee ugu horreeya ee jid kasta. Tartanka (Challenge) waa barnaamijka oo dhan oo 60 maalmood ah iyo inaad hesho caawinaaddayda shakhsiga ah.",
  },
];

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-border last:border-0">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between gap-4 py-5 text-left"
      >
        <span className="text-base font-medium text-foreground">{q}</span>
        <ChevronDown
          className={`shrink-0 w-4 h-4 text-muted-foreground transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && (
        <p className="pb-5 text-sm text-muted-foreground leading-relaxed pr-8">{a}</p>
      )}
    </div>
  );
}
interface LearnerUser {
  id: number;
  first_name: string;
  profile_picture?: string;
}
interface LandingStats {
  students_count: number;
  courses_count: number;
  learners_this_month: number;
}

/* ─── Home ─────────────────────────────────────────────────────────────── */
export function HomeContent() {  
  const [stats, setStats] = useState<LandingStats | null>(null);

  const [socialUsers, setSocialUsers] = useState<LearnerUser[]>([]);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/public/landing-stats/`)
      .then((res) => res.json())
      .then((data) => setStats(data))
      .catch(() => {});
    
    // Fetch social proof users (prioritizes those with profile pictures)
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/public/social-proof/`)
      .then((res) => res.json())
      .then((data) => {
        // Sort: users with profile pictures first
        const sorted = [...data].sort((a, b) => {
          if (a.profile_picture && !b.profile_picture) return -1;
          if (!a.profile_picture && b.profile_picture) return 1;
          return 0;
        });
        setSocialUsers(sorted.slice(0, 5));
      })
      .catch(() => {});
  }, []);
  const posthog = usePostHog();
  const { user, isAuthenticated } = useAuthStore();

  useEffect(() => {
    posthog?.capture("home_viewed", { authenticated: isAuthenticated, user_id: user?.id });
  }, [isAuthenticated, user?.id, posthog]);

  return (
    <main className="bg-background text-foreground">

      {/* HERO */}
      <section className="h-full max-w-2xl mx-auto  flex items-center justify-center flex-col pt-14">
        <div className="max-w-6xl flex items-center justify-center flex-col mx-auto px-4 sm:px-6 w-full py-10 sm:py-12">
          <div className="  flex justify-center items-center">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#D4AF37] mb-6">
              Af-Soomaali ku baro. 
              </p>
              <h1 className="text-display-lg sm:text-display-xl font-serif text-foreground mb-6">
                30 maalmood gudahood.<br />
                <span className="italic opacity-60">Samee lacagtaadi ugu horreysay.</span>
              </h1>
              <p className="text-lg text-muted-foreground mb-8 max-w-md leading-relaxed">
                Barnaamij dakhli-abuur ah oo 60 maalmood ah. Waxaa dhisay qof horey u soo sameeyay. Ma ahan koorso caadi ah. Waa dammaanad.
              </p>
              <div className="hero-animate-cta flex flex-col sm:flex-row gap-3 mb-8">
                <Link href="/subscribe" className="btn-gold">
                  Ku soo biir Tartanka →
                </Link>
                <a href="#how-it-works" className="btn-ghost">
                  Eeg sida uu u shaqeeyo
                </a>
              </div>
               <div className={`mx-auto mt-6 flex items-center justify-center gap-3 text-xs  
          text-slate-600  `}>
          <div className="flex items-center -space-x-1.5">
            {socialUsers.slice(0, 5).map((user, i) => {
              const colors = ["bg-violet-500", "bg-cyan-500", "bg-amber-500", "bg-emerald-500", "bg-rose-500"];
              const color = colors[i % colors.length];
              return user.profile_picture ? (
                <img
                  key={user.id}
                  src={getMediaUrl(user.profile_picture, "profile_pics")}
                  alt={user.first_name}
                  className="w-8 h-8 rounded-full border-2 border-white dark:border-zinc-900 object-cover ring-2 ring-transparent"
                  style={{ zIndex: 5 - i }}
                />
              ) : (
                <div
                  key={user.id}
                  className={`w-8 h-8 rounded-full border-2 border-white dark:border-zinc-900 ${color} flex items-center justify-center text-white text-xs font-bold`}
                  style={{ zIndex: 5 - i }}
                >
                  {user.first_name?.[0]?.toUpperCase() || "?"}
                </div>
              );
            })}
            {socialUsers.length > 0 && socialUsers.length < 5 && stats?.students_count && stats.students_count > socialUsers.length && (
              <div className="flex items-center justify-center w-8 h-8 rounded-full border-2 border-white dark:border-zinc-900 bg-slate-200 dark:bg-zinc-700 text-slate-600 dark:text-zinc-300 text-xs font-bold ring-2 ring-transparent">
                +{stats.students_count - socialUsers.length}
              </div>
            )}
          </div>
          {stats?.students_count && stats.students_count > 0 && (
            <span className="font-semibold">{stats.students_count} aya kuso biiray</span>
          )}
        </div>
            </div>

            
        </div>
          </div>
                  {/* Trust indicators with profile images */}
     
          <div className="mx-auto  w-full max-w-2xl  ">
          <VimeoHeroPlayer />
        </div>
      </section>

      {/* THE GUARANTEE */}
      <section className="py-24 border-t border-border">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-gold mb-6">Ballanqaadka</p>
          <h2 className="text-display-md sm:text-display-lg font-serif mb-4">
            Samee lacagtaadii ugu horreysay 30 maalmood gudahood.<br />
           </h2>
          <p className="text-muted-foreground text-lg mb-16 max-w-lg mx-auto">
            Ama aniga ayaa si shakhsi ah kuu caawinaya ilaa aad ka gaarto. Lacag dheeraad ah ma jirto.
          </p>
          <div className="grid sm:grid-cols-3 gap-4 text-left">
            {[
              { icon: Shield, label: "Dammaanad dhab ah", body: "Haddii aad shaqada qabato oo aad waxba heli weydo, aniga ayaa garab istaagaaga noqonaya." },
              { icon: User,   label: "Xiriir toos ah", body: "Waxaad helaysaa Shakuur si toos ah markaad meel ku dagganto." },
              { icon: Clock,  label: "Jid habaysan",  body: "Waa qorshe maalin-ka-maalin ah, ee ma ahan maktabad casharro iskaga dunsan yihiin." },
            ].map(({ icon: Icon, label, body }) => (
              <div key={label} className="p-6 rounded-[16px] border border-border bg-card">
                <Icon className="w-5 h-5 text-gold mb-4" strokeWidth={1.5} />
                <p className="font-semibold text-foreground mb-1">{label}</p>
                <p className="text-sm text-muted-foreground leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* THREE PATHS */}
      <section className="py-24 border-t border-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-gold mb-4">Saddex Jid</p>
            <h2 className="text-display-md sm:text-display-lg font-serif">Dooro sida aad rabto inaad u dhisato dakhligaaga.</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            {[
              {
                title: "Freelancer",
                tagline: "Hel shaqadaadii ugu horreysay adigoo isticmaalaya qalabka AI.",
                milestone: "Dakhliga qiyaasta ah: $50–$200 marka la gaaro Maalinta 30-aad",
                for: "Dadka raba inay macaamiil u shaqeeyaan isla markiiba",
              },
              {
                title: "Worker",
                tagline: "Hel wareysigaagii ugu horreeyay ee shaqo meel fog laga qabto (Remote Job).",
                milestone: "Wareysiga koowaad: Marka la gaaro Maalinta 30-aad",
                for: "Dadka raba dakhli deggan oo shaqo joogto ah leh",
              },
              {
                title: "Builder",
                tagline: "Dhis oo iibi alaabtaadii dhijitaalka ahayd ee ugu horreysay.",
                milestone: "Iibka koowaad: Marka la gaaro Maalinta 30-aad",
                for: "Dadka raba inay abuuraan wax iyaga u gaar ah",
              },
            ].map((p) => (
              <div key={p.title} className="p-6 rounded-[16px] border border-border bg-card flex flex-col">
                <p className="text-xs font-bold uppercase tracking-[0.15em] text-gold mb-3">{p.title}</p>
                <p className="text-base font-medium text-foreground mb-4 leading-snug">{p.tagline}</p>
                <div className="mt-auto pt-4 border-t border-border space-y-1.5">
                  <p className="text-sm text-foreground font-medium">{p.milestone}</p>
                  <p className="text-xs text-muted-foreground">U fiican: {p.for}</p>
                </div>
              </div>
            ))}
          </div>
          <p className="text-center mt-8 text-sm font-medium text-gold">
            Dooro jidkaaga markaad ku soo biirto →
          </p>
        </div>
      </section>

      {/* ABOUT SHAKUUR */}
      <section className="py-24 border-t border-border">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="grid md:grid-cols-[1fr_2fr] gap-10 items-start">
            <VideoSection src="https://player.vimeo.com/video/1186028450" />
            <div>
              <div className="space-y-4 text-muted-foreground text-base leading-relaxed mb-6">
                <p>
                  "Waxaan ahay Shakuur. . Waxaan iskuna baray code-ka, waxaan dhisay alaabo dhijitaal ah, waxaanan lacagtii ugu horreysay online ku sameeyay anigoo aan shahaado haysan, cid i hagta haysan, isla markaana aanan qofna ka aqoon dunida tignoolajiyada.
                </p>
                <p>
                  Waxaan dhisay Garaad sababtoo ah marna kamaan helin wax sidan oo kale ah oo Af-Soomaali ku qoran. Hadda waxaan rabaa inaan dib u soo laabto oo aan ku tuso sida saxda ah ee aan u sameeyay.
                </p>
                <p className="text-foreground font-medium">
                  Haddii aad shaqada qabato, waxaan xaqiijinayaa inaad guusha gaarto."
                </p>
              </div>
              <Link href="/about/abdishakuur-ali" className="btn-ghost text-sm" style={{ padding: "10px 20px", minHeight: "40px" }}>
Akhriso sheekada oo dhan →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" className="py-24 border-t border-border">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-gold mb-4">Sida uu u shaqeeyo</p>
            <h2 className="text-display-md sm:text-display-lg font-serif">Shan tallaabo oo aad ku gaarayso dakhligaaga koowaad.</h2>
          </div>
          <ol className="divide-y divide-border">
            {[
              { n: "01", text: "Ku soo biir Tartanka ($149 hal mar ah)" },
              { n: "02", text: "Dooro jidkaaga: Freelancer, Worker, ama Builder" },
              { n: "03", text: "Raac qorshaha 30-ka maalmood ee habaysan — maalinkii hal cashar" },
              { n: "04", text: "Gaar hiigsigaaga lacageed ee ugu horreeya marka la gaaro Maalinta 30-aad" },
              { n: "05", text: "Hel macmiilkaagii ugu horreeyay marka la gaaro Maalinta 60-aad — ama aniga ayaa kuu soo dhex-galaya oo ku caawinaya" },
            ].map(({ n, text }) => (
              <li key={n} className="flex gap-6 py-5">
                <span className="font-mono text-sm text-gold shrink-0 pt-0.5 w-6">{n}</span>
                <span className="text-base text-foreground">{text}</span>
              </li>
            ))}
          </ol>
          <div className="mt-10 text-center">
            <Link href="/subscribe" className="btn-gold">Bilow maanta →</Link>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24 border-t border-border">
        <div className="max-w-2xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-gold mb-4">FAQ</p>
            <h2 className="text-display-md font-serif">Su'aalaha caanka ah.</h2>
          </div>
          <div>
            {FAQS.map((faq) => <FaqItem key={faq.q} q={faq.q} a={faq.a} />)}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="py-24 border-t border-border">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-display-md sm:text-display-lg font-serif mb-4">
            Tallaabada koowaad waxay kugu qaadanaysaa 5 daqiiqo oo kaliya.
          </h2>
          <p className="text-muted-foreground text-lg mb-10">
            Is diwaangeli. Dooro jidkaaga. Bilow maanta.
          </p>
          <Link href="/subscribe" className="btn-gold text-base" style={{ padding: "16px 40px" }}>
            Ku soo biir Garaad →
          </Link>
        </div>
      </section>

    </main>
  );
}
