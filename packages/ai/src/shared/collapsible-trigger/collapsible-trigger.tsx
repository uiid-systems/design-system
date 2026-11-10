"use client";

import { ChevronDownIcon } from "@uiid/icons/chevron-down";
import { CollapsibleTrigger as Trigger } from "@uiid/interactive";
import { Group } from "@uiid/layout";
import { cx } from "@uiid/utils";

import type { CollapsibleTriggerProps } from "./collapsible-trigger.types";

import styles from "./collapsible-trigger.module.css";

/**
 * The disclosure row Reasoning and Tool share: a `Group` that Base UI makes the
 * trigger of the enclosing `CollapsibleRoot`, with a chevron after the caller's
 * content that turns while the panel is open. Each component adds its own hover
 * look on top through `className`.
 */
export const CollapsibleTrigger = ({
  gap = 2,
  ay = "center",
  className,
  children,
  ...props
}: CollapsibleTriggerProps) => (
  <Trigger
    nativeButton={false}
    render={
      <Group
        gap={gap}
        ay={ay}
        className={cx(styles["trigger"], className)}
        {...props}
      />
    }
  >
    {children}
    <ChevronDownIcon className={styles["chevron"]} />
  </Trigger>
);
CollapsibleTrigger.displayName = "CollapsibleTrigger";
