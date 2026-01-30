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

// Prop names where z.any() should display as ReactNode
const REACT_NODE_PROPS = new Set([
  "children",
  "trigger",
  "tooltip",
  "title",
  "description",
  "action",
  "footer",
  "icon",
]);

function getComponentDir(entry) {
  const pkg = entry.package.replace("@uiid/", "");
  const dirName = DIR_OVERRIDES[entry.name] || toKebab(entry.name);
  return path.join(ROOT, "packages", pkg, "src", dirName);
}

function formatType(prop) {
  let type = prop.type;
  // Replace "any" with "ReactNode" for contextually appropriate props
  if (type === "any" && REACT_NODE_PROPS.has(prop.name)) {
    type = "ReactNode";
  }
  return type;
}

function formatDefault(prop) {
  const val = prop.defaultValue;
  if (val === undefined || val === null) return "—";
  if (typeof val === "string") return `\`"${val}"\``;
  if (typeof val === "boolean" || typeof val === "number") return `\`${val}\``;
  return `\`${JSON.stringify(val)}\``;
}

function escapeCell(str) {
  // Escape pipe characters inside table cells
  return str.replace(/\|/g, "\\|");
}

function generatePropsTable(docs) {
  const props = docs.props
    // Skip children prop (implicit for hasChildren components)
    .filter((p) => p.name !== "children")
    // Sort: required first, then alphabetical
    .sort((a, b) => {
      if (a.required !== b.required) return a.required ? -1 : 1;
      return a.name.localeCompare(b.name);
    });

  if (props.length === 0) return "No props.\n";

  const rows = props.map((p) => {
    const type = escapeCell(formatType(p));
    const def = formatDefault(p);
    const desc = p.description || "—";
    return `| \`${p.name}\` | \`${type}\` | ${def} | ${desc} |`;
  });

  return [
    "| Prop | Type | Default | Description |",
    "|------|------|---------|-------------|",
    ...rows,
  ].join("\n") + "\n";
}

function generateScaffold(docs) {
  const table = generatePropsTable(docs);
  return `# ${docs.name}

> ${docs.description || "TODO: Add description"}

## Quick Reference

\`\`\`tsx
import { ${docs.name} } from "${docs.package}";

<${docs.name} />
\`\`\`

## Props

${table}
## See Also

- TODO: Add related components
`;
}

function replacePropsSection(content, newTable) {
  // Match "## Props" or "## ComponentName Props" section
  const propsRegex = /^## (?:\w+ )?Props\n[\s\S]*?(?=\n## |\n$)/m;
  const match = content.match(propsRegex);

  if (match) {
    const sectionHeader = match[0].match(/^## .*Props/m)[0];
    const replacement = `${sectionHeader}\n\n${newTable}`;
    return content.replace(propsRegex, replacement.trimEnd());
  }

  // No Props section found — append before "## See Also" or at end
  const seeAlsoIdx = content.indexOf("\n## See Also");
  if (seeAlsoIdx !== -1) {
    return (
      content.slice(0, seeAlsoIdx) +
      `\n## Props\n\n${newTable}\n` +
      content.slice(seeAlsoIdx)
    );
  }

  return content.trimEnd() + `\n\n## Props\n\n${newTable}`;
}

function updateTitleAndDescription(content, docs) {
  let result = content;

  // Update title line (line 1)
  const titleRegex = /^# .+$/m;
  result = result.replace(titleRegex, `# ${docs.name}`);

  // Update description line (blockquote after title)
  if (docs.description) {
    const descRegex = /^# .+\n\n> .+$/m;
    const descMatch = result.match(descRegex);
    if (descMatch) {
      const titleLine = descMatch[0].split("\n")[0];
      result = result.replace(
        descRegex,
        `${titleLine}\n\n> ${docs.description}`
      );
    }
  }

  return result;
}

// --- Main ---

const stats = { updated: 0, created: 0, unchanged: 0, skipped: 0 };

for (const [name, entry] of Object.entries(registry)) {
  const dir = getComponentDir(entry);

  if (!fs.existsSync(dir)) {
    console.log(`SKIP  ${name} — directory not found: ${path.relative(ROOT, dir)}`);
    stats.skipped++;
    continue;
  }

  const readmePath = path.join(dir, "README.md");
  const docs = generateComponentDocs(entry);
  const table = generatePropsTable(docs);
  let newContent;

  if (fs.existsSync(readmePath)) {
    const existing = fs.readFileSync(readmePath, "utf-8");
    let modified = replacePropsSection(existing, table);
    modified = updateTitleAndDescription(modified, docs);

    if (modified === existing) {
      console.log(`OK    ${name} — unchanged`);
      stats.unchanged++;
      continue;
    }
    newContent = modified;
    console.log(`WRITE ${name} — updated props section`);
    stats.updated++;
  } else {
    newContent = generateScaffold(docs);
    console.log(`WRITE ${name} — created scaffold`);
    stats.created++;
  }

  fs.writeFileSync(readmePath, newContent, "utf-8");
}

console.log(
  `\nDone: ${stats.updated} updated, ${stats.created} created, ${stats.unchanged} unchanged, ${stats.skipped} skipped`
);
