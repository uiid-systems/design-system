// @vitest-environment node
// Runs `tsc` over a fixture, so it needs a real filesystem and no DOM.
import { execFileSync } from "node:child_process";
import { mkdirSync, rmSync, writeFileSync } from "node:fs";
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
// rather than from icons/ on disk, so a stale build cannot pass.

const require = createRequire(import.meta.url);
const TSC = require.resolve("typescript/bin/tsc");

const PKG_DIR = fileURLToPath(new URL("..", import.meta.url));
// node_modules is already gitignored, so the fixture leaves no repo residue.
const FIXTURE_DIR = fileURLToPath(
  new URL("../node_modules/.icon-type-test/", import.meta.url),
);

const fixture = (iconTypeModule: string) => `
import {
  createRef,
  type ForwardRefExoticComponent,
  type RefAttributes,
  type SVGProps,
} from "react";

import { LoadingSpinnerIcon } from "../../src/components/loading-spinner";
import type { IconProps } from "../../src/icon-type";
import type { Icon } from "${iconTypeModule}";

// A lucide icon, which is a forwardRef component. Declared here in lucide's
// shape rather than imported: inside this repo lucide's own .d.ts resolves a
// different @types/react than this package, which fails on unrelated SVG
// attribute types.
declare const forwardRefIcon: ForwardRefExoticComponent<
  Omit<IconProps, "ref"> & RefAttributes<SVGSVGElement>
>;
export const lucide: Icon = forwardRefIcon;

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

function typeErrors(): string {
  mkdirSync(FIXTURE_DIR, { recursive: true });
  writeFileSync(`${FIXTURE_DIR}icon-type.d.ts`, ICON_TYPE_DTS);
  writeFileSync(`${FIXTURE_DIR}source.tsx`, fixture("../../src/icon-type"));
  writeFileSync(`${FIXTURE_DIR}mirror.tsx`, fixture("./icon-type"));
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
      },
      include: ["*.tsx", "*.d.ts"],
      exclude: [],
    }),
  );

  try {
    execFileSync("node", [TSC, "-p", FIXTURE_DIR, "--pretty", "false"], {
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
  rmSync(FIXTURE_DIR, { recursive: true, force: true });
});

describe("Icon type", () => {
  it("accepts lucide icons, the spinner and a plain React 19 component", () => {
    expect(typeErrors()).toBe("");
  }, 120_000);
});
