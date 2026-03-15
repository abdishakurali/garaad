"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Clock,
    Calendar,
    ArrowRight,
    Search,
    Loader2,
    Newspaper,
} from "lucide-react";
import { SharePost } from "@/components/SharePost";
import { BlogPost } from "@/types/blog";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";

interface BlogListClientProps {
    initialPosts: BlogPost[];
}

export function BlogListClient({ initialPosts }: BlogListClientProps) {
    const searchParams = useSearchParams();
    const querySearch = searchParams.get("search");

    const [posts, setPosts] = useState<BlogPost[]>(initialPosts);
    const [searchTerm, setSearchTerm] = useState(querySearch || "");
    const [activeTab, setActiveTab] = useState("all");

    useEffect(() => {
        if (querySearch) {
            setSearchTerm(querySearch);
        }
    }, [querySearch]);

    const filteredPosts = useMemo(() => {
        return posts.filter(post => {
            const matchesSearch =
                post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                post.excerpt?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                post.meta_description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                post.tags.some(tag => tag.name.toLowerCase().includes(searchTerm.toLowerCase()));

            if (activeTab === "all") return matchesSearch;
            return matchesSearch && post.tags.some(tag => tag.slug === activeTab);
        });
    }, [posts, searchTerm, activeTab]);

    const allTags = useMemo(() => {
        const tagsMap = new Map();
        posts.forEach(post => {
            post.tags.forEach(tag => {
                tagsMap.set(tag.slug, tag.name);
            });
        });
        return Array.from(tagsMap.entries()).map(([slug, name]) => ({ slug, name }));
    }, [posts]);

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("so-SO", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    };

    const calculateReadingTime = (content: string) => {
        if (!content) return 1;
        const wordsPerMinute = 200;
        const words = content.split(/\s+/).length;
        return Math.max(1, Math.ceil(words / wordsPerMinute));
    };

    const renderPostCard = (post: BlogPost) => {
        const href = `/blog/${post.slug}`;
        const readingTime = calculateReadingTime(post.body);

        return (
            <Card key={post.id} className="group overflow-hidden border border-slate-100 dark:border-zinc-800 bg-white dark:bg-zinc-900 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-1">
                <div className="relative aspect-[16/10] w-full overflow-hidden">
                    <Link href={href} className="absolute inset-0 z-10">
                        <span className="sr-only">Akhri: {post.title}</span>
                    </Link>
                    {(post.cover || post.cover_image_url) ? (
                        <Image
                            src={post.cover || post.cover_image_url || ""}
                            alt={post.title}
                            fill
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            className="object-cover transition-transform duration-700 group-hover:scale-110"
                            priority={post.id === posts[0]?.id}
                        />
                    ) : (
                        <div className="w-full h-full bg-zinc-800 flex items-center justify-center">
                            <span className="text-zinc-600 text-sm">Garaad</span>
                        </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    {post.tags.length > 0 && (
                        <Badge className="absolute top-4 left-4 z-20 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-sm text-slate-900 dark:text-zinc-100 hover:bg-white dark:hover:bg-zinc-800 border-none shadow-sm capitalize">
                            {post.tags[0].name}
                        </Badge>
                    )}
                </div>

                <CardContent className="p-6">
                    <div className="flex items-center gap-4 mb-4 text-[11px] font-medium uppercase tracking-wider text-slate-500 dark:text-zinc-400">
                        <div className="flex items-center">
                            <Calendar className="mr-1.5 h-3.5 w-3.5" />
                            {formatDate(post.published_at)}
                        </div>
                        <div className="flex items-center">
                            <Clock className="mr-1.5 h-3.5 w-3.5" />
                            {readingTime} daqiiqo
                        </div>
                    </div>

                    <Link
                        href={href}
                        className="block group-hover:text-primary transition-colors mb-3"
                    >
                        <h3 className="font-bold font-serif text-xl md:text-2xl leading-tight line-clamp-2 decoration-primary/30 group-hover:underline underline-offset-4 text-slate-900 dark:text-zinc-100">
                            {post.title}
                        </h3>
                    </Link>

                    <p className="line-clamp-3 text-sm text-slate-600 dark:text-zinc-400 mb-6 leading-relaxed">
                        {post.excerpt || post.meta_description}
                    </p>

                    <div className="flex items-center justify-between pt-4 border-t border-slate-50 dark:border-zinc-800">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">
                                {post.author_name?.[0]?.toUpperCase()}
                            </div>
                            <span className="text-xs font-semibold text-slate-700 dark:text-zinc-300">{post.author_name}</span>
                        </div>
                        <SharePost title={post.title} slug={post.slug} />
                    </div>
                </CardContent>
            </Card>
        );
    };

    return (
        <>
            {/* Hero section with refined design */}
            <section className="relative pt-20 pb-16 md:pt-32 md:pb-24 bg-white dark:bg-black border-b border-slate-100 dark:border-zinc-800 transition-colors duration-500">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="text-center max-w-3xl mx-auto">
                        <Badge variant="secondary" className="mb-6 bg-primary/10 text-primary border-none px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest">
                            Wargeyska Garaad
                        </Badge>
                        <h1 className="text-4xl md:text-6xl font-extrabold font-serif text-slate-900 dark:text-white mb-6 tracking-tight">
                            Akhri Waxyaalaha <span className="text-primary italic">Cusb</span> ee STEM
                        </h1>
                        <p className="text-lg text-slate-600 dark:text-zinc-400 mb-10 leading-relaxed font-sans">
                            Nagala soco halkan waxyaalaha naga cusub, sida casharda, wararka
                            iyo waxyaalaha ku saabsan STEM iyo Programming.
                        </p>

                        <div className="relative max-w-xl mx-auto group">
                            <div className="absolute inset-0 bg-primary/5 rounded-2xl blur-xl group-hover:bg-primary/10 transition-colors" />
                            <div className="relative flex items-center">
                                <Search className="absolute left-4 h-5 w-5 text-slate-400" />
                                <Input
                                    type="text"
                                    placeholder="Raadi qoraalada, mowduucyada ama qoraaga..."
                                    className="pl-12 pr-4 py-7 bg-white dark:bg-zinc-900 border-slate-200 dark:border-zinc-800 rounded-2xl shadow-sm focus:ring-2 focus:ring-primary/20 transition-all text-lg dark:text-zinc-100"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>
                </div>
                {/* Decorative elements */}
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-20">
                    <div className="absolute top-10 left-10 w-64 h-64 bg-primary/10 rounded-full blur-3xl animate-pulse" />
                    <div className="absolute bottom-10 right-10 w-96 h-96 bg-blue-100 dark:bg-blue-900/10 rounded-full blur-3xl" />
                </div>
            </section>

            {/* Filter and Content section */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-10 bg-transparent">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
                    <div className="space-y-1">
                        <h2 className="text-2xl font-bold font-serif text-slate-900 dark:text-white">Qoraaladii Ugu Dambeeyay</h2>
                        <p className="text-sm text-slate-500 dark:text-zinc-400">Waxaan helnay {filteredPosts.length} qoraal oo ku habboon.</p>
                    </div>

                    {allTags.length > 0 && (
                        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full md:w-auto">
                            <TabsList className="bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 h-11 p-1 rounded-xl shadow-sm overflow-x-auto max-w-full justify-start whitespace-nowrap">
                                <TabsTrigger value="all" className="rounded-lg px-6 data-[state=active]:bg-primary data-[state=active]:text-white dark:data-[state=active]:bg-primary dark:text-zinc-400 dark:data-[state=active]:text-white transition-all">Dhammaan</TabsTrigger>
                                {allTags.slice(0, 5).map(tag => (
                                    <TabsTrigger key={tag.slug} value={tag.slug} className="rounded-lg px-6 data-[state=active]:bg-primary data-[state=active]:text-white dark:data-[state=active]:bg-primary dark:text-zinc-400 dark:data-[state=active]:text-white transition-all">
                                        {tag.name}
                                    </TabsTrigger>
                                ))}
                            </TabsList>
                        </Tabs>
                    )}
                </div>

                {filteredPosts.length === 0 ? (
                    <div className="text-center py-24 bg-white dark:bg-zinc-900 rounded-3xl border border-dashed border-slate-200 dark:border-zinc-800 shadow-sm max-w-2xl mx-auto">
                        <div className="w-20 h-20 mx-auto mb-6 bg-slate-50 dark:bg-zinc-800 rounded-full flex items-center justify-center">
                            <Search className="h-10 w-10 text-slate-300 dark:text-zinc-600" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-800 dark:text-zinc-200 mb-2">Waxbo lama helin</h3>
                        <p className="text-slate-500 dark:text-zinc-400 mb-8 max-w-xs mx-auto">
                            {searchTerm ? `Mawduuca "${searchTerm}" wax natiijo ah kama soo bixin.` : "Wali wax qoraal ah looma soo galin blog-ga."}
                        </p>
                        {searchTerm && (
                            <Button onClick={() => setSearchTerm("")} variant="outline" className="rounded-full px-8 dark:border-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-800">
                                Nadiifi raadinta
                            </Button>
                        )}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
                        {filteredPosts.map(renderPostCard)}
                    </div>
                )}
            </section>
        </>
    );
}
