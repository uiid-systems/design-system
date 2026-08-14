import { writeFileSync } from "node:fs";

import { PKG_DIR, readIconMap, specifierFor } from "./lucide-icon-map.mjs";

// Regenerates the full barrel: every lucide icon, under its canonical `*Icon`
// name. Each one is re-exported from its own lucide module rather than from
// lucide-react's root, which is a single large file of ~1,750 re-export lines
// plus a namespace re-export of icons/index.mjs. Importing anything from that
// root makes a consumer's bundler parse the whole set — see README.md.

const icons = readIconMap();

const file = `// AUTO-GENERATED — do not edit by hand.
// Regenerate with \`pnpm --filter @uiid/icons generate\` after bumping lucide-react.
//
// Every icon is re-exported from its own lucide module, never from
// lucide-react's root — see README.md for why that matters.
${icons
  .map(
    ({ exportName, file: iconFile }) =>
      `export { default as ${exportName} } from "${specifierFor(iconFile)}";`,
  )
  .join("\n")}
`;

const outPath = `${PKG_DIR}/src/lucide-icons.generated.ts`;
writeFileSync(outPath, file);
console.log(`Generated ${icons.length} icon re-exports → ${outPath}`);
