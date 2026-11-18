import { describe, expect, it } from "vitest";

import * as overlays from "./index";

describe("overlays barrel", () => {
  it("exports the dialog compound API", () => {
    const parts = [
      "DialogRoot",
      "DialogTrigger",
      "DialogPortal",
      "DialogBackdrop",
      "DialogViewport",
      "DialogPopup",
      "DialogClose",
    ] as const;

    for (const part of parts) {
      expect(overlays, `${part} should be exported`).toHaveProperty(part);
    }
  });

  it("keeps the dialog header close button internal", () => {
    expect(overlays).not.toHaveProperty("DialogCloseButton");
  });

  it("exports the popover compound API", () => {
    const parts = [
      "PopoverRoot",
      "PopoverTrigger",
      "PopoverPortal",
      "PopoverBackdrop",
      "PopoverPositioner",
      "PopoverPopup",
    ] as const;

    for (const part of parts) {
      expect(overlays, `${part} should be exported`).toHaveProperty(part);
    }
  });
});
