"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { useTheme } from "next-themes";

// ─── Hooks ────────────────────────────────────────────────────────────────────
function useInView(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setInView(true); },
      { threshold }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, inView] as const;
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

// ─── Data ─────────────────────────────────────────────────────────────────────
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

// ─── Component ────────────────────────────────────────────────────────────────
export function CurriculumSection() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const { resolvedTheme } = useTheme();
  const isDark = mounted ? resolvedTheme === "dark" : true;

  const PURPLE = "#7C3AED";
  const bg = isDark ? "#09090f" : "#ffffff";
  const bgAlt = isDark ? "#111118" : "#FAFAFA";
  const text = isDark ? "#f4f4f5" : "#0A0A0A";
  const textMuted = isDark ? "#71717a" : "#555555";
  const textFaint = isDark ? "#52525b" : "#999999";
  const borderColor = isDark ? "rgba(255,255,255,0.08)" : "#EBEBEB";
  const numColor = isDark ? "#27272a" : "#CACACA";
  const pillBg = isDark ? "rgba(124,58,237,0.15)" : "#F5F0FF";
  const serif = "var(--font-dm-serif-display), Georgia, serif";
  const sans = "var(--font-inter), 'Helvetica Neue', sans-serif";

  return (
    <div id="curriculum" style={{ fontFamily: sans, background: bg, color: text, transition: "background 0.3s, color 0.3s" }}>

      {/* ── HERO ── */}
      <section style={{ maxWidth: 760, margin: "0 auto", padding: "100px 32px 72px" }}>
        <FadeIn>
          <div style={{
            display: "inline-block",
            fontSize: 11,
            fontWeight: 600,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: PURPLE,
            background: pillBg,
            padding: "6px 14px",
            borderRadius: 4,
            marginBottom: 32,
          }}>
            Garaad Challenge — 3 Bilood
          </div>
        </FadeIn>

        <FadeIn delay={0.1}>
          <h2 style={{
            fontFamily: serif,
            fontSize: "clamp(36px, 6vw, 64px)",
            lineHeight: 1.1,
            fontWeight: 400,
            letterSpacing: "-0.02em",
            marginBottom: 10,
          }}>
            Ku baro code-ka.<br />
            <span style={{ color: PURPLE }}>Hel shaqo.</span>
          </h2>
          <h2 style={{
            fontFamily: serif,
            fontSize: "clamp(36px, 6vw, 64px)",
            lineHeight: 1.1,
            fontWeight: 400,
            fontStyle: "italic",
            letterSpacing: "-0.02em",
            marginBottom: 32,
            color: textMuted,
          }}>
            Dhis wax aad leedahay.
          </h2>
        </FadeIn>

        <FadeIn delay={0.2}>
          <p style={{ fontSize: 18, lineHeight: 1.7, color: textMuted, maxWidth: 580, marginBottom: 8 }}>
            Garaad waa barnaamij 3-bilood ah oo lagugu bara MERN stack —{" "}
            <strong style={{ color: text }}>af Soomaali</strong> — laga bilaabo eber ilaa aad u diyaar tahay suuqa shaqada.
          </p>
          <p style={{ fontSize: 15, lineHeight: 1.6, color: textFaint, maxWidth: 560, fontStyle: "italic" }}>
            A 3-month program teaching MERN stack in Somali — from zero to job-ready.
          </p>
        </FadeIn>
      </section>

      {/* ── OUTCOMES ── */}
      <section style={{ maxWidth: 760, margin: "0 auto", padding: "0 32px 96px" }}>
        <FadeIn>
          <div style={{ display: "flex", alignItems: "baseline", gap: 16, marginBottom: 48 }}>
            <div style={{ width: 32, height: 1, background: text }} />
            <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: text }}>
              Marka aad dhammayso — waxaad yeelan doontaa
            </p>
          </div>
        </FadeIn>

        <div style={{ display: "flex", flexDirection: "column" }}>
          {outcomes.map((o, i) => (
            <FadeIn key={i} delay={i * 0.08}>
              <div style={{
                display: "grid",
                gridTemplateColumns: "64px 1fr",
                gap: 24,
                padding: "28px 0",
                borderBottom: `1px solid ${borderColor}`,
                borderTop: i === 0 ? `1px solid ${borderColor}` : "none",
              }}>
                <span style={{
                  fontSize: 13,
                  fontWeight: 700,
                  color: numColor,
                  fontFamily: serif,
                  paddingTop: 3,
                }}>
                  {o.num}
                </span>
                <div>
                  <p style={{ fontSize: 17, lineHeight: 1.65, color: text, marginBottom: 6, fontWeight: 400 }}>
                    {o.so}
                  </p>
                  <p style={{ fontSize: 14, lineHeight: 1.6, color: textFaint, fontStyle: "italic" }}>
                    {o.en}
                  </p>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* ── WHAT YOU LEARN ── */}
      <section style={{ background: bgAlt, borderTop: `1px solid ${borderColor}`, borderBottom: `1px solid ${borderColor}` }}>
        <div style={{ maxWidth: 760, margin: "0 auto", padding: "80px 32px" }}>
          <FadeIn>
            <div style={{ display: "flex", alignItems: "baseline", gap: 16, marginBottom: 16 }}>
              <div style={{ width: 32, height: 1, background: text }} />
              <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: text }}>
                Maxaad baranaysaa — todobaad kasta?
              </p>
            </div>
            <p style={{ fontSize: 13, color: textFaint, marginBottom: 56, paddingLeft: 48, fontStyle: "italic" }}>
              What you learn — every week
            </p>
          </FadeIn>

          <div style={{ display: "flex", flexDirection: "column" }}>
            {months.map((m, i) => (
              <FadeIn key={i} delay={i * 0.1}>
                <div style={{
                  display: "grid",
                  gridTemplateColumns: "64px 1fr",
                  gap: 24,
                  padding: "36px 0",
                  borderBottom: i < 2 ? `1px solid ${borderColor}` : "none",
                }}>
                  <div style={{
                    fontSize: 36,
                    fontFamily: serif,
                    fontWeight: 400,
                    color: numColor,
                    lineHeight: 1,
                    paddingTop: 4,
                  }}>
                    {m.num}
                  </div>
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8, flexWrap: "wrap" }}>
                      <span style={{ fontSize: 11, color: textFaint, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase" }}>
                        {m.label}
                      </span>
                      <span style={{ width: 3, height: 3, borderRadius: "50%", background: isDark ? "#52525b" : "#CCC", flexShrink: 0 }} />
                      <span style={{
                        fontSize: 11,
                        fontWeight: 600,
                        letterSpacing: "0.06em",
                        color: PURPLE,
                        background: pillBg,
                        padding: "2px 8px",
                        borderRadius: 3,
                      }}>
                        {m.title}
                      </span>
                    </div>
                    <p style={{ fontSize: 12, color: isDark ? "#3f3f46" : "#BBBBBB", letterSpacing: "0.06em", marginBottom: 12, fontWeight: 500 }}>
                      {m.stack}
                    </p>
                    <p style={{ fontSize: 16, lineHeight: 1.65, color: text, marginBottom: 4 }}>
                      {m.so}
                    </p>
                    <p style={{ fontSize: 13, color: textFaint, fontStyle: "italic" }}>
                      {m.en}
                    </p>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── HONESTY ── */}
      <section style={{ maxWidth: 760, margin: "0 auto", padding: "96px 32px" }}>
        <FadeIn>
          <div style={{ display: "flex", alignItems: "baseline", gap: 16, marginBottom: 40 }}>
            <div style={{ width: 32, height: 1, background: text }} />
            <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: text }}>
              Run ahaan — this is hard work
            </p>
          </div>
        </FadeIn>

        <FadeIn delay={0.1}>
          <p style={{
            fontFamily: serif,
            fontSize: "clamp(22px, 4vw, 34px)",
            lineHeight: 1.35,
            fontWeight: 400,
            letterSpacing: "-0.01em",
            color: text,
            marginBottom: 28,
            maxWidth: 620,
          }}>
            Ma aha koorso aad daawanayso. Maalin kasta waxaad dhisaysaa wax. Todobaad kasta waxaad push garayso GitHub.
          </p>
        </FadeIn>

        <FadeIn delay={0.15}>
          <p style={{ fontSize: 16, lineHeight: 1.75, color: textMuted, marginBottom: 16, maxWidth: 560 }}>
            3-da bilood waxay u baahan tahay <strong style={{ color: text }}>2–3 saacadood maalin kasta.</strong> Haddaad taas gashid — dhamaadka waxaad haysataa xirfado, portfolio, iyo khibrad aadan ka helin meel kale.
          </p>
          <p style={{ fontSize: 14, lineHeight: 1.7, color: textFaint, fontStyle: "italic", maxWidth: 520 }}>
            3 months requires 2–3 hours per day. If you put that in — by the end you have skills, a portfolio, and experience you won't find anywhere else.
          </p>
        </FadeIn>
      </section>

      {/* ── CTA ── */}
      <section style={{ borderTop: `1px solid ${borderColor}`, background: bgAlt }}>
        <div style={{ maxWidth: 760, margin: "0 auto", padding: "80px 32px", textAlign: "center" }}>
          <FadeIn>
            <p style={{
              fontFamily: serif,
              fontSize: "clamp(26px, 4vw, 40px)",
              fontWeight: 400,
              letterSpacing: "-0.01em",
              marginBottom: 12,
              color: text,
            }}>
              Bilow Hadda
            </p>
            <p style={{ fontSize: 15, color: textFaint, marginBottom: 36 }}>
              Kaliya 10 arday cohort kasta — seats way xaddidan yihiin.
            </p>
            <Link
              href="/welcome"
              style={{
                display: "inline-block",
                background: PURPLE,
                color: "#fff",
                padding: "16px 40px",
                fontSize: 15,
                fontWeight: 600,
                borderRadius: 6,
                textDecoration: "none",
                letterSpacing: "0.02em",
                boxShadow: "0 4px 14px rgba(124,58,237,0.25)",
                transition: "all 0.2s",
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLAnchorElement).style.background = "#6D28D9";
                (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(-1px)";
                (e.currentTarget as HTMLAnchorElement).style.boxShadow = "0 8px 24px rgba(124,58,237,0.3)";
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLAnchorElement).style.background = PURPLE;
                (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(0)";
                (e.currentTarget as HTMLAnchorElement).style.boxShadow = "0 4px 14px rgba(124,58,237,0.25)";
              }}
            >
              Ku biir Challenge-ka →
            </Link>
            <div style={{ display: "flex", justifyContent: "center", gap: 24, marginTop: 20, flexWrap: "wrap" }}>
              {["7-bari dammaanad lacag celin ah", "Lacagta waa la soo celin karaa", "Kaliya 10 arday cohort kasta"].map((t, i) => (
                <span key={i} style={{ fontSize: 12, color: textFaint, display: "flex", alignItems: "center", gap: 5 }}>
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
