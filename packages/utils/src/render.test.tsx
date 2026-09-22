import { describe, it, expect, vi } from "vitest";

import { renderWithProps } from "./render";

/** Reads the props off the element `renderWithProps` returns. */
const propsOf = (element: React.ReactElement): Record<string, unknown> =>
  element.props as Record<string, unknown>;

/** Stands in for a synthetic event without needing a DOM. */
const fakeEvent = () => {
  const event = {
    defaultPrevented: false,
    preventDefault() {
      event.defaultPrevented = true;
    },
  };
  return event;
};

describe("renderWithProps", () => {
  describe("without a render element", () => {
    it("creates the fallback element with the props and children", () => {
      const result = renderWithProps({
        props: { className: "a", id: "x" },
        children: "hello",
        fallbackElement: "span",
      });

      expect(result.type).toBe("span");
      expect(propsOf(result).id).toBe("x");
      expect(propsOf(result).children).toBe("hello");
    });

    it("defaults the fallback element to a div", () => {
      expect(renderWithProps({ props: {} }).type).toBe("div");
    });
  });

  describe("with a render element", () => {
    it("clones the render element rather than the fallback", () => {
      const result = renderWithProps({
        render: <a href="/x" />,
        props: {},
        fallbackElement: "span",
      });

      expect(result.type).toBe("a");
      expect(propsOf(result).href).toBe("/x");
    });

    it("concatenates both classNames", () => {
      const result = renderWithProps({
        render: <a className="theirs" />,
        props: { className: "ours" },
      });

      expect(propsOf(result).className).toBe("theirs ours");
    });

    it("merges style, with ours winning on a conflict", () => {
      const result = renderWithProps({
        render: <a style={{ color: "red", margin: 1 }} />,
        props: { style: { color: "blue" } },
      });

      expect(propsOf(result).style).toEqual({ color: "blue", margin: 1 });
    });

    it("prefers explicit children over the render element's own", () => {
      const withChildren = renderWithProps({
        render: <a>theirs</a>,
        props: {},
        children: "ours",
      });
      const withoutChildren = renderWithProps({
        render: <a>theirs</a>,
        props: {},
      });

      expect(propsOf(withChildren).children).toBe("ours");
      expect(propsOf(withoutChildren).children).toBe("theirs");
    });

    it("lets our non-handler props win", () => {
      const result = renderWithProps({
        render: <a id="theirs" />,
        props: { id: "ours" },
      });

      expect(propsOf(result).id).toBe("ours");
    });
  });

  describe("event handler chaining", () => {
    it("runs both handlers, ours before theirs", () => {
      const calls: string[] = [];
      const result = renderWithProps({
        render: <a onClick={() => calls.push("theirs")} />,
        props: { onClick: () => calls.push("ours") },
      });

      (propsOf(result).onClick as (e: unknown) => void)(fakeEvent());

      expect(calls).toEqual(["ours", "theirs"]);
    });

    it("skips their handler when ours prevents default", () => {
      const theirs = vi.fn();
      const result = renderWithProps({
        render: <a onClick={theirs} />,
        props: {
          onClick: (event: { preventDefault(): void }) =>
            event.preventDefault(),
        },
      });

      (propsOf(result).onClick as (e: unknown) => void)(fakeEvent());

      expect(theirs).not.toHaveBeenCalled();
    });

    it("still runs their handler when ours does not prevent default", () => {
      const theirs = vi.fn();
      const result = renderWithProps({
        render: <a onClick={theirs} />,
        props: { onClick: vi.fn() },
      });

      (propsOf(result).onClick as (e: unknown) => void)(fakeEvent());

      expect(theirs).toHaveBeenCalledOnce();
    });

    it("keeps their handler when we pass none", () => {
      const theirs = vi.fn();
      const result = renderWithProps({
        render: <a onClick={theirs} />,
        props: {},
      });

      expect(propsOf(result).onClick).toBe(theirs);
    });

    it("keeps their handler when ours is explicitly undefined", () => {
      const theirs = vi.fn();
      const result = renderWithProps({
        render: <a onClick={theirs} />,
        props: { onClick: undefined },
      });

      expect(propsOf(result).onClick).toBe(theirs);
    });

    it("keeps our handler when they pass none", () => {
      const ours = vi.fn();
      const result = renderWithProps({
        render: <a />,
        props: { onClick: ours },
      });

      expect(propsOf(result).onClick).toBe(ours);
    });

    it("chains each handler independently", () => {
      const calls: string[] = [];
      const result = renderWithProps({
        render: (
          <a
            onClick={() => calls.push("their-click")}
            onKeyDown={() => calls.push("their-keydown")}
          />
        ),
        props: {
          onClick: () => calls.push("our-click"),
          onKeyDown: () => calls.push("our-keydown"),
        },
      });

      (propsOf(result).onClick as (e: unknown) => void)(fakeEvent());
      (propsOf(result).onKeyDown as (e: unknown) => void)(fakeEvent());

      expect(calls).toEqual([
        "our-click",
        "their-click",
        "our-keydown",
        "their-keydown",
      ]);
    });

    it("tolerates a handler called without an event", () => {
      const theirs = vi.fn();
      const result = renderWithProps({
        render: <a onClick={theirs} />,
        props: { onClick: vi.fn() },
      });

      expect(() => (propsOf(result).onClick as () => void)()).not.toThrow();
      expect(theirs).toHaveBeenCalledOnce();
    });

    it("does not treat an `on`-prefixed non-handler prop as a handler", () => {
      // `once` starts with "on" but the third character is lowercase, so it is
      // a data prop and ours must simply win.
      const result = renderWithProps({
        render: <a {...({ once: "theirs" } as object)} />,
        props: { once: "ours" },
      });

      expect(propsOf(result).once).toBe("ours");
    });
  });
});
