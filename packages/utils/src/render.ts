import { cloneElement, isValidElement, createElement, type Ref } from "react";

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

/**
 * Composes only when both sides carry a ref. Passing a lone ref through
 * verbatim keeps its identity stable across renders, so React doesn't detach
 * and reattach it every time; a genuine collision accepts a fresh callback per
 * render. `composeRefs` rather than a hook keeps `renderWithProps` callable
 * from server components.
 */
const mergeRefs = (ours: unknown, theirs: unknown): unknown => {
  if (ours == null) return theirs;
  if (theirs == null) return ours;

  return composeRefs(ours as Ref<unknown>, theirs as Ref<unknown>);
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
  if (isValidElement(render)) {
    const theirProps = render.props as Record<string, unknown>;

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

    return cloneElement(render, {
      ...mergedProps,
      children: children ?? render.props.children,
      className: cx(render.props.className, props.className as string),
      style: {
        ...render.props.style,
        ...(props.style as React.CSSProperties),
      },
    });
  }

  return createElement(fallbackElement, props, children);
};
