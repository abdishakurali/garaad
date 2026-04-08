"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { Project } from "@/types/launchpad";
import { ChevronUp, ExternalLink, MessageSquare, Github } from "lucide-react";
import { TechIcon } from "./TechIcon";
import { relativeTimeSomali } from "./relativeTime";

interface ProjectCardProps {
    project: Project;
    onVote: () => Promise<{ voted: boolean; vote_count: number }>;
    onVoteSuccess?: () => void;
}

export function ProjectCard({ project, onVote, onVoteSuccess }: ProjectCardProps) {
    const [isVoting, setIsVoting] = useState(false);
    const [voteCount, setVoteCount] = useState(project.vote_count);
    const [hasVoted, setHasVoted] = useState(project.has_voted);

    const handleVote = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (isVoting) return;

        const prevCount = voteCount;
        const prevVoted = hasVoted;
        setHasVoted(!prevVoted);
        setVoteCount(prevVoted ? prevCount - 1 : prevCount + 1);
        setIsVoting(true);

        try {
            const res = await onVote();
            setVoteCount(res.vote_count);
            setHasVoted(res.voted);
            if (res.voted && onVoteSuccess) onVoteSuccess();
        } catch {
            setVoteCount(prevCount);
            setHasVoted(prevVoted);
        } finally {
            setIsVoting(false);
        }
    };

    return (
        <Link href={`/launchpad/project/${project.slug}`}>
            <div className="group rounded-2xl border border-white/10 bg-white/5 p-5 transition-all hover:border-purple-500/40">
                <div className="flex gap-4">
                    <div className="relative h-14 w-14 flex-shrink-0 overflow-hidden rounded-xl bg-white/10">
                        {project.logo_url ? (
                            <Image
                                src={project.logo_url}
                                alt={project.title}
                                fill
                                className="object-contain"
                            />
                        ) : (
                            <div className="flex h-full w-full items-center justify-center text-xl font-bold text-primary">
                                {project.title.charAt(0)}
                            </div>
                        )}
                    </div>
                    <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-2">
                            <div>
                                <h3 className="line-clamp-1 font-bold text-lg transition-colors group-hover:text-primary">
                                    {project.title}
                                </h3>
                                <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                                    {project.tagline}
                                </p>
                            </div>
                            <button
                                onClick={handleVote}
                                disabled={isVoting}
                                className={`flex flex-shrink-0 flex-col items-center justify-center rounded-xl border px-3 py-2 transition-all ${
                                    hasVoted
                                        ? "border-primary/30 bg-primary/20 text-primary"
                                        : "border-white/10 bg-white/5 hover:border-primary/30 hover:bg-primary/10"
                                } ${isVoting ? "opacity-50" : ""}`}
                            >
                                <ChevronUp className={`h-5 w-5 ${hasVoted ? "text-primary" : ""}`} />
                                <span className="text-sm font-bold">{voteCount}</span>
                            </button>
                        </div>

                        {project.course_title && (
                            <span className="mt-2 inline-flex rounded-full bg-primary/20 px-2 py-0.5 text-xs font-medium text-primary">
                                Built during: {project.course_title}
                            </span>
                        )}

                        <div className="mt-3 flex flex-wrap items-center gap-2">
                            {project.comments_count > 0 && (
                                <span className="inline-flex items-center gap-1 rounded-full bg-white/10 px-2 py-1 text-xs font-medium text-muted-foreground">
                                    <MessageSquare className="h-3 w-3" />
                                    {project.comments_count}
                                </span>
                            )}
                            {project.repo_url && (
                                <a
                                    href={project.repo_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    onClick={(e) => e.stopPropagation()}
                                    className="inline-flex items-center gap-1 rounded-full bg-white/10 px-2 py-1 text-xs font-medium text-muted-foreground hover:bg-white/20"
                                >
                                    <Github className="h-3 w-3" />
                                    Repo
                                </a>
                            )}
                        </div>

                        {project.tech_stack.length > 0 && (
                            <div className="mt-3 flex flex-wrap items-center gap-2">
                                {project.tech_stack.slice(0, 5).map((tech) => (
                                    <TechIcon key={tech} name={tech} className="h-4 w-4" />
                                ))}
                                {project.tech_stack.length > 5 && (
                                    <span className="text-[10px] font-medium text-muted-foreground">
                                        +{project.tech_stack.length - 5}
                                    </span>
                                )}
                            </div>
                        )}

                        <div className="mt-3 flex items-center gap-2 border-t border-white/5 pt-3">
                            <span className="text-sm text-muted-foreground">
                                {project.maker_username}
                            </span>
                            <span className="text-xs text-muted-foreground/80">
                                · {relativeTimeSomali(project.created_at)}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    );
}
