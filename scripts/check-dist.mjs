#!/usr/bin/env node
// Checks the built packages the way a consumer meets them. Tests and Storybook
// resolve every @uiid/* import to source through the `@uiid/source` export
// condition, so nothing else in CI loads dist.
//
// Run after `pnpm turbo run build --filter='./packages/*'`. Six checks:
//   1. Every bare import in a package's published files, type declarations
//      included, is one of its dependencies or peerDependencies. The workspace
//      symlinks devDependencies, so an undeclared import works here and breaks
//      for a strict install.
//   2. Every `exports` target exists on disk.
//   3. The umbrella's entry points import in Node and render on the server.
//   4. The icon barrels type-check from outside the repo, with real types.
//   5. Every published entry point type-checks under `moduleResolution:
//      "nodenext"`, whose relative imports must name their files.
//   6. Published stylesheets carry no Lightning CSS artifacts: no
//      `--lightningcss-*` fallbacks, no native nesting, and `light-dark()`
//      still present where the packages use it (see scripts/css-target.ts).

import { execFileSync } from "node:child_process";
import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  readdirSync,
  readFileSync,
  rmSync,
  statSync,
  symlinkSync,
  writeFileSync,
} from "node:fs";
import { createRequire, isBuiltin } from "node:module";
import { tmpdir } from "node:os";
import { dirname, join, relative, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const packagesDir = join(root, "packages");
const failures = [];
const fail = (message) => failures.push(message);
const tscBin = createRequire(import.meta.url).resolve("typescript/bin/tsc");

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

// The stylesheets whose sources use `light-dark()` today. Add a sheet here when
// another package's CSS starts to.
const LIGHT_DARK_SHEETS = {
  "@uiid/buttons": ["buttons.css"],
  "@uiid/code": ["code.css"],
  "@uiid/design-system": ["design-system.css"],
};

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

  for (const file of walk(join(dir, "dist")).filter((f) =>
    f.endsWith(".css"),
  )) {
    const css = readFileSync(file, "utf8");
    const name = relative(root, file);
    if (css.includes("--lightningcss-")) {
      fail(
        `${name}: has --lightningcss-* fallbacks, so light-dark() was lowered. Check cssTarget.`,
      );
    }
    // Strings and url()s may hold a literal `&`; nowhere else may one appear.
    if (css.replace(/"[^"]*"|'[^']*'|url\([^)]*\)/g, "").includes("&")) {
      fail(
        `${name}: ships native CSS nesting. Check the lightningcss options in scripts/css-target.ts.`,
      );
    }
  }
  for (const file of LIGHT_DARK_SHEETS[manifest.name] ?? []) {
    const path = join(dir, "dist", file);
    if (!existsSync(path)) {
      fail(`${manifest.name}: dist/${file} does not exist.`);
    } else if (!readFileSync(path, "utf8").includes("light-dark(")) {
      fail(`${manifest.name}: dist/${file} lost its light-dark() colors.`);
    }
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

// The icon barrels re-export lucide modules that ship no types, so a barrel
// whose declarations still name them gives a consumer `any` for every icon,
// and skipLibCheck hides it. Compile a consumer outside the repo, linked to the
// built packages, and require real types: each @ts-expect-error below must be
// used, and nothing else may error.
const consumer = mkdtempSync(join(tmpdir(), "uiid-dist-types-"));
try {
  const link = (name, target) => {
    mkdirSync(dirname(join(consumer, "node_modules", name)), {
      recursive: true,
    });
    symlinkSync(target, join(consumer, "node_modules", name), "dir");
  };
  link("@uiid/icons", join(packagesDir, "icons"));
  link("@uiid/design-system", umbrella);
  link("@types/react", dirname(require.resolve("@types/react/package.json")));

  const iconChecks = ["@uiid/icons", "@uiid/design-system/icons"]
    .map(
      (specifier, index) => `
import { createLucideIcon as create${index}, GlobeIcon as Globe${index}, type Icon as Icon${index} } from "${specifier}";
export const icon${index}: Icon${index} = Globe${index};
export const created${index}: Icon${index} = create${index}("x", [["path", { d: "M0 0" }]]);
// @ts-expect-error: an icon is a component, not \`any\`
export const notAny${index}: number = Globe${index};
// @ts-expect-error: \`size\` takes a string or number
export const wrongProp${index} = <Globe${index} size={true} />;
// @ts-expect-error: createLucideIcon is a function, not \`any\`
export const createNotAny${index}: number = create${index};
`,
    )
    .join("");
  writeFileSync(join(consumer, "consumer.tsx"), iconChecks);
  writeFileSync(
    join(consumer, "tsconfig.json"),
    JSON.stringify({
      compilerOptions: {
        strict: true,
        noEmit: true,
        jsx: "react-jsx",
        module: "ESNext",
        moduleResolution: "bundler",
        target: "ES2022",
        skipLibCheck: true,
        types: [],
      },
      include: ["consumer.tsx"],
    }),
  );
  execFileSync(
    process.execPath,
    [tscBin, "-p", consumer, "--pretty", "false"],
    { encoding: "utf8", stdio: "pipe" },
  );
} catch (error) {
  fail(
    `icon barrels: a consumer type-check against the built packages failed.\n${error.stdout ?? error.message}`,
  );
} finally {
  rmSync(consumer, { recursive: true, force: true });
}

// Under `moduleResolution: "nodenext"`, a relative import in a declaration file
// must name its file (`./button.js`), so an extensionless one is TS2307 and the
// types behind it are lost. skipLibCheck would hide that, so this consumer
// checks libraries too and reports only errors in our own files: third-party
// declarations are not ours to fix. Every published entry point is imported,
// and a wildcard subpath is sampled with the names listed for its package: a
// lucide icon and one of our own.
const wildcardSamples = {
  "@uiid/icons": ["globe", "loading-spinner"],
  "@uiid/design-system": ["globe", "loading-spinner"],
};
const nodenext = mkdtempSync(join(tmpdir(), "uiid-dist-nodenext-"));
try {
  const published = packages.filter(({ manifest }) => !manifest.private);
  const specifiers = [];
  for (const { dir, manifest } of published) {
    mkdirSync(join(nodenext, "node_modules", "@uiid"), { recursive: true });
    symlinkSync(dir, join(nodenext, "node_modules", manifest.name), "dir");
    for (const [key, target] of Object.entries(manifest.exports ?? {})) {
      if (!target?.types) continue;
      const subpath = key.replace(/^\.\/?/, "");
      const samples = wildcardSamples[manifest.name];
      if (subpath.includes("*") && !samples) {
        fail(
          `${manifest.name}: add sample names for its "${key}" export to wildcardSamples in check-dist.`,
        );
        continue;
      }
      const names = subpath.includes("*")
        ? samples.map((sample) => subpath.replace("*", sample))
        : [subpath];
      for (const name of names) {
        specifiers.push(name ? `${manifest.name}/${name}` : manifest.name);
      }
    }
  }
  mkdirSync(join(nodenext, "node_modules", "@types"), { recursive: true });
  symlinkSync(
    dirname(require.resolve("@types/react/package.json")),
    join(nodenext, "node_modules", "@types", "react"),
    "dir",
  );

  writeFileSync(
    join(nodenext, "package.json"),
    JSON.stringify({ type: "module" }),
  );
  writeFileSync(
    join(nodenext, "consumer.ts"),
    specifiers
      .map((specifier, index) => `import * as m${index} from "${specifier}";`)
      .concat(`export { ${specifiers.map((_, i) => `m${i}`).join(", ")} };`)
      .join("\n"),
  );
  writeFileSync(
    join(nodenext, "tsconfig.json"),
    JSON.stringify({
      compilerOptions: {
        strict: true,
        noEmit: true,
        module: "NodeNext",
        moduleResolution: "NodeNext",
        target: "ES2022",
        skipLibCheck: false,
        types: [],
      },
      include: ["consumer.ts"],
    }),
  );
  let exited = false;
  let output = "";
  try {
    execFileSync(
      process.execPath,
      [tscBin, "-p", nodenext, "--pretty", "false"],
      { cwd: root, encoding: "utf8", stdio: "pipe" },
    );
  } catch (error) {
    exited = true;
    output = `${error.stdout ?? ""}${error.stderr ?? ""}` || error.message;
  }
  const errors = output.split("\n").filter((line) => /error TS\d+/.test(line));
  const ours = errors.filter((line) => !line.includes("node_modules/"));
  // tsc failing without a single diagnostic means it crashed or never ran, which
  // must not pass as "no errors in our files".
  if (exited && !errors.length) {
    fail(
      `nodenext consumer: tsc exited non-zero without reporting a type error.\n${output}`,
    );
  }
  if (ours.length) {
    fail(
      `nodenext consumer: ${ours.length} type errors resolving ${specifiers.length} entry points.\n${ours.join("\n")}`,
    );
  }
} finally {
  rmSync(nodenext, { recursive: true, force: true });
}

if (failures.length) {
  console.error(failures.map((f) => `✗ ${f}`).join("\n"));
  process.exit(1);
}
console.log(`✓ dist checks passed for ${packages.length} packages`);
