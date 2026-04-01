import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * Next.js webpack requires plugins as string names + options (not instantiated functions).
 * `base` pins Tailwind to this repo when multiple lockfiles confuse cwd (e.g. ~/package-lock.json).
 */
const config = {
  plugins: [
    [
      "@tailwindcss/postcss",
      {
        base: __dirname,
      },
    ],
  ],
};

export default config;
