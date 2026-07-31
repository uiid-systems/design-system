#!/usr/bin/env node

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");

const { registry, generateComponentDocs } = await import(
  "../packages/registry/dist/index.js"
);

// --- Helpers ---

function toKebab(name) {
  return name.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();
}

// Directory overrides for components whose filesystem name doesn't match kebab(name)
const DIR_OVERRIDES = {
  Toaster: "toast",
};

function getComponentDir(entry) {
  const pkg = entry.package.replace("@uiid/", "");
  const dirName = DIR_OVERRIDES[entry.name] || toKebab(entry.name);
  return path.join(ROOT, "packages", pkg, "src", dirName);
}

/**
 * Starting point for a brand-new component only. Deliberately has no `## Props`
 * table: docs and Storybook render props from docgen against the real source,
 * so a table checked into the README would be a second, drifting copy.
 */
function generateScaffold(docs) {
  return `# ${docs.name}

> ${docs.description || "TODO: Add description"}

Use ${docs.name} when you want to:

- TODO: describe the cases this component is for

## Quick Reference

\`\`\`tsx
import { ${docs.name} } from "${docs.package}";

<${docs.name} />
\`\`\`

## See Also

- TODO: Add related components
`;
}

// --- Main ---

const stats = { created: 0, unchanged: 0, skipped: 0 };

for (const [name, entry] of Object.entries(registry)) {
  const dir = getComponentDir(entry);

  if (!fs.existsSync(dir)) {
    console.log(`SKIP  ${name} — directory not found: ${path.relative(ROOT, dir)}`);
    stats.skipped++;
    continue;
  }

  const readmePath = path.join(dir, "README.md");

  // READMEs are authored, not generated. They are the single source rendered by
  // both the docs site (<Readme of>) and Storybook (<Markdown>), while props come
  // from docgen against the real component. This script therefore only ever
  // scaffolds a README that does not exist yet — it must never rewrite one.
  //
  // It used to replace the `## Props` section and the description blockquote on
  // every run, appending a registry-derived table to any README that lacked one.
  // That silently overwrote hand-written prose for every registered component.
  if (fs.existsSync(readmePath)) {
    console.log(`KEEP  ${name} — authored README left untouched`);
    stats.unchanged++;
    continue;
  }

  const docs = generateComponentDocs(entry);
  fs.writeFileSync(readmePath, generateScaffold(docs), "utf-8");
  console.log(`WRITE ${name} — created scaffold`);
  stats.created++;
}

console.log(
  `\nDone: ${stats.created} created, ${stats.unchanged} kept, ${stats.skipped} skipped`
);
