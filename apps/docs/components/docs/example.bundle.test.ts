/** @vitest-environment node */
import fs from "node:fs";
import path from "node:path";

import { describe, expect, it } from "vitest";

// Reads the output of `pnpm run build --filter=docs`, so it checks the real
// client bundle; without a build there is nothing to read and it skips.
const NEXT_DIR = path.resolve(import.meta.dirname, "../../.next");
const PAGES_DIR = path.join(NEXT_DIR, "server/app");
const built = fs.existsSync(PAGES_DIR);

// One example page from each area the docs are spot-checked on.
const PAGES = [
  "buttons/button",
  "forms/input",
  "overlays/popover",
  "typography/text",
];

// Shiki's own error class, defined in its core, so it is in any chunk that
// carries the highlighter and in no chunk that only names Shiki's CSS classes.
const SHIKI_MARKER = "ShikiError";

const pageChunks = (page: string) => {
  const html = fs.readFileSync(path.join(PAGES_DIR, `${page}.html`), "utf-8");
  // Script tags and the inline RSC payload both name the page's chunks.
  const srcs = html.match(/static\/chunks\/[^"\\]+\.js/g) ?? [];
  return [...new Set(srcs)].map((src) => path.join(NEXT_DIR, src));
};

describe.skipIf(!built)("docs client bundle", () => {
  it.each(PAGES)("loads no Shiki chunk on %s", (page) => {
    const chunks = pageChunks(page);
    expect(chunks.length).toBeGreaterThan(0);

    const withShiki = chunks.filter((chunk) =>
      fs.readFileSync(chunk, "utf-8").includes(SHIKI_MARKER),
    );
    expect(withShiki).toEqual([]);
  });

  it("renders its examples through CodePreview", () => {
    const html = fs.readFileSync(
      path.join(PAGES_DIR, "buttons/button.html"),
      "utf-8",
    );
    expect(html).toContain('data-slot="code-preview"');
  });
});

if (!built) {
  console.info(
    "Skipping the docs bundle check: no docs build at apps/docs/.next. Run `pnpm run build --filter=docs` first.",
  );
}
