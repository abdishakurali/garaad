"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { StartupListItem } from "@/types/launchpad";
import { ChevronUp, ExternalLink, Briefcase, CheckCircle2, MessageSquare } from "lucide-react";

interface StartupCardProps {
    startup: StartupListItem;
    rank?: number;
    onVote: () => void;
}

export function StartupCard({ startup, rank, onVote }: StartupCardProps) {
    const [isVoting, setIsVoting] = useState(false);

    const handleVote = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (isVoting) return;

        setIsVoting(true);
        try {
            await onVote();
        } finally {
            setIsVoting(false);
        }
    };

    return (
        <Link href={`/launchpad/${startup.id}`}>
            <div className="group relative p-5 rounded-2xl bg-white/5 border border-white/10 hover:border-primary/30 hover:bg-white/10 transition-all duration-300 cursor-pointer">
                {/* Rank Badge */}
                {rank && rank <= 3 && (
                    <div className={`absolute -top-2 -left-2 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${rank === 1 ? "bg-yellow-500 text-black" :
                            rank === 2 ? "bg-gray-400 text-black" :
                                "bg-amber-700 text-white"
                        }`}>
                        #{rank}
                    </div>
                )}

                <div className="flex gap-4">
                    {/* Logo */}
                    <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-white/10 flex-shrink-0">
                        {startup.logo ? (
                            <Image
                                src={startup.logo}
                                alt={startup.title}
                                fill
                                className="object-cover"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-2xl font-bold text-primary">
                                {startup.title.charAt(0)}
                            </div>
                        )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                            <div>
                                <h3 className="font-bold text-lg group-hover:text-primary transition-colors line-clamp-1">
                                    {startup.title}
                                </h3>
                                <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                                    {startup.tagline}
                                </p>
                            </div>

                            {/* Upvote Button */}
                            <button
                                onClick={handleVote}
                                disabled={isVoting}
                                className={`flex flex-col items-center justify-center px-3 py-2 rounded-xl border transition-all flex-shrink-0 ${startup.user_has_voted
                                        ? "bg-primary/20 border-primary/30 text-primary"
                                        : "bg-white/5 border-white/10 hover:border-primary/30 hover:bg-primary/10"
                                    } ${isVoting ? "opacity-50" : ""}`}
                            >
                                <ChevronUp className={`w-5 h-5 ${startup.user_has_voted ? "text-primary" : ""}`} />
                                <span className="text-sm font-bold">{startup.vote_count}</span>
                            </button>
                        </div>

                        {/* Badges */}
                        <div className="flex flex-wrap items-center gap-2 mt-3">
                            {startup.is_built_on_garaad && (
                                <span className="inline-flex items-center gap-1 px-2 py-1 bg-primary/20 text-primary text-xs font-medium rounded-full">
                                    <CheckCircle2 className="w-3 h-3" />
                                    Lagu Dhisay Garaad
                                </span>
                            )}
                            {startup.is_hiring && (
                                <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-500/20 text-green-400 text-xs font-medium rounded-full">
                                    <Briefcase className="w-3 h-3" />
                                    Shaqaalaynaya
                                </span>
                            )}
                            {startup.comments_count > 0 && (
                                <span className="inline-flex items-center gap-1 px-2 py-1 bg-white/10 text-muted-foreground text-xs font-medium rounded-full">
                                    <MessageSquare className="w-3 h-3" />
                                    {startup.comments_count}
                                </span>
                            )}
                        </div>

                        {/* Tech Stack */}
                        {startup.tech_stack.length > 0 && (
                            <div className="flex flex-wrap gap-1.5 mt-3">
                                {startup.tech_stack.slice(0, 4).map((tech) => (
                                    <span
                                        key={tech}
                                        className="px-2 py-0.5 bg-white/5 border border-white/10 text-xs text-muted-foreground rounded"
                                    >
                                        {tech}
                                    </span>
                                ))}
                                {startup.tech_stack.length > 4 && (
                                    <span className="px-2 py-0.5 text-xs text-muted-foreground">
                                        +{startup.tech_stack.length - 4}
                                    </span>
                                )}
                            </div>
                        )}

                        {/* Maker Info */}
                        <div className="flex items-center gap-2 mt-3 pt-3 border-t border-white/5">
                            <div className="relative w-6 h-6 rounded-full overflow-hidden bg-white/10">
                                {startup.maker.profile_picture ? (
                                    <Image
                                        src={startup.maker.profile_picture}
                                        alt={startup.maker.first_name || startup.maker.username}
                                        fill
                                        className="object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-xs font-bold text-primary">
                                        {(startup.maker.first_name || startup.maker.username).charAt(0)}
                                    </div>
                                )}
                            </div>
                            <span className="text-sm text-muted-foreground">
                                {startup.maker.first_name || startup.maker.username}
                            </span>
                            {startup.maker_completed_courses.length > 0 && (
                                <span className="text-xs text-primary/70">
                                    • {startup.maker_completed_courses.length} course(s)
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    );
}
