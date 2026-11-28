// @vitest-environment node
import { spawnSync } from "node:child_process";
import {
  lstatSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  realpathSync,
  rmSync,
  symlinkSync,
  writeFileSync,
} from "node:fs";
import { join } from "node:path";

import { afterAll, describe, expect, it } from "vitest";

import {
  LAYOUT_WIRING,
  parseJsonc,
  type Runner,
  spawnRunner,
  workspaceRootOf,
} from "./add.ts";
import { runCli } from "./cli.ts";
import { APP_SHELL_FILES, RECIPES_ROOT, REPO_ROOT } from "./paths.ts";
import { compareRecipe } from "./recipes.ts";
import {
  removeTempDirs,
  snapshot,
  tempDir,
  withFiles,
  write,
} from "./test-utils.ts";

// Every test builds its recipes, its app and, where it needs one, a fake
// repository in new directories under the OS temp directory. One group reads
// this package's own app shell recipe without writing to it. No test starts a
// package manager: the runner is always a stub that records its calls.
afterAll(removeTempDirs);

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
    throws = false,
    onLog = () => {},
  }: {
    cwd?: string;
    recipesRoot?: string;
    repoRoot?: string;
    /** The stub install's exit code. */
    status?: number;
    /** Whether the stub install throws, as a missing package manager does. */
    throws?: boolean;
    /** Called with each line `add` logs, after it is logged. */
    onLog?: (line: string) => void;
  } = {},
) => {
  const out: string[] = [];
  const err: string[] = [];
  const calls: Call[] = [];
  const run: Runner = (command, args, dir) => {
    calls.push({ command, args, cwd: dir });
    if (throws) throw new Error("spawn pnpm ENOENT");
    return status;
  };
  const code = runCli(argv, {
    cwd,
    recipesRoot,
    repoRoot,
    run,
    log: (line) => {
      out.push(line);
      onLog(line);
    },
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
  // A refusal in planning, not a write that failed: a planning bug that let
  // the plan through would also leave the app unchanged when the first
  // exclusive write fails.
  expect(result.err).not.toMatch(/^add stopped/);
  // One sentence: it ends with a full stop and holds no other sentence end.
  expect(result.err).toMatch(/^[^\n]+\.$/);
  expect(result.err.slice(0, -1)).not.toMatch(/\.\s+[A-Z]/);
  return result.err;
};

/** Whether the temp directory's file system ignores case, as macOS's default does. */
const caseInsensitive = () => {
  const dir = tempDir();
  writeFileSync(join(dir, "a"), "");
  return lstatSync(join(dir, "A"), { throwIfNoEntry: false }) !== undefined;
};

const workspaceRefusal = (names: string) =>
  `The recipe's manifest has no published range yet for ${names}, only a workspace: range that resolves inside the UIID repository alone, so add cannot install ${names.includes(" and ") ? "them" : "it"} here: run add in an app inside the UIID repository's workspace until the recipe has a published range.`;

/** The snapshot of an app after `add`: `before`, plus the recipe in FILES and the starter nav.ts. */
const withRecipe = (before: Record<string, string>) =>
  withFiles(before, { ...FILES, "nav.ts": NAV_TEMPLATE });

describe("add", () => {
  it("copies files/ verbatim, writes the starter nav.ts and installs the dependencies", () => {
    const recipes = makeRecipes();
    const app = makeApp();
    const before = snapshot(app);
    const { code, out, calls } = cli(["add", "app-shell"], {
      cwd: app,
      recipesRoot: recipes,
    });
    expect(code).toBe(0);
    // Exactly the recipe's files, their directories and nav.ts are new;
    // nothing else in the app changed.
    expect(snapshot(app)).toEqual(withRecipe(before));
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
    expect(cli(["add", "app-shell"], { cwd: app }).code).toBe(0);
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
    expect(cli(["add", "app-shell"], { cwd: app }).code).toBe(0);
    expect(() => lstatSync(join(app, "app/layout.tsx"))).toThrow(/ENOENT/);
  });

  it("accepts next in devDependencies", () => {
    const app = makeApp({
      ...APP,
      "package.json": JSON.stringify({ devDependencies: { next: "16.0.0" } }),
    });
    expect(cli(["add", "app-shell"], { cwd: app }).code).toBe(0);
  });

  it("keeps a nav.ts that is a symlink, and writes nothing through it", () => {
    // A link is not a project file add can rely on, but add never writes
    // through it either: it counts as an existing nav.ts and is kept.
    const app = makeApp();
    const outside = tempDir();
    write(outside, { "nav.ts": "outside\n" });
    symlinkSync(join(outside, "nav.ts"), join(app, "nav.ts"));
    expect(cli(["add", "app-shell"], { cwd: app }).code).toBe(0);
    expect(readFileSync(join(outside, "nav.ts"), "utf8")).toBe("outside\n");
  });

  it("keeps a dangling nav.ts symlink, and creates nothing at its target", () => {
    const app = makeApp();
    const gone = join(tempDir(), "gone.ts");
    symlinkSync(gone, join(app, "nav.ts"));
    const { code, out } = cli(["add", "app-shell"], { cwd: app });
    expect(code).toBe(0);
    expect(out).toContain(`kept     "nav.ts"`);
    expect(() => lstatSync(gone)).toThrow(/ENOENT/);
  });

  it("runs from a --cwd that is a symlink, writing into the real app", () => {
    const app = makeApp();
    const link = join(tempDir(), "link");
    symlinkSync(app, link);
    const { code, calls } = cli(["add", "app-shell", "--cwd", link]);
    expect(code).toBe(0);
    expect(calls[0]?.cwd).toBe(app);
    expect(readFileSync(join(app, "lib/nav.ts"), "utf8")).toBe(
      FILES["lib/nav.ts"],
    );
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

  it.each([
    ["exits non-zero", { status: 1 }],
    ["throws, as a missing package manager does", { throws: true }],
  ])(
    "says the files are in place, what to run, and still prints the wiring when the install %s",
    (_, failure) => {
      const app = makeApp();
      const { code, err, out } = cli(["add", "app-shell"], {
        cwd: app,
        ...failure,
      });
      expect(code).toBe(1);
      expect(err).toBe(
        `The recipe's files are in place, but the install failed: run pnpm add '@uiid/design-system@^0.10.0' 'jotai@^3.0.2' in ${JSON.stringify(app)} by hand.`,
      );
      expect(out).toContain(LAYOUT_WIRING);
      expect(out.indexOf(LAYOUT_WIRING)).toBeLessThan(out.indexOf("running"));
      expect(readFileSync(join(app, "lib/nav.ts"), "utf8")).toBe(
        FILES["lib/nav.ts"],
      );
    },
  );

  it("never replaces a nav.ts that appears after the checks", () => {
    // nav.ts is the one destination add decides is absent. Planting it once
    // lib/nav.ts, the last recipe file, is written proves the create is
    // exclusive through add itself.
    const app = makeApp();
    const { code, err, calls } = cli(["add", "app-shell"], {
      cwd: app,
      onLog: (line) => {
        if (line === `  wrote    "lib/nav.ts"`) {
          writeFileSync(join(app, "nav.ts"), "planted\n");
        }
      },
    });
    expect(code).toBe(1);
    expect(readFileSync(join(app, "nav.ts"), "utf8")).toBe("planted\n");
    expect(err).toBe(
      `add stopped while writing "nav.ts" (EEXIST at ${JSON.stringify(join(app, "nav.ts"))}): the files listed as wrote are in place, so delete them or finish by hand.`,
    );
    expect(calls).toEqual([]);
  });

  it("stops with one sentence when a write fails partway, and runs no install", () => {
    // Turns lib/ into a file after the first write, whatever user runs this.
    const app = makeApp();
    const { code, err, out, calls } = cli(["add", "app-shell"], {
      cwd: app,
      onLog: (line) => {
        if (line === `  wrote    "components/shell/shell.tsx"`) {
          writeFileSync(join(app, "lib"), "a file\n");
        }
      },
    });
    expect(code).toBe(1);
    expect(calls).toEqual([]);
    expect(out).toContain(`wrote    "components/sidebar/sidebar.tsx"`);
    expect(err).toBe(
      `add stopped while writing "lib/nav.ts" (ENOTDIR at ${JSON.stringify(join(app, "lib/nav.ts"))}): the files listed as wrote are in place, so delete them or finish by hand.`,
    );
  });

  it("checks each target again right before writing it", () => {
    // components/sidebar becomes a link out of the app after the first write.
    const app = makeApp();
    const outside = tempDir();
    const { code, err } = cli(["add", "app-shell"], {
      cwd: app,
      onLog: (line) => {
        if (line === `  wrote    "components/shell/shell.tsx"`) {
          symlinkSync(outside, join(app, "components/sidebar"));
        }
      },
    });
    expect(code).toBe(1);
    expect(readdirSync(outside)).toEqual([]);
    expect(err).toMatch(
      /^add stopped while writing "components\/sidebar\/sidebar\.tsx" \(Refusing to follow the symlink at /,
    );
  });

  it("prints paths in a failure through JSON.stringify, even with control characters", () => {
    const parent = tempDir();
    const app = join(parent, "web\u001b[31m\u0007");
    write(app, APP);
    const { code, err } = cli(["add", "app-shell"], {
      cwd: app,
      onLog: (line) => {
        if (line === `  wrote    "lib/nav.ts"`) {
          writeFileSync(join(app, "nav.ts"), "planted\n");
        }
      },
    });
    expect(code).toBe(1);
    expect(err).toContain(`EEXIST at ${JSON.stringify(join(app, "nav.ts"))}`);
    expect([...err].filter((c) => c.charCodeAt(0) < 0x20)).toEqual([]);
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

  it("says it would keep an existing nav.ts", () => {
    const app = makeApp({ ...APP, "nav.ts": "mine\n" });
    const { code, out } = cli(["add", "app-shell", "--dry-run"], { cwd: app });
    expect(code).toBe(0);
    expect(out).toContain(`would keep  "nav.ts"`);
    expect(out).not.toContain(`would write "nav.ts"`);
  });

  it("still refuses what add would refuse", () => {
    const app = makeApp({ ...APP, "lib/nav.ts": "mine\n" });
    expect(refuse(app, {}, ["add", "app-shell", "--dry-run"])).toBe(
      `These files already exist, so add wrote nothing: "lib/nav.ts"; move or delete them, then run add again.`,
    );
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

  it.each([
    ["package.json", "file"],
    ["tsconfig.json", "file"],
    ["app", "directory"],
  ])("with %s as a symlink, naming it", (name, kind) => {
    const app = makeApp();
    const outside = tempDir();
    const real = join(outside, name);
    if (kind === "directory") mkdirSync(real);
    else writeFileSync(real, readFileSync(join(app, name)));
    rmSync(join(app, name), { recursive: true });
    symlinkSync(real, join(app, name));
    expect(refuse(app)).toBe(
      `${JSON.stringify(name)} in ${JSON.stringify(app)} is a symlink, which add does not follow: replace it with the real ${kind}, then run add again.`,
    );
  });

  it.each([
    ["./src", `"./src"`],
    ["src", `"src"`],
    ["..", `".."`],
    [3, "3"],
  ])("with baseUrl %j, which is not the app root", (baseUrl, shown) => {
    const app = makeApp({
      ...APP,
      "tsconfig.json": JSON.stringify({
        compilerOptions: { baseUrl, paths: { "@/*": ["./*"] } },
      }),
    });
    expect(refuse(app)).toBe(
      `The tsconfig.json in ${JSON.stringify(app)} sets baseUrl to ${shown}, so "@/*" does not resolve from the app root: remove baseUrl or set it to ".", then run add again.`,
    );
  });

  it.each([".", "./", "", "./."])(
    "accepts baseUrl %j, the app root",
    (baseUrl) => {
      const app = makeApp({
        ...APP,
        "tsconfig.json": JSON.stringify({
          compilerOptions: { baseUrl, paths: { "@/*": ["./*"] } },
        }),
      });
      expect(cli(["add", "app-shell"], { cwd: app }).code).toBe(0);
    },
  );

  it("with a file where the recipe needs a directory", () => {
    const app = makeApp({ ...APP, lib: "a file\n" });
    expect(refuse(app)).toBe(
      `"lib" in ${JSON.stringify(app)} is a file where the recipe needs a directory: move or rename it, then run add again.`,
    );
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
      workspaceRefusal(`"@uiid/design-system" and "@uiid/icons"`),
    );
  });

  const symlinkRefusal = (path: string) =>
    `Refusing to follow the symlink at ${JSON.stringify(path)}, so add wrote nothing: replace it with a real directory or file, then run add again.`;

  it("with a destination directory that is a symlink, and writes nothing through it", () => {
    const app = makeApp();
    const outside = tempDir();
    symlinkSync(outside, join(app, "components"));
    expect(refuse(app)).toBe(symlinkRefusal(join(app, "components")));
    expect(readdirSync(outside)).toEqual([]);
  });

  it("with a destination that is a symlink, even a dangling one", () => {
    const app = makeApp();
    mkdirSync(join(app, "lib"));
    symlinkSync(join(tempDir(), "gone.ts"), join(app, "lib/nav.ts"));
    expect(refuse(app)).toBe(symlinkRefusal(join(app, "lib/nav.ts")));
  });

  it("checks every destination before it writes any", () => {
    // components/shell sorts first and is free; lib/nav.ts exists.
    const app = makeApp({ ...APP, "lib/nav.ts": "mine\n" });
    refuse(app);
    expect(() => lstatSync(join(app, "components"))).toThrow(/ENOENT/);
  });
});

describe("add refuses a recipe it cannot trust, writing nothing", () => {
  const manifestRefusal = (
    manifest: unknown,
    files: Record<string, string> = FILES,
  ) => refuse(makeApp(), { recipesRoot: makeRecipes(manifest, files) });

  it.each([
    ["package.json", "package.json"],
    ["a nested package.json", "components/x/package.json"],
    ["a package.json in another case", "lib/Package.JSON"],
    ["a lockfile", "pnpm-lock.yaml"],
    ["bun.lockb", "bun.lockb"],
    ["a nested package-lock.json", "lib/package-lock.json"],
    ["a nested yarn.lock", "lib/yarn.lock"],
    ["a nested bun.lock", "lib/bun.lock"],
    ["tsconfig.json", "tsconfig.json"],
    ["a tsconfig.json in another case", "lib/TSConfig.json"],
    ["next.config.ts", "next.config.ts"],
    ["next.config.mjs", "lib/next.config.mjs"],
    ["next.config with no extension", "lib/next.config"],
  ])("with %s under files/", (_, name) => {
    expect(manifestRefusal(MANIFEST, { ...FILES, [name]: "{}\n" })).toBe(
      `The recipe would write ${JSON.stringify(name)}, which add never writes: remove it from the recipe.`,
    );
  });

  // Package-manager config the protected list does not name: any file
  // directly at the app root is refused, so the class is closed.
  it.each([
    "bunfig.toml",
    "pnpm-workspace.yaml",
    "npm-shrinkwrap.json",
    "package.yaml",
    "README.md",
  ])("with %j directly at the root of files/", (name) => {
    expect(manifestRefusal(MANIFEST, { ...FILES, [name]: "x\n" })).toBe(
      `The recipe would write ${JSON.stringify(name)} directly at the app root, which add never does: move it into a directory in the recipe's files/.`,
    );
  });

  it.skipIf(caseInsensitive())(
    "with two files under files/ whose names differ only in case",
    () => {
      // Only a case-sensitive file system can hold both, so this runs on Linux.
      expect(
        manifestRefusal(MANIFEST, { ...FILES, "lib/Nav.ts": "other\n" }),
      ).toBe(
        `The recipe's files/ holds more than one file named "lib/nav.ts" when case is ignored: rename or remove one in the recipe.`,
      );
    },
  );

  it("with an empty files/, naming the recipe's files as what to fix", () => {
    const recipes = makeRecipes();
    rmSync(join(recipes, "app-shell/files"), { recursive: true });
    mkdirSync(join(recipes, "app-shell/files"));
    expect(refuse(makeApp(), { recipesRoot: recipes })).toBe(
      `The recipe at ${JSON.stringify(join(recipes, "app-shell/files"))} holds no files: it is missing, empty or misplaced, so add wrote nothing: fix the recipe's files/ directory.`,
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
    "lib/.ENV",
  ])("with a template destination of %j", (dest) => {
    expect(
      manifestRefusal({
        ...MANIFEST,
        templates: { ...MANIFEST.templates, "app/layout.tsx": dest },
      }),
    ).toBe(
      `The recipe would write ${JSON.stringify(dest)}, which add never writes: remove it from the recipe.`,
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
    ["a range that is not a string", { jotai: 3 }],
  ])("with %s", (_, dependencies) => {
    expect(manifestRefusal({ ...MANIFEST, dependencies })).toMatch(
      /^The recipe's manifest gives the dependency .* which add will not pass to a package manager: fix the recipe's recipe\.json\.$/,
    );
  });

  it.each([
    "git+ssh://git@github.com:evil/pkg.git",
    "git+https://github.com/evil/pkg.git",
    "git://github.com/evil/pkg.git",
    "https://evil.example/x.tgz",
    "http://evil.example/x.tgz",
    "file:../../../../etc",
    "link:/",
    "npm:evil-pkg@1.0.0",
    "github:evil/pkg",
    "evil/pkg",
    "latest",
    "next",
    "workspace:foo",
    "workspace:^1.0.0",
    "workspace:",
    ">=1.0.0",
    "<2",
    ">=1 <2",
    "1.x",
    "*",
    "1.0.0 - 2.0.0",
    "^1 || ^2",
    "=1.0.0",
    "v1.0.0",
    "1.0.0.0",
    "1.0.0+build",
    "^1.0.0-",
    "--global",
    "-1",
    "^1;rm",
    "`x`",
    "",
  ])("with the range %j", (range) => {
    expect(
      manifestRefusal({ ...MANIFEST, dependencies: { jotai: range } }),
    ).toBe(
      `The recipe's manifest gives the dependency "jotai" the range ${JSON.stringify(range)}, which add will not pass to a package manager: fix the recipe's recipe.json.`,
    );
  });

  it.each([
    "1.2.3",
    "^3.0.2",
    "~1.2.3",
    "^0.10.0",
    "3",
    "^3.0",
    "1.0.0-beta.1",
    "^2.0.0-rc.0",
  ])("passes the range %j through", (range) => {
    const recipes = makeRecipes({
      ...MANIFEST,
      dependencies: { jotai: range },
    });
    const { code, calls } = cli(["add", "app-shell"], {
      cwd: makeApp(),
      recipesRoot: recipes,
    });
    expect(code).toBe(0);
    expect(calls[0]?.args).toEqual(["add", `jotai@${range}`]);
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
      `Unexpected argument "extra": add takes one recipe, so pass uiid-recipes add <recipe> and nothing more.`,
    ],
    [
      ["add", "app-shell", "--cwd"],
      `--cwd needs a directory: pass --cwd <dir>.`,
    ],
    [
      ["add", "app-shell", "--cwd="],
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
    expect(source).toContain(`from "./cli.ts"`);
    expect(source).toContain("runCli(process.argv.slice(2)");
  });

  // These start only the Node binary running these tests, never a package
  // manager. `--help` and an unknown recipe both stop before any app is read,
  // so the bin runs end to end under plain `node` with nothing to write.
  const bin = join(RECIPES_ROOT, "src/cli.mjs");
  const runBin = (args: string[]) =>
    spawnSync(process.execPath, [bin, ...args], {
      cwd: tempDir(),
      encoding: "utf8",
    });

  it("prints usage and exits 0 for --help under plain node", () => {
    const result = runBin(["--help"]);
    expect(result.status).toBe(0);
    expect(result.stdout).toMatch(/^Usage: uiid-recipes add <recipe>/);
  });

  it("exits 1 with one line on stderr for an unknown recipe under plain node", () => {
    const result = runBin(["add", "no-such-recipe"]);
    expect(result.status).toBe(1);
    expect(result.stdout).toBe("");
    expect(result.stderr).toMatch(
      /^There is no recipe named "no-such-recipe": choose one of [^\n]*\.\n$/,
    );
  });
});

describe("spawnRunner", () => {
  // Runs the Node binary that runs these tests, never a package manager.
  const node = process.execPath;
  const cwd = () => tempDir();

  it("returns the child's exit code", () => {
    expect(spawnRunner(node, ["-e", "process.exit(3)"], cwd())).toBe(3);
    expect(spawnRunner(node, ["-e", ""], cwd())).toBe(0);
  });

  it("counts a child killed by a signal as a failure", () => {
    expect(
      spawnRunner(node, ["-e", "process.kill(process.pid, 'SIGKILL')"], cwd()),
    ).not.toBe(0);
  });

  it("passes arguments literally, with no shell", () => {
    const script =
      "process.exit(process.argv[1] === '$HOME' && process.argv[2] === 'a;b' ? 0 : 5)";
    expect(spawnRunner(node, ["-e", script, "$HOME", "a;b"], cwd())).toBe(0);
  });

  it("runs in the directory it is given", () => {
    const dir = cwd();
    const script = `process.exit(process.cwd() === ${JSON.stringify(dir)} ? 0 : 5)`;
    expect(spawnRunner(node, ["-e", script], dir)).toBe(0);
  });

  it("throws when the command cannot start", () => {
    expect(() =>
      spawnRunner(join(cwd(), "no-such-command"), [], cwd()),
    ).toThrow(/ENOENT/);
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
    expect(refuse(app, { recipesRoot: RECIPES_ROOT, repoRoot: repo })).toBe(
      workspaceRefusal(`"@uiid/design-system" and "@uiid/icons"`),
    );
  });

  it("is refused in a directory of the repository that is not a workspace member", () => {
    const { repo } = inWorkspace();
    const app = join(repo, "scratch/web");
    write(app, APP);
    expect(refuse(app, { recipesRoot: RECIPES_ROOT, repoRoot: repo })).toBe(
      workspaceRefusal(`"@uiid/design-system" and "@uiid/icons"`),
    );
  });
});

describe("workspace membership", () => {
  const WORKSPACE_RECIPE = {
    ...MANIFEST,
    dependencies: { "@uiid/design-system": "workspace:^" },
  };
  /** A fake repository with `yaml` as its workspace file and an app at `appPath`. */
  const repoWith = (yaml: string, appPath: string) => {
    const repo = tempDir();
    write(repo, {
      "pnpm-workspace.yaml": yaml,
      "pnpm-lock.yaml": "lockfileVersion: '9.0'\n",
    });
    const files: Record<string, string> = { ...APP };
    delete files["pnpm-lock.yaml"];
    write(join(repo, appPath), files);
    return { repo, app: join(repo, appPath) };
  };
  const options = (repo: string) => ({
    recipesRoot: makeRecipes(WORKSPACE_RECIPE),
    repoRoot: repo,
  });

  it("passes workspace:^ through, like workspace:*, in a member with unquoted patterns", () => {
    const { repo, app } = repoWith("packages:\n  - apps/*\n", "apps/web");
    const { code, calls } = cli(["add", "app-shell"], {
      cwd: app,
      ...options(repo),
    });
    expect(code).toBe(0);
    expect(calls[0]?.args).toEqual(["add", "@uiid/design-system@workspace:^"]);
  });

  it("refuses workspace:^ outside the workspace, like workspace:*", () => {
    const { repo } = repoWith("packages:\n  - apps/*\n", "apps/web");
    expect(refuse(makeApp(), options(repo))).toBe(
      workspaceRefusal(`"@uiid/design-system"`),
    );
  });

  it("does not count a directory a ! pattern excludes", () => {
    const { repo, app } = repoWith(
      `packages:\n  - "apps/*"\n  - "!apps/web"\n`,
      "apps/web",
    );
    expect(refuse(app, options(repo))).toBe(
      workspaceRefusal(`"@uiid/design-system"`),
    );
  });

  it("does not let * match a dot-named directory", () => {
    const { repo, app } = repoWith("packages:\n  - apps/*\n", "apps/.web");
    expect(refuse(app, options(repo))).toBe(
      workspaceRefusal(`"@uiid/design-system"`),
    );
  });

  // Read-only: parses this repository's own pnpm-workspace.yaml.
  it("counts apps/docs as a member of this repository and apps-old/x as not", () => {
    expect(workspaceRootOf(join(REPO_ROOT, "apps/docs"), REPO_ROOT)).toBe(
      realpathSync(REPO_ROOT),
    );
    expect(
      workspaceRootOf(join(REPO_ROOT, "apps-old/x"), REPO_ROOT),
    ).toBeUndefined();
  });
});
