# Mobile CSS Compatibility Audit

_Generated: 2026-06-10_

---

## 1. CSS Pipeline (before fix)

| Stage | Plugin / Tool | Status |
|---|---|---|
| CSS generation | `@tailwindcss/postcss` (Tailwind v4.2.1) | ✅ present |
| Layer flattening | `@csstools/postcss-cascade-layers` | ❌ **missing** |
| Modern CSS transpilation | `postcss-preset-env` | ❌ **missing** |
| Vendor prefixes | `autoprefixer` | ❌ **missing** |
| CSS minification | Next.js built-in (cssnano) | ✅ active |
| Browserslist target | none configured | ❌ **missing** |

---

## 2. Output CSS Files

| File | Size | Content |
|---|---|---|
| `65246b948b18971a.css` | 214 KB | Tailwind utilities + theme — **main affected file** |
| `0284b8e35d9c59a8.css` | 371 KB | Noto Sans SC webfont faces only |
| `84b31f78de89339e.css` | 9 KB | Inter webfont faces |
| `3b8f7c6358566023.css` | 7.6 KB | Syne webfont faces |
| `34a278481aaa4006.css` | 3.3 KB | Instrument Serif webfont faces |
| `8b49a788e502c38a.css` | 25 KB | KaTeX math font faces |

---

## 3. Unsupported Syntax Found in `65246b948b18971a.css`

### `@layer` — **CRITICAL**

```
@layer properties { … }  ← CSS custom property fallback resets
@layer theme       { … }  ← ALL Tailwind palette color variables
@layer base        { … }  ← preflight + app base styles
@layer components  { … }  ← component styles
@layer utilities   { … }  ← ALL utility classes (.p-4, .border, .bg-*, etc.)
```

**Impact**: Chrome < 99 (including Chrome 56 / Android 6 WebView) does **not** support `@layer`. The browser silently ignores every `@layer { … }` block, which means:
- No utility styles (.p-4, .m-4, .rounded, .border, .bg-*, .text-*, etc.)
- No base body/html styles
- No Tailwind theme color variables
- Page renders as completely unstyled HTML

### `oklch()` — **HIGH**

123 CSS custom property values in `@layer theme` use `oklch()`:
```css
--color-red-500:   oklch(63.7% .237 25.331)
--color-blue-600:  oklch(54.6% .245 262.881)
--color-green-500: oklch(72.3% .219 149.579)
… (123 total)
```

Even if layers were flattened, old browsers cannot interpret `oklch()` color values. Any utility that resolves through a Tailwind palette variable (e.g. `bg-blue-600 → var(--color-blue-600) → oklch(...)`) would render as transparent/missing color.

### `color-mix()` — HANDLED BY TAILWIND

Tailwind v4 already emits `@supports (color: color-mix(...))` guards around `color-mix()` with static hex fallbacks before each block. **No additional action needed.**

### `@property` — LOW RISK

71 `@property` declarations used for transform/shadow/ring/gradient internals. Wrapped inside `@supports` browser-detection so old browsers that don't support `@property` still get fallback variable values. **No additional action needed.**

### `:has()` — LOW RISK

5 uses, all for non-critical layout hints (sidebar sizing). Graceful degradation acceptable.

### `dvh` / `svh` / `lvh` — NOT PRESENT

0 occurrences. Not an issue.

### `color-scheme: light` — LOW RISK

Declared in `:root`. Old browsers ignore it safely; no layout impact.

---

## 4. App-Specific Variables (globals.css)

All app theme variables are declared in plain `:root { … }` blocks **outside** any `@layer` — they use hex values throughout:

```css
:root {
  --background:   #ffffff;  /* hex ✅ */
  --foreground:   #111111;  /* hex ✅ */
  --primary:      #111111;  /* hex ✅ */
  --border:       #e4e4e7;  /* hex ✅ */
  …
}
```

These are safe. The problem is exclusively with Tailwind's built-in palette (`--color-red-500`, `--color-blue-600`, etc.) defined in `@layer theme`.

---

## 5. Likely Impact on Old Android

| Symptom | Root Cause |
|---|---|
| No padding / margin / spacing | `@layer utilities` ignored |
| No border / border-radius | `@layer utilities` ignored |
| No background colors | `@layer utilities` ignored + oklch palette vars |
| No text colors | `@layer utilities` ignored |
| No shadows | `@layer utilities` ignored |
| White-on-white / invisible text | body styles in `@layer base` ignored |
| No layout structure | All grid/flex utilities in `@layer utilities` |

---

## 6. Planned Fix

### Step 1 — Layer Flattening (most critical)
Install and add `@csstools/postcss-cascade-layers` as a PostCSS plugin immediately after `@tailwindcss/postcss`. This removes `@layer` wrappers and rewrites selectors with specificity tricks to preserve cascade order. Old browsers read the flat CSS normally.

### Step 2 — oklch Fallbacks
Add `postcss-preset-env` with `{ stage: 2, features: { "oklab-function": { preserve: true } } }`. This converts every `oklch(…)` value to an `rgb()` fallback placed BEFORE the modern value. Modern browsers use oklch (wider gamut); old browsers use rgb.

### Step 3 — Autoprefixer
Add `autoprefixer` targeting the browserslist below. Adds `-webkit-` prefixes for flex, transform, backdrop-filter, etc.

### Step 4 — Browserslist
Add to `package.json`:
```json
"browserslist": ["Chrome >= 56", "Android >= 6", "Samsung >= 8", "iOS >= 12", "defaults", "not dead"]
```

### PostCSS Plugin Order
```
@tailwindcss/postcss  →  @csstools/postcss-cascade-layers  →  postcss-preset-env  →  autoprefixer
```

### Step 5 — CSS Compat Check Script
`scripts/check-css-legacy-compat.mjs` — runs after build, scans `.next/static/css/*.css`, hard-warns if `@layer`, unguarded `oklch`, or other blocked syntax remains.

### Step 6 — Debug Page
`/app/debug/mobile-css` — renders all design primitives for quick visual verification on real/emulated Android.

---

## 7. What Will NOT Be Fixed

| Feature | Degradation |
|---|---|
| `backdrop-filter` blur | Falls back to non-blurred background; layout intact |
| `color-mix()` opacity variants (e.g. `bg-primary/50`) | Tailwind already emits hex fallback via `@supports` guard |
| Wide-gamut P3 colors | Old browsers get sRGB equivalent; visually close |
| `:has()` layout hints | Sidebar uses fallback sizing; no layout break |
