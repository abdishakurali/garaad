"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
    cohortAdminApi,
    type AdminCohortRow,
    type CreateCohortPayload,
} from "@/lib/admin/cohorts";
import { analyticsService } from "@/lib/admin/analytics";
import type { ApiError } from "@/lib/admin-api";
import { useChallengeStatus } from "@/hooks/useChallengeStatus";
import {
    GraduationCap,
    Loader2,
    ArrowLeft,
    RefreshCw,
    PlusCircle,
    AlertCircle,
} from "lucide-react";

type EnrollmentsPayload = Awaited<
    ReturnType<typeof analyticsService.getCohortEnrollments>
>["data"];

export default function AdminCohortsPage() {
    const { data: challengeLive, refresh: refreshChallenge } = useChallengeStatus();
    const [cohorts, setCohorts] = useState<AdminCohortRow[]>([]);
    const [cohortsLoading, setCohortsLoading] = useState(true);
    const [cohortsError, setCohortsError] = useState<string | null>(null);

    const [enrollmentData, setEnrollmentData] = useState<EnrollmentsPayload | null>(null);
    const [enrollmentLoading, setEnrollmentLoading] = useState(true);

    const [form, setForm] = useState<CreateCohortPayload>({
        name: "",
        start_date: "",
        end_date: "",
        max_students: 10,
        is_active: false,
        is_waitlist_only: false,
    });
    const [saving, setSaving] = useState(false);
    const [formMessage, setFormMessage] = useState<{ type: "ok" | "err"; text: string } | null>(
        null
    );

    const loadCohorts = useCallback(async () => {
        setCohortsLoading(true);
        setCohortsError(null);
        try {
            const list = await cohortAdminApi.listCohorts();
            setCohorts(list);
        } catch (e) {
            const err = e as ApiError;
            const status = err.response?.status;
            const detail =
                (err.response?.data as { detail?: string })?.detail ||
                err.message ||
                "Lama soo saari karin liiska kooxaha.";
            setCohorts([]);
            setCohortsError(
                status === 404
                    ? "404: Backend-ku ma diyaarin GET /api/cohorts/ (liiska kooxaha). Hubi Django: ViewSet list + router. Akhri docs/BACKEND_ADMIN_COHORTS.md. Haddii route-ku meel kale yahay, isticmaal NEXT_PUBLIC_ADMIN_COHORTS_API_PREFIX."
                    : detail
            );
        } finally {
            setCohortsLoading(false);
        }
    }, []);

    const loadEnrollments = useCallback(async () => {
        setEnrollmentLoading(true);
        try {
            const res = await analyticsService.getCohortEnrollments();
            setEnrollmentData(res.data ?? null);
        } catch {
            setEnrollmentData(null);
        } finally {
            setEnrollmentLoading(false);
        }
    }, []);

    useEffect(() => {
        void loadCohorts();
        void loadEnrollments();
    }, [loadCohorts, loadEnrollments]);

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        setFormMessage(null);
        if (!form.name.trim() || !form.start_date || !form.end_date) {
            setFormMessage({ type: "err", text: "Buuxi magaca iyo taariikhaha." });
            return;
        }
        setSaving(true);
        try {
            await cohortAdminApi.createCohort({
                ...form,
                name: form.name.trim(),
                max_students: Math.max(1, Number(form.max_students) || 10),
            });
            setFormMessage({ type: "ok", text: "Kooxda waa la abuuray." });
            setForm({
                name: "",
                start_date: "",
                end_date: "",
                max_students: 10,
                is_active: false,
                is_waitlist_only: false,
            });
            await loadCohorts();
            refreshChallenge();
        } catch (e) {
            const err = e as ApiError;
            const msg =
                (err.response?.data as { detail?: string; message?: string })?.detail ||
                (err.response?.data as { message?: string })?.message ||
                err.message ||
                "Abuurista waa guuldareysatay. Hubi in POST /api/cohorts/ uu jiro.";
            setFormMessage({ type: "err", text: msg });
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="animate-fade-in space-y-8 max-w-6xl mx-auto">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <Link
                        href="/admin/dashboard"
                        className="inline-flex items-center gap-2 text-sm font-bold text-blue-600 hover:text-blue-800 mb-2"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Dashboard
                    </Link>
                    <h1 className="text-3xl font-black text-gray-900 tracking-tight flex items-center gap-2">
                        <GraduationCap className="w-8 h-8 text-violet-600" />
                        Kooxaha Challenge
                    </h1>
                    <p className="text-gray-500 text-sm mt-1 font-medium">
                        Abuur koox, arag liiska, oo maamul diiwaangelinta ardayda.
                    </p>
                </div>
                <button
                    type="button"
                    onClick={() => {
                        void loadCohorts();
                        void loadEnrollments();
                        refreshChallenge();
                    }}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 font-bold text-sm text-gray-700 hover:bg-gray-50"
                >
                    <RefreshCw className="w-4 h-4" />
                    Cusboonaysii
                </button>
            </div>

            {/* Live challenge (public status) */}
            <div className="rounded-2xl border border-violet-100 bg-violet-50/50 p-5">
                <h2 className="text-xs font-black text-violet-800 uppercase tracking-widest mb-2">
                    Xaaladda hadda (challenge-status)
                </h2>
                <p className="text-sm text-gray-800">
                    <strong className="text-violet-900">
                        {challengeLive?.active_cohort_name ?? "—"}
                    </strong>
                    {challengeLive?.max_students != null && (
                        <span className="text-gray-600">
                            {" "}
                            · {challengeLive.enrolled_count ?? 0}/{challengeLive.max_students} arday
                            · boosyo haray: {challengeLive.spots_remaining}
                        </span>
                    )}
                </p>
                {challengeLive?.is_waitlist_only && (
                    <p className="text-xs text-amber-700 font-bold mt-2">Hadda: liiska sugitaanka kaliya</p>
                )}
            </div>

            {/* Create cohort */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm">
                <h2 className="text-lg font-black text-gray-900 mb-4 flex items-center gap-2">
                    <PlusCircle className="w-5 h-5 text-emerald-600" />
                    Abuur koox cusub
                </h2>
                <p className="text-xs text-gray-500 mb-4">
                    POST <code className="bg-gray-100 px-1 rounded">/api/cohorts/</code> — haddii aad
                    404 aragto, ku dar endpoint-ka backend-ka.
                </p>
                {formMessage && (
                    <div
                        className={`mb-4 p-3 rounded-xl text-sm font-medium ${
                            formMessage.type === "ok"
                                ? "bg-emerald-50 text-emerald-800 border border-emerald-100"
                                : "bg-red-50 text-red-800 border border-red-100"
                        }`}
                    >
                        {formMessage.text}
                    </div>
                )}
                <form onSubmit={handleCreate} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="sm:col-span-2">
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
                            Magaca kooxda *
                        </label>
                        <input
                            type="text"
                            value={form.name}
                            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                            className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-medium"
                            placeholder="Tusaale: Challenge Maarso 2025"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
                            Taariikhda bilowga *
                        </label>
                        <input
                            type="date"
                            value={form.start_date}
                            onChange={(e) => setForm((f) => ({ ...f, start_date: e.target.value }))}
                            className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
                            Taariikhda dhamaadka *
                        </label>
                        <input
                            type="date"
                            value={form.end_date}
                            onChange={(e) => setForm((f) => ({ ...f, end_date: e.target.value }))}
                            className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
                            Ugu badnaan arday
                        </label>
                        <input
                            type="number"
                            min={1}
                            value={form.max_students}
                            onChange={(e) =>
                                setForm((f) => ({
                                    ...f,
                                    max_students: parseInt(e.target.value, 10) || 1,
                                }))
                            }
                            className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm"
                        />
                    </div>
                    <div className="flex flex-col gap-3 justify-end">
                        <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                            <input
                                type="checkbox"
                                checked={!!form.is_active}
                                onChange={(e) =>
                                    setForm((f) => ({ ...f, is_active: e.target.checked }))
                                }
                            />
                            Kooxda firfircoon (haddii backend uu taageero)
                        </label>
                        <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                            <input
                                type="checkbox"
                                checked={!!form.is_waitlist_only}
                                onChange={(e) =>
                                    setForm((f) => ({ ...f, is_waitlist_only: e.target.checked }))
                                }
                            />
                            Liiska sugitaanka kaliya
                        </label>
                    </div>
                    <div className="sm:col-span-2">
                        <button
                            type="submit"
                            disabled={saving}
                            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-blue-600 text-white font-bold text-sm hover:bg-blue-700 disabled:opacity-50"
                        >
                            {saving ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                                <PlusCircle className="w-4 h-4" />
                            )}
                            Abuur koox
                        </button>
                    </div>
                </form>
            </div>

            {/* Cohort list */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm overflow-x-auto">
                <h2 className="text-lg font-black text-gray-900 mb-4">Dhammaan kooxaha</h2>
                {cohortsLoading ? (
                    <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
                ) : cohortsError ? (
                    <div className="flex gap-3 p-4 rounded-xl bg-amber-50 border border-amber-100 text-amber-900 text-sm">
                        <AlertCircle className="w-5 h-5 shrink-0" />
                        <p>{cohortsError}</p>
                    </div>
                ) : cohorts.length === 0 ? (
                    <p className="text-gray-500 text-sm">Weli koox lama abuurin ama liiska waa madhan.</p>
                ) : (
                    <table className="w-full text-left text-sm min-w-[640px]">
                        <thead>
                            <tr className="text-gray-400 font-black uppercase text-[10px] tracking-wider border-b border-gray-100">
                                <th className="pb-2 pr-3">Magac</th>
                                <th className="pb-2 pr-3">Bilow</th>
                                <th className="pb-2 pr-3">Dhamaad</th>
                                <th className="pb-2 pr-3">Arday</th>
                                <th className="pb-2 pr-3">Xaalad</th>
                            </tr>
                        </thead>
                        <tbody>
                            {cohorts.map((c) => (
                                <tr key={c.id} className="border-b border-gray-50">
                                    <td className="py-2.5 pr-3 font-bold text-gray-900">{c.name}</td>
                                    <td className="py-2.5 pr-3 text-gray-600">
                                        {c.start_date
                                            ? new Date(c.start_date).toLocaleDateString()
                                            : "—"}
                                    </td>
                                    <td className="py-2.5 pr-3 text-gray-600">
                                        {c.end_date ? new Date(c.end_date).toLocaleDateString() : "—"}
                                    </td>
                                    <td className="py-2.5 pr-3">
                                        {c.enrolled_count ?? "—"}
                                        {c.max_students != null ? ` / ${c.max_students}` : ""}
                                    </td>
                                    <td className="py-2.5 pr-3">
                                        {c.is_active ? (
                                            <span className="text-emerald-700 font-bold text-xs">Firfircoon</span>
                                        ) : (
                                            <span className="text-gray-400 text-xs">—</span>
                                        )}
                                        {c.is_waitlist_only ? (
                                            <span className="ml-2 text-amber-600 text-xs font-bold">
                                                Sugitaan
                                            </span>
                                        ) : null}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Enrollments (existing API) */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm overflow-x-auto">
                <h2 className="text-lg font-black text-gray-900 mb-2 flex items-center gap-2">
                    <GraduationCap className="w-5 h-5 text-violet-600" />
                    Diiwaangelinta ardayda (kooxda firfircoon)
                </h2>
                <p className="text-xs text-gray-500 mb-4">
                    GET <code className="bg-gray-100 px-1 rounded">/api/cohorts/enrollments/</code>
                </p>
                {enrollmentLoading ? (
                    <Loader2 className="w-8 h-8 text-violet-600 animate-spin" />
                ) : !enrollmentData?.cohort ? (
                    <p className="text-sm text-gray-500 font-medium">Koox firfircoon lama helin.</p>
                ) : (
                    <>
                        <p className="text-sm font-bold text-gray-800 mb-4">
                            {enrollmentData.cohort.name} · ugu badnaan{" "}
                            {enrollmentData.cohort.max_students} arday
                        </p>
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
                                {enrollmentData.enrollments.map((row) => (
                                    <tr key={row.id} className="border-b border-gray-50">
                                        <td className="py-2 pr-3 font-bold text-gray-900">{row.name}</td>
                                        <td className="py-2 pr-3 text-gray-600">{row.email}</td>
                                        <td className="py-2 pr-3 text-gray-600">
                                            {row.enrolled_at
                                                ? new Date(row.enrolled_at).toLocaleDateString()
                                                : "—"}
                                        </td>
                                        <td className="py-2 pr-3 font-mono">
                                            {row.weekly_calls_attended_count}/6
                                        </td>
                                        <td className="py-2 pr-3">{row.code_reviews_completed}</td>
                                        <td className="py-2 pr-3">
                                            {row.certificate_issued ? "Haa" : "Maya"}
                                        </td>
                                        <td className="py-2 flex flex-wrap gap-1">
                                            <button
                                                type="button"
                                                className="px-2 py-1 rounded-lg bg-emerald-100 text-emerald-800 font-bold"
                                                onClick={() => {
                                                    void analyticsService
                                                        .patchCohortEnrollment(
                                                            row.id,
                                                            "mark_call_attended"
                                                        )
                                                        .then(() => loadEnrollments());
                                                }}
                                            >
                                                Calaamadi wicitaan
                                            </button>
                                            <button
                                                type="button"
                                                className="px-2 py-1 rounded-lg bg-violet-100 text-violet-800 font-bold"
                                                onClick={() => {
                                                    void analyticsService
                                                        .patchCohortEnrollment(
                                                            row.id,
                                                            "issue_certificate"
                                                        )
                                                        .then(() => loadEnrollments());
                                                }}
                                            >
                                                Sii shahaadada
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </>
                )}
            </div>
        </div>
    );
}
