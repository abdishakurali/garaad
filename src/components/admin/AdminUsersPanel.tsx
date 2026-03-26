"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { analyticsService } from "@/lib/admin/analytics";
import type { AdminUsersResponse, AdminUserRow } from "@/lib/admin/analytics";
import {
    Users,
    Loader2,
    CheckCircle,
    RotateCcw,
    MessageCircle,
    Mail,
    Phone,
} from "lucide-react";

const GOAL_LABELS = [
    "Hel Shaqo Tech ah",
    "Dhis ganacsi",
    "Bilaaw Freelancing",
    "Kor u Qaad Xirfadahaaga",
    "Faham Tech",
    "Horumarinta xirfadaha",
];
const TRACK_LABELS = [
    "Full-Stack MERN",
    "Next.js & Frontend",
    "AI & Python",
    "SaaS Business",
    "Backend Engineering",
    "Xisaab",
];
const ALL = "All";

const USER_SEGMENT_TABS: { label: string; value: string }[] = [
    { label: "Dhammaan", value: "" },
    { label: "Premium", value: "premium" },
    { label: "Wixii la isku dayey dhammaan", value: "payment_attempt" },
    { label: "Lacag bixin dhicisoobay", value: "failed_payment" },
    { label: "Ma uusan soo galin 7 maalmood", value: "inactive_7" },
];

function truncateRecommended(titles: string[], maxLen: number = 30): string {
    const joined = titles.join(", ");
    if (joined.length <= maxLen) return joined || "—";
    return joined.slice(0, maxLen).trim() + "...";
}

function digitsOnly(s: string): string {
    return s.replace(/\D/g, "");
}

export default function AdminUsersPanel() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [adminUsersData, setAdminUsersData] = useState<AdminUsersResponse | null>(null);
    const [adminUsersLoading, setAdminUsersLoading] = useState(false);
    const [usersPage, setUsersPage] = useState(1);
    const [usersSearch, setUsersSearch] = useState("");
    const [usersFilterGoal, setUsersFilterGoal] = useState<string>(ALL);
    const [usersFilterTrack, setUsersFilterTrack] = useState<string>(ALL);
    const [usersFilterPremium, setUsersFilterPremium] = useState<string>("");
    const [usersFilterVerified, setUsersFilterVerified] = useState<string>("");
    const [usersTabFilter, setUsersTabFilter] = useState<string>("");

    useEffect(() => {
        const uf = searchParams.get("user_filter") ?? "";
        setUsersTabFilter(uf);
    }, [searchParams]);

    const usersFilters = useMemo(
        () => ({
            goal: usersFilterGoal,
            track: usersFilterTrack,
            is_premium: (usersFilterPremium === "Pro" ? "true" : usersFilterPremium === "Free" ? "false" : "") as "true" | "false" | "",
            is_email_verified: (usersFilterVerified === "Verified" ? "true" : usersFilterVerified === "Not verified" ? "false" : "") as "true" | "false" | "",
        }),
        [usersFilterGoal, usersFilterTrack, usersFilterPremium, usersFilterVerified]
    );

    useEffect(() => {
        let cancelled = false;
        setAdminUsersLoading(true);
        analyticsService
            .getAdminUsers(usersPage, usersSearch || undefined, {
                ...usersFilters,
                user_filter: usersTabFilter || undefined,
            })
            .then((data) => {
                if (!cancelled) {
                    setAdminUsersData(data);
                    setAdminUsersLoading(false);
                }
            })
            .catch(() => {
                if (!cancelled) setAdminUsersLoading(false);
            });
        return () => {
            cancelled = true;
        };
    }, [usersPage, usersSearch, usersFilters, usersTabFilter]);

    const onUsersTabFilterChange = useCallback(
        (v: string) => {
            setUsersTabFilter(v);
            setUsersPage(1);
            const p = new URLSearchParams(searchParams.toString());
            if (v) p.set("user_filter", v);
            else p.delete("user_filter");
            router.replace(`/admin/users?${p.toString()}`);
        },
        [router, searchParams]
    );

    return (
        <AdminUsersTab
            data={adminUsersData}
            loading={adminUsersLoading}
            page={usersPage}
            search={usersSearch}
            onPageChange={setUsersPage}
            onSearchChange={setUsersSearch}
            filterGoal={usersFilterGoal}
            filterTrack={usersFilterTrack}
            filterPremium={usersFilterPremium}
            filterVerified={usersFilterVerified}
            onFilterGoalChange={(v) => {
                setUsersFilterGoal(v);
                setUsersPage(1);
            }}
            onFilterTrackChange={(v) => {
                setUsersFilterTrack(v);
                setUsersPage(1);
            }}
            onFilterPremiumChange={(v) => {
                setUsersFilterPremium(v);
                setUsersPage(1);
            }}
            onFilterVerifiedChange={(v) => {
                setUsersFilterVerified(v);
                setUsersPage(1);
            }}
            onFiltersReset={() => {
                setUsersFilterGoal(ALL);
                setUsersFilterTrack(ALL);
                setUsersFilterPremium("");
                setUsersFilterVerified("");
                setUsersPage(1);
            }}
            goalLabels={GOAL_LABELS}
            trackLabels={TRACK_LABELS}
            allLabel={ALL}
            usersTabFilter={usersTabFilter}
            onUsersTabFilterChange={onUsersTabFilterChange}
        />
    );
}

function AdminUsersTab({
    data,
    loading,
    page,
    search,
    onPageChange,
    onSearchChange,
    filterGoal,
    filterTrack,
    filterPremium,
    filterVerified,
    onFilterGoalChange,
    onFilterTrackChange,
    onFilterPremiumChange,
    onFilterVerifiedChange,
    onFiltersReset,
    goalLabels,
    trackLabels,
    allLabel,
    usersTabFilter,
    onUsersTabFilterChange,
}: {
    data: AdminUsersResponse | null;
    loading: boolean;
    page: number;
    search: string;
    onPageChange: (p: number) => void;
    onSearchChange: (s: string) => void;
    filterGoal: string;
    filterTrack: string;
    filterPremium: string;
    filterVerified: string;
    onFilterGoalChange: (v: string) => void;
    onFilterTrackChange: (v: string) => void;
    onFilterPremiumChange: (v: string) => void;
    onFilterVerifiedChange: (v: string) => void;
    onFiltersReset: () => void;
    goalLabels: string[];
    trackLabels: string[];
    allLabel: string;
    usersTabFilter: string;
    onUsersTabFilterChange: (v: string) => void;
}) {
    const summary = data?.summary;
    const results = data?.results ?? [];
    const count = data?.count ?? 0;
    const pageSize = 25;
    const start = (page - 1) * pageSize + 1;
    const end = Math.min(page * pageSize, count);
    const hasActiveFilters =
        filterGoal !== allLabel ||
        filterTrack !== allLabel ||
        filterPremium !== "" ||
        filterVerified !== "";

    const filteredResults = useMemo((): AdminUserRow[] => {
        return results.filter((row) => {
            const goalLabel = row.onboarding?.goal_label ?? "—";
            const topic = row.onboarding?.topic ?? "—";
            if (filterGoal !== allLabel && goalLabel !== filterGoal) return false;
            if (filterTrack !== allLabel && topic !== filterTrack) return false;
            if (filterPremium === "Pro" && !row.is_premium) return false;
            if (filterPremium === "Free" && row.is_premium) return false;
            if (filterVerified === "Verified" && !row.is_email_verified) return false;
            if (filterVerified === "Not verified" && row.is_email_verified) return false;
            return true;
        });
    }, [results, filterGoal, filterTrack, filterPremium, filterVerified, allLabel]);

    return (
        <div className="bg-white rounded-3xl p-8 border border-gray-50 shadow-sm">
            <h2 className="text-lg font-black text-gray-900 mb-4 tracking-tight flex items-center gap-3">
                <Users className="w-5 h-5 text-blue-600" />
                Isticmaalayaasha
            </h2>
            <div className="flex flex-wrap gap-2 mb-6">
                {USER_SEGMENT_TABS.map((tab) => {
                    const active = (usersTabFilter || "") === tab.value;
                    return (
                        <button
                            key={tab.value || "all"}
                            type="button"
                            onClick={() => onUsersTabFilterChange(tab.value)}
                            className={`px-3 py-1.5 rounded-xl text-[11px] font-bold border transition-colors ${
                                active
                                    ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                                    : "bg-gray-50 text-gray-600 border-gray-200 hover:border-gray-300 hover:bg-gray-100"
                            }`}
                        >
                            {tab.label}
                        </button>
                    );
                })}
            </div>
            {summary && (
                <div className="flex flex-wrap gap-6 mb-6 p-4 bg-gray-50/50 rounded-2xl border border-gray-100">
                    <span className="text-xs font-bold text-gray-700">
                        Total users: <strong className="text-gray-900">{summary.total_users}</strong>
                    </span>
                    <span className="text-xs font-bold text-gray-700">
                        Premium: <strong className="text-gray-900">{summary.premium}</strong>
                    </span>
                    <span className="text-xs font-bold text-gray-700">
                        Verified: <strong className="text-gray-900">{summary.verified ?? 0}</strong>
                    </span>
                    <span className="text-xs font-bold text-gray-700">
                        With onboarding: <strong className="text-gray-900">{summary.with_onboarding}</strong>
                    </span>
                    <span className="text-xs font-bold text-gray-700">
                        No onboarding: <strong className="text-gray-900">{summary.no_onboarding}</strong>
                    </span>
                </div>
            )}
            <div className="mb-4">
                <label htmlFor="users-search" className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1.5">
                    Search
                </label>
                <input
                    id="users-search"
                    type="text"
                    placeholder="By name or email..."
                    value={search}
                    onChange={(e) => {
                        onSearchChange(e.target.value);
                        onPageChange(1);
                    }}
                    className="w-full max-w-md px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
            </div>
            <div className="flex flex-wrap items-end gap-4 mb-4 p-4 bg-gray-50/30 rounded-xl border border-gray-100">
                <div>
                    <label htmlFor="filter-goal" className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">
                        Goal
                    </label>
                    <select
                        id="filter-goal"
                        value={filterGoal}
                        onChange={(e) => onFilterGoalChange(e.target.value)}
                        className="text-xs font-bold text-gray-700 bg-white border border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none min-w-[160px]"
                    >
                        <option value={allLabel}>{allLabel}</option>
                        {goalLabels.map((label) => (
                            <option key={label} value={label}>
                                {label}
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <label htmlFor="filter-track" className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">
                        Track
                    </label>
                    <select
                        id="filter-track"
                        value={filterTrack}
                        onChange={(e) => onFilterTrackChange(e.target.value)}
                        className="text-xs font-bold text-gray-700 bg-white border border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none min-w-[160px]"
                    >
                        <option value={allLabel}>{allLabel}</option>
                        {trackLabels.map((label) => (
                            <option key={label} value={label}>
                                {label}
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <label htmlFor="filter-premium" className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">
                        Premium
                    </label>
                    <select
                        id="filter-premium"
                        value={filterPremium}
                        onChange={(e) => onFilterPremiumChange(e.target.value)}
                        className="text-xs font-bold text-gray-700 bg-white border border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none min-w-[100px]"
                    >
                        <option value="">All</option>
                        <option value="Pro">Pro</option>
                        <option value="Free">Free</option>
                    </select>
                </div>
                <div>
                    <label htmlFor="filter-verified" className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">
                        Email verified
                    </label>
                    <select
                        id="filter-verified"
                        value={filterVerified}
                        onChange={(e) => onFilterVerifiedChange(e.target.value)}
                        className="text-xs font-bold text-gray-700 bg-white border border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none min-w-[120px]"
                    >
                        <option value="">All</option>
                        <option value="Verified">Verified</option>
                        <option value="Not verified">Not verified</option>
                    </select>
                </div>
                {hasActiveFilters && (
                    <button
                        type="button"
                        onClick={onFiltersReset}
                        className="inline-flex items-center gap-1.5 text-[10px] font-bold text-blue-600 hover:text-blue-700 px-2.5 py-2 rounded-lg hover:bg-blue-50 border border-blue-200/60 transition-colors"
                    >
                        <RotateCcw className="w-3 h-3" />
                        Reset filters
                    </button>
                )}
            </div>
            {loading ? (
                <div className="flex items-center justify-center py-16">
                    <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
                </div>
            ) : (
                <>
                    {filteredResults.length === 0 ? (
                        <div className="py-12 text-center rounded-2xl border border-gray-100 bg-gray-50/50">
                            <p className="text-sm font-bold text-gray-600">
                                {results.length === 0 ? "No users found." : "No users on this page match the current filters."}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                                {hasActiveFilters ? "Try changing or resetting the filters." : ""}
                            </p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto -mx-2">
                            <table className="w-full text-left border-collapse min-w-[720px]">
                                <thead>
                                    <tr className="border-b border-gray-100">
                                        <th className="pb-3 pr-4 text-[9px] font-black text-gray-400 uppercase tracking-widest">
                                            Name / Email
                                        </th>
                                        <th className="pb-3 pr-4 text-[9px] font-black text-gray-400 uppercase tracking-widest">Joined</th>
                                        <th className="pb-3 pr-4 text-[9px] font-black text-gray-400 uppercase tracking-widest">
                                            Xaaladda Lacagta
                                        </th>
                                        <th className="pb-3 pr-4 text-[9px] font-black text-gray-400 uppercase tracking-widest">Goal</th>
                                        <th className="pb-3 pr-4 text-[9px] font-black text-gray-400 uppercase tracking-widest">Track</th>
                                        <th className="pb-3 pr-4 text-[9px] font-black text-gray-400 uppercase tracking-widest">
                                            Recommended
                                        </th>
                                        <th className="pb-3 pr-4 text-[9px] font-black text-gray-400 uppercase tracking-widest">
                                            Email verified
                                        </th>
                                        <th className="pb-3 pr-4 text-[9px] font-black text-gray-400 uppercase tracking-widest text-center">
                                            Completions
                                        </th>
                                        <th className="pb-3 pr-4 text-[9px] font-black text-gray-400 uppercase tracking-widest">
                                            Phone (WhatsApp)
                                        </th>
                                        <th className="pb-3 pr-2 text-[9px] font-black text-gray-400 uppercase tracking-widest text-center">
                                            Contact
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredResults.map((row: AdminUserRow) => {
                                        const phoneDigits = row.whatsapp_number?.trim()
                                            ? digitsOnly(row.whatsapp_number)
                                            : "";
                                        const waHref = phoneDigits
                                            ? (row.whatsapp_href ?? `https://wa.me/${phoneDigits}`)
                                            : null;
                                        const telHref = phoneDigits ? `tel:+${phoneDigits}` : null;
                                        const mailHref = row.email?.trim() ? `mailto:${row.email.trim()}` : null;
                                        return (
                                            <tr
                                                key={row.id}
                                                className={`border-b border-gray-50 hover:bg-gray-50/80 ${row.has_failed_payment ? "border-l-4 border-l-orange-400" : ""}`}
                                            >
                                                <td className="py-3 pr-4">
                                                    <div className="text-xs font-bold text-gray-900">{row.name || "—"}</div>
                                                    <div className="text-[9px] text-gray-500 truncate max-w-[200px]" title={row.email}>
                                                        {row.email}
                                                    </div>
                                                </td>
                                                <td className="py-3 pr-4 text-xs text-gray-700">
                                                    {row.date_joined
                                                        ? new Date(row.date_joined).toLocaleDateString("en-US", {
                                                              month: "short",
                                                              day: "numeric",
                                                        })
                                                        : "—"}
                                                </td>
                                                <td className="py-3 pr-4">
                                                    {row.is_premium ? (
                                                        <span className="inline-flex px-2 py-0.5 text-[10px] font-bold rounded-lg bg-emerald-100 text-emerald-800">
                                                            Premium
                                                        </span>
                                                    ) : row.has_failed_payment ? (
                                                        <span className="inline-flex px-2 py-0.5 text-[10px] font-bold rounded-lg bg-orange-100 text-orange-900">
                                                            Lacag bixin la isku dayey
                                                        </span>
                                                    ) : (
                                                        <span className="inline-flex px-2 py-0.5 text-[10px] font-bold rounded-lg bg-gray-100 text-gray-500">
                                                            Bilaash
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="py-3 pr-4 text-xs text-gray-700">{row.onboarding?.goal_label ?? "—"}</td>
                                                <td className="py-3 pr-4 text-xs text-gray-700">{row.onboarding?.topic ?? "—"}</td>
                                                <td
                                                    className={`py-3 pr-4 text-xs ${row.recommended_courses?.length ? "text-gray-700" : "text-zinc-500"}`}
                                                    title={row.recommended_courses?.join(", ")}
                                                >
                                                    {row.recommended_courses?.length
                                                        ? truncateRecommended(row.recommended_courses, 30)
                                                        : "—"}
                                                </td>
                                                <td className="py-3 pr-4">
                                                    {row.is_email_verified ? (
                                                        <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold rounded-lg bg-emerald-100 text-emerald-800">
                                                            <CheckCircle className="w-3 h-3" /> Verified
                                                        </span>
                                                    ) : (
                                                        <span className="inline-flex px-2 py-0.5 text-[10px] font-bold rounded-lg bg-amber-50 text-amber-700">
                                                            Not verified
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="py-3 pr-4 text-xs text-gray-700 text-center">{row.completions ?? 0}</td>
                                                <td className="py-3 pr-4 text-xs text-gray-700 font-mono">
                                                    {row.whatsapp_number?.trim() ? row.whatsapp_number : "—"}
                                                </td>
                                                <td className="py-3 pr-2">
                                                    <div className="flex flex-wrap items-center justify-center gap-1">
                                                        {mailHref ? (
                                                            <a
                                                                href={mailHref}
                                                                className="inline-flex items-center justify-center w-9 h-9 rounded-xl bg-sky-50 text-sky-800 hover:bg-sky-100 border border-sky-100 transition-colors"
                                                                title="Email"
                                                            >
                                                                <Mail className="w-4 h-4" />
                                                            </a>
                                                        ) : null}
                                                        {telHref ? (
                                                            <a
                                                                href={telHref}
                                                                className="inline-flex items-center justify-center w-9 h-9 rounded-xl bg-gray-50 text-gray-800 hover:bg-gray-100 border border-gray-200 transition-colors"
                                                                title="Call"
                                                            >
                                                                <Phone className="w-4 h-4" />
                                                            </a>
                                                        ) : null}
                                                        {waHref ? (
                                                            <a
                                                                href={waHref}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="inline-flex items-center justify-center w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-100 transition-colors"
                                                                title="WhatsApp"
                                                            >
                                                                <MessageCircle className="w-4 h-4" />
                                                            </a>
                                                        ) : null}
                                                        {!mailHref && !telHref && !waHref && (
                                                            <span className="text-[10px] text-gray-400 font-medium">—</span>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}
                    {(count > 0 || filteredResults.length > 0) && (
                        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                            <p className="text-[9px] text-gray-500 font-bold uppercase tracking-widest">
                                {hasActiveFilters
                                    ? `${filteredResults.length} of ${results.length} on this page match filters · ${count} total`
                                    : `Showing ${start}–${end} of ${count} users`}
                            </p>
                            <div className="flex gap-2">
                                <button
                                    type="button"
                                    onClick={() => onPageChange(page - 1)}
                                    disabled={!data?.previous}
                                    className="px-3 py-1.5 text-xs font-bold rounded-lg border border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                                >
                                    Prev
                                </button>
                                <button
                                    type="button"
                                    onClick={() => onPageChange(page + 1)}
                                    disabled={!data?.next}
                                    className="px-3 py-1.5 text-xs font-bold rounded-lg border border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
