import { createRef } from "react";
import { describe, it, expect, vi } from "vitest";

import { composeRefs } from "./compose-refs";

/** Stands in for a DOM node without needing a DOM. */
const node = { tagName: "DIV" };
type Node = typeof node;

describe("composeRefs", () => {
  it("gives the node to every ref, object and callback mixed", () => {
    const objectRef = createRef<Node>();
    const callbackRef = vi.fn();

    composeRefs<Node>(objectRef, callbackRef)(node);

    expect(objectRef.current).toBe(node);
    expect(callbackRef).toHaveBeenCalledWith(node);
  });

  it("skips null and undefined refs", () => {
    const objectRef = createRef<Node>();

    expect(() =>
      composeRefs<Node>(null, undefined, objectRef)(node),
    ).not.toThrow();
    expect(objectRef.current).toBe(node);
  });

  it("detaches every ref with null through the returned cleanup", () => {
    const objectRef = createRef<Node>();
    const callbackRef = vi.fn();

    const cleanup = composeRefs<Node>(objectRef, callbackRef)(node);
    expect(cleanup).toBeTypeOf("function");
    (cleanup as () => void)();

    expect(objectRef.current).toBeNull();
    expect(callbackRef).toHaveBeenLastCalledWith(null);
  });

  it("calls a callback ref's own cleanup instead of detaching it with null", () => {
    const ownCleanup = vi.fn();
    const withCleanup = vi.fn(() => ownCleanup);
    const withoutCleanup = vi.fn();

    const cleanup = composeRefs<Node>(withCleanup, withoutCleanup)(node);
    (cleanup as () => void)();

    expect(ownCleanup).toHaveBeenCalledOnce();
    expect(withCleanup).toHaveBeenCalledTimes(1);
    expect(withoutCleanup).toHaveBeenLastCalledWith(null);
  });
});
