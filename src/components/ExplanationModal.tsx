"use client";
import React, { useState, useMemo, memo, Suspense, lazy } from "react";
import { X } from "lucide-react";
import Image from "next/image";
import Latex from "react-latex-next";
import { ExplanationText } from "@/types/learning";

// Lazy‑load markdown renderer
const ReactMarkdown = lazy(() => import("react-markdown"));

interface ExplanationModalProps {
  isOpen: boolean;
  onClose: () => void;
  content: {
    image?: string;
    explanation: string | string[] | ExplanationText;
    type: "markdown" | "latex";
  };
}

const ExplanationModal: React.FC<ExplanationModalProps> = ({
  isOpen,
  onClose,
  content,
}) => {
  // Memoize paragraph splitting
  const paragraphs = useMemo<string[]>(() => {
    let texts: string[];
    // Normalize to array of strings
    if (typeof content.explanation === "string") {
      try {
        const obj = JSON.parse(content.explanation) as ExplanationText;
        texts = Object.values(obj).filter(
          (t): t is string => typeof t === "string" && Boolean(t.trim())
        );
      } catch {
        texts = content.explanation
          .replace(/\\n\\n/g, "\n\n")
          .split(/\n{2,}/g)
          .filter((t) => t.trim());
      }
    } else if (Array.isArray(content.explanation)) {
      texts = content.explanation.filter((t) => t.trim());
    } else {
      texts = Object.values(content.explanation).filter(
        (t): t is string => typeof t === "string" && Boolean(t.trim())
      );
    }
    return texts.map((t) => t.replace(/\\n\\n/g, "\n\n"));
  }, [content.explanation]);

  const [currentIdx, setCurrentIdx] = useState(0);
  const total = paragraphs.length;
  const isFirst = currentIdx === 0;
  const isLast = currentIdx === total - 1;

  const handlePrev = () => !isFirst && setCurrentIdx((i) => i - 1);
  const handleNext = () => !isLast && setCurrentIdx((i) => i + 1);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-lg">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-bold">Sharraxaad</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 max-h-[60vh] overflow-y-auto">
          <Suspense fallback={<p>La soo rarayo...</p>}>
            {content.type === "latex" ? (
              <Latex>{paragraphs[currentIdx]}</Latex>
            ) : (
              <ReactMarkdown>{paragraphs[currentIdx]}</ReactMarkdown>
            )}
          </Suspense>

          {content.image && (
            <div className="mt-4 flex justify-center">
              <Image
                src={content.image}
                alt="Explanation visual"
                width={400}
                height={200}
                className="rounded-lg object-contain"
                loading="lazy"
              />
            </div>
          )}
        </div>

        {/* Pagination */}
        {total > 1 && (
          <div className="flex items-center justify-between px-4 py-2 border-t bg-gray-50">
            <button
              onClick={handlePrev}
              disabled={isFirst}
              className={`p-1 rounded-full transition-colors ${isFirst
                  ? "text-gray-400 cursor-not-allowed"
                  : "text-gray-600 hover:bg-gray-200"
                }`}
            >
              &#x276E;
            </button>

            <div className="flex space-x-2">
              {paragraphs.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentIdx(idx)}
                  className={`w-2 h-2 rounded-full transition-colors focus:outline-none ${idx === currentIdx ? "bg-gray-800" : "bg-gray-300"
                    }`}
                />
              ))}
            </div>

            <button
              onClick={handleNext}
              disabled={isLast}
              className={`p-1 rounded-full transition-colors ${isLast
                  ? "text-gray-400 cursor-not-allowed"
                  : "text-gray-600 hover:bg-gray-200"
                }`}
            >
              &#x276F;
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default memo(ExplanationModal);
