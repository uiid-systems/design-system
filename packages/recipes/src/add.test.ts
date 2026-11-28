// @vitest-environment node
import {
  chmodSync,
  lstatSync,
  mkdirSync,
  mkdtempSync,
  readdirSync,
  readFileSync,
  readlinkSync,
  realpathSync,
  rmSync,
  symlinkSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";

import { afterAll, describe, expect, it } from "vitest";

import { LAYOUT_WIRING, parseJsonc, runCli, type Runner } from "./add.ts";
import { APP_SHELL_FILES, RECIPES_ROOT } from "./paths.ts";
import { compareRecipe } from "./recipes.ts";

// Every test builds its recipes, its app and, where it needs one, a fake
// repository in new directories under the OS temp directory. One group reads
// this package's own app shell recipe without writing to it. No test starts a
// package manager: the runner is always a stub that records its calls.
const dirs: string[] = [];
const tempDir = () => {
  const dir = realpathSync(mkdtempSync(join(tmpdir(), "uiid-add-")));
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

/** Every entry under `root`, dotfiles and symlinks included, with its contents. */
const snapshot = (root: string) => {
  const entries: Record<string, string> = {};
  const walk = (rel: string) => {
    for (const name of readdirSync(join(root, rel)).sort()) {
      const path = rel ? `${rel}/${name}` : name;
      const stat = lstatSync(join(root, path));
      if (stat.isSymbolicLink()) {
        entries[path] = `link:${readlinkSync(join(root, path))}`;
      } else if (stat.isDirectory()) {
        entries[path] = "dir";
        walk(path);
      } else {
        entries[path] = readFileSync(join(root, path)).toString("base64");
      }
    }
  };
  walk("");
  return entries;
};

const FILES = {
  "components/shell/shell.tsx": "export const Shell = 1;\n",
  "components/sidebar/sidebar.tsx": "export const Sidebar = 1;\n",
  "lib/nav.ts": "export type Nav = string;\n",
};
const NAV_TEMPLATE = "export const NAV = [];\n";
const MANIFEST = {
  name: "app-shell",
  dependencies: { "@uiid/design-system": "^0.10.0", jotai: "^3.0.2" },
  templates: { "nav.ts": "nav.ts", "app/layout.tsx": "app/layout.tsx" },
};

/** A recipes root holding one recipe, `app-shell`. */
const makeRecipes = (
  manifest: unknown = MANIFEST,
  files: Record<string, string> = FILES,
) => {
  const root = tempDir();
  write(join(root, "app-shell/files"), files);
  write(join(root, "app-shell/templates"), {
    "nav.ts": NAV_TEMPLATE,
    "app/layout.tsx": "export default 1;\n",
  });
  write(root, { "app-shell/recipe.json": JSON.stringify(manifest) });
  return root;
};

const PACKAGE_JSON = JSON.stringify({
  name: "web",
  dependencies: { next: "16.0.0", react: "19.0.0" },
});
const TSCONFIG = `{
  // A new Next.js app's tsconfig, trimmed.
  "compilerOptions": {
    "strict": true,
    /* the alias add needs */
    "paths": { "@/*": ["./*"], },
  },
}
`;
const APP = {
  "package.json": PACKAGE_JSON,
  "tsconfig.json": TSCONFIG,
  "pnpm-lock.yaml": "lockfileVersion: '9.0'\n",
  "app/layout.tsx": "export default function Layout() {}\n",
  "app/globals.css": "body {}\n",
  "app/page.tsx": "export default function Page() {}\n",
};
const makeApp = (files: Record<string, string> = APP) => {
  const app = tempDir();
  write(app, files);
  return app;
};

type Call = { command: string; args: string[]; cwd: string };

const cli = (
  argv: string[],
  {
    cwd = tempDir(),
    recipesRoot = makeRecipes(),
    repoRoot = tempDir(),
    status = 0,
  }: {
    cwd?: string;
    recipesRoot?: string;
    repoRoot?: string;
    status?: number;
  } = {},
) => {
  const out: string[] = [];
  const err: string[] = [];
  const calls: Call[] = [];
  const run: Runner = (command, args, dir) => {
    calls.push({ command, args, cwd: dir });
    return status;
  };
  const code = runCli(argv, {
    cwd,
    recipesRoot,
    repoRoot,
    run,
    log: (line) => out.push(line),
    error: (line) => err.push(line),
  });
  return { code, out: out.join("\n"), err: err.join("\n"), calls };
};

/** Runs `add`, expecting a refusal that leaves `app` exactly as it was. */
const refuse = (
  app: string,
  options: Parameters<typeof cli>[1] = {},
  argv = ["add", "app-shell"],
) => {
  const before = snapshot(app);
  const result = cli(argv, { cwd: app, ...options });
  expect(result.code).toBe(1);
  expect(snapshot(app)).toEqual(before);
  expect(result.calls).toEqual([]);
  // One sentence: it ends with a full stop and holds no other sentence end.
  expect(result.err).toMatch(/^[^\n]+\.$/);
  expect(result.err.slice(0, -1)).not.toMatch(/\.\s+[A-Z]/);
  return result.err;
};

describe("add", () => {
  it("copies files/ verbatim, writes the starter nav.ts and installs the dependencies", () => {
    const recipes = makeRecipes();
    const app = makeApp();
    const { code, out, calls } = cli(["add", "app-shell"], {
      cwd: app,
      recipesRoot: recipes,
    });
    expect(code).toBe(0);
    expect(compareRecipe(join(recipes, "app-shell/files"), app)).toEqual({
      changed: [],
      missing: [],
      extra: [],
      extraDirectories: [],
    });
    expect(readFileSync(join(app, "nav.ts"), "utf8")).toBe(NAV_TEMPLATE);
    expect(calls).toEqual([
      {
        command: "pnpm",
        args: ["add", "@uiid/design-system@^0.10.0", "jotai@^3.0.2"],
        cwd: app,
      },
    ]);
    expect(out).toContain(`wrote    "components/shell/shell.tsx"`);
    expect(out).toContain(`wrote    "nav.ts"`);
    expect(out).toContain(LAYOUT_WIRING);
  });

  it("leaves app/layout.tsx, app/globals.css and every page untouched", () => {
    const app = makeApp();
    cli(["add", "app-shell"], { cwd: app });
    for (const name of ["app/layout.tsx", "app/globals.css", "app/page.tsx"]) {
      expect(readFileSync(join(app, name), "utf8")).toBe(
        APP[name as keyof typeof APP],
      );
    }
  });

  it("keeps an existing nav.ts", () => {
    const app = makeApp({ ...APP, "nav.ts": "export const NAV = [1];\n" });
    const { code, out } = cli(["add", "app-shell"], { cwd: app });
    expect(code).toBe(0);
    expect(readFileSync(join(app, "nav.ts"), "utf8")).toBe(
      "export const NAV = [1];\n",
    );
    expect(out).toContain(`kept     "nav.ts"`);
  });

  it("never writes another template", () => {
    const app = makeApp({ ...APP });
    rmSync(join(app, "app/layout.tsx"));
    cli(["add", "app-shell"], { cwd: app });
    expect(() => lstatSync(join(app, "app/layout.tsx"))).toThrow(/ENOENT/);
  });

  it("refuses the second run in the same app and changes no file", () => {
    const recipes = makeRecipes();
    const app = makeApp();
    expect(
      cli(["add", "app-shell"], { cwd: app, recipesRoot: recipes }).code,
    ).toBe(0);
    const err = refuse(app, { recipesRoot: recipes });
    expect(err).toContain(`"components/shell/shell.tsx"`);
    expect(err).toContain(`"lib/nav.ts"`);
  });

  it("lists every recipe destination that already exists", () => {
    const app = makeApp({ ...APP, "lib/nav.ts": "mine\n" });
    const err = refuse(app);
    expect(err).toBe(
      `These files already exist, so add wrote nothing: "lib/nav.ts"; move or delete them, then run add again.`,
    );
  });

  it("does not copy dot-named entries under files/", () => {
    const recipes = makeRecipes(MANIFEST, {
      ...FILES,
      "components/.DS_Store": "x",
      "lib/.env": "SECRET=1\n",
    });
    const app = makeApp();
    expect(
      cli(["add", "app-shell"], { cwd: app, recipesRoot: recipes }).code,
    ).toBe(0);
    expect(() => lstatSync(join(app, "components/.DS_Store"))).toThrow(
      /ENOENT/,
    );
    expect(() => lstatSync(join(app, "lib/.env"))).toThrow(/ENOENT/);
  });

  it("runs from --cwd", () => {
    const app = makeApp();
    const { code } = cli(["add", "app-shell", "--cwd", app]);
    expect(code).toBe(0);
    expect(readFileSync(join(app, "lib/nav.ts"), "utf8")).toBe(
      FILES["lib/nav.ts"],
    );
  });

  it("accepts --cwd=<dir> and a relative --cwd", () => {
    const parent = tempDir();
    const app = join(parent, "web");
    write(app, APP);
    expect(cli(["add", "--cwd=web", "app-shell"], { cwd: parent }).code).toBe(
      0,
    );
  });

  it.each([
    ["npm", "package-lock.json", ["install"]],
    ["yarn", "yarn.lock", ["add"]],
    ["bun", "bun.lock", ["add"]],
    ["bun", "bun.lockb", ["add"]],
    ["pnpm", "pnpm-lock.yaml", ["add"]],
  ])("installs with %s when the lockfile is %s", (command, lockfile, verb) => {
    const files: Record<string, string> = { ...APP, [lockfile]: "\n" };
    if (lockfile !== "pnpm-lock.yaml") delete files["pnpm-lock.yaml"];
    const app = makeApp(files);
    const { calls } = cli(["add", "app-shell"], { cwd: app });
    expect(calls).toEqual([
      {
        command,
        args: [...verb, "@uiid/design-system@^0.10.0", "jotai@^3.0.2"],
        cwd: app,
      },
    ]);
  });

  it("treats bun.lock and bun.lockb together as one package manager", () => {
    const files: Record<string, string> = {
      ...APP,
      "bun.lock": "\n",
      "bun.lockb": "\n",
    };
    delete files["pnpm-lock.yaml"];
    const { calls } = cli(["add", "app-shell"], { cwd: makeApp(files) });
    expect(calls[0]?.command).toBe("bun");
  });

  it("says the files are in place and what to run when the install fails", () => {
    const app = makeApp();
    const { code, err } = cli(["add", "app-shell"], { cwd: app, status: 1 });
    expect(code).toBe(1);
    expect(err).toBe(
      `The recipe's files are in place, but the install failed: run pnpm add '@uiid/design-system@^0.10.0' 'jotai@^3.0.2' in ${JSON.stringify(app)} by hand.`,
    );
    expect(readFileSync(join(app, "lib/nav.ts"), "utf8")).toBe(
      FILES["lib/nav.ts"],
    );
  });

  it("reports a runner that throws, such as a missing package manager, as a failed install", () => {
    const app = makeApp();
    const err: string[] = [];
    const code = runCli(["add", "app-shell"], {
      cwd: app,
      recipesRoot: makeRecipes(),
      repoRoot: tempDir(),
      run: () => {
        throw new Error("spawn pnpm ENOENT");
      },
      log: () => {},
      error: (line) => err.push(line),
    });
    expect(code).toBe(1);
    expect(err.join("\n")).toMatch(/^The recipe's files are in place/);
  });

  it("stops with one sentence when a write fails partway, and runs no install", () => {
    const app = makeApp();
    mkdirSync(join(app, "lib"));
    chmodSync(join(app, "lib"), 0o555);
    try {
      const { code, err, out, calls } = cli(["add", "app-shell"], { cwd: app });
      expect(code).toBe(1);
      expect(calls).toEqual([]);
      expect(out).toContain(`wrote    "components/shell/shell.tsx"`);
      expect(err).toMatch(
        /^add stopped while writing "lib\/nav\.ts" \(.*EACCES.*\): the files listed as wrote are in place, so delete them or finish by hand\.$/,
      );
    } finally {
      chmodSync(join(app, "lib"), 0o755);
    }
  });

  it("skips the install when the recipe has no dependencies", () => {
    const recipes = makeRecipes({ ...MANIFEST, dependencies: {} });
    const { code, calls } = cli(["add", "app-shell"], {
      cwd: makeApp(),
      recipesRoot: recipes,
    });
    expect(code).toBe(0);
    expect(calls).toEqual([]);
  });
});

describe("add --dry-run", () => {
  it("prints each file and the install command, writes nothing and runs nothing", () => {
    const app = makeApp();
    const before = snapshot(app);
    const { code, out, calls } = cli(["add", "app-shell", "--dry-run"], {
      cwd: app,
    });
    expect(code).toBe(0);
    expect(snapshot(app)).toEqual(before);
    expect(calls).toEqual([]);
    expect(out).toContain(`would write "components/shell/shell.tsx"`);
    expect(out).toContain(`would write "nav.ts"`);
    expect(out).toContain(
      `would run   pnpm add '@uiid/design-system@^0.10.0' 'jotai@^3.0.2'`,
    );
  });

  it("still refuses what add would refuse", () => {
    const app = makeApp({ ...APP, "lib/nav.ts": "mine\n" });
    refuse(app, {}, ["add", "app-shell", "--dry-run"]);
  });
});

describe("add refuses, writing nothing", () => {
  const without = (name: keyof typeof APP) => {
    const files: Record<string, string> = { ...APP };
    delete files[name];
    return makeApp(files);
  };

  it("with no package.json", () => {
    const app = without("package.json");
    expect(refuse(app)).toBe(
      `There is no package.json in ${JSON.stringify(app)}: run add from the root of a Next.js app, or pass --cwd <dir>.`,
    );
  });

  it("with a package.json that is not JSON", () => {
    const app = makeApp({ ...APP, "package.json": "{ nope" });
    expect(refuse(app)).toMatch(/^The package\.json in .* is not valid JSON:/);
  });

  it("with a package.json that does not depend on next", () => {
    const app = makeApp({
      ...APP,
      "package.json": JSON.stringify({
        dependencies: { react: "19.0.0" },
        peerDependencies: { next: "16.0.0" },
      }),
    });
    expect(refuse(app)).toBe(
      `The package.json in ${JSON.stringify(app)} does not list next in dependencies or devDependencies: add the recipe to a Next.js app.`,
    );
  });

  it("accepts next in devDependencies", () => {
    const app = makeApp({
      ...APP,
      "package.json": JSON.stringify({ devDependencies: { next: "16.0.0" } }),
    });
    expect(cli(["add", "app-shell"], { cwd: app }).code).toBe(0);
  });

  it("with no app/ directory", () => {
    const files: Record<string, string> = { ...APP };
    for (const name of Object.keys(files)) {
      if (name.startsWith("app/")) delete files[name];
    }
    const app = makeApp(files);
    expect(refuse(app)).toBe(
      `${JSON.stringify(app)} has no app/ directory at its root: add the recipe to a Next.js App Router app.`,
    );
  });

  it("with app/ as a file, not a directory", () => {
    const files: Record<string, string> = { ...APP };
    for (const name of Object.keys(files)) {
      if (name.startsWith("app/")) delete files[name];
    }
    const app = makeApp({ ...files, app: "not a directory\n" });
    expect(refuse(app)).toMatch(/has no app\/ directory at its root/);
  });

  it("with a src/app layout, naming it as unsupported", () => {
    const files: Record<string, string> = { ...APP };
    for (const name of Object.keys(files)) {
      if (name.startsWith("app/")) delete files[name];
    }
    const app = makeApp({ ...files, "src/app/page.tsx": "\n" });
    expect(refuse(app)).toBe(
      `${JSON.stringify(app)} keeps its app in src/app, which add does not support: add the recipe to an app with app/ at its root.`,
    );
  });

  it("with the Pages Router, naming it as unsupported", () => {
    const files: Record<string, string> = { ...APP };
    for (const name of Object.keys(files)) {
      if (name.startsWith("app/")) delete files[name];
    }
    const app = makeApp({ ...files, "pages/index.tsx": "\n" });
    expect(refuse(app)).toBe(
      `${JSON.stringify(app)} uses the Pages Router (pages/ with no app/), which add does not support: add the recipe to an App Router app.`,
    );
  });

  it("with no tsconfig.json", () => {
    const app = without("tsconfig.json");
    expect(refuse(app)).toBe(
      `There is no tsconfig.json in ${JSON.stringify(app)}: add the recipe to a TypeScript Next.js app.`,
    );
  });

  it("with a tsconfig.json it cannot read", () => {
    const app = makeApp({ ...APP, "tsconfig.json": `{ "compilerOptions": ` });
    expect(refuse(app)).toBe(
      `The tsconfig.json in ${JSON.stringify(app)} cannot be read as JSON with comments: fix it, then run add again.`,
    );
  });

  it.each([
    ["no paths", `{ "compilerOptions": {} }`],
    ["another alias", `{ "compilerOptions": { "paths": { "~/*": ["./*"] } } }`],
    [
      "@/* to another target first",
      `{ "compilerOptions": { "paths": { "@/*": ["./src/*", "./*"] } } }`,
    ],
    [
      "@/* that is not a list",
      `{ "compilerOptions": { "paths": { "@/*": "./*" } } }`,
    ],
    ["the alias only in an extended config", `{ "extends": "./base.json" }`],
  ])("with %s in tsconfig.json", (_, tsconfig) => {
    const app = makeApp({
      ...APP,
      "tsconfig.json": tsconfig,
      "base.json": `{ "compilerOptions": { "paths": { "@/*": ["./*"] } } }`,
    });
    expect(refuse(app)).toBe(
      `The tsconfig.json in ${JSON.stringify(app)} has no "@/*" path whose first target is "./*": add "paths": { "@/*": ["./*"] } to its compilerOptions, then run add again.`,
    );
  });

  it("with no lockfile", () => {
    const app = without("pnpm-lock.yaml");
    expect(refuse(app)).toBe(
      `${JSON.stringify(app)} has no lockfile at its root (pnpm-lock.yaml, package-lock.json, yarn.lock, bun.lock or bun.lockb): install the app's dependencies once with its package manager, then run add again.`,
    );
  });

  it("with lockfiles for more than one package manager", () => {
    const app = makeApp({ ...APP, "package-lock.json": "{}\n" });
    expect(refuse(app)).toBe(
      `${JSON.stringify(app)} has lockfiles for more than one package manager (pnpm, npm): delete the ones the app does not use, then run add again.`,
    );
  });

  it("with a workspace: range outside this repository's workspace", () => {
    const recipes = makeRecipes({
      ...MANIFEST,
      dependencies: {
        "@uiid/design-system": "workspace:*",
        "@uiid/icons": "workspace:*",
        jotai: "^3.0.2",
      },
    });
    const app = makeApp();
    expect(refuse(app, { recipesRoot: recipes })).toBe(
      `The recipe's manifest has no published range yet for "@uiid/design-system" and "@uiid/icons", only a workspace: range that resolves inside the UIID repository alone, so add cannot install them here.`,
    );
  });

  it("with a destination directory that is a symlink, and writes nothing through it", () => {
    const app = makeApp();
    const outside = tempDir();
    symlinkSync(outside, join(app, "components"));
    expect(refuse(app)).toMatch(/symlink/);
    expect(readdirSync(outside)).toEqual([]);
  });

  it("with a destination that is a symlink, even a dangling one", () => {
    const app = makeApp();
    mkdirSync(join(app, "lib"));
    symlinkSync(join(tempDir(), "gone.ts"), join(app, "lib/nav.ts"));
    expect(refuse(app)).toMatch(/symlink|already exist/);
  });

  it("with a symlinked nav.ts it would otherwise keep", () => {
    // A link is not a project file add can rely on, but add never writes
    // through it either: it counts as an existing nav.ts and is kept.
    const app = makeApp();
    const outside = tempDir();
    write(outside, { "nav.ts": "outside\n" });
    symlinkSync(join(outside, "nav.ts"), join(app, "nav.ts"));
    expect(cli(["add", "app-shell"], { cwd: app }).code).toBe(0);
    expect(readFileSync(join(outside, "nav.ts"), "utf8")).toBe("outside\n");
  });

  it("checks every destination before it writes any", () => {
    // components/shell sorts first and is free; lib/nav.ts exists.
    const app = makeApp({ ...APP, "lib/nav.ts": "mine\n" });
    refuse(app);
    expect(() => lstatSync(join(app, "components"))).toThrow(/ENOENT/);
  });
});

describe("add refuses a recipe it cannot trust, writing nothing", () => {
  const manifestRefusal = (manifest: unknown, files = FILES) =>
    refuse(makeApp(), { recipesRoot: makeRecipes(manifest, files) });

  it.each([
    ["package.json", "package.json"],
    ["a nested package.json", "components/x/package.json"],
    ["a lockfile", "pnpm-lock.yaml"],
    ["bun.lockb", "bun.lockb"],
    ["tsconfig.json", "tsconfig.json"],
    ["next.config.ts", "next.config.ts"],
    ["next.config.mjs", "lib/next.config.mjs"],
  ])("with %s under files/", (_, name) => {
    expect(manifestRefusal(MANIFEST, { ...FILES, [name]: "{}\n" })).toBe(
      `The recipe would write ${JSON.stringify(name)}, which add never writes: remove it from the recipe.`,
    );
  });

  it.each([
    ".env",
    ".env.local",
    ".npmrc",
    ".git/config",
    "node_modules/x/index.js",
    "lib/node_modules/x.js",
    "package.json",
    "yarn.lock",
  ])("with a template destination of %j", (dest) => {
    expect(
      manifestRefusal({
        ...MANIFEST,
        templates: { ...MANIFEST.templates, "app/layout.tsx": dest },
      }),
    ).toMatch(
      /^The recipe would write .*, which add never writes|^The recipe's manifest maps/,
    );
  });

  it.each([
    "../outside.ts",
    "/etc/passwd",
    "a/../../b.ts",
    "a\\b.ts",
    "C:/x.ts",
    "a//b.ts",
    "./nav.ts",
    "",
  ])("with a template destination of %j", (dest) => {
    expect(
      manifestRefusal({
        ...MANIFEST,
        templates: { ...MANIFEST.templates, "app/layout.tsx": dest },
      }),
    ).toMatch(
      /^The recipe's manifest maps "app\/layout\.tsx" to .*, which is not a plain relative path/,
    );
  });

  it.each([
    "../recipe.json",
    "../files/lib/nav.ts",
    "/etc/passwd",
    "missing.ts",
  ])(
    "with a template key of %j, which is not a file inside templates/",
    (key) => {
      expect(
        manifestRefusal({
          ...MANIFEST,
          templates: { ...MANIFEST.templates, [key]: "other.ts" },
        }),
      ).toMatch(
        /^The recipe's manifest lists the template .*: fix the recipe's recipe\.json\.$/,
      );
    },
  );

  it("with two templates mapped to one destination", () => {
    expect(
      manifestRefusal({
        ...MANIFEST,
        templates: { "nav.ts": "nav.ts", "app/layout.tsx": "NAV.ts" },
      }),
    ).toBe(
      `The recipe's manifest maps more than one file to "NAV.ts": fix the recipe's recipe.json.`,
    );
  });

  it("with a template destination that is also a files/ destination", () => {
    expect(
      manifestRefusal({
        ...MANIFEST,
        templates: { "nav.ts": "nav.ts", "app/layout.tsx": "lib/nav.ts" },
      }),
    ).toBe(
      `The recipe's manifest maps more than one file to "lib/nav.ts": fix the recipe's recipe.json.`,
    );
  });

  it("with nav.ts mapped anywhere but nav.ts", () => {
    expect(
      manifestRefusal({
        ...MANIFEST,
        templates: { "nav.ts": "app/nav.ts" },
      }),
    ).toBe(
      `The recipe's manifest maps the template "nav.ts" to "app/nav.ts", but add writes it only to "nav.ts": fix the recipe's recipe.json.`,
    );
  });

  it("with no nav.ts template", () => {
    expect(manifestRefusal({ ...MANIFEST, templates: {} })).toBe(
      `The recipe's manifest has no "nav.ts" template: fix the recipe's recipe.json.`,
    );
  });

  it.each([
    ["a name that is not a package name", { "../evil": "^1.0.0" }],
    ["an upper-case name", { React: "^19.0.0" }],
    ["a name that is a flag", { "-g": "^1.0.0" }],
    ["a range with a space", { jotai: ">=1 <2" }],
    ["a range that is a flag", { jotai: "--global" }],
    ["a range with a shell metacharacter", { jotai: "^1;rm" }],
    ["a range with a backtick", { jotai: "`x`" }],
    ["a range that is not a string", { jotai: 3 }],
    ["an empty range", { jotai: "" }],
  ])("with %s", (_, dependencies) => {
    expect(manifestRefusal({ ...MANIFEST, dependencies })).toMatch(
      /^The recipe's manifest gives the dependency .* which add will not pass to a package manager: fix the recipe's recipe\.json\.$/,
    );
  });

  it("with a recipe.json that is not JSON", () => {
    const recipes = makeRecipes();
    writeFileSync(join(recipes, "app-shell/recipe.json"), "{ nope");
    expect(refuse(makeApp(), { recipesRoot: recipes })).toBe(
      `The recipe's manifest is not valid JSON: fix the recipe's recipe.json.`,
    );
  });
});

describe("the command line", () => {
  it.each([["--help"], ["-h"], ["add", "--help"]])(
    "prints usage and exits 0 for %j",
    (...argv) => {
      const { code, out } = cli(argv);
      expect(code).toBe(0);
      expect(out).toMatch(/^Usage: uiid-recipes add <recipe>/);
    },
  );

  it.each([
    [[], `Name a command: run uiid-recipes --help to see the commands.`],
    [
      ["remove", "app-shell"],
      `Unknown command "remove": run uiid-recipes --help to see the commands.`,
    ],
    [
      ["add"],
      `Name the recipe to add: run uiid-recipes add <recipe>, such as uiid-recipes add app-shell.`,
    ],
    [
      ["add", "app-shell", "--force"],
      `Unknown option "--force": run uiid-recipes --help to see the options.`,
    ],
    [
      ["add", "app-shell", "extra"],
      `Unexpected argument "extra": add takes one recipe.`,
    ],
    [
      ["add", "app-shell", "--cwd"],
      `--cwd needs a directory: pass --cwd <dir>.`,
    ],
    [
      ["add", "nope"],
      `There is no recipe named "nope": choose one of "app-shell".`,
    ],
    [
      ["add", "../app-shell"],
      `There is no recipe named "../app-shell": choose one of "app-shell".`,
    ],
  ])("refuses %j with one sentence", (argv, sentence) => {
    const app = makeApp();
    expect(refuse(app, {}, argv)).toBe(sentence);
  });

  it("refuses a --cwd that does not exist", () => {
    const missing = join(tempDir(), "missing");
    const { code, err } = cli(["add", "app-shell", "--cwd", missing]);
    expect(code).toBe(1);
    expect(err).toBe(
      `--cwd ${JSON.stringify(missing)} does not exist: pass the directory of an existing Next.js app.`,
    );
  });

  it("refuses a --cwd that is not a directory", () => {
    const parent = tempDir();
    write(parent, { "file.txt": "\n" });
    const { code, err } = cli(["add", "app-shell", "--cwd", "file.txt"], {
      cwd: parent,
    });
    expect(code).toBe(1);
    expect(err).toBe(
      `--cwd ${JSON.stringify(join(parent, "file.txt"))} is not a directory: pass the directory of an existing Next.js app.`,
    );
  });
});

describe("the bin", () => {
  it("is cli.mjs, a Node script that hands the command line to runCli", () => {
    const pkg = JSON.parse(
      readFileSync(join(RECIPES_ROOT, "package.json"), "utf8"),
    );
    expect(pkg.bin).toEqual({ "uiid-recipes": "./src/cli.mjs" });
    const source = readFileSync(join(RECIPES_ROOT, "src/cli.mjs"), "utf8");
    expect(source.startsWith("#!/usr/bin/env node\n")).toBe(true);
    expect(source).toContain(`from "./add.ts"`);
    expect(source).toContain("runCli(process.argv.slice(2)");
  });
});

describe("parseJsonc", () => {
  it("reads comments and trailing commas, and keeps them inside strings", () => {
    expect(
      parseJsonc(`\uFEFF{
        // line
        "a": "http://x/*y*/", /* block */
        "b": [1, 2,],
        "c": "quote \\" // still a string",
      }`),
    ).toEqual({
      a: "http://x/*y*/",
      b: [1, 2],
      c: `quote " // still a string`,
    });
  });

  it.each([`{ "a": 1`, `{ /* open`, `{ "a": }`, `module.exports = {}`])(
    "throws on %j",
    (text) => {
      expect(() => parseJsonc(text)).toThrow();
    },
  );
});

describe("the layout wiring", () => {
  const template = readFileSync(
    join(RECIPES_ROOT, "app-shell/templates/app/layout.tsx"),
    "utf8",
  );
  const tags = (source: string) =>
    [...source.matchAll(/<(\/?[A-Za-z]+)/g)].map((match) => match[1]);
  const imports = (source: string) =>
    source
      .split("\n")
      .map((line) => line.trim())
      .filter((line) =>
        /^import .*["'](\.\/globals\.css|@\/components\/[^"']+)["'];$/.test(
          line,
        ),
      );

  // The wiring is printed from a constant in add.ts. These tests keep it in
  // step with the starter layout, so a change to one fails until the other
  // follows.
  it("imports what the starter layout imports from the recipe and globals.css", () => {
    expect(imports(LAYOUT_WIRING)).toEqual(imports(template));
    expect(imports(template)).toHaveLength(5);
  });

  it("nests the same elements, in the same order, as the starter layout", () => {
    expect(tags(LAYOUT_WIRING.slice(LAYOUT_WIRING.indexOf("<html")))).toEqual(
      tags(template.slice(template.indexOf("<html"))),
    );
  });

  it("names the stylesheet the starter globals.css imports", () => {
    const globals = readFileSync(
      join(RECIPES_ROOT, "app-shell/templates/app/globals.css"),
      "utf8",
    ).trim();
    expect(LAYOUT_WIRING).toContain(globals);
  });
});

describe("the app shell recipe", () => {
  // A fake repository whose workspace holds apps/*, so the real manifest's
  // workspace: ranges pass through. Reads this package's recipe; writes only
  // into the temp directory.
  const inWorkspace = () => {
    const repo = tempDir();
    write(repo, {
      "pnpm-workspace.yaml": `packages:\n  - "apps/*"\n  - 'packages/*'\n`,
      "pnpm-lock.yaml": "lockfileVersion: '9.0'\n",
    });
    const files: Record<string, string> = { ...APP };
    delete files["pnpm-lock.yaml"];
    write(join(repo, "apps/web"), files);
    return { repo, app: join(repo, "apps/web") };
  };

  it("copies byte for byte into a workspace app, passing workspace: ranges through", () => {
    const { repo, app } = inWorkspace();
    const { code, calls } = cli(["add", "app-shell"], {
      cwd: app,
      recipesRoot: RECIPES_ROOT,
      repoRoot: repo,
    });
    expect(code).toBe(0);
    expect(compareRecipe(APP_SHELL_FILES, app)).toEqual({
      changed: [],
      missing: [],
      extra: [],
      extraDirectories: [],
    });
    expect(readFileSync(join(app, "nav.ts"))).toEqual(
      readFileSync(join(RECIPES_ROOT, "app-shell/templates/nav.ts")),
    );
    expect(calls).toEqual([
      {
        command: "pnpm",
        args: [
          "add",
          "@uiid/design-system@workspace:*",
          "@uiid/icons@workspace:*",
          "jotai@^3.0.2",
        ],
        cwd: app,
      },
    ]);
  });

  it("is refused outside the workspace, until its manifest has published ranges", () => {
    const { repo } = inWorkspace();
    const app = makeApp();
    expect(refuse(app, { recipesRoot: RECIPES_ROOT, repoRoot: repo })).toMatch(
      /no published range yet for "@uiid\/design-system" and "@uiid\/icons"/,
    );
  });

  it("is refused in a directory of the repository that is not a workspace member", () => {
    const { repo } = inWorkspace();
    const app = join(repo, "scratch/web");
    write(app, APP);
    refuse(app, { recipesRoot: RECIPES_ROOT, repoRoot: repo });
  });
});
