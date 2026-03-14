import Image from "next/image";
import { ChevronRight } from "lucide-react";
import { optimizeCloudinaryUrl } from "@/lib/cloudinary";
import { getAbsoluteImageUrl } from "@/lib/utils";
import { Button } from "../ui/button";

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
      <div className="w-full max-w-2xl mx-auto px-4 sm:px-6 lg:px-0">
        <div className="rounded-2xl bg-zinc-900 border border-zinc-800 p-8 text-center">
          <p className="text-zinc-500 text-sm">Sawir lama helin</p>
          <Button
            onClick={onContinue}
            className="mt-4 h-11 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-semibold text-sm min-h-[44px]"
          >
            {isLastBlock ? "Dhamee" : "Sii wado"}
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    );
  }

  const imageSections: ImageSection[] = [
    { url: content.url, alt: content.alt, caption: content.caption, text: content.text },
    ...(content.url1 ? [{ url: content.url1, alt: content.alt1 || "", caption: content.caption1 || "", text: content.text1 }] : []),
    ...(content.url2 ? [{ url: content.url2, alt: content.alt2 || "", caption: content.caption2 || "", text: content.text2 }] : []),
    ...(content.url3 ? [{ url: content.url3, alt: content.alt3 || "", caption: content.caption3 || "", text: content.text3 }] : []),
    ...(content.url4 ? [{ url: content.url4, alt: content.alt4 || "", caption: content.caption4 || "", text: content.text4 }] : []),
  ];

  return (
    <div className="w-full max-w-2xl mx-auto px-4 sm:px-6 lg:px-0">
      <div className="space-y-6">
        {imageSections.map((section, index) => (
          <div key={index}>
            {section.text && (
              <p className="text-sm sm:text-base text-zinc-300 leading-relaxed mb-3">{section.text}</p>
            )}
            <div className="rounded-none sm:rounded-2xl overflow-hidden border-0 sm:border border-zinc-800">
              <div className="relative aspect-video w-full bg-zinc-900">
                <Image
                  src={optimizeCloudinaryUrl(getAbsoluteImageUrl(section.url, "")) || "/images/placeholder-course.svg"}
                  alt={section.alt || "Sawir"}
                  fill
                  className="object-cover"
                />
              </div>
            </div>
            {section.caption && (
              <p className="px-4 py-2.5 text-xs text-zinc-500 text-center sm:px-0">{section.caption}</p>
            )}
          </div>
        ))}
      </div>

      <Button
        onClick={onContinue}
        className="mt-5 w-full h-11 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-semibold text-sm transition-colors duration-150 min-h-[44px]"
      >
        {isLastBlock ? "Dhamee" : "Sii wado"}
        <ChevronRight className="ml-2 h-4 w-4" />
      </Button>
    </div>
  );
};

export default ImageBlock;
