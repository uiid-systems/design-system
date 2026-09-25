import {
  Children,
  cloneElement,
  isValidElement,
  createElement,
  type Ref,
} from "react";

import { composeRefs } from "./compose-refs";
import { cx } from "./cva";

export type RenderProp = React.ReactElement<
  React.PropsWithChildren<{
    className?: string;
    style?: React.CSSProperties;
    ref?: Ref<unknown>;
  }>
>;

export type RenderWithPropsOptions = {
  render?: RenderProp;
  children?: React.ReactNode;
  props: Record<string, unknown>;
  fallbackElement?: keyof React.JSX.IntrinsicElements;
};

type EventHandler = (...args: unknown[]) => unknown;

const REACT_LAZY_TYPE = Symbol.for("react.lazy");

const isLazyNode = (node: unknown): boolean =>
  typeof node === "object" &&
  node !== null &&
  (node as { $$typeof?: unknown }).$$typeof === REACT_LAZY_TYPE;

/**
 * Unwraps a `render` element that arrives wrapped in a lazy node.
 *
 * An element a server component passes to a client one, such as
 * `render={<Link href="/x" />}`, can reach server rendering in development as a
 * lazy reference instead of an element. `isValidElement` rejects it there, so
 * the server takes a fallback branch while the browser, which gets the plain
 * element, takes the real one, and the two disagree at hydration.
 *
 * `Children.toArray` unwraps lazy nodes the way React does when it renders one:
 * a pending payload throws its thenable and suspends, and a rejected one throws
 * its error, so both behave as they would have without this. Base UI's
 * `useRender` uses the same workaround. Delete it once
 * https://github.com/facebook/react/issues/32392 is fixed.
 */
export const resolveRender = <T>(render: T): T =>
  isLazyNode(render)
    ? (Children.toArray(render as React.ReactNode)[0] as T)
    : render;

/** Matches `onClick`, `onKeyDown`, … but not `on`, `once`, or `onward`. */
const isEventHandlerKey = (key: string): boolean =>
  key.length > 2 && key.startsWith("on") && key[2] >= "A" && key[2] <= "Z";

/**
 * Runs both handlers rather than letting one overwrite the other, the
 * component's first so it can veto the render target's by calling
 * `preventDefault()`. That ordering is what lets a component swallow an
 * interaction it owns — a disabled element's activation, say — without having
 * to strip a handler the caller put on the element they passed to `render`.
 */
const chainEventHandlers = (ours: unknown, theirs: unknown): unknown => {
  if (typeof ours !== "function") return theirs;
  if (typeof theirs !== "function") return ours;

  return (...args: unknown[]) => {
    (ours as EventHandler)(...args);

    const event = args[0];
    const vetoed =
      typeof event === "object" &&
      event !== null &&
      "defaultPrevented" in event &&
      (event as { defaultPrevented: unknown }).defaultPrevented === true;

    if (vetoed) return undefined;

    return (theirs as EventHandler)(...args);
  };
};

/** Composed callbacks, keyed by our ref and then theirs. */
const composedRefCache = new WeakMap<object, WeakMap<object, Ref<unknown>>>();

/** Refs are objects or callbacks, both of which can key a `WeakMap`. */
const isRefKey = (ref: unknown): ref is object =>
  (typeof ref === "object" && ref !== null) || typeof ref === "function";

/**
 * Composes only when both sides carry a ref, and hands back the same callback
 * for the same pair of refs. React treats a new ref identity as a detach plus
 * an attach, so a fresh callback per render would call both refs with `null`
 * and then the node on every render — and a callback ref that stores a new
 * object each call would re-render forever. A `WeakMap` rather than a hook
 * keeps `renderWithProps` callable from server components, and lets the pair
 * be collected once neither ref is referenced elsewhere.
 */
const mergeRefs = (ours: unknown, theirs: unknown): unknown => {
  if (ours == null) return theirs;
  if (theirs == null) return ours;
  if (!isRefKey(ours) || !isRefKey(theirs)) return theirs;

  let byTheirs = composedRefCache.get(ours);
  if (!byTheirs) {
    byTheirs = new WeakMap();
    composedRefCache.set(ours, byTheirs);
  }

  let composed = byTheirs.get(theirs);
  if (!composed) {
    composed = composeRefs(ours as Ref<unknown>, theirs as Ref<unknown>);
    byTheirs.set(theirs, composed);
  }

  return composed;
};

/**
 * Utility function to handle render prop logic with prop merging, className merging, and style merging.
 * This abstracts the common pattern of cloning elements with merged props.
 *
 * Event handlers present on both sides are chained rather than overwritten —
 * see {@link chainEventHandlers} — and refs are composed, since `cloneElement`
 * would otherwise replace the render element's ref with ours. Both match what
 * `@radix-ui/react-slot` provides upstream. Everything else follows
 * `cloneElement`: `props` wins over the render element's own, with `className`
 * concatenated and `style` merged.
 */
export const renderWithProps = ({
  render,
  children,
  props,
  fallbackElement = "div",
}: RenderWithPropsOptions): React.ReactElement => {
  const element = resolveRender(render);

  if (isValidElement(element)) {
    const theirProps = element.props as Record<string, unknown>;

    // Only handler keys and `ref` need special treatment. Keys the render
    // element owns alone already survive `cloneElement`; keys we own alone come
    // from the spread. This also stops an explicitly-undefined handler or ref in
    // `props` from clobbering a real one on the render element.
    const mergedProps: Record<string, unknown> = { ...props };
    for (const key of Object.keys(theirProps)) {
      if (key === "ref") {
        mergedProps.ref = mergeRefs(props.ref, theirProps.ref);
      } else if (isEventHandlerKey(key)) {
        mergedProps[key] = chainEventHandlers(props[key], theirProps[key]);
      }
    }

    return cloneElement(element, {
      ...mergedProps,
      children: children ?? element.props.children,
      className: cx(element.props.className, props.className as string),
      style: {
        ...element.props.style,
        ...(props.style as React.CSSProperties),
      },
    });
  }

  return createElement(fallbackElement, props, children);
};
