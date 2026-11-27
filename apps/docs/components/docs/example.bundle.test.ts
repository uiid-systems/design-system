/** @vitest-environment node */
import fs from "node:fs";
import path from "node:path";

import { describe, expect, it } from "vitest";

// Reads the output of `pnpm run build --filter=docs`, so it checks the real
// client bundle; without a build there is nothing to read and it skips.
const NEXT_DIR = path.resolve(import.meta.dirname, "../../.next");
const PAGES_DIR = path.join(NEXT_DIR, "server/app");
const CHUNKS_DIR = path.join(NEXT_DIR, "static/chunks");
const built = fs.existsSync(PAGES_DIR);

// One example page from each area the docs are spot-checked on.
const PAGES = [
  "buttons/button",
  "forms/input",
  "overlays/popover",
  "typography/text",
];

// Shiki sets this string as its error's `name`, so it survives minification,
// which renames the class itself. It is in any chunk that carries Shiki's core
// and in no chunk that only names Shiki's CSS classes.
const SHIKI_MARKER = "ShikiError";

const readPage = (page: string) =>
  fs.readFileSync(path.join(PAGES_DIR, `${page}.html`), "utf-8");

const pageChunks = (page: string) => {
  // Script tags and the inline RSC payload both name the page's chunks.
  const srcs = readPage(page).match(/static\/chunks\/[^"\\]+\.js/g) ?? [];
  return [...new Set(srcs)].map((src) => path.join(NEXT_DIR, src));
};

const hasMarker = (file: string) =>
  fs.readFileSync(file, "utf-8").includes(SHIKI_MARKER);

describe.skipIf(!built)("docs client bundle", () => {
  it("finds Shiki by its marker in the build's chunks", () => {
    // The client highlighter is still built as a lazy chunk, so the marker
    // must turn up somewhere; if a Shiki upgrade renames it, this fails
    // instead of the page checks passing for the wrong reason.
    const chunks = fs
      .readdirSync(CHUNKS_DIR)
      .filter((file) => file.endsWith(".js"))
      .map((file) => path.join(CHUNKS_DIR, file));
    expect(chunks.some(hasMarker)).toBe(true);
  });

  it.each(PAGES)("loads no Shiki chunk on %s", (page) => {
    const chunks = pageChunks(page);
    expect(chunks.length).toBeGreaterThan(0);
    expect(chunks.filter(hasMarker)).toEqual([]);
  });

  it.each(PAGES)(
    "highlights every example's code on the server on %s",
    (page) => {
      // Without server `html`, CodePreview would load Shiki lazily on first
      // open and no eager chunk would change, so check the panels themselves.
      // Each segment runs from a panel to the next example frame or README
      // code block, so another block's highlighting cannot stand in for it.
      // The closing quote keeps the match exact: the panel's own copy header
      // (`code-block-header`, `code-block-content`) does not end a segment.
      const panels = readPage(page)
        .split('data-slot="code-preview-panel"')
        .slice(1)
        .map(
          (segment) => segment.split(/data-slot="(?:example|code-block)"/)[0],
        );
      expect(panels.length).toBeGreaterThan(0);
      expect(panels.filter((panel) => !panel.includes('class="shiki'))).toEqual(
        [],
      );
    },
  );

  it("keeps the example ids on buttons/button", () => {
    const ids = [
      ...readPage("buttons/button").matchAll(
        /<div[^>]*data-slot="example"[^>]*\sid="([^"]+)"/g,
      ),
    ].map((match) => match[1]);
    expect(ids).toEqual([
      "variants",
      "colors",
      "sizes",
      "shapes",
      "with-icon",
      "disabled",
      "disabled-with-a-reason",
      "loading",
      "fullwidth",
      "with-tooltip",
      "polymorphic",
    ]);
  });
});

if (!built) {
  console.info(
    "Skipping the docs bundle check: no docs build at apps/docs/.next. Run `pnpm run build --filter=docs` first.",
  );
}
