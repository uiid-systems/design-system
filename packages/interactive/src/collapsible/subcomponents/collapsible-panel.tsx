"use client";

import { Collapsible as BaseCollapsible } from "@base-ui/react/collapsible";
import { Stack } from "@uiid/layout";
import { cxState } from "@uiid/utils";

import type { CollapsiblePanelProps } from "../collapsible.types";

import styles from "../collapsible.module.css";

export const CollapsiblePanel = ({
  ay = "end",
  minh = 0,
  instant = true,
  className,
  children,
  ...props
}: CollapsiblePanelProps) => {
  return (
    <BaseCollapsible.Panel
      data-slot="collapsible-panel"
      /*
       * `ay` and `minh` are destructured rather than written on the `Stack` as
       * literals: Base UI merges the render element's own props over the
       * part's, so a literal there would beat the caller's value every time.
       * `minh` is 0 because the panel is a flex item of the root, whose
       * `min-height: auto` would stop it shrinking to 0 as it closes.
       */
      render={<Stack ay={ay} minh={minh} />}
      className={cxState(styles["collapsible-panel"], className)}
      data-instant={instant ? "" : undefined}
      {...props}
    >
      {children}
    </BaseCollapsible.Panel>
  );
};
CollapsiblePanel.displayName = "CollapsiblePanel";
