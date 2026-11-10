"use client";

import { renderWithProps } from "@uiid/utils";

import type { ButtonLinkProps } from "../button.types";
import { isLinkRender, swallowDisabledActivation } from "../button.utils";

/*
 * A disabled link keeps its `href`. Stripping it would break the router links
 * this branch exists for — Next's `<Link>` requires the prop — so parity with
 * a disabled button comes from the ARIA state and a swallowed activation
 * instead. `composes-disabled` already matches `[aria-disabled="true"]` and
 * kills pointer events, and an anchor dispatches a click for Enter, so the one
 * handler covers both. A focused anchor still opens its keyboard context menu
 * (Shift+F10), whose "Open link in new tab" entry navigates without ever
 * firing a click, so that is cancelled too.
 */
const DISABLED_LINK_PROPS = {
  "aria-disabled": true,
  "data-disabled": "",
  onClick: swallowDisabledActivation,
  onContextMenu: (event: React.SyntheticEvent) => event.preventDefault(),
};

/**
 * The link branch of `Button`: the button's styling on an element that keeps
 * its own semantics. Receives the classes already resolved, so it only has to
 * strip the props that exist for Base UI's sake and hand the rest to the
 * element the caller passed.
 */
export const ButtonLink = ({
  render,
  className,
  children,
  disabled,
  onClick,
  nativeButton: _nativeButton,
  focusableWhenDisabled,
  ...props
}: ButtonLinkProps) => {
  return renderWithProps({
    render: isLinkRender(render) ? render : undefined,
    children,
    fallbackElement: "a",
    props: {
      ...props,
      "data-slot": "button",
      className,
      // Like a disabled button, a disabled link stays a tab stop unless the
      // caller opts out with `focusableWhenDisabled={false}`.
      ...(disabled ? DISABLED_LINK_PROPS : { onClick }),
      ...(disabled && focusableWhenDisabled === false ? { tabIndex: -1 } : {}),
    },
  });
};
ButtonLink.displayName = "ButtonLink";
