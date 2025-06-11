import React, { useMemo, useState, useEffect } from "react";
import { TextContent } from "@/types/learning";
import { Card, CardContent } from "../ui/card";
import HoverText from "./HoverText";
import Image from "next/image";
import { Button } from "../ui/button";
import { ChevronRight } from "lucide-react";
import ReactMarkdown from "react-markdown";

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

  return Array.isArray(input) ? (
    <ul className="mb-4 !pl-0 !list-none not-prose [&>li]:before:content-['•'] [&>li]:before:text-xl [&>li]:before:mr-2 [&>li]:before:inline-block">
      {input.map((item, index) => (
        <li className="mb-2" key={index}>
          {item}
        </li>
      ))}
    </ul>
  ) : (
    <p>{input}</p>
  );
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
    <div className="flex flex-col items-center justify-center min-h-[40vh] max-w-2xl mx-auto px-4">
      <Card className="w-full max-w-full shadow-lg rounded-2xl border border-gray-100 bg-white">
        <CardContent className="flex flex-col items-center text-left justify-center p-3 md:p-2 space-y-6 md:space-y-10">
          {content.title && (
            <div className="prose prose-lg dark:prose-invert max-w-none text-lg md:text-lg font-bold text-center">
              <ReactMarkdown>{content.title}</ReactMarkdown>
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
            <div className="prose prose-base mt-1 text-muted-foreground text-left text-md">
              {renderMDList(content.text)}
            </div>
          )}

          {content.url && (
            <div className="flex justify-center w-full">
              <div className="relative w-full max-w-[500px] aspect-[16/7] my-6">
                {imgLoading && (
                  <div className="absolute inset-0 w-full h-full bg-gray-200 animate-pulse rounded-lg z-10" />
                )}
                <Image
                  key={imgSrc}
                  src={imgSrc || ""}
                  alt={content.alt || "lesson image"}
                  fill
                  objectFit="contain"
                  onLoad={() => setImgLoading(false)}
                  onError={() => setImgLoading(false)}
                  priority
                  style={{ opacity: imgLoading ? 0 : 1, transition: "opacity 0.2s" }}
                />
              </div>
            </div>
          )}

          {additionalTexts.map((text, index) => {
            // Only render if text is a non-empty string or a string[] with at least one non-empty item
            if (
              (typeof text === "string" && text.trim() !== "") ||
              (Array.isArray(text) && text.some((item) => typeof item === "string" && (item as string).trim() !== ""))
            ) {
              return (
                <div
                  key={index}
                  className="prose prose-base mt-1 text-muted-foreground text-left text-md"
                >
                  {renderMDList(text as string | string[])}
                </div>
              );
            }
            return null;
          })}

          {content.type === "table" && (content.features?.length ?? 0) > 0 && (
            <div className="overflow-x-auto mb-6">
              <table className="min-w-full bg-white border border-gray-200 shadow rounded-lg border-separate overflow-hidden">
                <tbody>
                  {content.features?.map((feature, idx) => (
                    <tr
                      key={idx}
                      className={`border-b last:border-0 ${idx % 2 === 0 ? "bg-white" : "bg-gray-50"
                        } hover:bg-blue-50 transition-colors`}
                    >
                      <td className="px-6 py-4 text-sm font-bold text-gray-800">
                        {feature.title}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        {feature.text}
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
              <div className="overflow-x-auto mb-6 w-full">
                <table className="min-w-full bg-white border border-gray-200 shadow rounded-lg">
                  {content.table.header && (
                    <thead>
                      <tr className="bg-gray-100 text-gray-700 text-sm">
                        {content.table.header.map((headerCell, index) => (
                          <th
                            key={index}
                            className="px-6 py-3 text-left font-semibold border-b border-gray-300"
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
                        className={
                          rowIndex % 2 === 0 ? "bg-white" : "bg-gray-50"
                        }
                      >
                        {row.map((cell, cellIndex) => (
                          <td
                            key={cellIndex}
                            className="px-6 py-4 text-sm text-gray-800 border-b border-gray-200"
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

          <div className="flex justify-center w-full pt-2">
            <Button
              onClick={handleContinue}
              className="w-full bg-primary hover:bg-primary/90"
              size="lg"
            >
              {isLastBlock ? "Dhamee" : "Sii wado"}
              <ChevronRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default React.memo(TextBlock);
