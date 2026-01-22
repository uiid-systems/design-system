"use client";

import { Collapsible as BaseCollapsible } from "@base-ui/react/collapsible";

import { Stack } from "@uiid/layout";

import type { CollapsiblePanelProps } from "../collapsible.types";
import styles from "../collapsible.module.css";

export const CollapsiblePanel = ({
  children,
  instant = true,
  ...props
}: CollapsiblePanelProps) => {
  return (
    <BaseCollapsible.Panel
      data-slot="collapsible-panel"
      render={<Stack ay="end" />}
      className={styles["collapsible-panel"]}
      data-instant={instant}
      {...props}
    >
      {children}
    </BaseCollapsible.Panel>
  );
};
CollapsiblePanel.displayName = "CollapsiblePanel";
