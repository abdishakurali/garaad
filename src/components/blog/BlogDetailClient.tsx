"use client";

import { useEffect, useState } from "react";
import { Calendar, Clock, ChevronLeft, Link2, Check } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { BlogPost } from "@/types/blog";
import { ReadingProgress } from "@/components/blog/ReadingProgress";
import { BlogCard } from "@/components/blog/BlogCard";
import { getBlogAuthorDisplayName } from "@/lib/blogAuthor";
import { BlogChallengeCTA } from "@/components/challenge/BlogChallengeCTA";
import { BlogSidebarChallengeCTA } from "@/components/challenge/BlogSidebarChallengeCTA";

interface BlogDetailClientProps {
  post: BlogPost;
  relatedPosts: BlogPost[];
}

function BlogShareBar({
  postTitle,
  shareUrl,
  vertical = false,
  className = "",
}: {
  postTitle: string;
  shareUrl: string;
  vertical?: boolean;
  className?: string;
}) {
  const [linkCopied, setLinkCopied] = useState(false);
  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(`${postTitle}\n${shareUrl}`)}`;
  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(postTitle)}&url=${encodeURIComponent(shareUrl)}`;

  const copyPostLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setLinkCopied(true);
      setTimeout(() => setLinkCopied(false), 2000);
    } catch {
      /* ignore */
    }
  };

  const btnClass =
    "inline-flex items-center justify-center gap-2 rounded-xl border-2 border-gray-200 bg-white px-4 py-2.5 text-sm font-bold text-gray-900 shadow-sm transition hover:border-gray-300 hover:bg-gray-50 dark:border-zinc-600 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:border-zinc-500 dark:hover:bg-zinc-800";

  return (
    <div
      className={`flex gap-2 ${vertical ? "flex-col" : "flex-row flex-wrap"} ${className}`}
      role="group"
      aria-label="La wadaag"
    >
      <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className={btnClass}>
        <span className="text-lg" aria-hidden>
          💬
        </span>
        WhatsApp
      </a>
      <a href={twitterUrl} target="_blank" rel="noopener noreferrer" className={btnClass}>
        Twitter / X
      </a>
      <button type="button" className={btnClass} onClick={copyPostLink}>
        {linkCopied ? <Check className="h-4 w-4 text-green-600" /> : <Link2 className="h-4 w-4" />}
        {linkCopied ? "La koobiyey" : "Koobi linkiga"}
      </button>
    </div>
  );
}

export function BlogDetailClient({ post, relatedPosts }: BlogDetailClientProps) {
  const [shareBaseUrl, setShareBaseUrl] = useState("https://garaad.org");

  useEffect(() => {
    if (typeof window !== "undefined") setShareBaseUrl(window.location.origin);
  }, []);

  const shareUrl = `${shareBaseUrl}/blog/${post.slug}`;
  const displayName = getBlogAuthorDisplayName(post);
  const primaryTag = post.tags[0];

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

  const readingMins = calculateReadingTime(post.body);

  const processedBody = post.body
    ? (() => {
        let content = post.body;
        const hasBlockTags = /<(p|div|ul|ol|table|blockquote|h1|h2|h3|h4|h5|h6)/i.test(content);
        if (!hasBlockTags) {
          content = content
            .split(/\n+/)
            .map((line) => {
              const trimmed = line.trim();
              if (!trimmed) return "";
              return `<p>${trimmed}</p>`;
            })
            .filter(Boolean)
            .join("");
        }
        let count = 0;
        return content.replace(/<(h2|h3)(.*?)>/g, (match, p1, p2) => {
          return `<${p1}${p2} id="heading-${count++}">`;
        });
      })()
    : "";

  return (
    <>
      <ReadingProgress />

      {/* Desktop: floating share */}
      <div className="fixed left-4 top-36 z-40 hidden flex-col gap-2 lg:flex">
        <BlogShareBar postTitle={post.title} shareUrl={shareUrl} vertical />
      </div>

      <main className="min-h-screen bg-white pb-24 pt-10 transition-colors duration-500 dark:bg-black">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1fr)_280px] lg:gap-12">
            <div className="min-w-0 max-w-3xl lg:max-w-none">
          <Link
            href="/blog"
            className="group mb-8 inline-flex items-center text-sm font-bold text-slate-500 transition-colors hover:text-primary dark:text-zinc-400"
          >
            <ChevronLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
            Dhammaan Qoraalada
          </Link>

          {primaryTag && (
            <Badge className="mb-4 border-none bg-primary/10 px-3 font-bold text-primary hover:bg-primary/20">
              {primaryTag.name}
            </Badge>
          )}

          <h1 className="mb-6 font-serif text-4xl font-black leading-[1.1] tracking-tight text-slate-900 dark:text-white md:text-5xl lg:text-6xl">
            {post.title}
          </h1>

          {/* Mobile: share below title */}
          <div className="mb-6 lg:hidden">
            <BlogShareBar postTitle={post.title} shareUrl={shareUrl} />
          </div>

          <div className="mb-8 flex flex-wrap items-center gap-4 border-t border-slate-100 pt-4 text-sm font-semibold text-slate-500 dark:border-zinc-800 dark:text-zinc-400">
            <div className="flex items-center">
              <div className="mr-3 flex h-10 w-10 items-center justify-center rounded-full border border-primary/20 bg-primary/10 text-sm font-bold text-primary">
                {displayName[0]?.toUpperCase() ?? "G"}
              </div>
              <span className="text-slate-800 dark:text-zinc-200">{displayName}</span>
            </div>
            <span className="hidden sm:inline text-slate-300 dark:text-zinc-600">·</span>
            <div className="flex items-center gap-1.5">
              <Calendar className="h-4 w-4 text-slate-400" />
              {formatDate(post.published_at)}
            </div>
            <span className="hidden sm:inline text-slate-300 dark:text-zinc-600">·</span>
            <div className="flex items-center gap-1.5">
              <Clock className="h-4 w-4 text-slate-400" />
              {readingMins} daqiiqo
            </div>
          </div>

          {post.cover || post.cover_image_url ? (
            <div className="relative mb-12 aspect-[21/10] w-full overflow-hidden rounded-3xl border border-slate-100 shadow-2xl shadow-primary/5 dark:border-zinc-800">
              <img
                src={post.cover || post.cover_image_url!}
                alt={post.title}
                className="h-full w-full object-cover"
                loading="lazy"
              />
            </div>
          ) : (
            <div className="relative mb-12 flex aspect-[21/10] w-full items-center justify-center overflow-hidden rounded-3xl border border-slate-100 bg-zinc-800 dark:border-zinc-800">
              <span className="text-xs font-medium tracking-wide text-zinc-600">Garaad</span>
            </div>
          )}

          <div
            id="article-content"
            className="prose prose-lg max-w-none font-sans prose-headings:font-black prose-headings:font-serif prose-headings:tracking-tight prose-headings:text-slate-900 dark:prose-headings:text-white prose-p:leading-relaxed prose-p:text-slate-700 dark:prose-p:text-zinc-300 prose-a:font-bold prose-a:text-primary hover:prose-a:underline prose-img:rounded-3xl prose-img:shadow-2xl prose-code:rounded prose-code:bg-primary/5 prose-code:px-1 prose-code:text-primary dark:prose-code:bg-primary/10 prose-blockquote:border-l-4 prose-blockquote:border-gray-200 prose-blockquote:pl-4 prose-blockquote:font-normal prose-blockquote:not-italic dark:prose-blockquote:border-zinc-600 dark:prose-blockquote:text-zinc-400"
            dangerouslySetInnerHTML={{ __html: processedBody }}
          />

          {post.tags.length > 0 && (
            <div className="mt-12 flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <span
                  key={tag.id}
                  className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-600 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300"
                >
                  {tag.name}
                </span>
              ))}
            </div>
          )}

          <div className="mt-8 border-t border-slate-100 pt-8 dark:border-zinc-800">
            <p className="mb-3 text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-zinc-500">
              La wadaag
            </p>
            <BlogShareBar postTitle={post.title} shareUrl={shareUrl} />
          </div>

          <BlogChallengeCTA
            articleHint={`${post.title} ${post.tags.map((x) => x.name).join(" ")}`}
          />

          <div className="mt-10 rounded-2xl border border-slate-200 bg-slate-50 p-6 dark:border-zinc-700 dark:bg-zinc-900/40">
            <h3 className="mb-2 text-sm font-bold uppercase tracking-wide text-slate-500 dark:text-zinc-400">
              Ka hel qoraalada cusub
            </h3>
            <p className="mb-4 text-sm text-slate-600 dark:text-zinc-300">
              Isdiiwaangeli bilaash — waxaan kuugu soo diri karnaa ogeysiisyada muhiimka ah (email).
            </p>
            <Link
              href="/welcome"
              className="inline-flex items-center justify-center rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground hover:opacity-90"
            >
              Isdiiwaangeli bilaash →
            </Link>
          </div>

          <div className="mt-10 flex flex-col gap-4 rounded-2xl border border-slate-200 p-6 dark:border-zinc-700 sm:flex-row sm:items-center">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-primary/30 bg-primary/10 text-lg font-black text-primary">
              {displayName[0]?.toUpperCase() ?? "A"}
            </div>
            <div className="min-w-0 text-left">
              <p className="font-bold text-slate-900 dark:text-white">{displayName}</p>
              <p className="mt-1 text-sm text-slate-600 dark:text-zinc-400">
                Abdishakuur wuxuu baraa Full-Stack development oo Soomaali ah — haddii aad rabto inaad hesho
                wadada buuxda, eeg Challenge-ka.
              </p>
              <Link
                href="/subscribe?plan=challenge"
                className="mt-2 inline-block text-sm font-bold text-primary hover:underline"
              >
                Bilow Challenge →
              </Link>
            </div>
          </div>

          {relatedPosts.length > 0 && (
            <div className="mt-12">
              <h3 className="mb-4 text-lg font-bold text-gray-900 dark:text-white">Qoraalada La Xiriira</h3>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {relatedPosts.slice(0, 2).map((p) => (
                  <BlogCard key={p.slug} post={p} compact />
                ))}
              </div>
            </div>
          )}
            </div>

            <aside className="hidden lg:block">
              <BlogSidebarChallengeCTA />
            </aside>
          </div>
        </div>
      </main>
    </>
  );
}
