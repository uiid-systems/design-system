// @vitest-environment node
import { compare } from "./size-compare.mjs";

const entry = (name, size) => ({ name, size });

// The part of the comment above the collapsed list of every entry.
const summary = (markdown) => markdown.split("<details>")[0];
const rowFor = (markdown, label) =>
  summary(markdown)
    .split("\n")
    .find((line) => line.startsWith(`| \`${label}\``));

describe("size-compare", () => {
  it("marks an entry that shrank with a green dot", () => {
    const { markdown } = compare(
      [entry("@uiid/buttons", 6300)],
      [entry("@uiid/buttons", 6260)],
    );

    expect(rowFor(markdown, "@uiid/buttons")).toContain("🟢 −0.04 kB (−0.6%)");
  });

  it("marks growth of 5% or less with a yellow dot", () => {
    const { markdown } = compare(
      [entry("@uiid/buttons", 10000)],
      [entry("@uiid/buttons", 10500)],
    );

    expect(rowFor(markdown, "@uiid/buttons")).toContain("🟡 +0.50 kB (+5.0%)");
  });

  it("marks growth over 5% with a red dot, whatever its size in bytes", () => {
    const { markdown, failed } = compare(
      [entry("@uiid/interactive (css)", 550)],
      [entry("@uiid/interactive (css)", 630)],
    );

    expect(rowFor(markdown, "@uiid/interactive")).toContain(
      "🔴 +0.08 kB (+14.5%)",
    );
    expect(failed).toBe(false);
  });

  it("fails and bolds an entry that grew over both 5% and 2 kB", () => {
    const { markdown, failed } = compare(
      [entry("@uiid/forms", 20000)],
      [entry("@uiid/forms", 23000)],
    );

    expect(failed).toBe(true);
    expect(rowFor(markdown, "@uiid/forms")).toContain(
      "🔴 **+3.00 kB (+15.0%)**",
    );
    expect(markdown).toContain("`size-increase-ok`");
  });

  it("does not fail large growth in bytes that stays within 5%", () => {
    const { failed } = compare(
      [entry("@uiid/design-system", 200000)],
      [entry("@uiid/design-system", 205000)],
    );

    expect(failed).toBe(false);
  });

  it("puts a package's script and stylesheet on one row", () => {
    const { markdown } = compare(
      [
        entry("@uiid/interactive", 30130),
        entry("@uiid/interactive (css)", 550),
      ],
      [
        entry("@uiid/interactive", 30190),
        entry("@uiid/interactive (css)", 630),
      ],
    );

    expect(summary(markdown)).toContain(
      "| Package | JS | Change | CSS | Change |",
    );
    expect(rowFor(markdown, "@uiid/interactive")).toBe(
      "| `@uiid/interactive` | 30.13 → 30.19 kB | 🟡 +0.06 kB (+0.2%) | 0.55 → 0.63 kB | 🔴 +0.08 kB (+14.5%) |",
    );
  });

  it("shows the unchanged half of a changed package as a single size", () => {
    const { markdown } = compare(
      [entry("@uiid/cards", 9070), entry("@uiid/cards (css)", 880)],
      [entry("@uiid/cards", 9000), entry("@uiid/cards (css)", 880)],
    );

    expect(rowFor(markdown, "@uiid/cards")).toBe(
      "| `@uiid/cards` | 9.07 → 9.00 kB | 🟢 −0.07 kB (−0.8%) | 0.88 kB | |",
    );
  });

  it("leaves the stylesheet cells empty for a package without one", () => {
    const { markdown } = compare(
      [entry("@uiid/utils", 3230)],
      [entry("@uiid/utils", 3300)],
    );

    expect(rowFor(markdown, "@uiid/utils")).toBe(
      "| `@uiid/utils` | 3.23 → 3.30 kB | 🟡 +0.07 kB (+2.2%) | | |",
    );
  });

  it("lists single imports in their own table, named by component", () => {
    const { markdown } = compare(
      [entry("import { Button }", 36280)],
      [entry("import { Button }", 36310)],
    );

    expect(summary(markdown)).toContain("| Component | Size | Change |");
    expect(rowFor(markdown, "Button")).toBe(
      "| `Button` | 36.28 → 36.31 kB | 🟡 +0.03 kB (+0.1%) |",
    );
  });

  it("leaves unchanged entries out of the summary and keeps them in the full list", () => {
    const { markdown } = compare(
      [entry("@uiid/buttons", 6300), entry("@uiid/cards", 9070)],
      [entry("@uiid/buttons", 6260), entry("@uiid/cards", 9070)],
    );

    expect(summary(markdown)).not.toContain("@uiid/cards");
    expect(markdown).toContain("<details><summary>All 2 entries</summary>");
    expect(markdown.split("<details>")[1]).toContain(
      "| `@uiid/cards` | 9.07 kB | | | |",
    );
  });

  it("reports new and removed entries without failing", () => {
    const { markdown, failed } = compare(
      [entry("@uiid/old", 9000)],
      [entry("@uiid/new", 9000)],
    );

    expect(rowFor(markdown, "@uiid/new")).toBe(
      "| `@uiid/new` | 9.00 kB | 🆕 new | | |",
    );
    expect(rowFor(markdown, "@uiid/old")).toBe(
      "| `@uiid/old` | 9.00 kB | 🗑️ removed | | |",
    );
    expect(failed).toBe(false);
  });

  it("says so when nothing changed", () => {
    const { markdown } = compare(
      [entry("@uiid/buttons", 6300)],
      [entry("@uiid/buttons", 6300)],
    );

    expect(summary(markdown)).toContain(
      "No size changes against the base branch.",
    );
  });

  it("starts with the heading the workflow uses to find its comment", () => {
    const { markdown } = compare([], []);

    expect(markdown.startsWith("### Size report")).toBe(true);
  });
});
