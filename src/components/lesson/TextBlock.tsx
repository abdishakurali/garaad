import React from "react";
import { TextContent } from "@/types/learning";
import { motion } from "framer-motion";
import { Card, CardContent } from "../ui/card";
import HoverText from "./HoverText";
import Image from "next/image";
import { Button } from "../ui/button";
import { ChevronRight } from "lucide-react";
import ReactMarkdown from "react-markdown";

const TextBlock: React.FC<{
  content: TextContent;
  onContinue: () => void;
  isLastBlock: boolean;
}> = ({ content, onContinue, isLastBlock }) => {
  const handleContinue = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    onContinue();
  };

  function renderMDList(input: string[] | string) {
    if (!input) return null;

    if (Array.isArray(input)) {
      return (
        <ul className="list-disc mb-4">
          {input.map((item, index) => (
            <li className="flex items-center md:px-10 m-2" key={index}>
              {item}
            </li>
          ))}
        </ul>
      );
    }

    return <p>{input}</p>;
  }

  return (
    <motion.div
      className="flex flex-col items-center justify-center min-h-[40vh] max-w-2xl mx-auto px-4"
      initial="hidden"
      animate="visible"
    >
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
              <div className="relative w-full max-w-[500px] aspect-[16/7] md:aspect-[16/7] my-6">
                <Image
                  src={content.url}
                  alt={content.alt || "lesson image"}
                  fill
                  className="rounded-lg shadow-xl border border-gray-200 object-cover bg-white h-full"
                  sizes="(max-width: 900px) 90vw, (max-width: 1200px) 50vw, 500px"
                  priority
                />
              </div>
            </div>
          )}

          {content.text1 && (
            <div className="prose prose-base mt-1 text-muted-foreground text-left text-md">
              {renderMDList(content.text1)}
            </div>
          )}

          {content.text2 && (
            <div className="prose prose-base mt-1 text-muted-foreground text-left text-md">
              {renderMDList(content.text2)}
            </div>
          )}

          {content.text3 && (
            <div className="prose prose-base mt-1 text-muted-foreground text-left text-md">
              {renderMDList(content.text3)}
            </div>
          )}

          {content.text4 && (
            <div className="prose prose-base mt-1 text-muted-foreground text-left text-md">
              {renderMDList(content.text4)}
            </div>
          )}

          {content.text5 && (
            <div className="prose prose-base mt-1 text-muted-foreground text-left text-md">
              {renderMDList(content.text5)}
            </div>
          )}

          {content.text6 && (
            <div className="prose prose-base mt-1 text-muted-foreground text-left text-md">
              {renderMDList(content.text6)}
            </div>
          )}

          {content.type === "table" &&
            content.features &&
            (content.features ?? []).length > 0 && (
              <div className="overflow-x-auto mb-6">
                <table className="min-w-full bg-white border border-gray-200 shadow rounded-lg border-separate overflow-hidden">
                  <tbody>
                    {content.features?.map((feature, idx) => (
                      <tr
                        key={idx}
                        className={
                          `border-b last:border-0 ` +
                          (idx % 2 === 0 ? "bg-white" : "bg-gray-50") +
                          " hover:bg-blue-50 transition-colors"
                        }
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
            content.table &&
            content.table.rows && (
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
    </motion.div>
  );
};

export default TextBlock;
