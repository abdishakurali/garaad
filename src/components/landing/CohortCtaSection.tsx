"use client";

import Link from "next/link";
import { ArrowRight, Users, Heart, Zap } from "lucide-react";
import { useTheme } from "next-themes";
import { useState, useEffect } from "react";
import { usePostHog } from "posthog-js/react";

const PURPLE = "#7C3AED";

export function CohortCtaSection() {
    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);
    const { resolvedTheme } = useTheme();
    const isDark = mounted ? resolvedTheme === "dark" : true;
    const posthog = usePostHog();

    const bg = isDark ? "#0f0f12" : "#fafafa";
    const text = isDark ? "#fafafa" : "#0A0A0A";
    const textMuted = isDark ? "#a1a1aa" : "#555";
    const textLight = isDark ? "#71717a" : "#999";
    const border = isDark ? "#27272a" : "#EBEBEB";
    const bgCard = isDark ? "#18181b" : "#fff";

    const features = [
        {
            icon: Users,
            title: "Kooxda",
            desc: "10 arday oo kasta — wehel iyo walaaltinnimo",
        },
        {
            icon: Heart,
            title: "Caawin",
            desc: "Isku dayn iyo dhiirigelin joogto ah",
        },
        {
            icon: Zap,
            title: "Kormeer",
            desc: "1-on-1 mentorship maalin kasta",
        },
    ];

    return (
        <section style={{
            background: bg,
            color: text,
            padding: "80px 24px",
            position: "relative",
            overflow: "hidden",
        }}>
            {/* Background pattern */}
            <div style={{
                position: "absolute",
                inset: 0,
                opacity: isDark ? 0.02 : 0.03,
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='20' cy='20' r='1.5' fill='%237C3AED'/%3E%3C/svg%3E")`,
                backgroundSize: "40px 40px",
            }} />

            <div style={{
                position: "relative",
                maxWidth: 1000,
                margin: "0 auto",
                display: "grid",
                gridTemplateColumns: "1fr",
                gap: 48,
            }}>
                {/* Left: Content */}
                <div>
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
                        Community
                    </div>

                    <h2 style={{
                        fontFamily: "'DM Serif Display', Georgia, serif",
                        fontSize: "clamp(32px, 5vw, 48px)",
                        lineHeight: 1.1,
                        fontWeight: 400,
                        marginBottom: 20,
                    }}>
                        Ku Biir Kooxda<br />
                        <span style={{ color: PURPLE }}>Guuleystayaasha</span>
                    </h2>

                    <p style={{
                        fontSize: 17,
                        lineHeight: 1.7,
                        color: textMuted,
                        marginBottom: 36,
                        maxWidth: 480,
                    }}>
                        Hel marin aad kula xiriirto dad hammi leh oo adiga kula mid ah. 
                        Aan si wadajir ah u guuleysanno, u koraan, isuna caawinno. 
                        Waa wehel iyo walaaltinnimo dhab ah.
                    </p>

                    {/* Features */}
                    <div style={{
                        display: "flex",
                        gap: 24,
                        marginBottom: 40,
                        flexWrap: "wrap",
                    }}>
                        {features.map((f, i) => (
                            <div key={i} style={{
                                display: "flex",
                                alignItems: "center",
                                gap: 12,
                            }}>
                                <div style={{
                                    width: 40,
                                    height: 40,
                                    borderRadius: 10,
                                    background: isDark ? "#1e1e24" : "#F5F0FF",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                }}>
                                    <f.icon size={18} style={{ color: PURPLE }} />
                                </div>
                                <div>
                                    <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 2 }}>
                                        {f.title}
                                    </div>
                                    <div style={{ fontSize: 13, color: textMuted }}>
                                        {f.desc}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* CTA */}
                    <Link
                        href="/welcome"
                        onClick={() => posthog?.capture("cohort_cta_clicked", { source: "home_community_section" })}
                        style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 8,
                            background: PURPLE,
                            color: "#fff",
                            border: "none",
                            padding: "14px 28px",
                            fontSize: 14,
                            fontWeight: 600,
                            borderRadius: 6,
                            cursor: "pointer",
                            letterSpacing: "0.02em",
                            transition: "all 0.2s",
                            boxShadow: "0 4px 14px rgba(124,58,237,0.25)",
                            textDecoration: "none",
                        }}
                    >
                        Ku biir Kooxda
                        <ArrowRight size={16} />
                    </Link>
                </div>

                {/* Right: Visual/Image placeholder */}
                <div style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                }}>
                    <div style={{
                        position: "relative",
                        width: "100%",
                        maxWidth: 400,
                        aspectRatio: "1/1",
                        borderRadius: 24,
                        background: isDark ? "linear-gradient(135deg, #1e1e24 0%, #18181b 100%)" : "linear-gradient(135deg, #F5F0FF 0%, #EDE9FE 100%)",
                        border: `1px solid ${border}`,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        padding: 32,
                        overflow: "hidden",
                    }}>
                        {/* Decorative circles */}
                        <div style={{
                            position: "absolute",
                            top: -50,
                            right: -50,
                            width: 150,
                            height: 150,
                            borderRadius: "50%",
                            background: PURPLE,
                            opacity: 0.1,
                        }} />
                        <div style={{
                            position: "absolute",
                            bottom: -30,
                            left: -30,
                            width: 100,
                            height: 100,
                            borderRadius: "50%",
                            background: PURPLE,
                            opacity: 0.15,
                        }} />

                        {/* Avatar stack */}
                        <div style={{ marginBottom: 24 }}>
                            <div style={{
                                display: "flex",
                                justifyContent: "center",
                            }}>
                                {[
                                    { initials: "AA", color: "#10B981" },
                                    { initials: "MA", color: "#8B5CF6" },
                                    { initials: "RR", color: "#F59E0B" },
                                    { initials: "M", color: "#06B6D4" },
                                ].map((avatar, i) => (
                                    <div key={i} style={{
                                        width: 44,
                                        height: 44,
                                        borderRadius: "50%",
                                        background: avatar.color,
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        fontSize: 13,
                                        fontWeight: 700,
                                        color: "#fff",
                                        border: `3px solid ${bgCard}`,
                                        marginLeft: i > 0 ? -12 : 0,
                                        zIndex: 4 - i,
                                    }}>
                                        {avatar.initials}
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div style={{
                            fontFamily: "'DM Serif Display', serif",
                            fontSize: 20,
                            fontWeight: 400,
                            textAlign: "center",
                            marginBottom: 8,
                        }}>
                            97+ developers
                        </div>
                        <div style={{
                            fontSize: 14,
                            color: textMuted,
                            textAlign: "center",
                        }}>
                            oo baranaya hadda
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}