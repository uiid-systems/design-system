import { cx } from "@uiid/utils";

import { Box } from "../box/box";

import type { GroupProps } from "./group.types";
import styles from "./group.module.css";

export const Group = ({ className, ...props }: GroupProps) => {
  return (
    <Box uiid="group" className={cx(styles.group, className)} {...props} />
  );
};
Group.displayName = "Group";
