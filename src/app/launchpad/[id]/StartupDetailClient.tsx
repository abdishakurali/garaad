"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useAuthStore } from "@/store/useAuthStore";
import { Header as SiteHeader } from "@/components/Header";
import { FooterSection } from "@/components/sections/FooterSection";
import { launchpadService } from "@/services/launchpad";
import type { StartupDetail } from "@/types/launchpad";
import {
    ChevronUp,
    ExternalLink,
    CheckCircle2,
    ArrowLeft,
    Send,
    MessageSquare,
    Share2,
    Loader2,
    HelpCircle,
    Github,
    Linkedin,
    Twitter,
    Facebook,
    Video as VideoIcon,
    Pencil,
    Trash2,
    Image as ImageIcon,
    Maximize2,
    X
} from "lucide-react";

import { TechIcon } from "@/components/launchpad/TechIcon";
import { PITCH_QUESTIONS } from "@/constants/pitch_questions";

interface StartupDetailClientProps {
    initialData?: StartupDetail | null;
    startupId: string;
}

export function StartupDetailClient({ initialData, startupId }: StartupDetailClientProps) {
    const router = useRouter();
    const { user } = useAuthStore();

    const [startup, setStartup] = useState<StartupDetail | null>(initialData || null);
    const [isLoading, setIsLoading] = useState(!initialData);
    const [error, setError] = useState<string | null>(null);
    const [isVoting, setIsVoting] = useState(false);
    const [commentText, setCommentText] = useState("");
    const [isCommenting, setIsCommenting] = useState(false);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);

    useEffect(() => {
        // If we have initialData, we don't need to fetch immediately
        if (initialData && initialData.id === startupId) {
            setIsLoading(false);
            return;
        }

        const fetchStartup = async () => {
            setIsLoading(true);
            try {
                const data = await launchpadService.getStartup(startupId);
                setStartup(data);

                // If visited with ID but slug exists, update URL to slug
                if (data.slug && startupId === data.id) {
                    window.history.replaceState(null, '', `/launchpad/${data.slug}`);
                }
            } catch (err) {
                setError("Startup-kan lama helin");
                console.error("Failed to fetch startup:", err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchStartup();
    }, [startupId, initialData]);

    const handleVote = async () => {
        if (!startup || isVoting) return;
        setIsVoting(true);
        try {
            const response = await launchpadService.toggleVote(startupId);
            setStartup({
                ...startup,
                vote_count: response.vote_count,
                user_has_voted: response.voted,
            });
        } catch (err) {
            console.error("Vote failed:", err);
        } finally {
            setIsVoting(false);
        }
    };

    const handleComment = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!startup || !commentText.trim() || isCommenting) return;

        setIsCommenting(true);
        try {
            const newComment = await launchpadService.addComment(startupId, commentText.trim());
            setStartup({
                ...startup,
                comments: [...startup.comments, newComment],
            });
            setCommentText("");
        } catch (err) {
            console.error("Comment failed:", err);
        } finally {
            setIsCommenting(false);
        }
    };

    const handleShare = () => {
        if (typeof navigator !== 'undefined' && navigator.share) {
            navigator.share({
                title: startup?.title,
                text: startup?.tagline,
                url: window.location.href,
            });
        } else {
            navigator.clipboard.writeText(window.location.href);
            alert("Link waa la koobiyay!");
        }
    };

    const getEmbedUrl = (url: string) => {
        if (!url) return null;

        const youtubeRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
        const youtubeMatch = url.match(youtubeRegex);
        if (youtubeMatch && youtubeMatch[1]) {
            return `https://www.youtube.com/embed/${youtubeMatch[1]}`;
        }

        const vimeoRegex = /(?:vimeo\.com\/|player\.vimeo\.com\/video\/)([0-9]+)/;
        const vimeoMatch = url.match(vimeoRegex);
        if (vimeoMatch && vimeoMatch[1]) {
            return `https://player.vimeo.com/video/${vimeoMatch[1]}`;
        }

        return null;
    };


    const handleDelete = async () => {
        if (!startup) return;

        const confirmed = window.confirm("Ma hubtaa inaad rabto inaad tirtirto startup-kan? Talaabadan dib looma soo celin karo.");
        if (!confirmed) return;

        try {
            await launchpadService.deleteStartup(startup.id);
            router.push("/launchpad");
        } catch (err) {
            console.error("Failed to delete startup:", err);
            alert("Waan ka xunnahay, tirtirista startup-ka way fashilantay.");
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    if (error || !startup) {
        return (
            <div className="min-h-screen bg-background">
                <SiteHeader />
                <main className="max-w-4xl mx-auto px-4 py-20 text-center">
                    <h1 className="text-2xl font-bold mb-4">{error || "Wax qalad ah ayaa dhacay"}</h1>
                    <Link href="/launchpad" className="text-primary hover:underline">
                        Ku laabo Launchpad
                    </Link>
                </main>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            <SiteHeader />

            <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                {/* Back Link */}
                <Link
                    href="/launchpad"
                    className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Ku laabo Launchpad
                </Link>

                {/* Header Section */}
                <div className="flex flex-col md:flex-row gap-6 mb-10">
                    {/* Logo */}
                    <div className="relative w-24 h-24 md:w-32 md:h-32 rounded-2xl overflow-hidden bg-white/10 flex-shrink-0">
                        {startup.logo || startup.logo_url ? (
                            <Image src={startup.logo_url || startup.logo} alt={startup.title} fill className="object-contain p-2" />

                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-4xl font-bold text-primary">
                                {startup.title.charAt(0)}
                            </div>
                        )}
                    </div>

                    {/* Info */}
                    <div className="flex-1">
                        <div className="flex flex-wrap items-start gap-3 mb-2">
                            <h1 className="text-3xl font-black">{startup.title}</h1>
                            {startup.is_built_on_garaad && (
                                <span className="inline-flex items-center gap-1 px-3 py-1 bg-primary/20 text-primary text-sm font-medium rounded-full">
                                    <CheckCircle2 className="w-4 h-4" />
                                    Lagu Dhisay Garaad
                                </span>
                            )}

                        </div>
                        <p className="text-lg text-muted-foreground mb-4">{startup.tagline}</p>

                        {/* Action Buttons */}
                        <div className="flex flex-wrap items-center gap-3">
                            <button
                                onClick={handleVote}
                                disabled={isVoting}
                                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium transition-all ${startup.user_has_voted
                                    ? "bg-primary text-white"
                                    : "bg-white/10 border border-white/20 hover:border-primary/50"
                                    }`}
                            >
                                <ChevronUp className="w-5 h-5" />
                                <span>{startup.vote_count}</span>
                                <span className="hidden sm:inline">
                                    {startup.user_has_voted ? "Upvote" : "Codee"}
                                </span>
                            </button>

                            <a
                                href={startup.website_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 px-5 py-2.5 bg-white/10 border border-white/20 rounded-xl font-medium hover:bg-white/20 transition-colors"
                            >
                                <ExternalLink className="w-4 h-4" />
                                Booqo Website
                            </a>

                            <button
                                onClick={handleShare}
                                className="flex items-center gap-2 px-5 py-2.5 bg-white/10 border border-white/20 rounded-xl font-medium hover:bg-white/20 transition-colors"
                            >
                                <Share2 className="w-4 h-4" />
                                La Wadaag
                            </button>

                            {/* Edit Button for Maker */}
                            {user && user.id === startup.maker.id && (
                                <Link
                                    href={`/launchpad/edit/${startup.id}`}
                                    className="flex items-center gap-2 px-5 py-2.5 bg-primary/10 border border-primary/20 text-primary rounded-xl font-medium hover:bg-primary/20 transition-colors"
                                >
                                    <Pencil className="w-4 h-4" />
                                </Link>
                            )}

                            {user && user.id === startup.maker.id && (
                                <button
                                    onClick={handleDelete}
                                    className="flex items-center gap-2 px-5 py-2.5 bg-red-500/10 border border-red-500/20 text-red-500 rounded-xl font-medium hover:bg-red-500/20 transition-colors"
                                    title="Tirtir Startup-ka"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            )}

                            {/* Social Icons */}
                            <div className="flex items-center gap-2 ml-auto">
                                {startup.github_url && (
                                    <a href={startup.github_url} target="_blank" rel="noopener noreferrer" className="p-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-colors" title="GitHub">
                                        <Github className="w-5 h-5" />
                                    </a>
                                )}
                                {startup.linkedin_url && (
                                    <a href={startup.linkedin_url} target="_blank" rel="noopener noreferrer" className="p-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-colors" title="LinkedIn">
                                        <Linkedin className="w-5 h-5" />
                                    </a>
                                )}
                                {startup.twitter_url && (
                                    <a href={startup.twitter_url} target="_blank" rel="noopener noreferrer" className="p-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-colors" title="Twitter / X">
                                        <Twitter className="w-5 h-5" />
                                    </a>
                                )}
                                {startup.facebook_url && (
                                    <a href={startup.facebook_url} target="_blank" rel="noopener noreferrer" className="p-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-colors" title="Facebook">
                                        <Facebook className="w-5 h-5" />
                                    </a>
                                )}
                            </div>
                        </div>
                    </div>
                </div>


                {/* Tech Stack */}
                {startup.tech_stack.length > 0 && (
                    <div className="mb-8">
                        <h2 className="text-sm font-medium text-muted-foreground mb-3 uppercase tracking-wider">Tech Stack</h2>
                        <div className="flex flex-wrap gap-4">
                            {startup.tech_stack.map((tech) => (
                                <div key={tech} className="flex items-center gap-2 px-3 py-2 bg-white/5 border border-white/10 rounded-xl">
                                    <TechIcon name={tech} className="w-5 h-5" />
                                    <span className="text-sm font-medium">{tech}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Gallery Section */}
                {startup.images && startup.images.length > 0 && (
                    <div className="mb-10">
                        <h2 className="flex items-center gap-2 text-sm font-medium text-muted-foreground mb-4 uppercase tracking-wider">
                            <ImageIcon className="w-4 h-4 text-primary" />
                            Sawirro (Screenshots)
                        </h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {startup.images.map((img, index) => (
                                <div
                                    key={img.id}
                                    className="relative aspect-video rounded-2xl overflow-hidden bg-white/5 border border-white/10 cursor-pointer hover:border-primary/50 transition-all group"
                                    onClick={() => setSelectedImage(img.image_url || img.image)}
                                >
                                    <Image
                                        src={img.image_url || img.image}
                                        alt={img.caption || `Screenshot ${index + 1}`}
                                        fill
                                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                        <Maximize2 className="w-8 h-8 text-white" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Video Section */}
                {startup.video_url && (
                    <div className="mb-10">
                        <h2 className="flex items-center gap-2 text-sm font-medium text-muted-foreground mb-4 uppercase tracking-wider">
                            <VideoIcon className="w-4 h-4 text-primary" />
                            Product Video
                        </h2>
                        <div className="relative aspect-video rounded-2xl overflow-hidden bg-white/5 border border-white/10">
                            {getEmbedUrl(startup.video_url) ? (
                                <iframe
                                    src={getEmbedUrl(startup.video_url)!}
                                    className="absolute inset-0 w-full h-full"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                />
                            ) : (
                                <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
                                    <VideoIcon className="w-12 h-12 text-muted-foreground mb-4" />
                                    <p className="text-muted-foreground mb-4">Video waxaa laga heli karaa link-gan hoose:</p>
                                    <a
                                        href={startup.video_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-primary hover:underline font-medium break-all"
                                    >
                                        {startup.video_url}
                                    </a>
                                </div>
                            )}
                        </div>
                    </div>
                )}


                {/* Description */}
                <div className="mb-10">
                    <h2 className="text-sm font-medium text-muted-foreground mb-3 uppercase tracking-wider">Ku Saabsan (About)</h2>
                    <div className="prose prose-invert max-w-none">
                        <p className="text-lg leading-relaxed whitespace-pre-wrap">{startup.description}</p>
                    </div>
                </div>

                {/* Startup Pitch Section */}
                {startup.pitch_data && Object.keys(startup.pitch_data).length > 0 && (
                    <div className="mb-10 py-8 border-t border-white/10">
                        <div className="flex items-center gap-2 mb-6">
                            <HelpCircle className="w-5 h-5 text-primary" />
                            <h2 className="text-xl font-bold">Startup Pitch</h2>
                        </div>

                        <div className="space-y-8">
                            {PITCH_QUESTIONS.map((q) => {
                                const answer = startup.pitch_data[q.id];
                                if (!answer) return null;

                                return (
                                    <div key={q.id} className="group">
                                        <div className="mb-2">
                                            <h3 className="text-sm font-bold text-primary">{q.en}</h3>
                                            <p className="text-xs text-muted-foreground italic">{q.so}</p>
                                        </div>
                                        <div className="p-4 rounded-xl bg-white/5 border border-white/5 group-hover:border-primary/20 transition-colors">
                                            <p className="text-muted-foreground leading-relaxed">
                                                {typeof answer === 'string' ? answer : (answer as any).answer || ""}
                                            </p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}


                {/* Screenshots Gallery */}
                {startup.images.length > 0 && (
                    <div className="mb-10">
                        <h2 className="text-sm font-medium text-muted-foreground mb-3">SAWIRRO</h2>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {startup.images.map((img) => (
                                (img.image || img.image_url) && (
                                    <button
                                        key={img.id}
                                        onClick={() => setSelectedImage(img.image_url || img.image)}
                                        className="relative aspect-video rounded-xl overflow-hidden bg-white/5 hover:opacity-80 transition-opacity"
                                    >
                                        <Image src={img.image_url || img.image} alt={img.caption || "Screenshot"} fill className="object-cover" />
                                    </button>
                                )
                            ))}
                        </div>
                    </div>
                )}

                {/* Maker Profile */}
                <div className="mb-10 p-6 rounded-2xl bg-white/5 border border-white/10">
                    <h2 className="text-sm font-medium text-muted-foreground mb-4">DHISAHA</h2>
                    <div className="flex items-center gap-4">
                        <div className="relative w-12 h-12 rounded-full overflow-hidden bg-white/10">
                            {startup.maker.profile_picture ? (
                                <Image
                                    src={startup.maker.profile_picture}
                                    alt={startup.maker.first_name || startup.maker.username}
                                    fill
                                    className="object-cover"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-lg font-bold text-primary">
                                    {(startup.maker.first_name || startup.maker.username).charAt(0)}
                                </div>
                            )}
                        </div>
                        <div>
                            <p className="font-medium">
                                {startup.maker.first_name} {startup.maker.last_name || startup.maker.username}
                            </p>
                            {startup.maker_completed_courses.length > 0 && (
                                <p className="text-sm text-muted-foreground">
                                    Dhamaysay: {startup.maker_completed_courses.join(", ")}
                                </p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Comments Section */}
                <div className="mb-10">
                    <h2 className="flex items-center gap-2 text-sm font-medium text-muted-foreground mb-4">
                        <MessageSquare className="w-4 h-4" />
                        FAALLOOYINKA ({startup.comments.length})
                    </h2>

                    {/* Comment Form */}
                    <form onSubmit={handleComment} className="flex gap-3 mb-6">
                        <input
                            type="text"
                            value={commentText}
                            onChange={(e) => setCommentText(e.target.value)}
                            placeholder="Ku dar faallo..."
                            className="flex-1 px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-primary/50 focus:outline-none"
                        />
                        <button
                            type="submit"
                            disabled={!commentText.trim() || isCommenting}
                            className="px-4 py-3 bg-primary text-white rounded-xl hover:bg-primary/90 transition-colors disabled:opacity-50"
                        >
                            {isCommenting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                        </button>
                    </form>

                    {/* Comments List */}
                    {startup.comments.length === 0 ? (
                        <p className="text-center text-muted-foreground py-8">
                            Ma jiraan faallooyinka. Noqo kan ugu horreeya!
                        </p>
                    ) : (
                        <div className="space-y-4">
                            {startup.comments.map((comment) => (
                                <div key={comment.id} className="p-4 rounded-xl bg-white/5 border border-white/10">
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className="relative w-8 h-8 rounded-full overflow-hidden bg-white/10">
                                            {comment.author.profile_picture ? (
                                                <Image
                                                    src={comment.author.profile_picture}
                                                    alt={comment.author.username}
                                                    fill
                                                    className="object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-xs font-bold text-primary">
                                                    {(comment.author.first_name || comment.author.username).charAt(0)}
                                                </div>
                                            )}
                                        </div>
                                        <div>
                                            <span className="font-medium text-sm">
                                                {comment.author.first_name || comment.author.username}
                                            </span>
                                            <span className="text-xs text-muted-foreground ml-2">
                                                {new Date(comment.created_at).toLocaleDateString("so-SO")}
                                            </span>
                                        </div>
                                    </div>
                                    <p className="text-sm">{comment.content}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </main>

            <FooterSection />

            {/* Image Modal */}
            {selectedImage && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 animate-in fade-in duration-200"
                    onClick={() => setSelectedImage(null)}
                >
                    <button
                        className="absolute top-4 right-4 p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors"
                        onClick={() => setSelectedImage(null)}
                    >
                        <X className="w-6 h-6 text-white" />
                    </button>
                    <div className="relative w-full max-w-5xl aspect-video rounded-2xl overflow-hidden">
                        <Image
                            src={selectedImage}
                            alt="Full view"
                            fill
                            className="object-contain"
                        />
                    </div>
                </div>
            )}
        </div>
    );
}
