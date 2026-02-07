"use client";

import React, { useEffect } from "react";
import { useCommunityStore } from "@/store/useCommunityStore";
import { useAuthStore } from "@/store/useAuthStore";
import { PostCard } from "@/components/community/PostCard";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Globe, Users, ArrowRight } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function CommunityPreviewPage() {
    const { posts, loading, errors, fetchPublicPosts } = useCommunityStore();
    const { isAuthenticated } = useAuthStore();

    useEffect(() => {
        fetchPublicPosts();
    }, [fetchPublicPosts]);

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <Header />

            <main className="flex-1 overflow-y-auto">
                <div className="max-w-6xl mx-auto px-4 py-8">


                    {/* Posts Feed */}
                    <div className="space-y-8">
                        <div className="flex items-center justify-between mb-8 sticky top-0 z-20 bg-background/80 backdrop-blur-xl py-4 border-b">
                            <h2 className="text-2xl font-bold flex items-center gap-3">
                                <Globe className="h-6 w-6 text-blue-500 animate-pulse" />
                                Qoraallada Dadwaynaha
                            </h2>
                            <div className="flex items-center gap-3">
                                <span className="text-sm font-bold px-3 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full border border-blue-100 dark:border-blue-800 shadow-sm">
                                    {posts.length} Qoraall
                                </span>
                            </div>
                        </div>

                        {loading.posts && posts.length === 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {[1, 2, 3, 4, 5, 6].map((i) => (
                                    <div key={i} className="p-6 bg-card rounded-2xl border shadow-sm space-y-4">
                                        <div className="flex items-center gap-4">
                                            <Skeleton className="h-10 w-10 rounded-full" />
                                            <div className="space-y-2">
                                                <Skeleton className="h-4 w-32 rounded-lg" />
                                                <Skeleton className="h-3 w-20 rounded-lg" />
                                            </div>
                                        </div>
                                        <Skeleton className="h-32 w-full rounded-2xl" />
                                    </div>
                                ))}
                            </div>
                        ) : errors.posts ? (
                            <div className="p-20 text-center rounded-[3rem] border-2 border-dashed bg-muted/30">
                                <div className="bg-red-50 dark:bg-red-900/20 p-6 rounded-3xl inline-block mb-6">
                                    <ArrowRight className="h-10 w-10 text-red-500 rotate-180" />
                                </div>
                                <p className="text-red-500 font-extrabold text-xl mb-6">{errors.posts}</p>
                                <Button variant="outline" onClick={() => fetchPublicPosts()} className="rounded-full px-10 py-6 text-lg font-bold shadow-lg hover:shadow-xl transition-all">
                                    Mar kale isku day
                                </Button>
                            </div>
                        ) : posts.length === 0 ? (
                            <div className="p-32 text-center rounded-[4rem] border-2 border-dashed bg-muted/20 border-border/50">
                                <div className="bg-muted p-8 rounded-full inline-block mb-8">
                                    <Globe className="h-20 w-20 text-muted-foreground opacity-20" />
                                </div>
                                <h3 className="text-3xl font-black mb-4">Ma jiraan Qoraall</h3>
                                <p className="text-muted-foreground text-xl max-w-md mx-auto leading-relaxed">Hadda ma jiraan Qoraall dadwaynaha loo soo bandhigay oo halkan yaala.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-32">
                                {posts.map((post) => (
                                    <PostCard
                                        key={post.id}
                                        post={post}
                                        userProfile={null}
                                        // Interactive features disabled for preview
                                        isReadOnly={true}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </main>


        </div>
    );
}
