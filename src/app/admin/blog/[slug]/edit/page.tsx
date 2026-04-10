"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
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

export default function EditBlogPostPage() {
    const router = useRouter();
    const params = useParams();
    const slug = params.slug as string;

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [title, setTitle] = useState("");
    const [body, setBody] = useState("");
    const [metaDescription, setMetaDescription] = useState("");
    const [tags, setTags] = useState("");
    const [coverImage, setCoverImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [isPublished, setIsPublished] = useState(false);
    const [isDragging, setIsDragging] = useState(false);

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const post = await blogAdminApi.getPost(slug);
                setTitle(post.title);
                setBody(post.body);
                setMetaDescription(post.meta_description || "");
                setIsPublished(post.is_published);
                if (post.cover || post.cover_image_url) {
                    setImagePreview(post.cover || post.cover_image_url || null);
                }
                if (post.tags) {
                    setTags(post.tags.map((t: any) => t.name).join(", "));
                }
            } catch (error) {
                toast.error("Waa lagu fashilmay soo saarista xogta qoraalka");
                router.push("/admin/blog");
            } finally {
                setLoading(false);
            }
        };

        if (slug) {
            fetchPost();
        }
    }, [slug, router]);

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

    const handleSubmit = async (publish: boolean = isPublished) => {
        if (!title || !body || !metaDescription) {
            toast.error("Fadlan buuxi dhammaan meelaha muhiimka ah");
            return;
        }

        try {
            setSaving(true);
            const formData = new FormData();
            formData.append("title", title);
            formData.append("body", body);
            formData.append("meta_description", metaDescription);
            formData.append("is_published", String(publish));
            if (coverImage) {
                formData.append("cover_image", coverImage);
            }
            formData.append("tags", tags.trim());

            await blogAdminApi.updatePost(slug, formData);
            toast.success("Isbeddelada waa la kaydiyey");
            router.push("/admin/blog");
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Waa lagu fashilmay kaydinta isbeddelada");
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

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
                        disabled={saving}
                    >
                        {saving && !isPublished ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                        Kaydi ahaan Qabyo
                    </Button>
                    <Button
                        onClick={() => handleSubmit(true)}
                        disabled={saving}
                    >
                        {saving && isPublished ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                        {isPublished ? "Beddel Qoraalka" : "Daabac Qoraalka"}
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
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="cover-image" className="font-medium">Sawirka Daboolka (Cover Image)</Label>
                            <div
                                role="button"
                                tabIndex={0}
                                onDragOver={handleDragOver}
                                onDragLeave={handleDragLeave}
                                onDrop={handleDrop}
                                onClick={() => document.getElementById("cover-image")?.click()}
                                onKeyDown={(e) => e.key === "Enter" && document.getElementById("cover-image")?.click()}
                                className={cn(
                                    "border-2 border-dashed rounded-xl aspect-video flex flex-col items-center justify-center cursor-pointer transition-colors overflow-hidden relative",
                                    isDragging ? "border-primary bg-primary/5" : "border-slate-200 hover:border-primary"
                                )}
                            >
                                {imagePreview ? (
                                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover pointer-events-none" draggable={false} />
                                ) : (
                                    <>
                                        <Upload className="h-10 w-10 text-slate-300 mb-2" />
                                        <span className="text-sm text-slate-400 text-center px-4">
                                            Guji si aad sawir u soo geliso ama jiid oo tuur halkan
                                        </span>
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
                            />
                        </div>
                    </div>
                </div>

                <div className="space-y-2">
                    <Label className="text-lg font-semibold">Faahfaahinta Qoraalka (Main Content)</Label>
                    <TipTapEditor content={body} onChange={setBody} />
                </div>
            </div>
        </div>
    );
}
