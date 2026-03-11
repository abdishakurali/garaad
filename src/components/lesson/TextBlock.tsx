import React, { useMemo, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TextContent } from "@/types/learning";
import { Card, CardContent } from "../ui/card";
import HoverText from "./HoverText";
import Image from "next/image";
import { Button } from "../ui/button";
import { ChevronRight } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { cn } from "@/lib/utils";
import remarkGfm from "remark-gfm";

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

  return <ReactMarkdown remarkPlugins={[remarkGfm]}>{input}</ReactMarkdown>;
};

const TextBlock: React.FC<{
  content: TextContent;
  onContinue: () => void;
  isLastBlock: boolean;
}> = ({ content, onContinue, isLastBlock }) => {
  const handleContinue = () => {
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

  const [selectedCell, setSelectedCell] = useState<{ r: number; c: number } | null>(null);

  const displayImg = content.img_url || content.url;
  const isImgTop = content.img_position === 'top';

  const RenderImage = () => {
    if (!displayImg) return null;
    return (
      <div className="w-full my-4">
        <div className="relative w-full aspect-video rounded-xl overflow-hidden border border-white/[0.09] bg-black/20">
          {imgLoading && (
            <div className="absolute inset-0 w-full h-full bg-white/5 animate-pulse z-10" />
          )}
          <Image
            key={displayImg}
            src={displayImg || ""}
            alt={content.alt || "lesson image"}
            fill
            className="object-cover"
            style={{
              opacity: imgLoading ? 0 : 1,
              transition: "opacity 0.5s ease-in-out"
            }}
            onLoad={() => setImgLoading(false)}
            onError={() => setImgLoading(false)}
            priority
          />
        </div>
        {((content as { caption?: string }).caption || content.alt) && (
          <p className="text-sm text-slate-400 text-center mt-2">
            {(content as { caption?: string }).caption || content.alt}
          </p>
        )}
      </div>
    );
  };

  return (
    <div className="w-full mx-3 sm:mx-4 lg:mx-0">
      <div className="w-full bg-white/[0.06] dark:bg-black/40 backdrop-blur-sm rounded-2xl sm:rounded-2xl lg:rounded-3xl border border-white/[0.08] dark:border-white/[0.09] overflow-hidden transition-all duration-500 hover:bg-white/[0.09] dark:hover:bg-black/50">
        <div className="flex flex-col items-center text-left justify-center p-5 sm:p-6 lg:p-8 xl:p-10 space-y-4 lg:space-y-5 max-w-prose">
          {content.title && (
            <div className="prose prose-lg dark:prose-invert max-w-none text-xl sm:text-2xl font-bold text-center text-white leading-snug">
              {content.title.includes('<') ? (
                <div dangerouslySetInnerHTML={{ __html: content.title }} />
              ) : (
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{content.title}</ReactMarkdown>
              )}
            </div>
          )}

          {isImgTop && <RenderImage />}

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
            <div className="prose prose-base dark:prose-invert mt-1 text-slate-200 text-left text-base leading-relaxed">
              {renderMDList(content.text)}
            </div>
          )}

          {!isImgTop && <RenderImage />}

          {content.type === "list" && content.list_items && Array.isArray(content.list_items) && content.list_items.length > 0 && (
            <ul className="mb-4 !pl-0 !list-none not-prose space-y-3 lg:space-y-4">
              {content.list_items.map((item, index) => (
                <li key={index} className="flex items-start gap-3 text-slate-200 text-base leading-relaxed">
                  <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-primary/10 text-primary font-bold text-sm shrink-0 mt-0.5">
                    {index + 1}
                  </span>
                  <span className="flex-1 pl-0">{item}</span>
                </li>
              ))}
            </ul>
          )}

          {additionalTexts.map((text, index) => {
            if (
              (typeof text === "string" && text.trim() !== "") ||
              (Array.isArray(text) && text.some((item) => typeof item === "string" && (item as string).trim() !== ""))
            ) {
              return (
                <div
                  key={index}
                  className="prose prose-base dark:prose-invert mt-1 text-slate-300 text-left text-base lg:text-[17px] leading-relaxed"
                >
                  {renderMDList(text as string | string[])}
                </div>
              );
            }
            return null;
          })}

          {content.type === "table" && (content.features?.length ?? 0) > 0 && (
            <div className="w-full overflow-hidden rounded-2xl border border-white/[0.09] mb-6">
              <div className="sm:hidden flex flex-col gap-3">
                {content.features?.map((feature, idx) => (
                  <div key={idx} className="p-3 rounded-xl border border-white/[0.09] bg-white/[0.03] space-y-1">
                    <div className="text-sm font-bold text-white">{feature.title}</div>
                    <div className="text-sm text-slate-300">
                      {feature.text && feature.text.includes('<') ? (
                        <div dangerouslySetInnerHTML={{ __html: feature.text }} />
                      ) : (
                        feature.text
                      )}
                    </div>
                  </div>
                ))}
              </div>
              <table className="min-w-full border-collapse hidden sm:table">
                <tbody>
                  {content.features?.map((feature, idx) => (
                    <tr
                      key={idx}
                      className={cn(
                        "border-b border-white/[0.09] last:border-0 transition-colors",
                        idx % 2 === 0 ? "bg-white/[0.03]" : "bg-transparent",
                        "hover:bg-primary/5"
                      )}
                    >
                      <td className="px-4 py-3 lg:px-6 lg:py-4 text-sm lg:text-base font-bold text-white w-1/3">
                        {feature.title}
                      </td>
                      <td className="px-4 py-3 lg:px-6 lg:py-4 text-sm lg:text-base text-slate-300">
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
              <div className="w-full overflow-hidden rounded-2xl border border-white/[0.09] mb-6 bg-white/[0.03] shadow-inner">
                <table className="min-w-full border-separate border-spacing-0">
                  {content.table.header && (
                    <thead className="bg-white/10">
                      <tr>
                        {content.table.header.map((headerCell, index) => (
                          <th
                            key={index}
                            className="px-3 py-2 lg:px-6 lg:py-4 text-left font-black text-[10px] uppercase tracking-[0.2em] text-primary/70 border-b border-white/[0.09]"
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
                          "transition-colors group",
                          rowIndex % 2 === 0 ? "bg-transparent" : "bg-white/[0.03]"
                        )}
                      >
                        {row.map((cell, cellIndex) => {
                          const isSelected = selectedCell?.r === rowIndex && selectedCell?.c === cellIndex;
                          return (
                            <td
                              key={cellIndex}
                              onClick={() => setSelectedCell(isSelected ? null : { r: rowIndex, c: cellIndex })}
                              className={cn(
                                "px-3 py-2 lg:px-6 lg:py-4 text-sm lg:text-base transition-all duration-300 cursor-pointer relative",
                                "border-b border-white/[0.09] last:border-b-0",
                                isSelected
                                  ? "bg-primary/20 text-primary font-bold shadow-[inset_0_0_20px_rgba(168,85,247,0.1)]"
                                  : "text-slate-300 hover:bg-primary/5"
                              )}
                            >
                              {cell || ""}
                              {isSelected && (
                                <div className="absolute top-1 right-1">
                                  <div className="w-1 h-1 bg-primary rounded-full animate-ping" />
                                </div>
                              )}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
        </div>
      </div>

      <div className="mt-6 mb-2">
        <Button
          onClick={handleContinue}
          className="w-full min-h-[44px] h-12 sm:h-11 rounded-xl text-base font-semibold bg-primary hover:bg-primary/90 transition-all active:scale-[0.98] shadow-lg shadow-primary/10"
        >
          {isLastBlock ? "Dhamee" : "Sii wado"}
          <ChevronRight className="ml-2 h-5 w-5" />
        </Button>
      </div>
    </div>
  );
};

export default React.memo(TextBlock);
