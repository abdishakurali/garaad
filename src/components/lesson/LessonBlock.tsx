import Image from "next/image";
import { type LessonContentBlock, TextContent, ImageContent } from "@/types/learning";
import { cn } from "@/lib/utils";
import ReactMarkdown from "react-markdown";

interface LessonBlockProps {
    block: LessonContentBlock;
    className?: string;
}

export function LessonBlock({ block, className }: LessonBlockProps) {
    switch (block.block_type) {
        case "text":
            const textContent = block.content as TextContent;
            return (
                <div className={cn("prose dark:prose-invert max-w-none", className)}>
                    <ReactMarkdown>{textContent.text}</ReactMarkdown>
                </div>
            );

        case "image":
            const imageContent = block.content as ImageContent;
            return (
                <div className={cn("relative w-full aspect-video rounded-lg overflow-hidden", className)}>
                    <Image
                        src={imageContent.url}
                        alt={imageContent.alt}
                        width={imageContent.width}
                        height={imageContent.height}
                        className="object-cover"
                    />
                    {imageContent.caption && (
                        <p className="text-sm text-muted-foreground mt-2">{imageContent.caption}</p>
                    )}
                </div>
            );

        case "video":
            return (
                <div className={cn("relative w-full aspect-video rounded-lg overflow-hidden", className)}>
                    <iframe
                        src={block.content as string}
                        className="w-full h-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                    />
                </div>
            );

        case "example":
            const exampleContent = block.content as TextContent;
            return (
                <div className={cn("bg-muted p-4 rounded-lg", className)}>
                    <ReactMarkdown>{exampleContent.text}</ReactMarkdown>
                </div>
            );

        case "interactive":
            // Adiga can implement custom interactive components here
            return (
                <div className={cn("p-4 border rounded-lg", className)}>
                    {typeof block.content === 'string' ? block.content : JSON.stringify(block.content)}
                </div>
            );

        default:
            return null;
    }
} 