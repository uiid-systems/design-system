import { render, screen } from "@testing-library/react";

import { CanvasDndProvider } from "../../canvas/canvas-dnd-provider";
import { manifest } from "../../manifest/manifest";
import { Palette } from "../palette";

describe("Palette", () => {
  it("lists one draggable item per manifest entry, in manifest order", () => {
    render(
      <CanvasDndProvider>
        <Palette />
      </CanvasDndProvider>,
    );

    const items = screen.getAllByRole("button");
    expect(items.map((item) => item.textContent)).toEqual(
      Object.keys(manifest),
    );
    for (const item of items) {
      expect(item).toHaveAttribute("aria-roledescription", "draggable");
      expect(item).toHaveAttribute("data-palette-item");
    }
  });
});
