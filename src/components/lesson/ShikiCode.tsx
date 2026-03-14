"use client";
import React, { useEffect, useState } from "react";
import { createHighlighter } from "shiki";

interface ShikiCodeProps {
    code: string;
    language?: string;
    theme?: "github-dark" | "github-light";
}

// Singleton highlighter instance to avoid redundant loading
let highlighterPromise: any = null;

const getHighlighterInstance = () => {
    if (!highlighterPromise) {
        highlighterPromise = createHighlighter({
            themes: ["github-dark", "github-light"],
            langs: [
                "javascript", "typescript", "python", "html",
                "css", "json", "sql", "bash", "cpp", "java", "rust"
            ],
        });
    }
    return highlighterPromise;
};

const ShikiCode: React.FC<ShikiCodeProps> = ({
    code,
    language = "javascript",
    theme = "github-dark"
}) => {
    const [html, setHtml] = useState<string>("");

    useEffect(() => {
        let isMounted = true;
        const highlight = async () => {
            try {
                const highlighter = await getHighlighterInstance();

                if (isMounted) {
                    const highlighted = highlighter.codeToHtml(code, {
                        lang: language.toLowerCase() === "js" ? "javascript" :
                            language.toLowerCase() === "ts" ? "typescript" :
                                language.toLowerCase() === "py" ? "python" :
                                    language,
                        theme: theme,
                    });
                    setHtml(highlighted);
                }
            } catch (error) {
                console.error("Shiki highlighting failed:", error);
                if (isMounted) setHtml(`<pre>${code}</pre>`);
            }
        };

        highlight();
        return () => { isMounted = false; };
    }, [code, language, theme]);

    if (!html) {
        return (
            <div className="w-full bg-zinc-800 animate-pulse rounded-xl p-4 min-h-[100px] flex items-center justify-center">
                <div className="flex gap-1.5">
                    <div className="w-2 h-2 bg-zinc-700 rounded-full animate-pulse" />
                    <div className="w-2 h-2 bg-zinc-700 rounded-full animate-pulse [animation-delay:150ms]" />
                    <div className="w-2 h-2 bg-zinc-700 rounded-full animate-pulse [animation-delay:300ms]" />
                </div>
            </div>
        );
    }

    return (
        <div
            className="shiki-container rounded-xl overflow-x-auto overflow-hidden border border-zinc-800 bg-zinc-950 text-[13px] sm:text-sm leading-normal p-4"
            dangerouslySetInnerHTML={{ __html: html }}
        />
    );
};

export default ShikiCode;
