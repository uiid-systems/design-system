/**
 * Compares two `size-limit --json` reports and prints a markdown summary.
 *
 *   node packages/config/scripts/size-compare.mjs <base.json> <head.json> [--out <file>]
 *
 * Exits 1 when an entry grew by more than both thresholds below. Growth has to
 * clear both so a small package can gain a component without tripping the
 * check, and a large one is not failed by a rounding-sized change.
 *
 * Each change carries a dot: green for smaller, yellow for growth up to
 * MAX_GROWTH_PERCENT and red for growth past it. Red alone does not fail the
 * check; a failing entry is red and bold.
 */
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const MAX_GROWTH_PERCENT = 5;
const MAX_GROWTH_BYTES = 2000;

// size-limit reports decimal kilobytes, so match it.
const number = (bytes) => (bytes / 1000).toFixed(2);
const kB = (bytes) => `${number(bytes)} kB`;
const sign = (value) => (value > 0 ? "+" : "−");

// The entry names come from .size-limit.js.
const CSS_SUFFIX = " (css)";
const isImport = (name) => name.startsWith("import {");
const isCss = (name) => name.endsWith(CSS_SUFFIX);

const diff = (before, after) => {
  if (before === undefined && after === undefined) return null;
  if (before === undefined) return { after, status: "new" };
  if (after === undefined) return { before, status: "removed" };
  const delta = after - before;
  const percent =
    before === 0 ? (delta > 0 ? Infinity : 0) : (delta / before) * 100;
  const failed = delta > MAX_GROWTH_BYTES && percent > MAX_GROWTH_PERCENT;
  const status = failed ? "failed" : delta === 0 ? "same" : "changed";
  return { before, after, delta, percent, status };
};

// The two cells an entry fills: its size, then how it changed.
const cells = (entry) => {
  if (!entry) return ["", ""];
  if (entry.status === "new") return [kB(entry.after), "🆕 new"];
  if (entry.status === "removed") return [kB(entry.before), "🗑️ removed"];
  if (entry.status === "same") return [kB(entry.after), ""];
  const dot =
    entry.delta < 0 ? "🟢" : entry.percent > MAX_GROWTH_PERCENT ? "🔴" : "🟡";
  const amount = `${sign(entry.delta)}${kB(Math.abs(entry.delta))}`;
  const change = Number.isFinite(entry.percent)
    ? `${amount} (${sign(entry.percent)}${Math.abs(entry.percent).toFixed(1)}%)`
    : amount;
  return [
    `${number(entry.before)} → ${kB(entry.after)}`,
    `${dot} ${entry.status === "failed" ? `**${change}**` : change}`,
  ];
};

const tableRow = (values) =>
  `|${values.map((value) => (value ? ` ${value} ` : " ")).join("|")}|`;

const table = (header, rows) =>
  rows.length === 0
    ? []
    : [
        tableRow(header),
        `|${header.map(() => "---").join("|")}|`,
        ...rows.map((row) =>
          tableRow([
            `\`${row.label}\``,
            ...row.entries.flatMap((entry) => cells(entry)),
          ]),
        ),
        "",
      ];

/**
 * Takes the parsed base and head reports and returns the comment markdown and
 * whether any entry grew past both thresholds.
 */
export const compare = (baseReport, headReport) => {
  const base = new Map(baseReport.map((entry) => [entry.name, entry.size]));
  const head = new Map(headReport.map((entry) => [entry.name, entry.size]));
  const names = [...new Set([...head.keys(), ...base.keys()])];
  const entry = (name) => diff(base.get(name), head.get(name));

  // A package's script and stylesheet share a row, so the table is half as
  // tall and uses the width of the comment.
  const packageNames = [
    ...new Set(
      names
        .filter((name) => !isImport(name))
        .map((name) =>
          isCss(name) ? name.slice(0, -CSS_SUFFIX.length) : name,
        ),
    ),
  ];
  const packages = packageNames.map((name) => ({
    label: name,
    entries: [entry(name), entry(`${name}${CSS_SUFFIX}`)],
  }));
  const components = names.filter(isImport).map((name) => ({
    label: name.replace(/^import \{ (.+) \}$/, "$1"),
    entries: [entry(name)],
  }));

  const sections = (keep) => [
    ...table(
      ["Package", "JS", "Change", "CSS", "Change"],
      packages.filter(keep),
    ),
    ...table(["Component", "Size", "Change"], components.filter(keep)),
  ];

  const all = [...packages, ...components].flatMap((row) =>
    row.entries.filter(Boolean),
  );
  const failed = all.filter((item) => item.status === "failed");
  const isChanged = (row) =>
    row.entries.some((item) => item && item.status !== "same");
  const changed = sections(isChanged);

  const out = ["### Size report", ""];
  if (failed.length > 0) {
    out.push(
      `**${failed.length} ${failed.length === 1 ? "entry" : "entries"} grew by more than ${MAX_GROWTH_PERCENT}% and ${kB(MAX_GROWTH_BYTES)}.** If the growth is intended, add the \`size-increase-ok\` label.`,
      "",
    );
  }
  if (changed.length > 0) out.push(...changed);
  else out.push("No size changes against the base branch.", "");
  out.push(
    `<details><summary>All ${all.length} entries</summary>`,
    "",
    ...sections(() => true),
    "</details>",
  );

  return { markdown: out.join("\n"), failed: failed.length > 0 };
};

const main = () => {
  const [basePath, headPath, ...rest] = process.argv.slice(2);
  if (!basePath || !headPath) {
    console.error(
      "Usage: node packages/config/scripts/size-compare.mjs <base.json> <head.json> [--out <file>]",
    );
    process.exit(2);
  }
  const outPath = rest[0] === "--out" ? rest[1] : null;

  // A report that cannot be read exits 2, so it is never mistaken for growth.
  const read = (path) => {
    try {
      const report = JSON.parse(readFileSync(path, "utf8"));
      if (!Array.isArray(report)) throw new Error("not a list of entries");
      return report;
    } catch (error) {
      console.error(`Cannot read size report ${path}: ${error.message}`);
      process.exit(2);
    }
  };

  const { markdown, failed } = compare(read(basePath), read(headPath));
  if (outPath) writeFileSync(outPath, `${markdown}\n`);
  console.log(markdown);
  process.exit(failed ? 1 : 0);
};

if (process.argv[1] === fileURLToPath(import.meta.url)) main();
