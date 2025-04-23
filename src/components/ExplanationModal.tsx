import React from "react";
import { X } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { motion } from "framer-motion";
import Image from "next/image";

interface ExplanationModalProps {
  isOpen: boolean;
  onClose: () => void;
  explanation: string;
  image?: string;
}

const ExplanationModal: React.FC<ExplanationModalProps> = ({
  isOpen,
  onClose,
  explanation,
  image,
}) => {
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
                    relative bg-white rounded-2xl w-full sm:w-[600px] md:w-[700px] lg:w-[800px] overflow-hidden
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

        <div className="p-6 space-y-6">
          <motion.div
            // initial={{ opacity: 0, height: 0 }}
            // animate={{ opacity: 1, height: "auto" }}
            // exit={{ opacity: 0, height: 0 }}
            className="px-6 pb-6"
          >
            <div className="p-4 bg-white/70 backdrop-blur-sm rounded-lg border border-gray-100">
              <div className="prose prose-sm max-w-none">
                <ReactMarkdown>{explanation}</ReactMarkdown>
              </div>
              {image && (
                <div className="mt-4 flex justify-center">
                  <Image
                    src={image || "/placeholder.svg"}
                    alt="Explanation visual"
                    className="rounded-lg max-h-48"
                  />
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ExplanationModal;
