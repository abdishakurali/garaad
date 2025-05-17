import Link from "next/link";
import Image from "next/image";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Clock,
  User,
  Calendar,
  BookOpen,
  ArrowRight,
  Search,
} from "lucide-react";
import { SharePost } from "@/components/SharePost";
import { getBlogPages } from "@/lib/contentful";
import { Header } from "@/components/Header";
import { Input } from "@/components/ui/input";

export const revalidate = 60;
export const dynamic = "force-static";

export async function generateMetadata() {
  return {
    title: "Wargeyska Garaad",
    description:
      "Nagala soco halkan waxyaalaha naga cusub, sida casharda , wararka iyo waxyaalaha ku saabsan.",
    openGraph: {
      type: "website",
      locale: "en_US",
      url: "https://garaad.org/blog",
      siteName: "Wargeyska Garaad",
      images: [
        {
          url: "/og-blog.jpg",
          width: 1200,
          height: 630,
        },
      ],
    },
  };
}

interface ImageFields {
  file?: {
    url?: string;
  };
  title?: string;
}

interface PostFields {
  title?: string;
  body?: unknown;
  excerpt?: string;
  image?: {
    fields?: ImageFields;
  };
  publishDate?: string;
  author?: string;
  category?: string;
  slug?: string;
}

export default async function BlogListPage() {
  const posts = await getBlogPages();

  // Function to format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Function to render a post card
  const renderPostCard = (post: any) => {
    const fields = post.fields as PostFields;

    const readingTime = fields.body
      ? Math.max(
          1,
          Math.ceil(JSON.stringify(fields.body).split(/\s+/).length / 200)
        )
      : 1;

    const slug = post.sys.id;
    const href = `/blog/${slug ?? ""}`;

    const imageFields = (fields.image?.fields ?? {}) as ImageFields;
    const rawUrl = imageFields.file?.url ?? "";
    const src = rawUrl
      ? rawUrl.startsWith("//")
        ? `https:${rawUrl}`
        : rawUrl
      : "";
    const alt =
      typeof imageFields.title === "string"
        ? imageFields.title
        : fields.title ?? "";

    return (
      <Card className="group overflow-hidden border-none bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300">
        <div className="relative aspect-video w-full overflow-hidden">
          <Link href={href} className="absolute inset-0 z-10">
            <span className="sr-only">Read article: {fields.title}</span>
          </Link>
          {src ? (
            <Image
              src={src || "/placeholder.svg"}
              alt={alt}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="bg-slate-100 w-full h-full flex items-center justify-center">
              <span className="text-slate-400">No image</span>
            </div>
          )}
          {fields.category && (
            <Badge className="absolute top-3 left-3 z-20 bg-primary hover:bg-primary/90 text-white">
              {fields.category}
            </Badge>
          )}
        </div>

        <CardContent className="p-5">
          <div className="flex flex-wrap gap-3 mb-3 text-xs text-slate-500">
            <div className="flex items-center">
              <Calendar className="mr-1 h-3 w-3" />
              <time dateTime={fields.publishDate || post.sys.createdAt}>
                {formatDate(fields.publishDate || post.sys.createdAt)}
              </time>
            </div>
            <div className="flex items-center">
              <Clock className="mr-1 h-3 w-3" />
              <span>{readingTime} min read</span>
            </div>
            {fields.author && (
              <div className="flex items-center">
                <User className="mr-1 h-3 w-3" />
                <span>{fields.author}</span>
              </div>
            )}
          </div>

          <Link
            href={href}
            className="block group-hover:text-primary transition-colors"
          >
            <h3 className="font-semibold text-xl mb-3 line-clamp-2 group-hover:underline decoration-1 underline-offset-2">
              {fields.title || "Untitled Post"}
            </h3>
          </Link>

          <p className="line-clamp-3 text-sm text-slate-600 mb-4">
            {fields.excerpt || ""}
          </p>
        </CardContent>

        <CardFooter className="px-5 py-4 bg-slate-50 flex justify-between items-center">
          <Link
            href={href}
            className="inline-flex items-center text-sm font-medium text-primary hover:underline"
          >
            <BookOpen className="mr-1.5 h-4 w-4" />
            Faahfaahin
            <ArrowRight className="ml-1.5 h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
          </Link>
          <SharePost title={fields.title!} slug={slug ?? ""} />
        </CardFooter>
      </Card>
    );
  };

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
        {/* Hero Section */}
        <section className="relative py-16 md:py-24 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent" />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-700 relative inline-block">
                Wargeyska Garaad
                <div className="absolute -bottom-2 left-0 right-0 h-1 bg-primary/20 rounded-full transform -skew-x-12" />
              </h1>
              <p className="text-lg text-slate-600 max-w-2xl mx-auto mb-8">
                Nagala soco halkan waxyaalaha naga cusub, sida casharda, wararka
                iyo waxyaalaha ku saabsan.
              </p>

              {/* Search Bar */}
              <div className="relative max-w-md mx-auto">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                  <Input
                    type="search"
                    placeholder="raadi wararka..."
                    className="pl-10 pr-4 py-6 rounded-full border-slate-200 focus:border-primary focus:ring-primary shadow-sm"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Decorative elements */}
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
          <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        </section>

        {/* Blog Posts Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
            <h2 className="text-2xl font-bold text-slate-900">
              wararkii ugu danbeeyay
            </h2>

            {/* Category Filter Pills */}
            <div className="flex flex-wrap gap-2">
              <Button
                variant="default"
                size="sm"
                className="rounded-full bg-primary text-white hover:bg-primary/90"
              >
                Kulli
              </Button>
              <Button variant="outline" size="sm" className="rounded-full">
                wararka
              </Button>
              <Button variant="outline" size="sm" className="rounded-full">
                naga cusub
              </Button>
            </div>
          </div>

          {posts.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl shadow-sm">
              <div className="w-16 h-16 mx-auto mb-4 bg-slate-100 rounded-full flex items-center justify-center">
                <BookOpen className="h-8 w-8 text-slate-400" />
              </div>
              <h2 className="text-xl font-medium mb-2 text-slate-800">
                Wax boosti ah kuma jiro
              </h2>
              <p className="text-slate-500 max-w-md mx-auto">
                Nagu soo noqo saad u gaatid waxyaalaha naga cusub.
              </p>
              <Button className="mt-6" variant="outline">
                Ku celi
              </Button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                {posts.map((post) => (
                  <div key={post.sys.id}>{renderPostCard(post)}</div>
                ))}
              </div>

              {/* <div className="flex justify-center mt-12">
                <Button
                  variant="outline"
                  size="lg"
                  className="rounded-full px-8 border-slate-200 hover:bg-slate-50 hover:text-primary transition-colors"
                >
                  Load More Articles
                </Button>
              </div> */}
            </>
          )}
        </section>

        {/* Newsletter Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-2xl p-8 md:p-12">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-2xl md:text-3xl font-bold mb-4 text-slate-900">
                Noqo Mid nala socda
              </h2>
              <p className="text-slate-600 mb-6">
                Hel wararkii ugu danbeeyaya waxaana lagu soo dirayaa email-kaaga
                si asbuucle ah
              </p>
              <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                <Input
                  type="email"
                  placeholder="Geli email-kaaga"
                  className="flex-grow rounded-full shadow-sm"
                />
                <Button className="bg-primary hover:bg-primary/90 text-white rounded-full px-6 shadow-sm">
                  Ku Biir
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
