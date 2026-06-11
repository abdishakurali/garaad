import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * PostCSS pipeline for old Android / Chrome 56+ compatibility.
 *
 * Plugin order:
 *  1. @tailwindcss/postcss  — generates Tailwind CSS with @layer blocks
 *  2. postcss-cascade-layers — flattens @layer into plain CSS old browsers can read
 *  3. postcss-preset-env     — converts oklch() → sRGB hex fallbacks, logical props, etc.
 *  4. autoprefixer           — adds -webkit- / -moz- vendor prefixes per browserslist
 *
 * Chrome 56 / old Android WebView does NOT support @layer, oklch(), or color-mix().
 * Steps 2–4 together make the final CSS readable on those browsers.
 *
 * NOTE: Next.js requires every array-format plugin entry to have [name, options] —
 * a single-element array causes "Malformed PostCSS Configuration".
 */
const config = {
  plugins: [
    // 1. Tailwind v4 — emits @layer theme / base / components / utilities
    [
      "@tailwindcss/postcss",
      {
        base: __dirname,
      },
    ],
    // 2. Flatten CSS cascade layers so browsers that ignore @layer still get all styles.
    //    Removes @layer wrappers and adjusts specificity to preserve layer cascade order.
    [
      "@csstools/postcss-cascade-layers",
      {},
    ],
    // 3. Transpile modern CSS to a form old browsers understand.
    //    Key: oklab-function converts oklch()/oklab() vars to rgb() fallbacks.
    //    preserve:true emits fallback BEFORE modern value → old browsers use rgb(), modern use oklch().
    [
      "postcss-preset-env",
      {
        stage: 2,
        preserve: true,
        features: {
          // Convert oklch()/oklab() to sRGB rgb() fallbacks.
          "oklab-function": { preserve: true },
          // Tailwind v4 already guards color-mix() with @supports + static hex fallback.
          "color-mix": false,
          // Tailwind v4 handles CSS nesting itself — disable to avoid double-processing.
          "nesting-rules": false,
          // Tailwind's @theme handles custom properties — skip to avoid conflicts.
          "custom-properties": false,
        },
      },
    ],
    // 4. Add -webkit- / -moz- prefixes for old Android/iOS WebView (flex, transform, etc.)
    [
      "autoprefixer",
      {},
    ],
  ],
};

export default config;
