import { execFileSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

// Vercel builds compile one app — apps/docs or apps/storybook — and neither has
// git hooks to install, nor does the build image have apt-get for Playwright's
// `--with-deps`. Skipping the per-icon emit below is safe too: both apps build
// through turbo, whose `^build` runs `@uiid/icons build`, and that script ends
// in the very emit this file would have run.
if (process.env.VERCEL) process.exit(0);

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const bin = (name) => path.join(root, "node_modules", ".bin", name);

// Husky pointed core.hooksPath at .husky/_. That directory is gone, and while
// the config survives in each dev's .git/config, git looks there and silently
// runs nothing. Clear it so machines migrating off husky heal themselves.
try {
  const hooksPath = execFileSync("git", ["config", "--get", "core.hooksPath"], {
    encoding: "utf8",
  }).trim();
  if (hooksPath.startsWith(".husky")) {
    execFileSync("git", ["config", "--unset", "core.hooksPath"]);
  }
} catch {
  // git exits non-zero when the key is unset, or this isn't a checkout at all.
}

// pnpm 10 blocks dependency lifecycle scripts, so lefthook's own postinstall
// never runs and the hooks never land in .git/hooks. Install them ourselves.
// Kept ahead of Playwright so a slow browser download can't skip hook setup.
execFileSync(bin("lefthook"), ["install"], { stdio: "inherit" });

// @uiid/icons serves one generated module per icon (`@uiid/icons/globe`). They are
// not committed, and tests, editors and typechecks resolve against them, so emit
// them on install rather than making everything wait for a build.
execFileSync(
  process.execPath,
  ["packages/icons/scripts/emit-per-icon-modules.mjs"],
  { cwd: root, stdio: "inherit" },
);

// Storybook's browser tests need Chromium locally.
execFileSync(bin("playwright"), ["install", "chromium"], { stdio: "inherit" });
