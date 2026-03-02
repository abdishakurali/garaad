"use client";

import { useState, useEffect, useCallback } from "react";
import { useAdminAuthStore } from "@/store/admin/auth";
import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://api.garaad.org";

// ─── helpers ────────────────────────────────────────────────────────────────
const fmtDate = (s: string | null) => s ? new Date(s).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) : "—";
const daysSince = (s: string | null) => {
    if (!s) return null;
    const diff = Date.now() - new Date(s).getTime();
    return Math.floor(diff / 86400000);
};

const TAG_COLORS: Record<string, { bg: string, text: string, dot: string }> = {
    verified: { bg: "#0f2d1a", text: "#22c55e", dot: "#22c55e" },
    premium: { bg: "#1a1228", text: "#a78bfa", dot: "#a78bfa" },
    inactive: { bg: "#2d1a0a", text: "#fb923c", dot: "#fb923c" },
    new: { bg: "#0a1f3d", text: "#60a5fa", dot: "#60a5fa" },
    unverified: { bg: "#2d0f0f", text: "#f87171", dot: "#f87171" },
    sent: { bg: "#111", text: "#888", dot: "#888" },
    opened: { bg: "#0a1f3d", text: "#60a5fa", dot: "#60a5fa" },
    clicked: { bg: "#0f2d1a", text: "#22c55e", dot: "#22c55e" },
    bounced: { bg: "#2d0f0f", text: "#f87171", dot: "#f87171" },
};

const Badge = ({ type, label }: { type: string, label: string }) => {
    const c = TAG_COLORS[type] || TAG_COLORS.verified;
    return (
        <span style={{
            background: c.bg, color: c.text, border: `1px solid ${c.dot}22`,
            borderRadius: 6, padding: "2px 8px", fontSize: 11, fontFamily: "monospace",
            display: "inline-flex", alignItems: "center", gap: 4, whiteSpace: "nowrap"
        }}>
            <span style={{ width: 5, height: 5, borderRadius: "50%", background: c.dot }} />
            {label}
        </span>
    );
};

const StatCard = ({ label, value, sub, color, icon }: { label: string, value: string | number, sub?: string, color: string, icon: string }) => (
    <div style={{
        background: "#0d0d0d", border: `1px solid ${color}22`, borderRadius: 16,
        padding: "18px 22px", position: "relative", overflow: "hidden", transition: "border-color .2s"
    }}
        className="stat-card">
        <div style={{ position: "absolute", top: -16, right: -16, fontSize: 72, opacity: 0.05 }}>{icon}</div>
        <div style={{
            color: "#555", fontSize: 10, fontFamily: "monospace", letterSpacing: 2,
            textTransform: "uppercase", marginBottom: 6
        }}>{label}</div>
        <div style={{ fontSize: 28, fontWeight: 800, color: "#fff", lineHeight: 1 }}>{value}</div>
        {sub && <div style={{ marginTop: 5, fontSize: 12, color, fontFamily: "monospace" }}>{sub}</div>}
    </div>
);

interface MarketingUser {
    id: number;
    email: string;
    first_name: string;
    last_name: string;
    full_name: string | null;
    is_email_verified: boolean;
    is_premium: boolean;
    is_active: boolean;
    date_joined: string;
    last_active: string | null;
}

// ─── main component ──────────────────────────────────────────────────────────
export default function GaraadEmailDashboard() {
    const [users, setUsers] = useState<MarketingUser[]>([]);
    const [loading, setLoading] = useState(true);
    const [tab, setTab] = useState("contacts");
    const [filter, setFilter] = useState("all");
    const [search, setSearch] = useState("");
    const [selected, setSelected] = useState(new Set<string>());
    const [composing, setComposing] = useState(false);
    const [compose, setCompose] = useState({ subject: "", html: "", preview: "" });
    const [sending, setSending] = useState(false);
    const [sendResult, setSendResult] = useState<{ ok: number, fail: number, total: number } | null>(null);

    const { token } = useAdminAuthStore();

    // ── fetch users from Garaad Backend ─────────────────────────────────────
    const loadUsers = useCallback(async () => {
        if (!token) return;
        setLoading(true);
        try {
            const response = await axios.get(`${API_BASE_URL}/api/auth/marketing-users/`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setUsers(response.data);
        } catch (error) {
            console.error("Failed to load marketing users:", error);
        }
        setLoading(false);
    }, [token]);

    useEffect(() => { loadUsers(); }, [loadUsers]);

    // ── fetch resend history: removed — handled by backend ──────────────────

    // ── derived stats ────────────────────────────────────────────────────────
    const total = users.length;
    const verified = users.filter(u => u.is_email_verified).length;
    const premium = users.filter(u => u.is_premium).length;
    const inactive7 = users.filter(u => {
        const d = daysSince(u.last_active);
        return d !== null && d >= 7;
    }).length;
    const newThisWeek = users.filter(u => daysSince(u.date_joined) !== null && (daysSince(u.date_joined) || 0) <= 7).length;

    // ── filtered contacts ────────────────────────────────────────────────────
    const filtered = users.filter(u => {
        const nameStr = u.full_name || `${u.first_name || ""} ${u.last_name || ""}`.trim() || "No Name";
        const matchSearch = search === "" ||
            u.email.toLowerCase().includes(search.toLowerCase()) ||
            nameStr.toLowerCase().includes(search.toLowerCase());
        if (!matchSearch) return false;

        if (filter === "verified") return u.is_email_verified;
        if (filter === "unverified") return !u.is_email_verified;
        if (filter === "premium") return u.is_premium;
        if (filter === "inactive") return (daysSince(u.last_active) || 0) >= 7;
        if (filter === "new") return (daysSince(u.date_joined) || 0) <= 7;
        return true;
    });

    // ── select all / none ────────────────────────────────────────────────────
    const toggleAll = () => {
        if (selected.size === filtered.length) setSelected(new Set());
        else setSelected(new Set(filtered.map(u => u.email)));
    };
    const toggleOne = (email: string) => {
        const s = new Set(selected);
        s.has(email) ? s.delete(email) : s.add(email);
        setSelected(s);
    };

    // ── send bulk email via backend ──────────────────────────────────────────
    const sendBulk = async () => {
        if (selected.size === 0 || !compose.subject) return;
        setSending(true);
        setSendResult(null);
        try {
            const response = await axios.post(
                `${API_BASE_URL}/api/auth/send-campaign/`,
                {
                    recipients: [...selected],
                    subject: compose.subject,
                    html: compose.html || undefined,
                },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            const { sent, failed, total } = response.data;
            setSendResult({ ok: sent, fail: failed, total });
        } catch (err) {
            console.error("Campaign send error:", err);
            setSendResult({ ok: 0, fail: selected.size, total: selected.size });
        }
        setSending(false);
    };

    // ── quick segment buttons ────────────────────────────────────────────────
    const quickSelect = (type: string) => {
        setFilter(type);
        const matches = users.filter(u => {
            if (type === "verified") return u.is_email_verified;
            if (type === "unverified") return !u.is_email_verified;
            if (type === "premium") return u.is_premium;
            if (type === "inactive") return (daysSince(u.last_active) || 0) >= 7;
            if (type === "new") return (daysSince(u.date_joined) || 0) <= 7;
            return true;
        });
        setSelected(new Set(matches.map(u => u.email)));
    };

    // ── no resend stats (removed) ──────────────────────────────────────────

    return (
        <div style={{
            minHeight: "100vh", color: "#fff",
            fontFamily: "'DM Sans',system-ui,sans-serif", padding: "10px 0"
        }}>
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;800&family=DM+Mono:wght@400;500&display=swap');
        .stat-card:hover { border-color: rgba(99, 102, 241, 0.4) !important; }
        .row-hover:hover { background: #f5f7ff !important; }
      `}</style>

            {/* ── Header ──────────────────────────────────────────────────────── */}
            <div style={{
                display: "flex", justifyContent: "space-between", alignItems: "flex-start",
                marginBottom: 24, flexWrap: "wrap", gap: 12
            }}>
                <div>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 2 }}>
                        <div style={{
                            width: 34, height: 34, borderRadius: 10,
                            background: "linear-gradient(135deg,#6366f1,#22c55e)",
                            display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18
                        }}>✉</div>
                        <h1 style={{ margin: 0, fontSize: 22, fontWeight: 800, letterSpacing: -0.5, color: "#1e3a8a" }}>Garaad Mail</h1>
                        <span style={{
                            background: "#0f2d1a", border: "1px solid #22c55e33", borderRadius: 6,
                            padding: "2px 8px", fontSize: 10, color: "#22c55e", fontFamily: "monospace"
                        }}>
                            {verified} VERIFIED USERS
                        </span>
                    </div>
                    <p style={{ margin: 0, color: "#666", fontSize: 12 }}>
                        Email marketing connected to your real Garaad database
                    </p>
                </div>

                <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
                    <button onClick={() => setComposing(true)}
                        style={{
                            background: "linear-gradient(135deg,#10b981,#059669)", border: "none",
                            borderRadius: 10, padding: "8px 18px", color: "#fff", fontSize: 13, fontWeight: 700
                        }}>
                        ＋ New Campaign
                    </button>
                </div>
            </div>

            {/* ── Tabs ────────────────────────────────────────────────────────── */}
            <div style={{
                display: "flex", gap: 4, marginBottom: 24, background: "#fff",
                borderRadius: 12, padding: 4, border: "1px solid #e5e7eb", width: "fit-content"
            }}>
                {[["contacts", "👥 Contacts"], ["analytics", "📊 Analytics"]].map(([id, label]) => (
                    <button key={id} onClick={() => setTab(id)} style={{
                        background: tab === id ? "#eff6ff" : "transparent",
                        border: tab === id ? "1px solid #bfdbfe" : "1px solid transparent",
                        borderRadius: 9, padding: "6px 16px", color: tab === id ? "#1e40af" : "#6b7280",
                        fontSize: 13, fontWeight: 600, transition: "all .15s", cursor: "pointer"
                    }}>{label}</button>
                ))}
            </div>

            {/* ══════════════ CONTACTS TAB ══════════════ */}
            {tab === "contacts" && (
                <>
                    <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap", alignItems: "center" }}>
                        <span style={{ fontSize: 11, color: "#6b7280", fontFamily: "monospace" }}>SELECT SEGMENT:</span>
                        {[
                            ["all", "All Users", total, "#6366f1"],
                            ["verified", "✓ Verified", verified, "#10b881"],
                            ["premium", "★ Premium", premium, "#f59e0b"],
                            ["inactive", "💤 Inactive 7d", inactive7, "#fb923c"],
                            ["new", "🆕 New (7d)", newThisWeek, "#3b82f6"],
                            ["unverified", "✗ Unverified", total - verified, "#ef4444"],
                        ].map(([key, label, count, color]) => (
                            <button key={key} onClick={() => quickSelect(key)}
                                style={{
                                    background: filter === key ? `${color}10` : "#fff",
                                    border: `1px solid ${filter === key ? color : "#e5e7eb"}`,
                                    borderRadius: 10, padding: "6px 14px", color: filter === key ? color : "#6b7280",
                                    fontSize: 12, fontFamily: "monospace", transition: "all .15s",
                                    display: "flex", gap: 6, alignItems: "center", cursor: "pointer"
                                }}>
                                {label}
                                <span style={{
                                    background: filter === key ? `${color}20` : "#f3f4f6",
                                    borderRadius: 5, padding: "1px 6px", fontSize: 10
                                }}>{count}</span>
                            </button>
                        ))}
                    </div>

                    <div style={{ display: "flex", gap: 10, marginBottom: 14, alignItems: "center", flexWrap: "wrap" }}>
                        <input placeholder="🔍 Search by name or email..."
                            value={search} onChange={e => setSearch(e.target.value)}
                            style={{
                                background: "#fff", border: "1px solid #e5e7eb", borderRadius: 10,
                                padding: "8px 14px", color: "#000", fontSize: 13, width: 280
                            }} />
                        {selected.size > 0 && (
                            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                                <span style={{ fontSize: 12, color: "#059669", fontFamily: "monospace", fontWeight: "bold" }}>
                                    {selected.size} selected
                                </span>
                                <button onClick={() => { setComposing(true); }}
                                    style={{
                                        background: "linear-gradient(135deg,#10b981,#059669)", border: "none",
                                        borderRadius: 8, padding: "6px 16px", color: "#fff", fontSize: 12, fontWeight: 700, cursor: "pointer"
                                    }}>
                                    Send to {selected.size} →
                                </button>
                                <button onClick={() => setSelected(new Set())}
                                    style={{
                                        background: "#f3f4f6", border: "1px solid #d1d5db", borderRadius: 8,
                                        padding: "6px 10px", color: "#4b5563", fontSize: 12, cursor: "pointer"
                                    }}>Clear</button>
                            </div>
                        )}
                        <span style={{ marginLeft: "auto", fontSize: 11, color: "#9ca3af", fontFamily: "monospace" }}>
                            {filtered.length} contacts
                        </span>
                    </div>

                    <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 16, overflow: "hidden" }}>
                        <div style={{
                            display: "grid", gridTemplateColumns: "36px 1fr 140px 100px 100px 110px",
                            padding: "10px 16px", borderBottom: "1px solid #f3f4f6", background: "#f9fafb"
                        }}>
                            <input type="checkbox" checked={selected.size === filtered.length && filtered.length > 0}
                                onChange={toggleAll}
                                style={{ accentColor: "#1d4ed8", width: 14, height: 14, cursor: "pointer" }} />
                            {["Name / Email", "Joined", "Status", "Premium", "Last Active"].map(h => (
                                <span key={h} style={{
                                    fontSize: 10, color: "#9ca3af", fontFamily: "monospace",
                                    letterSpacing: 1, textTransform: "uppercase"
                                }}>{h}</span>
                            ))}
                        </div>

                        {loading ? (
                            <div style={{ padding: 64, textAlign: "center", color: "#9ca3af" }}>
                                <div style={{ fontSize: 32, marginBottom: 12 }}>⏳</div>Loading contacts from Garaad...
                            </div>
                        ) : filtered.length === 0 ? (
                            <div style={{ padding: 64, textAlign: "center", color: "#9ca3af" }}>No contacts found</div>
                        ) : (
                            <div style={{ maxHeight: "55vh", overflowY: "auto" }}>
                                {filtered.map(u => {
                                    const days = daysSince(u.last_active);
                                    const isInactive = days !== null && days >= 7;
                                    const isNew = (daysSince(u.date_joined) || 0) <= 7;
                                    const checked = selected.has(u.email);
                                    const nameStr = u.full_name || `${u.first_name || ""} ${u.last_name || ""}`.trim();

                                    return (
                                        <div key={u.id} className="row-hover"
                                            style={{
                                                display: "grid",
                                                gridTemplateColumns: "36px 1fr 140px 100px 100px 110px",
                                                padding: "12px 16px", borderBottom: "1px solid #f9fafb",
                                                background: checked ? "#eff6ff" : "transparent",
                                                cursor: "pointer"
                                            }}
                                            onClick={() => toggleOne(u.email)}>
                                            <input type="checkbox" checked={checked} onChange={() => toggleOne(u.email)}
                                                onClick={e => e.stopPropagation()}
                                                style={{ accentColor: "#1d4ed8", width: 14, height: 14, cursor: "pointer" }} />
                                            <div style={{ minWidth: 0 }}>
                                                <div style={{ fontSize: 13, color: "#111827", fontWeight: 600 }}>
                                                    {nameStr || "No name"}
                                                    {isNew && <span style={{
                                                        marginLeft: 8, fontSize: 9, color: "#3b82f6",
                                                        fontFamily: "monospace", background: "#dbeafe", padding: "1px 4px", borderRadius: 4
                                                    }}>NEW</span>}
                                                </div>
                                                <div style={{
                                                    fontSize: 11, color: "#6b7280", fontFamily: "monospace",
                                                    marginTop: 2, overflow: "hidden", textOverflow: "ellipsis"
                                                }}>{u.email}</div>
                                            </div>
                                            <span style={{
                                                fontSize: 11, color: "#6b7280", fontFamily: "monospace",
                                                alignSelf: "center"
                                            }}>{fmtDate(u.date_joined)}</span>
                                            <div style={{ alignSelf: "center" }}>
                                                {u.is_email_verified
                                                    ? <Badge type="verified" label="Verified" />
                                                    : <Badge type="unverified" label="Pending" />}
                                            </div>
                                            <div style={{ alignSelf: "center" }}>
                                                {u.is_premium
                                                    ? <Badge type="premium" label="Premium" />
                                                    : <span style={{ fontSize: 11, color: "#9ca3af", fontFamily: "monospace" }}>Free</span>}
                                            </div>
                                            <span style={{
                                                fontSize: 11, fontFamily: "monospace", alignSelf: "center",
                                                color: isInactive ? "#fb923c" : days === null ? "#9ca3af" : "#10b981"
                                            }}>
                                                {days === null ? "Never" : days === 0 ? "Today" : `${days}d ago`}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </>
            )}

            {/* ══════════════ ANALYTICS TAB ══════════════ */}
            {tab === "analytics" && (
                <div style={{ color: "#000" }}>
                    <div style={{ marginBottom: 20 }}>
                        <div style={{
                            fontSize: 11, color: "#6b7280", fontFamily: "monospace", letterSpacing: 2,
                            textTransform: "uppercase", marginBottom: 12
                        }}>GARAAD AUDIENCE</div>
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", gap: 12 }}>
                            <StatCard label="Total Users" value={total} color="#6366f1" icon="👤" />
                            <StatCard label="Verified" value={verified} color="#10b981" icon="✅"
                                sub={`${total ? ((verified / total) * 100).toFixed(0) : 0}% verification rate`} />
                            <StatCard label="Premium" value={premium} color="#f59e0b" icon="⭐"
                                sub={`${total ? ((premium / total) * 100).toFixed(0) : 0}% conversion`} />
                            <StatCard label="Inactive 7d+" value={inactive7} color="#fb923c" icon="💤" />
                            <StatCard label="New (7d)" value={newThisWeek} color="#3b82f6" icon="🆕" />
                        </div>
                    </div>

                    <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 16, padding: 24 }}>
                        <div style={{
                            fontSize: 11, color: "#6b7280", fontFamily: "monospace", letterSpacing: 2,
                            textTransform: "uppercase", marginBottom: 20
                        }}>RECOMMENDED CAMPAIGNS</div>
                        {[
                            { icon: "👋", title: "Welcome new users", desc: `${newThisWeek} users joined recently. Send a warm onboarding email.`, segment: "new", color: "#3b82f6" },
                            { icon: "💤", title: "Re-engage inactive", desc: `${inactive7} users are drifting away. Bring them back with updates.`, segment: "inactive", color: "#fb923c" },
                            { icon: "⭐", title: "Premium Upsell", desc: `${verified - premium} verified free users. Offer a seasonal discount.`, segment: "verified", color: "#f59e0b" },
                            { icon: "✅", title: "Email Verification", desc: `${total - verified} users pending verification. Nudge them now.`, segment: "unverified", color: "#ef4444" },
                        ].map(c => (
                            <div key={c.title} style={{
                                display: "flex", justifyContent: "space-between",
                                alignItems: "center", padding: "16px 0", borderBottom: "1px solid #f3f4f6",
                                gap: 16, flexWrap: "wrap"
                            }}>
                                <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
                                    <div style={{ fontSize: 28 }}>{c.icon}</div>
                                    <div>
                                        <div style={{ fontSize: 15, fontWeight: 700, color: "#111827" }}>{c.title}</div>
                                        <div style={{ fontSize: 13, color: "#6b7280", marginTop: 2 }}>{c.desc}</div>
                                    </div>
                                </div>
                                <button onClick={() => { quickSelect(c.segment); setTab("contacts"); }}
                                    style={{
                                        background: `${c.color}10`, border: `1px solid ${c.color}30`,
                                        borderRadius: 10, padding: "8px 18px", color: c.color, fontSize: 12,
                                        fontWeight: 700, cursor: "pointer"
                                    }}>
                                    Select Segment →
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}


            {/* ══════════════ COMPOSE MODAL ══════════════ */}
            {composing && (
                <div style={{
                    position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)",
                    backdropFilter: "blur(8px)", display: "flex", alignItems: "center",
                    justifyContent: "center", zIndex: 200, padding: 16
                }}>
                    <div style={{
                        background: "#fff", border: "1px solid #e5e7eb",
                        borderRadius: 24, padding: 32, width: "100%", maxWidth: 560,
                        boxShadow: "0 25px 50px -12px rgba(0,0,0,0.25)", maxHeight: "90vh", overflowY: "auto"
                    }}>

                        <div style={{
                            display: "flex", justifyContent: "space-between",
                            alignItems: "center", marginBottom: 24
                        }}>
                            <div>
                                <h2 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: "#111827" }}>Compose Campaign</h2>
                                <div style={{ fontSize: 12, marginTop: 4 }}>
                                    {selected.size > 0
                                        ? <span style={{ color: "#059669", fontWeight: 600 }}>{selected.size} recipients selected</span>
                                        : <span style={{ color: "#ef4444", fontWeight: 600 }}>No recipients selected</span>}
                                </div>
                            </div>
                            <button onClick={() => { setComposing(false); setSendResult(null); }}
                                style={{
                                    background: "#f3f4f6", border: "none", cursor: "pointer",
                                    borderRadius: 12, width: 36, height: 36, display: "flex", alignItems: "center", justifyContent: "center", color: "#6b7280", fontSize: 20
                                }}>×</button>
                        </div>

                        {selected.size > 0 && (
                            <div style={{
                                background: "#f0fdf4", border: "1px solid #bbf7d0",
                                borderRadius: 12, padding: "12px 16px", marginBottom: 20,
                                maxHeight: 100, overflowY: "auto"
                            }}>
                                <div style={{
                                    fontSize: 10, color: "#166534", fontFamily: "monospace",
                                    letterSpacing: 1, marginBottom: 6, fontWeight: "bold"
                                }}>TARGET EMAILS ({selected.size})</div>
                                <div style={{
                                    fontSize: 11, color: "#166534", fontFamily: "monospace",
                                    lineHeight: 1.6
                                }}>
                                    {[...selected].slice(0, 10).join(", ")}
                                    {selected.size > 10 && ` ...and ${selected.size - 10} more`}
                                </div>
                            </div>
                        )}

                        <div style={{ marginBottom: 16 }}>
                            <div style={{
                                fontSize: 10, color: "#6b7280", fontFamily: "monospace",
                                letterSpacing: 1, textTransform: "uppercase", marginBottom: 8
                            }}>Email Subject</div>
                            <input value={compose.subject}
                                onChange={e => setCompose(p => ({ ...p, subject: e.target.value }))}
                                placeholder="Ku soo dhowow Garaad! 👋"
                                style={{
                                    width: "100%", background: "#f9fafb", border: "1px solid #e5e7eb",
                                    borderRadius: 12, padding: "12px 16px", color: "#000", fontSize: 14
                                }} />
                        </div>

                        <div style={{ marginBottom: 24 }}>
                            <div style={{
                                fontSize: 10, color: "#6b7280", fontFamily: "monospace",
                                letterSpacing: 1, textTransform: "uppercase", marginBottom: 8
                            }}>
                                HTML Content <span style={{ color: "#9ca3af", fontWeight: "normal" }}>(Optional)</span>
                            </div>
                            <textarea value={compose.html}
                                onChange={e => setCompose(p => ({ ...p, html: e.target.value }))}
                                placeholder={"<p>Salaan!</p>\n<p>Maanta waxaan ku haynaa...</p>"}
                                rows={8}
                                style={{
                                    width: "100%", background: "#f9fafb", border: "1px solid #e5e7eb",
                                    borderRadius: 12, padding: "12px 16px", color: "#000", fontSize: 13,
                                    fontFamily: "monospace", resize: "vertical"
                                }} />
                        </div>



                        {sendResult && (
                            <div style={{
                                background: sendResult.fail === 0 ? "#f0fdf4" : "#fef2f2",
                                border: `1px solid ${sendResult.fail === 0 ? "#bbf7d0" : "#fecaca"}`,
                                borderRadius: 12, padding: "14px 18px", marginBottom: 20,
                                fontSize: 14, color: sendResult.fail === 0 ? "#166534" : "#991b1b", fontWeight: 600
                            }}>
                                {sendResult.fail === 0
                                    ? `✓ Batch complete: ${sendResult.ok} successful.`
                                    : `Success: ${sendResult.ok} | Failed: ${sendResult.fail}`}
                            </div>
                        )}

                        <button onClick={sendBulk}
                            disabled={sending || selected.size === 0 || !compose.subject}
                            style={{
                                width: "100%",
                                background: (sending || selected.size === 0 || !compose.subject)
                                    ? "#e5e7eb"
                                    : "linear-gradient(135deg,#1e40af,#1d4ed8)",
                                border: "none", borderRadius: 14, padding: 14,
                                color: (sending || selected.size === 0 || !compose.subject) ? "#9ca3af" : "#fff",
                                fontSize: 15, fontWeight: 800, transition: "all .2s", cursor: (sending || selected.size === 0 || !compose.subject) ? "not-allowed" : "pointer"
                            }}>
                            {sending ? `Sending Batch...` : `Start Campaign to ${selected.size} Contacts →`}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
