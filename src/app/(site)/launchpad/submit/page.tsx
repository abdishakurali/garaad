"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import { launchpadService } from "@/services/launchpad";

import type { StartupCategory, StartupFormData } from "@/types/launchpad";
import { TECH_STACK_OPTIONS } from "@/types/launchpad";
import { Rocket, Upload, X, Check, Loader2, ArrowLeft, ChevronDown, ChevronUp as ChevronUpIcon, Github, Linkedin, Twitter, Facebook, Instagram, Video, Image as ImageIcon } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { PITCH_QUESTIONS } from "@/constants/pitch_questions";

export default function SubmitStartupPage() {
    const router = useRouter();
    const [categories, setCategories] = useState<StartupCategory[]>([]);
    const { user, isAuthenticated, isLoading: authLoading } = useAuthStore();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [logoPreview, setLogoPreview] = useState<string | null>(null);
    const [screenshotPreviews, setScreenshotPreviews] = useState<string[]>([]);
    const [currentStep, setCurrentStep] = useState(1);
    const totalSteps = 3;


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
        if (!authLoading && !isAuthenticated) {
            router.push("/admin/login?redirect=/launchpad/submit");
            return;
        }

        const fetchCategories = async () => {
            try {
                const data = await launchpadService.getCategories();
                setCategories(data || []);
            } catch (err) {
                console.error("Failed to fetch categories:", err);
            }
        };
        fetchCategories();
    }, []);

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
        if (files.length + formData.images.length > 5) {
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
        const newImages = [...formData.images];
        newImages.splice(index, 1);
        const newPreviews = [...screenshotPreviews];
        newPreviews.splice(index, 1);

        setFormData({ ...formData, images: newImages });
        setScreenshotPreviews(newPreviews);
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

        // If not on the last step, don't submit
        if (currentStep < totalSteps) {
            return;
        }

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
        if (!formData.logo) {
            setError("Fadlan soo geli logo");
            return;
        }

        if (formData.images.length < 2) {
            setError("Fadlan soo geli ugu yaraan 2 sawir (screenshots)");
            return;
        }

        setIsSubmitting(true);
        try {
            const startup = await launchpadService.createStartup(formData);

            // Upload screenshots
            if (formData.images.length > 0) {
                await Promise.all(
                    formData.images.map(img => launchpadService.addImage(startup.id, img))
                );
            }

            router.push(`/launchpad/${startup.slug || startup.id}`);
        } catch (err: any) {
            console.error("Submission error:", err);

            // Handle field-specific errors from backend
            if (err.response?.data) {
                const data = err.response.data;
                const errorMessages = Object.entries(data)
                    .map(([field, msgs]) => {
                        const fieldName = field.charAt(0).toUpperCase() + field.slice(1);
                        return `${fieldName}: ${Array.isArray(msgs) ? msgs.join(", ") : msgs}`;
                    })
                    .join(" | ");
                setError(errorMessages || "Xogta aad dirtay wax baa ka qaldan");
            } else {
                setError(err.message || "Wax qalad ah ayaa dhacay");
            }
        } finally {
            setIsSubmitting(false);
        }
    };


    return (
        <div className="min-h-screen bg-background">


            <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                {/* Back Link */}
                <Link
                    href="/launchpad"
                    className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Ku laabo Launchpad
                </Link>

                {/* Header */}
                <div className="text-center mb-10">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-primary mb-4">
                        <Rocket className="w-5 h-5" />
                        <span className="font-medium">Soo Dir Startup</span>
                    </div>
                    <h1 className="text-3xl sm:text-4xl font-black mb-4">
                        Soo Bandhig <span className="text-primary">Startup-kaaga</span>
                    </h1>
                    <p className="text-muted-foreground">
                        Ku dar startup-kaaga liiska si bulshada ay u codayaan oo aad u hesho feedback.
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
                                    placeholder="Tusaale: Garaad"
                                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-primary/50 focus:outline-none"
                                    maxLength={100}
                                />
                            </div>

                            {/* Logo Upload - Moved to Step 1 */}
                            <div>
                                <label className="block text-sm font-medium mb-4">Logo *</label>
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
                                                    <X className="w-3 h-3" />
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
                                        <p className="font-bold text-foreground mb-1">Soo geli logada mashruuca</p>
                                        <p className="text-muted-foreground leading-relaxed">PNG ama JPG (200x200px). Logadu waa wajiga dhabta ah ee startup-kaaga.</p>
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
                                    placeholder="Tusaale: Platform-ka waxbarashada tech-ka ee ugu weyn Soomaaliya"
                                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-primary/50 focus:outline-none"
                                    maxLength={200}
                                />
                                <p className="text-xs text-muted-foreground mt-1">{formData.tagline.length}/200</p>
                            </div>

                            {/* Website URL */}
                            <div>
                                <label className="block text-sm font-medium mb-2">Website URL *</label>
                                <input
                                    type="url"
                                    value={formData.website_url}
                                    onChange={(e) => setFormData({ ...formData, website_url: e.target.value })}
                                    placeholder="https://example.com"
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
                                            <div className={`text-2xl p-2 rounded-xl transition-colors ${formData.category_id === cat.id ? 'bg-primary/20' : 'bg-white/5'
                                                }`}>
                                                {cat.icon}
                                            </div>
                                            <span className={`text-xs font-bold text-center transition-colors ${formData.category_id === cat.id ? 'text-primary' : 'text-muted-foreground'
                                                }`}>
                                                {cat.name_somali || cat.name}
                                            </span>
                                            {formData.category_id === cat.id && (
                                                <div className="absolute top-2 right-2">
                                                    <Check className="w-3 h-3 text-primary" />
                                                </div>
                                            )}
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
                                <p className="text-sm text-muted-foreground mb-6">Ka jawaab su'aalahan si aad u sharaxdo aragtidaada iyo dhibaatada aad xallinayso.</p>
                            </div>

                            <div className="space-y-8">
                                {PITCH_QUESTIONS.map((q, index) => (
                                    <div key={q.id} className="space-y-3">
                                        <div>
                                            <label className="block text-sm font-bold text-primary">
                                                {index + 1}. {q.en}
                                            </label>
                                            <span className="block text-xs text-muted-foreground mt-1 italic">
                                                {q.so}
                                            </span>
                                        </div>
                                        <textarea
                                            value={formData.pitch_data[q.id]}
                                            onChange={(e) => setFormData({
                                                ...formData,
                                                pitch_data: { ...formData.pitch_data, [q.id]: e.target.value }
                                            })}
                                            placeholder="..."
                                            rows={2}
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
                                <p className="text-sm text-muted-foreground mb-6">Waa tallabadii ugu dambaysay ee lagu habaynayo startup-kaaga.</p>
                            </div>

                            {/* Screenshots Upload */}
                            <div>
                                <label className="block text-sm font-medium mb-4">Screenshots (Ugu badnaan 5 sawir)</label>
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
                                            <span className="text-[10px] uppercase font-bold text-muted-foreground">Add Image</span>
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
                                    placeholder="https://youtube.com/watch?v=..."
                                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-primary/50 focus:outline-none"
                                />
                            </div>

                            {/* Social Links Grid */}
                            <div className="space-y-4">
                                <label className="block text-sm font-medium mb-4">Boggaga Bulshada (Social Links)</label>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                                            <Github className="w-4 h-4 text-muted-foreground" />
                                        </div>
                                        <input
                                            type="url"
                                            value={formData.github_url}
                                            onChange={(e) => setFormData({ ...formData, github_url: e.target.value })}
                                            placeholder="GitHub URL"
                                            className="w-full pl-11 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-primary/50 focus:outline-none text-sm"
                                        />
                                    </div>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                                            <Linkedin className="w-4 h-4 text-muted-foreground" />
                                        </div>
                                        <input
                                            type="url"
                                            value={formData.linkedin_url}
                                            onChange={(e) => setFormData({ ...formData, linkedin_url: e.target.value })}
                                            placeholder="LinkedIn URL"
                                            className="w-full pl-11 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-primary/50 focus:outline-none text-sm"
                                        />
                                    </div>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                                            <Twitter className="w-4 h-4 text-muted-foreground" />
                                        </div>
                                        <input
                                            type="url"
                                            value={formData.twitter_url}
                                            onChange={(e) => setFormData({ ...formData, twitter_url: e.target.value })}
                                            placeholder="Twitter / X URL"
                                            className="w-full pl-11 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-primary/50 focus:outline-none text-sm"
                                        />
                                    </div>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                                            <Facebook className="w-4 h-4 text-muted-foreground" />
                                        </div>
                                        <input
                                            type="url"
                                            value={formData.facebook_url}
                                            onChange={(e) => setFormData({ ...formData, facebook_url: e.target.value })}
                                            placeholder="Facebook URL"
                                            className="w-full pl-11 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-primary/50 focus:outline-none text-sm"
                                        />
                                    </div>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                                            <Instagram className="w-4 h-4 text-muted-foreground" />
                                        </div>
                                        <input
                                            type="url"
                                            value={formData.instagram_url}
                                            onChange={(e) => setFormData({ ...formData, instagram_url: e.target.value })}
                                            placeholder="Instagram URL"
                                            className="w-full pl-11 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-primary/50 focus:outline-none text-sm"
                                        />
                                    </div>
                                </div>
                            </div>



                            {/* Tech Stack */}
                            <div>
                                <label className="block text-sm font-medium mb-3">Tech Stack (Xulo wixii aad isticmaasheen)</label>
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
                                    placeholder="Sharax startup-kaaga iyo waxa uu qabto si faahfaahsan..."
                                    rows={5}
                                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-primary/50 focus:outline-none resize-none"
                                />
                            </div>


                        </div>
                    )}


                    {/* Navigation Buttons */}
                    <div className="flex items-center justify-between gap-4 pt-8 border-t border-white/10">
                        {currentStep > 1 ? (
                            <button
                                type="button"
                                onClick={() => setCurrentStep(prev => prev - 1)}
                                className="flex items-center gap-2 px-6 py-3 bg-white/5 text-foreground font-bold rounded-xl hover:bg-white/10 transition-all"
                            >
                                <ArrowLeft className="w-5 h-5" />
                                Dib u Noqo
                            </button>
                        ) : (
                            <div />
                        )}

                        <div className="flex items-center gap-4">
                            {currentStep < totalSteps ? (
                                <button
                                    type="button"
                                    onClick={() => {
                                        // Simple validation for step 1
                                        if (currentStep === 1) {
                                            if (!formData.title.trim() || !formData.tagline.trim() || !formData.website_url.trim() || !formData.logo) {
                                                setError("Fadlan buuxi dhammaan meelaha muhiimka ah (ay ku jirto logadu)");
                                                return;
                                            }
                                        }

                                        setError(null);
                                        setCurrentStep(prev => prev + 1);
                                        window.scrollTo({ top: 0, behavior: 'smooth' });
                                    }}
                                    className="flex items-center gap-2 px-8 py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
                                >
                                    Tallaabada Xigta
                                </button>
                            ) : (
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="flex items-center justify-center gap-2 px-10 py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 disabled:opacity-50"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                            Waa la diraa...
                                        </>
                                    ) : (
                                        <>
                                            <Rocket className="w-5 h-5" />
                                            Hadda Soo Dir
                                        </>
                                    )}
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Error */}
                    {error && (
                        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm animate-shake">
                            {error}
                        </div>
                    )}
                </form>

            </main>


        </div>
    );
}


