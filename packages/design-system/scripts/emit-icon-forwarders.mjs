import { mkdirSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const require = createRequire(import.meta.url);

const PKG_DIR = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const ICONS_PKG_DIR = dirname(require.resolve("@uiid/icons/package.json"));

// Emits one forwarding module per icon so consumers of this package can reach a
// single icon without pulling the whole set:
//
//   import { GlobeIcon } from "@uiid/design-system/icons/globe";
//
// This is the piece a facade package needs in order to pass the per-icon path
// through. Without it, an app that depends only on `@uiid/design-system` has no
// way to reach `@uiid/icons/globe` — package managers isolate that path — so it
// would be stuck importing the barrel and parsing every icon.
//
// The icon list is read from `@uiid/icons`'s own generated output rather than
// re-parsed from lucide: that package is the single place that knows the mapping,
// and turbo's `dependsOn: ["^build"]` guarantees it has been built first.
//
// Generated, not committed — see .gitignore.
export function emitIconForwarders({ clean = true } = {}) {
  const srcDir = `${ICONS_PKG_DIR}/icons`;
  const outDir = `${PKG_DIR}/icons`;

  let entries;
  try {
    entries = readdirSync(srcDir);
  } catch {
    throw new Error(
      `@uiid/icons has no generated icons/ directory at ${srcDir}. Build @uiid/icons first (pnpm --filter @uiid/icons build).`,
    );
  }

  const names = entries
    .filter((f) => f.endsWith(".js"))
    .map((f) => f.slice(0, -".js".length));

  if (names.length < 1000) {
    throw new Error(
      `Found only ${names.length} icon modules in ${srcDir} — expected the full set. Rebuild @uiid/icons.`,
    );
  }

  if (clean) rmSync(outDir, { recursive: true, force: true });
  mkdirSync(outDir, { recursive: true });

  // `export *` rather than named re-exports: it forwards whatever the underlying
  // module exports, so the handful of lucide modules that carry two names (an
  // icon plus an alias) need no special handling here.
  for (const name of names) {
    writeFileSync(
      `${outDir}/${name}.js`,
      `export * from "@uiid/icons/${name}";\n`,
    );
    writeFileSync(
      `${outDir}/${name}.d.ts`,
      `export * from "@uiid/icons/${name}";\n`,
    );
  }

  return { moduleCount: names.length, outDir };
}

if (process.argv[1]?.endsWith("emit-icon-forwarders.mjs")) {
  const clean = !process.argv.includes("--no-clean");
  const { moduleCount, outDir } = emitIconForwarders({ clean });
  console.log(`Emitted ${moduleCount} icon forwarders → ${outDir}`);
}
