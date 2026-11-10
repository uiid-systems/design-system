/**
 * Compares two `size-limit --json` reports and prints a markdown summary.
 *
 *   node scripts/size-compare.mjs <base.json> <head.json> [--out <file>]
 *
 * Exits 1 when an entry grew by more than both thresholds below. Growth has to
 * clear both so a small package can gain a component without tripping the
 * check, and a large one is not failed by a rounding-sized change.
 */
import { readFileSync, writeFileSync } from "node:fs";

const MAX_GROWTH_PERCENT = 5;
const MAX_GROWTH_BYTES = 2000;

const [basePath, headPath, ...rest] = process.argv.slice(2);
if (!basePath || !headPath) {
  console.error(
    "Usage: node scripts/size-compare.mjs <base.json> <head.json> [--out <file>]",
  );
  process.exit(2);
}
const outPath = rest[0] === "--out" ? rest[1] : null;

// A report that cannot be read exits 2, so it is never mistaken for growth.
const read = (path) => {
  try {
    return new Map(
      JSON.parse(readFileSync(path, "utf8")).map((entry) => [
        entry.name,
        entry.size,
      ]),
    );
  } catch (error) {
    console.error(`Cannot read size report ${path}: ${error.message}`);
    process.exit(2);
  }
};
const base = read(basePath);
const head = read(headPath);

// size-limit reports decimal kilobytes, so match it.
const kB = (bytes) => `${(bytes / 1000).toFixed(2)} kB`;
const signed = (bytes) => `${bytes > 0 ? "+" : "−"}${kB(Math.abs(bytes))}`;

const rows = [...new Set([...head.keys(), ...base.keys()])].map((name) => {
  const before = base.get(name);
  const after = head.get(name);
  if (before === undefined) return { name, after, status: "new" };
  if (after === undefined) return { name, before, status: "removed" };
  const delta = after - before;
  const percent =
    before === 0 ? (delta > 0 ? Infinity : 0) : (delta / before) * 100;
  const failed = delta > MAX_GROWTH_BYTES && percent > MAX_GROWTH_PERCENT;
  const status = failed ? "failed" : delta === 0 ? "same" : "changed";
  return { name, before, after, delta, percent, status };
});

// The report is split by what an entry measures, in the order a reader cares
// about. The entry names come from .size-limit.js.
const GROUPS = [
  {
    column: "Package",
    match: (name) => !name.startsWith("import {") && !name.endsWith(" (css)"),
    label: (name) => name,
  },
  {
    column: "Component",
    match: (name) => name.startsWith("import {"),
    label: (name) => name.replace(/^import \{ (.+) \}$/, "$1"),
  },
  {
    column: "Stylesheet",
    match: (name) => name.endsWith(" (css)"),
    label: (name) => name.replace(/ \(css\)$/, ""),
  },
];

const line = (row, label) => {
  const name = `\`${label(row.name)}\``;
  if (row.status === "new")
    return `| :new: | ${name} | — | ${kB(row.after)} | new |`;
  if (row.status === "removed")
    return `| :wastebasket: | ${name} | ${kB(row.before)} | — | removed |`;
  const icon =
    row.status === "failed"
      ? ":red_circle:"
      : row.delta > 0
        ? ":small_red_triangle:"
        : row.delta < 0
          ? ":small_red_triangle_down:"
          : "";
  const change =
    row.delta === 0
      ? "—"
      : Number.isFinite(row.percent)
        ? `${signed(row.delta)} (${row.percent > 0 ? "+" : "−"}${Math.abs(row.percent).toFixed(1)}%)`
        : signed(row.delta);
  return `| ${icon} | ${name} | ${kB(row.before)} | ${kB(row.after)} | ${change} |`;
};

// One table per group that has rows; empty groups are left out.
const sections = (list) =>
  GROUPS.flatMap((group) => {
    const members = list.filter((row) => group.match(row.name));
    if (members.length === 0) return [];
    return [
      `| | ${group.column} | Base | PR | Change |`,
      "|---|---|---|---|---|",
      ...members.map((row) => line(row, group.label)),
      "",
    ];
  });

const changed = rows.filter((row) => row.status !== "same");
const failed = rows.filter((row) => row.status === "failed");

const out = ["### Size report", ""];
if (failed.length > 0) {
  out.push(
    `**${failed.length} ${failed.length === 1 ? "entry" : "entries"} grew by more than ${MAX_GROWTH_PERCENT}% and ${kB(MAX_GROWTH_BYTES)}.** If the growth is intended, add the \`size-increase-ok\` label.`,
    "",
  );
}
if (changed.length > 0) out.push(...sections(changed));
else out.push("No size changes against the base branch.", "");
out.push(
  `<details><summary>All ${rows.length} entries</summary>`,
  "",
  ...sections(rows),
  "</details>",
);

const markdown = out.join("\n");
if (outPath) writeFileSync(outPath, `${markdown}\n`);
console.log(markdown);
process.exit(failed.length > 0 ? 1 : 0);
