import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, it, expect, vi } from "vitest";

import { Sortable } from "./sortable";
import {
  SortableContent,
  SortableItem,
  SortableItemHandle,
  SortableOverlay,
} from "./subcomponents";

type Refs = {
  item?: React.Ref<HTMLDivElement>;
  handle?: React.Ref<HTMLButtonElement>;
};

const renderSortable = ({ item, handle }: Refs) => (
  <Sortable value={["a"]}>
    <SortableContent>
      <SortableItem value="a" ref={item}>
        <SortableItemHandle ref={handle}>drag</SortableItemHandle>
      </SortableItem>
    </SortableContent>
  </Sortable>
);

const ITEMS = ["a", "b", "c"];
const ITEM_HEIGHT = 40;

/**
 * happy-dom has no layout, so every rect is zero and the keyboard coordinate
 * getter finds no item to move to. Stack the items vertically, inside a list
 * tall enough to hold them all.
 */
const stubLayout = () =>
  vi
    .spyOn(HTMLElement.prototype, "getBoundingClientRect")
    .mockImplementation(function (this: HTMLElement) {
      const index = ITEMS.indexOf(this.dataset.value ?? "");
      const top = index === -1 ? 0 : index * ITEM_HEIGHT;
      const height = index === -1 ? ITEMS.length * ITEM_HEIGHT : ITEM_HEIGHT;
      return DOMRect.fromRect({ x: 0, y: top, width: 200, height });
    });

/** The KeyboardSensor binds its keydown listener in a timeout after pick-up. */
const flushSensor = () =>
  act(() => new Promise((resolve) => setTimeout(resolve, 0)));

describe("Sortable", () => {
  describe("keyboard reordering", () => {
    afterEach(() => {
      vi.restoreAllMocks();
    });

    const renderList = () => {
      stubLayout();
      const onValueChange = vi.fn();

      render(
        <Sortable value={ITEMS} onValueChange={onValueChange}>
          <SortableContent>
            {ITEMS.map((item) => (
              <SortableItem key={item} value={item} data-value={item}>
                <SortableItemHandle>{`drag ${item}`}</SortableItemHandle>
              </SortableItem>
            ))}
          </SortableContent>
          <SortableOverlay>{({ value }) => `overlay ${value}`}</SortableOverlay>
        </Sortable>,
      );

      const handle = screen.getByRole("button", { name: "drag a" });
      handle.focus();

      const press = async (code: string, key: string) => {
        fireEvent.keyDown(handle, { code, key });
        await flushSensor();
      };

      return { onValueChange, press };
    };

    it("moves an item with Space, ArrowDown, Space", async () => {
      const { onValueChange, press } = renderList();

      await press("Space", " ");
      expect(screen.getByText("overlay a")).toBeInTheDocument();

      await press("ArrowDown", "ArrowDown");
      await press("Space", " ");

      expect(onValueChange).toHaveBeenCalledExactlyOnceWith(["b", "a", "c"]);
    });

    it("keeps the order when the drag is cancelled with Escape", async () => {
      const { onValueChange, press } = renderList();

      await press("Space", " ");
      await press("ArrowDown", "ArrowDown");
      await press("Escape", "Escape");

      expect(onValueChange).not.toHaveBeenCalled();
      expect(screen.queryByText("overlay a")).not.toBeInTheDocument();
    });
  });

  describe("ref composition", () => {
    it("does not reattach the item's ref when it re-renders", () => {
      const item = vi.fn();
      const { rerender } = render(renderSortable({ item }));

      rerender(renderSortable({ item }));

      expect(item).toHaveBeenCalledTimes(1);
      expect(item).toHaveBeenCalledWith(expect.any(HTMLDivElement));
    });

    it("does not reattach the handle's ref when it re-renders", () => {
      const handle = vi.fn();
      const { rerender } = render(renderSortable({ handle }));

      rerender(renderSortable({ handle }));

      expect(handle).toHaveBeenCalledTimes(1);
      expect(handle).toHaveBeenCalledWith(expect.any(HTMLButtonElement));
    });
  });
});
