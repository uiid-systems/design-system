import { describe, it, expect } from "vitest";

import breakpointsJson from "../../../tokens/src/json/primitives/breakpoints.tokens.json?raw";
import { stylePropsCss } from "./css";
import { BREAKPOINTS } from "./types";

const breakpointTokens = JSON.parse(breakpointsJson);

describe("stylePropsCss", () => {
  it("matches the stylesheet @uiid/tokens ships", async () => {
    await expect(stylePropsCss()).toMatchFileSnapshot(
      "../../../tokens/src/props.css",
    );
  });

  it("queries the breakpoints @uiid/tokens defines, smallest first", () => {
    const { $type: _type, ...widths } = breakpointTokens.breakpoint;

    expect(BREAKPOINTS).toEqual(Object.keys(widths));
  });
});
