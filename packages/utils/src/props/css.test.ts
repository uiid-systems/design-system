import { describe, it, expect } from "vitest";

import { stylePropsCss } from "./css";

describe("stylePropsCss", () => {
  it("matches the stylesheet @uiid/tokens ships", async () => {
    await expect(stylePropsCss()).toMatchFileSnapshot(
      "../../../tokens/src/props.css",
    );
  });
});
