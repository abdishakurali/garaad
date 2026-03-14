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
    <div className="w-full max-w-2xl mx-auto px-4 sm:px-6 lg:px-0 pb-12">
      <div className="rounded-2xl bg-zinc-900 border border-zinc-800 p-5 sm:p-6">
        <h2 className="text-base sm:text-lg font-medium text-white leading-relaxed mb-5 sm:mb-6">
          {questionText}
        </h2>

        {hintFromStarter && (
          <div className="rounded-xl border-l-4 border-amber-500/50 bg-zinc-800/50 px-4 py-3 mb-4">
            <p className="text-sm text-zinc-400">{hintFromStarter}</p>
          </div>
        )}

        <CodeEditor
          value={code}
          onChange={setCode}
          language={language}
          disabled={isRunning}
          minLines={10}
        />

        <div className="mt-3 flex flex-col sm:flex-row gap-2 sm:justify-end">
          <Button
            variant="ghost"
            onClick={handleReset}
            disabled={isRunning}
            className="h-9 rounded-lg px-4 text-sm bg-zinc-800 hover:bg-zinc-700 text-zinc-400 order-2 sm:order-1 min-h-[44px] sm:min-h-0"
          >
            <RotateCcw className="mr-2 h-4 w-4" />
            Dib u bilow
          </Button>
          <Button
            onClick={handleRun}
            disabled={isRunning}
            className="h-9 rounded-lg px-5 text-sm font-semibold bg-violet-600 hover:bg-violet-500 text-white order-1 sm:order-2 min-h-[44px] sm:min-h-0"
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
        </div>

        {hasRun && testResults && (
          <TestResults results={testResults} isRunning={isRunning} />
        )}

        {allPassed && explanation && (
          <div className="mt-4 rounded-xl border border-zinc-800 bg-zinc-800/30 p-4">
            <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wide mb-2">Sharaxaad:</p>
            <p className="text-sm text-zinc-300 leading-relaxed">{explanation}</p>
          </div>
        )}
      </div>
    </div>
  );
}
