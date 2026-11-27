/**
 * `pnpm recipes:sync`: makes the docs app's copy of the app shell identical to
 * the recipe. One way only, from the package to the docs app.
 */
import { relative } from "node:path";

import { APP_SHELL_FILES, DOCS_APP, REPO_ROOT } from "./paths.ts";
import { syncRecipe } from "./recipes.ts";

const dest = relative(REPO_ROOT, DOCS_APP);
const { written, removed } = syncRecipe(APP_SHELL_FILES, DOCS_APP);

for (const file of written) console.log(`  wrote    ${dest}/${file}`);
for (const file of removed) console.log(`  removed  ${dest}/${file}`);
console.log(
  written.length + removed.length === 0
    ? `recipes:sync: the docs copy already matches`
    : `recipes:sync: wrote ${written.length}, removed ${removed.length}`,
);
