"use client";

import React, { useRef, useEffect, useCallback } from "react";
import { cn } from "@/lib/utils";

export interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  language?: string;
  placeholder?: string;
  disabled?: boolean;
  minLines?: number;
}

const LINE_NUM_WIDTH = 48;
const FONT_SIZE_MOBILE = 13;
const LINE_HEIGHT = 1.6;
const MIN_HEIGHT_MOBILE = 200;

export function CodeEditor({
  value,
  onChange,
  language = "javascript",
  placeholder,
  disabled = false,
  minLines = 8,
}: CodeEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const tabCursorRef = useRef<{ start: number; end: number } | null>(null);

  const lineCount = value ? value.split("\n").length : 1;
  const displayLines = Math.max(minLines, lineCount);
  const minHeightPx = Math.max(MIN_HEIGHT_MOBILE, displayLines * LINE_HEIGHT * FONT_SIZE_MOBILE);

  const restoreCursor = useCallback(() => {
    if (tabCursorRef.current && textareaRef.current) {
      const { start, end } = tabCursorRef.current;
      textareaRef.current.focus();
      textareaRef.current.setSelectionRange(start, end);
      tabCursorRef.current = null;
    }
  }, []);

  useEffect(() => {
    restoreCursor();
  }, [value, restoreCursor]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key !== "Tab") return;
    e.preventDefault();
    const ta = e.currentTarget;
    const start = ta.selectionStart;
    const end = ta.selectionEnd;
    const newVal = value.slice(0, start) + "  " + value.slice(end);
    tabCursorRef.current = { start: start + 2, end: start + 2 };
    onChange(newVal);
  };

  return (
    <div className="w-full overflow-hidden rounded-b-xl border border-t-0 border-[#27272a] bg-[#09090b]">
      {/* Header bar — smaller on mobile */}
      <div className="flex items-center justify-between border-b border-zinc-800 bg-zinc-900 px-3 py-2 sm:px-4 sm:py-3 rounded-t-xl">
        <div className="flex items-center gap-1 sm:gap-1.5">
          <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-red-500" />
          <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-yellow-500" />
          <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-green-500" />
        </div>
        <span className="text-xs font-medium uppercase tracking-wider text-zinc-500" style={{ fontFamily: "Inter, sans-serif" }}>
          {language}
        </span>
      </div>

      {/* Editor area — line numbers hidden on small screens (< 640px) */}
      <div className="relative flex">
        <div
          className="hidden sm:block shrink-0 py-3 sm:py-5 pr-2 text-right select-none text-zinc-600"
          style={{
            width: LINE_NUM_WIDTH,
            fontFamily: "'Fira Code', 'Cascadia Code', Consolas, monospace",
            fontSize: FONT_SIZE_DESKTOP,
            lineHeight: LINE_HEIGHT,
          }}
          aria-hidden
        >
          {Array.from({ length: displayLines }, (_, i) => i + 1).map((n) => (
            <div key={n}>{n}</div>
          ))}
        </div>
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          spellCheck={false}
          autoCorrect="off"
          autoCapitalize="off"
          className={cn(
            "flex-1 min-w-0 resize-y rounded-b-xl border bg-transparent py-3 pr-3 pl-3 sm:py-5 sm:pr-5 sm:-ml-12 sm:pl-[56px] outline-none transition-colors duration-200",
            "border-[#27272a] focus:ring-0 focus:border-purple-500/60",
            "text-[13px] sm:text-sm",
            "min-h-[200px] sm:min-h-[240px]",
            disabled && "cursor-not-allowed opacity-70"
          )}
          style={{
            fontFamily: "'Fira Code', 'Cascadia Code', Consolas, monospace",
            lineHeight: LINE_HEIGHT,
            color: "#34d399",
            background: "#09090b",
            minHeight: minHeightPx,
            marginLeft: 0,
            tabSize: 2,
          } as React.CSSProperties}
          data-enable-grammarly="false"
        />
      </div>
    </div>
  );
}
