// @vitest-environment node
import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  readdirSync,
  readFileSync,
  rmSync,
  symlinkSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";

import { afterAll, describe, expect, it } from "vitest";

import { APP_SHELL_FILES } from "./paths.ts";
import {
  checkRecipe,
  checkRelativePath,
  compareRecipe,
  copyFiles,
  extraDirectoryOf,
  findDisallowedImports,
  importSpecifiers,
  isAllowedImport,
  ownedDirectories,
  resolveInside,
  runCheck,
  runSync,
  syncRecipe,
} from "./recipes.ts";

// Almost every test builds its own recipe and destination in a new directory
// under the OS temp directory. One test reads this package's own app shell
// recipe, at the path the commands use, without writing to it. Nothing here
// reads or writes the docs app.
const dirs: string[] = [];
const tempDir = () => {
  const dir = mkdtempSync(join(tmpdir(), "uiid-recipes-"));
  dirs.push(dir);
  return dir;
};
const write = (root: string, files: Record<string, string>) => {
  for (const [name, source] of Object.entries(files)) {
    mkdirSync(dirname(join(root, name)), { recursive: true });
    writeFileSync(join(root, name), source);
  }
};

afterAll(() => {
  for (const dir of dirs) rmSync(dir, { recursive: true, force: true });
});

const RECIPE = {
  "components/shell/shell.tsx": "export const Shell = 1;\n",
  "components/shell/subcomponents/shell-root.tsx": "export const Root = 1;\n",
  "components/sidebar/sidebar.tsx": "export const Sidebar = 1;\n",
  "lib/nav.ts": "export type Nav = string;\n",
};

// The docs app beside the recipe: sibling directories, including ones whose
// names start with an owned directory's name, and files at the app root. None
// of them belongs to the recipe.
const APP = {
  "components/docs/header-links.tsx": "export const Links = 1;\n",
  "components/sidebar-old/x.tsx": "old sidebar\n",
  "lib-old/x.ts": "old lib\n",
  "nav.ts": "export const NAV = [];\n",
  "nav.test.ts": "// the app's own config test\n",
};

const setup = (dest: Record<string, string> = { ...RECIPE, ...APP }) => {
  const files = tempDir();
  const app = tempDir();
  write(files, RECIPE);
  write(app, dest);
  return { files, app };
};

const clean = { changed: [], missing: [], extra: [], extraDirectories: [] };
const quiet = { log: () => {} };

describe("ownedDirectories", () => {
  it("owns the topmost directories that directly hold a file", () => {
    expect(ownedDirectories(Object.keys(RECIPE))).toEqual([
      "components/shell",
      "components/sidebar",
      "lib",
    ]);
  });

  it("never owns the root, even when a file sits there", () => {
    expect(ownedDirectories(["readme.md", "components/a/a.ts"])).toEqual([
      "components/a",
    ]);
  });
});

describe("compareRecipe", () => {
  it("passes identical trees", () => {
    const { files, app } = setup();
    expect(compareRecipe(files, app)).toEqual(clean);
  });

  it("names a changed file", () => {
    const { files, app } = setup();
    write(app, {
      "components/sidebar/sidebar.tsx": "export const Sidebar = 2;\n",
    });
    expect(compareRecipe(files, app)).toEqual({
      ...clean,
      changed: ["components/sidebar/sidebar.tsx"],
    });
  });

  it("names a missing file", () => {
    const { files, app } = setup();
    rmSync(join(app, "components/shell/subcomponents/shell-root.tsx"));
    expect(compareRecipe(files, app)).toEqual({
      ...clean,
      missing: ["components/shell/subcomponents/shell-root.tsx"],
    });
  });

  it("names an extra file in a directory the recipe has", () => {
    const { files, app } = setup();
    write(app, {
      "lib/nav.test.ts": "// not in the recipe\n",
      "components/shell/subcomponents/shell-old.tsx": "\n",
    });
    expect(compareRecipe(files, app)).toEqual({
      ...clean,
      extra: [
        "components/shell/subcomponents/shell-old.tsx",
        "lib/nav.test.ts",
      ],
    });
  });

  it("names a directory the recipe does not have, not the files in it", () => {
    const { files, app } = setup();
    write(app, {
      "components/shell/subcomponents/old/a.tsx": "\n",
      "components/shell/subcomponents/old/deeper/b.tsx": "\n",
    });
    expect(compareRecipe(files, app)).toEqual({
      ...clean,
      extraDirectories: ["components/shell/subcomponents/old"],
    });
  });

  it("reports nothing outside the owned directories", () => {
    const { files, app } = setup();
    write(app, {
      "components/docs/new.tsx": "\n",
      "components/loose.tsx": "\n",
      "app/layout.tsx": "\n",
    });
    expect(compareRecipe(files, app)).toEqual(clean);
  });

  it("covers a directory added to the recipe without any other change", () => {
    const { files, app } = setup();
    write(files, {
      "components/footer/footer.tsx": "export const Footer = 1;\n",
    });
    expect(compareRecipe(files, app).missing).toEqual([
      "components/footer/footer.tsx",
    ]);
  });

  it("compares a file at the recipe root on its own, without owning the root", () => {
    const { files, app } = setup();
    write(files, { "recipe-root.ts": "export {};\n" });
    expect(compareRecipe(files, app)).toEqual({
      ...clean,
      missing: ["recipe-root.ts"],
    });
  });

  it("reports a symlink in the destination as changed instead of following it", () => {
    const { files, app } = setup();
    const outside = tempDir();
    write(outside, { "sidebar.tsx": RECIPE["components/sidebar/sidebar.tsx"] });
    rmSync(join(app, "components/sidebar/sidebar.tsx"));
    symlinkSync(
      join(outside, "sidebar.tsx"),
      join(app, "components/sidebar/sidebar.tsx"),
    );
    expect(compareRecipe(files, app).changed).toEqual([
      "components/sidebar/sidebar.tsx",
    ]);
  });

  // This and the case-only rename test under syncRecipe only discriminate on a
  // case-insensitive file system, such as macOS's default. On Linux `Nav.ts`
  // and `nav.ts` are separate files, so a plain lstat would pass them too.
  it("counts a file as present only under its exact name", () => {
    const { files, app } = setup();
    rmSync(join(files, "lib/nav.ts"));
    write(files, { "lib/Nav.ts": RECIPE["lib/nav.ts"] });
    expect(compareRecipe(files, app)).toEqual({
      ...clean,
      missing: ["lib/Nav.ts"],
      extra: ["lib/nav.ts"],
    });
  });

  it("refuses a symlinked directory inside an owned directory", () => {
    const { files, app } = setup();
    const outside = tempDir();
    write(outside, { "shell-root.tsx": "outside\n" });
    rmSync(join(app, "components/shell/subcomponents"), { recursive: true });
    symlinkSync(outside, join(app, "components/shell/subcomponents"));
    expect(() => compareRecipe(files, app)).toThrow(/symlink/);
  });

  it("refuses a recipe file that is a symlink", () => {
    const { files, app } = setup();
    const outside = tempDir();
    write(outside, { "a.ts": "outside\n" });
    symlinkSync(join(outside, "a.ts"), join(files, "lib/linked.ts"));
    expect(() => compareRecipe(files, app)).toThrow(/regular files/);
  });

  it("refuses a recipe directory that is a symlink, with or without a trailing slash", () => {
    const { files, app } = setup();
    const link = join(tempDir(), "files");
    symlinkSync(files, link);
    expect(() => compareRecipe(link, app)).toThrow(/symlink/);
    expect(() => compareRecipe(`${link}/`, app)).toThrow(/symlink/);
  });
});

describe("names that start with a dot", () => {
  it("are never part of the recipe", () => {
    const { files, app } = setup();
    write(files, {
      "components/.DS_Store": "finder\n",
      "lib/.hidden/a.ts": "\n",
      ".env": "\n",
    });
    expect(compareRecipe(files, app)).toEqual(clean);
    expect(syncRecipe(files, app)).toEqual({ written: [], removed: [] });
    expect(existsSync(join(app, "components/.DS_Store"))).toBe(false);
    expect(existsSync(join(app, ".env"))).toBe(false);
  });

  it("are never part of the docs copy, so they are not reported or deleted", () => {
    const { files, app } = setup();
    write(app, {
      "lib/.DS_Store": "finder\n",
      "components/shell/.cache/a.tsx": "\n",
    });
    write(app, { "components/sidebar/sidebar.tsx": "changed\n" });
    expect(compareRecipe(files, app)).toEqual({
      ...clean,
      changed: ["components/sidebar/sidebar.tsx"],
    });
    syncRecipe(files, app);
    expect(existsSync(join(app, "lib/.DS_Store"))).toBe(true);
    expect(existsSync(join(app, "components/shell/.cache/a.tsx"))).toBe(true);
  });
});

describe("a stray file in a directory the recipe passes through", () => {
  // The recipe gains a file directly in `components/`, so it owns all of
  // `components/`, and the docs app's own `components/docs/` sits inside it.
  const stray = (name: string) => {
    const files = tempDir();
    const app = tempDir();
    write(files, {
      "components/sidebar/s.tsx": "export const S = 1;\n",
      "lib/nav.ts": "export {};\n",
      [`components/${name}`]: "stray\n",
    });
    write(app, { "components/docs/keep.tsx": "keep\n" });
    return { files, app };
  };

  it("fails the check naming components/docs", () => {
    const { files, app } = stray("notes.txt");
    const lines: string[] = [];
    expect(
      runCheck(files, app, {
        labels: { files: "files", dest: "apps/docs" },
        log: (line) => lines.push(line),
      }),
    ).toBe(1);
    expect(lines.join("\n")).toContain(
      `extra    "apps/docs/components/docs/", a directory the recipe does not have`,
    );
  });

  it("refuses to sync and changes nothing", () => {
    const { files, app } = stray("notes.txt");
    expect(() => syncRecipe(files, app)).toThrow(/components\/docs/);
    expect(readFileSync(join(app, "components/docs/keep.tsx"), "utf8")).toBe(
      "keep\n",
    );
    expect(readdirSync(app)).toEqual(["components"]);
    expect(readdirSync(join(app, "components"))).toEqual(["docs"]);
  });

  it("leaves components/docs alone when the stray file's name starts with a dot", () => {
    const { files, app } = stray(".DS_Store");
    expect(syncRecipe(files, app)).toEqual({
      written: ["components/sidebar/s.tsx", "lib/nav.ts"],
      removed: [],
    });
    expect(readFileSync(join(app, "components/docs/keep.tsx"), "utf8")).toBe(
      "keep\n",
    );
  });
});

describe("syncRecipe", () => {
  it("makes a changed, missing and extra file pass the check", () => {
    const { files, app } = setup();
    write(app, {
      "components/sidebar/sidebar.tsx": "changed\n",
      "components/shell/subcomponents/shell-old.tsx": "\n",
    });
    rmSync(join(app, "lib/nav.ts"));

    expect(syncRecipe(files, app)).toEqual({
      written: ["components/sidebar/sidebar.tsx", "lib/nav.ts"],
      removed: ["components/shell/subcomponents/shell-old.tsx"],
    });
    expect(compareRecipe(files, app)).toEqual(clean);
  });

  it("copies into a destination that has none of the recipe yet", () => {
    const { files, app } = setup(APP);
    syncRecipe(files, app);
    expect(compareRecipe(files, app)).toEqual(clean);
  });

  it("writes nothing when the trees already match", () => {
    const { files, app } = setup();
    expect(syncRecipe(files, app)).toEqual({ written: [], removed: [] });
  });

  it("leaves sibling directories and app root files alone while it fixes a drifted copy", () => {
    const { files, app } = setup();
    write(app, {
      "components/loose.tsx": "loose\n",
      "components/sidebar/sidebar.tsx": "changed\n",
      "components/shell/subcomponents/shell-old.tsx": "\n",
      "lib/extra.ts": "\n",
    });
    rmSync(join(app, "components/shell/shell.tsx"));

    const result = syncRecipe(files, app);
    expect(result.written).toHaveLength(2);
    expect(result.removed).toHaveLength(2);
    expect(compareRecipe(files, app)).toEqual(clean);
    for (const [name, source] of Object.entries(APP)) {
      expect(readFileSync(join(app, name), "utf8")).toBe(source);
    }
    expect(readFileSync(join(app, "components/loose.tsx"), "utf8")).toBe(
      "loose\n",
    );
  });

  it("refuses while the copy has a directory the recipe does not have, and changes nothing", () => {
    const { files, app } = setup();
    write(app, {
      "components/shell/subcomponents/old/a.tsx": "\n",
      "components/sidebar/sidebar.tsx": "changed\n",
    });
    expect(() => syncRecipe(files, app)).toThrow(
      /components\/shell\/subcomponents\/old/,
    );
    expect(
      readFileSync(join(app, "components/sidebar/sidebar.tsx"), "utf8"),
    ).toBe("changed\n");
    expect(
      existsSync(join(app, "components/shell/subcomponents/old/a.tsx")),
    ).toBe(true);
  });

  it("removes before it writes, so a case-only rename keeps the file", () => {
    const { files, app } = setup();
    rmSync(join(files, "lib/nav.ts"));
    write(files, { "lib/Nav.ts": RECIPE["lib/nav.ts"] });
    expect(syncRecipe(files, app)).toEqual({
      written: ["lib/Nav.ts"],
      removed: ["lib/nav.ts"],
    });
    expect(readdirSync(join(app, "lib"))).toEqual(["Nav.ts"]);
    expect(compareRecipe(files, app)).toEqual(clean);
  });

  it("refuses an owned directory that is a symlink, and writes nothing through it", () => {
    const { files, app } = setup();
    const outside = tempDir();
    rmSync(join(app, "components/sidebar"), { recursive: true });
    symlinkSync(outside, join(app, "components/sidebar"));
    expect(() => syncRecipe(files, app)).toThrow(/symlink/);
    expect(existsSync(join(outside, "sidebar.tsx"))).toBe(false);
  });

  it("checks every target before it changes anything", () => {
    const { files, app } = setup();
    const outside = tempDir();
    write(outside, { "target.tsx": "outside\n" });
    // Sorts before the symlinked file, so a sync that checked as it went would
    // write it first.
    rmSync(join(app, "components/shell/shell.tsx"));
    // Removals run first, so this would go if they ran before the checks.
    write(app, { "lib/extra.ts": "extra\n" });
    rmSync(join(app, "components/sidebar/sidebar.tsx"));
    symlinkSync(
      join(outside, "target.tsx"),
      join(app, "components/sidebar/sidebar.tsx"),
    );
    expect(() => syncRecipe(files, app)).toThrow(/symlink/);
    expect(readFileSync(join(outside, "target.tsx"), "utf8")).toBe("outside\n");
    expect(existsSync(join(app, "components/shell/shell.tsx"))).toBe(false);
    expect(readFileSync(join(app, "lib/extra.ts"), "utf8")).toBe("extra\n");
  });

  it("refuses a destination root that is a symlink", () => {
    const { files, app } = setup();
    const link = join(tempDir(), "app");
    symlinkSync(app, link);
    expect(() => syncRecipe(files, link)).toThrow(/symlink/);
  });
});

describe("resolveInside", () => {
  it("resolves a relative path under the root", () => {
    expect(resolveInside("/root", "components/a/a.ts")).toBe(
      "/root/components/a/a.ts",
    );
  });

  it.each([
    "../outside.ts",
    "components/../../outside.ts",
    "components/../..",
    "/etc/passwd",
    "/root/components/a.ts",
    "",
  ])("refuses %j, which is not a relative path inside the root", (path) => {
    expect(() => resolveInside("/root", path)).toThrow(/outside/);
  });
});

describe("checkRelativePath", () => {
  it.each(["nav.ts", "components/a/a.ts", "app/x.module.css"])(
    "accepts %j",
    (path) => {
      expect(() => checkRelativePath(path)).not.toThrow();
    },
  );

  it.each([
    "",
    "/abs.ts",
    "a//b.ts",
    "a/",
    "./a.ts",
    "a/./b.ts",
    "../a.ts",
    "a/../b.ts",
    "a\\b.ts",
    "C:/a.ts",
    "c:a.ts",
    "a\0b.ts",
  ])("refuses %j", (path) => {
    expect(() => checkRelativePath(path)).toThrow(/is not a plain relative/);
  });
});

describe("copyFiles", () => {
  it("creates each target and its directories", () => {
    const from = tempDir();
    const to = tempDir();
    write(from, { "a.ts": "a\n" });
    copyFiles([[join(from, "a.ts"), join(to, "x/y/a.ts")]]);
    expect(readFileSync(join(to, "x/y/a.ts"), "utf8")).toBe("a\n");
  });

  it("refuses to replace an existing file when exclusive", () => {
    const from = tempDir();
    const to = tempDir();
    write(from, { "a.ts": "new\n" });
    write(to, { "a.ts": "old\n" });
    expect(() =>
      copyFiles([[join(from, "a.ts"), join(to, "a.ts")]], { exclusive: true }),
    ).toThrow(/EEXIST/);
    expect(readFileSync(join(to, "a.ts"), "utf8")).toBe("old\n");
  });
});

describe("importSpecifiers", () => {
  it("finds static, side-effect, re-export, dynamic and require imports", () => {
    const source = [
      `import a from "a";`,
      `import type { B } from 'b';`,
      `import {\n  c,\n} from "c";`,
      `import "d.css";`,
      `export { e } from "e";`,
      `export * from "f";`,
      `const g = () => import("g");`,
      "const h = import(`h`);",
      `const i = require("i");`,
      `const j = import ( "j" );`,
    ].join("\n");
    expect(importSpecifiers(source)).toEqual([
      "a",
      "b",
      "c",
      "d.css",
      "e",
      "f",
      "g",
      "h",
      "i",
      "j",
    ]);
  });

  it("reports an import() or require() whose argument is not a string literal", () => {
    const source = [
      `const a = import(name);`,
      `const b = require( name );`,
      "const c = import(`./${x}`);",
    ].join("\n");
    const found = importSpecifiers(source);
    expect(found).toHaveLength(3);
    for (const specifier of found) {
      expect(isAllowedImport(specifier, "lib/nav.ts", ["lib"])).toBe(false);
    }
  });

  it("reports an import() or require() whose argument is a concatenation", () => {
    const source = [
      `const a = import("./" + name);`,
      `const b = require("react" + x);`,
      `const c = import(\n  "./a" + b\n);`,
    ].join("\n");
    const found = importSpecifiers(source);
    expect(found).toHaveLength(3);
    for (const specifier of found) {
      expect(isAllowedImport(specifier, "lib/nav.ts", ["lib"])).toBe(false);
    }
  });

  it("finishes quickly on a long run of whitespace", () => {
    const source = `import x from${" ".repeat(100_000)};`;
    const start = performance.now();
    expect(importSpecifiers(source)).toEqual([]);
    expect(performance.now() - start).toBeLessThan(500);
  });
});

describe("isAllowedImport", () => {
  const recipeDirectories = ["components/shell", "components/sidebar", "lib"];
  const allowed = (
    specifier: string,
    file = "components/sidebar/sidebar.tsx",
  ) => isAllowedImport(specifier, file, recipeDirectories);

  it.each([
    "react",
    "react/jsx-runtime",
    "next/link",
    "next/navigation",
    "jotai",
    "jotai/vanilla",
    "jotai/vanilla/utils",
    "@uiid/design-system",
    "@uiid/design-system/utils",
    "@uiid/icons/panel-left",
    "@/nav",
    "@/lib/nav",
    "@/components/shell",
    "@/components/shell/subcomponents",
    "./sidebar.types",
    "./subcomponents",
  ])("allows %j", (specifier) => {
    expect(allowed(specifier)).toBe(true);
  });

  it("allows a relative import that stays inside the file's own directory", () => {
    expect(
      allowed(
        "../sidebar.types",
        "components/sidebar/subcomponents/sidebar-item.tsx",
      ),
    ).toBe(true);
  });

  it.each([
    "react-dom",
    "next",
    "@uiid/icons",
    "@uiid/buttons",
    "lucide-react",
    "vitest",
    "@/components/docs",
    "@/components",
    "@/sitemap",
    "@/lib/other",
    "../shell/shell.types",
    "../../lib/nav",
    "@/components/sidebar/../docs/x",
    "@/components/sidebar/./x",
    "@uiid/design-system/../../x",
    "react/../fs",
  ])("refuses %j", (specifier) => {
    expect(allowed(specifier)).toBe(false);
  });
});

describe("checkRecipe", () => {
  it("passes a matching copy with allowed imports", () => {
    const { files, app } = setup();
    expect(checkRecipe(files, app)).toEqual([]);
  });

  it("names every problem by its quoted path in the destination or the recipe", () => {
    const { files, app } = setup();
    write(files, { "components/shell/shell.tsx": `import "@/sitemap";\n` });
    write(app, {
      "components/shell/shell.tsx": `import "@/sitemap";\n`,
      "components/shell/old/a.tsx": "\n",
      "lib/extra.ts": "\n",
      "lib/bad\nname.ts": "\n",
    });
    rmSync(join(app, "lib/nav.ts"));
    write(app, { "components/sidebar/sidebar.tsx": "changed\n" });
    expect(
      checkRecipe(files, app, {
        labels: { files: "recipe/files", dest: "apps/docs" },
      }),
    ).toEqual([
      `changed  "apps/docs/components/sidebar/sidebar.tsx"`,
      `missing  "apps/docs/lib/nav.ts"`,
      `extra    "apps/docs/lib/bad\\nname.ts"`,
      `extra    "apps/docs/lib/extra.ts"`,
      `extra    "apps/docs/components/shell/old/", a directory the recipe does not have`,
      `import   "recipe/files/components/shell/shell.tsx" imports "@/sitemap", which a recipe file may not import`,
    ]);
  });
});

describe("runCheck and runSync", () => {
  it.each([
    ["missing", () => join(tempDir(), "files")],
    ["empty", () => tempDir()],
    [
      "holding only dotfiles",
      () => {
        const dir = tempDir();
        write(dir, { ".DS_Store": "\n" });
        return dir;
      },
    ],
  ])("both return 1 when the recipe is %s", (_, makeFiles) => {
    const files = makeFiles();
    const app = tempDir();
    const lines: string[] = [];
    const log = (line: string) => lines.push(line);
    expect(runCheck(files, app, { log })).toBe(1);
    expect(runSync(files, app, { log })).toBe(1);
    expect(lines.join("\n")).toMatch(/holds no files/);
  });

  it("runCheck returns 1 when the comparison throws", () => {
    const { files, app } = setup();
    const outside = tempDir();
    rmSync(join(app, "components/sidebar"), { recursive: true });
    symlinkSync(outside, join(app, "components/sidebar"));
    const lines: string[] = [];
    expect(runCheck(files, app, { log: (line) => lines.push(line) })).toBe(1);
    expect(lines.join("\n")).toMatch(/symlink/);
  });

  it("runCheck returns 0 for a matching copy and 1 when it differs", () => {
    const { files, app } = setup();
    expect(runCheck(files, app, quiet)).toBe(0);
    write(app, { "components/sidebar/sidebar.tsx": "changed\n" });
    expect(runCheck(files, app, quiet)).toBe(1);
  });

  it("runCheck returns 1 for a disallowed import alone", () => {
    const { files, app } = setup();
    write(files, { "lib/nav.ts": `import "fs";\n` });
    write(app, { "lib/nav.ts": `import "fs";\n` });
    expect(runCheck(files, app, quiet)).toBe(1);
  });

  it("runSync returns 0 when it syncs and 1 when it refuses", () => {
    const { files, app } = setup();
    write(app, { "components/sidebar/sidebar.tsx": "changed\n" });
    expect(runSync(files, app, quiet)).toBe(0);
    write(app, { "components/sidebar/old/a.tsx": "\n" });
    const lines: string[] = [];
    expect(runSync(files, app, { log: (line) => lines.push(line) })).toBe(1);
    expect(lines.join("\n")).toContain("components/sidebar/old");
  });
});

describe("findDisallowedImports", () => {
  it("names each script file and the import it may not make, and skips CSS", () => {
    const files = tempDir();
    write(files, {
      ...RECIPE,
      "components/sidebar/sidebar.tsx": [
        `import { NAV } from "@/nav";`,
        `import { Links } from "@/components/docs";`,
        `import { Box } from "@uiid/design-system";`,
      ].join("\n"),
      "components/shell/shell.tsx": `import type { Nav } from "../../lib/nav";\n`,
      "components/shell/shell.module.css": `@import "@/components/docs/docs.css";\n`,
    });
    expect(findDisallowedImports(files)).toEqual([
      { file: "components/shell/shell.tsx", specifier: "../../lib/nav" },
      {
        file: "components/sidebar/sidebar.tsx",
        specifier: "@/components/docs",
      },
    ]);
  });

  // Reads the path the commands use, so a wrong constant in paths.ts fails
  // here: an empty or missing recipe throws.
  it("finds nothing to refuse in the app shell recipe", () => {
    expect(findDisallowedImports(APP_SHELL_FILES)).toEqual([]);
  });
});

describe("extraDirectoryOf", () => {
  const dirs = new Set(["lib", "components/shell", "components/shell/sub"]);

  it("returns the topmost directory on the way that the recipe lacks", () => {
    expect(
      extraDirectoryOf(
        "components/shell/old/deeper/a.tsx",
        "components/shell",
        dirs,
      ),
    ).toBe("components/shell/old");
    expect(
      extraDirectoryOf("components/shell/sub/a.tsx", "components/shell", dirs),
    ).toBeUndefined();
  });

  it.each(["a.ts", "lib/a.ts", "components/shell"])(
    "throws for %j, which is not inside the owned directory, instead of looping",
    (path) => {
      expect(() => extraDirectoryOf(path, "components/shell", dirs)).toThrow(
        /not inside/,
      );
    },
  );
});
