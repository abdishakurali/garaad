"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Header as SiteHeader } from "@/components/Header";
import { FooterSection } from "@/components/sections/FooterSection";
import { launchpadService } from "@/services/launchpad";
import type { StartupCategory, StartupFormData } from "@/types/launchpad";
import { TECH_STACK_OPTIONS } from "@/types/launchpad";
import { Rocket, Upload, X, Check, Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function SubmitStartupPage() {
    const router = useRouter();
    const [categories, setCategories] = useState<StartupCategory[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [logoPreview, setLogoPreview] = useState<string | null>(null);

    const [formData, setFormData] = useState<StartupFormData>({
        title: "",
        tagline: "",
        description: "",
        website_url: "",
        logo: null,
        category_id: null,
        tech_stack: [],
        is_hiring: false,
    });

    useEffect(() => {
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
        if (!formData.logo) {
            setError("Fadlan soo geli logo");
            return;
        }

        setIsSubmitting(true);
        try {
            const startup = await launchpadService.createStartup(formData);
            router.push(`/launchpad/${startup.id}`);
        } catch (err: any) {
            setError(err.message || "Wax qalad ah ayaa dhacay");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-background">
            <SiteHeader />

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

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Logo Upload */}
                    <div>
                        <label className="block text-sm font-medium mb-2">Logo *</label>
                        <div className="flex items-center gap-4">
                            <div className="relative w-24 h-24 rounded-xl overflow-hidden bg-white/5 border-2 border-dashed border-white/20 flex items-center justify-center">
                                {logoPreview ? (
                                    <>
                                        <Image src={logoPreview} alt="Logo preview" fill className="object-cover" />
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setLogoPreview(null);
                                                setFormData({ ...formData, logo: null });
                                            }}
                                            className="absolute top-1 right-1 p-1 bg-red-500 rounded-full"
                                        >
                                            <X className="w-3 h-3" />
                                        </button>
                                    </>
                                ) : (
                                    <label className="cursor-pointer flex flex-col items-center">
                                        <Upload className="w-6 h-6 text-muted-foreground" />
                                        <span className="text-xs text-muted-foreground mt-1">Soo geli</span>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleLogoChange}
                                            className="hidden"
                                        />
                                    </label>
                                )}
                            </div>
                            <div className="text-sm text-muted-foreground">
                                <p>Sawir cad oo logo ah</p>
                                <p className="text-xs">PNG ama JPG, ugu yaraan 200x200px</p>
                            </div>
                        </div>
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

                    {/* Description */}
                    <div>
                        <label className="block text-sm font-medium mb-2">Sharaxaad</label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            placeholder="Sharax startup-kaaga iyo waxa uu qabto..."
                            rows={4}
                            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-primary/50 focus:outline-none resize-none"
                        />
                    </div>

                    {/* Category */}
                    <div>
                        <label className="block text-sm font-medium mb-2">Nooca (Category)</label>
                        <div className="flex flex-wrap gap-2">
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
                                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${formData.category_id === cat.id
                                            ? "bg-primary text-white"
                                            : "bg-white/5 border border-white/10 hover:bg-white/10"
                                        }`}
                                >
                                    {cat.icon} {cat.name_somali || cat.name}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Tech Stack */}
                    <div>
                        <label className="block text-sm font-medium mb-2">Tech Stack</label>
                        <div className="flex flex-wrap gap-2">
                            {TECH_STACK_OPTIONS.map((tech) => (
                                <button
                                    key={tech}
                                    type="button"
                                    onClick={() => toggleTechStack(tech)}
                                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${formData.tech_stack.includes(tech)
                                            ? "bg-primary text-white"
                                            : "bg-white/5 border border-white/10 hover:bg-white/10"
                                        }`}
                                >
                                    {formData.tech_stack.includes(tech) && <Check className="w-3 h-3 inline mr-1" />}
                                    {tech}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Hiring Toggle */}
                    <div className="flex items-center gap-3">
                        <button
                            type="button"
                            onClick={() => setFormData({ ...formData, is_hiring: !formData.is_hiring })}
                            className={`relative w-12 h-6 rounded-full transition-colors ${formData.is_hiring ? "bg-green-500" : "bg-white/20"
                                }`}
                        >
                            <span
                                className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform ${formData.is_hiring ? "translate-x-6" : ""
                                    }`}
                            />
                        </button>
                        <span className="text-sm">Waxaan raadineynaa shaqaale</span>
                    </div>

                    {/* Error */}
                    {error && (
                        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">
                            {error}
                        </div>
                    )}

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 transition-colors disabled:opacity-50"
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                Waa la diraa...
                            </>
                        ) : (
                            <>
                                <Rocket className="w-5 h-5" />
                                Soo Dir Startup-ka
                            </>
                        )}
                    </button>
                </form>
            </main>

            <FooterSection />
        </div>
    );
}
