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
