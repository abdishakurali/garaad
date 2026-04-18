"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useTheme } from "next-themes";

const PURPLE = "#7C3AED";
const PURPLE_LIGHT = "#F5F0FF";

function useInView(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setInView(true); }, { threshold });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, inView];
}

function FadeIn({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  const [ref, inView] = useInView();
  return (
    <div ref={ref} className={className} style={{
      opacity: inView ? 1 : 0,
      transform: inView ? "translateY(0)" : "translateY(24px)",
      transition: `opacity 0.6s ease ${delay}s, transform 0.6s ease ${delay}s`,
    }}>
      {children}
    </div>
  );
}

const outcomes = [
  {
    num: "01",
    text: "Shan mashruuc oo dhab ah oo ku jira GitHub-kaaga — mid kasta adigaa dhisay, interview-kana si kalsooni leh ugu sharrixi kara.",
  },
  {
    num: "02",
    text: "App Full-stack ah oo deployed ah — frontend, backend, database, iyo login system — leh URL dhab ah oo aad cid kasta tusi kartid.",
  },
  {
    num: "03",
    text: "SaaS product aad macaamiisha ama isticmaalayaasha u geyn kartid — oo leh AI integration iyo Stripe payments.",
  },
  {
    num: "04",
    text: "CV, LinkedIn, iyo Portfolio u diyaarsan codsiga shaqada — oo leh xirfadaha dhabta ah ee suuqa shaqadu u baahan yahay.",
  },
];

const timesheet = [
  {
    month: "Bishii 1aad — Aasaaska",
    stack: "HTML, CSS, JavaScript, React",
    weeks: [
      {
        week: "Toddobaadka 1aad",
        days: [
          { day: "Isniin", topic: "Soo dhawayn & Setup — VS Code, Git, GitHub", build: "Dev environment-ka oo diyaar ah, commit-kii ugu horreeyay" },
          { day: "Talaado", topic: "HTML Foundations — tags, structure, semantic HTML", build: "Bogga profile-ka qofka" },
          { day: "Arbaco", topic: "CSS Foundations — box model, flexbox, colors", build: "Qurxinta bogga profile-kaaga" },
          { day: "Khamiis", topic: "CSS Layouts — Grid, responsive, media queries", build: "Layout responsive ah oo 2-column leh" },
          { day: "Jimce", topic: "Project — Personal Portfolio Page", build: "Portfolio dhammaystiran oo lagu push-gareeyay GitHub", project: true },
        ]
      },
      {
        week: "Toddobaadka 2aad",
        days: [
          { day: "Isniin", topic: "JavaScript Basics — variables, types, functions", build: "Calculator fudud oo browser-ka ku dhex shaqaynaya" },
          { day: "Talaado", topic: "JavaScript Logic — conditions, loops, arrays", build: "Logic-ada To-do list-ka" },
          { day: "Arbaco", topic: "DOM Manipulation — select, change, events", build: "To-do list interactive ah" },
          { day: "Khamiis", topic: "Async JavaScript — fetch, promises, async/await", build: "Data laga soo jiidayo API dadweynaha u furan" },
          { day: "Jimce", topic: "Project — JavaScript Weather App", build: "App-ka cimilada oo isticmaalaya API dhab ah", project: true },
        ]
      },
      {
        week: "Toddobaadka 3aad",
        days: [
          { day: "Isniin", topic: "React Intro — sababta React, components, JSX", build: "Component-igii ugu horreeyay ee React" },
          { day: "Talaado", topic: "Props & State — useState hook", build: "Counter iyo dynamic card component" },
          { day: "Arbaco", topic: "React Lists & Events — map, onClick, forms", build: "List isbedbedalaya oo wax lagu dari karo lana tirtiri karo" },
          { day: "Khamiis", topic: "useEffect & API calls in React", build: "Soo jiidashada iyo soo bandhigista data-da API ee React" },
          { day: "Jimce", topic: "React Router — bogag badan iyo navigation", build: "React app bogag badan leh oo Navbar wata", project: true },
        ]
      },
      {
        week: "Toddobaadka 4aad — Toddobaadka Dhismaha",
        days: [
          { day: "Isniin", topic: "Global State — useContext", build: "Isbeddelka muuqaalka (Theme toggle) iyadoo la isticmaalayo Context" },
          { day: "Talaado", topic: "Build Day 1 — fikradda, qorshaynta, GitHub setup", build: "Qeexidda mashruuca iyo samaynta Repo", project: true },
          { day: "Arbaco", topic: "Build Day 2 — Core UI components", build: "Navbar, bogagga, iyo props-ka oo shaqaynaya", project: true },
          { day: "Khamiis", topic: "Build Day 3 — State, API, polish", build: "Data fetching, global state, iyo responsive-ka", project: true },
          { day: "Jimce", topic: "Demo Day — soo bandhig mashruucaaga Frontend-ka", build: "Live demo iyo GitHub published ah", project: true },
        ]
      },
    ]
  },
  {
    month: "Bishii 2aad — Full-Stack",
    stack: "Node.js, Express, MongoDB, Auth",
    weeks: [
      {
        week: "Toddobaadka 5aad",
        days: [
          { day: "Isniin", topic: "Node.js Intro — waa maxay server, sideese Node u shaqeeyaa", build: "Script-igii ugu horreeyay ee Node.js" },
          { day: "Talaado", topic: "Express Basics — routes, requests, responses", build: "Express server leh 3 route" },
          { day: "Arbaco", topic: "REST API Design — GET, POST, PUT, DELETE", build: "Full CRUD API" },
          { day: "Khamiis", topic: "Middleware — validation, error handling", build: "Middleware lagu daray Express API" },
          { day: "Jimce", topic: "Project — REST API loogu talagalay isticmaal dhab ah", build: "API shaqaynaya oo lagu push-gareeyay GitHub", project: true },
        ]
      },
      {
        week: "Toddobaadka 6aad",
        days: [
          { day: "Isniin", topic: "MongoDB Intro — databases, collections, documents", build: "MongoDB lagu xiray Node app" },
          { day: "Talaado", topic: "Mongoose — schemas, models, validation", build: "User model lagu dhisay Mongoose" },
          { day: "Arbaco", topic: "CRUD leh MongoDB — save, find, update, delete", build: "API wax ka akhrinaya waxna ku qoraya database dhab ah" },
          { day: "Khamiis", topic: "Ku xiridda Frontend-ka iyo Backend-ka", build: "React app soo bandhigaya data ka timid API-gaaga" },
          { day: "Jimce", topic: "Project — Full Stack App (iyadoon weli auth la gaarin)", build: "Isku xirka Frontend + Backend + Database", project: true },
        ]
      },
      {
        week: "Toddobaadka 7aad — Authentication",
        days: [
          { day: "Isniin", topic: "Auth Part 1 — diiwaangelinta, hash passwords (bcrypt)", build: "User registration endpoint" },
          { day: "Talaado", topic: "Auth Part 2 — login, JWT tokens", build: "Login endpoint soo celinaya JWT" },
          { day: "Arbaco", topic: "Protected Routes — verify JWT middleware", build: "Routes la geli karo oo keliya marka la soo login gareeyo" },
          { day: "Khamiis", topic: "Auth in React — keydinta token-ka, login/logout UI", build: "Form-ka login-ka oo ku xiran backend-ka" },
          { day: "Jimce", topic: "Project — ku darista Auth-ka Full Stack app-kaaga", build: "App leh register iyo login shaqaynaya", project: true },
        ]
      },
      {
        week: "Toddobaadka 8aad — Deploy",
        days: [
          { day: "Isniin", topic: "Polish & Debug — code review, error handling", build: "App-ka oo deggan oo aan lahayn bug-yo waaweyn" },
          { day: "Talaado", topic: "Deploy Backend — Railway / Render", build: "Backend-ka oo live ka ah internet-ka" },
          { day: "Arbaco", topic: "Deploy Frontend — Vercel, environment variables", build: "Frontend-ka oo live ka ah internet-ka" },
          { day: "Khamiis", topic: "Final polish, README, demo prep", build: "App-ka oo si buuxda u deployed ah oo documented ah" },
          { day: "Jimce", topic: "Demo Day — soo bandhig Full Stack app-kaaga", build: "Live demo iyo URL la wadaagay", project: true },
        ]
      },
    ]
  },
  {
    month: "Bishii 3aad — SaaS & AI",
    stack: "Next.js, AI, Stripe, Deploy",
    weeks: [
      {
        week: "Toddobaadka 9aad",
        days: [
          { day: "Isniin", topic: "Next.js Intro — pages, routing, sababta Next.js", build: "App-kii ugu horreeyay ee Next.js" },
          { day: "Talaado", topic: "Next.js Data Fetching — SSR, SSG, API routes", build: "Bog soo jiidaya data-da server-side ahaan" },
          { day: "Arbaco", topic: "SaaS Planning — fikradda, dadka lala tiigsanayo, qaabka dakhliga", build: "Qeexidda iyo qoraalka fikradda SaaS-ka" },
          { day: "Khamiis", topic: "SaaS Architecture — qaab dhismeedka, database, auth plan", build: "Structure-ka mashruuca oo GitHub laga sameeyay" },
          { day: "Jimce", topic: "Project — SaaS MVP skeleton", build: "Next.js app leh routing iyo layout", project: true },
        ]
      },
      {
        week: "Toddobaadka 10aad",
        days: [
          { day: "Isniin", topic: "AI Integration — Claude / OpenAI API basics", build: "Feature-kii ugu horreeyay ee AI ku shaqeeya" },
          { day: "Talaado", topic: "AI in your SaaS — ku dar feature AI ah product-gaaga", build: "AI feature ku dhex jira app-kaaga" },
          { day: "Arbaco", topic: "Payments — Stripe setup, checkout, subscriptions", build: "Stripe checkout oo shaqaynaya" },
          { day: "Khamiis", topic: "User Dashboard — muujinta data-da isticmaalaha, account page", build: "Dashboard loogu talagalay users-ka login-ka ah" },
          { day: "Jimce", topic: "Project — Core SaaS features complete", build: "Auth + AI + Payments oo wada shaqaynaya", project: true },
        ]
      },
      {
        week: "Toddobaadka 11aad",
        days: [
          { day: "Isniin", topic: "Polish — UI/UX, mobile responsive", build: "App-ka oo u muuqda mid professional ah shaashad kasta" },
          { day: "Talaado", topic: "Performance & Security — env variables, rate limiting", build: "App-ka oo ammaan ah oo production-ready ah" },
          { day: "Arbaco", topic: "Deploy SaaS — Vercel + production database", build: "SaaS live ka ah domain dhab ah" },
          { day: "Khamiis", topic: "Helitaanka isticmaalayaashii ugu horreeyay", build: "Ugu yaraan hal qof oo dhab ah oo isticmaalaya app-kaaga" },
          { day: "Jimce", topic: "Project — SaaS fully deployed leh isticmaalayaal dhab ah", build: "URL dhab ah, users dhab ah, iyo documentation", project: true },
        ]
      },
      {
        week: "Toddobaadka 12aad — Qalin-jabinta",
        days: [
          { day: "Isniin", topic: "Portfolio & GitHub — README, pinned repos", build: "GitHub profile u diyaar ah loo shaqeeyayaasha" },
          { day: "Talaado", topic: "Job Prep — CV, LinkedIn, qaabka codsiga shaqada", build: "CV iyo LinkedIn oo la cusboonaysiiyay" },
          { day: "Arbaco", topic: "Freelance Prep — helista macaamiisha, proposals, pricing", build: "Freelance profile ama proposal-kii ugu horreeyay" },
          { day: "Khamiis", topic: "Final Demo Prep — celcelis, slides, README", build: "Demo la sifeeyay oo la tijaabiyay" },
          { day: "Jimce", topic: "QALIN-JABINTA — Final Demo & Shahaado", build: "Soo bandhigista SaaS + Portfolio", project: true },
        ]
      },
    ]
  },
];

const months = [
  {
    num: "01",
    title: "Aasaaska",
    text: "Waxaad ku dhammaystiri doontaa mashruuc Frontend ah oo aad adigu dhistay.",
  },
  {
    num: "02",
    title: "Full-Stack ah",
    text: "Waxaad ku dhammaystiri doontaa App dhab ah oo aad deployed garaysay.",
  },
  {
    num: "03",
    title: "SaaS & AI",
    text: "Waxaad ku dhammaystiri doontaa wax-soo-saar dhab ah oo leh isticmaalayaal (users).",
  },
];

function Timesheet({ isDark }: { isDark: boolean }) {
  const [openMonth, setOpenMonth] = useState<number | null>(null);
  const [openWeeks, setOpenWeeks] = useState<Record<string, boolean>>({});

  function toggleMonth(i: number) {
    setOpenMonth(openMonth === i ? null : i);
    setOpenWeeks({});
  }

  function toggleWeek(key: string) {
    setOpenWeeks(prev => ({ ...prev, [key]: !prev[key] }));
  }

  const bgMonth = isDark ? "#18181b" : "#fff";
  const bgWeek = isDark ? "#1f1f23" : "#F9F7FF";
  const textPrimary = isDark ? "#fafafa" : "#0A0A0A";
  const textMuted = isDark ? "#a1a1aa" : "#555";
  const textLight = isDark ? "#71717a" : "#AAA";
  const border = isDark ? "#3f3f46" : "#E8E8E8";
  const borderLight = isDark ? "#27272a" : "#F0F0F0";
  const bgTable = isDark ? "#18181b" : "#F5F5F5";
  const bgProject = isDark ? "#1e1e24" : "#FDFBFF";
  const purpleText = PURPLE;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
      {timesheet.map((m, mi) => (
        <div key={mi} style={{ border: `1px solid ${border}`, borderRadius: 8, overflow: "hidden" }}>
          <button
            onClick={() => toggleMonth(mi)}
            style={{
              width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between",
              padding: "20px 24px", background: openMonth === mi ? bgWeek : bgMonth,
              border: "none", cursor: "pointer", textAlign: "left", transition: "background 0.2s",
              fontFamily: "inherit",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <span style={{
                fontSize: 11, fontWeight: 700, letterSpacing: "0.1em",
                color: purpleText, background: PURPLE_LIGHT, padding: "3px 10px", borderRadius: 3,
              }}>
                Bishii {m.month.split("—")[0].replace("Bishii ", "")}
              </span>
              <div>
                <span style={{ fontSize: 15, fontWeight: 600, color: textPrimary }}>{m.month}</span>
                <span style={{ fontSize: 12, color: textLight, marginLeft: 10, letterSpacing: "0.05em" }}>{m.stack}</span>
              </div>
            </div>
            <span style={{
              fontSize: 18, color: textLight, transform: openMonth === mi ? "rotate(180deg)" : "rotate(0deg)",
              transition: "transform 0.25s", lineHeight: 1,
            }}>
              ↓
            </span>
          </button>

          {openMonth === mi && (
            <div style={{ borderTop: `1px solid ${borderLight}`, padding: "8px 0" }}>
              {m.weeks.map((w, wi) => {
                const weekKey = `${mi}-${wi}`;
                const isOpen = openWeeks[weekKey];
                return (
                  <div key={wi} style={{ borderBottom: wi < m.weeks.length - 1 ? `1px solid ${borderLight}` : "none" }}>
                    <button
                      onClick={() => toggleWeek(weekKey)}
                      style={{
                        width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between",
                        padding: "14px 24px 14px 40px", background: isOpen ? bgWeek : "transparent",
                        border: "none", cursor: "pointer", textAlign: "left", fontFamily: "inherit",
                        transition: "background 0.15s",
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        <span style={{ width: 6, height: 6, borderRadius: "50%", background: isOpen ? PURPLE : "#DDD", transition: "background 0.2s" }} />
                        <span style={{ fontSize: 13, fontWeight: 600, color: textPrimary }}>{w.week}</span>
                      </div>
                      <span style={{ fontSize: 12, color: textLight }}>{isOpen ? "−" : "+"} {w.days.length} maalin</span>
                    </button>

                    {isOpen && (
                      <div style={{ margin: "0 24px 12px 40px", borderRadius: 6, overflow: "hidden", border: `1px solid ${border}` }}>
                        <div style={{
                          display: "grid", gridTemplateColumns: "80px 1fr 1fr",
                          background: bgTable, padding: "8px 14px",
                          borderBottom: `1px solid ${border}`,
                        }}>
                          {["Maalinta", "Mawduunka", "Waxaad Samaynaysaa"].map((h, hi) => (
                            <span key={hi} style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", color: textLight, textTransform: "uppercase" }}>
                              {h}
                            </span>
                          ))}
                        </div>
                        {w.days.map((d, di) => (
                          <div key={di} style={{
                            display: "grid", gridTemplateColumns: "80px 1fr 1fr",
                            padding: "10px 14px",
                            background: d.project ? bgProject : bgMonth,
                            borderBottom: di < w.days.length - 1 ? `1px solid ${borderLight}` : "none",
                            alignItems: "start",
                          }}>
                            <span style={{ fontSize: 12, fontWeight: 600, color: d.project ? PURPLE : textMuted }}>
                              {d.day}
                            </span>
                            <span style={{ fontSize: 13, color: textPrimary, lineHeight: 1.5, paddingRight: 12 }}>
                              {d.topic}
                              {d.project && (
                                <span style={{
                                  marginLeft: 8, fontSize: 9, fontWeight: 700, letterSpacing: "0.08em",
                                  color: PURPLE, background: PURPLE_LIGHT, padding: "2px 6px", borderRadius: 2,
                                  textTransform: "uppercase", verticalAlign: "middle",
                                }}>
                                  Project
                                </span>
                              )}
                            </span>
                            <span style={{ fontSize: 12, color: textLight, lineHeight: 1.5, fontStyle: "italic" }}>
                              {d.build}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export function CurriculumSection() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const { resolvedTheme } = useTheme();
  const isDark = mounted ? resolvedTheme === "dark" : true;

  const bg = isDark ? "#09090b" : "#fff";
  const text = isDark ? "#fafafa" : "#0A0A0A";
  const textMuted = isDark ? "#a1a1aa" : "#555";
  const textLight = isDark ? "#71717a" : "#999";
  const border = isDark ? "#27272a" : "#EBEBEB";
  const bgSection = isDark ? "#18181b" : "#FAFAFA";

  return (
    <section id="curriculum" style={{ background: bg, color: text }}>
      <section style={{ maxWidth: 760, margin: "0 auto", padding: "120px 32px 80px" }}>
        <FadeIn>
          <div style={{
            display: "inline-block",
            fontSize: 11,
            fontWeight: 600,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: PURPLE,
            background: PURPLE_LIGHT,
            padding: "6px 14px",
            borderRadius: 4,
            marginBottom: 32,
          }}>
            Garaad Challenge — 3 Bilood
          </div>
        </FadeIn>

        <FadeIn delay={0.1}>
          <h1 style={{
            fontFamily: "'DM Serif Display', Georgia, serif",
            fontSize: "clamp(40px, 6vw, 68px)",
            lineHeight: 1.1,
            fontWeight: 400,
            letterSpacing: "-0.02em",
            marginBottom: 12,
          }}>
            Ku baro code-ka.<br />
            <span style={{ color: PURPLE }}>Hel shaqo.</span>
          </h1>
          <h1 style={{
            fontFamily: "'DM Serif Display', Georgia, serif",
            fontSize: "clamp(40px, 6vw, 68px)",
            lineHeight: 1.1,
            fontWeight: 400,
            fontStyle: "italic",
            letterSpacing: "-0.02em",
            marginBottom: 32,
            color: textMuted,
          }}>
            Dhis wax aad leedahay.
          </h1>
        </FadeIn>

        <FadeIn delay={0.2}>
          <p style={{ fontSize: 18, lineHeight: 1.7, color: textMuted, maxWidth: 580, marginBottom: 8 }}>
            Garaad waa barnaamij 3-bilood ah oo lagugu barayo MERN stack — oo af Soomaali ah — laga bilaabo eber ilaa aad u diyaar garowdo suuqa shaqada.
          </p>
        </FadeIn>
      </section>

      <section style={{ maxWidth: 760, margin: "0 auto", padding: "0 32px 100px" }}>
        <FadeIn>
          <div style={{ display: "flex", alignItems: "baseline", gap: 16, marginBottom: 48 }}>
            <div style={{ width: 32, height: 1, background: text }} />
            <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: text }}>
              Marka aad dhammayso — waxaad yeelan doontaa
            </p>
          </div>
        </FadeIn>

        <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {outcomes.map((o, i) => (
            <FadeIn key={i} delay={i * 0.08}>
              <div style={{
                display: "grid",
                gridTemplateColumns: "64px 1fr",
                gap: 24,
                padding: "28px 0",
                borderBottom: `1px solid ${border}`,
                borderTop: i === 0 ? `1px solid ${border}` : "none",
              }}>
                <span style={{
                  fontSize: 13,
                  fontWeight: 700,
                  color: isDark ? "#3f3f46" : "#CACACA",
                  fontFamily: "'DM Serif Display', serif",
                  paddingTop: 3,
                }}>
                  {o.num}
                </span>
                <p style={{ fontSize: 17, lineHeight: 1.65, color: text, fontWeight: 400 }}>
                  {o.text}
                </p>
              </div>
            </FadeIn>
          ))}
        </div>
      </section>

      <section style={{ background: bgSection, borderTop: `1px solid ${border}`, borderBottom: `1px solid ${border}` }}>
        <div style={{ maxWidth: 760, margin: "0 auto", padding: "80px 32px" }}>
          <FadeIn>
            <div style={{ display: "flex", alignItems: "baseline", gap: 16, marginBottom: 16 }}>
              <div style={{ width: 32, height: 1, background: text }} />
              <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase" }}>
                Maxaad baranaysaa — toddobaad kasta?
              </p>
            </div>
          </FadeIn>

          <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
            {months.map((m, i) => (
              <FadeIn key={i} delay={i * 0.1}>
                <div style={{
                  display: "grid",
                  gridTemplateColumns: "64px 1fr",
                  gap: 24,
                  padding: "36px 0",
                  borderBottom: i < 2 ? `1px solid ${border}` : "none",
                }}>
                  <div style={{
                    fontSize: 36,
                    fontFamily: "'DM Serif Display', serif",
                    fontWeight: 400,
                    color: isDark ? "#3f3f46" : "#DCDCDC",
                    lineHeight: 1,
                    paddingTop: 4,
                  }}>
                    {m.num}
                  </div>
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
                      <span style={{
                        fontSize: 11,
                        fontWeight: 600,
                        letterSpacing: "0.06em",
                        color: PURPLE,
                        background: PURPLE_LIGHT,
                        padding: "2px 8px",
                        borderRadius: 3,
                      }}>
                        {m.title}
                      </span>
                    </div>
                    <p style={{ fontSize: 16, lineHeight: 1.65, color: text }}>
                      {m.text}
                    </p>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      <section style={{ maxWidth: 900, margin: "0 auto", padding: "80px 32px" }}>
        <FadeIn>
          <div style={{ display: "flex", alignItems: "baseline", gap: 16, marginBottom: 16 }}>
            <div style={{ width: 32, height: 1, background: text }} />
            <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase" }}>
              Jadwalka Maalinlaha — 60 Maalin · 12 Toddobaad
            </p>
          </div>
          <p style={{ fontSize: 13, color: textMuted, marginBottom: 48, paddingLeft: 48, fontStyle: "italic" }}>
            Jadwalka maalinlaha — fdho month kasta, fdho week kasta si aad u aragto dhammaan casharada
          </p>
        </FadeIn>
        <FadeIn delay={0.1}>
          <Timesheet isDark={isDark} />
        </FadeIn>
      </section>

      <section style={{ maxWidth: 760, margin: "0 auto", padding: "96px 32px" }}>
        <FadeIn>
          <div style={{ display: "flex", alignItems: "baseline", gap: 16, marginBottom: 40 }}>
            <div style={{ width: 32, height: 1, background: text }} />
            <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase" }}>
              Run ahaan — shaqadani waa mid adag
            </p>
          </div>
        </FadeIn>

        <FadeIn delay={0.1}>
          <p style={{
            fontFamily: "'DM Serif Display', serif",
            fontSize: "clamp(24px, 4vw, 36px)",
            lineHeight: 1.35,
            fontWeight: 400,
            letterSpacing: "-0.01em",
            color: text,
            marginBottom: 28,
            maxWidth: 620,
          }}>
            Ma aha koorso aad iska daawanayso. Maalin kasta waxaad dhisaysaa wax dhab ah. Toddobaad kasta waxaad code-ka push u garaysaa GitHub.
          </p>
        </FadeIn>

        <FadeIn delay={0.15}>
          <p style={{ fontSize: 16, lineHeight: 1.75, color: textMuted, marginBottom: 16, maxWidth: 560 }}>
            3-da bilood waxay u baahan tahay <strong style={{ color: text }}>2–3 saacadood maalin kasta.</strong> Haddaad dadaalkaas geliso — dhamaadka waxaad haysataa xirfado, portfolio, iyo khibrad aadan meel kale ka helayn.
          </p>
        </FadeIn>
      </section>

      <section style={{ borderTop: `1px solid ${border}`, background: bgSection }}>
        <div style={{ maxWidth: 760, margin: "0 auto", padding: "80px 32px", textAlign: "center" }}>
          <FadeIn>
            <p style={{
              fontFamily: "'DM Serif Display', serif",
              fontSize: "clamp(28px, 4vw, 40px)",
              fontWeight: 400,
              letterSpacing: "-0.01em",
              marginBottom: 12,
            }}>
              Bilow Hadda
            </p>
            <p style={{ fontSize: 15, color: textLight, marginBottom: 36 }}>
              Kaliya 10 arday cohort kasta — boosasku waa xaddidan yihiin.
            </p>
            <Link href="/welcome" style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              background: PURPLE,
              color: "#fff",
              border: "none",
              padding: "16px 40px",
              fontSize: 15,
              fontWeight: 600,
              borderRadius: 6,
              cursor: "pointer",
              letterSpacing: "0.02em",
              transition: "all 0.2s",
              boxShadow: "0 4px 14px rgba(124,58,237,0.2)",
              textDecoration: "none",
            }}>
              Ku biir Challenge-ka
              <ArrowRight size={16} />
            </Link>
            <div style={{ display: "flex", justifyContent: "center", gap: 24, marginTop: 20 }}>
              {["7-bari dammaanad lacag celin ah", "Lacagta waa la soo celin karaa", "Kaliya 10 arday cohort kasta"].map((t, i) => (
                <span key={i} style={{ fontSize: 12, color: textLight, display: "flex", alignItems: "center", gap: 5 }}>
                  <span style={{ color: PURPLE }}>✓</span> {t}
                </span>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>
    </section>
  );
}