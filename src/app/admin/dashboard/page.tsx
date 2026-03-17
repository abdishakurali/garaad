"use client";

import React, { useState, useEffect, useMemo } from "react";
import { analyticsService, UserAnalytics, RevenueAnalytics, CourseAnalytics, RecentActivity } from "@/lib/admin/analytics";
import type { UserListItem, AdminUsersResponse, AdminUserRow } from "@/lib/admin/analytics";
import KPICard from "@/components/admin/dashboard/KPICard";
import TrendChart from "@/components/admin/dashboard/TrendChart";
import Link from "next/link";
import { Users, DollarSign, TrendingUp, ShoppingCart, Award, AlertCircle, Loader2, ArrowRight, CheckCircle, Target, RotateCcw } from "lucide-react";
import type { OnboardingStats } from "@/lib/admin/analytics";

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
    const [usersFilterLevel, setUsersFilterLevel] = useState<string>(ALL);
    const [usersFilterPremium, setUsersFilterPremium] = useState<string>("");
    const [usersFilterVerified, setUsersFilterVerified] = useState<string>("");

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

    useEffect(() => {
        const fetchAllData = async () => {
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
        };

        fetchAllData();
    }, []);

    const usersFilters = useMemo(() => ({
        goal: usersFilterGoal,
        track: usersFilterTrack,
        level: usersFilterLevel,
        is_premium: (usersFilterPremium === "Pro" ? "true" : usersFilterPremium === "Free" ? "false" : "") as "true" | "false" | "",
        is_email_verified: (usersFilterVerified === "Verified" ? "true" : usersFilterVerified === "Not verified" ? "false" : "") as "true" | "false" | "",
    }), [usersFilterGoal, usersFilterTrack, usersFilterLevel, usersFilterPremium, usersFilterVerified]);

    useEffect(() => {
        if (activeTab !== "users") return;
        let cancelled = false;
        setAdminUsersLoading(true);
        analyticsService.getAdminUsers(usersPage, usersSearch || undefined, usersFilters).then((data) => {
            if (!cancelled) {
                setAdminUsersData(data);
                setAdminUsersLoading(false);
            }
        }).catch(() => {
            if (!cancelled) setAdminUsersLoading(false);
        });
        return () => { cancelled = true; };
    }, [activeTab, usersPage, usersSearch, usersFilters]);

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
                    onClick={() => window.location.reload()}
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
                    onClick={() => setActiveTab("overview")}
                    className={`px-4 py-2.5 text-sm font-bold rounded-t-xl border-b-2 transition-colors ${activeTab === "overview" ? "border-blue-600 text-blue-700 bg-blue-50/50" : "border-transparent text-gray-500 hover:text-gray-800 hover:bg-gray-50"}`}
                >
                    Overview
                </button>
                <button
                    type="button"
                    onClick={() => setActiveTab("users")}
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
                    filterLevel={usersFilterLevel}
                    filterPremium={usersFilterPremium}
                    filterVerified={usersFilterVerified}
                    onFilterGoalChange={(v) => { setUsersFilterGoal(v); setUsersPage(1); }}
                    onFilterTrackChange={(v) => { setUsersFilterTrack(v); setUsersPage(1); }}
                    onFilterLevelChange={(v) => { setUsersFilterLevel(v); setUsersPage(1); }}
                    onFilterPremiumChange={(v) => { setUsersFilterPremium(v); setUsersPage(1); }}
                    onFilterVerifiedChange={(v) => { setUsersFilterVerified(v); setUsersPage(1); }}
                    onFiltersReset={() => {
                        setUsersFilterGoal(ALL);
                        setUsersFilterTrack(ALL);
                        setUsersFilterLevel(ALL);
                        setUsersFilterPremium("");
                        setUsersFilterVerified("");
                        setUsersPage(1);
                    }}
                    goalLabels={GOAL_LABELS}
                    trackLabels={TRACK_LABELS}
                    levelOptions={LEVEL_OPTIONS}
                    allLabel={ALL}
                />
            )}

            {activeTab === "overview" && (
            <>
            {/* Top KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
                    title="Dhakhliga (Revenue)"
                    value={revenueStats.total}
                    change={revenueStats.change}
                    trend={revenueStats.change >= 0 ? "up" : "down"}
                    prefix="$"
                    decimals={2}
                    icon={<DollarSign className="w-5 h-5" />}
                />
                <KPICard
                    title="Conversion Rate"
                    value={revenueStats.conversionRate}
                    change={revenueStats.conversionChange}
                    trend={revenueStats.conversionChange >= 0 ? "up" : "down"}
                    suffix="%"
                    decimals={1}
                    icon={<ShoppingCart className="w-5 h-5" />}
                />
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

function AdminUsersTab({
    data,
    loading,
    page,
    search,
    onPageChange,
    onSearchChange,
    filterGoal,
    filterTrack,
    filterLevel,
    filterPremium,
    filterVerified,
    onFilterGoalChange,
    onFilterTrackChange,
    onFilterLevelChange,
    onFilterPremiumChange,
    onFilterVerifiedChange,
    onFiltersReset,
    goalLabels,
    trackLabels,
    levelOptions,
    allLabel,
}: {
    data: AdminUsersResponse | null;
    loading: boolean;
    page: number;
    search: string;
    onPageChange: (p: number) => void;
    onSearchChange: (s: string) => void;
    filterGoal: string;
    filterTrack: string;
    filterLevel: string;
    filterPremium: string;
    filterVerified: string;
    onFilterGoalChange: (v: string) => void;
    onFilterTrackChange: (v: string) => void;
    onFilterLevelChange: (v: string) => void;
    onFilterPremiumChange: (v: string) => void;
    onFilterVerifiedChange: (v: string) => void;
    onFiltersReset: () => void;
    goalLabels: string[];
    trackLabels: string[];
    levelOptions: string[];
    allLabel: string;
}) {
    const summary = data?.summary;
    const results = data?.results ?? [];
    const count = data?.count ?? 0;
    const pageSize = 25;
    const start = (page - 1) * pageSize + 1;
    const end = Math.min(page * pageSize, count);
    const hasActiveFilters = filterGoal !== allLabel || filterTrack !== allLabel || filterLevel !== allLabel || filterPremium !== "" || filterVerified !== "";

    return (
        <div className="bg-white rounded-3xl p-8 border border-gray-50 shadow-sm">
            <h2 className="text-lg font-black text-gray-900 mb-4 tracking-tight flex items-center gap-3">
                <Users className="w-5 h-5 text-blue-600" />
                Isticmaalayaasha
            </h2>
            {summary && (
                <div className="flex flex-wrap gap-6 mb-6 p-4 bg-gray-50/50 rounded-2xl border border-gray-100">
                    <span className="text-xs font-bold text-gray-700">Total users: <strong className="text-gray-900">{summary.total_users}</strong></span>
                    <span className="text-xs font-bold text-gray-700">Premium: <strong className="text-gray-900">{summary.premium}</strong></span>
                    <span className="text-xs font-bold text-gray-700">Verified: <strong className="text-gray-900">{summary.verified ?? 0}</strong></span>
                    <span className="text-xs font-bold text-gray-700">With onboarding: <strong className="text-gray-900">{summary.with_onboarding}</strong></span>
                    <span className="text-xs font-bold text-gray-700">No onboarding: <strong className="text-gray-900">{summary.no_onboarding}</strong></span>
                </div>
            )}
            <input
                type="text"
                placeholder="Search by name or email..."
                value={search}
                onChange={(e) => { onSearchChange(e.target.value); onPageChange(1); }}
                className="w-full max-w-md mb-4 px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
            <div className="flex flex-wrap items-center gap-3 mb-4">
                <select
                    value={filterGoal}
                    onChange={(e) => onFilterGoalChange(e.target.value)}
                    className="text-xs font-bold text-gray-700 bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none min-w-0 max-w-[180px]"
                >
                    <option value={allLabel}>{allLabel}</option>
                    {goalLabels.map((label) => (
                        <option key={label} value={label}>{label}</option>
                    ))}
                </select>
                <select
                    value={filterTrack}
                    onChange={(e) => onFilterTrackChange(e.target.value)}
                    className="text-xs font-bold text-gray-700 bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none min-w-0 max-w-[180px]"
                >
                    <option value={allLabel}>{allLabel}</option>
                    {trackLabels.map((label) => (
                        <option key={label} value={label}>{label}</option>
                    ))}
                </select>
                <select
                    value={filterLevel}
                    onChange={(e) => onFilterLevelChange(e.target.value)}
                    className="text-xs font-bold text-gray-700 bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none min-w-0 max-w-[140px]"
                >
                    <option value={allLabel}>{allLabel}</option>
                    {levelOptions.map((label) => (
                        <option key={label} value={label}>{label}</option>
                    ))}
                </select>
                <select
                    value={filterPremium}
                    onChange={(e) => onFilterPremiumChange(e.target.value)}
                    className="text-xs font-bold text-gray-700 bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none min-w-0 max-w-[100px]"
                >
                    <option value="">All</option>
                    <option value="Pro">Pro</option>
                    <option value="Free">Free</option>
                </select>
                <select
                    value={filterVerified}
                    onChange={(e) => onFilterVerifiedChange(e.target.value)}
                    className="text-xs font-bold text-gray-700 bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none min-w-0 max-w-[120px]"
                >
                    <option value="">All</option>
                    <option value="Verified">Verified</option>
                    <option value="Not verified">Not verified</option>
                </select>
                {hasActiveFilters && (
                    <button
                        type="button"
                        onClick={onFiltersReset}
                        className="inline-flex items-center gap-1.5 text-[10px] font-bold text-blue-600 hover:text-blue-700 px-2.5 py-1.5 rounded-lg hover:bg-blue-50 border border-blue-200/60 transition-colors"
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
                    <div className="overflow-x-auto -mx-2">
                        <table className="w-full text-left border-collapse min-w-[640px]">
                            <thead>
                                <tr className="border-b border-gray-100">
                                    <th className="pb-3 pr-4 text-[9px] font-black text-gray-400 uppercase tracking-widest">Name / Email</th>
                                    <th className="pb-3 pr-4 text-[9px] font-black text-gray-400 uppercase tracking-widest">Joined</th>
                                    <th className="pb-3 pr-4 text-[9px] font-black text-gray-400 uppercase tracking-widest">Goal</th>
                                    <th className="pb-3 pr-4 text-[9px] font-black text-gray-400 uppercase tracking-widest">Track</th>
                                    <th className="pb-3 pr-4 text-[9px] font-black text-gray-400 uppercase tracking-widest">Recommended</th>
                                    <th className="pb-3 pr-4 text-[9px] font-black text-gray-400 uppercase tracking-widest">Premium</th>
                                    <th className="pb-3 pr-4 text-[9px] font-black text-gray-400 uppercase tracking-widest">Email verified</th>
                                    <th className="pb-3 pr-4 text-[9px] font-black text-gray-400 uppercase tracking-widest text-center">Completions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {results.map((row: AdminUserRow) => (
                                    <tr key={row.id} className="border-b border-gray-50 hover:bg-white/[0.04]">
                                        <td className="py-3 pr-4">
                                            <div className="text-xs font-bold text-gray-900">{row.name || "—"}</div>
                                            <div className="text-[9px] text-gray-500 truncate max-w-[200px]" title={row.email}>{row.email}</div>
                                        </td>
                                        <td className="py-3 pr-4 text-xs text-gray-700">
                                            {row.date_joined ? new Date(row.date_joined).toLocaleDateString("en-US", { month: "short", day: "numeric" }) : "—"}
                                        </td>
                                        <td className="py-3 pr-4 text-xs text-gray-700">{row.onboarding?.goal_label ?? "—"}</td>
                                        <td className="py-3 pr-4 text-xs text-gray-700">{row.onboarding?.topic ?? "—"}</td>
                                        <td className={`py-3 pr-4 text-xs ${row.recommended_courses?.length ? "text-gray-700" : "text-zinc-500"}`} title={row.recommended_courses?.join(", ")}>
                                            {row.recommended_courses?.length ? truncateRecommended(row.recommended_courses, 30) : "—"}
                                        </td>
                                        <td className="py-3 pr-4">
                                            {row.is_premium ? (
                                                <span className="inline-flex px-2 py-0.5 text-[10px] font-bold rounded-lg bg-green-100 text-green-800">Pro</span>
                                            ) : (
                                                <span className="inline-flex px-2 py-0.5 text-[10px] font-bold rounded-lg bg-gray-100 text-gray-500">Free</span>
                                            )}
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
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    {count > 0 && (
                        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                            <p className="text-[9px] text-gray-500 font-bold uppercase tracking-widest">
                                Showing {start}–{end} of {count} users
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
