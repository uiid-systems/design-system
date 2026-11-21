"use client";

import {
  CollapsiblePanel,
  CollapsibleRoot,
  CollapsibleTrigger,
  Group,
  List,
  Text,
  type CollapsibleRootProps,
} from "@uiid/design-system";
import { ChevronRightIcon } from "@uiid/icons/chevron-right";

import { SIDEBAR_GROUP_INDENT, SIDEBAR_LIST_ITEM_SPACING } from "./constants";

import styles from "./shell.module.css";

type SidebarGroupProps = React.PropsWithChildren<
  {
    /** Names the group in saved state. Unique within the sidebar. */
    id: string;
    label: string;
    /** The group holds the current page. */
    active?: boolean;
  } & Pick<CollapsibleRootProps, "open" | "defaultOpen" | "onOpenChange">
>;

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
    // Both attributes are read by the inline script in no-flash.ts.
    <CollapsibleRoot
      data-shell-group={id}
      data-active={active ? "" : undefined}
      {...props}
    >
      {/*
       * One chevron, turned by the trigger's `data-panel-open`, rather than
       * two icons swapped in React: a CSS-driven chevron is something the
       * no-flash style can correct before hydration.
       */}
      <CollapsibleTrigger className={styles["group-trigger"]}>
        {() => (
          <Group
            data-slot="sidebar-group-label"
            ay="center"
            ax="space-between"
            py={1}
            w="full"
          >
            <Text className={styles["group-label"]} weight="bold" size={0}>
              {label}
            </Text>
            <ChevronRightIcon
              data-slot="sidebar-group-chevron"
              className={styles.chevron}
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
