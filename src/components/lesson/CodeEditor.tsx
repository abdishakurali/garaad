"use client";

import React, { useRef, useEffect, useCallback } from "react";
import { cn } from "@/lib/utils";

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  language?: string;
  placeholder?: string;
  disabled?: boolean;
  minLines?: number;
}

const LINE_NUM_WIDTH = 48;
const FONT_SIZE_MOBILE = 13;
const FONT_SIZE_DESKTOP = 14;
const LINE_HEIGHT = 1.6;
const MIN_HEIGHT_MOBILE = 180;

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
    <div className="w-full overflow-hidden rounded-xl border border-zinc-800 bg-zinc-950">
      <div className="flex items-center justify-between border-b border-zinc-800 bg-zinc-900 px-4 py-2.5">
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-zinc-700" />
          <div className="w-2.5 h-2.5 rounded-full bg-zinc-700" />
          <div className="w-2.5 h-2.5 rounded-full bg-zinc-700" />
        </div>
        <span className="text-xs text-zinc-500">{language}</span>
      </div>

      <div className="relative flex">
        <div
          className="hidden sm:block shrink-0 py-4 pr-3 text-right select-none text-zinc-700 border-r border-zinc-800 text-[13px] font-mono"
          style={{ width: LINE_NUM_WIDTH, lineHeight: LINE_HEIGHT }}
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
            "flex-1 min-w-0 py-4 pl-4 sm:pl-4 sm:pr-4 outline-none transition-colors duration-150 resize-none",
            "border-0 bg-zinc-950 text-[13px] sm:text-sm font-mono",
            "focus:ring-0 focus:border-0 focus:ring-offset-0",
            "placeholder:text-zinc-600 caret-violet-400",
            "min-h-[180px] sm:min-h-[220px]",
            disabled && "cursor-not-allowed opacity-70"
          )}
          style={{
            fontFamily: "'Fira Code', 'Cascadia Code', Consolas, monospace",
            lineHeight: LINE_HEIGHT,
            color: "rgb(110 231 183)",
            minHeight: Math.max(MIN_HEIGHT_MOBILE, minHeightPx),
            tabSize: 2,
          } as React.CSSProperties}
          data-enable-grammarly="false"
        />
      </div>
    </div>
  );
}
