import Image from "next/image";
import { ChevronRight } from "lucide-react";
import { optimizeCloudinaryUrl } from "@/lib/cloudinary";
import { getAbsoluteImageUrl } from "@/lib/utils";
import { Button } from "../ui/button";
import { Card, CardContent, CardFooter } from "../ui/card";

interface ImageContent {
  url: string;
  url1?: string;
  url2?: string;
  url3?: string;
  url4?: string;
  alt: string;
  alt1?: string;
  alt2?: string;
  alt3?: string;
  alt4?: string;
  width?: number;
  height?: number;
  caption: string;
  caption1?: string;
  caption2?: string;
  caption3?: string;
  caption4?: string;
  text?: string;
  text1?: string;
  text2?: string;
  text3?: string;
  text4?: string;
}

interface ImageSection {
  url: string;
  alt: string;
  caption: string;
  text?: string;
}

const ImageBlock: React.FC<{
  content: ImageContent;
  onContinue: () => void;
  isLastBlock: boolean;
}> = ({ content, onContinue, isLastBlock }) => {
  if (!content?.url) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[40vh] w-full max-w-3xl mx-auto px-4">
        <div className="w-full bg-white/5 dark:bg-black/40 backdrop-blur-sm rounded-3xl border border-black/5 dark:border-white/5 overflow-hidden p-8 text-center">
          <p className="text-muted-foreground">Image not available</p>
          <div className="mt-6 flex justify-center">
            <Button onClick={onContinue} className="w-full md:w-auto min-w-[200px] h-12 rounded-xl font-bold">
              {isLastBlock ? "Dhamee" : "Sii wado"}
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Create an array of image objects with their associated text
  const imageSections: ImageSection[] = [
    { url: content.url, alt: content.alt, caption: content.caption, text: content.text },
    ...(content.url1 ? [{ url: content.url1, alt: content.alt1 || "", caption: content.caption1 || "", text: content.text1 }] : []),
    ...(content.url2 ? [{ url: content.url2, alt: content.alt2 || "", caption: content.caption2 || "", text: content.text2 }] : []),
    ...(content.url3 ? [{ url: content.url3, alt: content.alt3 || "", caption: content.caption3 || "", text: content.text3 }] : []),
    ...(content.url4 ? [{ url: content.url4, alt: content.alt4 || "", caption: content.caption4 || "", text: content.text4 }] : []),
  ];

  return (
    <div className="w-full max-w-3xl mx-auto px-4">
      <div className="w-full bg-white/5 dark:bg-black/40 backdrop-blur-sm rounded-3xl border border-black/5 dark:border-white/5 overflow-hidden transition-all duration-500 hover:bg-black/5 dark:hover:bg-black/50">
        <div className="flex flex-col p-6 md:p-10 space-y-8">
          {imageSections.map((section, index) => (
            <div key={index} className="space-y-6">
              {/* Text before image */}
              {section.text && (
                <div className="prose prose-lg dark:prose-invert max-w-none text-slate-700 dark:text-slate-300">
                  {section.text}
                </div>
              )}

              {/* Image */}
              <div className="relative aspect-video w-full rounded-2xl overflow-hidden shadow-2xl border border-white/10 bg-black/20">
                <Image
                  src={optimizeCloudinaryUrl(getAbsoluteImageUrl(section.url, "")) || "/images/placeholder-course.svg"}
                  alt={section.alt || "Course image"}
                  fill
                  className="object-contain"
                />
              </div>

              {/* Caption */}
              {section.caption && (
                <p className="text-sm text-center text-muted-foreground font-medium italic">
                  {section.caption}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="mt-8">
        <Button
          onClick={onContinue}
          className="w-full h-12 rounded-xl text-md font-bold bg-primary hover:bg-primary/90 transition-all active:scale-[0.98] shadow-lg shadow-primary/10"
        >
          {isLastBlock ? "Dhamee" : "Sii wado"}
          <ChevronRight className="ml-2 h-5 w-5" />
        </Button>
      </div>
    </div>
  );
};

export default ImageBlock;
