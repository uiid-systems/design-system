"use client";

import {
  CollapsiblePanel,
  CollapsibleRoot,
  CollapsibleTrigger,
  Group,
  List,
  Text,
} from "@uiid/design-system";
import { ChevronRightIcon } from "@uiid/icons/chevron-right";

import {
  SIDEBAR_GROUP_INDENT,
  SIDEBAR_LIST_ITEM_SPACING,
} from "../sidebar.constants";
import type { SidebarGroupProps } from "../sidebar.types";

import styles from "../sidebar.module.css";

/**
 * A labelled set of sidebar items that opens and closes on its own. Leave
 * `open` unset and it runs itself; pass `open` and `onOpenChange` to drive it.
 */
export const SidebarGroup = ({
  id,
  label,
  active = false,
  children,
  ...props
}: SidebarGroupProps) => {
  return (
    // Both attributes are read by the inline script in sidebar.utils.ts.
    <CollapsibleRoot
      data-slot="sidebar-group"
      data-sidebar-group={id}
      data-active={active ? "" : undefined}
      {...props}
    >
      {/*
       * One chevron, turned by the trigger's `data-panel-open`, rather than
       * two icons swapped in React: a CSS-driven chevron is something the
       * no-flash style can correct before hydration.
       */}
      <CollapsibleTrigger className={styles["sidebar-group-trigger"]}>
        {() => (
          <Group
            data-slot="sidebar-group-label"
            ay="center"
            ax="space-between"
            py={1}
            w="full"
          >
            <Text
              className={styles["sidebar-group-label"]}
              weight="bold"
              size={0}
            >
              {label}
            </Text>
            <ChevronRightIcon
              data-slot="sidebar-group-chevron"
              className={styles["sidebar-group-chevron"]}
              size={14}
            />
          </Group>
        )}
      </CollapsibleTrigger>
      <CollapsiblePanel>
        <List
          data-slot="sidebar-group-items"
          gap={SIDEBAR_LIST_ITEM_SPACING}
          pl={SIDEBAR_GROUP_INDENT}
        >
          {children}
        </List>
      </CollapsiblePanel>
    </CollapsibleRoot>
  );
};
SidebarGroup.displayName = "SidebarGroup";
