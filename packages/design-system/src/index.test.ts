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
import { describe, expect, it } from "vitest";

// The root is exactly the component packages plus tokens. Each package's own
// barrel test owns its names; this one owns which packages the root serves.
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

describe("@uiid/design-system root barrel", () => {
  it("serves exactly the component packages and tokens", () => {
    const expected = new Set(
      Object.values(served).flatMap((pkg) => Object.keys(pkg)),
    );
    expect(Object.keys(barrel).sort()).toEqual([...expected].sort());
  });

  it.each(Object.entries(served))(
    "re-exports every @uiid/%s runtime export",
    (_, pkg) => {
      for (const name of Object.keys(pkg)) {
        expect(barrel[name as keyof typeof barrel]).toBe(
          pkg[name as keyof typeof pkg],
        );
      }
    },
  );

  it("does not re-export @uiid/utils", () => {
    const leaked = Object.keys(utils).filter((name) => name in barrel);
    expect(leaked).toEqual([]);
  });
});
