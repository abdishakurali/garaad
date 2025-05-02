import { type LessonContentBlock, type TextContent } from "@/types/learning";
import { cn } from "@/lib/utils";
import ReactMarkdown from "react-markdown";
import { ProblemBlock } from "./ProblemBlock";
import { Card } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Image from "next/image";

// Test component with dummy data
export function TestLessonContent() {
  const testBlocks: LessonContentBlock[] = [
    {
      id: 1,
      block_type: "text",
      content: {
        desc: "## Test Description\nThis is a test description with some **bold** text and *italic* text.\n\n- List item 1\n- List item 2\n- List item 3",
        text: "# Test Title\nThis is the main content with some **bold** text and *italic* text.\n\n1. Numbered item 1\n2. Numbered item 2\n3. Numbered item 3",
        format: "markdown",
      },
    },
  ];

  return <LessonContentBlocks blocks={testBlocks} />;
}

interface LessonContentBlocksProps {
  blocks: LessonContentBlock[];
  className?: string;
}

export function LessonContentBlocks({
  blocks,
  className,
}: LessonContentBlocksProps) {
  console.log("LessonContentBlocks received blocks:", blocks);
  return (
    <div className={cn("space-y-8", className)}>
      {blocks.map((block, index) => (
        <LessonContentBlock key={index} block={block} />
      ))}
    </div>
  );
}

function LessonContentBlock({ block }: { block: LessonContentBlock }) {
  console.log("Rendering block:", block);

  switch (block.block_type) {
    case "text":
      const textContent = block.content as TextContent;
      console.log("Text content:", textContent);

      // Ensure content is properly formatted
      const formattedDesc = textContent.desc ? textContent.desc.trim() : "";
      const formattedText = textContent.text ? textContent.text.trim() : "";

      console.log("Formatted desc:", formattedDesc);
      console.log("Formatted text:", formattedText);

      return (
        <div className="prose dark:prose-invert max-w-none">
          {formattedDesc && (
            <div className="text-muted-foreground mb-4">
              <ReactMarkdown
                components={{
                  h1: (props) => (
                    <h2 className="text-xl font-bold mt-4 mb-2" {...props} />
                  ),
                  h2: (props) => (
                    <h3
                      className="text-lg font-semibold mt-3 mb-2"
                      {...props}
                    />
                  ),
                  ul: (props) => (
                    <ul className="list-disc pl-6 mb-4" {...props} />
                  ),
                  li: (props) => <li className="mb-1" {...props} />,
                  p: (props) => <p className="mb-4" {...props} />,
                }}
              >
                {formattedDesc}
              </ReactMarkdown>
            </div>
          )}
          {formattedText && (
            <ReactMarkdown
              components={{
                h1: (props) => (
                  <h1 className="text-2xl font-bold mt-6 mb-4" {...props} />
                ),
                h2: (props) => (
                  <h2 className="text-xl font-bold mt-4 mb-2" {...props} />
                ),
                ul: (props) => (
                  <ul className="list-disc pl-6 mb-4" {...props} />
                ),
                li: (props) => <li className="mb-1" {...props} />,
                p: (props) => <p className="mb-4" {...props} />,
              }}
            >
              {formattedText}
            </ReactMarkdown>
          )}
        </div>
      );

    case "image":
      const imageContent =
        typeof block.content === "string"
          ? JSON.parse(block.content)
          : block.content;
      return (
        <div className="space-y-2">
          <div className="relative w-full aspect-video rounded-lg overflow-hidden">
            <Image
              src={imageContent.url}
              alt={imageContent.alt}
              className="object-cover w-full h-full"
              width={imageContent.width}
              height={imageContent.height}
            />
          </div>
          {imageContent.caption && (
            <p className="text-sm text-muted-foreground text-center">
              {imageContent.caption}
            </p>
          )}
        </div>
      );

    case "video":
      return (
        <div className="relative w-full aspect-video rounded-lg overflow-hidden">
          <iframe
            src={block.content as string}
            className="w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      );

    case "example":
      return (
        <Card className="p-6 bg-muted">
          <div className="prose dark:prose-invert max-w-none">
            <ReactMarkdown>{block.content as string}</ReactMarkdown>
          </div>
        </Card>
      );

    case "problem":
      return <ProblemBlock content={JSON.stringify(block.content)} />;

    case "note":
      return (
        <Alert>
          <AlertDescription>{block.content as string}</AlertDescription>
        </Alert>
      );

    case "code":
      return (
        <Card className="p-4">
          <pre className="overflow-x-auto">
            <code>{block.content as string}</code>
          </pre>
        </Card>
      );

    case "quiz":
      return (
        <Card className="p-6">
          <div className="prose dark:prose-invert max-w-none">
            <ReactMarkdown>{block.content as string}</ReactMarkdown>
          </div>
        </Card>
      );

    case "exercise":
      return (
        <Card className="p-6">
          <div className="prose dark:prose-invert max-w-none">
            <ReactMarkdown>{block.content as string}</ReactMarkdown>
          </div>
        </Card>
      );

    case "interactive":
      return (
        <Card className="p-6">
          <div className="prose dark:prose-invert max-w-none">
            <ReactMarkdown>{block.content as string}</ReactMarkdown>
          </div>
        </Card>
      );

    default:
      return null;
  }
}
