import { execFileSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

// Vercel builds only compile the docs app: they have no git hooks to install,
// and the build image has no apt-get for Playwright's `--with-deps`.
if (process.env.VERCEL) process.exit(0);

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const bin = (name) => path.join(root, "node_modules", ".bin", name);

// pnpm 10 blocks dependency lifecycle scripts, so lefthook's own postinstall
// never runs and the hooks never land in .git/hooks. Install them ourselves.
// Kept ahead of Playwright so a slow browser download can't skip hook setup.
execFileSync(bin("lefthook"), ["install"], { stdio: "inherit" });

// Storybook's browser tests need Chromium locally.
execFileSync(bin("playwright"), ["install", "chromium"], { stdio: "inherit" });
