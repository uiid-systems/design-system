import { resolveRender, type RenderProp } from "@uiid/utils";
import { isValidElement } from "react";

/**
 * Whether `render` is an element that navigates — a plain `<a href>` or a
 * router link such as Next's `<Link href>`.
 *
 * Base UI switches to non-native mode for any `render`, and `useButton` stamps
 * `role="button"` on whatever it renders in that mode. On a real link that is
 * wrong twice over: screen readers announce a button, and the link drops out of
 * their list of links. Anything with an `href` therefore skips `useButton`
 * entirely and renders as itself.
 *
 * `render` is resolved first because a server component's element can arrive
 * lazily wrapped during development SSR — see `resolveRender`.
 */
export const isLinkRender = (render: unknown): render is RenderProp => {
  const element = resolveRender(render);
  return (
    isValidElement<{ href?: unknown }>(element) && element.props.href != null
  );
};

const hasAccessibleName = (props: unknown): boolean => {
  const labels = props as
    | { "aria-label"?: unknown; "aria-labelledby"?: unknown }
    | undefined;
  return !!labels?.["aria-label"] || !!labels?.["aria-labelledby"];
};

/**
 * Whether the caller already named the button — on the Button itself or on
 * the element it renders. A tooltip only names an icon-only button that has
 * no name of its own, so neither place may already carry one.
 */
export const isNamedByCaller = (
  props: Record<string, unknown>,
  render: unknown,
): boolean => {
  const element = resolveRender(render);
  return (
    hasAccessibleName(props) ||
    (isValidElement(element) && hasAccessibleName(element.props))
  );
};
