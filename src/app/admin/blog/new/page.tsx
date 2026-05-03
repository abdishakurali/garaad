"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { blogAdminApi } from "@/lib/admin-blog";
import TipTapEditor from "@/components/blog/TipTapEditor";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Loader2, ArrowLeft,  Upload } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

type SeoAudit = {
    score: number;
    recommendations: string[];
    internal_link_suggestions: string[];
    headline_suggestions: string[];
};

export default function NewBlogPostPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [title, setTitle] = useState("");
    const [body, setBody] = useState("");
    const [metaDescription, setMetaDescription] = useState("");
    const [tags, setTags] = useState("");
    const [coverImage, setCoverImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [seoAudit, setSeoAudit] = useState<SeoAudit | null>(null);

    const setFileFrom = useCallback((file: File | null) => {
        if (!file) return;
        if (!file.type.startsWith("image/")) {
            toast.error("Fadlan dooro fayl sawir ah (PNG, JPG, ...)");
            return;
        }
        setCoverImage(file);
        setImagePreview((prev) => {
            if (prev && prev.startsWith("blob:")) URL.revokeObjectURL(prev);
            return URL.createObjectURL(file);
        });
    }, []);

    const normalizeSeoAudit = (audit: Partial<SeoAudit> | null | undefined): SeoAudit => ({
        score: typeof audit?.score === "number" ? audit.score : 0,
        recommendations: Array.isArray(audit?.recommendations) ? audit.recommendations : [],
        internal_link_suggestions: Array.isArray(audit?.internal_link_suggestions)
            ? audit.internal_link_suggestions
            : [],
        headline_suggestions: Array.isArray(audit?.headline_suggestions) ? audit.headline_suggestions : [],
    });

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) setFileFrom(file);
    };

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    }, []);

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    }, []);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
        const file = e.dataTransfer.files?.[0];
        if (file) setFileFrom(file);
    }, [setFileFrom]);

    const runSeoAudit = async () => {
        const audit = normalizeSeoAudit(await blogAdminApi.seoAudit({
            title,
            body,
            meta_description: metaDescription,
            tags,
        }));
        setSeoAudit(audit);
        return audit;
    };

    const handleSubmit = async (publish: boolean = false) => {
        if (!title || !body || !metaDescription) {
            toast.error("Fadlan buuxi dhammaan meelaha muhiimka ah");
            return;
        }

        try {
            setLoading(true);
            if (publish) {
                const audit = await runSeoAudit();
                if (audit.score < 70) {
                    toast.error(`SEO score waa hooseeyaa (${audit.score}/100). Hagaaji ka hor publish.`);
                    setLoading(false);
                    return;
                }
            }
            const formData = new FormData();
            formData.append("title", title);
            formData.append("body", body);
            formData.append("meta_description", metaDescription);
            formData.append("is_published", String(publish));
            if (coverImage) {
                formData.append("cover_image", coverImage);
            }

            formData.append("tags", tags.trim());

            const response = await blogAdminApi.createPost(formData);
            await blogAdminApi.revalidate(response.slug);
            toast.success(publish ? "Qoraalka waa la daabacay" : "Qoraalka waa la kaydiyey");
            router.push("/admin/blog");
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Waa lagu fashilmay kaydinta qoraalka");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6 max-w-5xl mx-auto space-y-8">
            <div className="flex items-center justify-between">
                <Link href="/admin/blog" className="flex items-center text-sm text-slate-500 hover:text-primary transition-colors">
                    <ArrowLeft className="mr-2 h-4 w-4" /> Labo dib u noqo
                </Link>
                <div className="flex gap-3">
                    <Button
                        variant="outline"
                        onClick={() => handleSubmit(false)}
                        disabled={loading}
                    >
                        {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                        Kaydi Qabyo ahaan
                    </Button>
                    <Button
                        onClick={() => handleSubmit(true)}
                        disabled={loading}
                    >
                        {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                        Daabac Qoraalka
                    </Button>
                </div>
            </div>

            <div className="space-y-6 bg-white p-8 rounded-2xl border border-slate-100 shadow-sm">
                <div className="space-y-2">
                    <Label htmlFor="title" className="text-lg font-semibold">Cinwaanka Qoraalka</Label>
                    <Input
                        id="title"
                        placeholder="Geli cinwaanka qoraalka..."
                        className="text-xl font-bold py-6"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        onBlur={() => {
                            void runSeoAudit();
                        }}
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="cover-image" className="font-medium">Sawirka Daboolka (Cover Image)</Label>
                            <div
                                role="button"
                                tabIndex={0}
                                onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); setIsDragging(true); }}
                                onDragLeave={(e) => { e.preventDefault(); e.stopPropagation(); setIsDragging(false); }}
                                onDrop={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    setIsDragging(false);
                                    const file = e.dataTransfer.files?.[0];
                                    if (file) setFileFrom(file);
                                }}
                                onClick={() => document.getElementById("cover-image")?.click()}
                                onKeyDown={(e) => e.key === "Enter" && document.getElementById("cover-image")?.click()}
                                className={cn(
                                    "border-2 border-dashed rounded-xl aspect-video flex flex-col items-center justify-center cursor-pointer transition-colors overflow-hidden relative min-h-[200px]",
                                    isDragging ? "border-primary bg-primary/10" : "border-slate-200 hover:border-primary"
                                )}
                            >
                                {imagePreview ? (
                                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover pointer-events-none" draggable={false} />
                                ) : (
                                    <>
                                        <Upload className="h-10 w-10 text-slate-300 mb-2" />
                                        <span className="text-sm text-slate-400 text-center px-4">Guji si aad sawir u soo geliso ama jiid oo tuur halkan</span>
                                    </>
                                )}
                            </div>
                            <input
                                id="cover-image"
                                type="file"
                                className="hidden"
                                accept="image/*"
                                onChange={handleImageChange}
                            />
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="meta-description" className="font-medium">SEO Meta Description (Max 160 xaraf)</Label>
                            <Textarea
                                id="meta-description"
                                placeholder="Qoraalka kooban oo SEO-ga loo isticmaalayo..."
                                className="h-[80px] resize-none"
                                maxLength={160}
                                value={metaDescription}
                                onChange={(e) => setMetaDescription(e.target.value)}
                                onBlur={() => {
                                    void runSeoAudit();
                                }}
                            />
                            <div className="text-right text-xs text-slate-400">
                                {metaDescription.length}/160
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="tags" className="font-medium">Tags (Ku kala saar kooma ,) — loo isticmaalo SEO</Label>
                            <Input
                                id="tags"
                                placeholder="coding, stem, tech..."
                                value={tags}
                                onChange={(e) => setTags(e.target.value)}
                                onBlur={() => {
                                    void runSeoAudit();
                                }}
                            />
                        </div>
                    </div>
                </div>

                {seoAudit && (
                    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                        <p className="text-sm font-semibold text-slate-800">
                            SEO Score: {seoAudit.score}/100
                        </p>
                        {seoAudit.recommendations.length > 0 && (
                            <ul className="mt-2 list-disc space-y-1 pl-5 text-xs text-slate-600">
                                {seoAudit.recommendations.map((rec) => (
                                    <li key={rec}>{rec}</li>
                                ))}
                            </ul>
                        )}
                        <div className="mt-3">
                            <p className="text-xs font-semibold text-slate-700">Suggested internal links</p>
                            <p className="text-xs text-slate-600">
                                {seoAudit.internal_link_suggestions.length > 0
                                    ? seoAudit.internal_link_suggestions.join(" , ")
                                    : "No suggestions yet"}
                            </p>
                        </div>
                        <div className="mt-3">
                            <p className="text-xs font-semibold text-slate-700">Headline ideas</p>
                            <ul className="mt-1 list-disc space-y-1 pl-5 text-xs text-slate-600">
                                {seoAudit.headline_suggestions.map((h) => (
                                    <li key={h}>{h}</li>
                                ))}
                            </ul>
                        </div>
                    </div>
                )}

                <div className="space-y-2">
                    <Label className="text-lg font-semibold">Faahfaahinta Qoraalka (Main Content)</Label>
                    <TipTapEditor content={body} onChange={setBody} />
                </div>
            </div>
        </div>
    );
}
