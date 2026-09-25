import { render } from "@testing-library/react";
import { createRef, useCallback, useRef, useState } from "react";
import { describe, it, expect, vi } from "vitest";

import { renderWithProps, resolveRender, type RenderProp } from "./render";

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

/**
 * The shape an element takes when it reaches development SSR lazily wrapped:
 * a `react.lazy` node whose `_init` hands back the element.
 */
const lazyElement = (element: React.ReactElement): RenderProp =>
  ({
    $$typeof: Symbol.for("react.lazy"),
    _payload: element,
    _init: (payload: unknown) => payload,
  }) as unknown as RenderProp;

describe("resolveRender", () => {
  it("returns an element unchanged", () => {
    const element = <a href="/x" />;
    expect(resolveRender(element)).toBe(element);
  });

  it("passes undefined through", () => {
    expect(resolveRender(undefined)).toBeUndefined();
  });

  it("unwraps a lazily wrapped element", () => {
    const resolved = resolveRender(lazyElement(<a href="/x" />));
    expect(resolved?.type).toBe("a");
    expect(propsOf(resolved!).href).toBe("/x");
  });

  it("rethrows what a pending payload throws, so React can suspend", () => {
    const pending = Promise.resolve();
    const lazy = {
      $$typeof: Symbol.for("react.lazy"),
      _payload: null,
      _init: () => {
        throw pending;
      },
    };

    expect.assertions(1);
    try {
      resolveRender(lazy);
    } catch (thrown) {
      expect(thrown).toBe(pending);
    }
  });
});

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

  describe("with a lazily wrapped render element", () => {
    it("clones the element it resolves to instead of the fallback", () => {
      const result = renderWithProps({
        render: lazyElement(<a href="/x" className="theirs" />),
        props: { className: "ours" },
        children: "go",
      });

      expect(result.type).toBe("a");
      expect(propsOf(result).href).toBe("/x");
      expect(propsOf(result).className).toBe("theirs ours");
      expect(propsOf(result).children).toBe("go");
    });
  });

  describe("ref merging", () => {
    it("sets no ref when neither side has one", () => {
      const result = renderWithProps({ render: <a />, props: {} });

      expect(propsOf(result).ref).toBeUndefined();
    });

    it("passes our ref through verbatim when they have none", () => {
      const ours = createRef<HTMLAnchorElement>();
      const result = renderWithProps({ render: <a />, props: { ref: ours } });

      expect(propsOf(result).ref).toBe(ours);
    });

    it("keeps their ref verbatim when we pass none", () => {
      const theirs = createRef<HTMLAnchorElement>();
      const result = renderWithProps({ render: <a ref={theirs} />, props: {} });

      expect(propsOf(result).ref).toBe(theirs);
    });

    it("keeps their ref when ours is explicitly undefined", () => {
      const theirs = createRef<HTMLAnchorElement>();
      const result = renderWithProps({
        render: <a ref={theirs} />,
        props: { ref: undefined },
      });

      expect(propsOf(result).ref).toBe(theirs);
    });

    it("composes both refs rather than letting ours replace theirs", () => {
      const ours = createRef<HTMLAnchorElement>();
      const theirs = createRef<HTMLAnchorElement>();
      const result = renderWithProps({
        render: <a ref={theirs} />,
        props: { ref: ours },
      });
      const node = {} as HTMLAnchorElement;

      (propsOf(result).ref as (node: HTMLAnchorElement) => void)(node);

      expect(ours.current).toBe(node);
      expect(theirs.current).toBe(node);
    });

    it("keeps the composed ref's identity for the same pair of refs", () => {
      const ours = createRef<HTMLAnchorElement>();
      const theirs = createRef<HTMLAnchorElement>();
      const compose = () =>
        propsOf(
          renderWithProps({ render: <a ref={theirs} />, props: { ref: ours } }),
        ).ref;

      expect(compose()).toBe(compose());
    });

    it("composes a fresh ref when either side of the pair changes", () => {
      const ours = createRef<HTMLAnchorElement>();
      const compose = (theirs: React.Ref<HTMLAnchorElement>) =>
        propsOf(
          renderWithProps({ render: <a ref={theirs} />, props: { ref: ours } }),
        ).ref;

      expect(compose(createRef())).not.toBe(compose(createRef()));
    });

    it("does not loop when their callback ref stores a new object per call", () => {
      const Measured = () => {
        const [, setRect] = useState<object>();
        const ours = useRef<HTMLDivElement>(null);
        const theirs = useCallback(
          (node: HTMLDivElement | null) => setRect(node ? {} : undefined),
          [],
        );

        return renderWithProps({
          render: <div ref={theirs} />,
          props: { ref: ours },
        });
      };

      expect(() => render(<Measured />)).not.toThrow();
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
