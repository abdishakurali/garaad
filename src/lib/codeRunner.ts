/**
 * In-browser JavaScript code runner.
 * Runs user code in a sandboxed iframe (allow-scripts only).
 * No eval() on the main thread. 5s timeout.
 */

interface RunResult {
  success: boolean;
  output: unknown;
  error: string | null;
  logs: string[];
}

export async function runCode(
  userCode: string,
  functionName: string,
  testArgs: unknown[][]
): Promise<RunResult[]> {
  const iframe = document.createElement("iframe");
  // allow-scripts only — NO allow-same-origin, allow-forms, allow-popups.
  // Iframe cannot access parent DOM, localStorage, cookies, or fetch.
  iframe.setAttribute("sandbox", "allow-scripts");
  iframe.style.display = "none";
  document.body.appendChild(iframe);

  const script = `
    const logs = [];
    const _log = console.log.bind(console);
    console.log = (...args) => {
      logs.push(args.map(a =>
        typeof a === 'object' ? JSON.stringify(a) : String(a)
      ).join(' '));
    };

    let results = [];
    try {
      ${userCode}
      const testArgs = ${JSON.stringify(testArgs)};
      const fn = typeof ${functionName} === 'function' ? ${functionName} : null;
      if (!fn) {
        results = testArgs.map(() => ({
          success: false,
          output: null,
          error: 'Function "${functionName}" not found',
          logs: [...logs]
        }));
      } else {
        for (const args of testArgs) {
          try {
            const output = fn(...args);
            results.push({
              success: true,
              output,
              error: null,
              logs: [...logs]
            });
            logs.length = 0;
          } catch (e) {
            results.push({
              success: false,
              output: null,
              error: e.message,
              logs: [...logs]
            });
            logs.length = 0;
          }
        }
      }
    } catch (e) {
      results = testArgs.map(() => ({
        success: false,
        output: null,
        error: e.message,
        logs: []
      }));
    }
    window.parent.postMessage(
      { type: 'GARAAD_RUN_RESULT', results },
      '*'
    );
  `;

  return new Promise<RunResult[]>((resolve, reject) => {
    const timeout = setTimeout(() => {
      cleanup();
      reject(new Error("Execution timed out"));
    }, 5000);

    function handler(event: MessageEvent) {
      if (event.data?.type !== "GARAAD_RUN_RESULT") return;
      cleanup();
      resolve(event.data.results ?? []);
    }

    function cleanup() {
      clearTimeout(timeout);
      window.removeEventListener("message", handler);
      iframe.remove();
    }

    window.addEventListener("message", handler);

    try {
      const doc = iframe.contentDocument;
      if (!doc) {
        cleanup();
        reject(new Error("Could not get iframe document"));
        return;
      }
      doc.open();
      doc.write(`<script>${script}<\/script>`);
      doc.close();
    } catch (err) {
      cleanup();
      reject(err instanceof Error ? err : new Error("Execution failed"));
    }
  });
}

// ─── Test case evaluator ───────────────────────────────────────────────────

export interface TestCase {
  args: unknown[];
  expected: unknown;
  label?: string;
  hint?: string;
}

export interface TestResult {
  passed: boolean;
  label: string;
  expected: unknown;
  received: unknown;
  error: string | null;
  logs: string[];
}

export function evaluateResults(
  runResults: RunResult[],
  testCases: TestCase[]
): TestResult[] {
  return testCases.map((tc, i) => {
    const run = runResults[i];
    if (!run) {
      return {
        passed: false,
        label: tc.label ?? `Test ${i + 1}`,
        expected: tc.expected,
        received: undefined,
        error: "No result",
        logs: [],
      };
    }

    const passed = run.success && deepEqual(run.output, tc.expected);

    return {
      passed,
      label: tc.label ?? `Tijaabo ${i + 1}`,
      expected: tc.expected,
      received: run.output,
      error: run.error,
      logs: run.logs ?? [],
    };
  });
}

function deepEqual(a: unknown, b: unknown): boolean {
  if (a === b) return true;
  if (typeof a !== typeof b) return false;
  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) return false;
    return a.every((v, i) => deepEqual(v, b[i]));
  }
  if (
    typeof a === "object" &&
    a !== null &&
    typeof b === "object" &&
    b !== null
  ) {
    const ka = Object.keys(a as object).sort();
    const kb = Object.keys(b as object).sort();
    if (!deepEqual(ka, kb)) return false;
    return ka.every((k) =>
      deepEqual((a as Record<string, unknown>)[k], (b as Record<string, unknown>)[k])
    );
  }
  return false;
}
