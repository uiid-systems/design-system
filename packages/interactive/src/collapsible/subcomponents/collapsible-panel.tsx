"use client";

import { Collapsible as BaseCollapsible } from "@base-ui/react/collapsible";
import { Stack } from "@uiid/layout";
import { cx } from "@uiid/utils";

import type { CollapsiblePanelProps } from "../collapsible.types";

import styles from "../collapsible.module.css";

export const CollapsiblePanel = ({
  ay = "end",
  instant = true,
  className,
  children,
  ...props
}: CollapsiblePanelProps) => {
  return (
    <BaseCollapsible.Panel
      data-slot="collapsible-panel"
      /*
       * `ay` is destructured rather than written on the `Stack` as a literal:
       * Base UI merges the render element's own props over the part's, so a
       * literal `ay="end"` there would beat the caller's `ay` every time.
       */
      render={<Stack ay={ay} />}
      className={cx(styles["collapsible-panel"], className)}
      data-instant={instant ? "" : undefined}
      {...props}
    >
      {children}
    </BaseCollapsible.Panel>
  );
};
CollapsiblePanel.displayName = "CollapsiblePanel";
