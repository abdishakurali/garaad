"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { launchpadService } from "@/services/launchpad";
import { useAuth } from "@/hooks/useAuth";

import type { StartupCategory, StartupFormData, StartupDetail } from "@/types/launchpad";
import { TECH_STACK_OPTIONS } from "@/types/launchpad";
import { Rocket, Upload, X, Check, Loader2, ArrowLeft, ChevronDown, ChevronUp as ChevronUpIcon, Github, Linkedin, Twitter, Facebook, Instagram, Video, Image as ImageIcon, Save, Trash2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { PITCH_QUESTIONS } from "@/constants/pitch_questions";

export default function EditStartupPage() {
    const router = useRouter();
    const params = useParams();
    const { user } = useAuth();
    const id = params.id as string;

    const [categories, setCategories] = useState<StartupCategory[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [logoPreview, setLogoPreview] = useState<string | null>(null);
    const [screenshotPreviews, setScreenshotPreviews] = useState<string[]>([]);
    const [currentStep, setCurrentStep] = useState(1);
    const totalSteps = 4;

    const [formData, setFormData] = useState<StartupFormData>({
        title: "",
        tagline: "",
        description: "",
        website_url: "",
        logo: null,
        category_id: null,
        tech_stack: [],
        is_hiring: false,
        pitch_data: PITCH_QUESTIONS.reduce((acc, q) => ({ ...acc, [q.id]: "" }), {}),
        github_url: "",
        linkedin_url: "",
        twitter_url: "",
        facebook_url: "",
        instagram_url: "",
        video_url: "",
        images: [],
    });

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const [cats, startup] = await Promise.all([
                    launchpadService.getCategories(),
                    launchpadService.getStartup(id)
                ]);

                setCategories(cats || []);

                // Pre-fill form
                if (startup) {
                    // Check ownership
                    if (user && startup.maker.id !== user.id) {
                        router.push(`/launchpad/${id}`);
                        return;
                    }

                    const pitchData: Record<string, string> = {};
                    PITCH_QUESTIONS.forEach(q => {
                        const answerData = startup.pitch_data?.[q.id];
                        if (typeof answerData === 'string') {
                            pitchData[q.id] = answerData;
                        } else {
                            pitchData[q.id] = answerData?.answer || "";
                        }
                    });

                    setFormData({
                        title: startup.title,
                        tagline: startup.tagline,
                        description: startup.description || "",
                        website_url: startup.website_url,
                        logo: null, // Keep null unless changed
                        category_id: startup.category?.id || null,
                        tech_stack: startup.tech_stack || [],
                        is_hiring: startup.is_hiring,
                        pitch_data: pitchData,
                        github_url: startup.github_url || "",
                        linkedin_url: startup.linkedin_url || "",
                        twitter_url: startup.twitter_url || "",
                        facebook_url: startup.facebook_url || "",
                        instagram_url: startup.instagram_url || "",
                        video_url: startup.video_url || "",
                        images: [], // New images only
                    });

                    if (startup.logo_url || startup.logo) {
                        setLogoPreview(startup.logo_url || startup.logo);
                    }

                    if (startup.images) {
                        setScreenshotPreviews(startup.images.map(img => img.image_url || img.image).filter(Boolean));
                    }
                }
            } catch (err) {
                console.error("Failed to fetch data:", err);
                setError("Ma dhici karto in la soo raro macluumaadka mashruuca");
            } finally {
                setIsLoading(false);
            }
        };

        if (id && user) {
            fetchData();
        }
    }, [id, user, router]);

    const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setFormData({ ...formData, logo: file });
            const reader = new FileReader();
            reader.onload = () => setLogoPreview(reader.result as string);
            reader.readAsDataURL(file);
        }
    };

    const handleScreenshotsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        if (files.length + formData.images.length + screenshotPreviews.length > 5) {
            alert("Ugu badnaan 5 sawir ayaa la oggol yahay");
            return;
        }

        const newImages = [...formData.images, ...files];
        setFormData({ ...formData, images: newImages });

        files.forEach(file => {
            const reader = new FileReader();
            reader.onload = () => setScreenshotPreviews(prev => [...prev, reader.result as string]);
            reader.readAsDataURL(file);
        });
    };

    const removeScreenshot = (index: number) => {
        // This is a simplified version, it doesn't delete from backend yet
        const newPreviews = [...screenshotPreviews];
        newPreviews.splice(index, 1);
        setScreenshotPreviews(newPreviews);

        // If it was a new image
        if (index >= (screenshotPreviews.length - formData.images.length)) {
            const imageIndex = index - (screenshotPreviews.length - formData.images.length);
            const newImages = [...formData.images];
            newImages.splice(imageIndex, 1);
            setFormData({ ...formData, images: newImages });
        }
    };

    const toggleTechStack = (tech: string) => {
        setFormData((prev) => ({
            ...prev,
            tech_stack: prev.tech_stack.includes(tech)
                ? prev.tech_stack.filter((t) => t !== tech)
                : [...prev.tech_stack, tech],
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        // Validation
        if (!formData.title.trim()) {
            setError("Fadlan geli magaca startup-ka");
            return;
        }
        if (!formData.tagline.trim()) {
            setError("Fadlan geli qoraal gaaban (tagline)");
            return;
        }
        if (!formData.website_url.trim()) {
            setError("Fadlan geli website-ka");
            return;
        }

        setIsSubmitting(true);
        try {
            const updatedStartup = await launchpadService.updateStartup(id, formData);

            // Upload new screenshots sequentially to prevent server overload
            if (formData.images.length > 0) {
                for (const img of formData.images) {
                    await launchpadService.addImage(id, img);
                }
            }

            router.push(`/launchpad/${updatedStartup.slug || id}`);
            router.refresh();
        } catch (err: any) {
            console.error("Update error:", err);
            if (err.response?.data) {
                const data = err.response.data;
                const errorMessages = Object.entries(data)
                    .map(([field, msgs]) => {
                        const fieldName = field.charAt(0).toUpperCase() + field.slice(1);
                        return `${fieldName}: ${Array.isArray(msgs) ? msgs.join(", ") : msgs}`;
                    })
                    .join(" | ");
                setError(errorMessages || "Xogta aad bedeshay wax baa ka qaldan");
            } else {
                setError(err.message || "Wax qalad ah ayaa dhacay");
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async () => {
        const confirmed = window.confirm("Ma hubtaa inaad rabto inaad tirtirto startup-kan? Talaabadan dib looma soo celin karo.");
        if (!confirmed) return;

        setIsSubmitting(true);
        try {
            await launchpadService.deleteStartup(id);
            router.push("/launchpad");
        } catch (err) {
            console.error("Failed to delete startup:", err);
            alert("Waan ka xunnahay, tirtirista startup-ka way fashilantay.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-background">
                <Loader2 className="w-10 h-10 text-primary animate-spin mb-4" />
                <p className="text-muted-foreground">Waa la soo raryaa macluumaadka...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                {/* Back Link */}
                <Link
                    href={`/launchpad/${id}`}
                    className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Ku laabo Mashruuca
                </Link>

                {/* Header */}
                <div className="text-center mb-10">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-primary mb-4">
                        <Rocket className="w-5 h-5" />
                        <span className="font-medium">Bedel Startup-ka</span>
                    </div>
                    <h1 className="text-3xl sm:text-4xl font-black mb-4">
                        Cusboonaysii <span className="text-primary">{formData.title}</span>
                    </h1>
                    <p className="text-muted-foreground">
                        Halkan ka bedel macluumaadka startup-kaaga si aad ula wadaagto isbedelladii ugu dambeeyay.
                    </p>
                </div>

                {/* Progress Bar */}
                <div className="mb-12">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
                            Tallaabada {currentStep} ee {totalSteps}
                        </span>
                        <span className="text-xs font-bold text-primary uppercase tracking-widest">
                            {Math.round((currentStep / totalSteps) * 100)}% Dhammaystir
                        </span>
                    </div>
                    <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-primary transition-all duration-500 ease-out"
                            style={{ width: `${(currentStep / totalSteps) * 100}%` }}
                        />
                    </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-8">
                    {currentStep === 1 && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                            <div>
                                <h2 className="text-xl font-bold mb-1">Xogta Guud (Basics)</h2>
                                <p className="text-sm text-muted-foreground mb-6">Geli macluumaadka aasaasiga ah ee startup-kaaga.</p>
                            </div>

                            {/* Title */}
                            <div>
                                <label className="block text-sm font-medium mb-2">Magaca Startup-ka *</label>
                                <input
                                    type="text"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-primary/50 focus:outline-none"
                                    maxLength={100}
                                />
                            </div>

                            {/* Logo Upload */}
                            <div>
                                <label className="block text-sm font-medium mb-4">Logo</label>
                                <div className="flex flex-col sm:flex-row items-center gap-6 p-6 rounded-2xl bg-white/5 border border-white/10 border-dashed hover:border-primary/50 transition-colors">
                                    <div className="relative w-24 h-24 rounded-2xl overflow-hidden bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0">
                                        {logoPreview ? (
                                            <>
                                                <Image src={logoPreview} alt="Logo preview" fill className="object-contain" />
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setLogoPreview(null);
                                                        setFormData({ ...formData, logo: null });
                                                    }}
                                                    className="absolute top-1 right-1 p-1 bg-red-500 rounded-lg shadow-lg"
                                                >
                                                    <X className="w-3 h-3 text-white" />
                                                </button>
                                            </>
                                        ) : (
                                            <label className="cursor-pointer flex flex-col items-center">
                                                <Upload className="w-6 h-6 text-muted-foreground" />
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={handleLogoChange}
                                                    className="hidden"
                                                />
                                            </label>
                                        )}
                                    </div>
                                    <div className="text-sm text-center sm:text-left">
                                        <p className="font-bold text-foreground mb-1">Bedel logada mashruuca</p>
                                        <p className="text-muted-foreground leading-relaxed">PNG ama JPG (200x200px).</p>
                                    </div>
                                </div>
                            </div>

                            {/* Tagline */}
                            <div>
                                <label className="block text-sm font-medium mb-2">Qoraal Gaaban (Tagline) *</label>
                                <input
                                    type="text"
                                    value={formData.tagline}
                                    onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-primary/50 focus:outline-none"
                                    maxLength={200}
                                />
                            </div>

                            {/* Website URL */}
                            <div>
                                <label className="block text-sm font-medium mb-2">Website URL *</label>
                                <input
                                    type="url"
                                    value={formData.website_url}
                                    onChange={(e) => setFormData({ ...formData, website_url: e.target.value })}
                                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-primary/50 focus:outline-none"
                                />
                            </div>

                            {/* Category */}
                            <div>
                                <label className="block text-sm font-bold mb-4">Nooca (Category)</label>
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                    {categories.map((cat) => (
                                        <button
                                            key={cat.id}
                                            type="button"
                                            onClick={() =>
                                                setFormData({
                                                    ...formData,
                                                    category_id: formData.category_id === cat.id ? null : cat.id,
                                                })
                                            }
                                            className={`flex flex-col items-center justify-center gap-3 p-4 rounded-2xl border transition-all duration-300 ${formData.category_id === cat.id
                                                ? "bg-primary/10 border-primary shadow-lg shadow-primary/10 scale-[1.02]"
                                                : "bg-white/5 border-white/10 hover:border-white/20 hover:bg-white/[0.07]"
                                                }`}
                                        >
                                            <div className="text-2xl p-2 rounded-xl transition-colors">
                                                {cat.icon}
                                            </div>
                                            <span className="text-xs font-bold text-center">
                                                {cat.name_somali || cat.name}
                                            </span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {currentStep === 2 && (
                        <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
                            <div>
                                <h2 className="text-xl font-bold mb-1">Murtida (The Pitch)</h2>
                                <p className="text-sm text-muted-foreground mb-6">Ka jawaab su'aalahan si aad u sharaxdo aragtidaada.</p>
                            </div>

                            <div className="space-y-8">
                                {PITCH_QUESTIONS.map((q, index) => (
                                    <div key={q.id} className="space-y-3">
                                        <label className="block text-sm font-bold text-primary">
                                            {index + 1}. {q.en}
                                        </label>
                                        <textarea
                                            value={formData.pitch_data[q.id]}
                                            onChange={(e) => setFormData({
                                                ...formData,
                                                pitch_data: { ...formData.pitch_data, [q.id]: e.target.value }
                                            })}
                                            rows={3}
                                            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-primary/50 focus:outline-none resize-none"
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {currentStep === 3 && (
                        <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
                            <div>
                                <h2 className="text-xl font-bold mb-1">Xogta Dambe (Launch Details)</h2>
                                <p className="text-sm text-muted-foreground mb-6">Tallabadii ugu dambaysay.</p>
                            </div>

                            {/* Tech Stack */}
                            <div>
                                <label className="block text-sm font-medium mb-3">Tech Stack</label>
                                <div className="flex flex-wrap gap-2">
                                    {TECH_STACK_OPTIONS.map((tech) => (
                                        <button
                                            key={tech}
                                            type="button"
                                            onClick={() => toggleTechStack(tech)}
                                            className={`px-3 py-2 rounded-xl text-sm font-medium transition-all ${formData.tech_stack.includes(tech)
                                                ? "bg-primary text-white shadow-lg shadow-primary/20"
                                                : "bg-white/5 border border-white/10 hover:bg-white/10"
                                                }`}
                                        >
                                            {tech}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Description */}
                            <div>
                                <label className="block text-sm font-medium mb-2">Sharaxaad Dheeri ah</label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    rows={5}
                                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-primary/50 focus:outline-none resize-none"
                                />
                            </div>
                        </div>
                    )}

                    {currentStep === 4 && (
                        <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
                            <div>
                                <h2 className="text-xl font-bold mb-1">Xiriirada & Media</h2>
                                <p className="text-sm text-muted-foreground mb-6">Ku dar sawirro iyo boggaga bulshada.</p>
                            </div>

                            {/* Screenshots Upload */}
                            <div>
                                <label className="block text-sm font-medium mb-4">Screenshots (Ugu badnaan 5)</label>
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                                    {screenshotPreviews.map((preview, index) => (
                                        <div key={index} className="relative aspect-video rounded-xl overflow-hidden bg-white/5 border border-white/10">
                                            <Image src={preview} alt={`Screenshot ${index + 1}`} fill className="object-cover" />
                                            <button
                                                type="button"
                                                onClick={() => removeScreenshot(index)}
                                                className="absolute top-1 right-1 p-1 bg-red-500 rounded-lg shadow-lg"
                                            >
                                                <X className="w-3 h-3 text-white" />
                                            </button>
                                        </div>
                                    ))}
                                    {screenshotPreviews.length < 5 && (
                                        <label className="aspect-video flex flex-col items-center justify-center rounded-xl bg-white/5 border border-white/10 border-dashed hover:border-primary/50 cursor-pointer transition-colors">
                                            <ImageIcon className="w-6 h-6 text-muted-foreground mb-1" />
                                            <span className="text-[10px] uppercase font-bold text-muted-foreground">Add</span>
                                            <input
                                                type="file"
                                                accept="image/*"
                                                multiple
                                                onChange={handleScreenshotsChange}
                                                className="hidden"
                                            />
                                        </label>
                                    )}
                                </div>
                            </div>

                            {/* Video URL */}
                            <div>
                                <label className="flex items-center gap-2 text-sm font-medium mb-2">
                                    <Video className="w-4 h-4 text-primary" />
                                    Video Link (YouTube/Vimeo)
                                </label>
                                <input
                                    type="url"
                                    value={formData.video_url}
                                    onChange={(e) => setFormData({ ...formData, video_url: e.target.value })}
                                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-primary/50 focus:outline-none"
                                />
                            </div>

                            {/* Social Links */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="relative">
                                    <Github className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                    <input
                                        type="url"
                                        value={formData.github_url}
                                        onChange={(e) => setFormData({ ...formData, github_url: e.target.value })}
                                        placeholder="GitHub"
                                        className="w-full pl-11 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-primary/50 focus:outline-none"
                                    />
                                </div>
                                <div className="relative">
                                    <Linkedin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                    <input
                                        type="url"
                                        value={formData.linkedin_url}
                                        onChange={(e) => setFormData({ ...formData, linkedin_url: e.target.value })}
                                        placeholder="LinkedIn"
                                        className="w-full pl-11 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-primary/50 focus:outline-none"
                                    />
                                </div>
                                <div className="relative">
                                    <Twitter className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                    <input
                                        type="url"
                                        value={formData.twitter_url}
                                        onChange={(e) => setFormData({ ...formData, twitter_url: e.target.value })}
                                        placeholder="Twitter"
                                        className="w-full pl-11 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-primary/50 focus:outline-none"
                                    />
                                </div>
                                <div className="relative">
                                    <Facebook className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                    <input
                                        type="url"
                                        value={formData.facebook_url}
                                        onChange={(e) => setFormData({ ...formData, facebook_url: e.target.value })}
                                        placeholder="Facebook"
                                        className="w-full pl-11 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-primary/50 focus:outline-none"
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Navigation Buttons */}
                    <div className="flex items-center justify-between gap-4 pt-8 border-t border-white/10">
                        {currentStep > 1 && (
                            <button
                                type="button"
                                onClick={() => setCurrentStep(prev => prev - 1)}
                                className="flex items-center gap-2 px-6 py-3 bg-white/5 text-foreground font-bold rounded-xl hover:bg-white/10 transition-all"
                            >
                                <ArrowLeft className="w-5 h-5" />
                                Dib u Noqo
                            </button>
                        )}

                        <div className="flex items-center gap-4 ml-auto">
                            {currentStep < totalSteps ? (
                                <button
                                    type="button"
                                    onClick={() => setCurrentStep(prev => prev + 1)}
                                    className="flex items-center gap-2 px-8 py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 transition-all"
                                >
                                    Tallaabada Xigta
                                </button>
                            ) : (
                                <div className="flex items-center gap-4">
                                    <button
                                        type="button"
                                        onClick={handleDelete}
                                        disabled={isSubmitting}
                                        className="flex items-center justify-center gap-2 px-6 py-3 bg-red-500/10 text-red-500 font-bold rounded-xl hover:bg-red-500/20 transition-all border border-red-500/20 disabled:opacity-50"
                                    >
                                        <Trash2 className="w-5 h-5" />
                                        Tirtir Startup
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="flex items-center justify-center gap-2 px-10 py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 disabled:opacity-50"
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <Loader2 className="w-5 h-5 animate-spin" />
                                                Waa la kaydinayaa...
                                            </>
                                        ) : (
                                            <>
                                                <Save className="w-5 h-5" />
                                                Kaydi Isbedelada
                                            </>
                                        )}
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Error */}
                    {error && (
                        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">
                            {error}
                        </div>
                    )}
                </form>
            </main>
        </div>
    );
}
