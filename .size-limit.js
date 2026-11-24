import { existsSync, readdirSync, readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

/**
 * Size entries are generated from `packages/*`, so a new package is measured
 * without registration. There are no limits: the Size workflow measures the PR
 * and its base branch with this same config and fails on growth
 * (see packages/config/scripts/size-compare.mjs and .claude/rules/size-limit.md).
 *
 * Each entry leaves out the peer dependencies of the package it is measured
 * from. size-limit only does that for the package.json beside the config, and
 * bundling React and Base UI into every entry would bury a package's own
 * growth under code it does not ship.
 *
 * SIZE_ROOT points the config at another checkout, which is how the workflow
 * measures the base branch.
 */
const root = resolve(
  process.env.SIZE_ROOT ?? dirname(fileURLToPath(import.meta.url)),
);

/**
 * What one component costs a consumer who imports only that component from the
 * umbrella. These catch a lost tree-shake, which a barrel total cannot show.
 * Keys are the package that owns the export.
 */
const SINGLE_IMPORTS = {
  buttons: ["Button"],
  forms: ["Input", "Select", "currencyMask", "phoneMask"],
  layout: ["Stack"],
  overlays: ["Dialog"],
  tables: ["Table"],
  typography: ["Text"],
};

/**
 * Single imports that must bundle none of a dependency, by entry name. The
 * size alone cannot show that a module is absent, so these entries build with
 * a plugin that fails the run when a matching module renders any code into
 * the bundle. Input takes a mask, and masks run on Maskito, so an Input with
 * no mask must not carry it. One pattern mask must not carry the other
 * patterns, the number masks or Maskito's kit, which only they use.
 */
const MUST_EXCLUDE = {
  Input: /[\\/]@maskito[\\/]/,
  phoneMask:
    /[\\/]masks[\\/](?:number-masks|patterns[\\/](?!phone\.|patterns\.utils\.))|[\\/]@maskito[\\/]kit[\\/]/,
};

const excluding = (name, pattern) => (config) => ({
  ...config,
  plugins: [
    ...(config.plugins ?? []),
    {
      name: "size-limit-must-exclude",
      renderChunk(_, chunk) {
        const found = Object.entries(chunk.modules)
          .filter(([id, module]) => pattern.test(id) && module.renderedLength)
          .map(([id]) => id);
        if (found.length > 0) {
          this.error(
            `import { ${name} } must not bundle ${pattern}, but includes:\n${found.join("\n")}`,
          );
        }
        return null;
      },
    },
  ],
});

const packagesDir = join(root, "packages");
const umbrella = join(packagesDir, "design-system/dist/index.js");
const peers = (pkg) => Object.keys(pkg.peerDependencies ?? {});

const packages = readdirSync(packagesDir, { withFileTypes: true })
  .filter((entry) => entry.isDirectory())
  .map((entry) => {
    const dir = join(packagesDir, entry.name);
    const manifest = join(dir, "package.json");
    return existsSync(manifest)
      ? {
          dir,
          folder: entry.name,
          pkg: JSON.parse(readFileSync(manifest, "utf8")),
        }
      : null;
  })
  .filter(Boolean)
  .sort((a, b) => a.pkg.name.localeCompare(b.pkg.name));

const entries = [];

for (const { dir, folder, pkg } of packages) {
  const js = join(dir, "dist/index.js");
  if (!existsSync(js)) continue;

  entries.push({ name: pkg.name, path: js, ignore: peers(pkg) });

  const cssExport = pkg.exports?.["./globals.css"];
  // Only a built stylesheet is measured as shipped. An export that points at
  // source (tokens) is a list of `@import`s, which says nothing about size.
  const css = cssExport?.startsWith?.("./dist/") ? join(dir, cssExport) : null;
  if (css && existsSync(css)) {
    entries.push({
      name: `${pkg.name} (css)`,
      path: css,
      disablePlugins: ["@size-limit/rolldown"],
    });
  }

  // An export that this checkout does not have yet is skipped, so a base
  // branch that predates it still measures. It then reports as a new entry.
  // Only React is left out, not the umbrella's peers, so these include the
  // Base UI code the import pulls in, which is what a consumer's bundle gains.
  const barrel = readFileSync(js, "utf8");
  for (const name of SINGLE_IMPORTS[folder] ?? []) {
    if (!existsSync(umbrella) || !new RegExp(`\\b${name}\\b`).test(barrel))
      continue;
    entries.push({
      name: `import { ${name} }`,
      path: umbrella,
      import: `{ ${name} }`,
      ignore: ["react", "react-dom"],
      ...(MUST_EXCLUDE[name] && {
        modifyRolldownConfig: excluding(name, MUST_EXCLUDE[name]),
      }),
    });
  }
}

export default entries;
