import { Menu as BaseMenu } from "@base-ui/react/menu";
import { ChevronRightIcon } from "@uiid/icons/chevron-right";
import { Group } from "@uiid/layout";
import { ListItem } from "@uiid/lists";
import { cx } from "@uiid/utils";

import type { SubmenuTriggerProps } from "../menu.types";

import styles from "../menu.module.css";

export const SubmenuTrigger = ({
  gap = 4,
  ay = "center",
  ax = "space-between",
  label,
  description,
  icon,
  className,
  children,
  ...props
}: SubmenuTriggerProps) => {
  return (
    <BaseMenu.SubmenuTrigger
      data-slot="submenu-trigger"
      label={label}
      render={<Group gap={gap} ay={ay} ax={ax} />}
      className={cx(styles["submenu-trigger"], className)}
      {...props}
    >
      {/* `children` replace the row's content, not the chevron. */}
      <ListItem
        render={<div />}
        label={label}
        description={description}
        icon={icon}
      >
        {children}
      </ListItem>
      <ChevronRightIcon
        data-slot="submenu-chevron"
        className={styles["submenu-chevron"]}
        aria-hidden
      />
    </BaseMenu.SubmenuTrigger>
  );
};
SubmenuTrigger.displayName = "SubmenuTrigger";
