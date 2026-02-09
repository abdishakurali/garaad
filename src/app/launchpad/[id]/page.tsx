"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Header as SiteHeader } from "@/components/Header";
import { FooterSection } from "@/components/sections/FooterSection";
import { launchpadService } from "@/services/launchpad";
import type { StartupDetail, StartupComment } from "@/types/launchpad";
import {
    ChevronUp,
    ExternalLink,
    Briefcase,
    CheckCircle2,
    ArrowLeft,
    Send,
    MessageSquare,
    Share2,
    Loader2,
} from "lucide-react";

export default function StartupDetailPage() {
    const params = useParams();
    const startupId = params.id as string;

    const [startup, setStartup] = useState<StartupDetail | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isVoting, setIsVoting] = useState(false);
    const [commentText, setCommentText] = useState("");
    const [isCommenting, setIsCommenting] = useState(false);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);

    useEffect(() => {
        const fetchStartup = async () => {
            setIsLoading(true);
            try {
                const data = await launchpadService.getStartup(startupId);
                setStartup(data);
            } catch (err) {
                setError("Startup-kan lama helin");
                console.error("Failed to fetch startup:", err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchStartup();
    }, [startupId]);

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
        if (navigator.share) {
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
                        {startup.logo ? (
                            <Image src={startup.logo} alt={startup.title} fill className="object-cover" />
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
                            {startup.is_hiring && (
                                <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-500/20 text-green-400 text-sm font-medium rounded-full">
                                    <Briefcase className="w-4 h-4" />
                                    Shaqaalaynaya
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
                                    {startup.user_has_voted ? "Waad codaysay" : "Codee"}
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
                        </div>
                    </div>
                </div>

                {/* Tech Stack */}
                {startup.tech_stack.length > 0 && (
                    <div className="mb-8">
                        <h2 className="text-sm font-medium text-muted-foreground mb-3">TECH STACK</h2>
                        <div className="flex flex-wrap gap-2">
                            {startup.tech_stack.map((tech) => (
                                <span
                                    key={tech}
                                    className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-sm"
                                >
                                    {tech}
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                {/* Description */}
                <div className="mb-10">
                    <h2 className="text-sm font-medium text-muted-foreground mb-3">KU SAABSAN</h2>
                    <div className="prose prose-invert max-w-none">
                        <p className="text-lg leading-relaxed whitespace-pre-wrap">{startup.description}</p>
                    </div>
                </div>

                {/* Screenshots Gallery */}
                {startup.images.length > 0 && (
                    <div className="mb-10">
                        <h2 className="text-sm font-medium text-muted-foreground mb-3">SAWIRRO</h2>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {startup.images.map((img) => (
                                <button
                                    key={img.id}
                                    onClick={() => setSelectedImage(img.image)}
                                    className="relative aspect-video rounded-xl overflow-hidden bg-white/5 hover:opacity-80 transition-opacity"
                                >
                                    <Image src={img.image} alt={img.caption || "Screenshot"} fill className="object-cover" />
                                </button>
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

            {/* Image Modal */}
            {selectedImage && (
                <div
                    className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
                    onClick={() => setSelectedImage(null)}
                >
                    <div className="relative max-w-4xl max-h-[90vh]">
                        <Image
                            src={selectedImage}
                            alt="Screenshot"
                            width={1200}
                            height={800}
                            className="object-contain max-h-[90vh]"
                        />
                    </div>
                </div>
            )}

            <FooterSection />
        </div>
    );
}
