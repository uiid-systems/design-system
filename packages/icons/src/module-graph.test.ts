// @vitest-environment node
// A build-graph test needs no DOM, and the node environment gives
// `import.meta.url` a real file: URL (happy-dom serves an http: one).
import { execFileSync } from "node:child_process";
import {
  existsSync,
  mkdirSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { fileURLToPath } from "node:url";

import { build } from "vite";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

// The whole lucide set is available, but a consumer's build cost must scale with
// the icons it *uses*, not the ~2,000 available.
//
// lucide-react's root module is a large file of ~1,750 `export … from
// "./icons/*.mjs"` lines plus a namespace re-export of icons/index.mjs, and it is
// the dominant cost — not the module count. Measured in balance, where this same
// bug was fixed first, reaching one icon took 70s through the root module and 10s
// through per-icon re-exports for the same module graph; a single subpath import
// costs nothing measurable.
//
// None of that shows up in the output: tree-shaking works either way and the
// emitted bundle is byte-identical. So these tests assert the module graph, not
// bundle size (shows nothing) or wall-clock time (flaky).

const PKG_DIR = fileURLToPath(new URL("..", import.meta.url));
// node_modules is already gitignored, so the fixture leaves no repo residue.
const FIXTURE_DIR = fileURLToPath(
  new URL("../node_modules/.icon-build-test/", import.meta.url),
);

type ModuleGraph = {
  total: number;
  lucideRoot: string[];
  lucideIconFiles: string[];
};

async function moduleGraphFor(source: string): Promise<ModuleGraph> {
  mkdirSync(FIXTURE_DIR, { recursive: true });
  const entry = `${FIXTURE_DIR}entry.ts`;
  writeFileSync(entry, source);

  const ids: string[] = [];
  await build({
    root: PKG_DIR,
    // Do not inherit the package's own vite.config.ts — it marks lucide-react
    // external, which is exactly what a consumer app build does not do.
    configFile: false,
    logLevel: "error",
    build: {
      write: false,
      minify: false,
      lib: { entry, formats: ["es"], fileName: "out" },
      rollupOptions: { external: ["react", "react-dom", "react/jsx-runtime"] },
    },
    plugins: [
      {
        name: "record-module-graph",
        moduleParsed(info) {
          ids.push(info.id);
        },
      },
    ],
  });

  return {
    total: ids.length,
    lucideRoot: ids.filter((id) => /lucide-react\.mjs$/.test(id)),
    lucideIconFiles: ids.filter((id) =>
      id.includes("/lucide-react/dist/esm/icons/"),
    ),
  };
}

const barrelSource = readFileSync(
  `${PKG_DIR}src/lucide-icons.generated.ts`,
  "utf8",
);
const barrelSpecifiers = [...barrelSource.matchAll(/from "([^"]+)"/g)].map(
  (match) => match[1],
);
const uniqueIconFiles = new Set(
  barrelSpecifiers.map((specifier) =>
    specifier
      .split("/")
      .pop()!
      .replace(/\.mjs$/, ""),
  ),
);

beforeAll(() => {
  // Make sure the per-icon modules exist without depending on build order.
  // --no-clean is essential: this is real build output that consumers and the
  // editor resolve against, so the tests must overwrite in place rather than
  // wipe and rewrite, which would leave a partial icon set if interrupted.
  execFileSync("node", ["scripts/emit-per-icon-modules.mjs", "--no-clean"], {
    cwd: PKG_DIR,
    stdio: "pipe",
  });
}, 120_000);

afterAll(() => {
  rmSync(FIXTURE_DIR, { recursive: true, force: true });
});

describe("@uiid/icons build cost", () => {
  it("importing one icon by subpath parses only that icon", async () => {
    const graph = await moduleGraphFor(
      `import { GlobeIcon } from "../../icons/globe.js";\nexport default GlobeIcon;\n`,
    );

    expect(graph.lucideRoot).toEqual([]);
    expect(graph.lucideIconFiles).toHaveLength(1);
  }, 120_000);

  it("the barrel reaches every icon without ever touching lucide's root module", async () => {
    const graph = await moduleGraphFor(
      `import { GlobeIcon } from "../../src/index";\nexport default GlobeIcon;\n`,
    );

    // The barrel is complete, so bundling it walks one module per icon. That is
    // the documented cost of the barrel, and why everything inside this repo
    // imports the subpath instead.
    //
    // Fewer modules than export names: aliases share a module, so the ~2,000
    // names resolve to ~1,768 files.
    expect(graph.lucideRoot).toEqual([]);
    expect(graph.lucideIconFiles).toHaveLength(uniqueIconFiles.size);
    expect(uniqueIconFiles.size).toBeGreaterThan(1700);
  }, 120_000);
});

describe("@uiid/icons surface", () => {
  it("exposes the full lucide icon set, with nothing gated behind a manual step", () => {
    expect(barrelSpecifiers.length).toBeGreaterThan(1900);
  });

  // Guards the built dist too: lucide-react is external, so these specifiers are
  // preserved verbatim into dist/index.js and resolved by the consumer.
  it("re-exports every icon from its own lucide module, never lucide's root", () => {
    for (const specifier of barrelSpecifiers) {
      expect(specifier).toMatch(
        /^lucide-react\/dist\/esm\/icons\/[a-z\d-]+\.mjs$/,
      );
    }
  });

  // Bare names (`Globe`) are deliberately not exposed: they collide with words
  // used elsewhere in the system — `Image` shadows the DOM global, `Code`
  // collides with @uiid/code.
  it("exposes every icon only under its canonical *Icon name", () => {
    const names = [...barrelSource.matchAll(/default as (\w+)/g)].map(
      (match) => match[1],
    );

    expect(names.length).toBe(barrelSpecifiers.length);
    expect(names.filter((name) => !name.endsWith("Icon"))).toEqual([]);
  });

  // File existence is not the contract — resolution through the exports map is.
  // A typo in the "./*" wildcard would leave the files in place and every import
  // broken, which this catches and a file-existence check does not.
  it("resolves the barrel and per-icon subpaths through the package exports map", () => {
    const iconSubpaths = [
      "@uiid/icons/globe",
      "@uiid/icons/external-link",
      "@uiid/icons/house",
    ];
    const specifiers = ["@uiid/icons", ...iconSubpaths];

    // Node self-reference: a package resolves its own name via its exports map.
    // Throws (failing the test) if any specifier is unresolvable.
    const stdout = execFileSync(
      "node",
      [
        "--input-type=module",
        "-e",
        `const out = [];
         for (const s of ${JSON.stringify(specifiers)}) out.push([s, await import.meta.resolve(s)]);
         console.log(JSON.stringify(out));`,
      ],
      { cwd: PKG_DIR, encoding: "utf8" },
    );
    const resolved: [string, string][] = JSON.parse(stdout);

    expect(resolved.map(([specifier]) => specifier)).toEqual(specifiers);
    for (const [specifier, url] of resolved) {
      if (iconSubpaths.includes(specifier)) {
        expect(url).toContain("/icons/");
        expect(existsSync(fileURLToPath(url))).toBe(true);
      }
    }
  }, 120_000);

  it("emits an importable subpath module for every icon in the barrel", () => {
    const missing = [...uniqueIconFiles].filter(
      (file) =>
        !existsSync(`${PKG_DIR}icons/${file}.js`) ||
        !existsSync(`${PKG_DIR}icons/${file}.d.ts`),
    );

    expect(missing).toEqual([]);
  });

  // Our own icons are reached the same way as lucide's, so consumers never need
  // to know which of the two authored a given icon.
  it("serves uiid's own icons from a subpath too", () => {
    expect(existsSync(`${PKG_DIR}icons/loading-spinner.js`)).toBe(true);
    expect(existsSync(`${PKG_DIR}icons/loading-spinner.d.ts`)).toBe(true);
  });
});
