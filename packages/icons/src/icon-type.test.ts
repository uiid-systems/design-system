// @vitest-environment node
// Runs `tsc` over a fixture, so it needs a real filesystem and no DOM.
import { execFileSync } from "node:child_process";
import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";

import { afterAll, describe, expect, it } from "vitest";

import { ICON_TYPE_DTS } from "../scripts/emit-per-icon-modules.mjs";

// `Icon` is the public type of every `icon` prop in the system, so what it
// accepts is a contract with consumers. Vitest does not type-check and this
// package's build excludes test files, so the assignments are compiled here.
//
// Both declarations of the type are checked: src/icon-type.ts, and the mirror
// the per-icon subpath modules use. The mirror is taken from the emit script
// rather than from icons/ on disk, so a stale build cannot pass, and the
// fixture asserts the two are the same type, so one cannot change alone.
//
// The barrel's declarations are checked the same way, in a separate program
// with no lucide declarations in scope, which is how a consumer compiles it.

const require = createRequire(import.meta.url);
const TSC = require.resolve("typescript/bin/tsc");

const PKG_DIR = fileURLToPath(new URL("..", import.meta.url));
// Fixtures live inside node_modules, which is already gitignored, so they leave
// no repo residue and still resolve `react` and `lucide-react` as this package
// does. A fresh directory per program, so concurrent runs cannot collide.
const fixtureDirs: string[] = [];
const fixtureDir = () => {
  const dir = `${mkdtempSync(`${PKG_DIR}node_modules/.icon-type-test-`)}/`;
  fixtureDirs.push(dir);
  return dir;
};

// lucide ships no .d.ts beside its per-icon modules, and nothing in src imports
// them from TypeScript any more. The fixtures that compare our declarations
// with lucide's real types reach them through this ambient module instead.
const LUCIDE_DEEP_IMPORTS_DTS = `
declare module "lucide-react/dist/esm/icons/*" {
  const icon: import("lucide-react").LucideIcon;
  export default icon;
}

declare module "lucide-react/dist/esm/createLucideIcon.mjs" {
  const createLucideIcon: typeof import("lucide-react").createLucideIcon;
  export default createLucideIcon;
}
`;

const assignments = (iconTypeModule: string) => `
import { createRef, type SVGProps } from "react";

import GlobeIcon from "lucide-react/dist/esm/icons/globe.mjs";

import { LoadingSpinnerIcon } from "../../src/components/loading-spinner";
import type { Icon } from "${iconTypeModule}";

// A lucide icon, which is a forwardRef component.
export const lucide: Icon = GlobeIcon;

// The package's own spinner, which is a plain function component.
export const spinner: Icon = LoadingSpinnerIcon;

// A consumer's React 19 icon, where ref is an ordinary prop.
export const custom: Icon = (props: SVGProps<SVGSVGElement>) => (
  <svg {...props} />
);

// An icon still takes a ref and the lucide props when rendered.
const ref = createRef<SVGSVGElement>();
export const rendered = [lucide, spinner, custom].map((Component, index) => (
  <Component
    key={index}
    ref={ref}
    size={index ? 16 : "1em"}
    absoluteStrokeWidth
    className="icon"
  />
));

// A component that needs more than the icon props is still rejected.
// @ts-expect-error: \`label\` is required and no \`icon\` slot passes it
export const notAnIcon: Icon = (props: { label: string }) => (
  <svg aria-label={props.label} />
);
`;

// Fails to compile unless the mirror is the identical type, props included.
const drift = `
import type { ComponentProps } from "react";

import type { Icon as Source, IconProps } from "../../src/icon-type";
import type { Icon as Mirror } from "./icon-type";

type Equal<A, B> =
  (<T>() => T extends A ? 1 : 2) extends <T>() => T extends B ? 1 : 2
    ? true
    : false;

export const sameIcon: Equal<Source, Mirror> = true;
export const sameProps: Equal<IconProps, ComponentProps<Mirror>> = true;
`;

// createLucideIcon's local declaration must accept lucide's real function, so
// the type a consumer sees cannot drift from what it calls at runtime.
const createLucideIconParity = `
import lucideCreateLucideIcon from "lucide-react/dist/esm/createLucideIcon.mjs";

import type createLucideIcon from "../../src/create-lucide-icon";

export const sameCreate: typeof createLucideIcon = lucideCreateLucideIcon;
`;

// The barrel as a consumer meets it: no ambient lucide declarations in scope.
// Every icon used to be typed `any` here, because tsc emitted lucide's deep
// specifiers into dist and nothing declared them, so each assignment below
// that should fail compiled cleanly.
const barrel = `
import { createLucideIcon, GlobeIcon, type Icon } from "../../src/index";

export const icon: Icon = GlobeIcon;
export const rendered = <GlobeIcon size={16} className="icon" />;
export const created: Icon = createLucideIcon("custom", [
  ["path", { d: "M0 0h24", key: "a" }],
]);

// @ts-expect-error: an icon is a component, not \`any\`
export const iconIsNotAny: number = GlobeIcon;
// @ts-expect-error: \`size\` takes a string or number
export const wrongProp = <GlobeIcon size={true} />;
// @ts-expect-error: createLucideIcon is a function, not \`any\`
export const createIsNotAny: number = createLucideIcon;
// @ts-expect-error: lucide icon nodes only take its SVG element names
export const wrongNode = createLucideIcon("custom", [["div", {}]]);
`;

function typeErrors(
  files: Record<string, string>,
  include: string[] = [],
): string {
  const dir = fixtureDir();
  for (const [name, source] of Object.entries(files)) {
    writeFileSync(`${dir}${name}`, source);
  }
  writeFileSync(
    `${dir}tsconfig.json`,
    JSON.stringify({
      // The repo root's config, not the package's: that one is the composite
      // build config, with a `rootDir` these fixtures sit outside.
      extends: "../../../../tsconfig.json",
      compilerOptions: {
        noEmit: true,
        // One @types/react for the whole program, as a consumer has. Inside
        // this repo lucide's own .d.ts otherwise resolves the hoisted copy, a
        // different version from this package's, and a real lucide icon then
        // fails on unrelated SVG attribute types.
        paths: {
          react: ["../@types/react"],
          "react/*": ["../@types/react/*"],
        },
      },
      include: ["*.ts", "*.tsx", ...include],
      exclude: [],
    }),
  );

  try {
    execFileSync(process.execPath, [TSC, "-p", dir, "--pretty", "false"], {
      cwd: PKG_DIR,
      encoding: "utf8",
      stdio: "pipe",
    });
    return "";
  } catch (error) {
    return (error as { stdout: string }).stdout;
  }
}

afterAll(() => {
  for (const dir of fixtureDirs) rmSync(dir, { recursive: true, force: true });
});

describe("Icon type", () => {
  it("accepts lucide icons, the spinner and a plain React 19 component", () => {
    expect(
      typeErrors({
        "icon-type.d.ts": ICON_TYPE_DTS,
        "lucide-deep-imports.d.ts": LUCIDE_DEEP_IMPORTS_DTS,
        "source.tsx": assignments("../../src/icon-type"),
        "mirror.tsx": assignments("./icon-type"),
        "drift.ts": drift,
        "create-lucide-icon.ts": createLucideIconParity,
      }),
    ).toBe("");
  }, 120_000);

  it("types every barrel export without lucide's deep-import declarations", () => {
    expect(typeErrors({ "barrel.tsx": barrel })).toBe("");
  }, 120_000);
});
