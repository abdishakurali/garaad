"use client";

import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { BlogPost } from "@/types/blog";
import { getBlogAuthorDisplayName } from "@/lib/blogAuthor";

function calculateReadingTime(content: string) {
  if (!content) return 1;
  const wordsPerMinute = 200;
  const words = content.split(/\s+/).length;
  return Math.max(1, Math.ceil(words / wordsPerMinute));
}

interface BlogCardProps {
  post: BlogPost;
  /** Smaller layout for related posts */
  compact?: boolean;
}

export function BlogCard({ post, compact = false }: BlogCardProps) {
  const href = `/blog/${post.slug}`;
  const readingTime = calculateReadingTime(post.body);
  const displayName = getBlogAuthorDisplayName(post);
  const categoryName = post.tags[0]?.name;

  return (
    <Card
      className={`group overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm transition-all duration-500 hover:-translate-y-1 hover:shadow-xl dark:border-zinc-800 dark:bg-zinc-900 ${
        compact ? "" : ""
      }`}
    >
      <div className={`relative w-full overflow-hidden ${compact ? "aspect-[16/10]" : "aspect-[16/10]"}`}>
        <Link href={href} className="absolute inset-0 z-10">
          <span className="sr-only">Akhri: {post.title}</span>
        </Link>
        <div className="absolute left-3 top-3 z-20">
          <span className="rounded-full bg-black/70 px-2 py-1 text-xs text-white">
            {readingTime} daqiiqo
          </span>
        </div>
        {categoryName && (
          <Badge className="absolute right-3 top-3 z-20 border-none bg-white/90 capitalize text-slate-900 shadow-sm backdrop-blur-sm hover:bg-white dark:bg-zinc-900/90 dark:text-zinc-100 dark:hover:bg-zinc-800">
            {categoryName}
          </Badge>
        )}
        {post.cover || post.cover_image_url ? (
          <img
            src={post.cover || post.cover_image_url!}
            alt={post.title}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-zinc-800">
            <span className="text-xs font-medium tracking-wide text-zinc-600">Garaad</span>
          </div>
        )}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
      </div>

      <CardContent className={compact ? "p-4" : "p-6"}>
        <Link href={href} className="mb-2 block group-hover:text-primary">
          <h3
            className={`font-serif font-bold leading-tight text-slate-900 decoration-primary/30 group-hover:underline dark:text-zinc-100 ${
              compact ? "line-clamp-2 text-lg" : "line-clamp-2 text-xl md:text-2xl"
            }`}
          >
            {post.title}
          </h3>
        </Link>

        {!compact && (
          <p className="mb-6 line-clamp-3 text-sm leading-relaxed text-slate-600 dark:text-zinc-400">
            {post.excerpt || post.meta_description}
          </p>
        )}

        <div
          className={`flex items-center justify-between border-t border-slate-50 pt-4 dark:border-zinc-800 ${
            compact ? "pt-3" : ""
          }`}
        >
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
              {displayName[0]?.toUpperCase() ?? "G"}
            </div>
            <span className="text-xs font-semibold text-slate-700 dark:text-zinc-300">{displayName}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
