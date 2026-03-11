"use client";

import React, { useState } from "react";
import { Check, X, Loader2, ChevronDown, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { TestResult } from "@/lib/codeRunner";

export interface TestResultsProps {
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
    <div
      className={cn(
        "w-full overflow-hidden rounded-2xl border transition-all duration-500",
        allPassed && "border-emerald-500/30 shadow-[0_0_20px_rgba(16,185,129,0.08)]",
        !allPassed && total > 0 && "border-red-500/20"
      )}
    >
      {/* Summary bar */}
      <div className="border-b border-zinc-800 bg-zinc-900/80 px-4 py-3">
        {allPassed ? (
          <p className="text-sm font-medium text-emerald-400">
            Dhammaan tijaaboyinka waa la gudbay! ✓
          </p>
        ) : (
          <p className="text-sm font-medium text-white" style={{ fontFamily: "Inter, sans-serif" }}>
            {passed} / {total} tijaabo ku guuleystay
          </p>
        )}
        <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-zinc-800">
          <div
            className="h-full rounded-full bg-emerald-500 transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Test rows */}
      <div className="divide-y divide-zinc-800/80">
        {results.map((r, i) => (
          <div
            key={i}
            className="px-4 py-3"
          >
            <div className="flex items-center gap-3">
              {isRunning ? (
                <Loader2 className="h-5 w-5 shrink-0 animate-spin text-zinc-400" />
              ) : r.passed ? (
                <Check className="h-5 w-5 shrink-0 text-emerald-400" />
              ) : (
                <X className="h-5 w-5 shrink-0 text-red-400" />
              )}
              <span
                className="flex-1 text-sm font-medium text-white min-w-0 truncate"
                style={{ fontFamily: "Inter, sans-serif" }}
              >
                {r.label}
              </span>
              {!isRunning && (
                <span
                  className={cn(
                    "rounded-full px-2.5 py-0.5 text-xs font-medium",
                    r.passed ? "bg-emerald-500/20 text-emerald-400" : "bg-red-500/20 text-red-400"
                  )}
                >
                  {r.passed ? "Saxsan" : "Khalad"}
                </span>
              )}
            </div>

            {!isRunning && !r.passed && (
              <div className="mt-2 space-y-1 pl-8">
                {r.received !== undefined && (
                  <div className="font-mono text-xs text-zinc-400 overflow-x-auto">
                    <span className="inline-block min-w-0">La filayay: <span className="text-slate-300 break-all">{formatValue(r.expected)}</span></span>
                    <span className="inline-block min-w-0 mt-0.5">La helay: <span className="text-slate-300 break-all">{formatValue(r.received)}</span></span>
                  </div>
                )}
                {r.error && (
                  <p className="font-mono text-xs text-red-400 break-all">{r.error}</p>
                )}
              </div>
            )}

            {!isRunning && r.logs.length > 0 && (
              <div className="mt-2 pl-8">
                <button
                  type="button"
                  onClick={() => toggleLogs(i)}
                  className="flex items-center gap-1 text-xs text-zinc-500 hover:text-zinc-400"
                >
                  {expandedLogs.has(i) ? (
                    <ChevronDown className="h-3.5 w-3.5" />
                  ) : (
                    <ChevronRight className="h-3.5 w-3.5" />
                  )}
                  console.log
                </button>
                {expandedLogs.has(i) && (
                  <pre className="mt-1 rounded-lg bg-zinc-900 px-3 py-2 font-mono text-xs text-zinc-600">
                    {r.logs.join("\n")}
                  </pre>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {!allPassed && results.length > 0 && results.some((r) => r.error) && (
        <div className="border-t border-zinc-800 bg-red-500/5 px-4 py-2">
          <p className="font-mono text-xs text-red-400">
            {results.find((r) => r.error)?.error}
          </p>
        </div>
      )}
    </div>
  );
}
