"use client";

/**
 * Code challenge block for question_type === 'code'.
 * Expects Problem.content (JSONField) with:
 *   starter_code, function_name, language, test_cases (args, expected, label?, hint?).
 * Set Problem.correct_answer to "passed" (or [{"text": "passed"}]) so the
 * lesson progression marks the challenge complete when all tests pass.
 */
import React, { useState, useCallback } from "react";
import { Loader2, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CodeEditor } from "./CodeEditor";
import { TestResults } from "./TestResults";
import { runCode, evaluateResults } from "@/lib/codeRunner";
import type { TestCase, TestResult } from "@/lib/codeRunner";
import { cn } from "@/lib/utils";

export interface CodeChallengeBlockProps {
  questionText: string;
  explanation: string;
  starterCode: string;
  functionName: string;
  language: string;
  testCases: TestCase[];
  onCorrect: () => void;
  onIncorrect: () => void;
}

const DEFAULT_STARTER = `function solution() {\n  // Halkan code-kaaga ku qor\n  \n}`;

export function CodeChallengeBlock({
  questionText,
  explanation,
  starterCode = DEFAULT_STARTER,
  functionName = "solution",
  language = "javascript",
  testCases,
  onCorrect,
  onIncorrect,
}: CodeChallengeBlockProps) {
  const [code, setCode] = useState(starterCode);
  const [isRunning, setIsRunning] = useState(false);
  const [testResults, setTestResults] = useState<TestResult[] | null>(null);
  const [hasRun, setHasRun] = useState(false);
  const [allPassed, setAllPassed] = useState(false);

  const hintFromStarter = starterCode.includes("//")
    ? starterCode
        .split("\n")
        .find((line) => line.trim().startsWith("//"))
        ?.replace(/^\s*\/\/\s*/, "")
    : null;

  const handleRun = useCallback(async () => {
    setIsRunning(true);
    setHasRun(true);
    try {
      const runResults = await runCode(
        code,
        functionName,
        testCases.map((tc) => tc.args)
      );
      const evaluated = evaluateResults(runResults, testCases);
      setTestResults(evaluated);
      const passed = evaluated.every((r) => r.passed);
      setAllPassed(passed);
      if (passed) {
        onCorrect();
      } else {
        onIncorrect();
      }
    } catch (err) {
      setTestResults([
        {
          passed: false,
          label: "Khalad",
          expected: null,
          received: null,
          error: err instanceof Error ? err.message : "Khalad la garanwaayo",
          logs: [],
        },
      ]);
      onIncorrect();
    } finally {
      setIsRunning(false);
    }
  }, [code, functionName, testCases, onCorrect, onIncorrect]);

  const handleReset = useCallback(() => {
    setCode(starterCode);
    setTestResults(null);
    setHasRun(false);
    setAllPassed(false);
  }, [starterCode]);

  return (
    <div className="w-full mx-3 sm:mx-4 lg:mx-0 pb-12">
      <div className="overflow-hidden rounded-2xl lg:rounded-3xl bg-white/[0.06] dark:bg-black/40 backdrop-blur-sm border border-white/[0.09] dark:border-white/[0.09] relative shadow-xl">
        <div className="p-4 sm:p-6 md:p-10 space-y-6 sm:space-y-8">
          {/* Question header */}
          <div className="space-y-4 text-center max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-2">
              <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-primary">
                JavaScript
              </span>
            </div>
            <h2
              className="text-lg sm:text-2xl md:text-3xl font-bold text-foreground leading-tight tracking-tight text-left"
              style={{ fontFamily: "Inter, sans-serif" }}
            >
              {questionText}
            </h2>
          </div>

          {hintFromStarter && (
            <div className="rounded-r-xl border-l-4 border-amber-500/60 bg-zinc-900 px-4 py-3">
              <p className="text-sm italic text-zinc-400">{hintFromStarter}</p>
            </div>
          )}

          <CodeEditor
            value={code}
            onChange={setCode}
            language={language}
            disabled={isRunning}
            minLines={10}
          />

          {/* Action row — stack on mobile, side by side tablet+ */}
          <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4">
            <Button
              onClick={handleRun}
              disabled={isRunning}
              className="min-h-[44px] h-11 w-full sm:w-auto rounded-xl font-bold bg-primary hover:bg-primary/90 transition-all"
            >
              {isRunning ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Socda...
                </>
              ) : (
                "Orod Tijaaboyinka"
              )}
            </Button>
            <Button
              variant="ghost"
              onClick={handleReset}
              disabled={isRunning}
              className="min-h-[44px] h-11 w-full sm:w-auto rounded-xl text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800"
            >
              <RotateCcw className="mr-2 h-4 w-4" />
              Dib u bilow
            </Button>
          </div>

          {hasRun && testResults && (
            <TestResults results={testResults} isRunning={isRunning} />
          )}

          {allPassed && explanation && (
            <div className="rounded-2xl border border-primary/20 bg-primary/5 p-4 sm:p-6 transition-opacity duration-500 opacity-100">
              <p className="text-xs font-bold uppercase tracking-wider text-primary mb-2">
                Sharaxaad:
              </p>
              <p className="text-sm text-slate-300 leading-relaxed">
                {explanation}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
