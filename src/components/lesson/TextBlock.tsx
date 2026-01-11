import React, { useMemo, useState, useEffect } from "react";
import { TextContent } from "@/types/learning";
import { Card, CardContent } from "../ui/card";
import HoverText from "./HoverText";
import Image from "next/image";
import { Button } from "../ui/button";
import { ChevronRight } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { cn } from "@/lib/utils";

const renderMDList = (input: string[] | string | undefined) => {
  if (!input) return null;

  // Handle JSON string arrays
  if (typeof input === 'string' && input.startsWith('[')) {
    try {
      const parsedArray = JSON.parse(input);
      if (Array.isArray(parsedArray)) {
        return (
          <ul className="mb-4 !pl-0 !list-none not-prose [&>li]:before:content-['•'] [&>li]:before:text-xl [&>li]:before:mr-2 [&>li]:before:inline-block">
            {parsedArray.map((item, index) => (
              <li className="mb-2" key={index}>
                {item}
              </li>
            ))}
          </ul>
        );
      }
    } catch (e) {
      console.error('Failed to parse JSON string:', e);
    }
  }

  if (Array.isArray(input)) {
    return (
      <ul className="mb-4 !pl-0 !list-none not-prose [&>li]:before:content-['•'] [&>li]:before:text-xl [&>li]:before:mr-2 [&>li]:before:inline-block">
        {input.map((item, index) => (
          <li className="mb-2" key={index}>
            {item}
          </li>
        ))}
      </ul>
    );
  }

  // Check if content is HTML from TipTap
  if (input.includes('<') && input.includes('>')) {
    return <div dangerouslySetInnerHTML={{ __html: input }} />;
  }

  return <ReactMarkdown>{input}</ReactMarkdown>;
};

const TextBlock: React.FC<{
  content: TextContent;
  onContinue: () => void;
  isLastBlock: boolean;
}> = ({ content, onContinue, isLastBlock }) => {
  const handleContinue = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    onContinue();
  };

  const additionalTexts = useMemo(() => {
    return Array.from(
      { length: 6 },
      (_, i) => content[`text${i + 1}` as keyof TextContent]
    );
  }, [content]);

  const [imgLoading, setImgLoading] = useState(false);
  const [imgSrc, setImgSrc] = useState(content.url);

  useEffect(() => {
    if (content.url) {
      setImgLoading(true);
      setImgSrc(content.url);
    }
  }, [content.url]);

  return (
    <div className="w-full max-w-2xl mx-auto px-4">
      <div className="w-full bg-white/5 dark:bg-black/40 backdrop-blur-sm rounded-3xl border border-black/5 dark:border-white/5 overflow-hidden transition-all duration-500 hover:bg-black/5 dark:hover:bg-black/50">
        <div className="flex flex-col items-center text-left justify-center p-8 md:p-10 space-y-6 md:space-y-8">
          {content.title && (
            <div className="prose prose-lg dark:prose-invert max-w-none text-xl md:text-2xl font-bold text-center text-foreground leading-tight">
              {content.title.includes('<') ? (
                <div dangerouslySetInnerHTML={{ __html: content.title }} />
              ) : (
                <ReactMarkdown>{content.title}</ReactMarkdown>
              )}
            </div>
          )}

          {content.type === "2_hovers" && content.text && (
            <HoverText
              type={content.type}
              text={content.text}
              hoverTexts={{
                "hover-1": content["hover-1"] || "",
                "hover-2": content["hover-2"] || "",
              }}
              format={content.format as "markdown" | "plain"}
            />
          )}

          {content.type !== "2_hovers" && content.text && (
            <div className="prose prose-base dark:prose-invert mt-1 text-slate-700 dark:text-slate-300 text-left text-lg leading-relaxed font-medium">
              {renderMDList(content.text)}
            </div>
          )}

          {content.url && (
            <div className="flex justify-center w-full">
              <div className="relative w-full max-w-[550px] aspect-[16/9] my-4 rounded-2xl overflow-hidden border border-white/5 bg-black/20">
                {imgLoading && (
                  <div className="absolute inset-0 w-full h-full bg-white/5 animate-pulse z-10" />
                )}
                <Image
                  key={imgSrc}
                  src={imgSrc || ""}
                  alt={content.alt || "lesson image"}
                  fill
                  style={{
                    objectFit: "contain",
                    opacity: imgLoading ? 0 : 1,
                    transition: "opacity 0.5s ease-in-out"
                  }}
                  onLoad={() => setImgLoading(false)}
                  onError={() => setImgLoading(false)}
                  priority
                />
              </div>
            </div>
          )}

          {additionalTexts.map((text, index) => {
            if (
              (typeof text === "string" && text.trim() !== "") ||
              (Array.isArray(text) && text.some((item) => typeof item === "string" && (item as string).trim() !== ""))
            ) {
              return (
                <div
                  key={index}
                  className="prose prose-base dark:prose-invert mt-1 text-slate-600 dark:text-slate-400 text-left text-lg leading-relaxed"
                >
                  {renderMDList(text as string | string[])}
                </div>
              );
            }
            return null;
          })}

          {content.type === "table" && (content.features?.length ?? 0) > 0 && (
            <div className="w-full overflow-hidden rounded-2xl border border-white/5 mb-6">
              <table className="min-w-full border-collapse">
                <tbody>
                  {content.features?.map((feature, idx) => (
                    <tr
                      key={idx}
                      className={cn(
                        "border-b border-black/5 dark:border-white/5 last:border-0 transition-colors",
                        idx % 2 === 0 ? "bg-black/5 dark:bg-white/5" : "bg-transparent",
                        "hover:bg-primary/5"
                      )}
                    >
                      <td className="px-6 py-5 text-sm font-bold text-slate-800 dark:text-slate-200 w-1/3">
                        {feature.title}
                      </td>
                      <td className="px-6 py-5 text-sm text-slate-600 dark:text-slate-400">
                        {feature.text && feature.text.includes('<') ? (
                          <div dangerouslySetInnerHTML={{ __html: feature.text }} />
                        ) : (
                          feature.text
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {content.type === "table-grid" &&
            content.table?.rows?.length &&
            content.table.rows.length > 0 && (
              <div className="w-full overflow-hidden rounded-2xl border border-white/5 mb-6">
                <table className="min-w-full border-separate border-spacing-0">
                  {content.table.header && (
                    <thead className="bg-black/5 dark:bg-white/5">
                      <tr>
                        {content.table.header.map((headerCell, index) => (
                          <th
                            key={index}
                            className="px-6 py-4 text-left font-bold text-xs uppercase tracking-wider text-primary border-b border-black/5 dark:border-white/5"
                          >
                            {headerCell}
                          </th>
                        ))}
                      </tr>
                    </thead>
                  )}
                  <tbody>
                    {content.table.rows.map((row, rowIndex) => (
                      <tr
                        key={rowIndex}
                        className={cn(
                          "transition-colors",
                          rowIndex % 2 === 0 ? "bg-transparent" : "bg-black/5 dark:bg-white/5",
                          "hover:bg-primary/5"
                        )}
                      >
                        {row.map((cell, cellIndex) => (
                          <td
                            key={cellIndex}
                            className="px-6 py-4 text-sm text-slate-700 dark:text-slate-300 border-b border-black/5 dark:border-white/5 last:border-b-0"
                          >
                            {cell || ""}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
        </div>
      </div>

      <div className="mt-8">
        <Button
          onClick={handleContinue}
          className="w-full h-12 rounded-xl text-md font-bold bg-primary hover:bg-primary/90 transition-all active:scale-[0.98] shadow-lg shadow-primary/10"
        >
          {isLastBlock ? "Dhamee" : "Sii wado"}
          <ChevronRight className="ml-2 h-5 w-5" />
        </Button>
      </div>
    </div>
  );
};

export default React.memo(TextBlock);
