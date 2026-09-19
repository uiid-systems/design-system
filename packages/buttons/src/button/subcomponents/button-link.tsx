"use client";

import { renderWithProps } from "@uiid/utils";

import type { ButtonLinkProps } from "../button.types";
import { isLinkRender } from "../button.utils";

const preventNavigation = (event: React.MouseEvent) => event.preventDefault();

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
  focusableWhenDisabled: _focusableWhenDisabled,
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
      /*
       * A disabled link keeps its `href`. Stripping it would break the router
       * links this branch exists for — Next's `<Link>` requires the prop — so
       * parity with a disabled button comes from leaving the tab order and
       * swallowing activation instead. `composes-disabled` already matches
       * `[aria-disabled="true"]` and kills pointer events, and an anchor
       * dispatches a click for Enter, so the one handler covers both.
       */
      ...(disabled
        ? {
            "aria-disabled": true,
            "data-disabled": "",
            tabIndex: -1,
            onClick: preventNavigation,
          }
        : { onClick }),
    },
  });
};
ButtonLink.displayName = "ButtonLink";
