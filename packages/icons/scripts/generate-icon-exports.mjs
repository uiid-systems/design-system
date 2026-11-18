import { rmSync, writeFileSync } from "node:fs";

import { PKG_DIR, readIconMap, specifierFor } from "./lucide-icon-map.mjs";

// Regenerates the full barrel: every lucide icon, under its canonical `*Icon`
// name. Each one is re-exported from its own lucide module rather than from
// lucide-react's root, which is a single large file of ~1,750 re-export lines
// plus a namespace re-export of icons/index.mjs. Importing anything from that
// root makes a consumer's bundler parse the whole set — see README.md.
//
// The barrel is written as a .js module and a .d.ts beside it, not as one .ts
// file. lucide ships no .d.ts for its per-icon modules, so a .ts re-export
// leaves tsc to emit `export { default as GlobeIcon } from "lucide-react/…"`
// into dist, which a consumer cannot resolve: every icon is typed `any`.
// Writing the declarations here types each icon as the local `Icon`, the same
// shape the per-icon subpath modules use, and keeps the runtime module a pure
// re-export barrel. vite.config.ts copies the .d.ts into dist.

const HEADER = `// AUTO-GENERATED — do not edit by hand.
// Regenerate with \`pnpm --filter @uiid/icons generate\` after bumping lucide-react.`;

const icons = readIconMap();
const outBase = `${PKG_DIR}/src/lucide-icons.generated`;

const js = `${HEADER}
//
// Every icon is re-exported from its own lucide module, never from
// lucide-react's root — see README.md for why that matters. Types live in the
// .d.ts beside this file.
${icons
  .map(
    ({ exportName, file }) =>
      `export { default as ${exportName} } from "${specifierFor(file)}";`,
  )
  .join("\n")}
`;

const dts = `${HEADER}
//
// Types for lucide-icons.generated.js. Every icon is the local \`Icon\`, never
// lucide's own type: consumers do not depend on lucide-react (TS2742).
import type { Icon } from "./icon-type";

${icons.map(({ exportName }) => `export declare const ${exportName}: Icon;`).join("\n")}
`;

// The barrel used to be a single .ts file. Remove it so it cannot shadow the
// .d.ts during resolution.
rmSync(`${outBase}.ts`, { force: true });
writeFileSync(`${outBase}.js`, js);
writeFileSync(`${outBase}.d.ts`, dts);
console.log(
  `Generated ${icons.length} icon re-exports and declarations → ${outBase}.{js,d.ts}`,
);
