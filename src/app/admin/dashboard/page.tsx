"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { analyticsService, UserAnalytics, RevenueAnalytics, CourseAnalytics, RecentActivity } from "@/lib/admin/analytics";
import { useChallengeStatus } from "@/hooks/useChallengeStatus";
import type { UserListItem, AdminUsersResponse, AdminUserRow } from "@/lib/admin/analytics";
import KPICard from "@/components/admin/dashboard/KPICard";
import TrendChart from "@/components/admin/dashboard/TrendChart";
import Link from "next/link";
import { Users, DollarSign, TrendingUp, ShoppingCart, Award, AlertCircle, Loader2, ArrowRight, CheckCircle, Target, RotateCcw, MessageCircle, GraduationCap } from "lucide-react";
import type { OnboardingStats, LessonDropOffRow } from "@/lib/admin/analytics";

// Display labels for filters (must match backend admin_dashboard GOAL_LABELS / TRACK_LABELS / LEVEL_LABELS)
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
const LEVEL_OPTIONS = ["Beginner", "Intermediate", "Advanced", "Bilowga"];
const ALL = "All";

export default function DashboardPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { data: cohortLive } = useChallengeStatus();
    const [userStats, setUserStats] = useState<UserAnalytics | null>(null);
    const [revenueStats, setRevenueStats] = useState<RevenueAnalytics | null>(null);
    const [courseStats, setCourseStats] = useState<CourseAnalytics | null>(null);
    const [activityStats, setActivityStats] = useState<RecentActivity | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [filterGoal, setFilterGoal] = useState<string>(ALL);
    const [filterTrack, setFilterTrack] = useState<string>(ALL);
    const [filterLevel, setFilterLevel] = useState<string>(ALL);

    const [activeTab, setActiveTab] = useState<"overview" | "users">("overview");
    const [adminUsersData, setAdminUsersData] = useState<AdminUsersResponse | null>(null);
    const [adminUsersLoading, setAdminUsersLoading] = useState(false);
    const [usersPage, setUsersPage] = useState(1);
    const [usersSearch, setUsersSearch] = useState("");
    const [usersFilterGoal, setUsersFilterGoal] = useState<string>(ALL);
    const [usersFilterTrack, setUsersFilterTrack] = useState<string>(ALL);
    const [usersFilterPremium, setUsersFilterPremium] = useState<string>("");
    const [usersFilterVerified, setUsersFilterVerified] = useState<string>("");
    const [usersTabFilter, setUsersTabFilter] = useState<string>("");
    const [cohortEnrollments, setCohortEnrollments] = useState<Awaited<ReturnType<typeof analyticsService.getCohortEnrollments>>["data"] | null>(null);
    const [cohortTableLoading, setCohortTableLoading] = useState(false);

    useEffect(() => {
        const tab = searchParams.get("tab");
        const uf = searchParams.get("user_filter") ?? "";
        setUsersTabFilter(uf);
        if (tab === "users") setActiveTab("users");
        else if (tab === "overview") setActiveTab("overview");
        if (uf) setActiveTab("users");
    }, [searchParams]);

    const filteredUserList = useMemo((): UserListItem[] => {
        const list = userStats?.userList ?? [];
        return list.filter((row) => {
            if (filterGoal !== ALL && (row.goal || "—") !== filterGoal) return false;
            if (filterTrack !== ALL && (row.track || "—") !== filterTrack) return false;
            if (filterLevel !== ALL && (row.level || "—") !== filterLevel) return false;
            return true;
        });
    }, [userStats?.userList, filterGoal, filterTrack, filterLevel]);

    const resetFilters = () => {
        setFilterGoal(ALL);
        setFilterTrack(ALL);
        setFilterLevel(ALL);
    };

    const fetchAllData = useCallback(async () => {
        try {
            setLoading(true);
            const [u, r, c, a] = await Promise.all([
                analyticsService.getUsers(),
                analyticsService.getRevenue(),
                analyticsService.getCourses(),
                analyticsService.getActivity()
            ]);
            setUserStats(u);
            setRevenueStats(r);
            setCourseStats(c);
            setActivityStats(a);
            setError(null);
        } catch (err) {
            console.error("Error fetching analytics data:", err);
            setError("Could not load analytics data. Please make sure the backend is running and you are logged in as an admin.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchAllData();
    }, [fetchAllData]);

    useEffect(() => {
        if (activeTab !== "overview") return;
        let cancelled = false;
        setCohortTableLoading(true);
        analyticsService.getCohortEnrollments().then((res) => {
            if (!cancelled) {
                setCohortEnrollments(res.data ?? null);
                setCohortTableLoading(false);
            }
        }).catch(() => {
            if (!cancelled) setCohortTableLoading(false);
        });
        return () => { cancelled = true; };
    }, [activeTab]);

    const usersFilters = useMemo(() => ({
        goal: usersFilterGoal,
        track: usersFilterTrack,
        is_premium: (usersFilterPremium === "Pro" ? "true" : usersFilterPremium === "Free" ? "false" : "") as "true" | "false" | "",
        is_email_verified: (usersFilterVerified === "Verified" ? "true" : usersFilterVerified === "Not verified" ? "false" : "") as "true" | "false" | "",
    }), [usersFilterGoal, usersFilterTrack, usersFilterPremium, usersFilterVerified]);

    useEffect(() => {
        if (activeTab !== "users") return;
        let cancelled = false;
        setAdminUsersLoading(true);
        analyticsService.getAdminUsers(usersPage, usersSearch || undefined, {
            ...usersFilters,
            user_filter: usersTabFilter || undefined,
        }).then((data) => {
            if (!cancelled) {
                setAdminUsersData(data);
                setAdminUsersLoading(false);
            }
        }).catch(() => {
            if (!cancelled) setAdminUsersLoading(false);
        });
        return () => { cancelled = true; };
    }, [activeTab, usersPage, usersSearch, usersFilters, usersTabFilter]);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center p-20 bg-white/50 backdrop-blur-sm rounded-[3rem] border border-gray-50">
                <Loader2 className="w-12 h-12 text-blue-600 animate-spin mb-6" />
                <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">Soo raryaya dashboard-ka...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-12 bg-white rounded-[3rem] border border-red-50 text-center shadow-xl shadow-red-50/50">
                <div className="w-20 h-20 bg-red-50 rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-inner">
                    <AlertCircle className="w-10 h-10 text-red-600" />
                </div>
                <h2 className="text-2xl font-black text-gray-900 mb-4">Khalad ayaa dhacay</h2>
                <p className="text-gray-500 font-medium max-w-sm mx-auto mb-10 leading-relaxed">{error}</p>
                <button
                    type="button"
                    onClick={() => {
                        setError(null);
                        void fetchAllData();
                    }}
                    className="px-10 py-4 bg-red-600 hover:bg-red-700 text-white font-bold rounded-2xl transition-all shadow-lg shadow-red-100"
                >
                    Isku day markale
                </button>
            </div>
        );
    }

    if (!userStats || !revenueStats || !courseStats || !activityStats) return null;

    return (
        <div className="animate-fade-in space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-gray-900 mb-1 tracking-tight">
                        Analytics Dashboard
                    </h1>
                    <p className="text-gray-400 font-bold uppercase tracking-widest text-[9px]">
                        Guud ahaan xaaladda platform-ka iyo qorshayaasha
                    </p>
                </div>
                <div className="bg-white px-5 py-2.5 rounded-xl border border-gray-50 shadow-sm flex items-center gap-2.5">
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping"></span>
                    <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">
                        Xogta Hadda (Live)
                    </span>
                </div>
            </div>

            {/* Tabs: Overview | Users */}
            <div className="flex gap-2 border-b border-gray-100 pb-0">
                <button
                    type="button"
                    onClick={() => {
                        setActiveTab("overview");
                        setUsersTabFilter("");
                        router.replace("/admin/dashboard?tab=overview");
                    }}
                    className={`px-4 py-2.5 text-sm font-bold rounded-t-xl border-b-2 transition-colors ${activeTab === "overview" ? "border-blue-600 text-blue-700 bg-blue-50/50" : "border-transparent text-gray-500 hover:text-gray-800 hover:bg-gray-50"}`}
                >
                    Overview
                </button>
                <button
                    type="button"
                    onClick={() => {
                        setActiveTab("users");
                        const p = new URLSearchParams();
                        p.set("tab", "users");
                        if (usersTabFilter) p.set("user_filter", usersTabFilter);
                        router.replace(`/admin/dashboard?${p.toString()}`);
                    }}
                    className={`px-4 py-2.5 text-sm font-bold rounded-t-xl border-b-2 transition-colors ${activeTab === "users" ? "border-blue-600 text-blue-700 bg-blue-50/50" : "border-transparent text-gray-500 hover:text-gray-800 hover:bg-gray-50"}`}
                >
                    Isticmaalayaasha
                </button>
            </div>

            {activeTab === "users" && (
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
                    onFilterGoalChange={(v) => { setUsersFilterGoal(v); setUsersPage(1); }}
                    onFilterTrackChange={(v) => { setUsersFilterTrack(v); setUsersPage(1); }}
                    onFilterPremiumChange={(v) => { setUsersFilterPremium(v); setUsersPage(1); }}
                    onFilterVerifiedChange={(v) => { setUsersFilterVerified(v); setUsersPage(1); }}
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
                    onUsersTabFilterChange={(v) => {
                        setUsersTabFilter(v);
                        setUsersPage(1);
                        const p = new URLSearchParams(searchParams.toString());
                        p.set("tab", "users");
                        if (v) p.set("user_filter", v);
                        else p.delete("user_filter");
                        router.replace(`/admin/dashboard?${p.toString()}`);
                    }}
                />
            )}

            {activeTab === "overview" && (
            <>
            {/* Top KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <KPICard
                    title="Wadarta Users-ka"
                    value={userStats.total}
                    change={userStats.change}
                    trend={userStats.change >= 0 ? "up" : "down"}
                    icon={<Users className="w-5 h-5" />}
                />
                <KPICard
                    title="Active Users (DAU)"
                    value={userStats.activeUsers.dau}
                    change={userStats.activeUsers.dauChange}
                    trend={userStats.activeUsers.dauChange >= 0 ? "up" : "down"}
                    icon={<TrendingUp className="w-5 h-5" />}
                />
                <KPICard
                    title="Lacag la ururiyay"
                    value={revenueStats.collected_total ?? revenueStats.total}
                    subValue={`La isku dayay (oo dhan): $${(revenueStats.attempted_total ?? revenueStats.collected_total ?? revenueStats.total).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                    change={revenueStats.change}
                    trend={revenueStats.change >= 0 ? "up" : "down"}
                    prefix="$"
                    decimals={2}
                    icon={<DollarSign className="w-5 h-5" />}
                />
                <button
                    type="button"
                    onClick={() => router.push("/admin/dashboard?tab=users&user_filter=failed_payment")}
                    className="text-left rounded-3xl focus:outline-none focus-visible:ring-2 focus-visible:ring-red-400"
                >
                    <KPICard
                        title="Lacag La' — Failed Payments"
                        value={revenueStats.failed_payment_count ?? 0}
                        subValue={`Wadarta isku dayay: $${(revenueStats.failed_payment_total ?? 0).toFixed(2)}`}
                        className="bg-red-50 border-red-100 border-2 h-full hover:bg-red-100/80 transition-colors"
                        icon={<AlertCircle className="w-5 h-5 text-red-600" />}
                    />
                </button>
                <KPICard
                    title="Kooxda Hadda"
                    value={cohortLive?.active_cohort_name ?? "—"}
                    subValue={
                        cohortLive?.max_students != null
                            ? `${cohortLive.enrolled_count ?? 0}/${cohortLive.max_students} arday · ${cohortLive.cohort_start_date ?? cohortLive.next_cohort_start_date ?? "—"}`
                            : "Koox firfircoon ma jirto"
                    }
                    className="bg-violet-50 border-violet-100 border-2"
                    icon={<GraduationCap className="w-5 h-5 text-violet-600" />}
                />
                <div
                    title="Heerka beddelka waa tirada isticmaalayaasha premium marka loo eego wadarta isticmaalayaasha. Haddii ay 0% tahay, dad badan ayaa iska diiwaan geliyey laakiin aan weli lacag bixin."
                    className="rounded-3xl"
                >
                    <KPICard
                        title="Heerka Beddelka"
                        value={revenueStats.conversionRate}
                        subValue={`${revenueStats.payment_attempt_users_count ?? 0} qof ayaa lacag isku dayay`}
                        change={revenueStats.conversionChange}
                        trend={revenueStats.conversionChange >= 0 ? "up" : "down"}
                        suffix="%"
                        decimals={1}
                        icon={<ShoppingCart className="w-5 h-5" />}
                    />
                </div>
            </div>

            {/* Ardayda kooxda */}
            <div className="bg-white rounded-3xl p-8 border border-gray-50 shadow-sm overflow-x-auto">
                <h2 className="text-lg font-black text-gray-900 mb-4 tracking-tight flex items-center gap-2">
                    <GraduationCap className="w-5 h-5 text-violet-600" />
                    Ardayda Kooxda
                </h2>
                {cohortTableLoading ? (
                    <Loader2 className="w-8 h-8 text-violet-600 animate-spin" />
                ) : !cohortEnrollments?.cohort ? (
                    <p className="text-sm text-gray-500 font-medium">Koox firfircoon lama helin.</p>
                ) : (
                    <table className="w-full text-left text-xs min-w-[720px]">
                        <thead>
                            <tr className="text-gray-400 font-black uppercase tracking-widest border-b border-gray-100">
                                <th className="pb-2 pr-3">Magaca</th>
                                <th className="pb-2 pr-3">Email</th>
                                <th className="pb-2 pr-3">Bilaabay</th>
                                <th className="pb-2 pr-3">Wicitaanada</th>
                                <th className="pb-2 pr-3">Koodhka</th>
                                <th className="pb-2 pr-3">Shahaadada</th>
                                <th className="pb-2">Ficil</th>
                            </tr>
                        </thead>
                        <tbody>
                            {cohortEnrollments.enrollments.map((row) => (
                                <tr key={row.id} className="border-b border-gray-50">
                                    <td className="py-2 pr-3 font-bold text-gray-900">{row.name}</td>
                                    <td className="py-2 pr-3 text-gray-600">{row.email}</td>
                                    <td className="py-2 pr-3 text-gray-600">
                                        {row.enrolled_at ? new Date(row.enrolled_at).toLocaleDateString() : "—"}
                                    </td>
                                    <td className="py-2 pr-3 font-mono">
                                        {row.weekly_calls_attended_count}/6
                                    </td>
                                    <td className="py-2 pr-3">{row.code_reviews_completed}</td>
                                    <td className="py-2 pr-3">{row.certificate_issued ? "Haa" : "Maya"}</td>
                                    <td className="py-2 flex flex-wrap gap-1">
                                        <button
                                            type="button"
                                            className="px-2 py-1 rounded-lg bg-emerald-100 text-emerald-800 font-bold"
                                            onClick={() => {
                                                void analyticsService.patchCohortEnrollment(row.id, "mark_call_attended").then(() => {
                                                    void analyticsService.getCohortEnrollments().then((r) => setCohortEnrollments(r.data));
                                                });
                                            }}
                                        >
                                            Calaamadi inuu soo xaadiray
                                        </button>
                                        <button
                                            type="button"
                                            className="px-2 py-1 rounded-lg bg-violet-100 text-violet-800 font-bold"
                                            onClick={() => {
                                                void analyticsService.patchCohortEnrollment(row.id, "issue_certificate").then(() => {
                                                    void analyticsService.getCohortEnrollments().then((r) => setCohortEnrollments(r.data));
                                                });
                                            }}
                                        >
                                            Sii shahaadada
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column - Trends */}
                <div className="lg:col-span-2 space-y-6">
                    {/* User Trends */}
                    <div className="bg-white rounded-3xl p-8 border border-gray-50 shadow-sm relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50/30 rounded-full -mr-32 -mt-32 blur-3xl"></div>
                        <h2 className="text-lg font-black text-gray-900 mb-8 tracking-tight flex items-center gap-3">
                            <Users className="w-5 h-5 text-blue-600" />
                            User Trends (Todobaadkan)
                        </h2>

                        <div className="grid grid-cols-3 gap-4 mb-10">
                            {[
                                { label: "Maanta", val: userStats.newUsers.today },
                                { label: "Todobaadkan", val: userStats.newUsers.thisWeek },
                                { label: "Bishan", val: userStats.newUsers.thisMonth }
                            ].map((s, i) => (
                                <div key={i} className="bg-gray-50/50 p-5 rounded-2xl border border-gray-100/50">
                                    <div className="text-[9px] text-gray-400 font-black uppercase tracking-widest mb-1.5">{s.label}</div>
                                    <div className="text-2xl font-black text-gray-900 tracking-tighter">{s.val}</div>
                                    <div className="text-[8px] text-blue-600 font-extrabold uppercase mt-1.5">New Users</div>
                                </div>
                            ))}
                        </div>

                        <TrendChart
                            data={userStats.trends.labels.map((label, idx) => ({
                                day: label,
                                newUsers: userStats.trends.newUsers[idx],
                                activeUsers: userStats.trends.activeUsers[idx],
                            }))}
                            dataKeys={[
                                { key: "newUsers", color: "#3B82F6", name: "New Users" },
                                { key: "activeUsers", color: "#10B981", name: "Active Users" },
                            ]}
                            xAxisKey="day"
                            type="area"
                            height={280}
                            showLegend
                        />
                    </div>

                    {/* Revenue Section */}
                    <div className="bg-white rounded-3xl p-8 border border-gray-50 shadow-sm">
                        <div className="flex items-center justify-between mb-10">
                            <h2 className="text-lg font-black text-gray-900 tracking-tight flex items-center gap-3">
                                <DollarSign className="w-5 h-5 text-emerald-600" />
                                Revenue Performance
                            </h2>
                            <div className="flex gap-6">
                                <div className="text-right">
                                    <div className="text-[9px] text-gray-400 font-black uppercase tracking-widest mb-1">ARPU</div>
                                    <div className="text-lg font-black text-gray-900">
                                        ${revenueStats.arpu.toFixed(2)}
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="text-[9px] text-gray-400 font-black uppercase tracking-widest mb-1">CONVERSION</div>
                                    <div className="text-lg font-black text-gray-900">
                                        {revenueStats.conversionRate}%
                                    </div>
                                </div>
                            </div>
                        </div>

                        <TrendChart
                            data={revenueStats.trends.labels.map((label, idx) => ({
                                month: label,
                                revenue: revenueStats.trends.revenue[idx],
                            }))}
                            dataKeys={[{ key: "revenue", color: "#10B981", name: "Revenue" }]}
                            xAxisKey="month"
                            type="bar"
                            height={280}
                        />
                    </div>
                </div>

                {/* Right Column - Activity & Top Courses */}
                <div className="space-y-6">
                    {/* Recent Activity */}
                    <div className="bg-white rounded-3xl p-8 border border-gray-50 shadow-sm">
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-base font-black text-gray-900 tracking-tight">Recent Activity</h2>
                            <ArrowRight className="w-3.5 h-3.5 text-gray-300" />
                        </div>

                        <div className="space-y-5">
                            <h3 className="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] mb-3">Purchases</h3>
                            {activityStats.purchases.length > 0 ? activityStats.purchases.slice(0, 4).map((purchase, idx) => (
                                <div key={idx} className="flex items-start gap-3.5 p-4 bg-gray-50/50 rounded-2xl border border-gray-100/50 hover:bg-white hover:shadow-lg transition-all">
                                    <div className="w-8 h-8 rounded-xl bg-emerald-50 flex items-center justify-center flex-shrink-0">
                                        <DollarSign className="w-4 h-4 text-emerald-600" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="text-xs font-bold text-gray-900 truncate mb-0.5">
                                            {purchase.userName}
                                        </div>
                                        <div className="text-[9px] text-gray-500 font-bold truncate">
                                            {purchase.course}
                                        </div>
                                        <div className="text-emerald-600 font-black text-[9px] mt-0.5">${purchase.amount}</div>
                                    </div>
                                </div>
                            )) : (
                                <p className="text-[10px] text-gray-400 text-center py-4 italic">Lama hayo</p>
                            )}
                        </div>

                        <div className="mt-8 space-y-5">
                            <h3 className="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] mb-3">New Signups</h3>
                            {activityStats.signups.length > 0 ? activityStats.signups.slice(0, 4).map((signup, idx) => (
                                <div key={idx} className="flex items-center gap-3.5 p-4 bg-blue-50/30 rounded-2xl border border-blue-100/30 hover:bg-white hover:shadow-lg transition-all">
                                    <div className="w-8 h-8 rounded-xl bg-white flex items-center justify-center text-[10px] font-black text-blue-600 shadow-sm">
                                        {signup.avatar}
                                    </div>
                                    <div className="flex-1 truncate">
                                        <div className="text-xs font-bold text-gray-900 truncate">
                                            {signup.userName}
                                        </div>
                                        <div className="text-[8px] text-gray-400 font-black uppercase tracking-widest mt-0.5">
                                            {new Date(signup.timestamp).toLocaleDateString()}
                                        </div>
                                    </div>
                                </div>
                            )) : (
                                <p className="text-[10px] text-gray-400 text-center py-4 italic">Lama hayo</p>
                            )}
                        </div>
                    </div>

                    {/* Top Courses */}
                    <div className="bg-white rounded-3xl p-8 border border-gray-50 shadow-sm">
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-base font-black text-gray-900 tracking-tight">Top Courses</h2>
                            <Award className="w-4 h-4 text-yellow-500" />
                        </div>
                        <div className="space-y-5">
                            {courseStats.topCourses.length > 0 ? courseStats.topCourses.slice(0, 4).map((course, idx) => (
                                <div key={course.id} className="flex items-center gap-4">
                                    <div className="w-8 h-8 rounded-xl bg-gray-900 flex items-center justify-center text-[10px] font-black text-white shadow-lg shadow-gray-200">
                                        {idx + 1}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="text-xs font-black text-gray-900 truncate mb-0.5">
                                            {course.title}
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="text-[8px] text-gray-400 font-black uppercase tracking-widest">
                                                {course.enrollments} ENROLLED
                                            </div>
                                            <div className="w-0.5 h-0.5 bg-gray-200 rounded-full"></div>
                                            <div className="text-[8px] text-emerald-600 font-black uppercase tracking-widest">
                                                {course.completionRate}% DONE
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-[10px] font-black text-amber-600 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-100 flex items-center gap-1">
                                        ★ {course.avgRating}
                                    </div>
                                </div>
                            )) : (
                                <p className="text-[10px] text-gray-400 text-center py-4 italic">Lama hayo</p>
                            )}
                        </div>
                    </div>

                    {/* Attention Needed */}
                    <div className="bg-white rounded-3xl p-8 border border-red-50 shadow-sm">
                        <h2 className="text-base font-black text-gray-900 mb-8 tracking-tight">Attention Needed</h2>
                        <div className="space-y-4">
                            {courseStats.dropOffPoints.length > 0 ? courseStats.dropOffPoints.slice(0, 3).map((point, idx) => (
                                <div key={idx} className="p-4 bg-red-50/50 rounded-2xl border border-red-100/50">
                                    <div className="flex items-start gap-3.5">
                                        <div className="w-8 h-8 rounded-xl bg-red-100 flex items-center justify-center flex-shrink-0 shadow-sm">
                                            <AlertCircle className="w-4 h-4 text-red-600" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="text-xs font-black text-gray-900 leading-tight mb-0.5 truncate">
                                                {point.lessonTitle}
                                            </div>
                                            <div className="text-[9px] text-red-600 font-black uppercase tracking-widest mb-0.5">
                                                {point.dropOffRate}% DROP-OFF
                                            </div>
                                            <div className="text-[8px] text-gray-400 font-bold truncate">
                                                {point.courseTitle}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )) : (
                                <div className="p-6 text-center bg-emerald-50 rounded-2xl border border-emerald-100">
                                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center mx-auto mb-3 shadow-sm shadow-emerald-100">
                                        <CheckCircle className="w-6 h-6 text-emerald-600" />
                                    </div>
                                    <h3 className="text-xs font-black text-emerald-800 mb-0.5">All smooth!</h3>
                                    <p className="text-[8px] text-emerald-600/60 font-bold uppercase tracking-widest">No major issues</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Per-lesson completion funnel */}
            {courseStats.lessonDropOff && courseStats.lessonDropOff.length > 0 && (
                <div className="bg-white rounded-3xl p-8 border border-gray-50 shadow-sm overflow-x-auto">
                    <h2 className="text-base font-black text-gray-900 mb-6 tracking-tight flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-violet-600" />
                        Lesson completion &amp; drop-off
                    </h2>
                    <table className="w-full text-left text-[10px] min-w-[640px]">
                        <thead>
                            <tr className="text-gray-400 font-black uppercase tracking-widest border-b border-gray-100">
                                <th className="pb-3 pr-4">Lesson</th>
                                <th className="pb-3 pr-4">Course</th>
                                <th className="pb-3 pr-2 text-right">Reached</th>
                                <th className="pb-3 pr-2 text-right">Done</th>
                                <th className="pb-3 pr-2 text-right">Complete %</th>
                                <th className="pb-3 text-right">Drop-off %</th>
                            </tr>
                        </thead>
                        <tbody>
                            {courseStats.lessonDropOff.slice(0, 25).map((row: LessonDropOffRow) => (
                                <tr key={row.lessonId} className="border-b border-gray-50/80">
                                    <td className="py-2.5 pr-4 font-bold text-gray-900 truncate max-w-[200px]">
                                        #{row.lessonNumber} {row.lessonTitle}
                                    </td>
                                    <td className="py-2.5 pr-4 text-gray-500 truncate max-w-[160px]">{row.courseTitle}</td>
                                    <td className="py-2.5 pr-2 text-right font-mono text-gray-700">{row.learnersReached}</td>
                                    <td className="py-2.5 pr-2 text-right font-mono text-gray-700">{row.learnersCompleted}</td>
                                    <td className="py-2.5 pr-2 text-right font-mono text-emerald-600">{row.completionRate}%</td>
                                    <td className="py-2.5 text-right font-mono text-red-600">{row.dropOffRate}%</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Onboarding Insights */}
            {userStats.onboardingStats && (
                <OnboardingSection stats={userStats.onboardingStats} />
            )}

            {/* User list with onboarding columns */}
            {userStats.userList && userStats.userList.length > 0 && (
                <div className="bg-white rounded-3xl p-8 border border-gray-50 shadow-sm overflow-hidden">
                    <h2 className="text-lg font-black text-gray-900 mb-4 tracking-tight flex items-center gap-3">
                        <Users className="w-5 h-5 text-blue-600" />
                        User list — Goal, Track, Level, Time/day
                    </h2>
                    <div className="flex flex-wrap items-center gap-3 mb-4">
                        <select
                            value={filterGoal}
                            onChange={(e) => setFilterGoal(e.target.value)}
                            className="text-xs font-bold text-gray-700 bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-violet-500 focus:border-violet-500 outline-none min-w-0 max-w-[180px]"
                        >
                            <option value={ALL}>{ALL}</option>
                            {GOAL_LABELS.map((label) => (
                                <option key={label} value={label}>{label}</option>
                            ))}
                        </select>
                        <select
                            value={filterTrack}
                            onChange={(e) => setFilterTrack(e.target.value)}
                            className="text-xs font-bold text-gray-700 bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-violet-500 focus:border-violet-500 outline-none min-w-0 max-w-[180px]"
                        >
                            <option value={ALL}>{ALL}</option>
                            {TRACK_LABELS.map((label) => (
                                <option key={label} value={label}>{label}</option>
                            ))}
                        </select>
                        <select
                            value={filterLevel}
                            onChange={(e) => setFilterLevel(e.target.value)}
                            className="text-xs font-bold text-gray-700 bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-violet-500 focus:border-violet-500 outline-none min-w-0 max-w-[140px]"
                        >
                            <option value={ALL}>{ALL}</option>
                            {LEVEL_OPTIONS.map((label) => (
                                <option key={label} value={label}>{label}</option>
                            ))}
                        </select>
                        <button
                            type="button"
                            onClick={resetFilters}
                            className="inline-flex items-center gap-1.5 text-[10px] font-bold text-violet-600 hover:text-violet-700 px-2.5 py-1.5 rounded-lg hover:bg-violet-50 border border-violet-200/60 transition-colors"
                        >
                            <RotateCcw className="w-3 h-3" />
                            Reset
                        </button>
                        <span className="text-[9px] text-gray-400 font-bold uppercase tracking-widest ml-auto">
                            Showing {filteredUserList.length} of {userStats.userList.length} users
                        </span>
                    </div>
                    <div className="overflow-x-auto -mx-2">
                        <table className="w-full text-left border-collapse min-w-[640px]">
                            <thead>
                                <tr className="border-b border-gray-100">
                                    <th className="pb-3 pr-4 text-[9px] font-black text-gray-400 uppercase tracking-widest">Email / Username</th>
                                    <th className="pb-3 pr-4 text-[9px] font-black text-gray-400 uppercase tracking-widest">Goal</th>
                                    <th className="pb-3 pr-4 text-[9px] font-black text-gray-400 uppercase tracking-widest">Track</th>
                                    <th className="pb-3 pr-4 text-[9px] font-black text-gray-400 uppercase tracking-widest">Level</th>
                                    <th className="pb-3 pr-4 text-[9px] font-black text-gray-400 uppercase tracking-widest">Time/day</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredUserList.slice(0, 50).map((row) => (
                                    <tr key={row.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                                        <td className="py-3 pr-4">
                                            <div className="text-xs font-bold text-gray-900 truncate max-w-[200px]" title={row.email}>{row.email}</div>
                                            {row.username && row.username !== "—" && (
                                                <div className="text-[9px] text-gray-400 truncate max-w-[200px]">{row.username}</div>
                                            )}
                                        </td>
                                        <td className="py-3 pr-4 text-xs text-gray-700">{row.goal ?? "—"}</td>
                                        <td className="py-3 pr-4 text-xs text-gray-700">{row.track ?? "—"}</td>
                                        <td className="py-3 pr-4 text-xs text-gray-700">{row.level ?? "—"}</td>
                                        <td className="py-3 pr-4 text-xs text-gray-700">{row.time_per_day ?? "—"}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    {filteredUserList.length > 50 && (
                        <p className="text-[9px] text-gray-400 mt-3 font-bold uppercase tracking-widest">Showing first 50 of {filteredUserList.length} filtered users</p>
                    )}
                </div>
            )}
            </>
            )}
        </div>
    );
}

function truncateRecommended(titles: string[], maxLen: number = 30): string {
    const joined = titles.join(", ");
    if (joined.length <= maxLen) return joined || "—";
    return joined.slice(0, maxLen).trim() + "...";
}

const USER_SEGMENT_TABS: { label: string; value: string }[] = [
    { label: "Dhammaan", value: "" },
    { label: "Premium", value: "premium" },
    { label: "Wixii la isku dayey dhammaan", value: "payment_attempt" },
    { label: "Lacag bixin dhicisoobay", value: "failed_payment" },
    { label: "Ma uusan soo galin 7 maalmood", value: "inactive_7" },
];

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
    const hasActiveFilters = filterGoal !== allLabel || filterTrack !== allLabel || filterPremium !== "" || filterVerified !== "";

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
                    <span className="text-xs font-bold text-gray-700">Total users: <strong className="text-gray-900">{summary.total_users}</strong></span>
                    <span className="text-xs font-bold text-gray-700">Premium: <strong className="text-gray-900">{summary.premium}</strong></span>
                    <span className="text-xs font-bold text-gray-700">Verified: <strong className="text-gray-900">{summary.verified ?? 0}</strong></span>
                    <span className="text-xs font-bold text-gray-700">With onboarding: <strong className="text-gray-900">{summary.with_onboarding}</strong></span>
                    <span className="text-xs font-bold text-gray-700">No onboarding: <strong className="text-gray-900">{summary.no_onboarding}</strong></span>
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
                    onChange={(e) => { onSearchChange(e.target.value); onPageChange(1); }}
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
                            <option key={label} value={label}>{label}</option>
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
                            <option key={label} value={label}>{label}</option>
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
                        <table className="w-full text-left border-collapse min-w-[640px]">
                            <thead>
                                <tr className="border-b border-gray-100">
                                    <th className="pb-3 pr-4 text-[9px] font-black text-gray-400 uppercase tracking-widest">Name / Email</th>
                                    <th className="pb-3 pr-4 text-[9px] font-black text-gray-400 uppercase tracking-widest">Joined</th>
                                    <th className="pb-3 pr-4 text-[9px] font-black text-gray-400 uppercase tracking-widest">Xaaladda Lacagta</th>
                                    <th className="pb-3 pr-4 text-[9px] font-black text-gray-400 uppercase tracking-widest">Goal</th>
                                    <th className="pb-3 pr-4 text-[9px] font-black text-gray-400 uppercase tracking-widest">Track</th>
                                    <th className="pb-3 pr-4 text-[9px] font-black text-gray-400 uppercase tracking-widest">Recommended</th>
                                    <th className="pb-3 pr-4 text-[9px] font-black text-gray-400 uppercase tracking-widest">Email verified</th>
                                    <th className="pb-3 pr-4 text-[9px] font-black text-gray-400 uppercase tracking-widest text-center">Completions</th>
                                    <th className="pb-3 pr-2 text-[9px] font-black text-gray-400 uppercase tracking-widest text-center">WhatsApp</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredResults.map((row: AdminUserRow) => (
                                    <tr
                                        key={row.id}
                                        className={`border-b border-gray-50 hover:bg-gray-50/80 ${row.has_failed_payment ? "border-l-4 border-l-orange-400" : ""}`}
                                    >
                                        <td className="py-3 pr-4">
                                            <div className="text-xs font-bold text-gray-900">{row.name || "—"}</div>
                                            <div className="text-[9px] text-gray-500 truncate max-w-[200px]" title={row.email}>{row.email}</div>
                                        </td>
                                        <td className="py-3 pr-4 text-xs text-gray-700">
                                            {row.date_joined ? new Date(row.date_joined).toLocaleDateString("en-US", { month: "short", day: "numeric" }) : "—"}
                                        </td>
                                        <td className="py-3 pr-4">
                                            {row.is_premium ? (
                                                <span className="inline-flex px-2 py-0.5 text-[10px] font-bold rounded-lg bg-emerald-100 text-emerald-800">Premium</span>
                                            ) : row.has_failed_payment ? (
                                                <span className="inline-flex px-2 py-0.5 text-[10px] font-bold rounded-lg bg-orange-100 text-orange-900">Lacag bixin la isku dayey</span>
                                            ) : (
                                                <span className="inline-flex px-2 py-0.5 text-[10px] font-bold rounded-lg bg-gray-100 text-gray-500">Bilaash</span>
                                            )}
                                        </td>
                                        <td className="py-3 pr-4 text-xs text-gray-700">{row.onboarding?.goal_label ?? "—"}</td>
                                        <td className="py-3 pr-4 text-xs text-gray-700">{row.onboarding?.topic ?? "—"}</td>
                                        <td className={`py-3 pr-4 text-xs ${row.recommended_courses?.length ? "text-gray-700" : "text-zinc-500"}`} title={row.recommended_courses?.join(", ")}>
                                            {row.recommended_courses?.length ? truncateRecommended(row.recommended_courses, 30) : "—"}
                                        </td>
                                        <td className="py-3 pr-4">
                                            {row.is_email_verified ? (
                                                <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold rounded-lg bg-emerald-100 text-emerald-800">
                                                    <CheckCircle className="w-3 h-3" /> Verified
                                                </span>
                                            ) : (
                                                <span className="inline-flex px-2 py-0.5 text-[10px] font-bold rounded-lg bg-amber-50 text-amber-700">Not verified</span>
                                            )}
                                        </td>
                                        <td className="py-3 pr-4 text-xs text-gray-700 text-center">{row.completions ?? 0}</td>
                                        <td className="py-3 pr-2 text-center">
                                            <a
                                                href={row.whatsapp_href || "https://wa.me/"}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center justify-center w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-100 transition-colors"
                                                title="WhatsApp"
                                            >
                                                <MessageCircle className="w-4 h-4" />
                                            </a>
                                        </td>
                                    </tr>
                                ))}
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

function OnboardingSection({ stats }: { stats: OnboardingStats }) {
    const total = stats.total_with_onboarding ?? (Object.values(stats.goals).reduce((a, b) => a + b, 0) || 1);
    const completionRate = stats.completion_rate ?? 0;

    const barEntries = (data: Record<string, number>, title: string) => {
        const entries = Object.entries(data).filter(([, v]) => v > 0);
        const maxCount = Math.max(...entries.map(([, v]) => v), 1);
        const topCount = entries.length ? Math.max(...entries.map(([, v]) => v)) : 0;
        return (
            <div className="space-y-3">
                <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{title}</h3>
                <div className="space-y-2">
                    {entries.map(([label, count]) => {
                        const pct = total > 0 ? Math.round((count / total) * 100) : 0;
                        const widthPct = maxCount > 0 ? (count / maxCount) * 100 : 0;
                        const isTop = count === topCount && count > 0;
                        return (
                            <div key={label} className="flex items-center gap-3">
                                <div className="w-32 flex-shrink-0 text-xs font-medium text-gray-700 truncate" title={label}>{label}</div>
                                <div className="flex-1 min-w-0 h-6 bg-gray-100 rounded-lg overflow-hidden flex items-center">
                                    <div
                                        className={`h-full rounded-lg transition-all ${isTop ? "bg-violet-600 ring-2 ring-violet-400" : "bg-violet-500/80"}`}
                                        style={{ width: `${widthPct}%`, minWidth: count > 0 ? "4px" : "0" }}
                                    />
                                </div>
                                <div className="flex-shrink-0 flex items-center gap-1.5 w-20 justify-end">
                                    <span className="text-xs font-black text-gray-900">{count}</span>
                                    <span className="text-[9px] text-gray-400">({pct}%)</span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    };

    return (
        <div className="bg-white rounded-3xl p-8 border border-gray-50 shadow-sm">
            <h2 className="text-lg font-black text-gray-900 mb-2 tracking-tight flex items-center gap-3">
                <Target className="w-5 h-5 text-violet-600" />
                Onboarding Insights — {total} users
            </h2>
            <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest mb-6">
                Completion rate: {completionRate}%
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {barEntries(stats.goals, "Goals")}
                {barEntries(stats.tracks, "Tracks")}
                {barEntries(stats.levels, "Levels")}
                {barEntries(stats.time_per_day, "Time per day")}
            </div>
        </div>
    );
}
