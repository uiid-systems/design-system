import { execFileSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

// Storybook's browser tests need Chromium locally. Vercel builds only compile
// the docs app, and its build image has no apt-get for `--with-deps`.
if (process.env.VERCEL) process.exit(0);

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const playwright = path.join(root, "node_modules", ".bin", "playwright");

execFileSync(playwright, ["install", "chromium"], { stdio: "inherit" });
