"use client";

import  { useState } from "react";
import {   Loader2, ChevronDown, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { TestResult } from "@/lib/codeRunner";

interface TestResultsProps {
  results: TestResult[];
  isRunning: boolean;
}

function formatValue(v: unknown): string {
  if (v === undefined) return "undefined";
  if (v === null) return "null";
  if (typeof v === "string") return `"${v}"`;
  if (typeof v === "object") return JSON.stringify(v);
  return String(v);
}

export function TestResults({ results, isRunning }: TestResultsProps) {
  const [expandedLogs, setExpandedLogs] = useState<Set<number>>(new Set());
  const passed = results.filter((r) => r.passed).length;
  const total = results.length;
  const allPassed = total > 0 && passed === total;
  const progressPercent = total > 0 ? (passed / total) * 100 : 0;

  const toggleLogs = (index: number) => {
    setExpandedLogs((prev) => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  };

  return (
    <div className="mt-3 w-full overflow-hidden rounded-xl border border-zinc-800">
      {results.map((r, i) => (
        <div
          key={i}
          className={cn(
            "flex items-center gap-3 px-4 py-3 border-b border-zinc-800/60 last:border-0",
            r.passed ? "bg-emerald-500/[0.06]" : "bg-red-500/[0.04]"
          )}
        >
          {isRunning ? (
            <Loader2 className="h-4 w-4 shrink-0 animate-spin text-zinc-400" />
          ) : r.passed ? (
            <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
          ) : (
            <span className="w-2 h-2 rounded-full bg-red-500 shrink-0" />
          )}
          <div className="flex-1 min-w-0">
            <p className="text-sm text-zinc-300 truncate">{r.label}</p>
            {!isRunning && !r.passed && (
              <div className="mt-1 space-y-0.5">
                {r.expected != null && (
                  <p className="font-mono text-xs text-emerald-400">La filayay: {formatValue(r.expected)}</p>
                )}
                {r.received != null && (
                  <p className="font-mono text-xs text-red-400">La helay: {formatValue(r.received)}</p>
                )}
                {r.error && <p className="font-mono text-xs text-red-400">{r.error}</p>}
              </div>
            )}
          </div>
        </div>
      ))}

      <div className="bg-zinc-900 px-4 py-2.5 border-t border-zinc-800">
        <p className="text-xs text-zinc-500">
          {passed}/{total} tijaabo ku guuleystay
        </p>
      </div>

      {!isRunning && results.some((r) => r.logs.length > 0) && (
        <div className="border-t border-zinc-800/60">
          {results.map((r, i) =>
            r.logs.length > 0 ? (
              <div key={i} className="px-4 py-2">
                <button
                  type="button"
                  onClick={() => toggleLogs(i)}
                  className="flex items-center gap-1 text-xs text-zinc-500 hover:text-zinc-400 min-h-[44px]"
                >
                  {expandedLogs.has(i) ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronRight className="h-3.5 w-3.5" />}
                  console.log
                </button>
                {expandedLogs.has(i) && (
                  <pre className="mt-1 rounded-lg bg-zinc-950 px-3 py-2 font-mono text-xs text-zinc-500 overflow-x-auto">
                    {r.logs.join("\n")}
                  </pre>
                )}
              </div>
            ) : null
          )}
        </div>
      )}
    </div>
  );
}
