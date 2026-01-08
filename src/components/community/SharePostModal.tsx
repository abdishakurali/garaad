"use client";

import React, { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
    Share2,
    Copy,
    Check,
    Download,
    Globe,
    MessageSquare,
    ExternalLink
} from "lucide-react";
import {
    CommunityPost,
    REACTION_ICONS,
    SOMALI_UI_TEXT,
    getUserDisplayName
} from "@/types/community";
import { Logo } from "@/components/ui/Logo";
import AuthenticatedAvatar from "@/components/ui/authenticated-avatar";
import { getMediaUrl, cn, formatSomaliRelativeTime } from "@/lib/utils";
import { toast } from "sonner";
import html2canvas from "html2canvas-pro";

interface SharePostModalProps {
    post: CommunityPost;
    isOpen: boolean;
    onClose: () => void;
}

export function SharePostModal({ post, isOpen, onClose }: SharePostModalProps) {
    const [copied, setCopied] = useState(false);
    const [isDownloading, setIsDownloading] = useState(false);
    const cardRef = React.useRef<HTMLDivElement>(null);

    const shareUrl = typeof window !== "undefined"
        ? `${window.location.origin}/community?post=${post.id}`
        : "";

    const handleCopyLink = () => {
        navigator.clipboard.writeText(shareUrl);
        setCopied(true);
        toast.success("Link-iga waa la koobiyeeyay!");
        setTimeout(() => setCopied(false), 2000);
    };

    const handleDownloadImage = async () => {
        if (!cardRef.current) return;

        setIsDownloading(true);
        try {
            // Give a tiny bit of time for any pending images to fully render
            await new Promise(resolve => setTimeout(resolve, 150));

            const canvas = await html2canvas(cardRef.current, {
                useCORS: true,
                scale: 3, // Very high quality for sharing
                backgroundColor: null,
                logging: false,
                allowTaint: true,
            });

            const dataUrl = canvas.toDataURL("image/png");
            const link = document.createElement("a");
            link.download = `garaad-post-${post.id}.png`;
            link.href = dataUrl;
            link.click();
            toast.success("Sawirka waa la soo dejiyay!");
        } catch (error) {
            console.error("Error generating image:", error);
            toast.error("Ma suuroobin in sawir la sameeyo.");
        } finally {
            setIsDownloading(false);
        }
    };

    const handleNativeShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: `Garaad Community - Post by ${getUserDisplayName(post.author)}`,
                    text: post.content.substring(0, 100) + (post.content.length > 100 ? "..." : ""),
                    url: shareUrl,
                });
            } catch (error) {
                console.error("Error sharing:", error);
            }
        } else {
            handleCopyLink();
        }
    };

    const totalReactions = Object.values(post.reactions_count).reduce((a, b) => a + b, 0);

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[480px] p-0 overflow-hidden bg-white dark:bg-[#1E1F22] border-none shadow-2xl rounded-[2rem]">
                <DialogHeader className="sr-only">
                    <DialogTitle>La wadaag Qoraalka</DialogTitle>
                    <DialogDescription>
                        Halkan ka koobiyeey link-iga ama si toos ah ula wadaag asxaabtaada.
                    </DialogDescription>
                </DialogHeader>

                {/* Branded Preview Background */}
                <div className="bg-gradient-to-br from-primary/10 via-purple-500/5 to-transparent p-6 sm:p-8">
                    {/* The "Card" for Preview */}
                    <div
                        ref={cardRef}
                        className="bg-white dark:bg-black rounded-[1.5rem] border border-gray-100 dark:border-white/5 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-500"
                    >
                        {/* Branded Header */}
                        <div className="px-5 py-4 border-b border-gray-50 dark:border-white/5 flex items-center justify-between bg-gray-50/50 dark:bg-white/5">
                            <Logo className="h-6 sm:h-7" />
                            <div className="flex items-center gap-1.5 px-2 py-0.5 bg-primary/10 rounded-full border border-primary/20">
                                <Globe className="h-3 w-3 text-primary animate-pulse" />
                                <span className="text-[9px] font-black text-primary uppercase tracking-tighter">Community</span>
                            </div>
                        </div>

                        <div className="p-5">
                            {/* Author Row */}
                            <div className="flex items-center gap-3 mb-4">
                                <AuthenticatedAvatar
                                    src={getMediaUrl(post.author?.profile_picture, 'profile_pics')}
                                    alt={getUserDisplayName(post.author)}
                                    size="sm"
                                    className="ring-2 ring-primary/20"
                                />
                                <div className="flex flex-col">
                                    <span className="text-xs font-black dark:text-white leading-none mb-1">
                                        {getUserDisplayName(post.author)}
                                    </span>
                                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                        {formatSomaliRelativeTime(post.created_at)}
                                    </span>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="mb-4">
                                <p className="text-sm dark:text-gray-200 line-clamp-6 leading-relaxed whitespace-pre-wrap">
                                    {post.content}
                                </p>
                            </div>

                            {/* Images Preview (Simple grid if present) */}
                            {post.images && post.images.length > 0 && (
                                <div className="mb-4 grid grid-cols-2 gap-2 rounded-xl overflow-hidden border border-gray-100 dark:border-white/5 opacity-80">
                                    {post.images.slice(0, 2).map((img, idx) => (
                                        <div key={idx} className="aspect-square bg-gray-100 dark:bg-white/5">
                                            {/* We don't need real images for the preview modal necessarily, but let's show them */}
                                            <img
                                                src={typeof img === 'string' ? img : getMediaUrl(img?.image, 'community_posts')}
                                                className="w-full h-full object-cover"
                                                alt="post"
                                            />
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Stats Line */}
                            <div className="flex items-center justify-between pt-4 border-t border-gray-50 dark:border-white/5">
                                <div className="flex items-center gap-2">
                                    <div className="flex items-center -space-x-1.5">
                                        {Object.entries(post.reactions_count)
                                            .filter(([_, count]) => count > 0)
                                            .slice(0, 3)
                                            .map(([type]) => (
                                                <div key={type} className="w-5 h-5 rounded-full bg-white dark:bg-gray-800 border border-gray-100 dark:border-white/10 flex items-center justify-center text-[11px] shadow-sm z-10 transition-transform hover:scale-110">
                                                    {REACTION_ICONS[type as any] || "❤️"}
                                                </div>
                                            ))
                                        }
                                    </div>
                                    {totalReactions > 0 && (
                                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{totalReactions} Falcelin</span>
                                    )}
                                </div>
                                <div className="flex items-center gap-1 text-[10px] font-black text-primary/60 uppercase tracking-widest">
                                    <MessageSquare className="h-3 w-3" />
                                    <span>{post.replies_count} Jawaab</span>
                                </div>
                            </div>
                        </div>

                        {/* Branded Footer on Card */}
                        <div className="px-5 py-3 bg-primary text-center">
                            <p className="text-[10px] font-black text-white/90 uppercase tracking-[0.2em]">Join the challenge @ Garaad.org</p>
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="p-6 sm:p-8 pt-0 grid gap-3">
                    <div className="flex items-center gap-3">
                        <Button
                            onClick={handleCopyLink}
                            variant="secondary"
                            className="flex-1 h-12 rounded-2xl font-black text-xs uppercase tracking-widest gap-2 bg-gray-50 hover:bg-gray-100 dark:bg-white/5 dark:hover:bg-white/10 border border-transparent hover:border-primary/20 transition-all group"
                        >
                            {copied ? (
                                <>
                                    <Check className="h-4 w-4 text-green-500 animate-in zoom-in" />
                                    <span>Waa la koobiyeeyay</span>
                                </>
                            ) : (
                                <>
                                    <Copy className="h-4 w-4 text-primary group-hover:scale-110 transition-transform" />
                                    <span>Koobiyeey Link-iga</span>
                                </>
                            )}
                        </Button>

                        <Button
                            onClick={handleDownloadImage}
                            disabled={isDownloading}
                            variant="secondary"
                            className="h-12 w-12 rounded-2xl bg-gray-50 hover:bg-gray-100 dark:bg-white/5 dark:hover:bg-white/10 p-0 transition-all border border-transparent hover:border-primary/20"
                            title="Soo deji sawirka"
                        >
                            {isDownloading ? (
                                <Download className="h-5 w-5 animate-bounce text-primary" />
                            ) : (
                                <Download className="h-5 w-5" />
                            )}
                        </Button>

                        <Button
                            onClick={handleNativeShare}
                            className="h-12 w-12 rounded-2xl bg-primary text-white p-0 hover:scale-105 active:scale-95 transition-all shadow-lg shadow-primary/25"
                        >
                            <Share2 className="h-5 w-5" />
                        </Button>
                    </div>

                    <p className="text-center text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center justify-center gap-2">
                        <ExternalLink className="h-3 w-3" />
                        Mid kasta oo asxaabtaada ah oo soo gala wuxuu helayaa dhibco!
                    </p>
                </div>
            </DialogContent>
        </Dialog>
    );
}
