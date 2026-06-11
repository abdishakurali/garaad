/**
 * scripts/check-css-legacy-compat.mjs
 *
 * Post-build CSS compatibility gate.
 * Run after `npm run build` to confirm compiled CSS is safe for old Android / Chrome 56.
 *
 * Usage:
 *   node scripts/check-css-legacy-compat.mjs
 *
 * Exit 0 = all checks passed
 * Exit 1 = one or more checks failed (print details and abort CI)
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const cssDir = path.join(__dirname, "..", ".next", "static", "css");

// ─── ANSI colours ────────────────────────────────────────────────────────────
const red    = (s) => `\x1b[31m${s}\x1b[0m`;
const green  = (s) => `\x1b[32m${s}\x1b[0m`;
const yellow = (s) => `\x1b[33m${s}\x1b[0m`;
const bold   = (s) => `\x1b[1m${s}\x1b[0m`;

// ─── Helpers ─────────────────────────────────────────────────────────────────
function countMatches(css, pattern) {
  return (css.match(pattern) ?? []).length;
}

function allOklchHaveFallback(css) {
  // Find every oklch custom-property declaration: --foo: oklch(...)
  const oklchRe = /(--[\w-]+):oklch/g;
  let m;
  const missing = [];
  while ((m = oklchRe.exec(css)) !== null) {
    const varName = m[1];
    const before  = css.slice(0, m.index);
    // A fallback exists if the same variable was assigned an rgb/hex/hsl value earlier
    const fallbackRe = new RegExp(`${varName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}:(?:rgb|#[0-9a-fA-F]|hsl)`, "");
    if (!fallbackRe.test(before)) {
      missing.push(varName);
    }
  }
  return missing;
}

function requiredUtilitiesPresent(css) {
  // cascade-layers appends :not(#\#) specificity selectors — match with [:{]
  const required = [
    [".p-4",          /\.p-4[:{]/],
    [".m-4",          /\.m-4[:{]/],
    [".px-4",         /\.px-4[:{]/],
    [".rounded-lg",   /\.rounded-lg[:{]/],
    [".border",       /\.border[:{]/],
    [".bg-white",     /\.bg-white[:{]/],
    [".text-gray-900",/\.text-gray-900[:{]/],
    [".flex",         /\.flex[:{]/],
    [".gap-4",        /\.gap-4[:{]/],
    [".hidden",       /\.hidden[:{]/],
    [".bg-background",/\.bg-background[:{]/],
    [".text-foreground",/\.text-foreground[:{]/],
    [".font-bold",    /\.font-bold[:{]/],
  ];
  return required.filter(([, re]) => !re.test(css)).map(([name]) => name);
}

// ─── Main ────────────────────────────────────────────────────────────────────
let cssFiles;
try {
  cssFiles = fs.readdirSync(cssDir)
    .filter((f) => f.endsWith(".css"))
    .map((f) => path.join(cssDir, f));
} catch {
  console.error(red(`✖  Could not read ${cssDir}. Run 'npm run build' first.`));
  process.exit(1);
}

console.log(bold(`\nCSS Legacy Compatibility Check`));
console.log(`Scanning ${cssFiles.length} CSS file(s) in .next/static/css/\n`);

let failures = 0;

for (const file of cssFiles) {
  const name = path.basename(file);
  const css  = fs.readFileSync(file, "utf8");

  // Skip font-only files (no layer/color issues)
  if (css.startsWith("@font-face") && !css.includes("@layer")) {
    console.log(`  ${green("✓")} ${name} — font file, skipped`);
    continue;
  }

  const problems = [];

  // ── 1. @layer must be 0 ───────────────────────────────────────────────────
  const layerCount = countMatches(css, /@layer\b/g);
  if (layerCount > 0) {
    problems.push(
      `@layer blocks remaining: ${layerCount}. ` +
      `Old browsers (Chrome <99) will ignore ALL styles inside. ` +
      `Ensure @csstools/postcss-cascade-layers is in postcss.config.mjs.`
    );
  }

  // ── 2. All oklch vars must have an earlier rgb/hex fallback ───────────────
  const missingFallbacks = allOklchHaveFallback(css);
  if (missingFallbacks.length > 0) {
    problems.push(
      `${missingFallbacks.length} oklch custom properties lack a preceding rgb/hex fallback:\n` +
      missingFallbacks.slice(0, 10).map((v) => `    ${v}`).join("\n") +
      (missingFallbacks.length > 10 ? `\n    … and ${missingFallbacks.length - 10} more` : "")
    );
  }

  // ── 3. Required utility classes must be present ───────────────────────────
  const missingUtils = requiredUtilitiesPresent(css);
  if (missingUtils.length > 0) {
    problems.push(
      `Required utility classes missing from compiled CSS:\n` +
      missingUtils.map((u) => `    ${u}`).join("\n")
    );
  }

  // ── 4. Warn on unguarded color-mix (informational only) ──────────────────
  const colorMixCount = countMatches(css, /color-mix/g);
  const colorMixSupportsCount = countMatches(css, /@supports.*color-mix/g);
  if (colorMixCount > 0 && colorMixSupportsCount === 0) {
    // Soft warning: Tailwind already guards these with @supports in v4
    console.log(
      `  ${yellow("⚠")} ${name} — ${colorMixCount} color-mix() uses found but no @supports guard detected. ` +
      `Confirm Tailwind v4 is providing static hex fallbacks.`
    );
  }

  // ── 5. Report ─────────────────────────────────────────────────────────────
  if (problems.length === 0) {
    const totalOklch   = countMatches(css, /oklch/g);
    const utilCount    = countMatches(css, /\.(p|m|px|py|gap|rounded|border|bg|text|flex|grid)-/g);
    console.log(
      `  ${green("✓")} ${name}\n` +
      `    @layer: 0  |  oklch vars: ${totalOklch} (all have fallbacks)  |  utility classes: ${utilCount}`
    );
  } else {
    failures += problems.length;
    console.log(`  ${red("✖")} ${name} — ${problems.length} problem(s) found:`);
    problems.forEach((p) => {
      console.log(`    ${red("→")} ${p}`);
    });
  }

  console.log();
}

// ─── Final result ─────────────────────────────────────────────────────────────
if (failures === 0) {
  console.log(green(bold("✓ All CSS legacy compatibility checks passed.")));
  console.log(
    "  The compiled CSS should render correctly on Chrome 56+, Android 6+,\n" +
    "  Samsung Internet 8+, and iOS 12+.\n"
  );
  process.exit(0);
} else {
  console.log(
    red(bold(`✖ ${failures} check(s) failed. The compiled CSS may break on old Android/Chrome.`))
  );
  console.log(
    "  Fix the issues above, then re-run: npm run build && npm run check:css-legacy\n"
  );
  process.exit(1);
}
