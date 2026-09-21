"use client";

import { Collapsible as BaseCollapsible } from "@base-ui/react/collapsible";
import { isValidElement } from "react";

import type { CollapsibleTriggerProps } from "../collapsible.types";

export const CollapsibleTrigger = ({
  children,
  ...props
}: CollapsibleTriggerProps) => {
  const triggerIsEl = isValidElement(children);

  /*
   * Base UI has to be told up front whether the trigger is a real <button>,
   * and errors when told wrong in either direction. An intrinsic element says
   * so by its tag. A component can't be inspected before it renders, so it is
   * taken to be a button (`Button`, the common case); pass
   * `nativeButton={false}` for one that isn't, like `Text`.
   */
  const nativeButton =
    triggerIsEl &&
    (typeof children.type !== "string" || children.type === "button");

  /*
   * The trigger travels only through `render`, never as the part's children:
   * Base UI falls back to the part's children when the render element has
   * none, so a childless element trigger would otherwise render inside itself.
   */
  return (
    <BaseCollapsible.Trigger
      data-slot="collapsible-trigger"
      nativeButton={nativeButton}
      render={
        typeof children === "function" ? (
          (renderProps, state) => (
            <span {...renderProps}>{children(state)}</span>
          )
        ) : triggerIsEl ? (
          children
        ) : (
          <span role="button" tabIndex={0}>
            {children}
          </span>
        )
      }
      {...props}
    />
  );
};
CollapsibleTrigger.displayName = "CollapsibleTrigger";
