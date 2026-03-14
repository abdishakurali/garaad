import React, { useMemo, useState, useEffect } from "react";
import { TextContent } from "@/types/learning";
import HoverText from "./HoverText";
import Image from "next/image";
import { Button } from "../ui/button";
import { ChevronRight } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { cn } from "@/lib/utils";
import remarkGfm from "remark-gfm";

const renderMDList = (input: string[] | string | undefined) => {
  if (!input) return null;
  if (typeof input === "string" && input.startsWith("[")) {
    try {
      const parsed = JSON.parse(input);
      if (Array.isArray(parsed)) {
        return (
          <ul className="space-y-2 list-none pl-0">
            {parsed.map((item: string, i: number) => (
              <li key={i} className="flex gap-2.5 items-start">
                <span className="w-1.5 h-1.5 rounded-full bg-violet-500 mt-2 shrink-0" />
                <span className="text-sm sm:text-base text-zinc-300">{item}</span>
              </li>
            ))}
          </ul>
        );
      }
    } catch (e) {
      console.error("Failed to parse JSON list:", e);
    }
  }
  if (Array.isArray(input)) {
    return (
      <ul className="space-y-2 list-none pl-0">
        {input.map((item: string, i: number) => (
          <li key={i} className="flex gap-2.5 items-start">
            <span className="w-1.5 h-1.5 rounded-full bg-violet-500 mt-2 shrink-0" />
            <span className="text-sm sm:text-base text-zinc-300">{item}</span>
          </li>
        ))}
      </ul>
    );
  }
  if (typeof input === "string" && input.includes("<") && input.includes(">")) {
    return <div dangerouslySetInnerHTML={{ __html: input }} className="text-zinc-300 text-sm sm:text-base" />;
  }
  return (
    <div className="prose prose-invert max-w-none text-zinc-300 text-sm sm:text-base leading-relaxed">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{String(input)}</ReactMarkdown>
    </div>
  );
};

const TextBlock: React.FC<{
  content: TextContent;
  onContinue: () => void;
  isLastBlock: boolean;
}> = ({ content, onContinue, isLastBlock }) => {
  const additionalTexts = useMemo(() => {
    return Array.from({ length: 6 }, (_, i) => content[`text${i + 1}` as keyof TextContent]);
  }, [content]);

  const [imgLoading, setImgLoading] = useState(false);
  const [imgSrc, setImgSrc] = useState(content.url);
  const [selectedCell, setSelectedCell] = useState<{ r: number; c: number } | null>(null);

  useEffect(() => {
    if (content.url) {
      setImgLoading(true);
      setImgSrc(content.url);
    }
  }, [content.url]);

  const displayImg = content.img_url || content.url;
  const isImgTop = content.img_position === "top";

  const RenderImage = () => {
    if (!displayImg) return null;
    return (
      <div className="w-full my-4">
        <div className="relative w-full aspect-video rounded-xl overflow-hidden border border-zinc-800 bg-zinc-900">
          {imgLoading && <div className="absolute inset-0 bg-zinc-800 animate-pulse z-10" />}
          <Image
            key={displayImg}
            src={displayImg || ""}
            alt={content.alt || "lesson image"}
            fill
            className="object-cover"
            style={{ opacity: imgLoading ? 0 : 1, transition: "opacity 0.3s" }}
            onLoad={() => setImgLoading(false)}
            onError={() => setImgLoading(false)}
            priority
          />
        </div>
        {((content as { caption?: string }).caption || content.alt) && (
          <p className="text-xs text-zinc-500 text-center mt-2">
            {(content as { caption?: string }).caption || content.alt}
          </p>
        )}
      </div>
    );
  };

  return (
    <div className="w-full max-w-2xl mx-auto px-4 sm:px-6 lg:px-0">
      <div className="rounded-2xl bg-zinc-900 border border-zinc-800 p-5 sm:p-6 lg:p-8">
        {content.title && (
          <h2 className="text-lg sm:text-xl font-semibold text-white mb-3">
            {content.title.includes("<") ? (
              <div dangerouslySetInnerHTML={{ __html: content.title }} />
            ) : (
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{content.title}</ReactMarkdown>
            )}
          </h2>
        )}

        {isImgTop && <RenderImage />}

        {content.type === "2_hovers" && content.text && (
          <HoverText
            type={content.type}
            text={content.text}
            hoverTexts={{ "hover-1": content["hover-1"] || "", "hover-2": content["hover-2"] || "" }}
            format={content.format as "markdown" | "plain"}
          />
        )}

        {content.type !== "2_hovers" && content.text && (
          <div className="space-y-3 text-sm sm:text-base leading-relaxed text-zinc-300">
            {renderMDList(content.text)}
          </div>
        )}

        {!isImgTop && <RenderImage />}

        {content.type === "list" && content.list_items && Array.isArray(content.list_items) && content.list_items.length > 0 && (
          <ul className="space-y-2 list-none pl-0">
            {content.list_items.map((item, index) => (
              <li key={index} className="flex gap-2.5 items-start">
                <span className="w-1.5 h-1.5 rounded-full bg-violet-500 mt-2 shrink-0" />
                <span className="text-sm sm:text-base text-zinc-300 flex-1">{item}</span>
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
              <div key={index} className="space-y-3 text-sm sm:text-base leading-relaxed text-zinc-300 mt-4">
                {renderMDList(text as string | string[])}
              </div>
            );
          }
          return null;
        })}

        {content.type === "table" && (content.features?.length ?? 0) > 0 && (
          <div className="w-full mt-4">
            <div className="sm:hidden space-y-2">
              {content.features?.map((feature, idx) => (
                <div key={idx} className="rounded-xl bg-zinc-800/50 p-3.5 border border-zinc-800/60">
                  <p className="text-xs text-zinc-500 mb-1">{feature.title}</p>
                  <p className="text-sm text-zinc-200">
                    {feature.text?.includes("<") ? <div dangerouslySetInnerHTML={{ __html: feature.text }} /> : feature.text}
                  </p>
                </div>
              ))}
            </div>
            <div className="hidden sm:block overflow-hidden rounded-xl border border-zinc-800">
              <table className="min-w-full border-collapse">
                <thead>
                  <tr className="bg-zinc-800">
                    <th className="px-4 py-2.5 text-left text-xs text-zinc-400 uppercase tracking-wide">Title</th>
                    <th className="px-4 py-2.5 text-left text-xs text-zinc-400 uppercase tracking-wide">Content</th>
                  </tr>
                </thead>
                <tbody>
                  {content.features?.map((feature, idx) => (
                    <tr key={idx} className="border-t border-zinc-800/60 hover:bg-white/[0.02]">
                      <td className="px-4 py-3 text-sm font-medium text-zinc-200">{feature.title}</td>
                      <td className="px-4 py-3 text-sm text-zinc-300">
                        {feature.text?.includes("<") ? <div dangerouslySetInnerHTML={{ __html: feature.text }} /> : feature.text}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {content.type === "table-grid" && content.table?.rows?.length && content.table.rows.length > 0 && (
          <div className="w-full mt-4 overflow-hidden rounded-xl border border-zinc-800">
            <table className="min-w-full border-collapse">
              {content.table.header && (
                <thead className="bg-zinc-800">
                  <tr>
                    {content.table.header.map((headerCell, index) => (
                      <th key={index} className="px-4 py-2.5 text-left text-xs text-zinc-400 uppercase tracking-wide">
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
                    className={cn("border-t border-zinc-800/60", rowIndex % 2 === 0 ? "bg-transparent" : "bg-zinc-800/30")}
                  >
                    {row.map((cell, cellIndex) => {
                      const isSelected = selectedCell?.r === rowIndex && selectedCell?.c === cellIndex;
                      return (
                        <td
                          key={cellIndex}
                          onClick={() => setSelectedCell(isSelected ? null : { r: rowIndex, c: cellIndex })}
                          className={cn(
                            "px-4 py-3 text-sm text-zinc-300 cursor-pointer",
                            isSelected ? "bg-violet-500/10 ring-1 ring-inset ring-violet-500/30" : "hover:bg-white/[0.02]"
                          )}
                        >
                          {cell || ""}
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

export default React.memo(TextBlock);
