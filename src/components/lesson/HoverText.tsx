"use client";

import { useState, useEffect, useRef } from "react";
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
  const [isMobile, setIsMobile] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Detect if the device is mobile
  useEffect(() => {
    const mediaQuery = window.matchMedia("(hover: none) and (pointer: coarse)");
    setIsMobile(mediaQuery.matches);

    const handleChange = (event: MediaQueryListEvent) => {
      setIsMobile(event.matches);
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  // Close tooltip when clicking or touching outside
  useEffect(() => {
    const handleOutside = (e: MouseEvent | TouchEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setActiveHover(null);
      }
    };

    document.addEventListener("mousedown", handleOutside);
    document.addEventListener("touchstart", handleOutside);

    return () => {
      document.removeEventListener("mousedown", handleOutside);
      document.removeEventListener("touchstart", handleOutside);
    };
  }, []);

  // Parse markdown to find bolded sections
  const parseMarkdown = () => {
    if (format !== "markdown") return text.split("\n");

    const boldPattern = /(\*\*?)(.*?)(\*\*?)/g;
    const parts: Array<
      | { type: "text"; content: string }
      | { type: "hover"; content: string; hoverKey: string }
    > = [];
    let lastIndex = 0;
    let match;
    let hoverIndex = 1;

    while ((match = boldPattern.exec(text)) !== null) {
      if (match.index > lastIndex) {
        parts.push({
          type: "text",
          content: text.substring(lastIndex, match.index),
        });
      }

      parts.push({
        type: "hover",
        content: match[2],
        hoverKey: `hover-${hoverIndex}`,
      });

      lastIndex = match.index + match[0].length;
      hoverIndex++;
    }

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
    <div
      ref={containerRef}
      className="relative max-w-2xl mx-auto p-4 font-sans"
    >
      <div className="text-base leading-relaxed">
        {Array.isArray(textParts) ? (
          textParts.map((part, index) => {
            if (typeof part === "object" && part.type === "hover") {
              return (
                <span
                  key={index}
                  className="font-medium border-b-2 border-blue-500 rounded px-1 py-0.5 hover:bg-blue-200 cursor-pointer relative"
                  onMouseEnter={
                    !isMobile
                      ? () => part.hoverKey && setActiveHover(part.hoverKey)
                      : undefined
                  }
                  onMouseLeave={
                    !isMobile ? () => setActiveHover(null) : undefined
                  }
                  onClick={
                    isMobile
                      ? () =>
                          setActiveHover((prev) =>
                            prev === part.hoverKey ? null : part.hoverKey
                          )
                      : undefined
                  }
                >
                  {part.content}
                </span>
              );
            }
            return (
              <span key={index}>
                {typeof part === "object" && "content" in part
                  ? part.content
                  : part}
              </span>
            );
          })
        ) : (
          <span>{textParts}</span>
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
