/**
 * `pnpm recipes:check`: fails when the docs app's copy of the app shell is not
 * identical to the recipe, or when a recipe file imports something it may not.
 */
import { relative } from "node:path";

import { APP_SHELL_FILES, DOCS_APP, REPO_ROOT } from "./paths.ts";
import { runCheck } from "./recipes.ts";

process.exitCode = runCheck(APP_SHELL_FILES, DOCS_APP, {
  labels: {
    files: relative(REPO_ROOT, APP_SHELL_FILES),
    dest: relative(REPO_ROOT, DOCS_APP),
  },
  log: (line) => console.log(line),
});
