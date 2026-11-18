#!/usr/bin/env node
// Checks that every package under packages/ is registered everywhere a missed
// registration fails silently: the package still builds, but its version is
// left behind, its CSS ships unlayered, or the umbrella never re-exports it.
// These are the hand-kept steps of the new-package checklist in
// .agents/components.md. It reads source only, so it needs no build.

import { existsSync, readdirSync, readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const packagesDir = join(root, "packages");
const read = (path) => readFileSync(join(root, path), "utf8");
const readJson = (path) => JSON.parse(read(path));
const failures = [];
const fail = (message) => failures.push(message);

/* The umbrella serves icons from its own `./icons` subpaths, never the root
   barrel (see packages/design-system/src/index.ts). */
const UMBRELLA = "design-system";
const NOT_IN_BARREL = new Set(["icons"]);

const hasCssModule = (dir) =>
  readdirSync(dir, { withFileTypes: true }).some((entry) =>
    entry.isDirectory()
      ? hasCssModule(join(dir, entry.name))
      : entry.name.endsWith(".module.css"),
  );

const packages = readdirSync(packagesDir, { withFileTypes: true })
  .filter(
    (entry) =>
      entry.isDirectory() &&
      existsSync(join(packagesDir, entry.name, "package.json")),
  )
  .map((entry) => ({
    folder: entry.name,
    pkg: readJson(`packages/${entry.name}/package.json`),
  }));

const extraFiles = new Set(
  readJson("release-please-config.json").packages["."]["extra-files"].map(
    (file) => file.path,
  ),
);
// tsconfig.json allows comments, so its references are matched, not parsed.
const references = new Set(
  [...read("tsconfig.json").matchAll(/"path":\s*"([^"]+)"/g)].map(
    ([, path]) => path,
  ),
);
const cssLayers = createRequire(import.meta.url)("./css-layers.cjs");
const umbrellaDeps = readJson(`packages/${UMBRELLA}/package.json`).dependencies;
const barrel = read(`packages/${UMBRELLA}/src/index.ts`);

for (const { folder, pkg } of packages) {
  const { name } = pkg;

  if (!extraFiles.has(`packages/${folder}/package.json`)) {
    fail(`${name}: missing from release-please-config.json extra-files`);
  }

  if (!references.has(`./packages/${folder}`)) {
    fail(`${name}: missing from the root tsconfig.json references`);
  }

  const src = join(packagesDir, folder, "src");
  if (existsSync(src) && hasCssModule(src) && !cssLayers[folder]) {
    fail(`${name}: has CSS modules but no entry in scripts/css-layers.cjs`);
  }

  if (folder === UMBRELLA) continue;

  // A private package must stay out of the umbrella: `pnpm -r publish` skips
  // it but still publishes the umbrella, which would then depend on a version
  // npm cannot serve.
  if (pkg.private) {
    if (umbrellaDeps?.[name]) {
      fail(`${name}: private, but the umbrella depends on it`);
    }
    continue;
  }

  if (!umbrellaDeps?.[name]) {
    fail(`${name}: missing from the umbrella's dependencies`);
  }

  if (
    !NOT_IN_BARREL.has(folder) &&
    !barrel.includes(`export * from "${name}";`)
  ) {
    fail(`${name}: not re-exported from packages/${UMBRELLA}/src/index.ts`);
  }
}

if (failures.length > 0) {
  console.error(
    `✗ package registration check failed:\n${failures.map((f) => `  - ${f}`).join("\n")}`,
  );
  console.error("\nSee the new-package checklist in .agents/components.md.");
  process.exit(1);
}

console.log(
  `✓ package registration checks passed for ${packages.length} packages`,
);
