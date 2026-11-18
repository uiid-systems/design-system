// @vitest-environment node
// Reads source files; needs no DOM.
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import ts from "typescript";
import { describe, expect, it } from "vitest";

// Every package's dependencies and peerDependencies should match what its
// shipped source imports. A missing entry breaks a consumer's install; an
// unused one adds install weight. This umbrella re-exports every package, so
// it is where the whole set is checked.
//
// Peers are the exception. A package also peers every peer of its @uiid
// dependencies, even one it never imports: a peer is never installed for a
// dependent, so declaring it is what tells the app to install it. It also
// keeps the package's size entry from bundling it.

const PACKAGES_DIR = fileURLToPath(new URL("../../", import.meta.url));

// Tests, examples and stories are not shipped, so their imports belong in
// devDependencies (or come from the workspace root) and are not checked here.
const NOT_SHIPPED = /\.(test|examples|stories)\.[jt]sx?$|\.d\.ts$/;
const SOURCE = /\.(m?[jt]sx?|css)$/;

// Declared on purpose without a direct source import.
const ALWAYS_ALLOWED = new Set([
  // Peer conventions for React component packages.
  "react",
  "react-dom",
  // `cva` is used through @uiid/utils, and the emitted .d.ts files import its
  // types, so a consumer's type checker needs it installed.
  "cva",
]);

// CSS modules that `composes: … from global` rely on the token compositions
// in @uiid/tokens' globals, which no import statement names.
const COMPOSES_FROM_GLOBAL = /composes:[^;]*\bfrom\s+global\b/;

function walk(dir: string, out: string[] = []): string[] {
  for (const entry of readdirSync(dir)) {
    const path = join(dir, entry);
    if (statSync(path).isDirectory()) walk(path, out);
    else out.push(path);
  }
  return out;
}

function packageName(specifier: string): string | null {
  if (/^[./#]/.test(specifier) || specifier.startsWith("node:")) return null;
  const parts = specifier.split("/");
  return specifier.startsWith("@") ? parts.slice(0, 2).join("/") : parts[0];
}

function specifiers(file: string, text: string): string[] {
  if (file.endsWith(".css")) {
    const imports = text.matchAll(/@import\s+(?:url\()?["']([^"']+)["']/g);
    const composes = text.matchAll(/composes:[^;]*\bfrom\s+["']([^"']+)["']/g);
    return [...imports, ...composes].map((match) => match[1]);
  }
  // The TypeScript scanner skips strings and template literals, so code shown
  // inside an example's <code> block is not mistaken for an import.
  return ts
    .preProcessFile(text, true, true)
    .importedFiles.map((ref) => ref.fileName);
}

const packages = readdirSync(PACKAGES_DIR)
  .filter((name) => {
    try {
      return statSync(join(PACKAGES_DIR, name, "src")).isDirectory();
    } catch {
      return false;
    }
  })
  .map((dir) => {
    const pkg = JSON.parse(
      readFileSync(join(PACKAGES_DIR, dir, "package.json"), "utf8"),
    );
    const imported = new Set<string>();
    let composesFromGlobal = false;

    for (const file of walk(join(PACKAGES_DIR, dir, "src"))) {
      if (!SOURCE.test(file) || NOT_SHIPPED.test(file)) continue;
      const text = readFileSync(file, "utf8");
      if (COMPOSES_FROM_GLOBAL.test(text)) composesFromGlobal = true;
      for (const specifier of specifiers(file, text)) {
        const name = packageName(specifier);
        if (name && name !== pkg.name) imported.add(name);
      }
    }

    const declared = new Set<string>([
      ...Object.keys(pkg.dependencies ?? {}),
      ...Object.keys(pkg.peerDependencies ?? {}),
    ]);

    return { dir, pkg, imported, declared, composesFromGlobal };
  });

const byName = new Map(packages.map((p) => [p.pkg.name as string, p]));

// The peers of a package's @uiid dependencies, which it must repeat.
function inheritedPeers(pkg: { dependencies?: Record<string, string> }) {
  return new Set(
    Object.keys(pkg.dependencies ?? {}).flatMap((name) =>
      Object.keys(byName.get(name)?.pkg.peerDependencies ?? {}),
    ),
  );
}

describe("package dependencies", () => {
  it("finds the packages", () => {
    expect(packages.length).toBeGreaterThan(10);
  });

  it.each(packages.map((p) => [p.pkg.name, p] as const))(
    "%s peers every peer of its @uiid dependencies",
    (_, { pkg }) => {
      const peers = new Set(Object.keys(pkg.peerDependencies ?? {}));
      const missing = [...inheritedPeers(pkg)].filter(
        (name) => !peers.has(name),
      );
      expect(missing).toEqual([]);
    },
  );

  it.each(packages.map((p) => [p.pkg.name, p] as const))(
    "%s declares every package its source imports",
    (_, { imported, declared }) => {
      const missing = [...imported].filter((name) => !declared.has(name));
      expect(missing).toEqual([]);
    },
  );

  it.each(packages.map((p) => [p.pkg.name, p] as const))(
    "%s declares no package its source never imports",
    (_, { pkg, imported, declared, composesFromGlobal }) => {
      const unused = [...declared].filter(
        (name) =>
          !imported.has(name) &&
          !ALWAYS_ALLOWED.has(name) &&
          !(name === "@uiid/tokens" && composesFromGlobal) &&
          !(
            name in (pkg.peerDependencies ?? {}) &&
            inheritedPeers(pkg).has(name)
          ),
      );
      expect(unused).toEqual([]);
    },
  );
});
