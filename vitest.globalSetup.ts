import { execFileSync } from "node:child_process";
import path from "node:path";

// `@uiid/icons` serves one generated module per icon (`@uiid/icons/globe`). They
// are build output and are not committed, but source files import them directly,
// so every test run needs them present.
//
// This runs here rather than relying on the repo `postinstall` because CI installs
// with `--ignore-scripts` — which is also why token generation is its own CI step.
// Emitting here keeps `pnpm test:run` self-sufficient everywhere: CI, a fresh
// clone, or a working tree that has never been built.
//
// `--no-clean` overwrites in place instead of wiping first: this is the same
// output the editor and any concurrent build resolve against, and a wipe that is
// interrupted would leave a partial icon set behind.
export default function setup() {
  execFileSync(
    process.execPath,
    ["packages/icons/scripts/emit-per-icon-modules.mjs", "--no-clean"],
    { cwd: path.resolve(import.meta.dirname), stdio: "pipe" },
  );
}
