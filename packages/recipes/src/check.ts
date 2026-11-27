/**
 * `pnpm recipes:check`: fails when the docs app's copy of the app shell is not
 * identical to the recipe, or when a recipe file imports something it may not.
 */
import { relative } from "node:path";

import { APP_SHELL_FILES, DOCS_APP, REPO_ROOT } from "./paths.ts";
import { checkRecipe } from "./recipes.ts";

const files = relative(REPO_ROOT, APP_SHELL_FILES);
const problems = checkRecipe(APP_SHELL_FILES, DOCS_APP, {
  files,
  dest: relative(REPO_ROOT, DOCS_APP),
});

if (problems.length === 0) {
  console.log(`recipes:check: the docs copy matches ${files}`);
} else {
  console.error(
    `recipes:check: ${problems.length} problem(s) with the app shell recipe\n`,
  );
  for (const line of problems) console.error(`  ${line}`);
  console.error(
    `\nEdit the recipe in ${files}, then run \`pnpm recipes:sync\` to refresh the docs copy.`,
  );
  process.exitCode = 1;
}
