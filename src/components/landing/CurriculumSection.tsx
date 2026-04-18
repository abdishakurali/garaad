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
    so: "Shan mashruuc oo dhab ah oo GitHub-kaaga ku jira — mid kasta oo aad u samaystay oo aad sharrixi kartaa interview-ka.",
    en: "Five real projects on your GitHub — each one you built yourself and can explain in an interview.",
  },
  {
    num: "02",
    so: "App full-stack ah oo deployed — frontend, backend, database, iyo login system — URL dhab ah oo aad tusi kartid.",
    en: "A deployed full stack app — frontend, backend, database, and login system — with a real URL you can show anyone.",
  },
  {
    num: "03",
    so: "SaaS product aad la tegi kartid macaamiisha ama isticmaalayaasha — oo leh AI integration iyo Stripe payments.",
    en: "A SaaS product you can take to customers or users — with AI integration and Stripe payments.",
  },
  {
    num: "04",
    so: "CV, LinkedIn, iyo portfolio diyaar u ah codsiga shaqada — oo leh xirfadaha suuqa shaqadu u baahan yahay.",
    en: "A CV, LinkedIn, and portfolio ready for job applications — with the skills the market actually needs.",
  },
];

const timesheet = [
  {
    month: "Bishii 1aad — Aasaaska",
    monthEn: "Month 1 — Foundations",
    stack: "HTML · CSS · JavaScript · React",
    weeks: [
      {
        week: "Toddobaadka 1", weekEn: "Week 1",
        days: [
          { day: "Isniin", topic: "Welcome & Setup — VS Code, Git, GitHub", build: "Dev environment ready, first commit" },
          { day: "Talaado", topic: "HTML Foundations — tags, structure, semantic HTML", build: "Personal profile page" },
          { day: "Arbaco", topic: "CSS Foundations — box model, flexbox, colors", build: "Style your profile page" },
          { day: "Khamiis", topic: "CSS Layouts — Grid, responsive, media queries", build: "Responsive 2-column layout" },
          { day: "Jimce", topic: "Project — Personal Portfolio Page", build: "Complete portfolio pushed to GitHub", project: true },
        ]
      },
      {
        week: "Toddobaadka 2", weekEn: "Week 2",
        days: [
          { day: "Isniin", topic: "JavaScript Basics — variables, types, functions", build: "Simple calculator in the browser" },
          { day: "Talaado", topic: "JavaScript Logic — conditions, loops, arrays", build: "To-do list logic" },
          { day: "Arbaco", topic: "DOM Manipulation — select, change, events", build: "Interactive to-do list" },
          { day: "Khamiis", topic: "Async JavaScript — fetch, promises, async/await", build: "Fetch data from a public API" },
          { day: "Jimce", topic: "Project — JavaScript Weather App", build: "Weather app using a real API", project: true },
        ]
      },
      {
        week: "Toddobaadka 3", weekEn: "Week 3",
        days: [
          { day: "Isniin", topic: "React Intro — why React, components, JSX", build: "First React component" },
          { day: "Talaado", topic: "Props & State — useState hook", build: "Counter and dynamic card component" },
          { day: "Arbaco", topic: "React Lists & Events — map, onClick, forms", build: "Dynamic list with add/remove" },
          { day: "Khamiis", topic: "useEffect & API calls in React", build: "Fetch and display API data in React" },
          { day: "Jimce", topic: "React Router — multiple pages, navigation", build: "Multi-page React app with Navbar" },
        ]
      },
      {
        week: "Toddobaadka 4 — Build Week", weekEn: "Week 4 — Build Week",
        days: [
          { day: "Isniin", topic: "Global State — useContext", build: "Theme toggle using Context" },
          { day: "Talaado", topic: "Build Day 1 — Idea, planning, GitHub setup", build: "Project idea defined, repo created", project: true },
          { day: "Arbaco", topic: "Build Day 2 — Core UI components", build: "Navbar, pages, props working", project: true },
          { day: "Khamiis", topic: "Build Day 3 — State, API, polish", build: "Data fetching, global state, responsive", project: true },
          { day: "Jimce", topic: "Demo Day — Present your frontend project", build: "Live demo, GitHub published", project: true },
        ]
      },
    ]
  },
  {
    month: "Bishii 2aad — Full-Stack",
    monthEn: "Month 2 — Full-Stack",
    stack: "Node.js · Express · MongoDB · Auth",
    weeks: [
      {
        week: "Toddobaadka 5", weekEn: "Week 5",
        days: [
          { day: "Isniin", topic: "Node.js Intro — what is a server, how Node works", build: "First Node.js script" },
          { day: "Talaado", topic: "Express Basics — routes, requests, responses", build: "Express server with 3 routes" },
          { day: "Arbaco", topic: "REST API Design — GET, POST, PUT, DELETE", build: "Full CRUD API" },
          { day: "Khamiis", topic: "Middleware — validation, error handling", build: "Middleware added to Express API" },
          { day: "Jimce", topic: "Project — REST API for a real use case", build: "Working API pushed to GitHub", project: true },
        ]
      },
      {
        week: "Toddobaadka 6", weekEn: "Week 6",
        days: [
          { day: "Isniin", topic: "MongoDB Intro — databases, collections, documents", build: "MongoDB connected to Node app" },
          { day: "Talaado", topic: "Mongoose — schemas, models, validation", build: "User model with Mongoose" },
          { day: "Arbaco", topic: "CRUD with MongoDB — save, find, update, delete", build: "API reads/writes to real database" },
          { day: "Khamiis", topic: "Connect Frontend to Backend", build: "React app displays data from your own API" },
          { day: "Jimce", topic: "Project — Full Stack App (no auth yet)", build: "Frontend + backend + database connected", project: true },
        ]
      },
      {
        week: "Toddobaadka 7 — Authentication", weekEn: "Week 7 — Authentication",
        days: [
          { day: "Isniin", topic: "Auth Part 1 — register, hash passwords (bcrypt)", build: "User registration endpoint" },
          { day: "Talaado", topic: "Auth Part 2 — login, JWT tokens", build: "Login endpoint returning JWT" },
          { day: "Arbaco", topic: "Protected Routes — verify JWT middleware", build: "Routes only accessible when logged in" },
          { day: "Khamiis", topic: "Auth in React — store token, login/logout UI", build: "Login form connected to backend" },
          { day: "Jimce", topic: "Project — Add Auth to full stack app", build: "App has working register and login", project: true },
        ]
      },
      {
        week: "Toddobaadka 8 — Deploy", weekEn: "Week 8 — Deploy",
        days: [
          { day: "Isniin", topic: "Polish & Debug — code review, error handling", build: "App is stable, no major bugs" },
          { day: "Talaado", topic: "Deploy Backend — Railway / Render", build: "Backend live on the internet" },
          { day: "Arbaco", topic: "Deploy Frontend — Vercel, environment variables", build: "Frontend live on the internet" },
          { day: "Khamiis", topic: "Final polish, README, demo prep", build: "App fully deployed and documented", project: true },
          { day: "Jimce", topic: "Demo Day — Present your full stack app", build: "Live demo, deployed URL shared", project: true },
        ]
      },
    ]
  },
  {
    month: "Bishii 3aad — SaaS & AI",
    monthEn: "Month 3 — SaaS & AI",
    stack: "Next.js · AI Integration · Stripe · Deploy",
    weeks: [
      {
        week: "Toddobaadka 9", weekEn: "Week 9",
        days: [
          { day: "Isniin", topic: "Next.js Intro — pages, routing, why Next.js", build: "First Next.js app running" },
          { day: "Talaado", topic: "Next.js Data Fetching — SSR, SSG, API routes", build: "Page that fetches data server-side" },
          { day: "Arbaco", topic: "SaaS Planning — idea, audience, revenue model", build: "SaaS idea defined and documented" },
          { day: "Khamiis", topic: "SaaS Architecture — structure, database, auth plan", build: "Project structure created on GitHub" },
          { day: "Jimce", topic: "Project — SaaS MVP skeleton", build: "Next.js app with routing and layout", project: true },
        ]
      },
      {
        week: "Toddobaadka 10", weekEn: "Week 10",
        days: [
          { day: "Isniin", topic: "AI Integration — Claude / OpenAI API basics", build: "First AI-powered feature working" },
          { day: "Talaado", topic: "AI in your SaaS — integrate into your product", build: "AI feature inside your own app" },
          { day: "Arbaco", topic: "Payments — Stripe setup, checkout, subscriptions", build: "Stripe checkout working" },
          { day: "Khamiis", topic: "User Dashboard — show user data, account page", build: "Dashboard for logged-in users" },
          { day: "Jimce", topic: "Project — Core SaaS features complete", build: "Auth + AI + payments working", project: true },
        ]
      },
      {
        week: "Toddobaadka 11", weekEn: "Week 11",
        days: [
          { day: "Isniin", topic: "Polish — UI/UX, mobile responsive", build: "App looks professional on all screens" },
          { day: "Talaado", topic: "Performance & Security — env variables, rate limiting", build: "App is secure and production-ready" },
          { day: "Arbaco", topic: "Deploy SaaS — Vercel + production database", build: "SaaS live on real domain" },
          { day: "Khamiis", topic: "Get First Users — share, get feedback, iterate", build: "At least 1 real person uses your app" },
          { day: "Jimce", topic: "Project — SaaS fully deployed with real users", build: "Real URL, real users, documented", project: true },
        ]
      },
      {
        week: "Toddobaadka 12 — Qalin-jabinta", weekEn: "Week 12 — Graduation",
        days: [
          { day: "Isniin", topic: "Portfolio & GitHub — README, pinned repos", build: "GitHub profile ready to show employers" },
          { day: "Talaado", topic: "Job Prep — CV, LinkedIn, how to apply", build: "CV and LinkedIn updated" },
          { day: "Arbaco", topic: "Freelance Prep — find clients, proposals, pricing", build: "First freelance profile or proposal" },
          { day: "Khamiis", topic: "Final Demo Prep — rehearse, slides, README", build: "Demo polished and rehearsed", project: true },
          { day: "Jimce", topic: "QALIN-JABINTA — Final Demo & Certificate", build: "Present SaaS + portfolio to audience", project: true },
        ]
      },
    ]
  },
];

const months = [
  {
    num: "01",
    label: "Bishii 1aad",
    title: "Aasaaska",
    stack: "HTML · CSS · JavaScript · React",
    so: "Aasaaska. Ku dhammaanaysaa mashruuc frontend ah oo aad dhistay.",
    en: "Foundations. You finish with a frontend project you built yourself.",
  },
  {
    num: "02",
    label: "Bishii 2aad",
    title: "Full-Stack",
    stack: "Node.js · Express · MongoDB · Auth",
    so: "Full stack. Ku dhammaanaysaa app aad deployed garayso.",
    en: "Full stack. You finish with a deployed app.",
  },
  {
    num: "03",
    label: "Bishii 3aad",
    title: "SaaS & AI",
    stack: "Next.js · AI Integration · Stripe · Deploy",
    so: "SaaS. Ku dhammaanaysaa wax soo saar dhab ah oo leh isticmaalayaal.",
    en: "SaaS. You finish with a real product with real users.",
  },
];

function Timesheet() {
  const [openMonth, setOpenMonth] = useState<number | null>(null);
  const [openWeeks, setOpenWeeks] = useState<Record<string, boolean>>({});

  function toggleMonth(i: number) {
    setOpenMonth(openMonth === i ? null : i);
    setOpenWeeks({});
  }

  function toggleWeek(key: string) {
    setOpenWeeks(prev => ({ ...prev, [key]: !prev[key] }));
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
      {timesheet.map((m, mi) => (
        <div key={mi} style={{ border: "1px solid #E8E8E8", borderRadius: 8, overflow: "hidden" }}>
          <button
            onClick={() => toggleMonth(mi)}
            style={{
              width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between",
              padding: "20px 24px", background: openMonth === mi ? "#FAFAFA" : "#fff",
              border: "none", cursor: "pointer", textAlign: "left", transition: "background 0.2s",
              fontFamily: "inherit",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <span style={{
                fontSize: 11, fontWeight: 700, letterSpacing: "0.1em",
                color: PURPLE, background: PURPLE_LIGHT, padding: "3px 10px", borderRadius: 3,
              }}>
                {m.monthEn.split("—")[0].trim()}
              </span>
              <div>
                <span style={{ fontSize: 15, fontWeight: 600, color: "#0A0A0A" }}>{m.month}</span>
                <span style={{ fontSize: 12, color: "#AAA", marginLeft: 10, letterSpacing: "0.05em" }}>{m.stack}</span>
              </div>
            </div>
            <span style={{
              fontSize: 18, color: "#999", transform: openMonth === mi ? "rotate(180deg)" : "rotate(0deg)",
              transition: "transform 0.25s", lineHeight: 1,
            }}>
              ↓
            </span>
          </button>

          {openMonth === mi && (
            <div style={{ borderTop: "1px solid #F0F0F0", padding: "8px 0" }}>
              {m.weeks.map((w, wi) => {
                const weekKey = `${mi}-${wi}`;
                const isOpen = openWeeks[weekKey];
                return (
                  <div key={wi} style={{ borderBottom: wi < m.weeks.length - 1 ? "1px solid #F5F5F5" : "none" }}>
                    <button
                      onClick={() => toggleWeek(weekKey)}
                      style={{
                        width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between",
                        padding: "14px 24px 14px 40px", background: isOpen ? "#F9F7FF" : "transparent",
                        border: "none", cursor: "pointer", textAlign: "left", fontFamily: "inherit",
                        transition: "background 0.15s",
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        <span style={{ width: 6, height: 6, borderRadius: "50%", background: isOpen ? PURPLE : "#DDD", transition: "background 0.2s" }} />
                        <span style={{ fontSize: 13, fontWeight: 600, color: "#333" }}>{w.week}</span>
                        <span style={{ fontSize: 12, color: "#BBB", fontStyle: "italic" }}>{w.weekEn}</span>
                      </div>
                      <span style={{ fontSize: 12, color: "#BBB" }}>{isOpen ? "−" : "+"} {w.days.length} maalin</span>
                    </button>

                    {isOpen && (
                      <div style={{ margin: "0 24px 12px 40px", borderRadius: 6, overflow: "hidden", border: "1px solid #EEEEEE" }}>
                        <div style={{
                          display: "grid", gridTemplateColumns: "80px 1fr 1fr",
                          background: "#F5F5F5", padding: "8px 14px",
                          borderBottom: "1px solid #EEEEEE",
                        }}>
                          {["Maalinta", "Topic", "Waxaad Dhisaysaa"].map((h, hi) => (
                            <span key={hi} style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", color: "#AAA", textTransform: "uppercase" }}>
                              {h}
                            </span>
                          ))}
                        </div>
                        {w.days.map((d, di) => (
                          <div key={di} style={{
                            display: "grid", gridTemplateColumns: "80px 1fr 1fr",
                            padding: "10px 14px",
                            background: d.project ? "#FDFBFF" : "#FFFFFF",
                            borderBottom: di < w.days.length - 1 ? "1px solid #F5F5F5" : "none",
                            alignItems: "start",
                          }}>
                            <span style={{ fontSize: 12, fontWeight: 600, color: d.project ? PURPLE : "#555" }}>
                              {d.day}
                            </span>
                            <span style={{ fontSize: 13, color: "#222", lineHeight: 1.5, paddingRight: 12 }}>
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
                            <span style={{ fontSize: 12, color: "#888", lineHeight: 1.5, fontStyle: "italic" }}>
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

  return (
    <div style={{ fontFamily: "'DM Sans', 'Helvetica Neue', sans-serif", background: isDark ? "#09090b" : "#fff", color: isDark ? "#fafafa" : "#0A0A0A" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,700;1,9..40,300&family=DM+Serif+Display:ital@0;1&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::selection { background: #EDE9FE; }
        .outcome-card:hover { border-color: #7C3AED !important; }
        .month-card:hover .month-num { color: #7C3AED !important; }
        .cta-btn:hover { background: #6D28D9 !important; transform: translateY(-1px); box-shadow: 0 8px 24px rgba(124,58,237,0.25) !important; }
      `}</style>

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
            color: isDark ? "#a1a1aa" : "#444",
          }}>
            Dhis wax aad leedahay.
          </h1>
        </FadeIn>

        <FadeIn delay={0.2}>
          <p style={{ fontSize: 18, lineHeight: 1.7, color: isDark ? "#a1a1aa" : "#555", maxWidth: 580, marginBottom: 8 }}>
            Garaad waa barnaamij 3-bilood ah oo lagugu bara MERN stack — <strong style={{ color: isDark ? "#fff" : "#0A0A0A" }}>af Soomaali</strong> — laga bilaabo eber ilaa aad u diyaar tahay suuqa shaqada.
          </p>
          <p style={{ fontSize: 15, lineHeight: 1.6, color: isDark ? "#71717a" : "#999", maxWidth: 560 }}>
            A 3-month program teaching MERN stack in Somali — from zero to job-ready.
          </p>
        </FadeIn>
      </section>

      <section style={{ maxWidth: 760, margin: "0 auto", padding: "0 32px 100px" }}>
        <FadeIn>
          <div style={{ display: "flex", alignItems: "baseline", gap: 16, marginBottom: 48 }}>
            <div style={{ width: 32, height: 1, background: isDark ? "#fff" : "#0A0A0A" }} />
            <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: isDark ? "#fff" : "#0A0A0A" }}>
              Marka aad dhammayso — waxaad yeelan doontaa
            </p>
          </div>
        </FadeIn>

        <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {outcomes.map((o, i) => (
            <FadeIn key={i} delay={i * 0.08}>
              <div className="outcome-card" style={{
                display: "grid",
                gridTemplateColumns: "64px 1fr",
                gap: 24,
                padding: "28px 0",
                borderBottom: "1px solid #EBEBEB",
                borderTop: i === 0 ? "1px solid #EBEBEB" : "none",
                transition: "border-color 0.2s",
                cursor: "default",
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
                <div>
                  <p style={{ fontSize: 17, lineHeight: 1.65, color: isDark ? "#fafafa" : "#0A0A0A", marginBottom: 6, fontWeight: 400 }}>
                    {o.so}
                  </p>
                  <p style={{ fontSize: 14, lineHeight: 1.6, color: isDark ? "#a1a1aa" : "#999", fontStyle: "italic" }}>
                    {o.en}
                  </p>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </section>

      <section style={{ background: isDark ? "#18181b" : "#FAFAFA", borderTop: "1px solid #27272a", borderBottom: "1px solid #27272a" }}>
        <div style={{ maxWidth: 760, margin: "0 auto", padding: "80px 32px" }}>
          <FadeIn>
            <div style={{ display: "flex", alignItems: "baseline", gap: 16, marginBottom: 16 }}>
              <div style={{ width: 32, height: 1, background: isDark ? "#fff" : "#0A0A0A" }} />
              <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase" }}>
                Maxaad baranaysaa — todobaad kasta?
              </p>
            </div>
            <p style={{ fontSize: 13, color: isDark ? "#a1a1aa" : "#999", marginBottom: 56, paddingLeft: 48, fontStyle: "italic" }}>
              What you learn — every week
            </p>
          </FadeIn>

          <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
            {months.map((m, i) => (
              <FadeIn key={i} delay={i * 0.1}>
                <div className="month-card" style={{
                  display: "grid",
                  gridTemplateColumns: "64px 1fr",
                  gap: 24,
                  padding: "36px 0",
                  borderBottom: i < 2 ? "1px solid #27272a" : "none",
                }}>
                  <div className="month-num" style={{
                    fontSize: 36,
                    fontFamily: "'DM Serif Display', serif",
                    fontWeight: 400,
                    color: isDark ? "#3f3f46" : "#DCDCDC",
                    lineHeight: 1,
                    transition: "color 0.2s",
                    paddingTop: 4,
                  }}>
                    {m.num}
                  </div>
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
                      <span style={{ fontSize: 11, color: isDark ? "#a1a1aa" : "#999", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase" }}>
                        {m.label}
                      </span>
                      <span style={{ width: 3, height: 3, borderRadius: "50%", background: isDark ? "#52525b" : "#CCC" }} />
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
                    <p style={{ fontSize: 12, color: isDark ? "#71717a" : "#BBBBBB", letterSpacing: "0.06em", marginBottom: 12, fontWeight: 500 }}>
                      {m.stack}
                    </p>
                    <p style={{ fontSize: 16, lineHeight: 1.65, color: isDark ? "#fafafa" : "#0A0A0A", marginBottom: 4 }}>
                      {m.so}
                    </p>
                    <p style={{ fontSize: 13, color: isDark ? "#a1a1aa" : "#999", fontStyle: "italic" }}>
                      {m.en}
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
            <div style={{ width: 32, height: 1, background: isDark ? "#fff" : "#0A0A0A" }} />
            <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase" }}>
              Jadwalka Maalinlaha — 60 Maalin · 12 Todobaad
            </p>
          </div>
          <p style={{ fontSize: 13, color: isDark ? "#a1a1aa" : "#999", marginBottom: 48, paddingLeft: 48, fontStyle: "italic" }}>
            Day-by-day schedule — click a month, then a week to see every lesson
          </p>
        </FadeIn>
        <FadeIn delay={0.1}>
          <Timesheet />
        </FadeIn>
      </section>

      <section style={{ maxWidth: 760, margin: "0 auto", padding: "96px 32px" }}>
        <FadeIn>
          <div style={{ display: "flex", alignItems: "baseline", gap: 16, marginBottom: 40 }}>
            <div style={{ width: 32, height: 1, background: isDark ? "#fff" : "#0A0A0A" }} />
            <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase" }}>
              Run ahaan — this is hard work
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
            color: isDark ? "#fafafa" : "#0A0A0A",
            marginBottom: 28,
            maxWidth: 620,
          }}>
            Ma aha koorso aad daawanayso. Maalin kasta waxaad dhisaysaa wax. Todobaad kasta waxaad push garayso GitHub.
          </p>
        </FadeIn>

        <FadeIn delay={0.15}>
          <p style={{ fontSize: 16, lineHeight: 1.75, color: isDark ? "#a1a1aa" : "#555", marginBottom: 16, maxWidth: 560 }}>
            3-da bilood waxay u baahan tahay <strong style={{ color: isDark ? "#fff" : "#0A0A0A" }}>2–3 saacadood maalin kasta.</strong> Haddaad taas gashid — dhamaadka waxaad haysataa xirfado, portfolio, iyo khibrad aadan ka helin meel kale.
          </p>
          <p style={{ fontSize: 14, lineHeight: 1.7, color: isDark ? "#71717a" : "#AAA", fontStyle: "italic", maxWidth: 520 }}>
            3 months requires 2–3 hours per day. If you put that in — by the end you have skills, a portfolio, and experience you won&apos;t find anywhere else.
          </p>
        </FadeIn>
      </section>

      <section style={{
        borderTop: "1px solid #27272a",
        background: isDark ? "#18181b" : "#FAFAFA",
      }}>
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
            <p style={{ fontSize: 15, color: isDark ? "#71717a" : "#888", marginBottom: 36 }}>
              Kaliya 10 arday cohort kasta — seats way xaddidan yihiin.
            </p>
            <Link href="/welcome" className="cta-btn" style={{
              display: "inline-block",
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
              Ku biir Challenge-ka →
            </Link>
            <div style={{ display: "flex", justifyContent: "center", gap: 24, marginTop: 20 }}>
              {["7-bari dammaanad lacag celin ah", "Lacagta waa la soo celin karaa", "Kaliya 10 arday cohort kasta"].map((t, i) => (
                <span key={i} style={{ fontSize: 12, color: isDark ? "#52525b" : "#AAA", display: "flex", alignItems: "center", gap: 5 }}>
                  <span style={{ color: PURPLE }}>✓</span> {t}
                </span>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>
    </div>
  );
}