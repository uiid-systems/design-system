import { render } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";

import { Sortable } from "./sortable";
import {
  SortableContent,
  SortableItem,
  SortableItemHandle,
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

describe("Sortable", () => {
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
