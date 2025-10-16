import { Collapsible as BaseCollapsible } from "@base-ui-components/react/collapsible";
import { Stack } from "@uiid/layout";

import type { CollapsibleProps } from "./collapsible.types";
import styles from "./collapsible.module.css";

export const Collapsible = ({
  trigger,
  RootProps,
  TriggerProps,
  PanelProps,
  instant = true,
  children,
}: CollapsibleProps) => {
  return (
    <BaseCollapsible.Root render={<Stack />} {...RootProps}>
      <BaseCollapsible.Trigger {...TriggerProps}>
        {trigger}
      </BaseCollapsible.Trigger>

      <BaseCollapsible.Panel
        render={<Stack ay="end" />}
        className={styles["collapsible-panel"]}
        data-instant={instant}
        {...PanelProps}
      >
        {children}
      </BaseCollapsible.Panel>
    </BaseCollapsible.Root>
  );
};
Collapsible.displayName = "Collapsible";
