import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, it, expect, expectTypeOf, vi } from "vitest";

import { Sortable } from "./sortable";
import type { SortableRootContextValue } from "./sortable.context";
import * as Examples from "./sortable.examples";
import type { SortableItemProps } from "./sortable.types";
import {
  SortableContent,
  SortableItem,
  SortableItemHandle,
  SortableOverlay,
} from "./subcomponents";

import css from "./sortable.module.css?raw";

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
 * happy-dom has no layout, so every rect is zero and no item is ever over
 * another, for the keyboard or the pointer. Stack the items vertically, inside a list
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

/**
 * Let dnd-kit settle between steps: the KeyboardSensor binds its keydown
 * listener in a timeout after pick-up, and measuring runs in effects.
 */
const flushSensor = () =>
  act(() => new Promise((resolve) => setTimeout(resolve, 0)));

/** Press the primary button on `el`, move by `dy`, and release. */
const pointerDrag = async (el: HTMLElement, dy: number) => {
  const x = 100;
  const y = 20;
  fireEvent.mouseDown(el, { button: 0, clientX: x, clientY: y });
  await flushSensor();
  fireEvent.mouseMove(document, { clientX: x, clientY: y + dy / 2 });
  await flushSensor();
  fireEvent.mouseMove(document, { clientX: x, clientY: y + dy });
  await flushSensor();
  fireEvent.mouseUp(document, { clientX: x, clientY: y + dy });
  await flushSensor();
};

type RenderOptions = {
  onValueChange?: (items: string[]) => void;
  itemProps?: (item: string) => Partial<SortableItemProps>;
  overlay?: React.ReactNode;
  asHandle?: boolean;
};

const renderItems = ({
  onValueChange,
  itemProps,
  overlay,
  asHandle,
}: RenderOptions = {}) =>
  render(
    <Sortable value={ITEMS} onValueChange={onValueChange}>
      <SortableContent>
        {ITEMS.map((item) => (
          <SortableItem
            key={item}
            value={item}
            data-value={item}
            asHandle={asHandle}
            {...itemProps?.(item)}
          >
            {asHandle ? (
              `item ${item}`
            ) : (
              <SortableItemHandle>{`drag ${item}`}</SortableItemHandle>
            )}
          </SortableItem>
        ))}
      </SortableContent>
      {overlay}
    </Sortable>,
  );

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

  describe("parts", () => {
    afterEach(() => {
      vi.restoreAllMocks();
    });

    it("renders data-slot attributes on each part", () => {
      renderItems();
      expect(
        document.querySelector("[data-slot='sortable-content']"),
      ).toBeInTheDocument();
      expect(
        document.querySelectorAll("[data-slot='sortable-item']"),
      ).toHaveLength(3);
      expect(
        document.querySelectorAll("[data-slot='sortable-item-handle']"),
      ).toHaveLength(3);
    });

    it("points each handle at its item with aria-controls", () => {
      renderItems();
      const handle = screen.getByRole("button", { name: "drag a" });
      const item = handle.closest("[data-slot='sortable-item']");
      expect(handle).toHaveAttribute("aria-controls", item?.id);
    });

    it("throws when an item is outside SortableContent", () => {
      const error = vi.spyOn(console, "error").mockImplementation(() => {});
      expect(() =>
        render(
          <Sortable value={["a"]}>
            <SortableItem value="a" />
          </Sortable>,
        ),
      ).toThrow("`SortableItem` must be used within `SortableContent`");
      error.mockRestore();
    });

    it("requires getItemValue for an array of objects", () => {
      const error = vi.spyOn(console, "error").mockImplementation(() => {});
      expect(() =>
        render(
          // @ts-expect-error getItemValue is required for objects
          <Sortable value={[{ id: "a" }]}>
            <SortableContent />
          </Sortable>,
        ),
      ).toThrow("`getItemValue` is required");
      error.mockRestore();
    });
  });

  describe("pointer reordering", () => {
    afterEach(() => {
      vi.restoreAllMocks();
    });

    it("moves an item down by dragging its handle", async () => {
      stubLayout();
      const onValueChange = vi.fn();
      renderItems({ onValueChange });

      await pointerDrag(screen.getByRole("button", { name: "drag a" }), 45);

      expect(onValueChange).toHaveBeenCalledWith(["b", "a", "c"]);
    });

    it("moves an item when the whole item is the handle", async () => {
      stubLayout();
      const onValueChange = vi.fn();
      renderItems({ onValueChange, asHandle: true });

      await pointerDrag(screen.getByText("item c"), -85);

      expect(onValueChange).toHaveBeenCalledWith(["c", "a", "b"]);
    });

    it("calls onMove with indices instead of onValueChange", async () => {
      stubLayout();
      const onValueChange = vi.fn();
      const onMove = vi.fn();
      render(
        <Sortable value={ITEMS} onValueChange={onValueChange} onMove={onMove}>
          <SortableContent>
            {ITEMS.map((item) => (
              <SortableItem key={item} value={item} data-value={item}>
                <SortableItemHandle>{`drag ${item}`}</SortableItemHandle>
              </SortableItem>
            ))}
          </SortableContent>
        </Sortable>,
      );

      await pointerDrag(screen.getByRole("button", { name: "drag a" }), 45);

      expect(onMove).toHaveBeenCalledWith(
        expect.objectContaining({ activeIndex: 0, overIndex: 1 }),
      );
      expect(onValueChange).not.toHaveBeenCalled();
    });

    it("leaves the order alone when an item is dropped where it started", async () => {
      stubLayout();
      const onValueChange = vi.fn();
      renderItems({ onValueChange });

      await pointerDrag(screen.getByRole("button", { name: "drag a" }), 5);

      expect(onValueChange).not.toHaveBeenCalled();
    });

    it("marks the item and handle as dragging while held", async () => {
      stubLayout();
      renderItems();
      const handle = screen.getByRole("button", { name: "drag a" });
      const item = handle.closest("[data-slot='sortable-item']");

      fireEvent.mouseDown(handle, { button: 0, clientX: 100, clientY: 20 });
      await flushSensor();
      fireEvent.mouseMove(document, { clientX: 100, clientY: 30 });
      await flushSensor();

      expect(item).toHaveAttribute("data-dragging");
      expect(handle).toHaveAttribute("data-dragging");

      fireEvent.mouseUp(document, { clientX: 100, clientY: 30 });
      await flushSensor();

      expect(item).not.toHaveAttribute("data-dragging");
    });
  });

  describe("disabled items", () => {
    afterEach(() => {
      vi.restoreAllMocks();
    });

    it("disables the handle of a disabled item", () => {
      renderItems({ itemProps: (item) => ({ disabled: item === "a" }) });
      const handle = screen.getByRole("button", { name: "drag a" });
      expect(handle).toBeDisabled();
      expect(handle).toHaveAttribute("data-disabled");
      expect(handle.closest("[data-slot='sortable-item']")).toHaveAttribute(
        "data-disabled",
      );
      expect(screen.getByRole("button", { name: "drag b" })).toBeEnabled();
    });

    it("does not drag a disabled item", async () => {
      stubLayout();
      const onValueChange = vi.fn();
      renderItems({
        onValueChange,
        itemProps: (item) => ({ disabled: item === "a" }),
      });

      await pointerDrag(screen.getByRole("button", { name: "drag a" }), 45);

      expect(onValueChange).not.toHaveBeenCalled();
    });

    it("does not drag a disabled asHandle item", async () => {
      stubLayout();
      const onValueChange = vi.fn();
      renderItems({
        onValueChange,
        asHandle: true,
        itemProps: (item) => ({ disabled: item === "a" }),
      });

      await pointerDrag(screen.getByText("item a"), 45);

      expect(onValueChange).not.toHaveBeenCalled();
    });

    // The item is a `div`, which `:disabled` never matches.
    it("dims a disabled item through its data-disabled attribute", () => {
      expect(css).toMatch(
        /\.sortable-item \{\s*&:where\(\[data-dragging\], \[data-disabled\]\) \{\s*opacity: var\(--globals-disabled-opacity\);/,
      );
      expect(css).not.toMatch(/:disabled/);
    });
  });

  describe("overlay", () => {
    afterEach(() => {
      vi.restoreAllMocks();
    });

    it("renders nothing in the overlay until a drag starts", async () => {
      renderItems({
        overlay: (
          <SortableOverlay>
            {({ value }) => <span>{`overlay ${value}`}</span>}
          </SortableOverlay>
        ),
      });
      await flushSensor();
      expect(screen.queryByText(/^overlay/)).not.toBeInTheDocument();
    });

    it("renders the dragged item's value in the overlay", async () => {
      stubLayout();
      renderItems({
        overlay: (
          <SortableOverlay>
            {({ value }) => <span>{`overlay ${value}`}</span>}
          </SortableOverlay>
        ),
      });
      const handle = screen.getByRole("button", { name: "drag b" });

      fireEvent.mouseDown(handle, { button: 0, clientX: 100, clientY: 60 });
      await flushSensor();
      fireEvent.mouseMove(document, { clientX: 100, clientY: 70 });
      await flushSensor();

      expect(screen.getByText("overlay b")).toBeInTheDocument();

      fireEvent.mouseUp(document, { clientX: 100, clientY: 70 });
      await flushSensor();

      expect(screen.queryByText("overlay b")).not.toBeInTheDocument();
    });

    it("portals the overlay into a given container", async () => {
      stubLayout();
      const container = document.createElement("div");
      document.body.append(container);
      renderItems({
        overlay: (
          <SortableOverlay container={container}>
            <span>overlay</span>
          </SortableOverlay>
        ),
      });

      fireEvent.mouseDown(screen.getByRole("button", { name: "drag a" }), {
        button: 0,
        clientX: 100,
        clientY: 20,
      });
      await flushSensor();

      expect(container).toHaveTextContent("overlay");

      fireEvent.mouseUp(document, { clientX: 100, clientY: 20 });
      await flushSensor();
      container.remove();
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

describe("Sortable examples", () => {
  it.each(Object.entries(Examples))("%s renders its items", (_, Example) => {
    render(<Example />);
    expect(
      document.querySelectorAll("[data-slot='sortable-item']").length,
    ).toBeGreaterThan(0);
  });
});

/* Type-level only: `pnpm typecheck` fails if the shape drifts. */
describe("root context", () => {
  it("provides only the fields a part reads", () => {
    expectTypeOf<keyof SortableRootContextValue>().toEqualTypeOf<
      "items" | "modifiers" | "strategy" | "activeId" | "flatCursor"
    >();
  });
});
