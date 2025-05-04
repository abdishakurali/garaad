"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

interface HoverTextProps {
  type: string;
  text: string;
  hoverTexts: {
    [key: string]: string;
  };
  format?: "markdown" | "plain";
}

export default function HoverText({
  type,
  text,
  hoverTexts,
  format = "plain",
}: HoverTextProps) {
  const [activeHover, setActiveHover] = useState<string | null>(null);

  // Parse markdown to find bolded sections
  const parseMarkdown = () => {
    if (format !== "markdown") return [text];

    // More robust pattern to handle single and double asterisks for bold text
    const boldPattern = /(\*\*?)(.*?)(\*\*?)/g;

    // Find text wrapped in asterisks (bold in markdown)
    const parts = [];
    let lastIndex = 0;
    let match;
    let hoverIndex = 1;

    // First, let's log the text to debug
    console.log("Text to parse:", text);

    while ((match = boldPattern.exec(text)) !== null) {
      // Add text before the match
      if (match.index > lastIndex) {
        parts.push({
          type: "text",
          content: text.substring(lastIndex, match.index),
        });
      }

      // Add the bolded text with hover functionality
      // match[2] contains the text between asterisks
      parts.push({
        type: "hover",
        content: match[2],
        hoverKey: `hover-${hoverIndex}`,
      });

      lastIndex = match.index + match[0].length;
      hoverIndex++;

      // Log what we found for debugging
      console.log(
        `Found bold text: "${match[2]}" with hover key: hover-${hoverIndex - 1}`
      );
    }

    // Add any remaining text
    if (lastIndex < text.length) {
      parts.push({
        type: "text",
        content: text.substring(lastIndex),
      });
    }

    return parts;
  };

  const textParts = parseMarkdown();

  return (
    <div className="relative max-w-2xl mx-auto p-4 font-sans">
      <div className="text-base leading-relaxed">
        {Array.isArray(textParts) ? (
          textParts.map((part, index) => {
            if (typeof part === "object" && part.type === "hover") {
              return (
                <span
                  key={index}
                  className="font-medium border-b-2 border-blue-500 rounded px-1 py-0.5 hover:bg-blue-200 cursor-pointer relative"
                  onMouseEnter={() =>
                    part.hoverKey && setActiveHover(part.hoverKey)
                  }
                  onMouseLeave={() => setActiveHover(null)}
                >
                  {typeof part === "string" ? part : part.content}
                </span>
              );
            }
            return (
              <span key={index}>
                {typeof part === "string" ? part : part.content}
              </span>
            );
          })
        ) : (
          <span>{text}</span>
        )}
      </div>

      {/* Hover tooltip */}
      {activeHover && hoverTexts[activeHover] ? (
        <div
          className={cn(
            "absolute z-10 p-6 bg-white border border-gray-200 rounded-md shadow-lg",
            "max-w-md mt-2 text-sm leading-relaxed"
          )}
        >
          {hoverTexts[activeHover]}
        </div>
      ) : null}
    </div>
  );
}
