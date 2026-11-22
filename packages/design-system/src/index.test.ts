import { readFileSync } from "node:fs";

import * as buttons from "@uiid/buttons";
import * as cards from "@uiid/cards";
import * as code from "@uiid/code";
import * as barrel from "@uiid/design-system";
import * as forms from "@uiid/forms";
import * as indicators from "@uiid/indicators";
import * as interactive from "@uiid/interactive";
import * as layout from "@uiid/layout";
import * as lists from "@uiid/lists";
import * as markdown from "@uiid/markdown";
import * as navigation from "@uiid/navigation";
import * as overlays from "@uiid/overlays";
import * as tables from "@uiid/tables";
import * as tokens from "@uiid/tokens";
import * as typography from "@uiid/typography";
import * as utils from "@uiid/utils";
import { describe, expect, expectTypeOf, it } from "vitest";

// The root is exactly the component packages plus tokens. This test owns which
// packages the root serves; exact per-package name lists are still to be
// written, as each package's own barrel test.
const served = {
  buttons,
  cards,
  code,
  forms,
  indicators,
  interactive,
  layout,
  lists,
  markdown,
  navigation,
  overlays,
  tables,
  tokens,
  typography,
};

const manifest = JSON.parse(
  readFileSync(`${import.meta.dirname}/../package.json`, "utf8"),
);

describe("@uiid/design-system root barrel", () => {
  it("serves every @uiid dependency except the subpath-only icons and utils", () => {
    const deps = Object.keys(manifest.dependencies)
      .filter((name) => name.startsWith("@uiid/"))
      .map((name) => name.slice("@uiid/".length))
      .filter((name) => name !== "icons" && name !== "utils");
    expect(Object.keys(served).sort()).toEqual(deps.sort());
  });

  it("serves exactly the component packages and tokens", () => {
    const expected = new Set(
      Object.values(served).flatMap((pkg) => Object.keys(pkg)),
    );
    expect(Object.keys(barrel).sort()).toEqual([...expected].sort());
  });

  it.each(Object.entries(served))(
    "re-exports every @uiid/%s runtime export",
    (_, pkg) => {
      expect(Object.keys(pkg).length).toBeGreaterThan(0);
      for (const name of Object.keys(pkg)) {
        expect(barrel[name as keyof typeof barrel]).toBe(
          pkg[name as keyof typeof pkg],
        );
      }
    },
  );

  it("does not re-export @uiid/utils", () => {
    expect(Object.keys(utils)).toContain("cx");
    const leaked = Object.keys(utils).filter((name) => name in barrel);
    expect(leaked).toEqual([]);
  });

  it("does not re-export @uiid/utils types", () => {
    // Type-only re-exports are invisible to the runtime checks above.
    // @ts-expect-error utils types are not served from the root
    expectTypeOf<barrel.VariantProps<never>>();
  });
});
