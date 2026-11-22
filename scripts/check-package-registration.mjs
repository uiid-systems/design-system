#!/usr/bin/env node
// Checks that every package under packages/ is registered everywhere a missed
// registration fails silently: the package still builds, but its version is
// left behind, its CSS ships unlayered, or the umbrella never re-exports it.
// These are the hand-kept steps of the new-package checklist in
// .claude/rules/components.md. It reads source only, so it needs no build.

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

/* The umbrella serves icons and utils from its own `./icons` and `./utils`
   subpaths, never the root barrel (see packages/design-system/src/index.ts). */
const UMBRELLA = "design-system";
const NOT_IN_BARREL = new Set(["icons", "utils"]);

/* Per-icon modules, generated with no source file behind them. */
const GENERATED_EXPORTS = new Set([
  "@uiid/icons ./*",
  "@uiid/design-system ./icons/*",
]);

const CLEAN_STEP = "node ../../scripts/clean-build-output.mjs && ";

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
// Comments are stripped first, so a commented-out reference does not count.
const stripComments = (text) =>
  text.replace(/\/\*[\s\S]*?\*\//g, "").replace(/(^|\s)\/\/.*$/gm, "$1");
const tsconfig = stripComments(read("tsconfig.json"));
const references = new Set(
  [...tsconfig.matchAll(/"path":\s*"([^"]+)"/g)].map(([, path]) => path),
);
const cssLayers = createRequire(import.meta.url)("./css-layers.cjs");
const umbrellaDeps = readJson(`packages/${UMBRELLA}/package.json`).dependencies;
const barrel = read(`packages/${UMBRELLA}/src/index.ts`);
const privateNames = new Set(
  packages.filter(({ pkg }) => pkg.private).map(({ pkg }) => pkg.name),
);

for (const { folder, pkg } of packages) {
  const { name } = pkg;

  if (!extraFiles.has(`packages/${folder}/package.json`)) {
    fail(`${name}: missing from release-please-config.json extra-files`);
  }

  if (!references.has(`./packages/${folder}`)) {
    fail(`${name}: missing from the root tsconfig.json references`);
  }

  // Without the shared build config a package compiles its tests into dist, and
  // without the clean step a renamed file's old output ships. Both still build.
  const tsconfigPath = `packages/${folder}/tsconfig.json`;
  const { extends: base } = JSON.parse(stripComments(read(tsconfigPath)));
  if (base !== "../../tsconfig.package.json") {
    fail(`${name}: ${tsconfigPath} must extend ../../tsconfig.package.json`);
  }
  if (!pkg.scripts?.build?.startsWith(CLEAN_STEP)) {
    fail(`${name}: its build script must start with \`${CLEAN_STEP}\``);
  }

  const src = join(packagesDir, folder, "src");
  if (existsSync(src) && hasCssModule(src) && !cssLayers[folder]) {
    fail(`${name}: has CSS modules but no entry in scripts/css-layers.cjs`);
  }

  // Tests and Storybook find source through this key, and resolution follows
  // key order, so it must come first. With a built dist, a missing key still
  // resolves, to stale output. Generated wildcards have no source to point at.
  for (const [subpath, entry] of Object.entries(pkg.exports ?? {})) {
    if (typeof entry !== "object" || !("import" in entry)) continue;
    if (GENERATED_EXPORTS.has(`${name} ${subpath}`)) continue;
    if (Object.keys(entry)[0] !== "@uiid/source") {
      fail(`${name}: exports "${subpath}" must start with "@uiid/source"`);
    }
  }

  if (pkg.private) continue;

  // `pnpm -r publish` skips a private package but still publishes everything
  // that depends on it, which then needs a version npm cannot serve.
  for (const field of ["dependencies", "peerDependencies"]) {
    for (const dep of Object.keys(pkg[field] ?? {})) {
      if (privateNames.has(dep)) {
        fail(`${name}: public, but its ${field} include private ${dep}`);
      }
    }
  }

  if (folder === UMBRELLA) continue;

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
  console.error(
    "\nSee the new-package checklist in .claude/rules/components.md.",
  );
  process.exit(1);
}

console.log(
  `✓ package registration checks passed for ${packages.length} packages`,
);
