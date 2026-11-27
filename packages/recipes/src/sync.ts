/**
 * `pnpm recipes:sync`: makes the docs app's copy of the app shell identical to
 * the recipe. One way only, from the package to the docs app.
 */
import { relative } from "node:path";

import { APP_SHELL_FILES, DOCS_APP, REPO_ROOT } from "./paths.ts";
import { runSync } from "./recipes.ts";

process.exitCode = runSync(APP_SHELL_FILES, DOCS_APP, {
  labels: {
    files: relative(REPO_ROOT, APP_SHELL_FILES),
    dest: relative(REPO_ROOT, DOCS_APP),
  },
  log: (line) => console.log(line),
});
