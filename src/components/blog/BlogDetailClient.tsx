"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
    Calendar,
    Clock,
    ChevronLeft,
    Share2,
    List,
    ArrowRight,
    Facebook,
    Twitter as TwitterIcon,
    Linkedin,
    Search
} from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BlogPost } from "@/types/blog";

interface BlogDetailClientProps {
    post: BlogPost;
    relatedPosts: BlogPost[];
}

export function BlogDetailClient({ post, relatedPosts }: BlogDetailClientProps) {
    const router = useRouter();
    const [scrollProgress, setScrollProgress] = useState(0);
    const [toc, setToc] = useState<{ id: string; text: string; level: number }[]>([]);
    const contentRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Generate TOC
        if (post.body) {
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = post.body;
            const headings = Array.from(tempDiv.querySelectorAll('h2, h3'));
            const tocItems = headings.map((h, i) => {
                const id = `heading-${i}`;
                return { id, text: h.textContent || "", level: parseInt(h.tagName[1]) };
            });
            setToc(tocItems);
        }

        const handleScroll = () => {
            const totalScroll = document.documentElement.scrollTop;
            const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scroll = windowHeight > 0 ? totalScroll / windowHeight : 0;
            setScrollProgress(scroll * 100);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, [post.body]);

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("so-SO", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    const calculateReadingTime = (content: string) => {
        if (!content) return 1;
        const wordsPerMinute = 200;
        const words = content.split(/\s+/).length;
        return Math.max(1, Math.ceil(words / wordsPerMinute));
    };

    const coverImage = post.cover_image_url || post.cover_image;

    // Inject IDs into body for TOC and handle plain text newlines
    const processedBody = post.body ? (() => {
        let content = post.body;

        // Check if the content has any block-level HTML tags
        const hasBlockTags = /<(p|div|ul|ol|table|blockquote|h1|h2|h3|h4|h5|h6)/i.test(content);

        if (!hasBlockTags) {
            // Treat every non-empty line as a separate paragraph
            // This handles single-newline content written in the admin
            content = content
                .split(/\n+/) // Split on any number of newlines
                .map(line => {
                    const trimmed = line.trim();
                    if (!trimmed) return '';
                    return `<p>${trimmed}</p>`;
                })
                .filter(Boolean)
                .join('');
        }

        let count = 0;
        return content.replace(/<(h2|h3)(.*?)>/g, (match, p1, p2) => {
            return `<${p1}${p2} id="heading-${count++}">`;
        });
    })() : "";

    return (
        <>
            {/* Reading Progress Bar */}
            <div className="fixed top-0 left-0 w-full z-[100] h-1 bg-slate-100 dark:bg-zinc-800">
                <div
                    className="h-full bg-primary transition-all duration-150 ease-out"
                    style={{ width: `${scrollProgress}%` }}
                />
            </div>

            <main className="bg-white dark:bg-black min-h-screen pb-24 pt-10 transition-colors duration-500">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
                    <Link
                        href="/blog"
                        className="inline-flex items-center text-sm font-bold text-slate-500 dark:text-zinc-400 hover:text-primary mb-10 transition-colors group"
                    >
                        <ChevronLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
                        Dhammaan Qoraalada
                    </Link>

                    <div className="space-y-6">
                        <div className="flex flex-wrap gap-2">
                            {post.tags.map(tag => (
                                <Badge key={tag.id} className="bg-primary/10 text-primary border-none px-3 font-bold hover:bg-primary/20">
                                    {tag.name}
                                </Badge>
                            ))}
                        </div>
                        <h1 className="text-4xl md:text-6xl font-black font-serif text-slate-900 dark:text-white leading-[1.1] tracking-tight">
                            {post.title}
                        </h1>

                        {post.excerpt && (
                            <p className="text-xl md:text-2xl font-medium font-serif text-slate-600 dark:text-zinc-300 leading-relaxed border-l-4 border-primary/20 pl-6 py-2 italic bg-slate-50/50 dark:bg-zinc-900/50 rounded-r-xl">
                                {post.excerpt}
                            </p>
                        )}
                        <div className="flex flex-wrap items-center gap-6 text-slate-500 dark:text-zinc-400 font-semibold pt-4 border-t border-slate-100 dark:border-zinc-800">
                            <div className="flex items-center">
                                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold mr-3 border border-primary/20">
                                    {post.author_name?.[0]?.toUpperCase()}
                                </div>
                                <span className="dark:text-zinc-300">{post.author_name}</span>
                            </div>
                            <div className="flex items-center">
                                <Calendar className="mr-2 h-4 w-4 text-slate-400 dark:text-zinc-500" />
                                {formatDate(post.published_at)}
                            </div>
                            <div className="flex items-center">
                                <Clock className="mr-2 h-4 w-4 text-slate-400 dark:text-zinc-500" />
                                {calculateReadingTime(post.body)} daqiiqo
                            </div>
                        </div>
                    </div>

                    {coverImage && (
                        <div className="mt-12 relative aspect-[21/10] w-full rounded-3xl overflow-hidden shadow-2xl shadow-primary/5 border border-slate-100 dark:border-zinc-800">
                            <Image
                                src={coverImage}
                                alt={post.title}
                                fill
                                priority
                                className="object-cover"
                            />
                        </div>
                    )}
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mt-16">
                        {/* Sidebar Left: TOC & Share */}
                        <aside className="lg:col-span-3 hidden lg:block sticky top-24 h-fit space-y-10">
                            {/* Quick Search */}
                            <div className="space-y-4">
                                <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-zinc-500 flex items-center">
                                    <Search className="mr-2 h-4 w-4" /> Raadi Blogga
                                </h3>
                                <div className="relative">
                                    <input
                                        type="text"
                                        placeholder="Raadi qoraal kale..."
                                        className="w-full bg-slate-50 dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all dark:text-zinc-100"
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') {
                                                router.push(`/blog?search=${(e.target as HTMLInputElement).value}`);
                                            }
                                        }}
                                    />
                                </div>
                            </div>

                            {toc.length > 0 && (
                                <div className="space-y-4">
                                    <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-zinc-500 flex items-center">
                                        <List className="mr-2 h-4 w-4" /> Dulucda Qoraalka
                                    </h3>
                                    <nav className="space-y-2 border-l-2 border-slate-100 dark:border-zinc-800 pl-4">
                                        {toc.map((item) => (
                                            <a
                                                key={item.id}
                                                href={`#${item.id}`}
                                                className={`block text-sm transition-all hover:text-primary ${item.level === 3 ? "pl-4 text-slate-500 dark:text-zinc-400" : "font-medium text-slate-700 dark:text-zinc-300"
                                                    }`}
                                            >
                                                {item.text}
                                            </a>
                                        ))}
                                    </nav>
                                </div>
                            )}

                            <div className="space-y-4 pt-10 border-t border-slate-100 dark:border-zinc-800">
                                <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-zinc-500 flex items-center">
                                    <Share2 className="mr-2 h-4 w-4" /> La wadaag
                                </h3>
                                <div className="flex flex-col gap-2">
                                    <Button variant="outline" size="sm" className="justify-start hover:bg-[#1877F2] hover:text-white transition-colors dark:border-zinc-800 dark:text-zinc-300">
                                        <Facebook className="mr-2 h-4 w-4" /> Facebook
                                    </Button>
                                    <Button variant="outline" size="sm" className="justify-start hover:bg-[#1DA1F2] hover:text-white transition-colors dark:border-zinc-800 dark:text-zinc-300">
                                        <TwitterIcon className="mr-2 h-4 w-4" /> Twitter
                                    </Button>
                                    <Button variant="outline" size="sm" className="justify-start hover:bg-[#0A66C2] hover:text-white transition-colors dark:border-zinc-800 dark:text-zinc-300">
                                        <Linkedin className="mr-2 h-4 w-4" /> LinkedIn
                                    </Button>
                                </div>
                            </div>
                        </aside>

                        {/* Main Content */}
                        <article className="lg:col-span-6 space-y-12">
                            <div
                                ref={contentRef}
                                className="prose prose-lg md:prose-xl prose-slate dark:prose-invert max-w-none 
                                    prose-headings:font-black prose-headings:font-serif prose-headings:tracking-tight prose-headings:text-slate-900 dark:prose-headings:text-white
                                    prose-p:text-slate-700 dark:prose-p:text-zinc-300 prose-p:leading-relaxed font-sans
                                    prose-a:text-primary prose-a:font-bold hover:prose-a:underline
                                    prose-img:rounded-3xl prose-img:shadow-2xl
                                    prose-code:text-primary prose-code:bg-primary/5 dark:prose-code:bg-primary/10 prose-code:px-1 prose-code:rounded
                                    prose-blockquote:border-primary prose-blockquote:bg-slate-50 dark:prose-blockquote:bg-zinc-900 prose-blockquote:py-1 prose-blockquote:px-6 prose-blockquote:rounded-r-2xl prose-blockquote:font-serif prose-blockquote:italic dark:prose-blockquote:text-zinc-400"
                                dangerouslySetInnerHTML={{ __html: processedBody }}
                            />

                            {/* Author Bio Section */}
                            <div className="bg-slate-50 dark:bg-zinc-900/50 rounded-3xl p-8 md:p-12 flex flex-col md:flex-row gap-8 items-center border border-slate-100 dark:border-zinc-800">
                                <div className="w-24 h-24 rounded-full bg-primary/20 flex items-center justify-center text-4xl text-primary font-black shrink-0 border-4 border-white dark:border-zinc-800 shadow-lg">
                                    {post.author_name?.[0]?.toUpperCase()}
                                </div>
                                <div className="text-center md:text-left space-y-4">
                                    <div className="space-y-1">
                                        <span className="text-xs font-bold text-primary uppercase tracking-widest">Qoraaga</span>
                                        <h4 className="text-2xl font-bold font-serif text-slate-900 dark:text-white">{post.author_name}</h4>
                                    </div>
                                    <p className="text-slate-600 dark:text-zinc-400 leading-relaxed font-sans">
                                        Waa maamulaha iyo qoraaga ka tirsan kooxda Garaad STEM. Waxa uu halkan kula wadaagaa aqoontiisa iyo khibradiisa ku aaddan technology-da.
                                    </p>
                                    <div className="flex flex-wrap justify-center md:justify-start gap-4">
                                        <Button variant="ghost" size="sm" className="rounded-full text-xs font-bold hover:text-primary dark:text-zinc-300 dark:hover:text-primary">
                                            Dhammaan qoraaladiisa <ArrowRight className="ml-2 h-3.5 w-3.5" />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </article>

                        {/* Sidebar Right: Related Posts */}
                        <aside className="lg:col-span-3 space-y-8">
                            <div className="bg-slate-900 dark:bg-zinc-900/80 rounded-3xl p-6 text-white overflow-hidden relative shadow-2xl border border-white/5">
                                <div className="relative z-10 space-y-4">
                                    <h3 className="font-bold font-serif text-xl leading-tight">Ku biir liiska aqristayaasha</h3>
                                    <p className="text-slate-400 text-sm font-sans">Hel ogeysiisyada qoraalada cusub isla marka la daabaco.</p>
                                    <div className="space-y-3">
                                        <input
                                            type="email"
                                            placeholder="Email-kaaga..."
                                            className="w-full bg-white/10 dark:bg-zinc-800/50 border-white/20 dark:border-zinc-700/50 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                                        />
                                        <Button className="w-full bg-primary hover:bg-primary/90 rounded-xl font-bold py-6 text-white">Ku Biir</Button>
                                    </div>
                                </div>
                                <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-primary/20 rounded-full blur-3xl" />
                            </div>

                            {relatedPosts.length > 0 && (
                                <div className="space-y-6">
                                    <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-zinc-500">Qoraaladaan xiiseey</h3>
                                    <div className="space-y-6">
                                        {relatedPosts.map(p => (
                                            <Link key={p.id} href={`/blog/${p.slug}`} className="group block space-y-3">
                                                <div className="relative aspect-video rounded-2xl overflow-hidden shadow-sm border border-slate-100 dark:border-zinc-800">
                                                    <Image
                                                        src={p.cover_image_url || p.cover_image || "/images/placeholder.jpg"}
                                                        alt={p.title}
                                                        fill
                                                        className="object-cover transition-transform group-hover:scale-105 duration-500"
                                                    />
                                                </div>
                                                <h4 className="font-bold font-serif text-slate-800 dark:text-zinc-200 leading-snug group-hover:text-primary transition-colors line-clamp-2">
                                                    {p.title}
                                                </h4>
                                                <div className="flex items-center text-[10px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-tighter">
                                                    <Calendar className="mr-1 h-3 w-3" /> {new Date(p.published_at).toLocaleDateString()}
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </aside>
                    </div>
                </div>
            </main>
        </>
    );
}
