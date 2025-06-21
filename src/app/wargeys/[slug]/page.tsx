import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Calendar, Clock } from "lucide-react";
import {
  getBlogPageBySlug,
  getBlogPages,
  estimateReadingTime,
  createSlug,
} from "@/lib/contentful";
import { RichTextRenderer } from "@/components/RichTextRenderer";
import { notFound } from "next/navigation";
import { SharePost } from "@/components/SharePost";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("so-SO", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
}

// SEO metadata
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  if (!slug) {
    return {
      title: "Post Not Found",
      description: "The requested blog post could not be found",
    };
  }

  // Try to get post by slug
  let post = await getBlogPageBySlug(slug);
  if (!post) {
    // If not found by slug, try to find by title
    const posts = await getBlogPages();
    const matchingPost = posts.find((p: Record<string, unknown>) => {
      const fields = p.fields as Record<string, unknown>;
      const title = typeof fields.title === 'string' ? fields.title : "";
      return createSlug(title) === slug;
    });
    if (matchingPost) {
      post = matchingPost;
    }
  }

  if (!post) {
    return {
      title: "Post Not Found",
      description: "The requested blog post could not be found",
    };
  }

  const { title, body, image } = post.fields;
  const rawUrl =
    image && "fields" in image && image.fields && "file" in image.fields
      ? (image.fields as { file?: { url?: string } }).file?.url
      : undefined;
  const ogUrl = rawUrl
    ? rawUrl.startsWith("//")
      ? `https:${rawUrl}`
      : rawUrl
    : undefined;

  const description = body
    ? `${RichTextRenderer.plainText(body).slice(0, 157)}...`
    : "";

  return {
    title: typeof title === "string" ? title : "",
    description,
    openGraph: {
      title: typeof title === "string" ? title : "",
      description,
      images: ogUrl
        ? [
          {
            url: ogUrl,
            width: 1200,
            height: 630,
            alt: typeof title === "string" ? title : "",
          },
        ]
        : [],
    },
  };
}

// Static params
export async function generateStaticParams() {
  const posts = await getBlogPages();
  return posts.map((post: Record<string, unknown>) => {
    const fields = post.fields as Record<string, unknown>;
    const title = typeof fields.title === 'string' ? fields.title : "Untitled Post";
    return { slug: createSlug(title) };
  });
}

interface RecommendedPostFields {
  title?: string;
  slug?: string;
}

interface RecommendedPost {
  sys: {
    id: string;
  };
  fields: RecommendedPostFields;
}

// Page component
export default async function BlogPageBySlug({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  if (!slug) notFound();

  // Try to get post by slug
  let post = await getBlogPageBySlug(slug);
  if (!post) {
    // If not found by slug, try to find by title
    const posts = await getBlogPages();
    const matchingPost = posts.find((p: Record<string, unknown>) => {
      const fields = p.fields as Record<string, unknown>;
      const title = typeof fields.title === 'string' ? fields.title : "";
      return createSlug(title) === slug;
    });
    if (matchingPost) {
      post = matchingPost;
    }
  }

  if (!post) notFound();

  const { title, body, image, recommendedPosts } = post.fields;
  const safeRecommendedPosts = recommendedPosts ?? [];
  const readingTime = estimateReadingTime(body);

  // Normalize image URL
  const rawUrl =
    image && "fields" in image && image.fields && "file" in image.fields
      ? (image.fields as { file?: { url?: string } }).file?.url
      : undefined;
  const src = rawUrl
    ? rawUrl.startsWith("//")
      ? `https:${rawUrl}`
      : rawUrl
    : "";
  const alt =
    image && image.fields && "title" in image.fields
      ? (typeof (image.fields as { title?: unknown }).title === "string"
        ? (image.fields as { title?: string }).title
        : undefined) ?? (typeof title === "string" ? title : "")
      : typeof title === "string"
        ? title
        : "";

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-6xl mx-auto">
          {/* Back navigation */}
          <Button
            asChild
            variant="ghost"
            className="group mb-8 hover:bg-slate-100 transition-all duration-200"
          >
            <Link
              href="/wargeys"
              className="inline-flex items-center text-slate-600"
            >
              <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
              <span>Ku laabo bogga hore</span>
            </Link>
          </Button>

          <article>
            {/* Featured image */}
            {src && (
              <div className="relative aspect-[21/9] w-full mb-8 rounded-2xl overflow-hidden shadow-xl">
                <Image
                  alt={alt || ""}
                  src={src || "/placeholder.svg"}
                  fill
                  priority
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 800px"
                  className="object-cover transition-transform duration-500 hover:scale-105"
                />
              </div>
            )}

            {/* Article header */}
            <header className="mb-12">
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6 text-slate-900 leading-tight relative inline-block">
                {typeof title === "string" ? title : ""}
                <div className="absolute -bottom-2 left-0 right-0 h-1 bg-primary/20 rounded-full transform -skew-x-12" />
              </h1>

              <div className="flex flex-wrap items-center gap-6 text-slate-500 mb-4">
                {post.sys.createdAt && (
                  <div className="flex items-center">
                    <Calendar className="mr-2 h-4 w-4" />
                    <span>{formatDate(new Date(post.sys.createdAt))}</span>
                  </div>
                )}
                <div className="flex items-center">
                  <Clock className="mr-2 h-4 w-4" />
                  <span>{readingTime} daq ku akhri</span>
                </div>
                <SharePost
                  title={typeof title === "string" ? title : ""}
                  slug={post.sys.id}
                />
              </div>
            </header>

            {/* Article content */}
            <div className="prose prose-lg max-w-none mb-16 p-8 sm:p-10 prose-headings:text-slate-800 prose-p:text-slate-600 prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-img:rounded-xl">
              {RichTextRenderer.render(body)}
            </div>

            {/* Recommended posts */}
            {(safeRecommendedPosts?.length ?? 0) > 0 && (
              <section className="mt-16 bg-white p-8 sm:p-10 rounded-2xl shadow-sm">
                <h2 className="text-2xl font-semibold mb-8 text-slate-800 border-b pb-4">
                  Wararka la xiriira
                </h2>
                <ul className="grid gap-4 sm:grid-cols-2">
                  {Array.isArray(safeRecommendedPosts)
                    ? safeRecommendedPosts.map((entry) => {
                      const post = entry as RecommendedPost;
                      const fields = post.fields;
                      const title = fields.title || "Untitled Post";
                      const postSlug = createSlug(title);
                      return (
                        <li key={post.sys.id} className="group">
                          <Link
                            href={`/wargeys/${postSlug}`}
                            className="block p-4 rounded-xl transition-all duration-200 hover:bg-slate-50 group-hover:shadow-sm"
                          >
                            <h3 className="text-lg font-medium text-slate-800 group-hover:text-primary transition-colors">
                              {fields.title || "Untitled"}
                            </h3>
                            <div className="mt-2 flex items-center text-sm text-slate-500">
                              <ArrowLeft className="mr-2 h-3 w-3 rotate-180 transition-transform group-hover:translate-x-1" />
                              <span>Read article</span>
                            </div>
                          </Link>
                        </li>
                      );
                    })
                    : null}
                </ul>
              </section>
            )}
          </article>
        </div>
      </main>
    </div>
  );
}