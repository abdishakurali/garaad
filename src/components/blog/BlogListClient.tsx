"use client";

import { useEffect, useState, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { BlogPost } from "@/types/blog";
import { Input } from "@/components/ui/input";
import { BlogCard } from "@/components/blog/BlogCard";
import Link from "next/link";
import { plainTextFromHtml } from "@/lib/blogPreview";

interface BlogListClientProps {
  initialPosts: BlogPost[];
}

export function BlogListClient({ initialPosts }: BlogListClientProps) {
  const searchParams = useSearchParams();
  const querySearch = searchParams.get("search");

  const [posts] = useState<BlogPost[]>(initialPosts);
  const [searchTerm, setSearchTerm] = useState(() => querySearch || "");
  const [activeTag, setActiveTag] = useState<string>("all");

  const filteredPosts = useMemo(() => {
    const list = Array.isArray(posts) ? posts : [];
    return list.filter((post) => {
      const tags = Array.isArray(post.tags) ? post.tags : [];
      const bodyPlain = plainTextFromHtml(post.body);
      const matchesSearch =
        (post.title ?? "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        bodyPlain.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (post.meta_description ?? "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        tags.some((tag) => (tag.name ?? "").toLowerCase().includes(searchTerm.toLowerCase()));

      if (activeTag === "all") return matchesSearch;
      return matchesSearch && tags.some((tag) => tag.slug === activeTag);
    });
  }, [posts, searchTerm, activeTag]);

  const tagList = useMemo(() => {
    const tagsMap = new Map<string, string>();
    const list = Array.isArray(posts) ? posts : [];
    list.forEach((post) => {
      const tags = Array.isArray(post.tags) ? post.tags : [];
      tags.forEach((tag) => {
        if (tag.slug) tagsMap.set(tag.slug, tag.name);
      });
    });
    return Array.from(tagsMap.entries()).map(([slug, name]) => ({ slug, name }));
  }, [posts]);

  return (
    <>
      <section className="border-b border-slate-100 bg-white pb-10 pt-16 transition-colors duration-500 dark:border-zinc-800 dark:bg-black md:pt-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Qoraaladda Garaad</h1>
            <p className="mt-2 text-gray-500 dark:text-zinc-400">
              Barashada, dhismaha, iyo nolosha. Af Soomaali.
            </p>
          </div>

          {tagList.length > 0 && (
            <div className="mb-8 flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
              <button
                type="button"
                onClick={() => setActiveTag("all")}
                className={`whitespace-nowrap rounded-full border px-3 py-1 text-xs font-medium transition-all ${
                  activeTag === "all"
                    ? "border-black bg-black text-white dark:border-white dark:bg-white dark:text-black"
                    : "border-gray-200 bg-white text-gray-600 hover:border-gray-400 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:border-zinc-500"
                }`}
              >
                Dhammaan
              </button>
              {tagList.map(({ slug, name }) => (
                <button
                  key={slug}
                  type="button"
                  onClick={() => setActiveTag(slug)}
                  className={`whitespace-nowrap rounded-full border px-3 py-1 text-xs font-medium transition-all ${
                    activeTag === slug
                      ? "border-black bg-black text-white dark:border-white dark:bg-white dark:text-black"
                      : "border-gray-200 bg-white text-gray-600 hover:border-gray-400 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:border-zinc-500"
                  }`}
                >
                  {name}
                </button>
              ))}
            </div>
          )}

          <div className="mb-10 rounded-2xl border border-violet-500/20 bg-gradient-to-r from-violet-950/40 to-zinc-900/50 px-5 py-6 text-center sm:px-8">
            <p className="text-sm font-medium leading-relaxed text-zinc-200 sm:text-base">
              Waxbarashada Garaad waa bilaash — Challenge-ka waa halka ay shaqadu ka bilowdo.
            </p>
            <Link
              href="/challenge"
              className="mt-4 inline-flex items-center justify-center rounded-xl bg-violet-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-violet-500"
            >
              Eeg Challenge-ka →
            </Link>
          </div>

          <div className="relative max-w-xl group">
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
            <Input
              type="text"
              placeholder="Raadi qoraalada, mowduucyada..."
              className="rounded-2xl border-slate-200 py-6 pl-12 pr-4 text-base shadow-sm dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl bg-transparent px-4 py-10 sm:px-6 lg:px-8">
        <p className="mb-8 text-sm text-slate-500 dark:text-zinc-400">
          Waxaan helnay {filteredPosts.length} qoraal oo ku habboon.
        </p>

        {filteredPosts.length === 0 ? (
          <div className="mx-auto max-w-2xl rounded-3xl border border-dashed border-slate-200 bg-white py-24 text-center shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-slate-50 dark:bg-zinc-800">
              <Search className="h-10 w-10 text-slate-300 dark:text-zinc-600" />
            </div>
            <h3 className="mb-2 text-xl font-bold text-slate-800 dark:text-zinc-200">Waxbo lama helin</h3>
            <p className="mx-auto mb-8 max-w-xs text-slate-500 dark:text-zinc-400">
              {searchTerm
                ? `Mawduuca "${searchTerm}" wax natiijo ah kama soo bixin.`
                : "Wali wax qoraal ah looma soo galin blog-ga."}
            </p>
            {searchTerm && (
              <Button
                onClick={() => setSearchTerm("")}
                variant="outline"
                className="rounded-full px-8 dark:border-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-800"
              >
                Nadiifi raadinta
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-10 lg:grid-cols-3">
            {filteredPosts.map((post) => (
              <BlogCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </section>
    </>
  );
}
