import { existsSync, readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import * as lucide from "lucide-react";

const require = createRequire(import.meta.url);

export const PKG_DIR = resolve(dirname(fileURLToPath(import.meta.url)), "..");
export const LUCIDE_DIR = dirname(require.resolve("lucide-react/package.json"));

/** Import specifier for one icon's own module, bypassing lucide's root. */
export const specifierFor = (file) => `lucide-react/dist/esm/icons/${file}.mjs`;

// lucide-react's root module is the authoritative export-name → file mapping:
//   export { default as Globe, default as GlobeIcon, … } from './icons/globe.mjs';
//
// We parse it rather than deriving file names from export names, because the two
// do not always correspond: `FingerprintIcon` is an alias that lives in
// fingerprint-pattern.mjs, so any name-mangling heuristic silently drops it.
export function readIconMap() {
  const rootModule = `${LUCIDE_DIR}/dist/esm/lucide-react.mjs`;
  const source = readFileSync(rootModule, "utf8");

  const byName = new Map();
  const reExportLine =
    /export\s*\{([^}]*)\}\s*from\s*'\.\/icons\/([^']+)\.mjs'/g;
  for (const [, exportList, file] of source.matchAll(reExportLine)) {
    for (const [, name] of exportList.matchAll(/default as (\w+)/g)) {
      // Keep only the canonical `*Icon` form; drop the bare (`Globe`) and
      // `Lucide*`-prefixed aliases so the surface is single-named. Bare names
      // collide with words we use elsewhere — `Image` shadows the DOM global,
      // `Code` collides with @uiid/code — so they are deliberately not exposed.
      if (/^[A-Z][A-Za-z\d]*Icon$/.test(name)) byName.set(name, file);
    }
  }

  // Fail loudly rather than silently emitting a partial icon set if a future
  // lucide-react changes its dist layout or re-export style.
  if (byName.size < 1000) {
    throw new Error(
      `Parsed only ${byName.size} icons from ${rootModule} — lucide-react's dist format has probably changed. Update scripts/lucide-icon-map.mjs.`,
    );
  }

  const problems = [];
  for (const [name, file] of byName) {
    if (!(name in lucide)) {
      problems.push(`${name} is not exported by lucide-react`);
    }
    if (!existsSync(`${LUCIDE_DIR}/dist/esm/icons/${file}.mjs`)) {
      problems.push(`${name} points at missing file icons/${file}.mjs`);
    }
  }
  if (problems.length > 0) {
    throw new Error(
      `lucide-react icon map failed validation:\n  - ${problems.slice(0, 10).join("\n  - ")}${
        problems.length > 10 ? `\n  …and ${problems.length - 10} more` : ""
      }`,
    );
  }

  return [...byName]
    .map(([exportName, file]) => ({ exportName, file }))
    .sort((a, b) => a.exportName.localeCompare(b.exportName));
}
