// @vitest-environment node
import {
  linkSync,
  lstatSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  rmSync,
  symlinkSync,
  writeFileSync,
} from "node:fs";
import { join } from "node:path";

import { afterAll, describe, expect, it } from "vitest";

import { LAYOUT_WIRING, type Runner } from "./add.ts";
import { runCli, USAGE } from "./cli.ts";
import { CREATE_NEXT_APP } from "./create.ts";
import { APP_SHELL_FILES, RECIPES_ROOT, REPO_ROOT } from "./paths.ts";
import { compareRecipe } from "./recipes.ts";
import {
  removeTempDirs,
  snapshot,
  tempDir,
  withFiles,
  write,
} from "./test-utils.ts";

// Every test works in new directories under the OS temp directory. No test
// starts create-next-app, npx or a package manager: the runner is always a
// stub that records its calls, and stands in for the scaffold by writing a
// small fake app into the directory it was asked to create.
afterAll(removeTempDirs);

const q = (value: string) => JSON.stringify(value);

/** A trimmed version of what create-next-app 16 writes with the flags create passes. */
const SCAFFOLD: Record<string, string> = {
  "package.json": JSON.stringify({
    name: "web",
    private: true,
    scripts: { dev: "next dev", build: "next build", start: "next start" },
    dependencies: { next: "16.4.6", react: "19.2.0", "react-dom": "19.2.0" },
    devDependencies: { typescript: "^5", "@types/react": "^19" },
  }),
  "package-lock.json": "{}\n",
  "tsconfig.json": `{
  "compilerOptions": {
    "strict": true,
    "paths": { "@/*": ["./*"] }
  }
}
`,
  "next.config.ts": "export default {};\n",
  "AGENTS.md": "# Agents\n",
  "app/layout.tsx": "export default function Layout() {}\n",
  "app/globals.css": ":root {}\n",
  "app/page.tsx": "export default function Page() {}\n",
  "app/page.module.css": ".page {}\n",
  "public/next.svg": "<svg/>\n",
};

const FILES = {
  "components/shell/shell.tsx": "export const Shell = 1;\n",
  "components/sidebar/sidebar.tsx": "export const Sidebar = 1;\n",
  "lib/nav.ts": "export type Nav = string;\n",
};
const TEMPLATES = {
  "nav.ts": "export const NAV = [];\n",
  "app/layout.tsx": "export default function ShellLayout() {}\n",
  "app/globals.css": `@import "@uiid/design-system/globals.css";\n`,
  "app/page.tsx": "export default function Home() {}\n",
  "app/guides/page.tsx": "export default function Guides() {}\n",
};
const MANIFEST = {
  name: "app-shell",
  dependencies: { "@uiid/design-system": "^0.10.0", jotai: "^3.0.2" },
  templates: Object.fromEntries(Object.keys(TEMPLATES).map((k) => [k, k])),
};

/** A recipes root holding one recipe, `app-shell`. */
const makeRecipes = (manifest: unknown = MANIFEST) => {
  const root = tempDir();
  write(join(root, "app-shell/files"), FILES);
  write(join(root, "app-shell/templates"), TEMPLATES);
  write(root, { "app-shell/recipe.json": JSON.stringify(manifest) });
  return root;
};

/** The arguments create passes to npx for a directory named `name`. */
const scaffoldArgs = (name: string, ...extra: string[]) => [
  "--yes",
  "create-next-app@16",
  name,
  "--yes",
  "--ts",
  "--app",
  "--no-src-dir",
  "--no-tailwind",
  "--import-alias",
  "@/*",
  "--no-linter",
  "--no-react-compiler",
  "--no-cache-components",
  "--agents-md",
  "--no-agent-feedback",
  "--use-npm",
  ...extra,
];

type Call = { command: string; args: string[]; cwd: string };

const cli = (
  argv: string[],
  {
    cwd = tempDir(),
    recipesRoot = makeRecipes(),
    repoRoot = tempDir(),
    scaffold = SCAFFOLD,
    scaffoldStatus = 0,
    scaffoldThrows = false,
    installStatus = 0,
    onLog = () => {},
  }: {
    cwd?: string;
    recipesRoot?: string;
    repoRoot?: string;
    /** What the stub scaffold writes into the new directory; null writes nothing. */
    scaffold?: Record<string, string> | null;
    scaffoldStatus?: number;
    /** Whether the stub scaffold throws, as a missing npx does. */
    scaffoldThrows?: boolean;
    installStatus?: number;
    /** Called with each line create logs, after it is logged. */
    onLog?: (line: string) => void;
  } = {},
) => {
  const out: string[] = [];
  const err: string[] = [];
  const calls: Call[] = [];
  const run: Runner = (command, args, dir) => {
    calls.push({ command, args: [...args], cwd: dir });
    if (command !== "npx") return installStatus;
    if (scaffoldThrows) throw Object.assign(new Error("x"), { code: "ENOENT" });
    if (scaffold) write(join(dir, args[2]), scaffold);
    return scaffoldStatus;
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

/** One sentence: it ends with a full stop and holds no other sentence end. */
const expectOneSentence = (err: string) => {
  expect(err).toMatch(/^[^\n]+\.$/);
  expect(err.slice(0, -1)).not.toMatch(/\.\s+[A-Z]/);
};

/** Runs `create` in `parent`, expecting a refusal that changes nothing in it and runs nothing. */
const refuse = (
  parent: string,
  argv: string[],
  options: Parameters<typeof cli>[1] = {},
) => {
  const before = snapshot(parent);
  const result = cli(argv, { cwd: parent, ...options });
  expect(result.code).toBe(1);
  expect(snapshot(parent)).toEqual(before);
  expect(result.calls).toEqual([]);
  expectOneSentence(result.err);
  return result.err;
};

/** Runs `create` into `<parent>/web`, expecting a failure after the scaffold that deletes nothing. */
const failAfterScaffold = (
  options: Parameters<typeof cli>[1] = {},
  parent = tempDir(),
) => {
  const root = join(parent, "web");
  const result = cli(["create", "web"], { cwd: parent, ...options });
  expect(result.code).toBe(1);
  expect(result.calls[0]).toEqual({
    command: "npx",
    args: scaffoldArgs("web"),
    cwd: parent,
  });
  expectOneSentence(result.err);
  expect(result.err).toContain(`${q(root)} left in place`);
  return { ...result, parent, root };
};

const leftInPlace = (root: string, what: string, fix = "delete it") =>
  `${what}, so create stopped with ${q(root)} left in place: ${fix}, then run create again.`;
const failedCheck = (root: string, problem: string) =>
  leftInPlace(root, `The app create-next-app made fails a check (${problem})`);

describe("create", () => {
  it("scaffolds, writes the recipe and every template, replaces the three starter files and installs", () => {
    const parent = tempDir();
    const root = join(parent, "web");
    const recipes = makeRecipes();
    const { code, out, err, calls } = cli(["create", "web"], {
      cwd: parent,
      recipesRoot: recipes,
    });
    expect(err).toBe("");
    expect(code).toBe(0);
    expect(calls).toEqual([
      { command: "npx", args: scaffoldArgs("web"), cwd: parent },
      {
        command: "npm",
        args: ["install", "@uiid/design-system@^0.10.0", "jotai@^3.0.2"],
        cwd: root,
      },
    ]);
    // The fake scaffold, plus exactly the recipe's files and the templates,
    // with the three replaced files holding the templates' bytes.
    expect(snapshot(parent)).toEqual(
      withFiles(
        { web: "dir" },
        {
          ...Object.fromEntries(
            Object.entries(SCAFFOLD).map(([k, v]) => [`web/${k}`, v]),
          ),
          ...Object.fromEntries(
            Object.entries({ ...FILES, ...TEMPLATES }).map(([k, v]) => [
              `web/${k}`,
              v,
            ]),
          ),
        },
      ),
    );
    expect(compareRecipe(join(recipes, "app-shell/files"), root)).toEqual({
      changed: [],
      missing: [],
      extra: [],
      extraDirectories: [],
    });
    expect(out).toContain(`wrote    "components/shell/shell.tsx"`);
    expect(out).toContain(`wrote    "nav.ts"`);
    expect(out).toContain(`wrote    "app/guides/page.tsx"`);
    expect(out).toContain(`replaced "app/layout.tsx"`);
    expect(out).toContain(`replaced "app/globals.css"`);
    expect(out).toContain(`replaced "app/page.tsx"`);
    // create wires the layout itself, so it prints no wiring.
    expect(out).not.toContain(LAYOUT_WIRING);
    expect(out).not.toContain("by hand");
    expect(out.split("\n").at(-1)).toBe(
      `uiid-recipes create: made the app in ${q(root)}; start it by running npm run dev in that directory.`,
    );
  });

  it("accepts an existing empty directory, a nested path and a dot-named parent", () => {
    const parent = tempDir();
    mkdirSync(join(parent, ".x/web"), { recursive: true });
    const { code, calls } = cli(["create", ".x/web"], { cwd: parent });
    expect(code).toBe(0);
    expect(calls[0]).toEqual({
      command: "npx",
      args: scaffoldArgs("web"),
      cwd: join(parent, ".x"),
    });
    expect(calls[1]?.cwd).toBe(join(parent, ".x/web"));
  });

  it("accepts create . in an empty directory, scaffolding it from its parent", () => {
    const parent = tempDir();
    mkdirSync(join(parent, "web"));
    const { code, calls } = cli(["create", "."], { cwd: join(parent, "web") });
    expect(code).toBe(0);
    expect(calls[0]).toEqual({
      command: "npx",
      args: scaffoldArgs("web"),
      cwd: parent,
    });
    expect(calls[1]?.cwd).toBe(join(parent, "web"));
  });

  it("accepts an absolute directory and resolves a symlinked parent to its real path", () => {
    const real = tempDir();
    const link = join(tempDir(), "link");
    symlinkSync(real, link);
    const { code, calls } = cli(["create", join(link, "web")]);
    expect(code).toBe(0);
    expect(calls[0]?.cwd).toBe(real);
    expect(readFileSync(join(real, "web/lib/nav.ts"), "utf8")).toBe(
      FILES["lib/nav.ts"],
    );
  });

  it("skips the install when the recipe has no dependencies", () => {
    const parent = tempDir();
    const { code, calls } = cli(["create", "web"], {
      cwd: parent,
      recipesRoot: makeRecipes({ ...MANIFEST, dependencies: {} }),
    });
    expect(code).toBe(0);
    expect(calls.map((call) => call.command)).toEqual(["npx"]);
  });

  it("pins create-next-app to the major of next the recipe is built on, in the docs app", () => {
    const docs = JSON.parse(
      readFileSync(join(REPO_ROOT, "apps/docs/package.json"), "utf8"),
    );
    const major = /^\^?(\d+)\./.exec(docs.dependencies.next)?.[1];
    expect(CREATE_NEXT_APP).toBe(`create-next-app@${major}`);
  });
});

describe("create --dry-run", () => {
  it("does not say an existing empty directory was not created", () => {
    const parent = tempDir();
    mkdirSync(join(parent, "web"));
    const before = snapshot(parent);
    const { code, out, calls } = cli(["create", "web", "--dry-run"], {
      cwd: parent,
    });
    expect(code).toBe(0);
    expect(calls).toEqual([]);
    expect(snapshot(parent)).toEqual(before);
    expect(out.split("\n")[0]).toBe(
      `uiid-recipes create --dry-run: nothing was run or written in ${q(join(parent, "web"))}`,
    );
  });

  it("prints the scaffold, each file and the install, and runs and writes nothing", () => {
    const parent = tempDir();
    const before = snapshot(parent);
    const { code, out, calls } = cli(["create", "web", "--dry-run"], {
      cwd: parent,
    });
    expect(code).toBe(0);
    expect(calls).toEqual([]);
    expect(snapshot(parent)).toEqual(before);
    expect(() => lstatSync(join(parent, "web"))).toThrow(/ENOENT/);
    expect(out.split("\n")).toEqual([
      `uiid-recipes create --dry-run: nothing was run or written, and ${q(join(parent, "web"))} was not created`,
      `  would run     npx ${scaffoldArgs("web")
        .map((arg) => (arg === "@/*" ? `'@/*'` : arg))
        .join(" ")} in ${q(parent)}`,
      `  would write   "components/shell/shell.tsx"`,
      `  would write   "components/sidebar/sidebar.tsx"`,
      `  would write   "lib/nav.ts"`,
      `  would write   "nav.ts"`,
      `  would replace "app/layout.tsx"`,
      `  would replace "app/globals.css"`,
      `  would replace "app/page.tsx"`,
      `  would write   "app/guides/page.tsx"`,
      `  would run     npm install '@uiid/design-system@^0.10.0' 'jotai@^3.0.2'`,
    ]);
  });

  it("still refuses what create would refuse", () => {
    const parent = tempDir();
    write(parent, { "web/x": "\n" });
    expect(refuse(parent, ["create", "web", "--dry-run"])).toBe(
      `${q(join(parent, "web"))} is not empty, so create changed nothing: name a directory that does not exist yet, or an empty one.`,
    );
  });
});

describe("create refuses before running anything", () => {
  const notEmpty = (root: string) =>
    `${q(root)} is not empty, so create changed nothing: name a directory that does not exist yet, or an empty one.`;

  it.each(["README.md", ".git", ".DS_Store", "node_modules/x"])(
    "a directory holding %j, changing nothing in it",
    (entry) => {
      const parent = tempDir();
      write(join(parent, "web"), { [entry]: "x\n" });
      expect(refuse(parent, ["create", "web"])).toBe(
        notEmpty(join(parent, "web")),
      );
    },
  );

  it("a directory holding only an empty directory", () => {
    const parent = tempDir();
    mkdirSync(join(parent, "web/empty"), { recursive: true });
    expect(refuse(parent, ["create", "web"])).toBe(
      notEmpty(join(parent, "web")),
    );
  });

  it("a directory that is a file", () => {
    const parent = tempDir();
    write(parent, { web: "a file\n" });
    expect(refuse(parent, ["create", "web"])).toBe(
      `${q(join(parent, "web"))} is not a directory: name a directory that does not exist yet, or an empty one.`,
    );
  });

  it.each([
    ["an empty directory", (dir: string) => mkdirSync(dir)],
    ["nothing", () => {}],
  ])("a directory that is a symlink to %s", (_, make) => {
    const parent = tempDir();
    const target = join(tempDir(), "real");
    make(target);
    symlinkSync(target, join(parent, "web"));
    expect(refuse(parent, ["create", "web"])).toBe(
      `${q(join(parent, "web"))} is a symlink, which create does not follow: name a directory that does not exist yet, or an empty one.`,
    );
  });

  it("a parent that does not exist", () => {
    const parent = tempDir();
    expect(refuse(parent, ["create", "missing/web"])).toBe(
      `The parent directory of ${q(join(parent, "missing/web"))} does not exist: create it first, or name a directory inside one that exists.`,
    );
  });

  it("a parent that is a file", () => {
    const parent = tempDir();
    write(parent, { file: "\n" });
    expect(refuse(parent, ["create", "file/web"])).toBe(
      `The parent directory of ${q(join(parent, "file/web"))} is not a directory: name a directory inside one that exists.`,
    );
  });

  it.each([
    "Web",
    "my app",
    "_web",
    ".web",
    "-web",
    "http",
    "node_modules",
    "favicon.ico",
    "a".repeat(215),
  ])("a directory named %j, which create-next-app would not accept", (name) => {
    const parent = tempDir();
    expect(refuse(parent, ["create", `./${name}`])).toBe(
      `The directory name ${q(name)} is not one create-next-app accepts as a package name: use lower-case letters, digits, ".", "_" and "-", starting with a letter or a digit, and not a Node.js module name such as "http".`,
    );
  });

  // Package-manager config a template could plant where the install that
  // follows reads it. Only nav.ts may land at the app root.
  it.each([
    ".pnpmfile.cjs",
    "pnpm-workspace.yaml",
    "bunfig.toml",
    ".yarnrc.yml",
  ])("a template destination of %j at the app root", (dest) => {
    const parent = tempDir();
    const recipes = makeRecipes({
      ...MANIFEST,
      templates: { ...MANIFEST.templates, "app/guides/page.tsx": dest },
    });
    expect(refuse(parent, ["create", "web"], { recipesRoot: recipes })).toBe(
      `The recipe's manifest maps the template "app/guides/page.tsx" to ${q(dest)} at the app root, where only "nav.ts" may go: fix the recipe's recipe.json.`,
    );
  });

  it("a recipe whose manifest is not JSON", () => {
    const parent = tempDir();
    const recipes = makeRecipes();
    writeFileSync(join(recipes, "app-shell/recipe.json"), "{ nope");
    expect(refuse(parent, ["create", "web"], { recipesRoot: recipes })).toBe(
      `The recipe's manifest is not valid JSON: fix the recipe's recipe.json.`,
    );
  });

  it("a dependency range add would refuse", () => {
    const parent = tempDir();
    const recipes = makeRecipes({
      ...MANIFEST,
      dependencies: { jotai: "latest" },
    });
    expect(refuse(parent, ["create", "web"], { recipesRoot: recipes })).toBe(
      `The recipe's manifest gives the dependency "jotai" the range "latest", which create will not pass to a package manager: fix the recipe's recipe.json.`,
    );
  });

  it("a protected template destination", () => {
    const parent = tempDir();
    const recipes = makeRecipes({
      ...MANIFEST,
      templates: { ...MANIFEST.templates, "nav.ts": ".env" },
    });
    expect(refuse(parent, ["create", "web"], { recipesRoot: recipes })).toBe(
      `The recipe would write ".env", which create never writes: remove it from the recipe.`,
    );
  });

  it("a template destination outside the app", () => {
    const parent = tempDir();
    const recipes = makeRecipes({
      ...MANIFEST,
      templates: { ...MANIFEST.templates, "nav.ts": "../nav.ts" },
    });
    expect(refuse(parent, ["create", "web"], { recipesRoot: recipes })).toBe(
      `The recipe's manifest maps "nav.ts" to "../nav.ts", which is not a plain relative path inside the app: fix the recipe's recipe.json.`,
    );
  });

  it("a file directly at the root of files/", () => {
    const parent = tempDir();
    const recipes = makeRecipes();
    write(recipes, { "app-shell/files/bunfig.toml": "x\n" });
    expect(refuse(parent, ["create", "web"], { recipesRoot: recipes })).toBe(
      `The recipe would write "bunfig.toml" directly at the app root, which create never does: move it into a directory in the recipe's files/.`,
    );
  });

  it.each(["app/layout.tsx", "app/globals.css", "app/page.tsx"])(
    "a manifest with no template for %j, which create replaces",
    (dest) => {
      const parent = tempDir();
      const templates: Record<string, string> = { ...MANIFEST.templates };
      delete templates[dest];
      const recipes = makeRecipes({ ...MANIFEST, templates });
      expect(refuse(parent, ["create", "web"], { recipesRoot: recipes })).toBe(
        `The recipe's manifest maps no template to ${q(dest)}, which create replaces: fix the recipe's recipe.json.`,
      );
    },
  );

  it("the app shell outside this repository's workspace, until its manifest has published ranges", () => {
    const parent = tempDir();
    expect(
      refuse(parent, ["create", "web"], {
        recipesRoot: RECIPES_ROOT,
        repoRoot: REPO_ROOT,
      }),
    ).toBe(
      `The recipe's manifest has no published range yet for "@uiid/design-system" and "@uiid/icons", only a workspace: range that resolves inside the UIID repository alone, so create cannot install them in ${q(join(parent, "web"))}: name a directory inside the UIID repository's workspace until the recipe has a published range.`,
    );
  });

  it("a workspace member whose workspace has no lockfile", () => {
    const repo = tempDir();
    write(repo, { "pnpm-workspace.yaml": "packages:\n  - apps/*\n" });
    mkdirSync(join(repo, "apps"));
    expect(
      refuse(repo, ["create", "apps/web"], {
        recipesRoot: RECIPES_ROOT,
        repoRoot: repo,
      }),
    ).toBe(
      `${q(repo)} has no lockfile at its root (pnpm-lock.yaml, package-lock.json, yarn.lock, bun.lock or bun.lockb): install the app's dependencies once with its package manager, then run create again.`,
    );
  });
});

describe("create fails after the scaffold, leaving the directory in place", () => {
  it.each([1, 130])("when create-next-app exits with code %i", (status) => {
    const { err, calls, root } = failAfterScaffold({ scaffoldStatus: status });
    expect(err).toBe(
      leftInPlace(
        root,
        `create-next-app exited with code ${status}`,
        "delete it if it exists",
      ),
    );
    expect(calls).toHaveLength(1);
    // Whatever the scaffold made is kept.
    expect(lstatSync(join(root, "app/page.tsx")).isFile()).toBe(true);
  });

  it("when create-next-app cannot start", () => {
    const { err, calls, root } = failAfterScaffold({ scaffoldThrows: true });
    expect(err).toBe(
      leftInPlace(
        root,
        "create-next-app could not start (ENOENT)",
        "delete it if it exists",
      ),
    );
    expect(calls).toHaveLength(1);
  });

  it("when create-next-app exits 0 but makes nothing", () => {
    const { err, calls, root } = failAfterScaffold({ scaffold: null });
    expect(err).toBe(
      leftInPlace(
        root,
        "create-next-app exited 0 but made no app",
        "delete it if it exists",
      ),
    );
    expect(calls).toHaveLength(1);
  });

  it("when create-next-app leaves an existing empty directory empty", () => {
    const parent = tempDir();
    mkdirSync(join(parent, "web"));
    const { code, err } = cli(["create", "web"], {
      cwd: parent,
      scaffold: null,
    });
    expect(code).toBe(1);
    expect(err).toBe(
      leftInPlace(
        join(parent, "web"),
        "create-next-app exited 0 but made no app",
        "delete it if it exists",
      ),
    );
    expect(lstatSync(join(parent, "web")).isDirectory()).toBe(true);
  });

  const scaffoldWith = (changes: Record<string, string | null>) => {
    const files: Record<string, string> = { ...SCAFFOLD };
    for (const [name, source] of Object.entries(changes)) {
      if (source === null) delete files[name];
      else files[name] = source;
    }
    return files;
  };
  const withPackage = (pkg: unknown) =>
    scaffoldWith({ "package.json": JSON.stringify(pkg) });
  const NEXT = { next: "16.4.6" };

  it.each([
    [
      "tailwindcss in dependencies",
      withPackage({ dependencies: { ...NEXT, tailwindcss: "^4" } }),
      `it depends on Tailwind ("tailwindcss")`,
    ],
    [
      "@tailwindcss/postcss in devDependencies",
      withPackage({
        dependencies: NEXT,
        devDependencies: { "@tailwindcss/postcss": "^4" },
      }),
      `it depends on Tailwind ("@tailwindcss/postcss")`,
    ],
    [
      "a postcss.config.mjs",
      scaffoldWith({ "postcss.config.mjs": "export default {};\n" }),
      `it has a PostCSS config ("postcss.config.mjs")`,
    ],
    [
      "both",
      {
        ...withPackage({
          dependencies: NEXT,
          devDependencies: { tailwindcss: "^4", "@tailwindcss/postcss": "^4" },
        }),
        "postcss.config.js": "\n",
        "postcss.config.mjs": "\n",
      },
      `it depends on Tailwind ("tailwindcss", "@tailwindcss/postcss") and it has a PostCSS config ("postcss.config.js", "postcss.config.mjs")`,
    ],
    [
      "a .postcssrc",
      scaffoldWith({ ".postcssrc": "{}\n" }),
      `it has a PostCSS config (".postcssrc")`,
    ],
    [
      "a .postcssrc.json",
      scaffoldWith({ ".postcssrc.json": "{}\n" }),
      `it has a PostCSS config (".postcssrc.json")`,
    ],
    [
      "a postcss key in package.json",
      withPackage({ dependencies: NEXT, postcss: { plugins: {} } }),
      `it has a PostCSS config (the "postcss" key in package.json)`,
    ],
  ])("when the app has %s", (_, scaffold, problem) => {
    const { err, calls, root } = failAfterScaffold({ scaffold });
    expect(err).toBe(failedCheck(root, problem));
    expect(calls).toHaveLength(1);
    // The app is exactly what the scaffold made: nothing written, nothing deleted.
    expect(snapshot(root)).toEqual(withFiles({}, scaffold));
  });

  it.each([
    [
      "no next",
      withPackage({ dependencies: { react: "19.2.0" } }),
      (root: string) =>
        `The package.json in ${q(root)} does not list next in dependencies or devDependencies`,
    ],
    [
      "src/app instead of app/",
      {
        ...scaffoldWith({
          "app/layout.tsx": null,
          "app/globals.css": null,
          "app/page.tsx": null,
          "app/page.module.css": null,
        }),
        "src/app/page.tsx": "\n",
      },
      (root: string) =>
        `${q(root)} keeps its app in src/app, which create does not support`,
    ],
    [
      "no @/* alias",
      scaffoldWith({ "tsconfig.json": `{ "compilerOptions": {} }` }),
      (root: string) =>
        `The tsconfig.json in ${q(root)} has no "@/*" path whose first target is "./*"`,
    ],
    [
      "a baseUrl elsewhere",
      scaffoldWith({
        "tsconfig.json": JSON.stringify({
          compilerOptions: { baseUrl: "src", paths: { "@/*": ["./*"] } },
        }),
      }),
      (root: string) =>
        `The tsconfig.json in ${q(root)} sets baseUrl to "src", so "@/*" does not resolve from the app root`,
    ],
    [
      "no lockfile",
      scaffoldWith({ "package-lock.json": null }),
      (root: string) =>
        `${q(root)} has no lockfile at its root (pnpm-lock.yaml, package-lock.json, yarn.lock, bun.lock or bun.lockb)`,
    ],
    [
      "two lockfiles",
      scaffoldWith({ "pnpm-lock.yaml": "\n" }),
      (root: string) =>
        `${q(root)} has lockfiles for more than one package manager (pnpm, npm)`,
    ],
    [
      "a nav.ts already",
      scaffoldWith({ "nav.ts": "\n" }),
      () => `These files already exist: "nav.ts"`,
    ],
    [
      "a recipe file already",
      scaffoldWith({ "lib/nav.ts": "\n", "app/guides/page.tsx": "\n" }),
      () => `These files already exist: "app/guides/page.tsx", "lib/nav.ts"`,
    ],
    [
      "a file where the recipe needs a directory",
      scaffoldWith({ lib: "\n" }),
      (root: string) =>
        `"lib" in ${q(root)} is a file where the recipe needs a directory`,
    ],
    [
      "no app/globals.css to replace",
      scaffoldWith({ "app/globals.css": null }),
      (root: string) =>
        `There is no regular file at "app/globals.css" in ${q(root)} to replace`,
    ],
  ])("when the app has %s", (_, scaffold, problem) => {
    const { err, calls, root } = failAfterScaffold({ scaffold });
    expect(err).toBe(failedCheck(root, problem(root)));
    expect(calls).toHaveLength(1);
    // The app is exactly what the scaffold made: nothing written, nothing deleted.
    expect(snapshot(root)).toEqual(withFiles({}, scaffold));
  });

  it("checks the way to a file it replaces again right before replacing it", () => {
    // app/ becomes a link to a directory holding layout.tsx after nav.ts,
    // the first template, is written.
    const outside = tempDir();
    write(outside, { "layout.tsx": "outside\n" });
    const parent = tempDir();
    const root = join(parent, "web");
    const { err } = failAfterScaffold(
      {
        onLog: (line) => {
          if (line === `  wrote    "nav.ts"`) {
            rmSync(join(root, "app"), { recursive: true });
            symlinkSync(outside, join(root, "app"));
          }
        },
      },
      parent,
    );
    expect(readFileSync(join(outside, "layout.tsx"), "utf8")).toBe("outside\n");
    expect(readdirSync(outside)).toEqual(["layout.tsx"]);
    expect(err).toBe(
      leftInPlace(
        root,
        `Writing "app/layout.tsx" failed (Refusing to follow the symlink at ${q(join(root, "app"))})`,
      ),
    );
  });

  it("replaces a starter file that is hard-linked elsewhere with a new file, leaving the other link alone", () => {
    const outside = tempDir();
    write(outside, { "page.tsx": "outside\n" });
    const parent = tempDir();
    const root = join(parent, "web");
    const run: Runner = (command, args, dir) => {
      if (command !== "npx") return 0;
      write(join(dir, args[2]), { ...SCAFFOLD });
      rmSync(join(dir, args[2], "app/page.tsx"));
      linkSync(join(outside, "page.tsx"), join(dir, args[2], "app/page.tsx"));
      return 0;
    };
    const code = runCli(["create", "web"], {
      cwd: parent,
      recipesRoot: makeRecipes(),
      repoRoot: tempDir(),
      run,
      log: () => {},
      error: () => {},
    });
    expect(code).toBe(0);
    expect(readFileSync(join(outside, "page.tsx"), "utf8")).toBe("outside\n");
    expect(readFileSync(join(root, "app/page.tsx"), "utf8")).toBe(
      TEMPLATES["app/page.tsx"],
    );
  });

  it("when a file create replaces is a symlink, writing nothing through it", () => {
    const outside = tempDir();
    write(outside, { "page.tsx": "outside\n" });
    const parent = tempDir();
    const root = join(parent, "web");
    const run: Runner = (command, args, dir) => {
      if (command !== "npx") return 0;
      write(join(dir, args[2]), { ...SCAFFOLD });
      rmSync(join(dir, args[2], "app/page.tsx"));
      symlinkSync(
        join(outside, "page.tsx"),
        join(dir, args[2], "app/page.tsx"),
      );
      return 0;
    };
    const err: string[] = [];
    const code = runCli(["create", "web"], {
      cwd: parent,
      recipesRoot: makeRecipes(),
      repoRoot: tempDir(),
      run,
      log: () => {},
      error: (line) => err.push(line),
    });
    expect(code).toBe(1);
    expect(err.join("\n")).toBe(
      failedCheck(
        root,
        `Refusing to follow the symlink at ${q(join(root, "app/page.tsx"))}`,
      ),
    );
    expect(readFileSync(join(outside, "page.tsx"), "utf8")).toBe("outside\n");
  });

  it("when a write fails partway, keeping what was written and running no install", () => {
    // Turns lib/ into a file after the first write, whatever user runs this.
    const parent = tempDir();
    const root = join(parent, "web");
    const { err, calls, out } = failAfterScaffold(
      {
        onLog: (line) => {
          if (line === `  wrote    "components/shell/shell.tsx"`) {
            writeFileSync(join(root, "lib"), "a file\n");
          }
        },
      },
      parent,
    );
    expect(calls).toHaveLength(1);
    expect(out).toContain(`wrote    "components/sidebar/sidebar.tsx"`);
    expect(err).toBe(
      leftInPlace(
        root,
        `Writing "lib/nav.ts" failed (ENOTDIR at ${q(join(root, "lib/nav.ts"))})`,
      ),
    );
    expect(readFileSync(join(root, "components/shell/shell.tsx"), "utf8")).toBe(
      FILES["components/shell/shell.tsx"],
    );
  });

  it("never replaces a nav.ts that appears after the checks", () => {
    const parent = tempDir();
    const root = join(parent, "web");
    const { err, calls } = failAfterScaffold(
      {
        onLog: (line) => {
          if (line === `  wrote    "lib/nav.ts"`) {
            writeFileSync(join(root, "nav.ts"), "planted\n");
          }
        },
      },
      parent,
    );
    expect(calls).toHaveLength(1);
    expect(readFileSync(join(root, "nav.ts"), "utf8")).toBe("planted\n");
    expect(err).toBe(
      leftInPlace(
        root,
        `Writing "nav.ts" failed (EEXIST at ${q(join(root, "nav.ts"))})`,
      ),
    );
  });

  it("never replaces a starter file that stopped being a regular file after the checks", () => {
    const parent = tempDir();
    const root = join(parent, "web");
    const { err } = failAfterScaffold(
      {
        onLog: (line) => {
          if (line === `  wrote    "nav.ts"`) {
            rmSync(join(root, "app/layout.tsx"));
            mkdirSync(join(root, "app/layout.tsx"));
          }
        },
      },
      parent,
    );
    expect(err).toBe(
      leftInPlace(
        root,
        `Writing "app/layout.tsx" failed (${q(join(root, "app/layout.tsx"))} is no longer a regular file)`,
      ),
    );
    expect(readdirSync(join(root, "app/layout.tsx"))).toEqual([]);
  });

  it.each([1, 254])(
    "when the install exits with code %i, naming the command to run",
    (status) => {
      const { err, calls, root } = failAfterScaffold({ installStatus: status });
      expect(calls).toHaveLength(2);
      expect(err).toBe(
        `The install failed, so create stopped with ${q(root)} left in place: run npm install '@uiid/design-system@^0.10.0' 'jotai@^3.0.2' in it by hand, or delete it and run create again.`,
      );
      // Every file is in place.
      expect(readFileSync(join(root, "app/page.tsx"), "utf8")).toBe(
        TEMPLATES["app/page.tsx"],
      );
    },
  );

  it("prints paths through JSON.stringify, even with control characters", () => {
    const parent = join(tempDir(), "p\u001b[31m\u0007");
    mkdirSync(parent);
    const { code, err } = cli(["create", "web"], {
      cwd: parent,
      scaffoldStatus: 1,
    });
    expect(code).toBe(1);
    expect(err).toContain(q(join(parent, "web")));
    expect([...err].filter((c) => c.charCodeAt(0) < 0x20)).toEqual([]);
  });
});

describe("create with the app shell recipe", () => {
  // A fake repository whose workspace holds apps/*, so the real manifest's
  // workspace: ranges pass through. Reads this package's recipe; writes only
  // into the temp directory.
  const inWorkspace = () => {
    const repo = tempDir();
    write(repo, {
      "pnpm-workspace.yaml": `packages:\n  - "apps/*"\n`,
      "pnpm-lock.yaml": "lockfileVersion: '9.0'\n",
    });
    mkdirSync(join(repo, "apps"));
    return repo;
  };
  const MEMBER_SCAFFOLD: Record<string, string> = { ...SCAFFOLD };
  // create-next-app writes no lockfile with --skip-install.
  delete MEMBER_SCAFFOLD["package-lock.json"];

  it("makes a workspace app whose components/ is byte-identical to files/components", () => {
    const repo = inWorkspace();
    const root = join(repo, "apps/web");
    const { code, err, out, calls } = cli(["create", "apps/web"], {
      cwd: repo,
      recipesRoot: RECIPES_ROOT,
      repoRoot: repo,
      scaffold: MEMBER_SCAFFOLD,
    });
    expect(err).toBe("");
    expect(code).toBe(0);
    // A workspace member is installed by the workspace's package manager, so
    // create-next-app installs nothing.
    expect(calls).toEqual([
      {
        command: "npx",
        args: scaffoldArgs("web", "--skip-install"),
        cwd: join(repo, "apps"),
      },
      {
        command: "pnpm",
        args: [
          "add",
          "@uiid/design-system@workspace:*",
          "@uiid/icons@workspace:*",
          "jotai@^3.0.2",
        ],
        cwd: root,
      },
    ]);
    expect(compareRecipe(APP_SHELL_FILES, root)).toEqual({
      changed: [],
      missing: [],
      extra: [],
      extraDirectories: [],
    });
    // components/ holds exactly files/components, byte for byte.
    const components = snapshot(join(root, "components"));
    expect(components).toEqual(snapshot(join(APP_SHELL_FILES, "components")));
    // Every template is at its destination with the template's bytes.
    const manifest = JSON.parse(
      readFileSync(join(RECIPES_ROOT, "app-shell/recipe.json"), "utf8"),
    );
    for (const [key, dest] of Object.entries<string>(manifest.templates)) {
      expect(readFileSync(join(root, dest))).toEqual(
        readFileSync(join(RECIPES_ROOT, "app-shell/templates", key)),
      );
    }
    // The whole tree: the fake scaffold, the recipe's files and the templates.
    const recipeFiles = Object.fromEntries(
      Object.entries(snapshot(APP_SHELL_FILES))
        .filter(([, value]) => value !== "dir")
        .map(([path, value]) => [path, Buffer.from(value, "base64")]),
    );
    const templates = Object.fromEntries(
      Object.entries<string>(manifest.templates).map(([key, dest]) => [
        dest,
        readFileSync(join(RECIPES_ROOT, "app-shell/templates", key)),
      ]),
    );
    expect(snapshot(root)).toEqual(
      withFiles({}, { ...MEMBER_SCAFFOLD, ...recipeFiles, ...templates }),
    );
    expect(out.split("\n").at(-1)).toBe(
      `uiid-recipes create: made the app in ${q(root)}; start it by running pnpm dev in that directory.`,
    );
  });

  it("is refused in a directory of the repository that is not a workspace member", () => {
    const repo = inWorkspace();
    expect(
      refuse(repo, ["create", "web"], {
        recipesRoot: RECIPES_ROOT,
        repoRoot: repo,
      }),
    ).toMatch(
      /^The recipe's manifest has no published range yet for "@uiid\/design-system" and "@uiid\/icons", .* so create cannot install them in /,
    );
  });
});

describe("the create command line", () => {
  it("documents both commands in --help", () => {
    const { code, out } = cli(["create", "--help"]);
    expect(code).toBe(0);
    expect(out).toBe(USAGE);
    expect(USAGE).toContain(
      "uiid-recipes add <recipe> [--cwd <dir>] [--dry-run]",
    );
    expect(USAGE).toContain("uiid-recipes create <dir> [--dry-run]");
  });

  it.each([
    [
      ["create"],
      `Name the directory to create: run uiid-recipes create <dir>, such as uiid-recipes create my-app.`,
    ],
    [
      ["create", "web", "extra"],
      `Unexpected argument "extra": create takes one directory, so pass uiid-recipes create <dir> and nothing more.`,
    ],
    [
      ["create", "app-shell", "web"],
      `Unexpected argument "web": create takes one directory, so pass uiid-recipes create <dir> and nothing more.`,
    ],
    [
      ["create", "web", "--force"],
      `Unknown option "--force": run uiid-recipes --help to see the options.`,
    ],
    [
      ["create", "web", "--cwd", "x"],
      `--cwd is an option of add only: run uiid-recipes create <dir>, naming the new app's directory.`,
    ],
    [
      ["create", "web", "--cwd=x"],
      `--cwd is an option of add only: run uiid-recipes create <dir>, naming the new app's directory.`,
    ],
  ])("refuses %j with one sentence", (argv, sentence) => {
    expect(refuse(tempDir(), argv)).toBe(sentence);
  });
});
