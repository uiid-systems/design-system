// @vitest-environment node
import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  symlinkSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { afterAll, describe, expect, it } from "vitest";

import {
  checkRecipe,
  compareRecipe,
  findDisallowedImports,
  importSpecifiers,
  isAllowedImport,
  ownedDirectories,
  resolveInside,
  syncRecipe,
} from "./recipes.ts";

// Every test builds its own recipe and destination under the OS temp
// directory. Nothing here reads or writes the real docs app.
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

// The docs app beside the recipe: a sibling component directory and a file at
// the app root, neither of which belongs to the recipe.
const APP = {
  "components/docs/header-links.tsx": "export const Links = 1;\n",
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

const clean = { changed: [], missing: [], extra: [] };

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

  it("names an extra file anywhere inside an owned directory", () => {
    const { files, app } = setup();
    write(app, {
      "lib/nav.test.ts": "// not in the recipe\n",
      "components/shell/subcomponents/old/shell-old.tsx": "\n",
    });
    expect(compareRecipe(files, app)).toEqual({
      ...clean,
      extra: [
        "components/shell/subcomponents/old/shell-old.tsx",
        "lib/nav.test.ts",
      ],
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
});

describe("syncRecipe", () => {
  it("makes a changed, missing and extra file pass the check", () => {
    const { files, app } = setup();
    write(app, {
      "components/sidebar/sidebar.tsx": "changed\n",
      "components/shell/subcomponents/old/shell-old.tsx": "\n",
    });
    rmSync(join(app, "lib/nav.ts"));

    expect(syncRecipe(files, app)).toEqual({
      written: ["components/sidebar/sidebar.tsx", "lib/nav.ts"],
      removed: ["components/shell/subcomponents/old/shell-old.tsx"],
    });
    expect(compareRecipe(files, app)).toEqual(clean);
    // The directory the extra file left empty goes too.
    expect(existsSync(join(app, "components/shell/subcomponents/old"))).toBe(
      false,
    );
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

  it("leaves sibling directories and app root files alone", () => {
    const { files, app } = setup();
    write(app, { "components/loose.tsx": "loose\n" });
    syncRecipe(files, app);
    for (const [name, source] of Object.entries(APP)) {
      expect(readFileSync(join(app, name), "utf8")).toBe(source);
    }
    expect(readFileSync(join(app, "components/loose.tsx"), "utf8")).toBe(
      "loose\n",
    );
  });

  it("refuses an owned directory that is a symlink, and writes nothing through it", () => {
    const { files, app } = setup();
    const outside = tempDir();
    rmSync(join(app, "components/sidebar"), { recursive: true });
    symlinkSync(outside, join(app, "components/sidebar"));
    expect(() => syncRecipe(files, app)).toThrow(/symlink/);
    expect(existsSync(join(outside, "sidebar.tsx"))).toBe(false);
  });

  it("refuses a file that is a symlink, and leaves its target unchanged", () => {
    const { files, app } = setup();
    const outside = tempDir();
    write(outside, { "target.tsx": "outside\n" });
    rmSync(join(app, "components/sidebar/sidebar.tsx"));
    symlinkSync(
      join(outside, "target.tsx"),
      join(app, "components/sidebar/sidebar.tsx"),
    );
    expect(() => syncRecipe(files, app)).toThrow(/symlink/);
    expect(readFileSync(join(outside, "target.tsx"), "utf8")).toBe("outside\n");
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

  it.each(["../outside.ts", "components/../../outside.ts", "/etc/passwd", ""])(
    "refuses %j, which does not stay inside the root",
    (path) => {
      expect(() => resolveInside("/root", path)).toThrow(/outside/);
    },
  );
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
    ]);
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
  ])("refuses %j", (specifier) => {
    expect(allowed(specifier)).toBe(false);
  });
});

describe("checkRecipe", () => {
  it("passes a matching copy with allowed imports", () => {
    const { files, app } = setup();
    expect(checkRecipe(files, app)).toEqual([]);
  });

  it("names every problem by its path in the destination or the recipe", () => {
    const { files, app } = setup();
    write(files, { "components/shell/shell.tsx": `import "@/sitemap";\n` });
    write(app, {
      "components/shell/shell.tsx": `import "@/sitemap";\n`,
      "lib/extra.ts": "\n",
    });
    rmSync(join(app, "lib/nav.ts"));
    write(app, { "components/sidebar/sidebar.tsx": "changed\n" });
    expect(
      checkRecipe(files, app, { files: "recipe/files", dest: "apps/docs" }),
    ).toEqual([
      "changed  apps/docs/components/sidebar/sidebar.tsx",
      "missing  apps/docs/lib/nav.ts",
      "extra    apps/docs/lib/extra.ts",
      `import   recipe/files/components/shell/shell.tsx imports "@/sitemap", which a recipe file may not import`,
    ]);
  });
});

describe("findDisallowedImports", () => {
  it("names each file and the import it may not make", () => {
    const files = tempDir();
    write(files, {
      ...RECIPE,
      "components/sidebar/sidebar.tsx": [
        `import { NAV } from "@/nav";`,
        `import { Links } from "@/components/docs";`,
        `import { Box } from "@uiid/design-system";`,
      ].join("\n"),
      "components/shell/shell.tsx": `import type { Nav } from "../../lib/nav";\n`,
      "components/shell/shell.module.css": `.a { color: red; }\n`,
    });
    expect(findDisallowedImports(files)).toEqual([
      { file: "components/shell/shell.tsx", specifier: "../../lib/nav" },
      {
        file: "components/sidebar/sidebar.tsx",
        specifier: "@/components/docs",
      },
    ]);
  });

  it("finds nothing to refuse in the app shell recipe", () => {
    const appShell = fileURLToPath(
      new URL("../app-shell/files/", import.meta.url),
    );
    expect(findDisallowedImports(appShell)).toEqual([]);
  });
});
