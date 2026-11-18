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

const require = createRequire(import.meta.url);
const TSC = require.resolve("typescript/bin/tsc");

const PKG_DIR = fileURLToPath(new URL("..", import.meta.url));
// Inside node_modules, which is already gitignored, so the fixture leaves no
// repo residue and still resolves `react` and `lucide-react` as this package
// does. A fresh directory per run, so concurrent runs cannot collide.
const FIXTURE_DIR = `${mkdtempSync(`${PKG_DIR}node_modules/.icon-type-test-`)}/`;

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

function typeErrors(): string {
  writeFileSync(`${FIXTURE_DIR}icon-type.d.ts`, ICON_TYPE_DTS);
  writeFileSync(`${FIXTURE_DIR}source.tsx`, assignments("../../src/icon-type"));
  writeFileSync(`${FIXTURE_DIR}mirror.tsx`, assignments("./icon-type"));
  writeFileSync(`${FIXTURE_DIR}drift.ts`, drift);
  writeFileSync(
    `${FIXTURE_DIR}tsconfig.json`,
    JSON.stringify({
      extends: "../../tsconfig.json",
      compilerOptions: {
        noEmit: true,
        emitDeclarationOnly: false,
        declaration: false,
        declarationMap: false,
        incremental: false,
        // One @types/react for the whole program, as a consumer has. Inside
        // this repo lucide's own .d.ts otherwise resolves the hoisted copy, a
        // different version from this package's, and a real lucide icon then
        // fails on unrelated SVG attribute types.
        paths: {
          react: ["../@types/react"],
          "react/*": ["../@types/react/*"],
        },
      },
      include: ["*.ts", "*.tsx", "../../src/lucide-deep-imports.d.ts"],
      exclude: [],
    }),
  );

  try {
    execFileSync(
      process.execPath,
      [TSC, "-p", FIXTURE_DIR, "--pretty", "false"],
      { cwd: PKG_DIR, encoding: "utf8", stdio: "pipe" },
    );
    return "";
  } catch (error) {
    return (error as { stdout: string }).stdout;
  }
}

afterAll(() => {
  rmSync(FIXTURE_DIR, { recursive: true, force: true });
});

describe("Icon type", () => {
  it("accepts lucide icons, the spinner and a plain React 19 component", () => {
    expect(typeErrors()).toBe("");
  }, 120_000);
});
