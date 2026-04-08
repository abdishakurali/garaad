"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import { launchpadService } from "@/services/launchpad";
import { coursesService, type Course } from "@/services/courses";
import type { ProjectFormData } from "@/types/launchpad";
import { TECH_STACK_OPTIONS, LAUNCHPAD_UI_TEXT } from "@/types/launchpad";
import { FolderKanban, Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { ActionToast } from "@/components/launchpad/ActionToast";

export default function SubmitProjectPage() {
    const router = useRouter();
    const { isAuthenticated, isLoading: authLoading } = useAuthStore();
    const [courses, setCourses] = useState<Course[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showActionToast, setShowActionToast] = useState(false);

    const [formData, setFormData] = useState<ProjectFormData>({
        title: "",
        tagline: "",
        description: "",
        logo_url: "",
        website_url: "",
        repo_url: "",
        tech_stack: [],
        course: null,
    });

    useEffect(() => {
        if (!authLoading && !isAuthenticated) {
            router.replace("/login?redirect=/launchpad/submit-project");
            return;
        }
        const fetchCourses = async () => {
            try {
                const list = await coursesService.getCourses();
                const arr = Array.isArray(list) ? list : (list as { results?: Course[] })?.results ?? [];
                setCourses(arr);
            } catch (err) {
                console.error("Failed to fetch courses:", err);
            }
        };
        fetchCourses();
    }, [authLoading, isAuthenticated, router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const title = formData.title.trim();
        const tagline = formData.tagline.trim();
        if (!title || !tagline) {
            setError("Magaca iyo hal xariiq waa loo baahan yahay.");
            return;
        }
        setError(null);
        setIsSubmitting(true);
        try {
            await launchpadService.createProject({
                ...formData,
                title,
                tagline,
                description: formData.description?.trim() ?? "",
                logo_url: formData.logo_url?.trim() ?? "",
                website_url: formData.website_url?.trim() ?? "",
                repo_url: formData.repo_url?.trim() ?? "",
                tech_stack: formData.tech_stack ?? [],
                course: formData.course ?? null,
            });
            setShowActionToast(true);
            setTimeout(() => {
                setShowActionToast(false);
                router.push("/launchpad?tab=projects");
            }, 1500);
        } catch (err: unknown) {
            setError("Wax qalad ah ayaa dhacay. Isku day markale.");
            console.error(err);
        } finally {
            setIsSubmitting(false);
        }
    };

    const toggleTech = (tech: string) => {
        setFormData((prev) => ({
            ...prev,
            tech_stack: prev.tech_stack.includes(tech)
                ? prev.tech_stack.filter((t) => t !== tech)
                : [...prev.tech_stack, tech],
        }));
    };

    if (!authLoading && !isAuthenticated) return null;

    return (
        <div className="min-h-screen bg-background">
            {showActionToast && (
                <ActionToast message="✓ Project submitted" onDismiss={() => setShowActionToast(false)} />
            )}
            <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <Link
                    href="/launchpad"
                    className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Launchpad
                </Link>
                <div className="flex items-center gap-3 mb-8">
                    <FolderKanban className="w-10 h-10 text-primary" />
                    <div>
                        <h1 className="text-2xl font-bold">Mashruuc Cusub Soo Gudbi</h1>
                        <p className="text-sm text-muted-foreground">Hal xariiq ku sharax (Submit a project)</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {error && (
                        <div className="rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 text-sm">
                            {error}
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-medium mb-2">Magaca (Title) *</label>
                        <input
                            type="text"
                            maxLength={120}
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            placeholder="Magaca mashruucaaga"
                            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary"
                            required
                        />
                        <span className="text-xs text-muted-foreground">{formData.title.length}/120</span>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">Hal xariiq (Tagline) *</label>
                        <input
                            type="text"
                            maxLength={200}
                            value={formData.tagline}
                            onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                            placeholder="Hal xariiq ku sharax"
                            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary"
                            required
                        />
                        <span className="text-xs text-muted-foreground">{formData.tagline.length}/200</span>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">Sharaxaad (Description)</label>
                        <textarea
                            rows={4}
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            placeholder="Sharax gaaban..."
                            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary resize-none"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">Website URL</label>
                        <input
                            type="url"
                            value={formData.website_url}
                            onChange={(e) => setFormData({ ...formData, website_url: e.target.value })}
                            placeholder="https://..."
                            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">Repo URL (GitHub)</label>
                        <input
                            type="url"
                            value={formData.repo_url}
                            onChange={(e) => setFormData({ ...formData, repo_url: e.target.value })}
                            placeholder="https://github.com/..."
                            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">Logo URL</label>
                        <input
                            type="url"
                            value={formData.logo_url}
                            onChange={(e) => setFormData({ ...formData, logo_url: e.target.value })}
                            placeholder="https://..."
                            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">Tech Stack</label>
                        <div className="flex flex-wrap gap-2">
                            {TECH_STACK_OPTIONS.map((tech) => (
                                <button
                                    key={tech}
                                    type="button"
                                    onClick={() => toggleTech(tech)}
                                    className={`rounded-lg border px-3 py-1.5 text-sm transition ${
                                        formData.tech_stack.includes(tech)
                                            ? "border-primary bg-primary/20 text-primary"
                                            : "border-white/10 bg-white/5 hover:border-white/20"
                                    }`}
                                >
                                    {tech}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">Koorsadee ayaad ku dhisay? (Built during course)</label>
                        <select
                            value={formData.course ?? ""}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    course: e.target.value ? Number(e.target.value) : null,
                                })
                            }
                            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-foreground focus:outline-none focus:border-primary"
                        >
                            <option value="">-- Ma dooran --</option>
                            {courses.map((c) => (
                                <option key={c.id} value={c.id}>
                                    {c.title}
                                </option>
                            ))}
                        </select>
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl bg-primary text-white font-bold hover:bg-primary/90 disabled:opacity-50 transition"
                    >
                        {isSubmitting ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                            <>Mashruuca Soo Gudbi →</>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
}
