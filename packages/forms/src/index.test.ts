import { describe, expect, it } from "vitest";

import * as forms from "./index";

describe("forms barrel", () => {
  it("exports the select compound API", () => {
    const parts = [
      "SelectRoot",
      "SelectTrigger",
      "SelectPortal",
      "SelectPositioner",
      "SelectPopup",
      "SelectList",
      "SelectItem",
      "SelectValue",
      "SelectIcon",
    ] as const;

    for (const part of parts) {
      expect(forms, `${part} should be exported`).toHaveProperty(part);
    }
  });

  it("exports the radio compound API", () => {
    expect(forms).toHaveProperty("RadioRoot");
    expect(forms).toHaveProperty("RadioIndicator");
  });

  it("does not export component constants", () => {
    expect(forms).not.toHaveProperty("CHECKBOX_DEFAULT_SIZE");
    expect(forms).not.toHaveProperty("SELECT_DEFAULT_SIZE");
  });
});
