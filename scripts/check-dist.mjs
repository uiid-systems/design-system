#!/usr/bin/env node
// Checks the built packages the way a consumer meets them. Tests and Storybook
// alias every @uiid/* import to source, so nothing else in CI loads dist.
//
// Run after `pnpm turbo run build --filter='./packages/*'`. Three checks:
//   1. Every bare import in a package's published files, type declarations
//      included, is one of its dependencies or peerDependencies. The workspace
//      symlinks devDependencies, so an undeclared import works here and breaks
//      for a strict install.
//   2. Every `exports` target exists on disk.
//   3. The umbrella's entry points import in Node and render on the server.

import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { createRequire, isBuiltin } from "node:module";
import { dirname, join, relative, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const packagesDir = join(root, "packages");
const failures = [];
const fail = (message) => failures.push(message);

const walk = (dir) =>
  readdirSync(dir, { withFileTypes: true }).flatMap((entry) =>
    entry.isDirectory() ? walk(join(dir, entry.name)) : [join(dir, entry.name)],
  );

const packageName = (specifier) =>
  specifier.startsWith("@")
    ? specifier.split("/").slice(0, 2).join("/")
    : specifier.split("/")[0];

// Static imports, re-exports, side-effect imports and dynamic imports.
const IMPORT_RE = /(?:\bfrom\s*|\bimport\s*\(?\s*)(["'])([^"'\n]+)\1/g;

const targets = (value) =>
  typeof value === "string"
    ? [value]
    : value && typeof value === "object"
      ? Object.values(value).flatMap(targets)
      : [];

const packages = readdirSync(packagesDir)
  .map((name) => join(packagesDir, name))
  .filter((dir) => existsSync(join(dir, "package.json")))
  .map((dir) => ({
    dir,
    manifest: JSON.parse(readFileSync(join(dir, "package.json"), "utf8")),
  }));

for (const { dir, manifest } of packages) {
  if (!existsSync(join(dir, "dist"))) {
    fail(`${manifest.name}: no dist directory. Build the packages first.`);
    continue;
  }

  const declared = new Set([
    manifest.name,
    ...Object.keys(manifest.dependencies ?? {}),
    ...Object.keys(manifest.peerDependencies ?? {}),
  ]);
  // `@types/x` covers the types of `x`.
  const isDeclared = (name) =>
    declared.has(name) ||
    declared.has(`@types/${name.replace(/^@/, "").replace("/", "__")}`);

  const published = (manifest.files ?? ["dist"])
    .map((entry) => join(dir, entry))
    .filter((path) => existsSync(path) && statSync(path).isDirectory())
    .flatMap(walk)
    .filter((file) => /\.(m?js|d\.ts)$/.test(file));

  const undeclared = new Map();
  for (const file of published) {
    for (const [, , specifier] of readFileSync(file, "utf8").matchAll(
      IMPORT_RE,
    )) {
      if (/^[./#]/.test(specifier) || isBuiltin(specifier)) continue;
      const name = packageName(specifier);
      if (!isDeclared(name) && !undeclared.has(name)) {
        undeclared.set(name, relative(root, file));
      }
    }
  }
  for (const [name, file] of undeclared) {
    fail(
      `${manifest.name}: published files import "${name}" (${file}), which is not in dependencies or peerDependencies.`,
    );
  }

  for (const target of targets(manifest.exports)) {
    const [before, after] = target.split("*");
    const path = join(dir, before);
    const ok = target.includes("*")
      ? existsSync(path) &&
        statSync(path).isDirectory() &&
        readdirSync(path).some((entry) => entry.endsWith(after))
      : existsSync(path);
    if (!ok) fail(`${manifest.name}: exports target ${target} does not exist.`);
  }
}

// Load React from the umbrella's own node_modules so the components and the
// renderer share one copy.
const umbrella = join(packagesDir, "design-system");
const require = createRequire(join(umbrella, "package.json"));
const load = async (path) => {
  try {
    return await import(pathToFileURL(join(umbrella, path)).href);
  } catch (error) {
    fail(
      `@uiid/design-system: ${path} failed to load in Node. ${error.message}`,
    );
    return {};
  }
};

const { createElement } = require("react");
const { renderToString } = require("react-dom/server");
const ui = await load("dist/index.js");
await load("dist/icons.js");
await load("dist/utils.js");
const { GlobeIcon } = await load("icons/globe.js");

const renders = {
  Button: [ui.Button, null, "Button"],
  Stack: [ui.Stack, null, "Stack"],
  Text: [ui.Text, null, "Text"],
  Input: [ui.Input, { "aria-label": "Input" }],
  GlobeIcon: [GlobeIcon],
};
for (const [name, [component, ...rest]] of Object.entries(renders)) {
  if (!component) {
    fail(`${name}: not exported from the built umbrella.`);
    continue;
  }
  try {
    if (!renderToString(createElement(component, ...rest))) {
      fail(`${name}: rendered an empty string.`);
    }
  } catch (error) {
    fail(`${name}: failed to render on the server. ${error.message}`);
  }
}

if (failures.length) {
  console.error(failures.map((f) => `✗ ${f}`).join("\n"));
  process.exit(1);
}
console.log(`✓ dist checks passed for ${packages.length} packages`);
