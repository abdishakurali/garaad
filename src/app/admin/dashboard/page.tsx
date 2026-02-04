"use client";

import React, { useState, useEffect } from "react";
import { analyticsService, UserAnalytics, RevenueAnalytics, CourseAnalytics, RecentActivity } from "@/lib/admin/analytics";
import KPICard from "@/components/admin/dashboard/KPICard";
import TrendChart from "@/components/admin/dashboard/TrendChart";
import Link from "next/link";
import { Users, DollarSign, TrendingUp, ShoppingCart, Award, AlertCircle, Loader2, ArrowRight, CheckCircle } from "lucide-react";

export default function DashboardPage() {
    const [userStats, setUserStats] = useState<UserAnalytics | null>(null);
    const [revenueStats, setRevenueStats] = useState<RevenueAnalytics | null>(null);
    const [courseStats, setCourseStats] = useState<CourseAnalytics | null>(null);
    const [activityStats, setActivityStats] = useState<RecentActivity | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

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
        </div>
    );
}
