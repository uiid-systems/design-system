import { mkdirSync, rmSync, writeFileSync } from "node:fs";

import { PKG_DIR, readIconMap, specifierFor } from "./lucide-icon-map.mjs";

// Emits one tiny module per icon, so a consumer can reach a single icon without
// the bundler walking the whole set:
//
//   import { GlobeIcon } from "@uiid/icons/globe";
//
// A consumer's build cost then scales with the icons it uses, not with the
// ~1,750 the package makes available. These are written directly rather than
// bundled: each is a one-line re-export of an external package, so routing them
// through vite as ~1,750 lib entries would only slow this package's own build.
//
// They live in icons/ rather than dist/ deliberately: `build` empties dist
// first (packages/config/scripts/clean-build-output.mjs), so anything written there is deleted
// on the next build.
//
// Generated, not committed. Emitted by `build`, `dev`, the repo `postinstall`,
// `pnpm typecheck`, Vitest's global setup and Storybook's config (both through
// packages/config/scripts/emit-generated-sources.ts), and the module-graph tests, which run this
// themselves so they never depend on build order.

// The icon type is declared locally rather than as import("lucide-react"):
// consumers depend on @uiid/icons but not on lucide-react, so a d.ts that
// names lucide's types is unresolvable for them (TS2742) the moment they
// re-export or annotate an icon.
//
// Mirrors `Icon` in src/icon-type.ts. Exported so icon-type.test.ts compiles
// this exact text beside the source declaration, and the two cannot drift.
export const ICON_TYPE_DTS = `import type { ComponentType, SVGProps } from "react";

/** Takes lucide's LucideProps, without referencing lucide's own types. */
export type Icon = ComponentType<
  Partial<SVGProps<SVGSVGElement>> & {
    size?: string | number;
    absoluteStrokeWidth?: boolean;
  }
>;
`;

// `clean` wipes the directory first, which only `build` should do: this output is
// what consumers and the editor resolve `@uiid/icons/<icon>` against, so a wipe
// that is interrupted leaves them with a partial icon set and TS2307. The tests
// therefore overwrite in place instead of deleting.
export function emitPerIconModules({ clean = true } = {}) {
  const icons = readIconMap();
  const outDir = `${PKG_DIR}/icons`;

  if (clean) rmSync(outDir, { recursive: true, force: true });
  mkdirSync(outDir, { recursive: true });

  writeFileSync(`${outDir}/icon-type.d.ts`, ICON_TYPE_DTS);

  // Several canonical names can share one lucide module (`FingerprintIcon` and
  // `FingerprintPatternIcon` both live in fingerprint-pattern.mjs), so the
  // module is keyed by file and exports every name bound to it.
  const namesByFile = new Map();
  for (const { exportName, file } of icons) {
    const names = namesByFile.get(file) ?? [];
    names.push(exportName);
    namesByFile.set(file, names);
  }

  for (const [file, names] of namesByFile) {
    const specifier = specifierFor(file);
    writeFileSync(
      `${outDir}/${file}.js`,
      `${names
        .map((name) => `export { default as ${name} } from "${specifier}";`)
        .join("\n")}\n`,
    );
    writeFileSync(
      `${outDir}/${file}.d.ts`,
      `import type { Icon } from "./icon-type.js";\n${names
        .map((name) => `export declare const ${name}: Icon;`)
        .join("\n")}\n`,
    );
  }

  // Our own icons get a subpath too, so every icon in the package is reached the
  // same way regardless of whether lucide or we authored it. These point into
  // dist rather than at lucide.
  writeFileSync(
    `${outDir}/loading-spinner.js`,
    `export { LoadingSpinnerIcon } from "../dist/components/loading-spinner.js";\n`,
  );
  writeFileSync(
    `${outDir}/loading-spinner.d.ts`,
    `export {\n  LoadingSpinnerIcon,\n  type LoadingSpinnerIconProps,\n} from "../dist/components/loading-spinner.js";\n`,
  );

  return {
    iconCount: icons.length,
    moduleCount: namesByFile.size + 1,
    outDir,
  };
}

// Only run when invoked directly, so the tests can import and call it.
if (process.argv[1]?.endsWith("emit-per-icon-modules.mjs")) {
  const clean = !process.argv.includes("--no-clean");
  const { iconCount, moduleCount, outDir } = emitPerIconModules({ clean });
  console.log(
    `Emitted ${moduleCount} per-icon modules (${iconCount} icons) → ${outDir}`,
  );
}
