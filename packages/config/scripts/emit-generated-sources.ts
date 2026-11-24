import { execFileSync } from "node:child_process";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "../../..");

let emitted = false;

// Source files import two things that are generated rather than committed: the
// token CSS (`@uiid/tokens/component/button.tokens.css` and the sheets that
// `@uiid/tokens/globals.css` imports) and @uiid/icons' per-icon modules
// (`@uiid/icons/globe`). Vitest's global setup and Storybook's config both run
// this, so tests and stories work on a checkout that has never been built.
//
// It reuses each package's own generator, and runs here rather than relying on
// the repo `postinstall` because CI installs with `--ignore-scripts`.
//
// Both generators are fast (well under a second together) and write the same
// bytes every time, so they run unconditionally rather than checking freshness.
// Neither wipes its output first: icons runs with `--no-clean`, and the token
// build only prunes sheets whose JSON source is gone. Rewriting identical bytes
// still fires file watchers, though: a run that overlaps a Vitest watch session
// makes it rerun once, and an open Storybook dev preview gets a burst of hot CSS
// and module updates (no loop, no full reload).
//
// Generation happens at start only. After editing token JSON, restart Vitest or
// Storybook, or run `pnpm --filter @uiid/tokens tokens` by hand.
//
// Runs once per process: Storybook's Vitest project calls `viteFinal`, and so
// this, several times in one process.
export function emitGeneratedSources() {
  if (emitted) return;
  emitted = true;
  for (const args of [
    ["packages/tokens/build-tokens.js"],
    ["packages/icons/scripts/emit-per-icon-modules.mjs", "--no-clean"],
  ]) {
    execFileSync(process.execPath, args, { cwd: root, stdio: "pipe" });
  }
}
