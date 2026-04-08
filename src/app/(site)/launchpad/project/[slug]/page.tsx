"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useAuthStore } from "@/store/useAuthStore";
import { launchpadService } from "@/services/launchpad";
import type { Project } from "@/types/launchpad";
import { ChevronUp, ExternalLink, MessageSquare, ArrowLeft, Send, Github, Loader2 } from "lucide-react";
import { TechIcon } from "@/components/launchpad/TechIcon";
import { ActionToast } from "@/components/launchpad/ActionToast";
import { relativeTimeSomali } from "@/components/launchpad/relativeTime";

export default function ProjectDetailPage() {
    const params = useParams();
    const router = useRouter();
    const slug = params.slug as string;
    const { isAuthenticated } = useAuthStore();

    const [project, setProject] = useState<Project | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isVoting, setIsVoting] = useState(false);
    const [commentText, setCommentText] = useState("");
    const [isCommenting, setIsCommenting] = useState(false);
    const [showActionToast, setShowActionToast] = useState(false);

    useEffect(() => {
        if (!slug) return;
        const fetchProject = async () => {
            setIsLoading(true);
            try {
                const data = await launchpadService.getProject(slug);
                setProject(data);
            } catch (err) {
                setError("Mashruucaan lama helin");
                console.error("Failed to fetch project:", err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchProject();
    }, [slug]);

    const handleVote = async () => {
        if (!project || isVoting) return;
        setIsVoting(true);
        try {
            const res = await launchpadService.voteProject(project.slug);
            setProject({ ...project, vote_count: res.vote_count, has_voted: res.voted });
            if (res.voted) {
                setShowActionToast(true);
                setTimeout(() => setShowActionToast(false), 2500);
            }
        } catch (err) {
            console.error("Vote failed:", err);
        } finally {
            setIsVoting(false);
        }
    };

    const handleComment = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!project || !commentText.trim() || isCommenting) return;
        setIsCommenting(true);
        try {
            const comment = await launchpadService.addProjectComment(project.slug, commentText.trim());
            setProject({
                ...project,
                comments: [...(project.comments || []), comment],
                comments_count: (project.comments_count ?? 0) + 1,
            });
            setCommentText("");
            setShowActionToast(true);
            setTimeout(() => setShowActionToast(false), 2500);
        } catch (err) {
            console.error("Comment failed:", err);
        } finally {
            setIsCommenting(false);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <Loader2 className="w-10 h-10 animate-spin text-primary" />
            </div>
        );
    }
    if (error || !project) {
        return (
            <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4 px-4">
                <p className="text-red-400">{error ?? "Mashruuc lama helin"}</p>
                <Link href="/launchpad?tab=projects" className="text-primary hover:underline">
                    Ku noqo Launchpad
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            {showActionToast && <ActionToast onDismiss={() => setShowActionToast(false)} />}
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <Link
                    href="/launchpad?tab=projects"
                    className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Launchpad · Projects
                </Link>

                <div className="rounded-2xl border border-white/10 bg-white/5 p-6 sm:p-8">
                    <div className="flex gap-6">
                        <div className="relative h-20 w-20 flex-shrink-0 rounded-xl overflow-hidden bg-white/10">
                            {project.logo_url ? (
                                <Image src={project.logo_url} alt={project.title} fill className="object-contain" />
                            ) : (
                                <div className="flex h-full w-full items-center justify-center text-2xl font-bold text-primary">
                                    {project.title.charAt(0)}
                                </div>
                            )}
                        </div>
                        <div className="min-w-0 flex-1">
                            <h1 className="text-2xl font-bold">{project.title}</h1>
                            <p className="mt-1 text-muted-foreground">{project.tagline}</p>
                            {project.course_title && (
                                <span className="mt-2 inline-flex rounded-full bg-primary/20 px-2 py-0.5 text-xs font-medium text-primary">
                                    Built during: {project.course_title}
                                </span>
                            )}
                            <div className="mt-4 flex items-center gap-4">
                                <button
                                    onClick={handleVote}
                                    disabled={!isAuthenticated || isVoting}
                                    className={`flex items-center gap-2 rounded-xl border px-4 py-2 transition ${
                                        project.has_voted
                                            ? "border-primary/30 bg-primary/20 text-primary"
                                            : "border-white/10 bg-white/5 hover:border-primary/30"
                                    } ${!isAuthenticated ? "opacity-60 cursor-not-allowed" : ""}`}
                                >
                                    <ChevronUp className="w-5 h-5" />
                                    <span className="font-bold">{project.vote_count}</span>
                                </button>
                                {project.website_url && (
                                    <a
                                        href={project.website_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2 hover:bg-white/10"
                                    >
                                        <ExternalLink className="w-4 h-4" />
                                        Website
                                    </a>
                                )}
                                {project.repo_url && (
                                    <a
                                        href={project.repo_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2 hover:bg-white/10"
                                    >
                                        <Github className="w-4 h-4" />
                                        Repo
                                    </a>
                                )}
                            </div>
                        </div>
                    </div>

                    {project.description && (
                        <div className="mt-6 pt-6 border-t border-white/10">
                            <p className="text-muted-foreground whitespace-pre-wrap">{project.description}</p>
                        </div>
                    )}

                    {project.tech_stack.length > 0 && (
                        <div className="mt-6 flex flex-wrap gap-2">
                            {project.tech_stack.map((tech) => (
                                <TechIcon key={tech} name={tech} className="h-5 w-5" />
                            ))}
                        </div>
                    )}

                    <div className="mt-6 pt-6 border-t border-white/10 flex items-center gap-2 text-sm text-muted-foreground">
                        <span>{project.maker_username}</span>
                        <span>·</span>
                        <span>{relativeTimeSomali(project.created_at)}</span>
                    </div>
                </div>

                <div className="mt-8">
                    <h2 className="text-lg font-bold flex items-center gap-2">
                        <MessageSquare className="w-5 h-5" />
                        Faallooyin ({project.comments_count})
                    </h2>
                    {isAuthenticated && (
                        <form onSubmit={handleComment} className="mt-4 flex gap-2">
                            <input
                                type="text"
                                value={commentText}
                                onChange={(e) => setCommentText(e.target.value)}
                                placeholder="Qoraal faallo..."
                                maxLength={1000}
                                className="flex-1 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary"
                            />
                            <button
                                type="submit"
                                disabled={!commentText.trim() || isCommenting}
                                className="rounded-xl bg-primary px-4 py-3 text-white font-medium hover:bg-primary/90 disabled:opacity-50 flex items-center gap-2"
                            >
                                {isCommenting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                                Dir
                            </button>
                        </form>
                    )}
                    <ul className="mt-6 space-y-4">
                        {(project.comments || []).map((c) => (
                            <li key={c.id} className="rounded-xl border border-white/10 bg-white/5 p-4">
                                <div className="flex items-center gap-2 text-sm">
                                    <span className="font-medium">{c.author_username}</span>
                                    <span className="text-muted-foreground text-xs">{relativeTimeSomali(c.created_at)}</span>
                                </div>
                                <p className="mt-2 text-foreground">{c.content}</p>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
}
