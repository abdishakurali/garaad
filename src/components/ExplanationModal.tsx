import React from "react";
import { X } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkBreaks from "remark-breaks";
import { motion } from "framer-motion";
import Image from "next/image";
import Latex from "react-latex-next";
import { ExplanationText } from "@/types/learning";

interface ExplanationModalProps {
  isOpen: boolean;
  onClose: () => void;
  content: {
    image?: string;
    explanation: string | ExplanationText;
    type: "markdown" | "latex";
  };
}

const ExplanationModal: React.FC<ExplanationModalProps> = ({
  isOpen,
  onClose,
  content,
}) => {
  // Build an array of paragraph strings, whether explanation is raw text or JSON.
  let paragraphs: string[] = [];

  if (typeof content.explanation === "string") {
    // Try parsing JSON
    try {
      const obj = JSON.parse(content.explanation) as ExplanationText;
      paragraphs = Object.values(obj)
        .filter((t) => typeof t === "string" && t.trim().length > 0)
        .map((t) => t.replace(/\\n\\n/g, "\n\n"));
    } catch {
      // Not JSON — treat it as a plain Markdown/LaTeX string
      paragraphs = content.explanation
        .replace(/\\n\\n/g, "\n\n")
        .split(/\n{2,}/g);
    }
  } else {
    // Already an ExplanationText object
    paragraphs = Object.values(content.explanation)
      .filter((t) => typeof t === "string" && t.trim().length > 0)
      .map((t) => t.replace(/\\n\\n/g, "\n\n"));
  }

  return (
    <div
      className={`
        fixed inset-0 z-50 flex items-center justify-center p-4
        transition-all duration-300 ease-out
        ${
          isOpen
            ? "opacity-100 backdrop-blur-sm"
            : "opacity-0 pointer-events-none"
        }
      `}
    >
      {/* Backdrop */}
      <div
        className={`
          fixed inset-0 bg-black/50
          transition-opacity duration-300
          ${isOpen ? "opacity-100" : "opacity-0"}
        `}
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className={`
          relative bg-white rounded-2xl w-full sm:w-[400px] md:w-[500px] lg:w-[600px] overflow-hidden
          transform transition-all duration-500 ease-out
          ${
            isOpen
              ? "translate-y-0 opacity-100 scale-100"
              : "translate-y-8 opacity-0 scale-95"
          }
        `}
      >
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-bold">Sharraxaad</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="px-6 pb-6 space-y-6"
        >
          <div className="bg-white/70 backdrop-blur-sm rounded-lg border border-gray-100 text-black">
            <div className="prose prose-sm max-w-none space-y-4">
              {content.type === "latex" ? (
                // Join paragraphs with spaces for LaTeX rendering
                <Latex>{paragraphs.join(" ")}</Latex>
              ) : (
                // Render each paragraph via ReactMarkdown
                paragraphs.map((para, idx) => (
                  <ReactMarkdown key={idx} remarkPlugins={[remarkBreaks]}>
                    {para}
                  </ReactMarkdown>
                ))
              )}
            </div>

            {content.image && (
              <div className="mt-4 flex justify-center">
                <Image
                  src={content.image}
                  alt="Explanation visual"
                  width={400}
                  height={200}
                  className="rounded-lg max-h-32 object-contain"
                />
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ExplanationModal;
