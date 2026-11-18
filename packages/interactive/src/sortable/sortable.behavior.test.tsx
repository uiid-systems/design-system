import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, it, expect, vi } from "vitest";

import { Sortable } from "./sortable";
import * as Examples from "./sortable.examples";
import type { SortableItemProps } from "./sortable.types";
import {
  SortableContent,
  SortableItem,
  SortableItemHandle,
  SortableOverlay,
} from "./subcomponents";

const ITEMS = ["a", "b", "c"];
const ITEM_HEIGHT = 40;

/**
 * happy-dom has no layout, so every rect is zero and no item is ever "over"
 * another. Stack the items vertically, inside a list tall enough to hold them.
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

/** Let dnd-kit's measuring effects and timeouts settle between steps. */
const flush = () => act(() => new Promise((resolve) => setTimeout(resolve, 0)));

/** Press the primary button on `el`, move by `dy`, and release. */
const pointerDrag = async (el: HTMLElement, dy: number) => {
  const x = 100;
  const y = 20;
  fireEvent.mouseDown(el, { button: 0, clientX: x, clientY: y });
  await flush();
  fireEvent.mouseMove(document, { clientX: x, clientY: y + dy / 2 });
  await flush();
  fireEvent.mouseMove(document, { clientX: x, clientY: y + dy });
  await flush();
  fireEvent.mouseUp(document, { clientX: x, clientY: y + dy });
  await flush();
};

type RenderOptions = {
  onValueChange?: (items: string[]) => void;
  itemProps?: (item: string) => Partial<SortableItemProps>;
  overlay?: React.ReactNode;
  asHandle?: boolean;
};

const renderList = ({
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

describe("Sortable behavior", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  // ============================================
  // RENDERING
  // ============================================

  it("renders data-slot attributes on each part", () => {
    renderList();
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
    renderList();
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

  // ============================================
  // POINTER REORDERING
  // ============================================

  it("moves an item down by dragging its handle", async () => {
    stubLayout();
    const onValueChange = vi.fn();
    renderList({ onValueChange });

    await pointerDrag(screen.getByRole("button", { name: "drag a" }), 45);

    expect(onValueChange).toHaveBeenCalledWith(["b", "a", "c"]);
  });

  it("moves an item when the whole item is the handle", async () => {
    stubLayout();
    const onValueChange = vi.fn();
    renderList({ onValueChange, asHandle: true });

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
    renderList({ onValueChange });

    await pointerDrag(screen.getByRole("button", { name: "drag a" }), 5);

    expect(onValueChange).not.toHaveBeenCalled();
  });

  it("marks the item and handle as dragging while held", async () => {
    stubLayout();
    renderList();
    const handle = screen.getByRole("button", { name: "drag a" });
    const item = handle.closest("[data-slot='sortable-item']");

    fireEvent.mouseDown(handle, { button: 0, clientX: 100, clientY: 20 });
    await flush();
    fireEvent.mouseMove(document, { clientX: 100, clientY: 30 });
    await flush();

    expect(item).toHaveAttribute("data-dragging");
    expect(handle).toHaveAttribute("data-dragging");

    fireEvent.mouseUp(document, { clientX: 100, clientY: 30 });
    await flush();

    expect(item).not.toHaveAttribute("data-dragging");
  });

  // ============================================
  // DISABLED
  // ============================================

  it("disables the handle of a disabled item", () => {
    renderList({ itemProps: (item) => ({ disabled: item === "a" }) });
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
    renderList({
      onValueChange,
      itemProps: (item) => ({ disabled: item === "a" }),
    });

    await pointerDrag(screen.getByRole("button", { name: "drag a" }), 45);

    expect(onValueChange).not.toHaveBeenCalled();
  });

  it("does not drag a disabled asHandle item", async () => {
    stubLayout();
    const onValueChange = vi.fn();
    renderList({
      onValueChange,
      asHandle: true,
      itemProps: (item) => ({ disabled: item === "a" }),
    });

    await pointerDrag(screen.getByText("item a"), 45);

    expect(onValueChange).not.toHaveBeenCalled();
  });

  // ============================================
  // OVERLAY
  // ============================================

  it("renders nothing in the overlay until a drag starts", async () => {
    renderList({
      overlay: (
        <SortableOverlay>
          {({ value }) => <span>{`overlay ${value}`}</span>}
        </SortableOverlay>
      ),
    });
    await flush();
    expect(screen.queryByText(/^overlay/)).not.toBeInTheDocument();
  });

  it("renders the dragged item's value in the overlay", async () => {
    stubLayout();
    renderList({
      overlay: (
        <SortableOverlay>
          {({ value }) => <span>{`overlay ${value}`}</span>}
        </SortableOverlay>
      ),
    });
    const handle = screen.getByRole("button", { name: "drag b" });

    fireEvent.mouseDown(handle, { button: 0, clientX: 100, clientY: 60 });
    await flush();
    fireEvent.mouseMove(document, { clientX: 100, clientY: 70 });
    await flush();

    expect(screen.getByText("overlay b")).toBeInTheDocument();

    fireEvent.mouseUp(document, { clientX: 100, clientY: 70 });
    await flush();

    expect(screen.queryByText("overlay b")).not.toBeInTheDocument();
  });

  it("portals the overlay into a given container", async () => {
    stubLayout();
    const container = document.createElement("div");
    document.body.append(container);
    renderList({
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
    await flush();

    expect(container).toHaveTextContent("overlay");

    fireEvent.mouseUp(document, { clientX: 100, clientY: 20 });
    await flush();
    container.remove();
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
