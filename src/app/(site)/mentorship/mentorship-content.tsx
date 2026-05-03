"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { CurriculumSection } from "@/components/landing/CurriculumSection";
import { TestimonialsSection } from "@/components/landing/TestimonialsSection";
import { OurStorySection } from "@/components/landing/OurStorySection";
import { WhatsAppFloat } from "@/components/landing/WhatsAppFloat";
import { CohortStatusBanner } from "@/components/CohortStatusBanner";
import { useTheme } from "next-themes";
import { useState, useEffect } from "react";

const PURPLE = "#7C3AED";

function MentorshipHero() {
    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);
    const { resolvedTheme } = useTheme();
    const isDark = mounted ? resolvedTheme === "dark" : true;

    const bg = isDark ? "#09090b" : "#fff";
    const text = isDark ? "#fafafa" : "#0A0A0A";
    const textMuted = isDark ? "#a1a1aa" : "#555";

    return (
        <section style={{
            background: bg,
            color: text,
            position: "relative",
            overflow: "hidden",
            padding: "80px 32px 60px",
        }}>
            <div style={{
                position: "relative",
                maxWidth: 760,
                margin: "0 auto",
                textAlign: "center",
            }}>
                <div style={{
                    display: "inline-block",
                    fontSize: 11,
                    fontWeight: 600,
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    color: PURPLE,
                    background: isDark ? "#1e1e24" : "#F5F0FF",
                    padding: "6px 14px",
                    borderRadius: 4,
                    marginBottom: 24,
                }}>
                    Baro Software Developer & AI
                </div>

                <h1 style={{
                    fontFamily: "'DM Serif Display', Georgia, serif",
                    fontSize: "clamp(44px, 7vw, 72px)",
                    lineHeight: 1.05,
                    fontWeight: 400,
                    letterSpacing: "-0.02em",
                    marginBottom: 20,
                }}>
                    Baro code.<br />
                    <span style={{ color: PURPLE }}>Hel shaqo.</span>
                </h1>

                <p style={{
                    fontSize: 18,
                    lineHeight: 1.6,
                    color: textMuted,
                    maxWidth: 480,
                    margin: "0 auto 32px"
                }}>
                    Barnaamij 3-bilood ah oo lagugu barayo Software Dev & AI — af Soomaali. Ka bilaabo eber ilaa aad shaqo hesho.
                </p>

                <div style={{ display: "flex", justifyContent: "center", gap: 16, flexWrap: "wrap" }}>
                    <Link href="/welcome" 
                        onClick={() => localStorage.setItem('garaad_signup_referrer', 'mentorship')}
                        style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 8,
                            background: PURPLE,
                            color: "#fff",
                            border: "none",
                            padding: "14px 32px",
                            fontSize: 14,
                            fontWeight: 600,
                            borderRadius: 6,
                            cursor: "pointer",
                            letterSpacing: "0.02em",
                            transition: "all 0.2s",
                            boxShadow: "0 4px 14px rgba(124,58,237,0.2)",
                            textDecoration: "none",
                        }}
                    >
                        Ku biir Challenge-ka
                        <ArrowRight size={16} />
                    </Link>
                    <Link href="/mentorship#curriculum" style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 8,
                        background: "transparent",
                        color: text,
                        border: `1px solid ${isDark ? "#3f3f46" : "#E8E8E8"}`,
                        padding: "14px 32px",
                        fontSize: 14,
                        fontWeight: 500,
                        borderRadius: 6,
                        cursor: "pointer",
                        letterSpacing: "0.02em",
                        transition: "all 0.2s",
                        textDecoration: "none",
                    }}>
                        Arag manhajka
                    </Link>
                </div>
            </div>
        </section>
    );
}

export function MentorshipContent() {
    return (
        <main className="min-h-screen bg-background text-foreground">
            <CohortStatusBanner />
            <MentorshipHero />
            <CurriculumSection />
            <TestimonialsSection />
            <OurStorySection 
                className="py-12 md:py-16" 
                innerClassName="px-3 sm:px-4 md:px-6 lg:px-8" 
            />
            <WhatsAppFloat />
        </main>
    );
}